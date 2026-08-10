import { fingerprintJson, verifyStage84DAcceptanceFingerprint } from './authorAssistantStage84D.mjs';

const EXPECTED_TASK_COUNT = 6;
const EXPECTED_VERIFICATION_COUNT = 7;
const EXPECTED_RESOURCE_COUNT = 0;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function stageSevenFingerprintContent(stageSeven) {
  return {
    basedOnStage6Fingerprint: stageSeven.basedOnStage6Fingerprint,
    stageBoundary: stageSeven.stageBoundary,
    resources: stageSeven.resources,
    tasks: stageSeven.tasks,
    evidence: stageSeven.evidence,
    consoleBoundary: stageSeven.consoleBoundary,
    futureCliBoundary: stageSeven.futureCliBoundary,
    manualReviewFindings: stageSeven.manualReviewFindings
  };
}

export function validateStage85BAcceptanceInputs({
  session,
  stageSeven,
  stageSixInstructions,
  stageSixAcceptance,
  supportRecords = {}
} = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId
    || session.inputs?.shortName !== 'SQS'
    || session.status !== 'stage_7_ready_for_review'
    || stageSeven?.sessionId !== sessionId
    || stageSeven.status !== 'awaiting_human_stage_7_review'
    || stageSixInstructions?.sessionId !== sessionId
    || stageSixInstructions.status !== 'human_accepted'
    || stageSixAcceptance?.sessionId !== sessionId
    || stageSixAcceptance.status !== 'accepted'
    || stageSixAcceptance.approvalStep !== '84D'
  ) throw new Error('Step 85B requires the complete matching local SQS Stages 1-7 review package.');

  if (!verifyStage84DAcceptanceFingerprint(stageSixInstructions, stageSixAcceptance)) {
    throw new Error('The accepted Stage 6 fingerprint no longer matches.');
  }
  if (
    stageSeven.basedOnStage6Fingerprint?.value !== stageSixAcceptance.instructionFingerprint?.value
    || stageSeven.basedOnStage6Fingerprint?.value !== stageSixInstructions.acceptanceFingerprint?.value
  ) throw new Error('Stage 7 is not based on the currently accepted Stage 6 fingerprint.');

  const expectedSupport = stageSixAcceptance.supportFingerprints || {};
  const supportKeys = ['acceptedSources', 'blueprint', 'blueprintAcceptance', 'sourceAmendment84B', 'consistencyCorrection84C'];
  if (supportKeys.some(key => !supportRecords[key] || fingerprintJson(supportRecords[key]) !== expectedSupport[key])) {
    throw new Error('A supporting Stages 1-6 record no longer matches its accepted fingerprint.');
  }

  const boundary = stageSeven.stageBoundary;
  if (
    boundary?.preparedLocally?.join(',') !== '7'
    || boundary?.notPrepared?.join(',') !== '8,9,10,11,12'
    || boundary?.writtenToAuthor !== false
    || boundary?.connectedToSupabase !== false
    || boundary?.connectedToAws !== false
    || boundary?.candidatePrepared !== false
    || boundary?.published !== false
    || session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7'
    || session.boundaries?.stage7Prepared !== true
    || session.boundaries?.stage8Prepared !== false
    || session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.awsConnected !== false
    || session.boundaries?.supabaseConnected !== false
    || stageSeven.consoleBoundary?.cliCommandsPrepared !== false
    || stageSeven.futureCliBoundary?.prepared !== false
  ) throw new Error('Step 85B stopped because a local-only safety boundary changed.');

  const resources = stageSeven.resources?.schema || [];
  const tasks = stageSeven.tasks || [];
  const checks = tasks.flatMap(task => (task.verification || []).map(check => ({ taskId: task.taskId, ...check })));
  if (resources.length !== EXPECTED_RESOURCE_COUNT || tasks.length !== EXPECTED_TASK_COUNT || checks.length !== EXPECTED_VERIFICATION_COUNT) {
    throw new Error('Step 85B requires exactly six tasks, seven verification checks and zero resource values.');
  }
  if (tasks.some(task => !clean(task.taskId) || !clean(task.title) || (task.createdResourceKeys || []).length)) {
    throw new Error('Step 85B requires the reviewed zero-resource task package exactly.');
  }
  if (checks.some(check => !clean(check.id) || !clean(check.title) || !clean(check.instruction) || !clean(check.expectedResult) || check.mode !== 'console')) {
    throw new Error('Every accepted Stage 7 verification must be a complete Console check.');
  }
  if (new Set(checks.map(check => `${check.taskId}:${check.id}`)).size !== checks.length) {
    throw new Error('Stage 7 verification IDs must be unique within their tasks.');
  }

  const protectedUrls = new Set(stageSeven.evidence?.protectedSourceUrls || []);
  const evidence = stageSeven.evidence?.verifications || [];
  if (
    (stageSeven.evidence?.resources || []).length !== 0
    || evidence.length !== EXPECTED_VERIFICATION_COUNT
    || checks.some(check => {
      const match = evidence.find(item => item.taskId === check.taskId && item.verificationId === check.id);
      return !match || !match.sourceUrls?.length || match.sourceUrls.some(url => !protectedUrls.has(url));
    })
  ) throw new Error('Every Stage 7 check must retain matching protected AWS source evidence.');

  return {
    taskCount: tasks.length,
    verificationCount: checks.length,
    resourceCount: resources.length,
    protectedSourceCount: protectedUrls.size
  };
}

