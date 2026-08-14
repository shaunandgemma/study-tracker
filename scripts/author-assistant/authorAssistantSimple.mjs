import { randomUUID, createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { validateAuthorPlanning } from '../../src/features/followAlongAuthor/authorPlanning.js';
import { isDeferredAuthorContent, validateAuthorContent } from '../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../../src/features/followAlongAuthor/authorReview.js';
import { formatOpenAiRequestError, OPENAI_RESPONSES_URL, DEFAULT_AUTHOR_ASSISTANT_MODEL } from './authorAssistantResearch.mjs';
import { fingerprintJson } from './authorAssistantStage84D.mjs';
import { buildStage90ALocalAcceptance } from './authorAssistantStage90A.mjs';
import {
  findBeginnerQualityFindings,
  findReviewableProposalFindings
} from './authorAssistantBeginnerQuality.mjs';

export const SIMPLE_AUTHOR_ASSISTANT_KIND = 'author_assistant_complete_generation';
export const SIMPLE_AUTHOR_ASSISTANT_ALLOWED_DOMAIN = 'docs.aws.amazon.com';
export const SIMPLE_AUTHOR_ASSISTANT_MODE = Object.freeze({ NEW: 'new_follow_along', UPDATE: 'update_existing' });

const PROGRAMME_DIFFICULTIES = ['Beginner', 'Beginner to Intermediate', 'Intermediate', 'Intermediate to Advanced', 'Advanced'];
const TASK_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const REGION_SCOPES = ['regional', 'global', 'mixed'];

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function optionalMinutes(value) {
  if (value === null || value === undefined || value === '') return null;
  const minutes = Number(value);
  return Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : null;
}

function slugify(value, maximum = 70) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, maximum);
}

function officialAwsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === SIMPLE_AUTHOR_ASSISTANT_ALLOWED_DOMAIN || url.hostname.endsWith(`.${SIMPLE_AUTHOR_ASSISTANT_ALLOWED_DOMAIN}`));
  } catch {
    return false;
  }
}

function normalizedUrl(value) {
  const url = new URL(value);
  url.hash = '';
  return url.toString().replace(/\/$/, '');
}

function valueSchema(sourceUrls = null) {
  return sourceUrls ? { type: 'string', enum: sourceUrls } : { type: 'string' };
}

export function buildCompleteGenerationSchema(sourceUrls = null) {
  const sourceUrl = valueSchema(sourceUrls);
  const sourceUrlsArray = { type: 'array', minItems: 1, items: sourceUrl };
  const jsonBlock = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      sourceUrls: sourceUrlsArray
    },
    required: ['title', 'content', 'sourceUrls'],
    additionalProperties: false
  };
  const consoleStep = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      instructions: { type: 'array', minItems: 1, items: { type: 'string' } },
      jsonBlocks: { type: 'array', items: jsonBlock },
      expectedResult: { type: 'string' },
      warning: { type: 'string' },
      sourceUrls: sourceUrlsArray
    },
    required: ['title', 'instructions', 'jsonBlocks', 'expectedResult', 'warning', 'sourceUrls'],
    additionalProperties: false
  };
  const cliStep = {
    type: 'object',
    properties: {
      command: { type: 'string' },
      explanation: { type: 'string' },
      expectedResult: { type: 'string' },
      warning: { type: 'string' },
      sourceUrls: sourceUrlsArray
    },
    required: ['command', 'explanation', 'expectedResult', 'warning', 'sourceUrls'],
    additionalProperties: false
  };
  return {
    type: 'object',
    properties: {
      programme: {
        type: 'object',
        properties: {
          displayName: { type: 'string' }, subtitle: { type: 'string' }, category: { type: 'string' },
          description: { type: 'string' }, learningOutcome: { type: 'string' },
          difficulty: { type: 'string', enum: PROGRAMME_DIFFICULTIES },
          regionScope: { type: 'string', enum: REGION_SCOPES }, estimatedMinutes: { type: ['integer', 'null'] }
        },
        required: ['displayName', 'subtitle', 'category', 'description', 'learningOutcome', 'difficulty', 'regionScope', 'estimatedMinutes'],
        additionalProperties: false
      },
      sources: {
        type: 'array', minItems: 3, maxItems: 20,
        items: {
          type: 'object',
          properties: { title: { type: 'string' }, url: sourceUrl, purpose: { type: 'string' } },
          required: ['title', 'url', 'purpose'], additionalProperties: false
        }
      },
      phases: {
        type: 'array', minItems: 4,
        items: {
          type: 'object',
          properties: { title: { type: 'string' }, description: { type: 'string' }, isOptional: { type: 'boolean' } },
          required: ['title', 'description', 'isOptional'], additionalProperties: false
        }
      },
      resourceInventory: {
        type: 'array', minItems: 1,
        items: {
          type: 'object',
          properties: {
            resourceKey: { type: 'string' }, resourceType: { type: 'string' }, resourceNameOrPlaceholder: { type: 'string' },
            createdByTaskNumber: { type: 'integer' }, dependsOnResourceKeys: { type: 'array', items: { type: 'string' } }
          },
          required: ['resourceKey', 'resourceType', 'resourceNameOrPlaceholder', 'createdByTaskNumber', 'dependsOnResourceKeys'],
          additionalProperties: false
        }
      },
      tasks: {
        type: 'array', minItems: 3,
        items: {
          type: 'object',
          properties: {
            phaseNumber: { type: 'integer' }, title: { type: 'string' }, feature: { type: 'string' }, goal: { type: 'string' },
            whyItMatters: { type: 'string' }, difficulty: { type: 'string', enum: TASK_DIFFICULTIES },
            estimatedMinutes: { type: ['integer', 'null'] }, isOptional: { type: 'boolean' },
            prerequisiteTaskNumbers: { type: 'array', items: { type: 'integer' } }, sourceUrls: sourceUrlsArray,
            createdResourceKeys: { type: 'array', items: { type: 'string' } },
            consoleSteps: { type: 'array', minItems: 1, items: consoleStep },
            cliSteps: { type: 'array', minItems: 1, items: cliStep },
            verification: {
              type: 'array', minItems: 1,
              items: {
                type: 'object',
                properties: { title: { type: 'string' }, instruction: { type: 'string' }, expectedResult: { type: 'string' }, mode: { type: 'string', enum: ['console', 'cli', 'either'] } },
                required: ['title', 'instruction', 'expectedResult', 'mode'], additionalProperties: false
              }
            },
            cleanup: {
              type: 'array',
              items: {
                type: 'object',
                properties: { title: { type: 'string' }, instruction: { type: 'string' }, verification: { type: 'string' }, sourceUrls: sourceUrlsArray },
                required: ['title', 'instruction', 'verification', 'sourceUrls'], additionalProperties: false
              }
            }
          },
          required: ['phaseNumber', 'title', 'feature', 'goal', 'whyItMatters', 'difficulty', 'estimatedMinutes', 'isOptional', 'prerequisiteTaskNumbers', 'sourceUrls', 'createdResourceKeys', 'consoleSteps', 'cliSteps', 'verification', 'cleanup'],
          additionalProperties: false
        }
      },
      finalCleanup: {
        type: 'array', minItems: 1,
        items: {
          type: 'object',
          properties: {
            resourceKey: { type: 'string' }, title: { type: 'string' },
            consoleInstructions: { type: 'array', minItems: 1, items: { type: 'string' } },
            cliCommands: { type: 'array', minItems: 1, items: { type: 'string' } },
            verification: { type: 'string' }, sourceUrls: sourceUrlsArray
          },
          required: ['resourceKey', 'title', 'consoleInstructions', 'cliCommands', 'verification', 'sourceUrls'], additionalProperties: false
        }
      },
      warnings: {
        type: 'object',
        properties: { cost: { type: 'string' }, safety: { type: 'string' }, credentials: { type: 'string' }, region: { type: 'string' } },
        required: ['cost', 'safety', 'credentials', 'region'], additionalProperties: false
      },
      manualReviewFindings: { type: 'array', items: { type: 'string' } }
    },
    required: ['programme', 'sources', 'phases', 'resourceInventory', 'tasks', 'finalCleanup', 'warnings', 'manualReviewFindings'],
    additionalProperties: false
  };
}

