import { fingerprintJson } from './authorAssistantStage84D.mjs';
import { verifyStage87AAcceptanceFingerprint } from './authorAssistantStage87A.mjs';

function stageTenFingerprintContent(stageTen) {
  const { status, generatedAt, acceptedAt, acceptanceFingerprint, ...content } = stageTen || {};
  return content;
}

export function validateStage88BAcceptanceInputs({ session, stageNine, stageNineAcceptance, stageTen, correctionAudit } = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId || session.status !== 'stage_10_ready_for_review'
    || stageNine?.sessionId !== sessionId || stageNine.status !== 'human_accepted'
    || stageNineAcceptance?.sessionId !== sessionId || stageNineAcceptance.status !== 'accepted'
    || stageTen?.sessionId !== sessionId || stageTen.status !== 'awaiting_human_preview_review'
    || correctionAudit?.sessionId !== sessionId || correctionAudit.status !== 'applied_locally' || correctionAudit.approvalStep !== '88A'
  ) throw new Error('Step 88B requires the matching corrected Stage 10 review package.');
  if (!verifyStage87AAcceptanceFingerprint(stageNine, stageNineAcceptance)) throw new Error('The accepted corrected Stage 9 fingerprint no longer matches.');
  if (
    correctionAudit.newFingerprints?.stageNine !== stageNine.acceptanceFingerprint?.value
    || correctionAudit.newFingerprints?.stageTen !== fingerprintJson(stageTen)
    || correctionAudit.stageNineRerunPassed !== true
    || correctionAudit.futureCliGuidancePreserved !== true
    || correctionAudit.acceptedConsoleInstructionsChanged !== false
    || correctionAudit.unrelatedContentChanged !== false
  ) throw new Error('The Step 88A correction audit no longer matches the corrected package.');
  const correctedTaskIds = new Set(correctionAudit.goalCorrections?.map(item => item.taskId));
  if (correctedTaskIds.size !== 2 || stageTen.tasks.filter(task => correctedTaskIds.has(task.id)).some(task => /receipt handle/i.test(task.goal))) {
    throw new Error('The corrected learner-facing Console goals still contain receipt-handle wording.');
  }
  if (
    stageTen.privacyBoundary?.learnerFacingFieldsOnly !== true
    || stageTen.privacyBoundary?.privateReviewFindingsIncluded !== false
    || stageTen.privacyBoundary?.acceptanceFingerprintsIncluded !== false
    || stageTen.privacyBoundary?.aiResponseDataIncluded !== false
    || stageTen.privacyBoundary?.futureCliGuidanceIncluded !== false
    || stageTen.privacyBoundary?.commandsExecuted !== false
    || stageTen.privacyBoundary?.progressSaved !== false
    || stageTen.summary?.taskCount < 1 || stageTen.summary?.checkboxCount < 1
    || stageTen.summary?.verificationCheckCount < 1 || stageTen.summary?.cleanupItemCount < 1
    || stageTen.summary?.availableModes?.join(',') !== 'console'
    || stageTen.acceptedStagesOneToNineChanged !== false
  ) throw new Error('The corrected Stage 10 learner-only preview boundary is incomplete.');
  const taskCount = stageTen.tasks.length;
  const checkboxCount = stageTen.tasks.flatMap(task => task.consoleSteps || []).flatMap(step => step.instructions || []).length;
  const verificationCount = stageTen.tasks.flatMap(task => task.verification || []).length;
  const cleanupCount = (stageTen.cleanup?.taskSteps || []).length + (stageTen.cleanup?.programmeSteps || []).length;
  if (taskCount !== stageTen.summary.taskCount || checkboxCount !== stageTen.summary.checkboxCount || verificationCount !== stageTen.summary.verificationCheckCount || cleanupCount !== stageTen.summary.cleanupItemCount) {
    throw new Error('The corrected Stage 10 preview counts no longer match its learner content.');
  }
  if (
    stageTen.basedOnStage9Fingerprint?.value !== stageNine.acceptanceFingerprint?.value
    || session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7,8,9,10'
    || session.boundaries?.stage10Prepared !== true || session.boundaries?.stage11Prepared !== false
    || session.boundaries?.authorDraftWritten !== false || session.boundaries?.awsConnected !== false || session.boundaries?.supabaseConnected !== false
    || stageTen.stageBoundary?.preparedLocally?.join(',') !== '10' || stageTen.stageBoundary?.notPrepared?.join(',') !== '11,12'
  ) throw new Error('Step 88B stopped because a local-only safety boundary changed.');
  return { taskCount, checkboxCount, verificationCount, cleanupCount };
}

export function buildStage88BLocalAcceptance({ session, stageNine, stageNineAcceptance, stageTen, correctionAudit, now = () => new Date() } = {}) {
  const counts = validateStage88BAcceptanceInputs({ session, stageNine, stageNineAcceptance, stageTen, correctionAudit });
  const acceptedAt = now().toISOString();
  const fingerprint = fingerprintJson(stageTenFingerprintContent(stageTen));
  const acceptedStageTen = { ...stageTen, status: 'human_accepted', acceptedAt, acceptanceFingerprint: { algorithm: 'sha256-json-v1', value: fingerprint } };
  const acceptedSession = { ...session, status: 'stage_10_accepted', currentStep: 'local_stage_10_learner_preview_accepted', updatedAt: acceptedAt, boundaries: { ...session.boundaries, stage10Prepared: true, stage10Accepted: true, stage11Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false } };
  const acceptance = {
    schemaVersion: 1, kind: 'author_stage_10_human_acceptance', status: 'accepted', sessionId: session.sessionId, approvalStep: '88B', acceptedAt,
    stageTenFingerprint: { algorithm: 'sha256-json-v1', value: fingerprint }, basedOnStage9Fingerprint: { ...stageTen.basedOnStage9Fingerprint }, basedOnCorrectionStep: '88A',
    taskCount: counts.taskCount, checkboxCount: counts.checkboxCount, verificationCheckCount: counts.verificationCount, cleanupItemCount: counts.cleanupCount,
    learnerFacingFieldsOnly: true, receiptHandleExcludedFromConsoleGoals: true, futureCliGuidancePreservedByCorrection: true,
    stagesOneToNineChanged: false, wroteToAuthor: false, connectedToAws: false, connectedToSupabase: false, beganStage11: false
  };
  return { session: acceptedSession, stageTen: acceptedStageTen, acceptance };
}

export function verifyStage88BAcceptanceFingerprint(stageTen, acceptance) {
  return fingerprintJson(stageTenFingerprintContent(stageTen)) === acceptance?.stageTenFingerprint?.value;
}