export function buildStage85BLocalAcceptance({
  session,
  stageSeven,
  stageSixInstructions,
  stageSixAcceptance,
  supportRecords,
  now = () => new Date()
} = {}) {
  const counts = validateStage85BAcceptanceInputs({ session, stageSeven, stageSixInstructions, stageSixAcceptance, supportRecords });
  const acceptedAt = now().toISOString();
  const fingerprintContent = stageSevenFingerprintContent(stageSeven);
  const stageSevenFingerprint = fingerprintJson(fingerprintContent);
  const acceptedStageSeven = {
    ...stageSeven,
    status: 'human_accepted',
    acceptedAt,
    acceptanceFingerprint: { algorithm: 'sha256-json-v1', value: stageSevenFingerprint }
  };
  const acceptedSession = {
    ...session,
    status: 'stage_7_accepted',
    currentStep: 'local_stage_7_resources_checks_accepted',
    updatedAt: acceptedAt,
    boundaries: {
      ...session.boundaries,
      authorDraftWritten: false,
      stage7Prepared: true,
      stage7Accepted: true,
      stage8Prepared: false,
      awsConnected: false,
      supabaseConnected: false
    }
  };
  const acceptance = {
    schemaVersion: 1,
    kind: 'author_stage_7_human_acceptance',
    status: 'accepted',
    sessionId: session.sessionId,
    approvalStep: '85B',
    acceptedAt,
    stageSevenFingerprint: { algorithm: 'sha256-json-v1', value: stageSevenFingerprint },
    basedOnStage6Fingerprint: { ...stageSeven.basedOnStage6Fingerprint },
    taskCount: counts.taskCount,
    verificationCount: counts.verificationCount,
    resourceCount: counts.resourceCount,
    protectedSourceCount: counts.protectedSourceCount,
    supportingRecordFingerprints: {
      acceptedSources: fingerprintJson(supportRecords.acceptedSources),
      blueprint: fingerprintJson(supportRecords.blueprint),
      blueprintAcceptance: fingerprintJson(supportRecords.blueprintAcceptance),
      sourceAmendment84B: fingerprintJson(supportRecords.sourceAmendment84B),
      consistencyCorrection84C: fingerprintJson(supportRecords.consistencyCorrection84C),
      stageSixInstructions: fingerprintJson(stageSixInstructions),
      stageSixAcceptance: fingerprintJson(stageSixAcceptance)
    },
    stagesOneToSixChanged: false,
    wroteToAuthor: false,
    connectedToAws: false,
    connectedToSupabase: false,
    beganStage8: false
  };
  return { session: acceptedSession, stageSeven: acceptedStageSeven, acceptance, fingerprintContent };
}

export function verifyStage85BAcceptanceFingerprint(stageSeven, acceptance) {
  return fingerprintJson(stageSevenFingerprintContent(stageSeven)) === acceptance?.stageSevenFingerprint?.value;
}