export function buildCompleteGenerationPayload(inputs, { model = DEFAULT_AUTHOR_ASSISTANT_MODEL, sourceUrls = null, qualityReference = null } = {}) {
  const protectedList = sourceUrls ? `Use only these protected source URLs:\n${JSON.stringify(sourceUrls)}` : '';
  const updateTarget = inputs.generationMode === SIMPLE_AUTHOR_ASSISTANT_MODE.UPDATE ? inputs.updateTarget : null;
  return {
    model,
    store: false,
    reasoning: { effort: 'medium' },
    tools: sourceUrls ? undefined : [{ type: 'web_search', filters: { allowed_domains: [SIMPLE_AUTHOR_ASSISTANT_ALLOWED_DOMAIN] } }],
    tool_choice: sourceUrls ? undefined : 'auto',
    include: sourceUrls ? undefined : ['web_search_call.action.sources'],
    instructions: [
      'Create one complete AWS Follow Along modelled on a short, beginner-friendly VPC-style learner journey.',
      'Treat the supplied RDS gold standard as the minimum writing depth for beginners. Use it only for style and completeness; never copy its RDS resources, permissions, names or architecture into another service.',
      'Assume there is no existing learner infrastructure. Create every required VPC, subnet, security group, IAM identity, role, policy, service resource and integration before a later instruction refers to it, unless the requested scope explicitly says otherwise.',
      'For the Console path, tell the learner how to reach the service from the AWS Console, then give the exact visible menu, button, tab, field and value. Never use vague shortcuts such as Open Subnets, configure as needed, choose a suitable resource, or select an existing resource.',
      'When a value must be recorded, identify the exact page, section or response field where it is shown and the placeholder name used later.',
      'There is no fixed maximum number of phases or tasks. Use as many as the requested learner scope genuinely requires, without compressing separate labs merely to meet an arbitrary count.',
      'Use at least four phases. There is no fixed maximum for Console steps, checkbox instructions, CLI steps, verification checks, task cleanup steps, or final programme cleanup steps; use however many the learner journey genuinely requires.',
      'Use only official AWS documentation returned by the protected search. Never invent URLs, Console labels, commands, permissions, or expected results.',
      'Prepare both AWS Console checkbox instructions and separate AWS CLI commands for every task.',
      'Each checkbox must contain one short action. Each CLI item must contain exactly one command and must never chain commands.',
      'Programme and task durations are optional. Use null when no useful estimate exists; never invent a duration just to fill the field.',
      'Never return catalogue-only, placeholder, deferred, future, TBD, TODO, or coming-soon Console or CLI content. Every Console checkbox and CLI command must be usable now.',
      'Use harmless fixed test names and non-confidential sample data.',
      'Do not execute anything. Cleanup must be manual, narrowly identify only resources created by this Follow Along, and appear after verification.',
      'Build resourceInventory while writing the Follow Along. Every AWS resource created by either route must have one stable resourceKey, its exact fixed name or recorded placeholder, the task that creates it, and the resource keys it depends on. Each task createdResourceKeys must list exactly the inventory resources that task creates.',
      'The final Delete stage must contain exactly one finalCleanup entry for every resourceInventory key. Do not omit secondary resources such as listeners, listener rules, target groups, alarms, snapshots, access keys, policies, policy attachments, roles, instance profiles, Elastic IPs, NAT gateways, route-table associations, routes, security-group rules, subnet groups, log groups, event mappings or local CLI profiles when the Follow Along creates them.',
      'Order finalCleanup in strict reverse dependency order: remove associations, registrations and child resources before their parents; stop or delete service resources before networking; release addresses only after gateways; delete security groups before subnets and the VPC; remove IAM attachments and access keys before policies, roles and users. Never delete a shared, default, pre-existing or learner-owned resource that the Follow Along did not create.',
      'Every finalCleanup entry must include short one-action Console instructions, separate one-command CLI commands, and a visible verification that the exact named resource is gone. Include wait commands where AWS requires deletion to finish before its dependencies can be removed.',
      'Keep Console steps and CLI commands separate. Add --region where the service operation is regional.',
      'Use placeholders only where output from an earlier command is genuinely required, and explain that dependency plainly.',
      'Every source URL must be copied exactly from protected results and every task, step, command, and cleanup action must cite supporting source URLs.',
      'When a learner needs structured JSON, place it in a Console-step jsonBlocks entry instead of flattening it into prose. IAM policy JSON is allowed when requested and supported by official AWS documentation. Explain why its actions and resources are required and use least privilege where practical.',
      'Return strict parseable JSON in jsonBlocks whenever possible and do not wrap it in Markdown fences. If an AWS example genuinely needs illustrative placeholders or JSON-like syntax, preserve the useful example; the Author will mark it for human review instead of discarding the complete generation.',
      'Never include real access key IDs, secret access keys, session tokens, passwords, private keys, or other credential values. Use clearly named placeholders where a learner-specific value is required.',
      'Put any uncertainty in manualReviewFindings rather than guessing.',
      updateTarget ? 'Revise the supplied existing Follow Along. Preserve its exact AWS service identity and programme identity while applying the requested update. Return a complete replacement package, not a partial patch.' : '',
      qualityReference ? `RDS COMPLETE CONSOLE AND CLI GOLD STANDARD REFERENCE:\n${JSON.stringify(qualityReference)}` : '',
      protectedList
    ].filter(Boolean).join(' '),
    input: [
      `Official AWS service name: ${inputs.serviceName}`,
      `Short service name: ${inputs.shortName}`,
      `Learner level: ${inputs.learnerLevel}`,
      `Learner outcome: ${inputs.buildOutcome}`,
      `Preferred AWS Region: ${inputs.preferredRegion}`
      , ...(updateTarget ? [
        `Operation: Update existing Follow Along`,
        `Exact target programme ID: ${updateTarget.programmeId}`,
        `Exact target display name: ${updateTarget.displayName}`,
        `Published source revision: ${updateTarget.sourceRevision}`,
        `Requested update: ${inputs.updateRequest || inputs.buildOutcome}`,
        `Existing published content:\n${JSON.stringify(updateTarget.runtimeContent)}`
      ] : [])
    ].join('\n'),
    text: { format: { type: 'json_schema', name: 'complete_aws_follow_along', strict: true, schema: buildCompleteGenerationSchema(sourceUrls) } }
  };
}

