import { randomUUID } from 'node:crypto';
import { rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  addAuthorResource,
  addAuthorVerification,
  AUTHOR_RESOURCE_TYPES
} from '../../src/features/followAlongAuthor/authorContent.js';
import { AUTHOR_ASSISTANT_ALLOWED_DOMAINS, AUTHOR_ASSISTANT_SCHEMA_VERSION } from './authorAssistantCore.mjs';
import { extractStageSixProtectedUrls } from './authorAssistantInstructions.mjs';
import {
  DEFAULT_AUTHOR_ASSISTANT_MODEL,
  formatOpenAiRequestError,
  OPENAI_RESPONSES_URL
} from './authorAssistantResearch.mjs';
import { fingerprintJson, verifyStage84DAcceptanceFingerprint } from './authorAssistantStage84D.mjs';

const VERIFICATION_MODES = Object.freeze(['console']);

function clean(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = '';
  url.search = '';
  return url.toString().replace(/\/$/, '');
}

function isCliReferenceUrl(value) {
  try {
    return new URL(value).pathname.toLowerCase().includes('/cli/latest/reference/');
  } catch {
    return false;
  }
}

export function getStageSevenConsoleSourceUrls(acceptedSources, blueprint, instructions) {
  const blueprintLinked = new Set((blueprint?.sources || []).flatMap(source => source.taskIds?.length ? [normalizeUrl(source.url)] : []));
  const stageSixProtected = new Set((instructions?.protectedSourceUrlsUsed || []).map(normalizeUrl));
  const urls = (acceptedSources?.sources || [])
    .map(source => source.url)
    .filter(url => !isCliReferenceUrl(url))
    .filter(url => blueprintLinked.has(normalizeUrl(url)) && stageSixProtected.has(normalizeUrl(url)));
  if (!urls.length) throw new Error('No accepted task-linked Console AWS sources are available for Stage 7.');
  const sourceById = new Map((blueprint?.sources || []).map(source => [source.id, source]));
  const eligible = new Set(urls.map(normalizeUrl));
  for (const task of blueprint?.tasks || []) {
    const hasEligibleSource = (task.sourceIds || []).some(id => eligible.has(normalizeUrl(sourceById.get(id)?.url || 'https://invalid.invalid')));
    if (!hasEligibleSource) throw new Error(`No accepted Console AWS source is linked to Stage 7 task: ${task.id}.`);
  }
  return urls;
}

function stageSevenSchema(taskIds, sourceUrls) {
  const evidence = {
    type: 'array',
    minItems: 1,
    items: { type: 'string', enum: sourceUrls }
  };
  return {
    type: 'object',
    properties: {
      resources: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            taskId: { type: 'string', enum: taskIds },
            label: { type: 'string' },
            type: { type: 'string', enum: AUTHOR_RESOURCE_TYPES },
            description: { type: 'string' },
            required: { type: 'boolean' },
            captureInstruction: { type: 'string' },
            reusedByTaskIds: { type: 'array', items: { type: 'string', enum: taskIds } },
            neededForFutureCli: { type: 'boolean' },
            neededForStage8Cleanup: { type: 'boolean' },
            sourceUrls: evidence
          },
          required: ['taskId', 'label', 'type', 'description', 'required', 'captureInstruction', 'reusedByTaskIds', 'neededForFutureCli', 'neededForStage8Cleanup', 'sourceUrls'],
          additionalProperties: false
        }
      },
      taskChecks: {
        type: 'array',
        minItems: taskIds.length,
        maxItems: taskIds.length,
        items: {
          type: 'object',
          properties: {
            taskId: { type: 'string', enum: taskIds },
            checks: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  instruction: { type: 'string' },
                  expectedResult: { type: 'string' },
                  mode: { type: 'string', enum: VERIFICATION_MODES },
                  sourceUrls: evidence
                },
                required: ['title', 'instruction', 'expectedResult', 'mode', 'sourceUrls'],
                additionalProperties: false
              }
            }
          },
          required: ['taskId', 'checks'],
          additionalProperties: false
        }
      },
      manualReviewFindings: { type: 'array', items: { type: 'string' } }
    },
    required: ['resources', 'taskChecks', 'manualReviewFindings'],
    additionalProperties: false
  };
}

