import { randomUUID } from 'node:crypto';
import { rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { addAuthorCleanupStep } from '../../src/features/followAlongAuthor/authorContent.js';
import { AUTHOR_ASSISTANT_ALLOWED_DOMAINS, AUTHOR_ASSISTANT_SCHEMA_VERSION } from './authorAssistantCore.mjs';
import { extractStageSixProtectedUrls } from './authorAssistantInstructions.mjs';
import { getStageSevenConsoleSourceUrls } from './authorAssistantResourcesChecks.mjs';
import { DEFAULT_AUTHOR_ASSISTANT_MODEL, formatOpenAiRequestError, OPENAI_RESPONSES_URL } from './authorAssistantResearch.mjs';
import { fingerprintJson, verifyStage84DAcceptanceFingerprint } from './authorAssistantStage84D.mjs';
import { verifyStage85BAcceptanceFingerprint } from './authorAssistantStage85B.mjs';

function clean(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = '';
  url.search = '';
  return url.toString().replace(/\/$/, '');
}

function exactCleanupBoundary(boundary = {}) {
  const result = {
    taskId: clean(boundary.taskId),
    targetType: clean(boundary.targetType),
    targetName: clean(boundary.targetName)
  };
  if (!result.taskId || !result.targetType || !result.targetName) throw new Error('Step 86 requires one exact approved manual cleanup target.');
  return result;
}

export function validateStage86Inputs({
  session,
  acceptedSources,
  blueprint,
  stageSixInstructions,
  stageSixAcceptance,
  stageSeven,
  stageSevenAcceptance,
  supportRecords = {},
  cleanupBoundary
} = {}) {
  const sessionId = session?.sessionId;
  const boundary = exactCleanupBoundary(cleanupBoundary);
  if (
    !sessionId
    || session.status !== 'stage_7_accepted'
    || session.inputs?.shortName !== 'SQS'
    || acceptedSources?.sessionId !== sessionId
    || acceptedSources.status !== 'accepted'
    || blueprint?.sessionId !== sessionId
    || blueprint.status !== 'human_accepted'
    || stageSixInstructions?.sessionId !== sessionId
    || stageSixInstructions.status !== 'human_accepted'
    || stageSixAcceptance?.sessionId !== sessionId
    || stageSixAcceptance.status !== 'accepted'
    || stageSeven?.sessionId !== sessionId
    || stageSeven.status !== 'human_accepted'
    || stageSevenAcceptance?.sessionId !== sessionId
    || stageSevenAcceptance.status !== 'accepted'
    || stageSevenAcceptance.approvalStep !== '85B'
  ) throw new Error('Step 86 requires the complete matching accepted SQS Stages 1-7 package.');
  if (!verifyStage84DAcceptanceFingerprint(stageSixInstructions, stageSixAcceptance)) throw new Error('The accepted Stage 6 fingerprint no longer matches.');
  if (!verifyStage85BAcceptanceFingerprint(stageSeven, stageSevenAcceptance)) throw new Error('The accepted Stage 7 fingerprint no longer matches.');

  const expected = stageSevenAcceptance.supportingRecordFingerprints || {};
  const current = {
    acceptedSources: fingerprintJson(acceptedSources),
    blueprint: fingerprintJson(blueprint),
    blueprintAcceptance: fingerprintJson(supportRecords.blueprintAcceptance),
    sourceAmendment84B: fingerprintJson(supportRecords.sourceAmendment84B),
    consistencyCorrection84C: fingerprintJson(supportRecords.consistencyCorrection84C),
    stageSixInstructions: fingerprintJson(stageSixInstructions),
    stageSixAcceptance: fingerprintJson(stageSixAcceptance)
  };
  if (Object.keys(current).some(key => current[key] !== expected[key])) throw new Error('An accepted Stages 1-7 supporting record no longer matches its fingerprint.');
  if (!blueprint.tasks.some(task => task.id === boundary.taskId) || boundary.targetName !== 'sqs-beginner-test' || boundary.targetType !== 'Amazon SQS queue') {
    throw new Error('Step 86 is approved only for the test Amazon SQS queue named sqs-beginner-test.');
  }
  if (
    session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7'
    || session.boundaries?.stage7Accepted !== true
    || session.boundaries?.stage8Prepared !== false
    || session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.awsConnected !== false
    || session.boundaries?.supabaseConnected !== false
  ) throw new Error('Step 86 stopped because a local-only safety boundary changed.');
  return boundary;
}

function cleanupSchema(boundary, sourceUrls) {
  const sourceEvidence = { type: 'array', minItems: 1, items: { type: 'string', enum: sourceUrls } };
  const step = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      instruction: { type: 'string' },
      verification: { type: 'string' },
      sourceUrls: sourceEvidence
    },
    required: ['title', 'instruction', 'verification', 'sourceUrls'],
    additionalProperties: false
  };
  return {
    type: 'object',
    properties: {
      cleanupTaskId: { type: 'string', enum: [boundary.taskId] },
      taskCleanupSteps: { type: 'array', minItems: 2, items: step },
      finalProgrammeAcknowledgement: step,
      manualReviewFindings: { type: 'array', items: { type: 'string' } }
    },
    required: ['cleanupTaskId', 'taskCleanupSteps', 'finalProgrammeAcknowledgement', 'manualReviewFindings'],
    additionalProperties: false
  };
}