function outputText(response) {
  for (const item of response?.output || []) {
    if (item?.type !== 'message') continue;
    for (const part of item.content || []) if (part?.type === 'output_text' && clean(part.text)) return part.text;
  }
  throw new Error('The AI response did not contain a complete Follow Along.');
}

function protectedSources(response) {
  const found = [];
  for (const item of response?.output || []) {
    if (item?.type === 'web_search_call') found.push(...(item.action?.sources || []));
    if (item?.type === 'message') for (const part of item.content || []) for (const annotation of part?.annotations || []) {
      if (annotation?.type === 'url_citation') found.push({ title: annotation.title, url: annotation.url });
    }
  }
  return [...new Map(found.filter(item => officialAwsUrl(item?.url)).map(item => [normalizedUrl(item.url), { title: clean(item.title), url: normalizedUrl(item.url) }])).values()];
}

async function request(payload, apiKey, fetchImpl) {
  const response = await fetchImpl(OPENAI_RESPONSES_URL, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response?.ok) {
    let apiError = {};
    try { apiError = (await response.json())?.error || {}; } catch { /* safe fallback below */ }
    throw new Error(formatOpenAiRequestError(response?.status, apiError));
  }
  return response.json();
}

function parseProposal(response) {
  try { return JSON.parse(outputText(response)); }
  catch (error) { if (error instanceof SyntaxError) throw new Error('The generated Follow Along was not valid structured JSON.'); throw error; }
}

function allCitedUrls(proposal) {
  return [
    ...(proposal.sources || []).map(item => item.url),
    ...(proposal.tasks || []).flatMap(task => [
      task.sourceUrls,
      ...(task.consoleSteps || []).map(step => step.sourceUrls),
      ...(task.consoleSteps || []).flatMap(step => (step.jsonBlocks || []).map(block => block.sourceUrls)),
      ...(task.cliSteps || []).map(step => step.sourceUrls),
      ...(task.cleanup || []).map(step => step.sourceUrls)
    ]).flat(),
    ...(proposal.finalCleanup || []).flatMap(step => step.sourceUrls)
  ];
}