export function validateStage85Inputs({ session, acceptedSources, blueprint, instructions, acceptance, supportRecords = {} } = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId
    || session.status !== 'stage_6_accepted'
    || acceptedSources?.sessionId !== sessionId
    || acceptedSources.status !== 'accepted'
    || blueprint?.sessionId !== sessionId
    || blueprint.status !== 'human_accepted'
    || instructions?.sessionId !== sessionId
    || instructions.status !== 'human_accepted'
    || acceptance?.sessionId !== sessionId
    || acceptance.status !== 'accepted'
    || acceptance.approvalStep !== '84D'
  ) throw new Error('Step 85 requires the complete human-accepted Stages 1-6 package.');
  if (!verifyStage84DAcceptanceFingerprint(instructions, acceptance)) {
    throw new Error('The accepted Stage 6 instruction fingerprint no longer matches.');
  }
  const expectedSupport = acceptance.supportFingerprints || {};
  const supportKeys = ['acceptedSources', 'blueprint', 'blueprintAcceptance', 'sourceAmendment84B', 'consistencyCorrection84C'];
  if (supportKeys.some(key => !supportRecords[key] || fingerprintJson(supportRecords[key]) !== expectedSupport[key])) {
    throw new Error('A supporting Stages 1-6 record no longer matches its accepted fingerprint.');
  }
  if (
    session.boundaries?.stage6Accepted !== true
    || session.boundaries?.stage7Prepared !== false
    || session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.awsConnected !== false
    || session.boundaries?.supabaseConnected !== false
    || instructions.stageBoundary?.connectedToAws !== false
  ) throw new Error('Step 85 stopped because a local-only safety boundary changed.');
  if (!Array.isArray(blueprint.tasks) || !blueprint.tasks.length || !acceptedSources.sources?.length) {
    throw new Error('The accepted Stages 1-6 package is incomplete.');
  }
  return true;
}

export function buildStageSevenPayload(session, acceptedSources, blueprint, instructions, acceptance, supportRecords, { model = DEFAULT_AUTHOR_ASSISTANT_MODEL } = {}) {
  validateStage85Inputs({ session, acceptedSources, blueprint, instructions, acceptance, supportRecords });
  const sourceUrls = getStageSevenConsoleSourceUrls(acceptedSources, blueprint, instructions);
  const eligibleSourceSet = new Set(sourceUrls.map(normalizeUrl));
  const sourceById = new Map(blueprint.sources.map(source => [source.id, source]));
  const instructionByTask = new Map(instructions.tasks.map(task => [task.taskId, task]));
  const tasks = blueprint.tasks.map(task => ({
    id: task.id,
    title: task.title,
    goal: task.goal,
    region: task.region,
    acceptedSources: task.sourceIds.map(id => sourceById.get(id)).filter(source => source && eligibleSourceSet.has(normalizeUrl(source.url))).map(source => ({ title: source.title, url: source.url })),
    acceptedConsoleSteps: (instructionByTask.get(task.id)?.consoleSteps || []).map(step => ({
      title: step.title,
      instructions: step.instructions.map(item => item.text),
      expectedResult: step.expectedResult,
      sourceUrls: step.sourceIds?.map(id => sourceById.get(id)?.url).filter(url => url && eligibleSourceSet.has(normalizeUrl(url))) || []
    }))
  }));
  return {
    model,
    store: false,
    reasoning: { effort: 'low' },
    tools: [{ type: 'web_search', filters: { allowed_domains: [...AUTHOR_ASSISTANT_ALLOWED_DOMAINS] } }],
    tool_choice: 'required',
    include: ['web_search_call.action.sources', 'web_search_call.results'],
    instructions: [
      'Prepare only local Author Stage 7 Resources and Checks from the supplied human-accepted Stages 1-6 package.',
      'Use web search only to read the exact accepted task-linked AWS Console documentation URLs supplied by the application.',
      'Do not use or propose a source outside that Console-only list. AWS CLI reference pages are intentionally excluded.',
      'Return every task exactly once and in the supplied order, with one or more short separately editable Console verification checks.',
      'A verification instruction must tell the learner what to inspect; its expected result must state the visible proof of success.',
      'Add a resource capture only when the learner must retain a value for a later task, a future CLI path, or later manual cleanup.',
      'Do not capture fixed example text, credentials, secrets, account IDs, message bodies, transient values, or values that are merely nice to have.',
      'Keep every resource capture instruction short and independently editable.',
      'Use mode console only. Do not write CLI commands or mix CLI steps into Console checks.',
      'Do not prepare deletion or cleanup actions for an AWS service resource; Stage 8 cleanup is outside this request.',
      'Do not connect to AWS, Supabase, Author, approval or publishing.',
      'If a source cannot support an exact check, report that in manualReviewFindings instead of inventing a result.'
    ].join(' '),
    input: [
      `AWS service: ${session.inputs.serviceName} (${session.inputs.shortName}).`,
      `Learner level: ${session.inputs.learnerLevel}.`,
      `Preferred Region: ${session.inputs.preferredRegion}.`,
      'Accepted tasks, Console instructions and task-scoped AWS sources:',
      JSON.stringify(tasks),
      'Existing future CLI notes are a separate boundary and must not become current commands:',
      JSON.stringify(instructions.boundaryAlignment?.futureCliGuidance || {}),
      'Existing human-review findings must not be silently discarded:',
      JSON.stringify(instructions.manualReviewFindings || [])
    ].join('\n'),
    text: {
      verbosity: 'low',
      format: {
        type: 'json_schema',
        name: 'author_stage_7_resources_checks',
        strict: true,
        schema: stageSevenSchema(blueprint.tasks.map(task => task.id), sourceUrls)
      }
    }
  };
}