function taskConsoleSources(acceptedSources, blueprint, stageSixInstructions, stageSeven, taskId) {
  const eligible = new Set(getStageSevenConsoleSourceUrls(acceptedSources, blueprint, stageSixInstructions).map(normalizeUrl));
  const protectedStageSeven = new Set((stageSeven.evidence?.protectedSourceUrls || []).map(normalizeUrl));
  const sourceById = new Map(blueprint.sources.map(source => [source.id, source]));
  const task = blueprint.tasks.find(item => item.id === taskId);
  const urls = (task?.sourceIds || [])
    .map(id => sourceById.get(id)?.url)
    .filter(url => url && eligible.has(normalizeUrl(url)) && protectedStageSeven.has(normalizeUrl(url)));
  if (!urls.length) throw new Error('The approved cleanup task has no accepted protected Console AWS source.');
  return urls;
}

export function buildStageEightPayload(inputs, { model = DEFAULT_AUTHOR_ASSISTANT_MODEL } = {}) {
  const boundary = validateStage86Inputs(inputs);
  const sourceUrls = taskConsoleSources(inputs.acceptedSources, inputs.blueprint, inputs.stageSixInstructions, inputs.stageSeven, boundary.taskId);
  const cleanupTask = inputs.blueprint.tasks.find(task => task.id === boundary.taskId);
  return {
    model,
    store: false,
    reasoning: { effort: 'low' },
    tools: [{ type: 'web_search', filters: { allowed_domains: [...AUTHOR_ASSISTANT_ALLOWED_DOMAINS] } }],
    tool_choice: 'required',
    include: ['web_search_call.action.sources', 'web_search_call.results'],
    instructions: [
      'Prepare only local Author Stage 8 manual Console cleanup for the supplied accepted Follow Along package.',
      `The only AWS service resource that may be deleted is the ${boundary.targetType} named ${boundary.targetName}.`,
      'Do not delete messages separately, other queues, IAM resources, or any other AWS resource.',
      'Return as many short separately editable manual cleanup steps as the safe Console cleanup genuinely requires, with at least two steps.',
      `Exactly one step must perform deletion and must explicitly name ${boundary.targetName}.`,
      `Every navigation or selection step must explicitly identify ${boundary.targetName}.`,
      'Include visible verification that the named queue is no longer listed after refresh.',
      'Include one final programme acknowledgement that confirms the manual cleanup was checked.',
      'Do not create CLI commands. Do not turn future CLI guidance into current instructions.',
      'Use only the exact accepted task-linked AWS Console source URLs supplied.',
      'Do not connect to AWS, Supabase, Author, approval or publishing. Do not prepare Stage 9 content.'
    ].join(' '),
    input: [
      `AWS service: ${inputs.session.inputs.serviceName} (${inputs.session.inputs.shortName}).`,
      `Approved cleanup task: ${cleanupTask.title} (${cleanupTask.id}).`,
      `Only approved cleanup target: ${boundary.targetType} named ${boundary.targetName}.`,
      'Accepted task-linked Console sources:',
      JSON.stringify(sourceUrls),
      'Accepted Stage 6 cleanup boundary:',
      JSON.stringify(inputs.stageSixInstructions.boundaryAlignment?.stage8CleanupGuidance || {}),
      'Future CLI cleanup guidance to preserve separately and not convert into commands:',
      JSON.stringify(inputs.stageSeven.futureCliBoundary?.guidancePreservedFromStage6 || {})
    ].join('\n'),
    text: {
      verbosity: 'low',
      format: {
        type: 'json_schema',
        name: 'author_stage_8_manual_cleanup',
        strict: true,
        schema: cleanupSchema(boundary, sourceUrls)
      }
    }
  };
}