export function reconcileProtectedSourceList(proposal, returnedSources) {
  const reconciled = structuredClone(proposal);
  const returnedByUrl = new Map((returnedSources || []).map(source => [normalizedUrl(source.url), source]));
  const listed = new Set();
  reconciled.sources = (reconciled.sources || []).filter(source => {
    if (!officialAwsUrl(source?.url)) return true;
    const url = normalizedUrl(source.url);
    if (listed.has(url)) return false;
    listed.add(url);
    source.url = url;
    return true;
  });
  for (const citedUrl of allCitedUrls(reconciled)) {
    if (!officialAwsUrl(citedUrl)) continue;
    const url = normalizedUrl(citedUrl);
    const protectedSource = returnedByUrl.get(url);
    if (!protectedSource || listed.has(url)) continue;
    reconciled.sources.push({
      title: clean(protectedSource.title) || 'Official AWS documentation',
      url,
      purpose: 'Supports the generated Follow Along content that cites this official AWS documentation page.'
    });
    listed.add(url);
  }
  return reconciled;
}

export function findCleanupCoverageFindings(proposal) {
  const findings = [];
  const inventory = Array.isArray(proposal?.resourceInventory) ? proposal.resourceInventory : [];
  const cleanup = Array.isArray(proposal?.finalCleanup) ? proposal.finalCleanup : [];
  const tasks = Array.isArray(proposal?.tasks) ? proposal.tasks : [];
  if (!inventory.length) return ['The Follow Along has no resource inventory for final teardown.'];
  const inventoryKeys = inventory.map(item => clean(item.resourceKey));
  if (inventoryKeys.some(key => !key) || new Set(inventoryKeys).size !== inventoryKeys.length) findings.push('Resource inventory keys must be non-empty and unique.');
  const inventorySet = new Set(inventoryKeys);
  const declaredByTasks = tasks.flatMap((task, taskIndex) => (task.createdResourceKeys || []).map(resourceKey => ({ resourceKey: clean(resourceKey), taskNumber: taskIndex + 1 })));
  for (const item of inventory) {
    const key = clean(item.resourceKey);
    if (!clean(item.resourceType) || !clean(item.resourceNameOrPlaceholder)) findings.push(`Resource ${key || '(missing key)'} is missing its type or exact name/placeholder.`);
    if (!Number.isInteger(item.createdByTaskNumber) || item.createdByTaskNumber < 1 || item.createdByTaskNumber > tasks.length) findings.push(`Resource ${key || '(missing key)'} has an invalid creation task.`);
    const declarations = declaredByTasks.filter(entry => entry.resourceKey === key);
    if (declarations.length !== 1 || declarations[0]?.taskNumber !== item.createdByTaskNumber) findings.push(`Resource ${key || '(missing key)'} must be declared by exactly its recorded creation task.`);
    for (const dependency of item.dependsOnResourceKeys || []) {
      if (!inventorySet.has(clean(dependency)) || clean(dependency) === key) findings.push(`Resource ${key || '(missing key)'} has an invalid dependency ${clean(dependency) || '(missing key)'}.`);
    }
  }
  for (const declaration of declaredByTasks) if (!inventorySet.has(declaration.resourceKey)) findings.push(`Task ${declaration.taskNumber} declares unknown created resource ${declaration.resourceKey || '(missing key)'}.`);
  const cleanupKeys = cleanup.map(item => clean(item.resourceKey));
  for (const key of inventoryKeys) if (cleanupKeys.filter(item => item === key).length !== 1) findings.push(`Resource ${key} must have exactly one final cleanup entry.`);
  for (const key of cleanupKeys) if (!inventorySet.has(key)) findings.push(`Final cleanup refers to unknown resource ${key || '(missing key)'}.`);
  for (const item of inventory) {
    const cleanupItem = cleanup.find(entry => clean(entry.resourceKey) === clean(item.resourceKey));
    const exactTarget = clean(item.resourceNameOrPlaceholder);
    const cleanupText = cleanupItem ? [cleanupItem.title, ...(cleanupItem.consoleInstructions || []), ...(cleanupItem.cliCommands || []), cleanupItem.verification].join(' ') : '';
    if (cleanupItem && exactTarget && !cleanupText.includes(exactTarget)) findings.push(`Cleanup for resource ${item.resourceKey} does not name its exact target ${exactTarget}.`);
  }
  cleanup.forEach((item, index) => {
    if (!clean(item.title) || !clean(item.verification) || !(item.consoleInstructions || []).length || (item.consoleInstructions || []).some(instruction => !clean(instruction))) findings.push(`Final cleanup item ${index + 1} has incomplete Console teardown or verification.`);
    if (!(item.cliCommands || []).length || (item.cliCommands || []).some(command => !clean(command))) findings.push(`Final cleanup item ${index + 1} has no complete CLI teardown command.`);
    if ((item.cliCommands || []).some(command => /\s(?:&&|;|\|)\s/.test(clean(command)))) findings.push(`Final cleanup item ${index + 1} contains command chaining instead of separate CLI commands.`);
  });
  const cleanupPosition = new Map(cleanupKeys.map((key, index) => [key, index]));
  for (const item of inventory) for (const dependency of item.dependsOnResourceKeys || []) {
    const childPosition = cleanupPosition.get(clean(item.resourceKey));
    const parentPosition = cleanupPosition.get(clean(dependency));
    if (Number.isInteger(childPosition) && Number.isInteger(parentPosition) && childPosition >= parentPosition) findings.push(`Resource ${item.resourceKey} must be removed before dependency ${dependency}.`);
  }
  return [...new Set(findings)];
}