export function buildStageSevenEvidenceRetryPayload(missingUrls, { model = DEFAULT_AUTHOR_ASSISTANT_MODEL } = {}) {
  const urls = [...new Set((missingUrls || []).map(normalizeUrl))];
  if (!urls.length) throw new Error('A protected evidence retry requires at least one exact AWS Docs URL.');
  return {
    model,
    store: false,
    reasoning: { effort: 'low' },
    tools: [{ type: 'web_search', filters: { allowed_domains: [...AUTHOR_ASSISTANT_ALLOWED_DOMAINS] } }],
    tool_choice: 'required',
    include: ['web_search_call.action.sources', 'web_search_call.results'],
    instructions: 'Perform one protected evidence check. Open only the exact official AWS documentation URLs supplied. Do not search for alternatives and do not create or revise Author content.',
    input: `Open these exact accepted AWS documentation URLs and return which were checked:\n${urls.join('\n')}`,
    text: {
      verbosity: 'low',
      format: {
        type: 'json_schema',
        name: 'author_stage_7_evidence_retry',
        strict: true,
        schema: {
          type: 'object',
          properties: { checkedUrls: { type: 'array', items: { type: 'string', enum: urls } } },
          required: ['checkedUrls'],
          additionalProperties: false
        }
      }
    }
  };
}

function extractOutputText(response) {
  for (const item of response?.output || []) {
    if (item?.type !== 'message') continue;
    for (const part of item.content || []) {
      if (part?.type === 'output_text' && clean(part.text)) return part.text;
    }
  }
  throw new Error('The AI response did not contain structured Stage 7 content.');
}

function containsUnsafeText(value) {
  return /AKIA[0-9A-Z]{12,}|aws_secret_access_key|-----BEGIN [A-Z ]*PRIVATE KEY-----|\baws\s+[a-z0-9-]+\s+[a-z0-9-]+/i.test(value);
}

function referencedProposalUrls(proposal) {
  return [...new Set([
    ...(proposal?.resources || []).flatMap(resource => resource.sourceUrls || []),
    ...(proposal?.taskChecks || []).flatMap(task => (task.checks || []).flatMap(check => check.sourceUrls || []))
  ].map(normalizeUrl))];
}