function extractOutputText(response) {
  for (const item of response?.output || []) {
    if (item?.type !== 'message') continue;
    for (const part of item.content || []) if (part?.type === 'output_text' && clean(part.text)) return part.text;
  }
  throw new Error('The AI response did not contain structured Stage 8 cleanup content.');
}

function referencedUrls(proposal) {
  return [...new Set([
    ...(proposal?.taskCleanupSteps || []).flatMap(step => step.sourceUrls || []),
    ...(proposal?.finalProgrammeAcknowledgement?.sourceUrls || [])
  ].map(normalizeUrl))];
}

function containsCliOrCredential(value) {
  return /AKIA[0-9A-Z]{12,}|aws_secret_access_key|-----BEGIN [A-Z ]*PRIVATE KEY-----|\baws\s+[a-z0-9-]+\s+[a-z0-9-]+/i.test(value);
}

function validateCleanupProposal(inputs, proposal, protectedUrls = null) {
  const boundary = exactCleanupBoundary(inputs.cleanupBoundary);
  const allowedSources = new Set(taskConsoleSources(inputs.acceptedSources, inputs.blueprint, inputs.stageSixInstructions, inputs.stageSeven, boundary.taskId).map(normalizeUrl));
  const protectedSet = protectedUrls ? new Set(protectedUrls.map(normalizeUrl)) : null;
  if (proposal?.cleanupTaskId !== boundary.taskId || !Array.isArray(proposal.taskCleanupSteps) || proposal.taskCleanupSteps.length < 2) {
    throw new Error('Stage 8 must contain at least two manual steps for only the approved cleanup task.');
  }
  if (!proposal.finalProgrammeAcknowledgement || !Array.isArray(proposal.manualReviewFindings)) throw new Error('Stage 8 requires a final programme cleanup acknowledgement.');
  const allSteps = [...proposal.taskCleanupSteps, proposal.finalProgrammeAcknowledgement];
  for (const step of allSteps) {
    if (![step.title, step.instruction, step.verification].every(clean)) throw new Error('Every Stage 8 cleanup item must be complete and separately editable.');
    if ([step.title, step.instruction, step.verification].some(value => clean(value).length > 240)) throw new Error('Stage 8 cleanup items must remain short.');
    if (containsCliOrCredential(JSON.stringify(step))) throw new Error('Stage 8 must not contain credentials or CLI commands.');
    if (!Array.isArray(step.sourceUrls) || !step.sourceUrls.length) throw new Error('Every Stage 8 cleanup item needs accepted source evidence.');
    for (const url of step.sourceUrls.map(normalizeUrl)) {
      if (!allowedSources.has(url)) throw new Error('A Stage 8 cleanup item used a source outside the accepted Console cleanup boundary.');
      if (protectedSet && !protectedSet.has(url)) throw new Error(`A Stage 8 source was not returned by protected AWS Docs search: ${url}`);
    }
  }
  const taskText = proposal.taskCleanupSteps.map(step => `${step.title} ${step.instruction} ${step.verification}`);
  if (taskText.some(text => !text.includes(boundary.targetName))) throw new Error(`Every manual cleanup step must identify ${boundary.targetName}.`);
  const deleteSteps = proposal.taskCleanupSteps.filter(step => /\bdelete\b/i.test(`${step.title} ${step.instruction}`));
  if (deleteSteps.length !== 1 || !deleteSteps[0].instruction.includes(boundary.targetName)) throw new Error(`Exactly one manual cleanup step must delete only ${boundary.targetName}.`);
  const forbiddenDestructiveScope = /\b(delete|remove)\s+(all|every|other|multiple)\b|\bempty\s+all\b|\bwildcard\b/i;
  if (taskText.some(text => forbiddenDestructiveScope.test(text))) throw new Error('Stage 8 attempted cleanup outside the single approved queue.');
  if (!/no longer (?:shown|listed|displayed)|not (?:shown|listed|displayed)/i.test(taskText.join(' '))) {
    throw new Error('Stage 8 must visibly verify that the approved queue is no longer listed.');
  }
  const finalText = `${proposal.finalProgrammeAcknowledgement.title} ${proposal.finalProgrammeAcknowledgement.instruction} ${proposal.finalProgrammeAcknowledgement.verification}`;
  if (/\bdelete\b/i.test(finalText) || !/acknowledg|confirm|review|check/i.test(finalText)) throw new Error('The final programme item must be a non-destructive cleanup acknowledgement.');
  return proposal;
}