export function validateCompleteProposal(proposal, returnedSources, { allowReviewableQuality = false } = {}) {
  const allowed = new Set((returnedSources || []).map(item => normalizedUrl(item.url)));
  if (!proposal?.tasks?.length || !proposal?.phases?.length || !proposal?.sources?.length) throw new Error('The complete Follow Along is missing phases, tasks, or sources.');
  if (proposal.phases.length < 4) throw new Error('The complete Follow Along must contain at least four phases.');
  if (proposal.tasks.length < 3) throw new Error('The complete Follow Along must contain at least three tasks.');
  const cleanupFindings = findCleanupCoverageFindings(proposal);
  if (cleanupFindings.length && !allowReviewableQuality) throw new Error(`The final Delete stage is incomplete or out of order. ${cleanupFindings.slice(0, 4).join(' ')}`);
  const sourceUrls = proposal.sources.map(item => normalizedUrl(item.url));
  if (new Set(sourceUrls).size !== sourceUrls.length) throw new Error('The complete Follow Along contains duplicate AWS sources.');
  for (const url of allCitedUrls(proposal)) {
    if (!officialAwsUrl(url) || !allowed.has(normalizedUrl(url))) throw new Error('A Follow Along source was not returned by the protected AWS Docs search.');
    if (!sourceUrls.includes(normalizedUrl(url))) throw new Error('A cited AWS source is missing from the source list.');
  }
  if (proposal.tasks.some(task => !task.consoleSteps?.length || !task.cliSteps?.length)) throw new Error('Every task must contain both Console and CLI guidance.');
  proposal.tasks.forEach((task, taskIndex) => {
    task.consoleSteps.forEach((step, stepIndex) => {
      const instructions = Array.isArray(step.instructions) ? step.instructions : [];
      const jsonBlocks = Array.isArray(step.jsonBlocks) ? step.jsonBlocks : [];
      if (!clean(step.title) || !clean(step.expectedResult) || !instructions.length || instructions.some(item => !clean(item))) throw new Error(`Task ${taskIndex + 1} Console step ${stepIndex + 1} is incomplete.`);
      if ([step.title, step.expectedResult, ...instructions].some(isDeferredAuthorContent)) throw new Error(`Task ${taskIndex + 1} Console step ${stepIndex + 1} contains placeholder or deferred content.`);
      jsonBlocks.forEach((block, blockIndex) => {
        if (!clean(block?.title) || !clean(block?.content)) throw new Error(`Task ${taskIndex + 1} Console step ${stepIndex + 1} JSON block ${blockIndex + 1} is incomplete.`);
      });
    });
    task.cliSteps.forEach((step, stepIndex) => {
      if (!clean(step.command) || !clean(step.explanation) || !clean(step.expectedResult)) throw new Error(`Task ${taskIndex + 1} CLI step ${stepIndex + 1} is incomplete.`);
      if ([step.command, step.explanation, step.expectedResult].some(isDeferredAuthorContent)) throw new Error(`Task ${taskIndex + 1} CLI step ${stepIndex + 1} contains placeholder or deferred content.`);
    });
  });
  if (!allowReviewableQuality && proposal.tasks.some(task => task.cliSteps.some(step => /\s(?:&&|;|\|)\s/.test(step.command)))) throw new Error('A CLI command contains command chaining.');
  if (/AKIA[0-9A-Z]{12,}|aws_secret_access_key\s*=|aws_session_token\s*=|-----BEGIN [A-Z ]*PRIVATE KEY-----/i.test(JSON.stringify(proposal))) throw new Error('Credential-like content was rejected.');
  proposal.tasks.forEach((task, index) => {
    if (!Number.isInteger(task.phaseNumber) || task.phaseNumber < 1 || task.phaseNumber > proposal.phases.length) throw new Error(`Task ${index + 1} has an invalid phase.`);
    if (task.prerequisiteTaskNumbers.some(number => !Number.isInteger(number) || number < 1 || number > index)) throw new Error(`Task ${index + 1} has an invalid prerequisite.`);
  });
  return proposal;
}

export function repairReviewablePrerequisites(proposal) {
  const repaired = structuredClone(proposal);
  const findings = [];
  (repaired.tasks || []).forEach((task, index) => {
    const taskNumber = index + 1;
    const supplied = Array.isArray(task.prerequisiteTaskNumbers) ? task.prerequisiteTaskNumbers : [];
    const valid = [...new Set(supplied.filter(number => Number.isInteger(number) && number >= 1 && number < taskNumber))];
    const invalid = supplied.filter(number => !Number.isInteger(number) || number < 1 || number >= taskNumber);
    task.prerequisiteTaskNumbers = valid;
    if (invalid.length) {
      findings.push(`Task ${taskNumber} contained impossible prerequisite number(s): ${invalid.map(value => JSON.stringify(value)).join(', ')}. They were removed; review this task's dependencies manually in Author before candidate creation.`);
    }
  });
  repaired.manualReviewFindings = [...(repaired.manualReviewFindings || []), ...findings];
  return repaired;
}