function validateProposal(acceptedSources, blueprint, instructions, proposal, protectedUrls = null) {
  const taskIds = blueprint.tasks.map(task => task.id);
  const taskOrder = new Map(taskIds.map((id, index) => [id, index]));
  const consoleSourceUrls = getStageSevenConsoleSourceUrls(acceptedSources, blueprint, instructions);
  const accepted = new Set(consoleSourceUrls.map(normalizeUrl));
  const protectedSet = protectedUrls ? new Set(protectedUrls.map(normalizeUrl)) : null;
  const sourceById = new Map(blueprint.sources.map(source => [source.id, source]));
  const taskSources = new Map(blueprint.tasks.map(task => [task.id, new Set(task.sourceIds.map(id => sourceById.get(id)?.url).filter(url => url && accepted.has(normalizeUrl(url))).map(normalizeUrl))]));
  if (!Array.isArray(proposal?.taskChecks) || proposal.taskChecks.map(item => item.taskId).join(',') !== taskIds.join(',')) {
    throw new Error('Stage 7 must return every task exactly once in accepted order.');
  }
  if (!Array.isArray(proposal.resources) || !Array.isArray(proposal.manualReviewFindings)) {
    throw new Error('Stage 7 resources or review findings are missing.');
  }
  const verifyEvidence = (taskId, urls) => {
    if (!Array.isArray(urls) || !urls.length || new Set(urls.map(normalizeUrl)).size !== urls.length) throw new Error('Every Stage 7 item needs unique accepted source evidence.');
    for (const url of urls.map(normalizeUrl)) {
      if (!accepted.has(url) || !taskSources.get(taskId)?.has(url)) throw new Error('A Stage 7 item used a source outside its accepted Console task boundary.');
      if (protectedSet && !protectedSet.has(url)) throw new Error(`A Stage 7 source was not returned by protected AWS Docs search: ${url}`);
    }
  };
  for (const task of proposal.taskChecks) {
    if (!Array.isArray(task.checks) || !task.checks.length) throw new Error('Every Stage 7 task needs at least one verification check.');
    for (const check of task.checks) {
      if (![check.title, check.instruction, check.expectedResult].every(clean) || check.mode !== 'console') throw new Error('Every Stage 7 check must be a complete Console check.');
      if (clean(check.title).length > 80 || clean(check.instruction).length > 220 || clean(check.expectedResult).length > 220) throw new Error('Stage 7 checks must stay short and separately editable.');
      if (containsUnsafeText(JSON.stringify(check))) throw new Error('Stage 7 must not contain credentials or CLI commands.');
      verifyEvidence(task.taskId, check.sourceUrls);
    }
  }
  const labels = new Set();
  for (const resource of proposal.resources) {
    if (!taskOrder.has(resource.taskId) || ![resource.label, resource.description, resource.captureInstruction].every(clean)) throw new Error('A Stage 7 resource capture is incomplete.');
    const label = clean(resource.label).toLowerCase();
    if (labels.has(label)) throw new Error('Stage 7 resource captures must be unique.');
    labels.add(label);
    if (!AUTHOR_RESOURCE_TYPES.includes(resource.type)) throw new Error('A Stage 7 resource has an invalid type.');
    const laterTaskIds = [...new Set(resource.reusedByTaskIds || [])];
    if (laterTaskIds.some(id => !taskOrder.has(id) || taskOrder.get(id) <= taskOrder.get(resource.taskId))) throw new Error('A captured value may only be reused by a later task.');
    if (!laterTaskIds.length && !resource.neededForFutureCli && !resource.neededForStage8Cleanup) throw new Error('A resource value must have a genuine later use.');
    if (containsUnsafeText(JSON.stringify(resource))) throw new Error('Stage 7 must not contain credentials or CLI commands.');
    verifyEvidence(resource.taskId, resource.sourceUrls);
  }
  return proposal;
}