function evidenceRetryPayload(missingUrls, model) {
  const urls = [...new Set(missingUrls.map(normalizeUrl))];
  return {
    model,
    store: false,
    reasoning: { effort: 'low' },
    tools: [{ type: 'web_search', filters: { allowed_domains: [...AUTHOR_ASSISTANT_ALLOWED_DOMAINS] } }],
    tool_choice: 'required',
    include: ['web_search_call.action.sources', 'web_search_call.results'],
    instructions: 'Perform one protected evidence check. Open only the exact supplied official AWS documentation URLs. Do not create or revise cleanup content.',
    input: urls.join('\n'),
    text: {
      verbosity: 'low',
      format: {
        type: 'json_schema',
        name: 'author_stage_8_evidence_retry',
        strict: true,
        schema: { type: 'object', properties: { checkedUrls: { type: 'array', items: { type: 'string', enum: urls } } }, required: ['checkedUrls'], additionalProperties: false }
      }
    }
  };
}

export function buildStageEightDocument(inputs, proposal, protectedUrls, { responseId = '', model = DEFAULT_AUTHOR_ASSISTANT_MODEL, now = () => new Date() } = {}) {
  const boundary = exactCleanupBoundary(inputs.cleanupBoundary);
  validateCleanupProposal(inputs, proposal, protectedUrls);
  let draft = {
    tasks: inputs.blueprint.tasks.map(task => ({ ...task, cleanup: [] })),
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} },
    cleanup: { steps: [], completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' }
  };
  const evidence = [];
  for (const step of proposal.taskCleanupSteps) {
    const added = addAuthorCleanupStep(draft, boundary.taskId, { ...step, resourceKeys: [] });
    if (!added.success) throw new Error(added.error);
    draft = added.draft;
    evidence.push({ scope: 'task', taskId: boundary.taskId, cleanupStepId: added.step.id, sourceUrls: step.sourceUrls.map(normalizeUrl) });
  }
  const final = addAuthorCleanupStep(draft, null, { ...proposal.finalProgrammeAcknowledgement, resourceKeys: [] });
  if (!final.success) throw new Error(final.error);
  draft = final.draft;
  evidence.push({ scope: 'programme', taskId: null, cleanupStepId: final.step.id, sourceUrls: proposal.finalProgrammeAcknowledgement.sourceUrls.map(normalizeUrl) });
  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_stage_8_local_manual_cleanup',
    status: 'awaiting_human_stage_8_review',
    sessionId: inputs.session.sessionId,
    responseId: clean(responseId),
    model,
    generatedAt: now().toISOString(),
    basedOnStage7Fingerprint: { ...inputs.stageSeven.acceptanceFingerprint },
    stageBoundary: { preparedLocally: [8], notPrepared: [9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    approvedCleanupTarget: boundary,
    taskCleanup: { taskId: boundary.taskId, steps: draft.tasks.find(task => task.id === boundary.taskId).cleanup },
    programmeCleanup: draft.cleanup,
    evidence: { cleanupSteps: evidence, protectedSourceUrls: [...new Set(protectedUrls.map(normalizeUrl))] },
    futureCliBoundary: { prepared: false, guidancePreservedFromStage7: { ...(inputs.stageSeven.futureCliBoundary?.guidancePreservedFromStage6 || {}) } },
    manualReviewFindings: [...new Set([...(inputs.stageSeven.manualReviewFindings || []), ...proposal.manualReviewFindings.map(clean).filter(Boolean)])]
  };
}

