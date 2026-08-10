import { fingerprintJson, verifyStage84DAcceptanceFingerprint } from './authorAssistantStage84D.mjs';
import { verifyStage85BAcceptanceFingerprint } from './authorAssistantStage85B.mjs';

const EXPECTED_TASK_CLEANUP_STEPS = 3;
const EXPECTED_PROGRAMME_ACKNOWLEDGEMENTS = 1;
const APPROVED_TASK_ID = 'task-sqs-review-queue-deletion-effects-006';
const APPROVED_TARGET_TYPE = 'Amazon SQS queue';
const APPROVED_TARGET_NAME = 'sqs-beginner-test';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function stageEightFingerprintContent(stageEight) {
  return {
    basedOnStage7Fingerprint: stageEight.basedOnStage7Fingerprint,
    stageBoundary: stageEight.stageBoundary,
    approvedCleanupTarget: stageEight.approvedCleanupTarget,
    taskCleanup: stageEight.taskCleanup,
    programmeCleanup: stageEight.programmeCleanup,
    evidence: stageEight.evidence,
    futureCliBoundary: stageEight.futureCliBoundary,
    manualReviewFindings: stageEight.manualReviewFindings
  };
}

export function validateStage86AAcceptanceInputs({
  session,
  stageEight,
  stageSeven,
  stageSevenAcceptance,
  stageSixInstructions,
  stageSixAcceptance,
  supportRecords = {}
} = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId
    || session.inputs?.shortName !== 'SQS'
    || session.status !== 'stage_8_ready_for_review'
    || stageEight?.sessionId !== sessionId
    || stageEight.status !== 'awaiting_human_stage_8_review'
    || stageSeven?.sessionId !== sessionId
    || stageSeven.status !== 'human_accepted'
    || stageSevenAcceptance?.sessionId !== sessionId
    || stageSevenAcceptance.status !== 'accepted'
    || stageSevenAcceptance.approvalStep !== '85B'
    || stageSixInstructions?.sessionId !== sessionId
    || stageSixInstructions.status !== 'human_accepted'
    || stageSixAcceptance?.sessionId !== sessionId
    || stageSixAcceptance.status !== 'accepted'
  ) throw new Error('Step 86A requires the complete matching local SQS Stages 1-8 review package.');
  if (!verifyStage84DAcceptanceFingerprint(stageSixInstructions, stageSixAcceptance)) throw new Error('The accepted Stage 6 fingerprint no longer matches.');
  if (!verifyStage85BAcceptanceFingerprint(stageSeven, stageSevenAcceptance)) throw new Error('The accepted Stage 7 fingerprint no longer matches.');
  if (
    stageEight.basedOnStage7Fingerprint?.value !== stageSevenAcceptance.stageSevenFingerprint?.value
    || stageEight.basedOnStage7Fingerprint?.value !== stageSeven.acceptanceFingerprint?.value
  ) throw new Error('Stage 8 is not based on the currently accepted Stage 7 fingerprint.');

  const expected = stageSevenAcceptance.supportingRecordFingerprints || {};
  const current = {
    acceptedSources: fingerprintJson(supportRecords.acceptedSources),
    blueprint: fingerprintJson(supportRecords.blueprint),
    blueprintAcceptance: fingerprintJson(supportRecords.blueprintAcceptance),
    sourceAmendment84B: fingerprintJson(supportRecords.sourceAmendment84B),
    consistencyCorrection84C: fingerprintJson(supportRecords.consistencyCorrection84C),
    stageSixInstructions: fingerprintJson(stageSixInstructions),
    stageSixAcceptance: fingerprintJson(stageSixAcceptance)
  };
  if (Object.keys(current).some(key => current[key] !== expected[key])) throw new Error('An accepted Stages 1-7 supporting record no longer matches its fingerprint.');

  const target = stageEight.approvedCleanupTarget;
  if (target?.taskId !== APPROVED_TASK_ID || target?.targetType !== APPROVED_TARGET_TYPE || target?.targetName !== APPROVED_TARGET_NAME) {
    throw new Error('Step 86A accepts only the approved sqs-beginner-test cleanup boundary.');
  }
  const boundary = stageEight.stageBoundary;
  if (
    boundary?.preparedLocally?.join(',') !== '8'
    || boundary?.notPrepared?.join(',') !== '9,10,11,12'
    || boundary?.writtenToAuthor !== false
    || boundary?.connectedToSupabase !== false
    || boundary?.connectedToAws !== false
    || boundary?.candidatePrepared !== false
    || boundary?.published !== false
    || session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7,8'
    || session.boundaries?.stage8Prepared !== true
    || session.boundaries?.stage9Prepared !== false
    || session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.awsConnected !== false
    || session.boundaries?.supabaseConnected !== false
    || stageEight.futureCliBoundary?.prepared !== false
  ) throw new Error('Step 86A stopped because a local-only safety boundary changed.');

  const taskSteps = stageEight.taskCleanup?.steps || [];
  const programmeSteps = stageEight.programmeCleanup?.steps || [];
  if (
    stageEight.taskCleanup?.taskId !== APPROVED_TASK_ID
    || taskSteps.length !== EXPECTED_TASK_CLEANUP_STEPS
    || programmeSteps.length !== EXPECTED_PROGRAMME_ACKNOWLEDGEMENTS
    || stageEight.programmeCleanup?.manualOnly !== true
  ) throw new Error('Step 86A requires exactly three task cleanup steps and one final programme acknowledgement.');
  const allSteps = [...taskSteps, ...programmeSteps];
  if (allSteps.some(step => !clean(step.id) || !clean(step.title) || !clean(step.instruction) || !clean(step.verification) || (step.resourceKeys || []).length)) {
    throw new Error('Every accepted Stage 8 cleanup item must remain complete with zero resource keys.');
  }
  if (taskSteps.some(step => !JSON.stringify(step).includes(APPROVED_TARGET_NAME))) throw new Error('Every accepted task cleanup step must retain the exact queue name.');
  if (taskSteps.filter(step => /\bdelete\b/i.test(step.instruction)).length !== 1) throw new Error('Exactly one accepted cleanup action must delete sqs-beginner-test.');
  if (/\bdelete\b/i.test(programmeSteps[0].instruction)) throw new Error('The final programme item must remain a non-destructive acknowledgement.');

  const protectedUrls = new Set(stageEight.evidence?.protectedSourceUrls || []);
  const evidence = stageEight.evidence?.cleanupSteps || [];
  if (
    evidence.length !== allSteps.length
    || allSteps.some(step => {
      const match = evidence.find(item => item.cleanupStepId === step.id);
      return !match || !match.sourceUrls?.length || match.sourceUrls.some(url => !protectedUrls.has(url));
    })
  ) throw new Error('Every accepted Stage 8 cleanup item must retain matching protected AWS evidence.');
  return { taskCleanupStepCount: taskSteps.length, programmeAcknowledgementCount: programmeSteps.length, protectedSourceCount: protectedUrls.size };
}