export function buildStageSevenDocument({ session, acceptedSources, blueprint, instructions, proposal, protectedUrls, responseId = '', model = DEFAULT_AUTHOR_ASSISTANT_MODEL, now = () => new Date() } = {}) {
  validateProposal(acceptedSources, blueprint, instructions, proposal, protectedUrls);
  let draft = {
    tasks: blueprint.tasks.map(task => ({ ...task, createdResourceKeys: [], verification: [] })),
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} }
  };
  const resourceEvidence = [];
  for (const resource of proposal.resources) {
    const added = addAuthorResource(draft, resource.taskId, resource);
    if (!added.success) throw new Error(added.error);
    draft = added.draft;
    resourceEvidence.push({
      resourceKey: added.resource.key,
      captureInstruction: clean(resource.captureInstruction),
      reusedByTaskIds: [...new Set(resource.reusedByTaskIds)],
      neededForFutureCli: resource.neededForFutureCli,
      neededForStage8Cleanup: resource.neededForStage8Cleanup,
      sourceUrls: resource.sourceUrls.map(normalizeUrl)
    });
  }
  const verificationEvidence = [];
  for (const taskProposal of proposal.taskChecks) {
    for (const check of taskProposal.checks) {
      const added = addAuthorVerification(draft, taskProposal.taskId, check);
      if (!added.success) throw new Error(added.error);
      draft = added.draft;
      verificationEvidence.push({ taskId: taskProposal.taskId, verificationId: added.verification.id, sourceUrls: check.sourceUrls.map(normalizeUrl) });
    }
  }
  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_stage_7_local_resources_checks',
    status: 'awaiting_human_stage_7_review',
    sessionId: session.sessionId,
    responseId: clean(responseId),
    model,
    generatedAt: now().toISOString(),
    basedOnStage6Fingerprint: instructions.acceptanceFingerprint,
    stageBoundary: {
      preparedLocally: [7],
      notPrepared: [8, 9, 10, 11, 12],
      writtenToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      candidatePrepared: false,
      published: false
    },
    resources: draft.resources,
    tasks: draft.tasks.map(task => ({
      taskId: task.id,
      title: task.title,
      createdResourceKeys: task.createdResourceKeys,
      verification: task.verification
    })),
    evidence: {
      resources: resourceEvidence,
      verifications: verificationEvidence,
      protectedSourceUrls: [...new Set(protectedUrls.map(normalizeUrl))].filter(url => getStageSevenConsoleSourceUrls(acceptedSources, blueprint, instructions).map(normalizeUrl).includes(url))
    },
    consoleBoundary: { verificationModes: ['console'], cliCommandsPrepared: false },
    futureCliBoundary: { prepared: false, guidancePreservedFromStage6: { ...(instructions.boundaryAlignment?.futureCliGuidance || {}) } },
    manualReviewFindings: [...new Set([...(instructions.manualReviewFindings || []), ...proposal.manualReviewFindings.map(clean).filter(Boolean)])]
  };
}

export function formatStageSevenPreview(document) {
  const lines = [
    `AUTHOR STAGE 7 LOCAL RESOURCES AND CHECKS - ${document.tasks.length} TASKS`,
    '',
    `Genuinely required resource values: ${document.resources.schema.length}`,
    `Separate editable verification checks: ${document.tasks.reduce((total, task) => total + task.verification.length, 0)}`,
    ''
  ];
  document.tasks.forEach((task, index) => lines.push(`${index + 1}. ${task.title}`, `   Verification checks: ${task.verification.length}`, `   Resource values to keep: ${task.createdResourceKeys.length}`, ''));
  lines.push('BOUNDARIES', 'Console checks prepared: yes', 'Future CLI commands prepared: no', 'Stage 8 cleanup prepared: no', 'Nothing was written to Author, Supabase or AWS.', '');
  return lines.join('\n');
}

