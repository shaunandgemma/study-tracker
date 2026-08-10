import { randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const AUTHOR_ASSISTANT_SCHEMA_VERSION = 1;
export const AUTHOR_ASSISTANT_ALLOWED_DOMAINS = Object.freeze(['docs.aws.amazon.com']);
export const AUTHOR_ASSISTANT_LEARNER_LEVELS = Object.freeze(['Beginner', 'Intermediate', 'Advanced']);

function clean(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function normalizeLearnerLevel(value) {
  const wanted = clean(value).toLowerCase();
  return AUTHOR_ASSISTANT_LEARNER_LEVELS.find(level => level.toLowerCase() === wanted) || '';
}

function normalizeRegion(value) {
  return clean(value).toLowerCase();
}

export function normalizeAuthorAssistantInput(input = {}) {
  return {
    serviceName: clean(input.serviceName),
    shortName: clean(input.shortName).toUpperCase(),
    learnerLevel: normalizeLearnerLevel(input.learnerLevel),
    buildOutcome: clean(input.buildOutcome),
    preferredRegion: normalizeRegion(input.preferredRegion)
  };
}

export function validateAuthorAssistantInput(input = {}) {
  const normalized = normalizeAuthorAssistantInput(input);
  const errors = [];

  if (!normalized.serviceName) errors.push('Enter the official AWS service name.');
  if (!normalized.shortName) errors.push('Enter a short service name.');
  if (!normalized.learnerLevel) errors.push('Choose Beginner, Intermediate or Advanced.');
  if (normalized.buildOutcome.length < 10) errors.push('Describe what the learner will build in at least 10 characters.');
  if (!normalized.preferredRegion) errors.push('Enter an AWS Region or global.');
  if (normalized.preferredRegion && normalized.preferredRegion !== 'global' && !/^[a-z]{2}(?:-gov)?-[a-z]+-\d$/.test(normalized.preferredRegion)) {
    errors.push('Use an AWS Region such as eu-west-2, or enter global.');
  }

  return { valid: errors.length === 0, errors, input: normalized };
}

export function getDefaultSessionRoot(environment = process.env, platform = process.platform) {
  if (clean(environment.AUTHOR_ASSISTANT_HOME)) return path.resolve(environment.AUTHOR_ASSISTANT_HOME);
  if (platform === 'win32' && clean(environment.LOCALAPPDATA)) {
    return path.join(environment.LOCALAPPDATA, 'StudyTracker', 'AuthorAssistant');
  }
  if (clean(environment.XDG_STATE_HOME)) {
    return path.join(environment.XDG_STATE_HOME, 'study-tracker', 'author-assistant');
  }
  return path.join(os.homedir(), '.local', 'state', 'study-tracker', 'author-assistant');
}

export function buildAuthorAssistantSession(input, { now = () => new Date(), idFactory = randomUUID } = {}) {
  const checked = validateAuthorAssistantInput(input);
  if (!checked.valid) throw new Error(checked.errors.join(' '));

  const timestamp = now().toISOString();
  const serviceSlug = slugify(checked.input.shortName || checked.input.serviceName);
  const sessionId = `author-assistant-${serviceSlug}-${idFactory()}`;

  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    sessionId,
    status: 'input_complete',
    currentStep: 'research_request_ready',
    createdAt: timestamp,
    updatedAt: timestamp,
    inputs: checked.input,
    boundaries: {
      authorStagesPrepared: [],
      stopBeforeAuthorStage: 12,
      aiCalled: false,
      awsConnected: false,
      supabaseConnected: false,
      candidatePrepared: false,
      published: false
    }
  };
}

export function buildAwsResearchRequest(session) {
  if (!session?.sessionId || session?.status !== 'input_complete') {
    throw new Error('A complete Author Assistant session is required.');
  }

  return {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'aws_documentation_research_request',
    status: 'pending_research',
    sessionId: session.sessionId,
    createdAt: session.createdAt,
    allowedDomains: [...AUTHOR_ASSISTANT_ALLOWED_DOMAINS],
    service: {
      officialName: session.inputs.serviceName,
      shortName: session.inputs.shortName
    },
    learner: {
      level: session.inputs.learnerLevel,
      buildOutcome: session.inputs.buildOutcome,
      preferredRegion: session.inputs.preferredRegion
    },
    requiredSourceTypes: [
      'AWS service guide for Console instructions',
      'AWS CLI Command Reference for commands and parameters',
      'AWS Service Authorization Reference for IAM permissions'
    ],
    requiredSourceFields: ['documentTitle', 'url', 'checkedAt', 'supportedTaskIds', 'whyThisSourceApplies'],
    authorBoundary: {
      prepareStages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      stopBeforeStage: 12
    }
  };
}

async function writeJsonAtomically(filePath, value) {
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  await rename(temporaryPath, filePath);
}

async function readOptionalJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

export async function saveAuthorAssistantSession({ sessionRoot, session, researchRequest } = {}) {
  if (!sessionRoot) throw new Error('A session folder is required.');
  if (!session?.sessionId) throw new Error('A valid session is required.');
  if (researchRequest?.sessionId !== session.sessionId) throw new Error('The research request does not match the session.');

  const sessionDirectory = path.join(sessionRoot, session.sessionId);
  await mkdir(sessionDirectory, { recursive: true });
  await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), session);
  await writeJsonAtomically(path.join(sessionDirectory, 'research-request.json'), researchRequest);

  return {
    sessionDirectory,
    sessionPath: path.join(sessionDirectory, 'session.json'),
    researchRequestPath: path.join(sessionDirectory, 'research-request.json')
  };
}

export async function loadAuthorAssistantSession(sessionRoot, sessionId) {
  const sessionDirectory = path.join(sessionRoot, sessionId);
  const [sessionText, researchText, researchResult, acceptedSources, blueprint, blueprintAcceptance, stageSixInstructions, stageSevenResourcesChecks, stageEightCleanup, stageNineAuthoringCheck, stageTenLearnerPreview, stageElevenStructuredReview] = await Promise.all([
    readFile(path.join(sessionDirectory, 'session.json'), 'utf8'),
    readFile(path.join(sessionDirectory, 'research-request.json'), 'utf8'),
    readOptionalJson(path.join(sessionDirectory, 'research-result.json')),
    readOptionalJson(path.join(sessionDirectory, 'accepted-sources.json')),
    readOptionalJson(path.join(sessionDirectory, 'author-stages-1-5-blueprint.json')),
    readOptionalJson(path.join(sessionDirectory, 'author-stages-1-5-acceptance.json')),
    readOptionalJson(path.join(sessionDirectory, 'author-stage-6-instructions.json')),
    readOptionalJson(path.join(sessionDirectory, 'author-stage-7-resources-checks.json')),
    readOptionalJson(path.join(sessionDirectory, 'author-stage-8-cleanup.json')),
    readOptionalJson(path.join(sessionDirectory, 'author-stage-9-authoring-check.json')),
    readOptionalJson(path.join(sessionDirectory, 'author-stage-10-learner-preview.json')),
    readOptionalJson(path.join(sessionDirectory, 'author-stage-11-structured-review.json'))
  ]);
  const session = JSON.parse(sessionText);
  const researchRequest = JSON.parse(researchText);
  if (
    session.sessionId !== sessionId
    || researchRequest.sessionId !== sessionId
    || (researchResult && researchResult.sessionId !== sessionId)
    || (acceptedSources && acceptedSources.sessionId !== sessionId)
    || (blueprint && blueprint.sessionId !== sessionId)
    || (blueprintAcceptance && blueprintAcceptance.sessionId !== sessionId)
    || (stageSixInstructions && stageSixInstructions.sessionId !== sessionId)
    || (stageSevenResourcesChecks && stageSevenResourcesChecks.sessionId !== sessionId)
    || (stageEightCleanup && stageEightCleanup.sessionId !== sessionId)
    || (stageNineAuthoringCheck && stageNineAuthoringCheck.sessionId !== sessionId)
    || (stageTenLearnerPreview && stageTenLearnerPreview.sessionId !== sessionId)
    || (stageElevenStructuredReview && stageElevenStructuredReview.sessionId !== sessionId)
  ) {
    throw new Error('The saved session files do not match.');
  }
  return { session, researchRequest, researchResult, acceptedSources, blueprint, blueprintAcceptance, stageSixInstructions, stageSevenResourcesChecks, stageEightCleanup, stageNineAuthoringCheck, stageTenLearnerPreview, stageElevenStructuredReview, sessionDirectory };
}

