import { fingerprintJson } from './authorAssistantStage84D.mjs';

function stageNineFingerprintContent(stageNine) {
  const { status, acceptedAt, acceptanceFingerprint, ...content } = stageNine || {};
  return content;
}

export function validateStage87AAcceptanceInputs({ session, stageNine, supportingRecords = {} } = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId
    || session.status !== 'stage_9_ready_for_review'
    || stageNine?.sessionId !== sessionId
    || stageNine.status !== 'passed_awaiting_human_review'
    || stageNine.kind !== 'author_stage_9_local_authoring_check'
  ) throw new Error('Step 87A requires the matching passed local Stage 9 report.');
  if (
    stageNine.summary?.passed !== true
    || stageNine.summary.errorCount !== 0
    || stageNine.errors?.length !== 0
    || stageNine.checks?.planning?.valid !== true
    || stageNine.checks?.content?.valid !== true
    || stageNine.checks?.encoding?.valid !== true
    || stageNine.checks?.packageIntegrity?.valid !== true
    || stageNine.checks?.iamLimitation?.active !== true
    || !stageNine.checks?.iamLimitation?.finding
    || stageNine.acceptedStagesOneToEightChanged !== false
  ) throw new Error('Step 87A can accept only a complete zero-error Stage 9 report with the IAM limitation active.');
  if (
    !Number.isInteger(stageNine.summary.taskCount) || stageNine.summary.taskCount < 1
    || !Number.isInteger(stageNine.summary.checkboxCount) || stageNine.summary.checkboxCount < 1
    || !Number.isInteger(stageNine.summary.verificationCheckCount) || stageNine.summary.verificationCheckCount < 1
    || !Number.isInteger(stageNine.summary.cleanupItemCount) || stageNine.summary.cleanupItemCount < 1
    || !Number.isInteger(stageNine.summary.resourceValueCount) || stageNine.summary.resourceValueCount < 0
    || stageNine.summary.retainedFindingCount !== stageNine.retainedManualReviewFindings?.length
    || stageNine.summary.warningCount !== (stageNine.warnings?.length || 0) + stageNine.retainedManualReviewFindings.length
  ) throw new Error('The Stage 9 report counts no longer match its reviewed content.');
  const expected = stageNine.checks.packageIntegrity.supportingFingerprints || {};
  if (Object.entries(supportingRecords).some(([key, value]) => fingerprintJson(value) !== expected[key])) {
    throw new Error('An accepted Stages 1-8 record no longer matches the Stage 9 integrity check.');
  }
  if (
    Object.keys(expected).length !== Object.keys(supportingRecords).length
    || stageNine.basedOnStage8Fingerprint?.value !== supportingRecords.stageEight?.acceptanceFingerprint?.value
    || session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7,8,9'
    || session.boundaries?.stage9Prepared !== true
    || session.boundaries?.stage10Prepared !== false
    || session.boundaries?.authorDraftWritten !== false
    || session.boundaries?.awsConnected !== false
    || session.boundaries?.supabaseConnected !== false
    || stageNine.stageBoundary?.preparedLocally?.join(',') !== '9'
    || stageNine.stageBoundary?.notPrepared?.join(',') !== '10,11,12'
    || stageNine.stageBoundary?.writtenToAuthor !== false
    || stageNine.stageBoundary?.connectedToAws !== false
    || stageNine.stageBoundary?.connectedToSupabase !== false
  ) throw new Error('Step 87A stopped because a local-only safety boundary changed.');
  return true;
}

export function buildStage87ALocalAcceptance({ session, stageNine, supportingRecords, now = () => new Date() } = {}) {
  validateStage87AAcceptanceInputs({ session, stageNine, supportingRecords });
  const acceptedAt = now().toISOString();
  const fingerprint = fingerprintJson(stageNineFingerprintContent(stageNine));
  const acceptedStageNine = {
    ...stageNine,
    status: 'human_accepted',
    acceptedAt,
    acceptanceFingerprint: { algorithm: 'sha256-json-v1', value: fingerprint }
  };
  const acceptedSession = {
    ...session,
    status: 'stage_9_accepted',
    currentStep: 'local_stage_9_authoring_check_accepted',
    updatedAt: acceptedAt,
    boundaries: {
      ...session.boundaries,
      stage9Prepared: true,
      stage9Accepted: true,
      stage10Prepared: false,
      authorDraftWritten: false,
      awsConnected: false,
      supabaseConnected: false
    }
  };
  const acceptance = {
    schemaVersion: 1,
    kind: 'author_stage_9_human_acceptance',
    status: 'accepted',
    sessionId: session.sessionId,
    approvalStep: '87A',
    acceptedAt,
    stageNineFingerprint: { algorithm: 'sha256-json-v1', value: fingerprint },
    basedOnStage8Fingerprint: { ...stageNine.basedOnStage8Fingerprint },
    acceptedSummary: { ...stageNine.summary },
    iamLimitationRetained: true,
    supportingRecordFingerprints: { ...stageNine.checks.packageIntegrity.supportingFingerprints },
    stagesOneToEightChanged: false,
    wroteToAuthor: false,
    connectedToAws: false,
    connectedToSupabase: false,
    beganStage10: false
  };
  return { session: acceptedSession, stageNine: acceptedStageNine, acceptance };
}

export function verifyStage87AAcceptanceFingerprint(stageNine, acceptance) {
  return fingerprintJson(stageNineFingerprintContent(stageNine)) === acceptance?.stageNineFingerprint?.value;
}