export async function requestStageSevenResourcesChecks({ session, acceptedSources, blueprint, instructions, acceptance, supportRecords, apiKey, model = DEFAULT_AUTHOR_ASSISTANT_MODEL, fetchImpl = globalThis.fetch, now = () => new Date() } = {}) {
  if (!clean(apiKey)) throw new Error('OPENAI_API_KEY is not configured. No Stage 7 request was made.');
  if (typeof fetchImpl !== 'function') throw new Error('Secure network access is unavailable.');
  const payload = buildStageSevenPayload(session, acceptedSources, blueprint, instructions, acceptance, supportRecords, { model });
  const response = await fetchImpl(OPENAI_RESPONSES_URL, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response?.ok) {
    let apiError = {};
    try { apiError = (await response.json())?.error || {}; } catch { /* Keep safe status-only guidance. */ }
    throw new Error(formatOpenAiRequestError(response?.status, apiError));
  }
  const apiResponse = await response.json();
  let protectedUrls = extractStageSixProtectedUrls(apiResponse);
  let proposal;
  try { proposal = JSON.parse(extractOutputText(apiResponse)); } catch (error) {
    if (error instanceof SyntaxError) throw new Error('The Stage 7 response was not valid structured JSON.');
    throw error;
  }
  validateProposal(acceptedSources, blueprint, instructions, proposal);
  let missingUrls = referencedProposalUrls(proposal).filter(url => !new Set(protectedUrls.map(normalizeUrl)).has(url));
  if (missingUrls.length) {
    const retryPayload = buildStageSevenEvidenceRetryPayload(missingUrls, { model });
    const retryResponse = await fetchImpl(OPENAI_RESPONSES_URL, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(retryPayload) });
    if (!retryResponse?.ok) {
      let apiError = {};
      try { apiError = (await retryResponse.json())?.error || {}; } catch { /* Keep safe status-only guidance. */ }
      throw new Error(formatOpenAiRequestError(retryResponse?.status, apiError));
    }
    const retryApiResponse = await retryResponse.json();
    protectedUrls = [...new Set([...protectedUrls, ...extractStageSixProtectedUrls(retryApiResponse)].map(normalizeUrl))];
    const protectedSet = new Set(protectedUrls);
    missingUrls = missingUrls.filter(url => !protectedSet.has(url));
    if (missingUrls.length) throw new Error(`Stage 7 protected evidence is still missing after one targeted retry: ${missingUrls.join(', ')}`);
  }
  return buildStageSevenDocument({ session, acceptedSources, blueprint, instructions, proposal, protectedUrls, responseId: apiResponse.id, model, now });
}

export async function saveStageSevenResourcesChecks({ sessionRoot, existingSession, document, previewText, now = () => new Date() } = {}) {
  if (!sessionRoot || !existingSession?.sessionId || document?.sessionId !== existingSession.sessionId) throw new Error('A matching saved session and Stage 7 document are required.');
  if (
    existingSession.status !== 'stage_6_accepted'
    || document.status !== 'awaiting_human_stage_7_review'
    || document.stageBoundary?.preparedLocally?.join(',') !== '7'
    || document.stageBoundary?.notPrepared?.join(',') !== '8,9,10,11,12'
    || document.stageBoundary?.writtenToAuthor !== false
    || document.stageBoundary?.connectedToAws !== false
    || document.futureCliBoundary?.prepared !== false
    || document.consoleBoundary?.cliCommandsPrepared !== false
  ) throw new Error('Step 85 stopped because its local Stage 7 boundary changed.');
  const updatedAt = now().toISOString();
  const updatedSession = {
    ...existingSession,
    status: 'stage_7_ready_for_review',
    currentStep: 'local_stage_7_resources_checks_review',
    updatedAt,
    boundaries: {
      ...existingSession.boundaries,
      authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7],
      authorDraftWritten: false,
      stage6Accepted: true,
      stage7Prepared: true,
      stage8Prepared: false,
      awsConnected: false,
      supabaseConnected: false
    }
  };
  const sessionDirectory = path.join(sessionRoot, existingSession.sessionId);
  const outputs = [
    ['author-stage-7-resources-checks.json', `${JSON.stringify(document, null, 2)}\n`],
    ['author-stage-7-resources-checks.txt', previewText],
    ['session.json', `${JSON.stringify(updatedSession, null, 2)}\n`]
  ];
  const temporaryFiles = [];
  for (const [filename, contents] of outputs) {
    const finalPath = path.join(sessionDirectory, filename);
    const temporaryPath = `${finalPath}.${randomUUID()}.tmp`;
    await writeFile(temporaryPath, contents, { encoding: 'utf8', flag: 'wx' });
    temporaryFiles.push([temporaryPath, finalPath]);
  }
  for (const [temporaryPath, finalPath] of temporaryFiles) await rename(temporaryPath, finalPath);
  return {
    session: updatedSession,
    documentPath: path.join(sessionDirectory, 'author-stage-7-resources-checks.json'),
    previewPath: path.join(sessionDirectory, 'author-stage-7-resources-checks.txt')
  };
}