export async function requestCompleteFollowAlong({ inputs, apiKey, qualityReference, model = DEFAULT_AUTHOR_ASSISTANT_MODEL, fetchImpl = globalThis.fetch, onProgress = () => {} } = {}) {
  if (!clean(apiKey)) throw new Error('OPENAI_API_KEY is not configured. No AI request was made.');
  if (!qualityReference) throw new Error('The RDS beginner gold-standard reference is required. No AI request was made.');
  const firstResponse = await request(buildCompleteGenerationPayload(inputs, { model, qualityReference }), apiKey, fetchImpl);
  const returned = protectedSources(firstResponse);
  if (returned.length < 3) throw new Error('Protected AWS Docs search returned fewer than three usable official sources.');
  onProgress(`Initial generation completed with ${returned.length} protected AWS source(s).`);
  let proposal = repairReviewablePrerequisites(reconcileProtectedSourceList(parseProposal(firstResponse), returned));
  try { validateCompleteProposal(proposal, returned, { allowReviewableQuality: true }); }
  catch (error) {
    if (!/source was not returned|cited AWS source|duplicate AWS sources/i.test(error.message)) throw error;
    const correctionResponse = await request(buildCompleteGenerationPayload(inputs, { model, sourceUrls: returned.map(item => item.url), qualityReference }), apiKey, fetchImpl);
    proposal = repairReviewablePrerequisites(reconcileProtectedSourceList(parseProposal(correctionResponse), returned));
    validateCompleteProposal(proposal, returned, { allowReviewableQuality: true });
  }
  const localFindings = [...findReviewableProposalFindings(proposal), ...findBeginnerQualityFindings(proposal), ...findCleanupCoverageFindings(proposal)];
  if (localFindings.length) {
    proposal.manualReviewFindings = [
      ...(proposal.manualReviewFindings || []),
      ...localFindings.map(finding => `Manual correction required: ${finding}`)
    ];
    onProgress(`Local checks completed with ${localFindings.length} item(s) retained for manual correction in Author.`);
  } else {
    onProgress('Local quality and cleanup checks passed.');
  }
  return validateCompleteProposal(proposal, returned, { allowReviewableQuality: true });
}

function uniqueSlug(value, used, fallback) {
  const base = slugify(value) || fallback;
  let current = base;
  let number = 2;
  while (used.has(current)) { current = `${base}-${number}`; number += 1; }
  used.add(current);
  return current;
}

