import { fingerprintJson } from './authorAssistantStage84D.mjs';
import { verifyStage88BAcceptanceFingerprint } from './authorAssistantStage88B.mjs';

function stageElevenFingerprintContent(stageEleven) {
  const { status, reviewedAt, acceptedAt, acceptanceFingerprint, ...content } = stageEleven || {};
  return content;
}

export function validateStage89AAcceptanceInputs({ session, stageTen, stageTenAcceptance, stageEleven, correctionAudit } = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId || session.status !== 'stage_11_ready_for_review'
    || stageTen?.sessionId !== sessionId || stageTen.status !== 'human_accepted'
    || stageTenAcceptance?.sessionId !== sessionId || stageTenAcceptance.status !== 'accepted' || stageTenAcceptance.approvalStep !== '88B'
    || stageEleven?.sessionId !== sessionId || stageEleven.status !== 'awaiting_human_stage_11_review'
    || correctionAudit?.sessionId !== sessionId || correctionAudit.approvalStep !== '88A'
  ) throw new Error('Step 89A requires the matching passed Stage 11 review package.');
  if (!verifyStage88BAcceptanceFingerprint(stageTen, stageTenAcceptance)) throw new Error('The accepted Stage 10 fingerprint no longer matches.');
  if (
    stageEleven.basedOnStage10Fingerprint?.value !== stageTen.acceptanceFingerprint?.value
    || correctionAudit.futureCliGuidancePreserved !== true
    || stageEleven.validations?.planning?.valid !== true || stageEleven.validations?.content?.valid !== true || stageEleven.validations?.structuredReview?.valid !== true
    || stageEleven.reviewState?.learnerPreviewStatus !== 'reviewed' || stageEleven.reviewState?.reviewStatus !== 'ready_for_approval' || stageEleven.reviewState?.approvalDecision !== 'pending'
    || stageEleven.reviewState?.publicationVisibility !== 'unpublished' || stageEleven.reviewState?.publishStatus !== 'not_published'
    || stageEleven.summary?.openBlockingFindingCount !== 0 || stageEleven.summary?.openAdvisoryFindingCount !== 1 || stageEleven.findings?.length !== 1
    || stageEleven.findings[0]?.priority !== 'advisory' || stageEleven.findings[0]?.status !== 'open' || !/authorized by an administrator/i.test(stageEleven.findings[0]?.message || '')
    || stageEleven.safetyBoundary?.approvalPerformed !== false || stageEleven.safetyBoundary?.releaseCandidatePrepared !== false || stageEleven.safetyBoundary?.published !== false
    || stageEleven.acceptedStagesOneToTenChanged !== false
  ) throw new Error('Step 89A can accept only the complete passed Stage 11 review with its single IAM advisory.');
  if (
    stageEleven.summary.sourceFindingCount !== stageEleven.summary.resolvedFindingCount + stageEleven.findings[0].consolidatedFrom.length
    || stageEleven.resolvedByAcceptedContent?.length !== stageEleven.summary.resolvedFindingCount
    || stageEleven.stageBoundary?.preparedLocally?.join(',') !== '11' || stageEleven.stageBoundary?.notPrepared?.join(',') !== '12'
    || session.boundaries?.authorStagesPrepared?.join(',') !== '1,2,3,4,5,6,7,8,9,10,11'
    || session.boundaries?.stage11Prepared !== true || session.boundaries?.stage12Prepared !== false
    || session.boundaries?.candidatePrepared !== false || session.boundaries?.published !== false || session.boundaries?.authorDraftWritten !== false
  ) throw new Error('Step 89A stopped because a local review or Stage 12 safety boundary changed.');
  return true;
}

export function buildStage89ALocalAcceptance({ session, stageTen, stageTenAcceptance, stageEleven, correctionAudit, now = () => new Date() } = {}) {
  validateStage89AAcceptanceInputs({ session, stageTen, stageTenAcceptance, stageEleven, correctionAudit });
  const acceptedAt = now().toISOString(); const fingerprint = fingerprintJson(stageElevenFingerprintContent(stageEleven));
  const acceptedStageEleven = { ...stageEleven, status: 'human_accepted', acceptedAt, acceptanceFingerprint: { algorithm: 'sha256-json-v1', value: fingerprint } };
  const acceptedSession = { ...session, status: 'stage_11_accepted', currentStep: 'local_stage_11_structured_review_accepted', updatedAt: acceptedAt, boundaries: { ...session.boundaries, stage11Prepared: true, stage11Accepted: true, stage12Prepared: false, candidatePrepared: false, published: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false } };
  const acceptance = {
    schemaVersion: 1, kind: 'author_stage_11_human_acceptance', status: 'accepted', sessionId: session.sessionId, approvalStep: '89A', acceptedAt,
    stageElevenFingerprint: { algorithm: 'sha256-json-v1', value: fingerprint }, basedOnStage10Fingerprint: { ...stageEleven.basedOnStage10Fingerprint },
    reviewStatus: 'ready_for_approval', approvalDecision: 'pending', openBlockingFindingCount: 0, openAdvisoryFindingCount: 1, resolvedFindingCount: stageEleven.summary.resolvedFindingCount,
    stagesOneToTenChanged: false, wroteToAuthor: false, connectedToAws: false, connectedToSupabase: false, preparedReleaseCandidate: false, beganStage12: false
  };
  return { session: acceptedSession, stageEleven: acceptedStageEleven, acceptance };
}

export function verifyStage89AAcceptanceFingerprint(stageEleven, acceptance) {
  return fingerprintJson(stageElevenFingerprintContent(stageEleven)) === acceptance?.stageElevenFingerprint?.value;
}