export function buildStage86ALocalAcceptance({
  session,
  stageEight,
  stageSeven,
  stageSevenAcceptance,
  stageSixInstructions,
  stageSixAcceptance,
  supportRecords,
  now = () => new Date()
} = {}) {
  const counts = validateStage86AAcceptanceInputs({ session, stageEight, stageSeven, stageSevenAcceptance, stageSixInstructions, stageSixAcceptance, supportRecords });
  const acceptedAt = now().toISOString();
  const fingerprintContent = stageEightFingerprintContent(stageEight);
  const stageEightFingerprint = fingerprintJson(fingerprintContent);
  const acceptedStageEight = {
    ...stageEight,
    status: 'human_accepted',
    acceptedAt,
    acceptanceFingerprint: { algorithm: 'sha256-json-v1', value: stageEightFingerprint }
  };
  const acceptedSession = {
    ...session,
    status: 'stage_8_accepted',
    currentStep: 'local_stage_8_manual_cleanup_accepted',
    updatedAt: acceptedAt,
    boundaries: {
      ...session.boundaries,
      authorDraftWritten: false,
      stage8Prepared: true,
      stage8Accepted: true,
      stage9Prepared: false,
      awsConnected: false,
      supabaseConnected: false
    }
  };
  const acceptance = {
    schemaVersion: 1,
    kind: 'author_stage_8_human_acceptance',
    status: 'accepted',
    sessionId: session.sessionId,
    approvalStep: '86A',
    acceptedAt,
    stageEightFingerprint: { algorithm: 'sha256-json-v1', value: stageEightFingerprint },
    basedOnStage7Fingerprint: { ...stageEight.basedOnStage7Fingerprint },
    approvedCleanupTarget: { ...stageEight.approvedCleanupTarget },
    taskCleanupStepCount: counts.taskCleanupStepCount,
    programmeAcknowledgementCount: counts.programmeAcknowledgementCount,
    protectedSourceCount: counts.protectedSourceCount,
    supportingRecordFingerprints: {
      acceptedSources: fingerprintJson(supportRecords.acceptedSources),
      blueprint: fingerprintJson(supportRecords.blueprint),
      blueprintAcceptance: fingerprintJson(supportRecords.blueprintAcceptance),
      sourceAmendment84B: fingerprintJson(supportRecords.sourceAmendment84B),
      consistencyCorrection84C: fingerprintJson(supportRecords.consistencyCorrection84C),
      stageSixInstructions: fingerprintJson(stageSixInstructions),
      stageSixAcceptance: fingerprintJson(stageSixAcceptance),
      stageSeven: fingerprintJson(stageSeven),
      stageSevenAcceptance: fingerprintJson(stageSevenAcceptance)
    },
    stagesOneToSevenChanged: false,
    wroteToAuthor: false,
    connectedToAws: false,
    connectedToSupabase: false,
    beganStage9: false
  };
  return { session: acceptedSession, stageEight: acceptedStageEight, acceptance, fingerprintContent };
}

export function verifyStage86AAcceptanceFingerprint(stageEight, acceptance) {
  return fingerprintJson(stageEightFingerprintContent(stageEight)) === acceptance?.stageEightFingerprint?.value;
}
