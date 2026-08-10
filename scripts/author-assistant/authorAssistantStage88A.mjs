import { buildStageNineAuthoringCheck, formatStageNinePreview } from './authorAssistantAuthoringCheck.mjs';
import { buildStageTenLearnerPreview, formatStageTenPreview } from './authorAssistantLearnerPreview.mjs';
import { buildStage87ALocalAcceptance, verifyStage87AAcceptanceFingerprint } from './authorAssistantStage87A.mjs';
import { fingerprintJson, verifyStage84DAcceptanceFingerprint } from './authorAssistantStage84D.mjs';
import { verifyStage85BAcceptanceFingerprint } from './authorAssistantStage85B.mjs';
import { verifyStage86AAcceptanceFingerprint } from './authorAssistantStage86A.mjs';

export const STAGE_88A_GOAL_CORRECTIONS = Object.freeze({
  'task-sqs-receive-and-inspect-the-test-message-004': {
    oldGoal: 'Poll the queue, receive the test message, and retain the receipt handle needed for message deletion.',
    newGoal: 'Poll the queue, receive the harmless test message, and inspect its details in the Console.'
  },
  'task-sqs-delete-the-received-test-message-005': {
    oldGoal: 'Delete the received test message using its most recently received receipt handle.',
    newGoal: 'Select and delete the received harmless test message in the Console.'
  }
});

function fiveRecords(inputs, blueprint = inputs.blueprint) {
  return { acceptedSources: inputs.acceptedSources, blueprint, blueprintAcceptance: inputs.blueprintAcceptance, sourceAmendment84B: inputs.sourceAmendment84B, consistencyCorrection84C: inputs.consistencyCorrection84C };
}

function supportFingerprints(records) {
  return Object.fromEntries(Object.entries(records).map(([key, value]) => [key, fingerprintJson(value)]));
}

function assertFingerprints(records, expected, message) {
  if (Object.entries(records).some(([key, value]) => fingerprintJson(value) !== expected?.[key])) throw new Error(message);
}

export function validateStage88AInputs(inputs = {}) {
  const { session, blueprint, stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance, stageEight, stageEightAcceptance, stageNine, stageNineAcceptance, stageTen } = inputs;
  const sessionId = session?.sessionId;
  if (
    !sessionId || session.status !== 'stage_10_ready_for_review'
    || blueprint?.sessionId !== sessionId || blueprint.status !== 'human_accepted'
    || stageSix?.sessionId !== sessionId || stageSix.status !== 'human_accepted'
    || stageSeven?.sessionId !== sessionId || stageSeven.status !== 'human_accepted'
    || stageEight?.sessionId !== sessionId || stageEight.status !== 'human_accepted'
    || stageNine?.sessionId !== sessionId || stageNine.status !== 'human_accepted'
    || stageTen?.sessionId !== sessionId || stageTen.status !== 'awaiting_human_preview_review'
  ) throw new Error('Step 88A requires the complete matching SQS Stages 1-10 review package.');
  if (!verifyStage84DAcceptanceFingerprint(stageSix, stageSixAcceptance)) throw new Error('The accepted Stage 6 fingerprint no longer matches.');
  if (!verifyStage85BAcceptanceFingerprint(stageSeven, stageSevenAcceptance)) throw new Error('The accepted Stage 7 fingerprint no longer matches.');
  if (!verifyStage86AAcceptanceFingerprint(stageEight, stageEightAcceptance)) throw new Error('The accepted Stage 8 fingerprint no longer matches.');
  if (!verifyStage87AAcceptanceFingerprint(stageNine, stageNineAcceptance)) throw new Error('The accepted Stage 9 fingerprint no longer matches.');
  assertFingerprints(fiveRecords(inputs), stageSixAcceptance.supportFingerprints, 'A supporting Stages 1-6 record no longer matches.');
  assertFingerprints({ ...fiveRecords(inputs), stageSixInstructions: stageSix, stageSixAcceptance }, stageSevenAcceptance.supportingRecordFingerprints, 'A supporting Stages 1-7 record no longer matches.');
  assertFingerprints({ ...fiveRecords(inputs), stageSixInstructions: stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance }, stageEightAcceptance.supportingRecordFingerprints, 'A supporting Stages 1-8 record no longer matches.');
  assertFingerprints({ ...fiveRecords(inputs), stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance, stageEight, stageEightAcceptance }, stageNineAcceptance.supportingRecordFingerprints, 'A supporting Stages 1-9 record no longer matches.');
  for (const [taskId, correction] of Object.entries(STAGE_88A_GOAL_CORRECTIONS)) {
    if (blueprint.tasks.find(task => task.id === taskId)?.goal !== correction.oldGoal || stageTen.tasks.find(task => task.id === taskId)?.goal !== correction.oldGoal) {
      throw new Error(`Step 88A found an unexpected existing goal for ${taskId}.`);
    }
    const stageSixTask = stageSix.tasks.find(task => task.taskId === taskId);
    if (/receipt handle/i.test(JSON.stringify(stageSixTask?.consoleSteps || []))) throw new Error('Receipt-handle wording remains in an accepted Console instruction.');
    if (!/ReceiptHandle/i.test(stageSix.boundaryAlignment?.futureCliGuidance?.[taskId] || '')) throw new Error('The future CLI receipt-handle guidance is missing.');
  }
  if (
    session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7,8,9,10'
    || session.boundaries?.stage10Prepared !== true || session.boundaries?.stage11Prepared !== false
    || session.boundaries?.authorDraftWritten !== false || session.boundaries?.awsConnected !== false || session.boundaries?.supabaseConnected !== false
    || stageTen.stageBoundary?.notPrepared?.join(',') !== '11,12'
  ) throw new Error('Step 88A stopped because a local-only safety boundary changed.');
  return true;
}