export function formatStageEightPreview(document) {
  const lines = [
    'AUTHOR STAGE 8 LOCAL MANUAL CLEANUP',
    '',
    `Only approved target: ${document.approvedCleanupTarget.targetType} ${document.approvedCleanupTarget.targetName}`,
    `Separate editable task cleanup steps: ${document.taskCleanup.steps.length}`,
    `Final programme acknowledgements: ${document.programmeCleanup.steps.length}`,
    ''
  ];
  document.taskCleanup.steps.forEach(step => lines.push(`${step.stepNumber}. ${step.title}`, `   ${step.instruction}`, `   Verify: ${step.verification}`, ''));
  lines.push('FINAL PROGRAMME ACKNOWLEDGEMENT', document.programmeCleanup.steps[0].title, `   ${document.programmeCleanup.steps[0].instruction}`, `   Verify: ${document.programmeCleanup.steps[0].verification}`, '', 'BOUNDARIES', 'Manual Console cleanup only: yes', 'Future CLI commands prepared: no', 'Stage 9 prepared: no', 'Nothing was written to Author, Supabase or AWS.', '');
  return lines.join('\n');
}

export async function requestStageEightCleanup({ apiKey, model = DEFAULT_AUTHOR_ASSISTANT_MODEL, fetchImpl = globalThis.fetch, now = () => new Date(), ...inputs } = {}) {
  if (!clean(apiKey)) throw new Error('OPENAI_API_KEY is not configured. No Stage 8 request was made.');
  if (typeof fetchImpl !== 'function') throw new Error('Secure network access is unavailable.');
  const payload = buildStageEightPayload(inputs, { model });
  const request = async body => {
    const response = await fetchImpl(OPENAI_RESPONSES_URL, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!response?.ok) {
      let apiError = {};
      try { apiError = (await response.json())?.error || {}; } catch { /* Keep safe status-only guidance. */ }
      throw new Error(formatOpenAiRequestError(response?.status, apiError));
    }
    return response.json();
  };
  const apiResponse = await request(payload);
  let proposal;
  try { proposal = JSON.parse(extractOutputText(apiResponse)); } catch (error) {
    if (error instanceof SyntaxError) throw new Error('The Stage 8 response was not valid structured JSON.');
    throw error;
  }
  validateCleanupProposal(inputs, proposal);
  let protectedUrls = extractStageSixProtectedUrls(apiResponse);
  let missing = referencedUrls(proposal).filter(url => !new Set(protectedUrls.map(normalizeUrl)).has(url));
  if (missing.length) {
    const retryResponse = await request(evidenceRetryPayload(missing, model));
    protectedUrls = [...new Set([...protectedUrls, ...extractStageSixProtectedUrls(retryResponse)].map(normalizeUrl))];
    const returned = new Set(protectedUrls);
    missing = missing.filter(url => !returned.has(url));
    if (missing.length) throw new Error(`Stage 8 protected evidence is still missing after one targeted retry: ${missing.join(', ')}`);
  }
  return buildStageEightDocument(inputs, proposal, protectedUrls, { responseId: apiResponse.id, model, now });
}

export async function saveStageEightCleanup({ sessionRoot, existingSession, document, previewText, now = () => new Date() } = {}) {
  if (!sessionRoot || !existingSession?.sessionId || document?.sessionId !== existingSession.sessionId) throw new Error('A matching saved session and Stage 8 document are required.');
  if (
    existingSession.status !== 'stage_7_accepted'
    || document.status !== 'awaiting_human_stage_8_review'
    || document.stageBoundary?.preparedLocally?.join(',') !== '8'
    || document.stageBoundary?.notPrepared?.join(',') !== '9,10,11,12'
    || document.stageBoundary?.writtenToAuthor !== false
    || document.stageBoundary?.connectedToAws !== false
    || document.stageBoundary?.connectedToSupabase !== false
    || document.futureCliBoundary?.prepared !== false
  ) throw new Error('Step 86 stopped because its local Stage 8 boundary changed.');
  const updatedAt = now().toISOString();
  const updatedSession = {
    ...existingSession,
    status: 'stage_8_ready_for_review',
    currentStep: 'local_stage_8_manual_cleanup_review',
    updatedAt,
    boundaries: {
      ...existingSession.boundaries,
      authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8],
      authorDraftWritten: false,
      stage7Accepted: true,
      stage8Prepared: true,
      stage9Prepared: false,
      awsConnected: false,
      supabaseConnected: false
    }
  };
  const sessionDirectory = path.join(sessionRoot, existingSession.sessionId);
  const outputs = [
    ['author-stage-8-cleanup.json', `${JSON.stringify(document, null, 2)}\n`],
    ['author-stage-8-cleanup.txt', previewText],
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
  return { session: updatedSession, documentPath: path.join(sessionDirectory, 'author-stage-8-cleanup.json'), previewPath: path.join(sessionDirectory, 'author-stage-8-cleanup.txt') };
}