export function buildAuthorDraftContent(inputs, proposal) {
  const updateTarget = inputs.generationMode === SIMPLE_AUTHOR_ASSISTANT_MODE.UPDATE ? inputs.updateTarget : null;
  const serviceSlug = clean(updateTarget?.serviceSlug) || slugify(inputs.shortName) || slugify(inputs.serviceName) || 'aws-service';
  const programmeId = clean(updateTarget?.programmeId) || `${serviceSlug}-learning-path`;
  const sourceIdByUrl = new Map();
  const sourceIds = new Set();
  const sources = proposal.sources.map(source => {
    const id = `source-${uniqueSlug(source.title, sourceIds, 'aws-doc')}`;
    sourceIdByUrl.set(normalizedUrl(source.url), id);
    return { id, title: clean(source.title), url: normalizedUrl(source.url), publisher: 'AWS', sourceType: 'official_documentation', purpose: clean(source.purpose), taskIds: [] };
  });
  const taskIds = new Set();
  const tasks = proposal.tasks.map((task, taskIndex) => {
    const taskNumber = taskIndex + 1;
    const id = `task-${serviceSlug}-${uniqueSlug(task.title, taskIds, `task-${taskNumber}`)}-${String(taskNumber).padStart(3, '0')}`;
    return { raw: task, id, taskNumber };
  });
  const phases = proposal.phases.map((phase, index) => {
    const phaseNumber = index + 1;
    return { id: `phase-${phaseNumber}-${slugify(phase.title) || 'phase'}`, phaseNumber, title: clean(phase.title), description: clean(phase.description), taskIds: tasks.filter(task => task.raw.phaseNumber === phaseNumber).map(task => task.id), isOptional: Boolean(phase.isOptional) };
  });
  const sourceIdsFor = urls => [...new Set(urls.map(url => sourceIdByUrl.get(normalizedUrl(url))).filter(Boolean))];
  const authorTasks = tasks.map(({ raw: task, id }) => {
    const taskSourceIds = sourceIdsFor([
      task.sourceUrls,
      ...task.consoleSteps.map(step => step.sourceUrls),
      ...task.consoleSteps.flatMap(step => (step.jsonBlocks || []).map(block => block.sourceUrls)),
      ...task.cliSteps.map(step => step.sourceUrls),
      ...task.cleanup.map(step => step.sourceUrls)
    ].flat());
    taskSourceIds.forEach(sourceId => sources.find(source => source.id === sourceId).taskIds.push(id));
    return {
      id, slug: slugify(task.title), title: clean(task.title), service: clean(inputs.serviceName), feature: clean(task.feature), goal: clean(task.goal), whyItMatters: clean(task.whyItMatters),
      difficulty: task.difficulty, estimatedMinutes: optionalMinutes(task.estimatedMinutes), region: inputs.preferredRegion, status: 'draft', phaseId: phases[task.phaseNumber - 1].id,
      prerequisites: task.prerequisiteTaskNumbers.map(number => tasks[number - 1].id), isOptional: Boolean(task.isOptional), sourceIds: taskSourceIds, concepts: [], values: [],
      modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'available', reason: '' } },
      consoleSteps: task.consoleSteps.map((step, index) => {
        const stepId = `${id}-console-step-${index + 1}-${slugify(step.title) || 'step'}`;
        return {
          id: stepId,
          stepNumber: index + 1,
          number: index + 1,
          title: clean(step.title),
          instruction: clean(step.instructions[0]),
          instructions: step.instructions.map((text, itemIndex) => ({ id: `${stepId}-instruction-${itemIndex + 1}`, text: clean(text), detail: '' })),
          jsonBlocks: (step.jsonBlocks || []).map((block, blockIndex) => {
            let content = clean(block.content);
            let language = 'text';
            try {
              const parsed = JSON.parse(content);
              if (parsed && typeof parsed === 'object') {
                language = 'json';
                content = JSON.stringify(parsed, null, 2);
              }
            } catch { /* Preserve useful JSON-shaped reference content for Author review. */ }
            return { id: `${stepId}-json-${blockIndex + 1}`, title: clean(block.title), content, language, sourceIds: sourceIdsFor(block.sourceUrls) };
          }),
          commands: [],
          expectedResult: clean(step.expectedResult),
          warning: clean(step.warning),
          sourceIds: sourceIdsFor(step.sourceUrls)
        };
      }),
      cliSteps: task.cliSteps.map((step, index) => ({ id: `${id}-cli-step-${index + 1}`, stepNumber: index + 1, number: index + 1, command: clean(step.command), explanation: clean(step.explanation), expectedResult: clean(step.expectedResult), instructions: [], commands: [], warning: clean(step.warning), sourceIds: sourceIdsFor(step.sourceUrls) })),
      createdResourceKeys: [],
      verification: task.verification.map((check, index) => ({ id: `${id}-verification-${index + 1}`, title: clean(check.title), instruction: clean(check.instruction), expectedResult: clean(check.expectedResult), mode: check.mode })),
      cleanup: task.cleanup.map((step, index) => ({ id: `${id}-cleanup-${index + 1}`, stepNumber: index + 1, title: clean(step.title), instruction: clean(step.instruction), description: clean(step.instruction), verification: clean(step.verification), resourceKeys: [], sourceIds: sourceIdsFor(step.sourceUrls) }))
    };
  });
  const taskMinutes = authorTasks.map(task => task.estimatedMinutes).filter(Number.isFinite);
  const taskTotalMinutes = taskMinutes.reduce((sum, minutes) => sum + minutes, 0);
  const estimatedMinutes = optionalMinutes(proposal.programme.estimatedMinutes) ?? (taskTotalMinutes > 0 ? taskTotalMinutes : null);
  const content = {
    schema: { profile: 'canonical-follow-along', version: '1.0.0', authorPackageVersion: '1.0.0', sharedContractHash: null, createdWith: 'author-assistant-simple-v1' },
    programme: { serviceSlug, serviceName: clean(updateTarget?.serviceName || inputs.serviceName), shortName: clean(updateTarget?.shortName || inputs.shortName), displayName: clean(proposal.programme.displayName), subtitle: clean(proposal.programme.subtitle), description: clean(proposal.programme.description), learningOutcome: clean(proposal.programme.learningOutcome), programmeId, pathId: programmeId, componentNamespace: '', category: clean(proposal.programme.category), difficulty: proposal.programme.difficulty, estimatedMinutes, defaultRegion: clean(inputs.preferredRegion), regionScope: proposal.programme.regionScope, supportedModes: ['console', 'cli', 'both'], publicationVisibility: 'unpublished' },
    sources,
    presentation: { accentColor: '#0891b2', iconLabel: clean(inputs.shortName).slice(0, 3).toUpperCase(), iconName: '', badgeText: '' },
    storage: {},
    progress: { initialTaskId: authorTasks[0].id, supportedModes: ['console', 'cli', 'both'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned'] },
    capabilities: {}, phases, tasks: authorTasks,
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: { region: clean(inputs.preferredRegion) } },
    warnings: { ...proposal.warnings },
    cleanup: { steps: proposal.finalCleanup.map((step, index) => {
      const instruction = [
        'Console:',
        ...step.consoleInstructions.map(item => `- ${clean(item)}`),
        'CLI:',
        ...step.cliCommands.map(command => `- ${clean(command)}`)
      ].join('\n');
      return { id: `programme-cleanup-${index + 1}`, stepNumber: index + 1, title: clean(step.title), instruction, description: instruction, verification: clean(step.verification), resourceKeys: [], sourceIds: sourceIdsFor(step.sourceUrls) };
    }), completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' },
    extensions: { registrations: [] },
    review: { validationStatus: 'passed', validationErrors: [], validationWarnings: [], sourceReviewStatus: 'reviewed', learnerPreviewStatus: 'reviewed', approvalDecision: 'pending', reviewStatus: 'ready_for_approval', findings: proposal.manualReviewFindings.map((message, index) => ({ id: `finding-${index + 1}`, findingNumber: index + 1, section: 'instructions', priority: 'advisory', message: clean(message), status: 'open' })) },
    publication: { publishStatus: 'not_published', targetProgrammeId: programmeId, proposedChanges: [] }
  };
  const checks = { planning: validateAuthorPlanning(content), content: validateAuthorContent(content), review: validateAuthorReview(content) };
  const errors = Object.entries(checks).flatMap(([name, result]) => result.errors.map(error => `${name}: ${error.message}`));
  if (errors.length) throw new Error(`Generated Follow Along failed local Author checks:\n- ${errors.join('\n- ')}`);
  return { content, checks };
}

function packageFingerprintContent(handoffPackage) {
  const content = structuredClone(handoffPackage);
  delete content.status;
  delete content.preparedAt;
  delete content.handoffFingerprint;
  return content;
}

function countContent(content) {
  return {
    phaseCount: content.phases.length, taskCount: content.tasks.length,
    checkboxCount: content.tasks.flatMap(task => task.consoleSteps).flatMap(step => step.instructions).length,
    cliCommandCount: content.tasks.flatMap(task => task.cliSteps).length,
    verificationCheckCount: content.tasks.flatMap(task => task.verification).length,
    cleanupItemCount: content.tasks.flatMap(task => task.cleanup).length + content.cleanup.steps.length,
    learnerResourceValueCount: content.resources.schema.length, officialAwsSourceCount: content.sources.length
  };
}

export function buildSimpleHandoff({ inputs, proposal, authorDraftContent, sessionId = `author-assistant-${slugify(inputs.shortName)}-${randomUUID()}`, now = () => new Date() } = {}) {
  const generatedFingerprint = fingerprintJson({ inputs, proposal, authorDraftContent });
  const preparedAt = now().toISOString();
  const handoffPackage = {
    schemaVersion: 1, kind: 'author_local_handoff_package', status: 'awaiting_human_handoff_review', sessionId, preparedAt,
    service: { officialName: clean(inputs.serviceName), shortName: clean(inputs.shortName) },
    generationMode: inputs.generationMode || SIMPLE_AUTHOR_ASSISTANT_MODE.NEW,
    updateTarget: inputs.generationMode === SIMPLE_AUTHOR_ASSISTANT_MODE.UPDATE ? {
      programmeId: clean(inputs.updateTarget?.programmeId), displayName: clean(inputs.updateTarget?.displayName),
      serviceName: clean(inputs.updateTarget?.serviceName), shortName: clean(inputs.updateTarget?.shortName), serviceSlug: clean(inputs.updateTarget?.serviceSlug),
      sourceRevision: Number(inputs.updateTarget?.sourceRevision), candidateId: clean(inputs.updateTarget?.candidateId),
      contentHash: clean(inputs.updateTarget?.contentHash), publishedAt: clean(inputs.updateTarget?.publishedAt)
    } : null,
    acceptedFingerprintChain: { completeGeneration: { algorithm: 'sha256-json-v1', value: generatedFingerprint } },
    acceptedRecordManifest: { completeGeneration: { algorithm: 'sha256-json-v1', value: generatedFingerprint } },
    authorDraftContent,
    identityBinding: { status: 'required_before_author_write', assignedAuthorId: null, assignedDraftId: null, assignedRevision: null, rule: 'The browser import binds the currently signed-in Author only after the final local preview is accepted.' },
    summary: countContent(authorDraftContent),
    handoffBoundary: { localPackageOnly: true, stage12Started: false, authorDraftWritten: false, authorIdentityBound: false, connectedToAuthor: false, connectedToSupabase: false, connectedToAws: false, releaseCandidatePrepared: false, candidateIdGenerated: false, approvalPerformed: false, published: false },
    acceptedStagesOneToElevenChanged: false
  };
  handoffPackage.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprintJson(packageFingerprintContent(handoffPackage)) };
  const session = { sessionId, status: 'handoff_package_ready_for_review', createdAt: preparedAt, inputs, boundaries: { handoffPackagePrepared: true, stage12Prepared: false, authorDraftWritten: false, supabaseConnected: false, awsConnected: false, candidatePrepared: false, published: false } };
  return { session, handoffPackage };
}