export async function saveAuthorAssistantResearchResult({ sessionRoot, session, researchResult, now = () => new Date() } = {}) {
  if (!sessionRoot || !session?.sessionId) throw new Error('A saved session is required.');
  if (researchResult?.sessionId !== session.sessionId) throw new Error('The research result does not match the session.');

  const sessionDirectory = path.join(sessionRoot, session.sessionId);
  const updatedSession = {
    ...session,
    status: 'research_ready_for_review',
    currentStep: 'source_acceptance',
    updatedAt: now().toISOString(),
    boundaries: { ...session.boundaries, aiCalled: true }
  };
  await writeJsonAtomically(path.join(sessionDirectory, 'research-result.json'), researchResult);
  await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), updatedSession);
  return { session: updatedSession, researchResultPath: path.join(sessionDirectory, 'research-result.json') };
}

export async function saveAuthorAssistantAcceptedSources({ sessionRoot, session, acceptedSources, now = () => new Date() } = {}) {
  if (!sessionRoot || !session?.sessionId) throw new Error('A saved session is required.');
  if (acceptedSources?.sessionId !== session.sessionId) throw new Error('The accepted sources do not match the session.');

  const sessionDirectory = path.join(sessionRoot, session.sessionId);
  const hasAcceptedSources = acceptedSources.sources.length > 0;
  const updatedSession = {
    ...session,
    status: hasAcceptedSources ? 'sources_accepted' : 'research_needs_review',
    currentStep: hasAcceptedSources ? 'aws_sources_accepted' : 'source_acceptance',
    updatedAt: now().toISOString(),
    boundaries: { ...session.boundaries, authorStagesPrepared: [] }
  };
  await writeJsonAtomically(path.join(sessionDirectory, 'accepted-sources.json'), acceptedSources);
  await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), updatedSession);
  return { session: updatedSession, acceptedSourcesPath: path.join(sessionDirectory, 'accepted-sources.json') };
}

export async function saveAuthorAssistantBlueprint({ sessionRoot, session, blueprint, previewText, now = () => new Date() } = {}) {
  if (!sessionRoot || !session?.sessionId) throw new Error('A saved session is required.');
  if (blueprint?.sessionId !== session.sessionId) throw new Error('The blueprint does not match the session.');
  if (blueprint?.stageBoundary?.writtenToAuthor !== false || blueprint?.stageBoundary?.preparedLocally?.join(',') !== '1,2,3,4,5') {
    throw new Error('Only a local Stages 1-5 blueprint can be saved at this boundary.');
  }
  const sessionDirectory = path.join(sessionRoot, session.sessionId);
  const updatedSession = {
    ...session,
    status: 'blueprint_ready_for_review',
    currentStep: 'local_stages_1_5_blueprint_review',
    updatedAt: now().toISOString(),
    boundaries: {
      ...session.boundaries,
      authorStagesPrepared: [1, 2, 3, 4, 5],
      authorDraftWritten: false,
      stage6Prepared: false
    }
  };
  await writeJsonAtomically(path.join(sessionDirectory, 'author-stages-1-5-blueprint.json'), blueprint);
  const previewPath = path.join(sessionDirectory, 'author-stages-1-5-blueprint.txt');
  const temporaryPreviewPath = `${previewPath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPreviewPath, previewText, { encoding: 'utf8', flag: 'wx' });
  await rename(temporaryPreviewPath, previewPath);
  await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), updatedSession);
  return {
    session: updatedSession,
    blueprintPath: path.join(sessionDirectory, 'author-stages-1-5-blueprint.json'),
    previewPath
  };
}

function assertLocalBlueprintBoundary(blueprint) {
  const boundary = blueprint?.stageBoundary;
  if (
    !boundary
    || boundary.preparedLocally?.join(',') !== '1,2,3,4,5'
    || boundary.notPrepared?.join(',') !== '6,7,8,9,10,11,12'
    || boundary.writtenToAuthor !== false
    || boundary.connectedToSupabase !== false
    || boundary.connectedToAws !== false
    || boundary.candidatePrepared !== false
    || boundary.published !== false
  ) {
    throw new Error('Blueprint acceptance stopped because a safety boundary changed.');
  }
}

export function consolidateDuplicateReviewFindings(findings = [], duplicateGroups = []) {
  if (!Array.isArray(findings) || findings.some(finding => typeof finding !== 'string' || !finding.trim())) {
    throw new Error('Blueprint review findings are invalid.');
  }
  if (!Array.isArray(duplicateGroups)) throw new Error('Duplicate review groups are invalid.');

  const removedIndexes = new Set();
  const groups = duplicateGroups.map(group => {
    if (!Array.isArray(group) || group.length < 2) throw new Error('Each duplicate review group must identify at least two findings.');
    const uniqueIndexes = [...new Set(group)];
    if (uniqueIndexes.length !== group.length) throw new Error('A duplicate review group contains the same finding more than once.');
    for (const index of uniqueIndexes) {
      if (!Number.isInteger(index) || index < 0 || index >= findings.length) {
        throw new Error('A duplicate review group refers to a missing finding.');
      }
      if (removedIndexes.has(index)) throw new Error('A review finding cannot belong to more than one duplicate group.');
    }
    uniqueIndexes.slice(1).forEach(index => removedIndexes.add(index));
    return {
      keptIndex: uniqueIndexes[0],
      removedIndexes: uniqueIndexes.slice(1),
      keptFinding: findings[uniqueIndexes[0]],
      removedFindings: uniqueIndexes.slice(1).map(index => findings[index])
    };
  });

  return {
    findings: findings.filter((_, index) => !removedIndexes.has(index)),
    audit: groups,
    removedCount: removedIndexes.size
  };
}

export async function saveAuthorAssistantBlueprintAcceptance({
  sessionRoot,
  session,
  blueprint,
  duplicateGroups = [],
  now = () => new Date()
} = {}) {
  if (!sessionRoot || !session?.sessionId) throw new Error('A saved session is required.');
  if (blueprint?.sessionId !== session.sessionId) throw new Error('The blueprint does not match the session.');
  if (session.status !== 'blueprint_ready_for_review' || blueprint.status !== 'awaiting_human_blueprint_review') {
    throw new Error('Only a blueprint waiting for human review can be accepted.');
  }
  assertLocalBlueprintBoundary(blueprint);
  if (session.boundaries?.stage6Prepared !== false || session.boundaries?.authorDraftWritten !== false) {
    throw new Error('Blueprint acceptance stopped because a session safety boundary changed.');
  }

  const acceptedAt = now().toISOString();
  const consolidation = consolidateDuplicateReviewFindings(blueprint.manualReviewFindings, duplicateGroups);
  const acceptedBlueprint = {
    ...blueprint,
    status: 'human_accepted',
    acceptedAt,
    manualReviewFindings: consolidation.findings
  };
  const acceptance = {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_stages_1_to_5_human_acceptance',
    status: 'accepted',
    sessionId: session.sessionId,
    acceptedAt,
    decision: 'accept_local_stages_1_to_5_blueprint',
    reviewConsolidation: {
      originalFindingCount: blueprint.manualReviewFindings.length,
      acceptedFindingCount: consolidation.findings.length,
      removedDuplicateCount: consolidation.removedCount,
      groups: consolidation.audit
    },
    stageBoundary: { ...acceptedBlueprint.stageBoundary }
  };
  const updatedSession = {
    ...session,
    status: 'blueprint_accepted',
    currentStep: 'local_stages_1_5_blueprint_accepted',
    updatedAt: acceptedAt,
    boundaries: {
      ...session.boundaries,
      authorStagesPrepared: [1, 2, 3, 4, 5],
      authorDraftWritten: false,
      stage6Prepared: false
    }
  };
  const sessionDirectory = path.join(sessionRoot, session.sessionId);
  await writeJsonAtomically(path.join(sessionDirectory, 'author-stages-1-5-blueprint.json'), acceptedBlueprint);
  await writeJsonAtomically(path.join(sessionDirectory, 'author-stages-1-5-acceptance.json'), acceptance);
  await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), updatedSession);
  return {
    session: updatedSession,
    blueprint: acceptedBlueprint,
    acceptance,
    blueprintPath: path.join(sessionDirectory, 'author-stages-1-5-blueprint.json'),
    acceptancePath: path.join(sessionDirectory, 'author-stages-1-5-acceptance.json')
  };
}

export async function saveAuthorAssistantStageSixInstructions({
  sessionRoot,
  session,
  instructions,
  previewText,
  now = () => new Date()
} = {}) {
  if (!sessionRoot || !session?.sessionId) throw new Error('A saved session is required.');
  if (session.status !== 'blueprint_accepted' || instructions?.sessionId !== session.sessionId) {
    throw new Error('Accepted local Stages 1-5 are required before saving Stage 6.');
  }
  const boundary = instructions.stageBoundary;
  if (
    boundary?.preparedLocally?.join(',') !== '6'
    || boundary?.notPrepared?.join(',') !== '7,8,9,10,11,12'
    || boundary?.writtenToAuthor !== false
    || boundary?.connectedToSupabase !== false
    || boundary?.connectedToAws !== false
    || boundary?.candidatePrepared !== false
    || boundary?.published !== false
  ) {
    throw new Error('Only local Stage 6 instructions can be saved at this boundary.');
  }
  const sessionDirectory = path.join(sessionRoot, session.sessionId);
  const updatedSession = {
    ...session,
    status: 'stage_6_ready_for_review',
    currentStep: 'local_stage_6_instruction_review',
    updatedAt: now().toISOString(),
    boundaries: {
      ...session.boundaries,
      authorStagesPrepared: [1, 2, 3, 4, 5, 6],
      authorDraftWritten: false,
      stage6Prepared: true,
      stage7Prepared: false
    }
  };
  await writeJsonAtomically(path.join(sessionDirectory, 'author-stage-6-instructions.json'), instructions);
  const previewPath = path.join(sessionDirectory, 'author-stage-6-instructions.txt');
  const temporaryPreviewPath = `${previewPath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPreviewPath, previewText, { encoding: 'utf8', flag: 'wx' });
  await rename(temporaryPreviewPath, previewPath);
  await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), updatedSession);
  return {
    session: updatedSession,
    instructionsPath: path.join(sessionDirectory, 'author-stage-6-instructions.json'),
    previewPath
  };
}