function correctBlueprintGoals(blueprint) {
  return {
    ...blueprint,
    tasks: blueprint.tasks.map(task => STAGE_88A_GOAL_CORRECTIONS[task.id] ? { ...task, goal: STAGE_88A_GOAL_CORRECTIONS[task.id].newGoal } : task)
  };
}

export function buildStage88ACorrection(inputs, { now = () => new Date() } = {}) {
  validateStage88AInputs(inputs);
  const appliedAt = now().toISOString();
  const blueprint = correctBlueprintGoals(inputs.blueprint);
  const stageSixAcceptance = { ...inputs.stageSixAcceptance, supportFingerprints: supportFingerprints(fiveRecords(inputs, blueprint)) };
  const stageSevenAcceptance = { ...inputs.stageSevenAcceptance, supportingRecordFingerprints: supportFingerprints({ ...fiveRecords(inputs, blueprint), stageSixInstructions: inputs.stageSix, stageSixAcceptance }) };
  const stageEightAcceptance = { ...inputs.stageEightAcceptance, supportingRecordFingerprints: supportFingerprints({ ...fiveRecords(inputs, blueprint), stageSixInstructions: inputs.stageSix, stageSixAcceptance, stageSeven: inputs.stageSeven, stageSevenAcceptance }) };
  const stageEightSession = { ...inputs.session, status: 'stage_8_accepted', boundaries: { ...inputs.session.boundaries, authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8], stage9Prepared: false, stage10Prepared: false, stage11Prepared: false } };
  const stageNineInputs = { session: stageEightSession, acceptedSources: inputs.acceptedSources, blueprint, blueprintAcceptance: inputs.blueprintAcceptance, sourceAmendment84B: inputs.sourceAmendment84B, consistencyCorrection84C: inputs.consistencyCorrection84C, stageSix: inputs.stageSix, stageSixAcceptance, stageSeven: inputs.stageSeven, stageSevenAcceptance, stageEight: inputs.stageEight, stageEightAcceptance };
  const pendingStageNine = buildStageNineAuthoringCheck(stageNineInputs, { now });
  if (!pendingStageNine.summary.passed || pendingStageNine.summary.errorCount) throw new Error('The corrected package did not pass the rerun Stage 9 Authoring Check.');
  const stageNineReviewSession = { ...inputs.session, status: 'stage_9_ready_for_review', boundaries: { ...inputs.session.boundaries, authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9], stage9Prepared: true, stage9Accepted: false, stage10Prepared: false, stage11Prepared: false } };
  const stageNineSupport = { acceptedSources: inputs.acceptedSources, blueprint, blueprintAcceptance: inputs.blueprintAcceptance, sourceAmendment84B: inputs.sourceAmendment84B, consistencyCorrection84C: inputs.consistencyCorrection84C, stageSix: inputs.stageSix, stageSixAcceptance, stageSeven: inputs.stageSeven, stageSevenAcceptance, stageEight: inputs.stageEight, stageEightAcceptance };
  const acceptedNine = buildStage87ALocalAcceptance({ session: stageNineReviewSession, stageNine: pendingStageNine, supportingRecords: stageNineSupport, now });
  const stageTen = buildStageTenLearnerPreview({ session: acceptedNine.session, acceptedSources: inputs.acceptedSources, blueprint, stageSix: inputs.stageSix, stageSeven: inputs.stageSeven, stageEight: inputs.stageEight, stageNine: acceptedNine.stageNine, stageNineAcceptance: acceptedNine.acceptance, supportingRecords: stageNineSupport }, { now });
  if (Object.keys(STAGE_88A_GOAL_CORRECTIONS).some(taskId => /receipt handle/i.test(stageTen.tasks.find(task => task.id === taskId)?.goal || ''))) throw new Error('Receipt-handle wording remained in the corrected Console learner preview.');
  const session = { ...inputs.session, status: 'stage_10_ready_for_review', currentStep: 'local_stage_10_corrected_learner_preview_review', updatedAt: appliedAt, boundaries: { ...inputs.session.boundaries, authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], stage9Prepared: true, stage9Accepted: true, stage10Prepared: true, stage11Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false } };
  const audit = {
    schemaVersion: 1, kind: 'author_stage_10_receipt_handle_boundary_correction', status: 'applied_locally', sessionId: inputs.session.sessionId, approvalStep: '88A', appliedAt,
    goalCorrections: Object.entries(STAGE_88A_GOAL_CORRECTIONS).map(([taskId, values]) => ({ taskId, ...values })),
    futureCliGuidancePreserved: true, acceptedConsoleInstructionsChanged: false, unrelatedContentChanged: false,
    oldFingerprints: { blueprint: fingerprintJson(inputs.blueprint), stageSixAcceptance: fingerprintJson(inputs.stageSixAcceptance), stageSevenAcceptance: fingerprintJson(inputs.stageSevenAcceptance), stageEightAcceptance: fingerprintJson(inputs.stageEightAcceptance), stageNine: inputs.stageNine.acceptanceFingerprint.value, stageTen: fingerprintJson(inputs.stageTen) },
    newFingerprints: { blueprint: fingerprintJson(blueprint), stageSixAcceptance: fingerprintJson(stageSixAcceptance), stageSevenAcceptance: fingerprintJson(stageSevenAcceptance), stageEightAcceptance: fingerprintJson(stageEightAcceptance), stageNine: acceptedNine.stageNine.acceptanceFingerprint.value, stageTen: fingerprintJson(stageTen) },
    stageNineRerunPassed: true, wroteToAuthor: false, connectedToAws: false, connectedToSupabase: false, beganStage11: false
  };
  return { session, blueprint, stageSixAcceptance, stageSevenAcceptance, stageEightAcceptance, stageNine: acceptedNine.stageNine, stageNineAcceptance: acceptedNine.acceptance, stageNinePreviewText: formatStageNinePreview(acceptedNine.stageNine), stageTen, stageTenPreviewText: formatStageTenPreview(stageTen), audit };
}