export function formatSimplePreview(handoffPackage) {
  const { authorDraftContent: content, summary } = handoffPackage;
  const lines = [
    `COMPLETE FOLLOW ALONG PREVIEW - ${content.programme.shortName}`, '',
    `Operation: ${handoffPackage.generationMode === SIMPLE_AUTHOR_ASSISTANT_MODE.UPDATE ? `Update existing revision ${handoffPackage.updateTarget.sourceRevision}` : 'New Follow Along'}`,
    content.programme.displayName,
    content.programme.subtitle, `Outcome: ${content.programme.learningOutcome}`, `Region: ${content.programme.defaultRegion}`, `Estimated time: ${content.programme.estimatedMinutes ? `${content.programme.estimatedMinutes} minutes` : 'Self-paced'}`,
    '', `Phases: ${summary.phaseCount}`, `Tasks: ${summary.taskCount}`, `Console checkboxes: ${summary.checkboxCount}`,
    `CLI commands: ${summary.cliCommandCount}`, `Verification checks: ${summary.verificationCheckCount}`, `Cleanup items: ${summary.cleanupItemCount}`,
    `Official AWS sources: ${summary.officialAwsSourceCount}`, '', 'LEARNER JOURNEY'
  ];
  content.phases.forEach(phase => {
    lines.push('', `${phase.phaseNumber}. ${phase.title}`);
    phase.taskIds.forEach(taskId => {
      const task = content.tasks.find(item => item.id === taskId);
      lines.push(`   - ${task.title}`, `     Console: ${task.consoleSteps.length} step(s); CLI: ${task.cliSteps.length} command(s); Checks: ${task.verification.length}`);
    });
  });
  lines.push('', 'SAFETY', 'Nothing was written to Author, Supabase or AWS.', 'No AWS command was executed.', 'No candidate was created and nothing was approved or published.', '', `SHA-256: ${handoffPackage.handoffFingerprint.value}`, '');
  return lines.join('\n');
}

export async function saveSimpleHandoff({ session, handoffPackage, acceptance = null, root = path.join(os.homedir(), 'AppData', 'Local', 'StudyTracker', 'AuthorAssistant'), previewText } = {}) {
  const directory = path.join(root, session.sessionId);
  await mkdir(directory, { recursive: true });
  const files = {
    packagePath: path.join(directory, 'author-local-handoff-package.json'),
    previewPath: path.join(directory, 'complete-follow-along-preview.txt'),
    sessionPath: path.join(directory, 'session.json'),
    acceptancePath: path.join(directory, 'author-local-handoff-acceptance-90a.json')
  };
  await writeFile(files.packagePath, `${JSON.stringify(handoffPackage, null, 2)}\n`, { encoding: 'utf8' });
  await writeFile(files.previewPath, previewText, { encoding: 'utf8' });
  await writeFile(files.sessionPath, `${JSON.stringify(session, null, 2)}\n`, { encoding: 'utf8' });
  if (acceptance) await writeFile(files.acceptancePath, `${JSON.stringify(acceptance, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  return files;
}

export function acceptSimpleHandoff(session, handoffPackage, { now = () => new Date() } = {}) {
  return buildStage90ALocalAcceptance({ session, handoffPackage, now });
}

export function sha256Text(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}