export async function saveAuthorAssistantStageSixRevision({
  sessionRoot,
  session,
  existingInstructions,
  revisedInstructions,
  previewText,
  now = () => new Date()
} = {}) {
  if (!sessionRoot || !session?.sessionId) throw new Error('A saved session is required.');
  if (
    session.status !== 'stage_6_ready_for_review'
    || existingInstructions?.sessionId !== session.sessionId
    || revisedInstructions?.sessionId !== session.sessionId
    || !['84A', '84B'].includes(revisedInstructions?.boundaryAlignment?.approvalStep)
  ) {
    throw new Error('Only an approved Step 84A Stage 6 revision can be saved.');
  }
  const boundary = revisedInstructions.stageBoundary;
  if (
    boundary?.preparedLocally?.join(',') !== '6'
    || boundary?.notPrepared?.join(',') !== '7,8,9,10,11,12'
    || boundary?.writtenToAuthor !== false
    || boundary?.connectedToSupabase !== false
    || boundary?.connectedToAws !== false
    || boundary?.candidatePrepared !== false
    || boundary?.published !== false
    || session.boundaries?.stage7Prepared !== false
    || session.boundaries?.authorDraftWritten !== false
  ) {
    throw new Error('Step 84A stopped because a Stage 6 safety boundary changed.');
  }
  const affected = new Set(revisedInstructions.boundaryAlignment.affectedTaskIds);
  for (const oldTask of existingInstructions.tasks || []) {
    if (affected.has(oldTask.taskId)) continue;
    const revisedTask = revisedInstructions.tasks.find(task => task.taskId === oldTask.taskId);
    if (JSON.stringify(revisedTask) !== JSON.stringify(oldTask)) {
      throw new Error('Step 84A attempted to change an unaffected Stage 6 task.');
    }
  }
  const updatedSession = {
    ...session,
    status: 'stage_6_ready_for_review',
    currentStep: 'local_stage_6_instruction_review',
    updatedAt: now().toISOString(),
    boundaries: {
      ...session.boundaries,
      authorStagesPrepared: [1, 2, 3, 4, 5, 6],
      authorDraftWritten: false,
      stage6Prepared: true,
      stage7Prepared: false
    }
  };
  const sessionDirectory = path.join(sessionRoot, session.sessionId);
  await writeJsonAtomically(path.join(sessionDirectory, 'author-stage-6-instructions.json'), revisedInstructions);
  const previewPath = path.join(sessionDirectory, 'author-stage-6-instructions.txt');
  const temporaryPreviewPath = `${previewPath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPreviewPath, previewText, { encoding: 'utf8', flag: 'wx' });
  await rename(temporaryPreviewPath, previewPath);
  await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), updatedSession);
  return {
    session: updatedSession,
    instructionsPath: path.join(sessionDirectory, 'author-stage-6-instructions.json'),
    previewPath
  };
}

export async function saveAuthorAssistantStage84BRevision({
  sessionRoot,
  session,
  existingAcceptedSources,
  amendedAcceptedSources,
  existingBlueprint,
  amendedBlueprint,
  existingInstructions,
  revisedInstructions,
  amendment,
  previewText,
  now = () => new Date()
} = {}) {
  if (!sessionRoot || !session?.sessionId || amendment?.approvalStep !== '84B') {
    throw new Error('A valid approved Step 84B revision is required.');
  }
  if (
    session.status !== 'stage_6_ready_for_review'
    || existingAcceptedSources?.sessionId !== session.sessionId
    || amendedAcceptedSources?.sessionId !== session.sessionId
    || existingBlueprint?.sessionId !== session.sessionId
    || amendedBlueprint?.sessionId !== session.sessionId
    || existingInstructions?.sessionId !== session.sessionId
    || revisedInstructions?.sessionId !== session.sessionId
    || revisedInstructions.boundaryAlignment?.alignmentId !== amendment.alignmentId
  ) {
    throw new Error('The Step 84B files do not belong to the same saved session.');
  }
  const boundary = revisedInstructions.stageBoundary;
  if (
    boundary?.preparedLocally?.join(',') !== '6'
    || boundary?.notPrepared?.join(',') !== '7,8,9,10,11,12'
    || boundary?.writtenToAuthor !== false
    || boundary?.connectedToSupabase !== false
    || boundary?.connectedToAws !== false
    || boundary?.candidatePrepared !== false
    || boundary?.published !== false
    || session.boundaries?.stage7Prepared !== false
    || session.boundaries?.authorDraftWritten !== false
  ) {
    throw new Error('Step 84B stopped because a safety boundary changed.');
  }
  const approvedUrls = amendment.approvedSources.map(source => source.url);
  const oldAcceptedCount = existingAcceptedSources.sources.length;
  if (
    JSON.stringify(amendedAcceptedSources.sources.slice(0, oldAcceptedCount)) !== JSON.stringify(existingAcceptedSources.sources)
    || JSON.stringify(amendedAcceptedSources.sources.slice(oldAcceptedCount).map(source => source.url)) !== JSON.stringify(approvedUrls)
  ) {
    throw new Error('Step 84B attempted to accept a source outside the two approved URLs.');
  }
  const oldSourceCount = existingBlueprint.sources.length;
  if (JSON.stringify(amendedBlueprint.sources.slice(0, oldSourceCount)) !== JSON.stringify(existingBlueprint.sources)) {
    throw new Error('Step 84B attempted to change an existing blueprint source.');
  }
  const affectedTaskId = amendment.affectedTaskIds[0];
  for (const source of amendedBlueprint.sources.slice(oldSourceCount)) {
    if (!approvedUrls.includes(source.url) || source.taskIds?.join(',') !== affectedTaskId) {
      throw new Error('Step 84B sources must link only to the approved safe-scope task.');
    }
  }
  const addedBlueprintSourceIds = amendedBlueprint.sources.slice(oldSourceCount).map(source => source.id);
  for (const oldTask of existingBlueprint.tasks || []) {
    const amendedTask = amendedBlueprint.tasks.find(task => task.id === oldTask.id);
    if (!amendedTask) throw new Error('Step 84B attempted to remove a blueprint task.');
    if (oldTask.id !== affectedTaskId) {
      if (JSON.stringify(amendedTask) !== JSON.stringify(oldTask)) {
        throw new Error('Step 84B attempted to change an unaffected blueprint task.');
      }
      continue;
    }
    const { sourceIds: oldSourceIds, ...oldTaskWithoutSources } = oldTask;
    const { sourceIds: amendedSourceIds, ...amendedTaskWithoutSources } = amendedTask;
    if (
      JSON.stringify(amendedTaskWithoutSources) !== JSON.stringify(oldTaskWithoutSources)
      || JSON.stringify(amendedSourceIds) !== JSON.stringify([...(oldSourceIds || []), ...addedBlueprintSourceIds])
    ) {
      throw new Error('Step 84B may only add the two approved source links to the safe-scope task.');
    }
  }
  for (const oldTask of existingInstructions.tasks || []) {
    if (oldTask.taskId === affectedTaskId) continue;
    const revisedTask = revisedInstructions.tasks.find(task => task.taskId === oldTask.taskId);
    if (JSON.stringify(revisedTask) !== JSON.stringify(oldTask)) {
      throw new Error('Step 84B attempted to change one of the five protected Stage 6 tasks.');
    }
  }
  const updatedAt = now().toISOString();
  const updatedSession = {
    ...session,
    status: 'stage_6_ready_for_review',
    currentStep: 'local_stage_6_instruction_review',
    updatedAt,
    boundaries: {
      ...session.boundaries,
      authorStagesPrepared: [1, 2, 3, 4, 5, 6],
      authorDraftWritten: false,
      stage6Prepared: true,
      stage7Prepared: false
    }
  };
  const audit = {
    schemaVersion: AUTHOR_ASSISTANT_SCHEMA_VERSION,
    kind: 'author_stage_6_source_amendment',
    status: 'applied_locally',
    sessionId: session.sessionId,
    approvalStep: '84B',
    alignmentId: amendment.alignmentId,
    appliedAt: updatedAt,
    acceptedSourceUrls: approvedUrls,
    linkedTaskIds: [...amendment.affectedTaskIds],
    protectedTaskIds: existingInstructions.tasks.map(task => task.taskId).filter(taskId => taskId !== affectedTaskId),
    wroteToAuthor: false,
    beganStage7: false
  };
  const sessionDirectory = path.join(sessionRoot, session.sessionId);
  const outputs = [
    ['accepted-sources.json', `${JSON.stringify(amendedAcceptedSources, null, 2)}\n`],
    ['author-stages-1-5-blueprint.json', `${JSON.stringify(amendedBlueprint, null, 2)}\n`],
    ['author-stage-6-instructions.json', `${JSON.stringify(revisedInstructions, null, 2)}\n`],
    ['author-stage-6-instructions.txt', previewText],
    ['author-stage-6-source-amendment-84b.json', `${JSON.stringify(audit, null, 2)}\n`],
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
    audit,
    instructionsPath: path.join(sessionDirectory, 'author-stage-6-instructions.json'),
    previewPath: path.join(sessionDirectory, 'author-stage-6-instructions.txt'),
    acceptedSourcesPath: path.join(sessionDirectory, 'accepted-sources.json'),
    blueprintPath: path.join(sessionDirectory, 'author-stages-1-5-blueprint.json'),
    auditPath: path.join(sessionDirectory, 'author-stage-6-source-amendment-84b.json')
  };
}

export async function saveAuthorAssistantStage84CCorrection({
  sessionRoot,
  existingSession,
  correctedSession,
  existingAcceptedSources,
  correctedAcceptedSources,
  existingInstructions,
  correctedInstructions,
  audit
} = {}) {
  if (!sessionRoot || !existingSession?.sessionId || audit?.approvalStep !== '84C') {
    throw new Error('A valid approved Step 84C correction is required.');
  }
  const sessionId = existingSession.sessionId;
  if (
    correctedSession?.sessionId !== sessionId
    || existingAcceptedSources?.sessionId !== sessionId
    || correctedAcceptedSources?.sessionId !== sessionId
    || existingInstructions?.sessionId !== sessionId
    || correctedInstructions?.sessionId !== sessionId
    || audit.sessionId !== sessionId
  ) {
    throw new Error('The Step 84C files do not belong to the same session.');
  }
  if (
    correctedSession.status !== 'stage_6_ready_for_review'
    || correctedSession.boundaries?.authorDraftWritten !== false
    || correctedSession.boundaries?.stage7Prepared !== false
    || audit.stage6Accepted !== false
    || audit.wroteToAuthor !== false
    || audit.beganStage7 !== false
  ) {
    throw new Error('Step 84C stopped because a safety boundary changed.');
  }
  const { manualReviewResolutions: oldResolutions = [], ...oldSourceRecord } = existingAcceptedSources;
  const { manualReviewResolutions: newResolutions = [], ...newSourceRecord } = correctedAcceptedSources;
  if (
    JSON.stringify(newSourceRecord) !== JSON.stringify(oldSourceRecord)
    || newResolutions.length !== oldResolutions.length + 1
    || JSON.stringify(newResolutions.slice(0, oldResolutions.length)) !== JSON.stringify(oldResolutions)
    || newResolutions.at(-1)?.approvalStep !== '84C'
    || newResolutions.at(-1)?.finding !== audit.historicalFindingPreserved
  ) {
    throw new Error('Step 84C may only append the approved Region-finding resolution.');
  }
  if (!correctedAcceptedSources.manualReviewFindings.includes(audit.activeIamFindingPreserved)) {
    throw new Error('Step 84C must preserve the active IAM warning.');
  }
  const changedTaskId = audit.taskId;
  for (const oldTask of existingInstructions.tasks || []) {
    const correctedTask = correctedInstructions.tasks.find(task => task.taskId === oldTask.taskId);
    if (!correctedTask) throw new Error('Step 84C attempted to remove a Stage 6 task.');
    if (oldTask.taskId !== changedTaskId && JSON.stringify(correctedTask) !== JSON.stringify(oldTask)) {
      throw new Error('Step 84C attempted to change a protected Stage 6 task.');
    }
  }
  const restoredInstructions = structuredClone(correctedInstructions);
  const restoredTask = restoredInstructions.tasks.find(task => task.taskId === changedTaskId);
  const restoredStep = restoredTask?.consoleSteps.find(step => step.instructions?.some(item => item.id === audit.changedInstructionId));
  const restoredItem = restoredStep?.instructions.find(item => item.id === audit.changedInstructionId);
  if (!restoredStep || !restoredItem) throw new Error('Step 84C could not audit the changed queue-name checkbox.');
  restoredItem.text = restoredItem.text.replace(audit.canonicalQueueName, audit.oldQueueName);
  restoredStep.instruction = restoredStep.instructions.map(item => item.text.trim()).filter(Boolean).join('\n');
  if (JSON.stringify(restoredInstructions) !== JSON.stringify(existingInstructions)) {
    throw new Error('Step 84C attempted to change more than the approved queue name.');
  }
  const sessionDirectory = path.join(sessionRoot, sessionId);
  const outputs = [
    ['accepted-sources.json', `${JSON.stringify(correctedAcceptedSources, null, 2)}\n`],
    ['author-stage-6-instructions.json', `${JSON.stringify(correctedInstructions, null, 2)}\n`],
    ['author-stage-6-consistency-correction-84c.json', `${JSON.stringify(audit, null, 2)}\n`],
    ['session.json', `${JSON.stringify(correctedSession, null, 2)}\n`]
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
    session: correctedSession,
    instructionsPath: path.join(sessionDirectory, 'author-stage-6-instructions.json'),
    acceptedSourcesPath: path.join(sessionDirectory, 'accepted-sources.json'),
    auditPath: path.join(sessionDirectory, 'author-stage-6-consistency-correction-84c.json')
  };
}

export async function saveAuthorAssistantStage84DAcceptance({
  sessionRoot,
  existingSession,
  acceptedSession,
  existingInstructions,
  acceptedInstructions,
  acceptance
} = {}) {
  if (!sessionRoot || !existingSession?.sessionId || acceptance?.approvalStep !== '84D') {
    throw new Error('A valid approved Step 84D acceptance is required.');
  }
  const sessionId = existingSession.sessionId;
  if (
    acceptedSession?.sessionId !== sessionId
    || existingInstructions?.sessionId !== sessionId
    || acceptedInstructions?.sessionId !== sessionId
    || acceptance.sessionId !== sessionId
  ) {
    throw new Error('The Step 84D records do not belong to the same session.');
  }
  if (
    existingSession.status !== 'stage_6_ready_for_review'
    || acceptedSession.status !== 'stage_6_accepted'
    || existingInstructions.status !== 'awaiting_human_stage_6_review'
    || acceptedInstructions.status !== 'human_accepted'
    || acceptedSession.boundaries?.authorDraftWritten !== false
    || acceptedSession.boundaries?.stage6Accepted !== true
    || acceptedSession.boundaries?.stage7Prepared !== false
    || acceptance.status !== 'accepted'
    || acceptance.supportRecordsChanged !== false
    || acceptance.wroteToAuthor !== false
    || acceptance.beganStage7 !== false
  ) {
    throw new Error('Step 84D stopped because an acceptance safety boundary changed.');
  }
  const {
    status: oldInstructionStatus,
    acceptedAt: oldAcceptedAt,
    acceptanceFingerprint: oldAcceptanceFingerprint,
    ...existingInstructionContent
  } = existingInstructions;
  const {
    status: newInstructionStatus,
    acceptedAt,
    acceptanceFingerprint,
    ...acceptedInstructionContent
  } = acceptedInstructions;
  if (
    oldInstructionStatus !== 'awaiting_human_stage_6_review'
    || oldAcceptedAt !== undefined
    || oldAcceptanceFingerprint !== undefined
    || newInstructionStatus !== 'human_accepted'
    || !acceptedAt
    || acceptanceFingerprint?.value !== acceptance.instructionFingerprint?.value
    || JSON.stringify(acceptedInstructionContent) !== JSON.stringify(existingInstructionContent)
  ) {
    throw new Error('Step 84D attempted to change the accepted Stage 6 content.');
  }
  const sessionDirectory = path.join(sessionRoot, sessionId);
  const outputs = [
    ['author-stage-6-instructions.json', `${JSON.stringify(acceptedInstructions, null, 2)}\n`],
    ['author-stage-6-acceptance-84d.json', `${JSON.stringify(acceptance, null, 2)}\n`],
    ['session.json', `${JSON.stringify(acceptedSession, null, 2)}\n`]
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
    session: acceptedSession,
    instructionsPath: path.join(sessionDirectory, 'author-stage-6-instructions.json'),
    acceptancePath: path.join(sessionDirectory, 'author-stage-6-acceptance-84d.json')
  };
}

export async function saveAuthorAssistantStage85BAcceptance({
  sessionRoot,
  existingSession,
  acceptedSession,
  existingStageSeven,
  acceptedStageSeven,
  acceptance
} = {}) {
  if (!sessionRoot || !existingSession?.sessionId || acceptance?.approvalStep !== '85B') {
    throw new Error('A valid approved Step 85B acceptance is required.');
  }
  const sessionId = existingSession.sessionId;
  if (
    acceptedSession?.sessionId !== sessionId
    || existingStageSeven?.sessionId !== sessionId
    || acceptedStageSeven?.sessionId !== sessionId
    || acceptance.sessionId !== sessionId
  ) throw new Error('The Step 85B records do not belong to the same session.');
  if (
    existingSession.status !== 'stage_7_ready_for_review'
    || acceptedSession.status !== 'stage_7_accepted'
    || existingStageSeven.status !== 'awaiting_human_stage_7_review'
    || acceptedStageSeven.status !== 'human_accepted'
    || acceptedSession.boundaries?.stage7Accepted !== true
    || acceptedSession.boundaries?.stage8Prepared !== false
    || acceptedSession.boundaries?.authorDraftWritten !== false
    || acceptance.status !== 'accepted'
    || acceptance.stagesOneToSixChanged !== false
    || acceptance.wroteToAuthor !== false
    || acceptance.connectedToAws !== false
    || acceptance.connectedToSupabase !== false
    || acceptance.beganStage8 !== false
  ) throw new Error('Step 85B stopped because an acceptance safety boundary changed.');
  const {
    status: oldStatus,
    acceptedAt: oldAcceptedAt,
    acceptanceFingerprint: oldAcceptanceFingerprint,
    ...existingContent
  } = existingStageSeven;
  const {
    status: newStatus,
    acceptedAt,
    acceptanceFingerprint,
    ...acceptedContent
  } = acceptedStageSeven;
  if (
    oldStatus !== 'awaiting_human_stage_7_review'
    || oldAcceptedAt !== undefined
    || oldAcceptanceFingerprint !== undefined
    || newStatus !== 'human_accepted'
    || !acceptedAt
    || acceptanceFingerprint?.value !== acceptance.stageSevenFingerprint?.value
    || JSON.stringify(acceptedContent) !== JSON.stringify(existingContent)
  ) throw new Error('Step 85B attempted to change the accepted Stage 7 content.');

  const sessionDirectory = path.join(sessionRoot, sessionId);
  const outputs = [
    ['author-stage-7-resources-checks.json', `${JSON.stringify(acceptedStageSeven, null, 2)}\n`],
    ['author-stage-7-acceptance-85b.json', `${JSON.stringify(acceptance, null, 2)}\n`],
    ['session.json', `${JSON.stringify(acceptedSession, null, 2)}\n`]
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
    session: acceptedSession,
    stageSevenPath: path.join(sessionDirectory, 'author-stage-7-resources-checks.json'),
    acceptancePath: path.join(sessionDirectory, 'author-stage-7-acceptance-85b.json')
  };
}

export async function saveAuthorAssistantStage86AAcceptance({
  sessionRoot,
  existingSession,
  acceptedSession,
  existingStageEight,
  acceptedStageEight,
  acceptance
} = {}) {
  if (!sessionRoot || !existingSession?.sessionId || acceptance?.approvalStep !== '86A') throw new Error('A valid approved Step 86A acceptance is required.');
  const sessionId = existingSession.sessionId;
  if (
    acceptedSession?.sessionId !== sessionId
    || existingStageEight?.sessionId !== sessionId
    || acceptedStageEight?.sessionId !== sessionId
    || acceptance.sessionId !== sessionId
  ) throw new Error('The Step 86A records do not belong to the same session.');
  if (
    existingSession.status !== 'stage_8_ready_for_review'
    || acceptedSession.status !== 'stage_8_accepted'
    || existingStageEight.status !== 'awaiting_human_stage_8_review'
    || acceptedStageEight.status !== 'human_accepted'
    || acceptedSession.boundaries?.stage8Accepted !== true
    || acceptedSession.boundaries?.stage9Prepared !== false
    || acceptedSession.boundaries?.authorDraftWritten !== false
    || acceptance.status !== 'accepted'
    || acceptance.stagesOneToSevenChanged !== false
    || acceptance.wroteToAuthor !== false
    || acceptance.connectedToAws !== false
    || acceptance.connectedToSupabase !== false
    || acceptance.beganStage9 !== false
  ) throw new Error('Step 86A stopped because an acceptance safety boundary changed.');
  const { status: oldStatus, acceptedAt: oldAcceptedAt, acceptanceFingerprint: oldAcceptanceFingerprint, ...existingContent } = existingStageEight;
  const { status: newStatus, acceptedAt, acceptanceFingerprint, ...acceptedContent } = acceptedStageEight;
  if (
    oldStatus !== 'awaiting_human_stage_8_review'
    || oldAcceptedAt !== undefined
    || oldAcceptanceFingerprint !== undefined
    || newStatus !== 'human_accepted'
    || !acceptedAt
    || acceptanceFingerprint?.value !== acceptance.stageEightFingerprint?.value
    || JSON.stringify(acceptedContent) !== JSON.stringify(existingContent)
  ) throw new Error('Step 86A attempted to change the accepted Stage 8 content.');
  const sessionDirectory = path.join(sessionRoot, sessionId);
  const outputs = [
    ['author-stage-8-cleanup.json', `${JSON.stringify(acceptedStageEight, null, 2)}\n`],
    ['author-stage-8-acceptance-86a.json', `${JSON.stringify(acceptance, null, 2)}\n`],
    ['session.json', `${JSON.stringify(acceptedSession, null, 2)}\n`]
  ];
  const temporaryFiles = [];
  for (const [filename, contents] of outputs) {
    const finalPath = path.join(sessionDirectory, filename);
    const temporaryPath = `${finalPath}.${randomUUID()}.tmp`;
    await writeFile(temporaryPath, contents, { encoding: 'utf8', flag: 'wx' });
    temporaryFiles.push([temporaryPath, finalPath]);
  }
  for (const [temporaryPath, finalPath] of temporaryFiles) await rename(temporaryPath, finalPath);
  return { session: acceptedSession, stageEightPath: path.join(sessionDirectory, 'author-stage-8-cleanup.json'), acceptancePath: path.join(sessionDirectory, 'author-stage-8-acceptance-86a.json') };
}

export async function saveAuthorAssistantStageNineCheck({ sessionRoot, existingSession, document, previewText, now = () => new Date() } = {}) {
  if (!sessionRoot || !existingSession?.sessionId || document?.sessionId !== existingSession.sessionId) throw new Error('A valid local Stage 9 check is required.');
  if (
    existingSession.status !== 'stage_8_accepted'
    || document.kind !== 'author_stage_9_local_authoring_check'
    || !['needs_correction', 'passed_awaiting_human_review'].includes(document.status)
    || document.stageBoundary?.preparedLocally?.join(',') !== '9'
    || document.stageBoundary?.notPrepared?.join(',') !== '10,11,12'
    || document.stageBoundary?.writtenToAuthor !== false
    || document.stageBoundary?.connectedToSupabase !== false
    || document.stageBoundary?.connectedToAws !== false
    || document.acceptedStagesOneToEightChanged !== false
    || existingSession.boundaries?.stage9Prepared !== false
  ) throw new Error('Step 87 stopped because a local-only safety boundary changed.');
  const updatedAt = now().toISOString();
  const session = {
    ...existingSession,
    status: document.summary?.passed ? 'stage_9_ready_for_review' : 'stage_9_needs_correction',
    currentStep: document.summary?.passed ? 'local_stage_9_authoring_check_review' : 'local_stage_9_authoring_check_corrections',
    updatedAt,
    boundaries: {
      ...existingSession.boundaries,
      authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      stage9Prepared: true,
      stage10Prepared: false,
      authorDraftWritten: false,
      awsConnected: false,
      supabaseConnected: false
    }
  };
  const sessionDirectory = path.join(sessionRoot, existingSession.sessionId);
  await writeJsonAtomically(path.join(sessionDirectory, 'author-stage-9-authoring-check.json'), document);
  await writeFile(path.join(sessionDirectory, 'author-stage-9-authoring-check.txt'), previewText, 'utf8');
  await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), session);
  return {
    session,
    documentPath: path.join(sessionDirectory, 'author-stage-9-authoring-check.json'),
    previewPath: path.join(sessionDirectory, 'author-stage-9-authoring-check.txt')
  };
}

export async function saveAuthorAssistantStage87AAcceptance({
  sessionRoot,
  existingSession,
  acceptedSession,
  existingStageNine,
  acceptedStageNine,
  acceptance
} = {}) {
  if (!sessionRoot || !existingSession?.sessionId || acceptance?.approvalStep !== '87A') throw new Error('A valid approved Step 87A acceptance is required.');
  const sessionId = existingSession.sessionId;
  if ([acceptedSession, existingStageNine, acceptedStageNine, acceptance].some(record => record?.sessionId !== sessionId)) throw new Error('The Step 87A records do not belong to the same session.');
  if (
    existingSession.status !== 'stage_9_ready_for_review'
    || acceptedSession.status !== 'stage_9_accepted'
    || existingStageNine.status !== 'passed_awaiting_human_review'
    || acceptedStageNine.status !== 'human_accepted'
    || acceptedSession.boundaries?.stage9Accepted !== true
    || acceptedSession.boundaries?.stage10Prepared !== false
    || acceptedSession.boundaries?.authorDraftWritten !== false
    || acceptance.status !== 'accepted'
    || acceptance.stagesOneToEightChanged !== false
    || acceptance.wroteToAuthor !== false
    || acceptance.connectedToAws !== false
    || acceptance.connectedToSupabase !== false
    || acceptance.beganStage10 !== false
  ) throw new Error('Step 87A stopped because an acceptance safety boundary changed.');
  const { status: oldStatus, acceptedAt: oldAcceptedAt, acceptanceFingerprint: oldFingerprint, ...existingContent } = existingStageNine;
  const { status: newStatus, acceptedAt, acceptanceFingerprint, ...acceptedContent } = acceptedStageNine;
  if (
    oldStatus !== 'passed_awaiting_human_review'
    || oldAcceptedAt !== undefined
    || oldFingerprint !== undefined
    || newStatus !== 'human_accepted'
    || !acceptedAt
    || acceptanceFingerprint?.value !== acceptance.stageNineFingerprint?.value
    || JSON.stringify(acceptedContent) !== JSON.stringify(existingContent)
  ) throw new Error('Step 87A attempted to change the accepted Stage 9 report.');
  const sessionDirectory = path.join(sessionRoot, sessionId);
  const outputs = [
    ['author-stage-9-authoring-check.json', `${JSON.stringify(acceptedStageNine, null, 2)}\n`],
    ['author-stage-9-acceptance-87a.json', `${JSON.stringify(acceptance, null, 2)}\n`],
    ['session.json', `${JSON.stringify(acceptedSession, null, 2)}\n`]
  ];
  const temporaryFiles = [];
  for (const [filename, contents] of outputs) {
    const finalPath = path.join(sessionDirectory, filename);
    const temporaryPath = `${finalPath}.${randomUUID()}.tmp`;
    await writeFile(temporaryPath, contents, { encoding: 'utf8', flag: 'wx' });
    temporaryFiles.push([temporaryPath, finalPath]);
  }
  for (const [temporaryPath, finalPath] of temporaryFiles) await rename(temporaryPath, finalPath);
  return { session: acceptedSession, stageNinePath: path.join(sessionDirectory, 'author-stage-9-authoring-check.json'), acceptancePath: path.join(sessionDirectory, 'author-stage-9-acceptance-87a.json') };
}

export async function saveAuthorAssistantStageTenPreview({ sessionRoot, existingSession, document, previewText, now = () => new Date() } = {}) {
  if (!sessionRoot || !existingSession?.sessionId || document?.sessionId !== existingSession.sessionId) throw new Error('A valid local Stage 10 learner preview is required.');
  if (
    existingSession.status !== 'stage_9_accepted'
    || document.kind !== 'author_stage_10_local_learner_preview'
    || document.status !== 'awaiting_human_preview_review'
    || document.stageBoundary?.preparedLocally?.join(',') !== '10'
    || document.stageBoundary?.notPrepared?.join(',') !== '11,12'
    || document.privacyBoundary?.learnerFacingFieldsOnly !== true
    || document.privacyBoundary?.futureCliGuidanceIncluded !== false
    || document.acceptedStagesOneToNineChanged !== false
    || existingSession.boundaries?.stage10Prepared !== false
  ) throw new Error('Step 88 stopped because a local preview safety boundary changed.');
  const updatedAt = now().toISOString();
  const session = {
    ...existingSession,
    status: 'stage_10_ready_for_review',
    currentStep: 'local_stage_10_learner_preview_review',
    updatedAt,
    boundaries: { ...existingSession.boundaries, authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], stage10Prepared: true, stage11Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false }
  };
  const sessionDirectory = path.join(sessionRoot, existingSession.sessionId);
  await writeJsonAtomically(path.join(sessionDirectory, 'author-stage-10-learner-preview.json'), document);
  await writeFile(path.join(sessionDirectory, 'author-stage-10-learner-preview.txt'), previewText, 'utf8');
  await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), session);
  return { session, documentPath: path.join(sessionDirectory, 'author-stage-10-learner-preview.json'), previewPath: path.join(sessionDirectory, 'author-stage-10-learner-preview.txt') };
}

export async function saveAuthorAssistantStage88ACorrection({ sessionRoot, existingSession, existingRecords, correction } = {}) {
  if (!sessionRoot || !existingSession?.sessionId || correction?.audit?.approvalStep !== '88A') throw new Error('A valid approved Step 88A correction is required.');
  const sessionId = existingSession.sessionId;
  const produced = [correction.session, correction.blueprint, correction.stageSixAcceptance, correction.stageSevenAcceptance, correction.stageEightAcceptance, correction.stageNine, correction.stageNineAcceptance, correction.stageTen, correction.audit];
  if (produced.some(record => record?.sessionId !== sessionId)) throw new Error('The Step 88A records do not belong to the same session.');
  if (
    existingSession.status !== 'stage_10_ready_for_review' || correction.session.status !== 'stage_10_ready_for_review'
    || correction.session.boundaries?.stage11Prepared !== false || correction.session.boundaries?.authorDraftWritten !== false
    || correction.stageNine.status !== 'human_accepted' || correction.stageNine.summary?.passed !== true || correction.stageNine.summary?.errorCount !== 0
    || correction.stageTen.status !== 'awaiting_human_preview_review' || correction.stageTen.stageBoundary?.notPrepared?.join(',') !== '11,12'
    || correction.audit.futureCliGuidancePreserved !== true || correction.audit.acceptedConsoleInstructionsChanged !== false || correction.audit.unrelatedContentChanged !== false
    || correction.audit.wroteToAuthor !== false || correction.audit.connectedToAws !== false || correction.audit.connectedToSupabase !== false || correction.audit.beganStage11 !== false
  ) throw new Error('Step 88A stopped because a correction safety boundary changed.');
  const correctedIds = new Set(correction.audit.goalCorrections.map(item => item.taskId));
  const oldBlueprint = structuredClone(existingRecords.blueprint);
  const newBlueprint = structuredClone(correction.blueprint);
  for (const record of [oldBlueprint, newBlueprint]) record.tasks = record.tasks.map(task => correctedIds.has(task.id) ? { ...task, goal: '__STEP_88A_ALLOWED_GOAL__' } : task);
  if (JSON.stringify(oldBlueprint) !== JSON.stringify(newBlueprint)) throw new Error('Step 88A attempted an unrelated blueprint change.');
  for (const item of correction.audit.goalCorrections) {
    if (existingRecords.blueprint.tasks.find(task => task.id === item.taskId)?.goal !== item.oldGoal || correction.blueprint.tasks.find(task => task.id === item.taskId)?.goal !== item.newGoal) throw new Error('A Step 88A goal correction does not match its approved old and new wording.');
  }
  const compareAcceptance = (oldValue, newValue, field) => {
    const oldCopy = structuredClone(oldValue); const newCopy = structuredClone(newValue); delete oldCopy[field]; delete newCopy[field];
    if (JSON.stringify(oldCopy) !== JSON.stringify(newCopy)) throw new Error('Step 88A attempted an unrelated acceptance-audit change.');
  };
  compareAcceptance(existingRecords.stageSixAcceptance, correction.stageSixAcceptance, 'supportFingerprints');
  compareAcceptance(existingRecords.stageSevenAcceptance, correction.stageSevenAcceptance, 'supportingRecordFingerprints');
  compareAcceptance(existingRecords.stageEightAcceptance, correction.stageEightAcceptance, 'supportingRecordFingerprints');
  const oldPreview = structuredClone(existingRecords.stageTen); const newPreview = structuredClone(correction.stageTen);
  for (const record of [oldPreview, newPreview]) {
    delete record.generatedAt; delete record.basedOnStage9Fingerprint;
    record.tasks = record.tasks.map(task => correctedIds.has(task.id) ? { ...task, goal: '__STEP_88A_ALLOWED_GOAL__' } : task);
  }
  if (JSON.stringify(oldPreview) !== JSON.stringify(newPreview)) throw new Error('Step 88A attempted an unrelated learner-preview change.');
  if (JSON.stringify(existingRecords.stageSix.boundaryAlignment?.futureCliGuidance) !== JSON.stringify(existingRecords.stageSeven.futureCliBoundary?.guidancePreservedFromStage6)) throw new Error('The future CLI guidance chain was not preserved.');
  const sessionDirectory = path.join(sessionRoot, sessionId);
  const outputs = [
    ['author-stages-1-5-blueprint.json', `${JSON.stringify(correction.blueprint, null, 2)}\n`],
    ['author-stage-6-acceptance-84d.json', `${JSON.stringify(correction.stageSixAcceptance, null, 2)}\n`],
    ['author-stage-7-acceptance-85b.json', `${JSON.stringify(correction.stageSevenAcceptance, null, 2)}\n`],
    ['author-stage-8-acceptance-86a.json', `${JSON.stringify(correction.stageEightAcceptance, null, 2)}\n`],
    ['author-stage-9-authoring-check.json', `${JSON.stringify(correction.stageNine, null, 2)}\n`],
    ['author-stage-9-authoring-check.txt', correction.stageNinePreviewText],
    ['author-stage-9-acceptance-87a.json', `${JSON.stringify(correction.stageNineAcceptance, null, 2)}\n`],
    ['author-stage-10-learner-preview.json', `${JSON.stringify(correction.stageTen, null, 2)}\n`],
    ['author-stage-10-learner-preview.txt', correction.stageTenPreviewText],
    ['author-stage-10-correction-88a.json', `${JSON.stringify(correction.audit, null, 2)}\n`],
    ['session.json', `${JSON.stringify(correction.session, null, 2)}\n`]
  ];
  const temporaryFiles = [];
  for (const [filename, contents] of outputs) {
    const finalPath = path.join(sessionDirectory, filename); const temporaryPath = `${finalPath}.${randomUUID()}.tmp`;
    await writeFile(temporaryPath, contents, { encoding: 'utf8', flag: 'wx' }); temporaryFiles.push([temporaryPath, finalPath]);
  }
  for (const [temporaryPath, finalPath] of temporaryFiles) await rename(temporaryPath, finalPath);
  return { session: correction.session, auditPath: path.join(sessionDirectory, 'author-stage-10-correction-88a.json'), stageTenPath: path.join(sessionDirectory, 'author-stage-10-learner-preview.json') };
}

export async function saveAuthorAssistantStage88BAcceptance({ sessionRoot, existingSession, acceptedSession, existingStageTen, acceptedStageTen, acceptance } = {}) {
  if (!sessionRoot || !existingSession?.sessionId || acceptance?.approvalStep !== '88B') throw new Error('A valid approved Step 88B acceptance is required.');
  const sessionId = existingSession.sessionId;
  if ([acceptedSession, existingStageTen, acceptedStageTen, acceptance].some(record => record?.sessionId !== sessionId)) throw new Error('The Step 88B records do not belong to the same session.');
  if (
    existingSession.status !== 'stage_10_ready_for_review' || acceptedSession.status !== 'stage_10_accepted'
    || existingStageTen.status !== 'awaiting_human_preview_review' || acceptedStageTen.status !== 'human_accepted'
    || acceptedSession.boundaries?.stage10Accepted !== true || acceptedSession.boundaries?.stage11Prepared !== false || acceptedSession.boundaries?.authorDraftWritten !== false
    || acceptance.status !== 'accepted' || acceptance.basedOnCorrectionStep !== '88A' || acceptance.learnerFacingFieldsOnly !== true
    || acceptance.receiptHandleExcludedFromConsoleGoals !== true || acceptance.futureCliGuidancePreservedByCorrection !== true
    || acceptance.stagesOneToNineChanged !== false || acceptance.wroteToAuthor !== false || acceptance.connectedToAws !== false || acceptance.connectedToSupabase !== false || acceptance.beganStage11 !== false
  ) throw new Error('Step 88B stopped because an acceptance safety boundary changed.');
  const { status: oldStatus, acceptedAt: oldAcceptedAt, acceptanceFingerprint: oldFingerprint, ...oldContent } = existingStageTen;
  const { status: newStatus, acceptedAt, acceptanceFingerprint, ...newContent } = acceptedStageTen;
  if (oldStatus !== 'awaiting_human_preview_review' || oldAcceptedAt !== undefined || oldFingerprint !== undefined || newStatus !== 'human_accepted' || !acceptedAt || acceptanceFingerprint?.value !== acceptance.stageTenFingerprint?.value || JSON.stringify(oldContent) !== JSON.stringify(newContent)) {
    throw new Error('Step 88B attempted to change the reviewed Stage 10 learner preview.');
  }
  const sessionDirectory = path.join(sessionRoot, sessionId);
  const outputs = [
    ['author-stage-10-learner-preview.json', `${JSON.stringify(acceptedStageTen, null, 2)}\n`],
    ['author-stage-10-acceptance-88b.json', `${JSON.stringify(acceptance, null, 2)}\n`],
    ['session.json', `${JSON.stringify(acceptedSession, null, 2)}\n`]
  ];
  const temporaryFiles = [];
  for (const [filename, contents] of outputs) { const finalPath = path.join(sessionDirectory, filename); const temporaryPath = `${finalPath}.${randomUUID()}.tmp`; await writeFile(temporaryPath, contents, { encoding: 'utf8', flag: 'wx' }); temporaryFiles.push([temporaryPath, finalPath]); }
  for (const [temporaryPath, finalPath] of temporaryFiles) await rename(temporaryPath, finalPath);
  return { session: acceptedSession, stageTenPath: path.join(sessionDirectory, 'author-stage-10-learner-preview.json'), acceptancePath: path.join(sessionDirectory, 'author-stage-10-acceptance-88b.json') };
}

export async function saveAuthorAssistantStageElevenReview({ sessionRoot, existingSession, document, previewText, now = () => new Date() } = {}) {
  if (!sessionRoot || !existingSession?.sessionId || document?.sessionId !== existingSession.sessionId) throw new Error('A valid local Stage 11 structured review is required.');
  if (
    existingSession.status !== 'stage_10_accepted' || document.kind !== 'author_stage_11_local_structured_review' || document.status !== 'awaiting_human_stage_11_review'
    || document.stageBoundary?.preparedLocally?.join(',') !== '11' || document.stageBoundary?.notPrepared?.join(',') !== '12'
    || document.reviewState?.learnerPreviewStatus !== 'reviewed' || document.reviewState?.reviewStatus !== 'ready_for_approval' || document.reviewState?.approvalDecision !== 'pending'
    || document.summary?.openBlockingFindingCount !== 0 || document.safetyBoundary?.approvalPerformed !== false || document.safetyBoundary?.releaseCandidatePrepared !== false
    || document.safetyBoundary?.authorDraftWritten !== false || document.acceptedStagesOneToTenChanged !== false || existingSession.boundaries?.stage11Prepared !== false
  ) throw new Error('Step 89 stopped because a local review safety boundary changed.');
  const updatedAt = now().toISOString();
  const session = { ...existingSession, status: 'stage_11_ready_for_review', currentStep: 'local_stage_11_structured_review', updatedAt, boundaries: { ...existingSession.boundaries, authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], stage11Prepared: true, stage12Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false, candidatePrepared: false, published: false } };
  const sessionDirectory = path.join(sessionRoot, existingSession.sessionId);
  await writeJsonAtomically(path.join(sessionDirectory, 'author-stage-11-structured-review.json'), document); await writeFile(path.join(sessionDirectory, 'author-stage-11-structured-review.txt'), previewText, 'utf8'); await writeJsonAtomically(path.join(sessionDirectory, 'session.json'), session);
  return { session, documentPath: path.join(sessionDirectory, 'author-stage-11-structured-review.json'), previewPath: path.join(sessionDirectory, 'author-stage-11-structured-review.txt') };
}

export async function saveAuthorAssistantStage89AAcceptance({ sessionRoot, existingSession, acceptedSession, existingStageEleven, acceptedStageEleven, acceptance } = {}) {
  if (!sessionRoot || !existingSession?.sessionId || acceptance?.approvalStep !== '89A') throw new Error('A valid approved Step 89A acceptance is required.');
  const sessionId = existingSession.sessionId;
  if ([acceptedSession, existingStageEleven, acceptedStageEleven, acceptance].some(record => record?.sessionId !== sessionId)) throw new Error('The Step 89A records do not belong to the same session.');
  if (
    existingSession.status !== 'stage_11_ready_for_review' || acceptedSession.status !== 'stage_11_accepted'
    || existingStageEleven.status !== 'awaiting_human_stage_11_review' || acceptedStageEleven.status !== 'human_accepted'
    || acceptedSession.boundaries?.stage11Accepted !== true || acceptedSession.boundaries?.stage12Prepared !== false || acceptedSession.boundaries?.candidatePrepared !== false
    || acceptance.status !== 'accepted' || acceptance.reviewStatus !== 'ready_for_approval' || acceptance.approvalDecision !== 'pending'
    || acceptance.openBlockingFindingCount !== 0 || acceptance.openAdvisoryFindingCount !== 1 || acceptance.stagesOneToTenChanged !== false
    || acceptance.wroteToAuthor !== false || acceptance.connectedToAws !== false || acceptance.connectedToSupabase !== false || acceptance.preparedReleaseCandidate !== false || acceptance.beganStage12 !== false
  ) throw new Error('Step 89A stopped because an acceptance safety boundary changed.');
  const { status: oldStatus, acceptedAt: oldAcceptedAt, acceptanceFingerprint: oldFingerprint, ...oldContent } = existingStageEleven;
  const { status: newStatus, acceptedAt, acceptanceFingerprint, ...newContent } = acceptedStageEleven;
  if (oldStatus !== 'awaiting_human_stage_11_review' || oldAcceptedAt !== undefined || oldFingerprint !== undefined || newStatus !== 'human_accepted' || !acceptedAt || acceptanceFingerprint?.value !== acceptance.stageElevenFingerprint?.value || JSON.stringify(oldContent) !== JSON.stringify(newContent)) throw new Error('Step 89A attempted to change the reviewed Stage 11 report.');
  const sessionDirectory = path.join(sessionRoot, sessionId); const outputs = [
    ['author-stage-11-structured-review.json', `${JSON.stringify(acceptedStageEleven, null, 2)}\n`],
    ['author-stage-11-acceptance-89a.json', `${JSON.stringify(acceptance, null, 2)}\n`],
    ['session.json', `${JSON.stringify(acceptedSession, null, 2)}\n`]
  ];
  const temporaryFiles = []; for (const [filename, contents] of outputs) { const finalPath = path.join(sessionDirectory, filename); const temporaryPath = `${finalPath}.${randomUUID()}.tmp`; await writeFile(temporaryPath, contents, { encoding: 'utf8', flag: 'wx' }); temporaryFiles.push([temporaryPath, finalPath]); } for (const [temporaryPath, finalPath] of temporaryFiles) await rename(temporaryPath, finalPath);
  return { session: acceptedSession, stageElevenPath: path.join(sessionDirectory, 'author-stage-11-structured-review.json'), acceptancePath: path.join(sessionDirectory, 'author-stage-11-acceptance-89a.json') };
}

export async function saveAuthorAssistantHandoffPackage({ sessionRoot, existingSession, handoffPackage, previewText, now = () => new Date() } = {}) {
  if (!sessionRoot || !existingSession?.sessionId || handoffPackage?.sessionId !== existingSession.sessionId) {
    throw new Error('A valid local Author handoff package is required.');
  }
  if (
    existingSession.status !== 'stage_11_accepted'
    || handoffPackage.kind !== 'author_local_handoff_package'
    || handoffPackage.status !== 'awaiting_human_handoff_review'
    || !handoffPackage.handoffFingerprint?.value
    || handoffPackage.acceptedStagesOneToElevenChanged !== false
    || handoffPackage.identityBinding?.status !== 'required_before_author_write'
    || handoffPackage.identityBinding?.assignedAuthorId !== null
    || handoffPackage.identityBinding?.assignedDraftId !== null
    || handoffPackage.handoffBoundary?.localPackageOnly !== true
    || handoffPackage.handoffBoundary?.stage12Started !== false
    || handoffPackage.handoffBoundary?.authorDraftWritten !== false
    || handoffPackage.handoffBoundary?.connectedToAuthor !== false
    || handoffPackage.handoffBoundary?.connectedToSupabase !== false
    || handoffPackage.handoffBoundary?.connectedToAws !== false
    || handoffPackage.handoffBoundary?.releaseCandidatePrepared !== false
    || handoffPackage.handoffBoundary?.candidateIdGenerated !== false
    || handoffPackage.handoffBoundary?.approvalPerformed !== false
    || handoffPackage.handoffBoundary?.published !== false
  ) throw new Error('Step 90 stopped because a local handoff safety boundary changed.');

  const updatedAt = now().toISOString();
  const session = {
    ...existingSession,
    status: 'handoff_package_ready_for_review',
    currentStep: 'local_author_handoff_package',
    updatedAt,
    boundaries: {
      ...existingSession.boundaries,
      handoffPackagePrepared: true,
      stage12Prepared: false,
      authorDraftWritten: false,
      awsConnected: false,
      supabaseConnected: false,
      candidatePrepared: false,
      published: false
    }
  };
  const sessionDirectory = path.join(sessionRoot, existingSession.sessionId);
  const outputs = [
    ['author-local-handoff-package.json', `${JSON.stringify(handoffPackage, null, 2)}\n`],
    ['author-local-handoff-package.txt', previewText],
    ['session.json', `${JSON.stringify(session, null, 2)}\n`]
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
    session,
    packagePath: path.join(sessionDirectory, 'author-local-handoff-package.json'),
    previewPath: path.join(sessionDirectory, 'author-local-handoff-package.txt')
  };
}

export async function saveAuthorAssistantStage90AAcceptance({ sessionRoot, existingSession, handoffPackage, acceptance, now = () => new Date() } = {}) {
  if (
    !sessionRoot
    || !existingSession?.sessionId
    || handoffPackage?.sessionId !== existingSession.sessionId
    || acceptance?.sessionId !== existingSession.sessionId
  ) throw new Error('A valid approved Step 90A acceptance is required.');
  if (
    existingSession.status !== 'handoff_package_ready_for_review'
    || handoffPackage.kind !== 'author_local_handoff_package'
    || handoffPackage.status !== 'awaiting_human_handoff_review'
    || acceptance.kind !== 'author_local_handoff_human_acceptance'
    || acceptance.status !== 'accepted'
    || acceptance.approvalStep !== '90A'
    || acceptance.handoffFingerprint?.value !== handoffPackage.handoffFingerprint?.value
    || acceptance.packageChanged !== false
    || acceptance.authorIdentityBound !== false
    || acceptance.wroteToAuthor !== false
    || acceptance.connectedToSupabase !== false
    || acceptance.connectedToAws !== false
    || acceptance.preparedReleaseCandidate !== false
    || acceptance.generatedCandidateId !== false
    || acceptance.approved !== false
    || acceptance.published !== false
    || acceptance.beganStage12 !== false
  ) throw new Error('Step 90A stopped because a local acceptance safety boundary changed.');

  const sessionDirectory = path.join(sessionRoot, existingSession.sessionId);
  const acceptancePath = path.join(sessionDirectory, 'author-local-handoff-acceptance-90a.json');
  if (await readOptionalJson(acceptancePath)) throw new Error('A Step 90A acceptance audit already exists. No duplicate was created.');
  const updatedAt = now().toISOString();
  const session = {
    ...existingSession,
    status: 'handoff_package_accepted',
    currentStep: 'local_author_handoff_package_accepted',
    updatedAt,
    boundaries: {
      ...existingSession.boundaries,
      handoffPackagePrepared: true,
      handoffPackageAccepted: true,
      stage12Prepared: false,
      authorDraftWritten: false,
      awsConnected: false,
      supabaseConnected: false,
      candidatePrepared: false,
      published: false
    }
  };
  const outputs = [
    [acceptancePath, `${JSON.stringify(acceptance, null, 2)}\n`],
    [path.join(sessionDirectory, 'session.json'), `${JSON.stringify(session, null, 2)}\n`]
  ];
  const temporaryFiles = [];
  for (const [finalPath, contents] of outputs) {
    const temporaryPath = `${finalPath}.${randomUUID()}.tmp`;
    await writeFile(temporaryPath, contents, { encoding: 'utf8', flag: 'wx' });
    temporaryFiles.push([temporaryPath, finalPath]);
  }
  for (const [temporaryPath, finalPath] of temporaryFiles) await rename(temporaryPath, finalPath);
  return {
    session,
    packagePath: path.join(sessionDirectory, 'author-local-handoff-package.json'),
    acceptancePath
  };
}

export async function findLatestAuthorAssistantSession(sessionRoot) {
  let entries;
  try {
    entries = await readdir(sessionRoot, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }

  const loaded = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      loaded.push(await loadAuthorAssistantSession(sessionRoot, entry.name));
    } catch {
      // Ignore incomplete folders; atomic saves prevent them during normal operation.
    }
  }
  loaded.sort((a, b) => String(b.session.updatedAt).localeCompare(String(a.session.updatedAt)));
  return loaded[0] || null;
}
