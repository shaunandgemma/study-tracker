import { fingerprintJson } from './authorAssistantStage84D.mjs';
import { verifyAuthorHandoffPackageFingerprint } from './authorAssistantHandoff.mjs';

function auditFingerprintContent(acceptance) {
  const content = structuredClone(acceptance || {});
  delete content.acceptedAt;
  delete content.acceptanceAuditFingerprint;
  return content;
}

export function validateStage90AAcceptanceInputs({ session, handoffPackage } = {}) {
  const sessionId = session?.sessionId;
  if (
    !sessionId
    || session.status !== 'handoff_package_ready_for_review'
    || handoffPackage?.sessionId !== sessionId
    || handoffPackage.kind !== 'author_local_handoff_package'
    || handoffPackage.status !== 'awaiting_human_handoff_review'
  ) throw new Error('Step 90A requires the matching verified local handoff package.');
  if (!verifyAuthorHandoffPackageFingerprint(handoffPackage)) {
    throw new Error('Step 90A stopped because the local handoff package fingerprint no longer matches.');
  }
  if (
    handoffPackage.handoffFingerprint?.algorithm !== 'sha256-json-v1'
    || !/^[a-f0-9]{64}$/.test(handoffPackage.handoffFingerprint?.value || '')
    || handoffPackage.acceptedStagesOneToElevenChanged !== false
    || !handoffPackage.authorDraftContent?.programme?.programmeId
    || !handoffPackage.acceptedRecordManifest
    || Object.keys(handoffPackage.acceptedRecordManifest).length < 1
    || !Number.isInteger(handoffPackage.summary?.taskCount)
    || handoffPackage.summary.taskCount < 1
    || !Number.isInteger(handoffPackage.summary?.checkboxCount)
    || handoffPackage.summary.checkboxCount < 1
  ) throw new Error('Step 90A requires the complete fingerprinted handoff content.');

  const identity = handoffPackage.identityBinding || {};
  const boundary = handoffPackage.handoffBoundary || {};
  const sessionBoundary = session.boundaries || {};
  if (
    identity.status !== 'required_before_author_write'
    || identity.assignedAuthorId !== null
    || identity.assignedDraftId !== null
    || identity.assignedRevision !== null
    || boundary.localPackageOnly !== true
    || boundary.stage12Started !== false
    || boundary.authorDraftWritten !== false
    || boundary.authorIdentityBound !== false
    || boundary.connectedToAuthor !== false
    || boundary.connectedToSupabase !== false
    || boundary.connectedToAws !== false
    || boundary.releaseCandidatePrepared !== false
    || boundary.candidateIdGenerated !== false
    || boundary.approvalPerformed !== false
    || boundary.published !== false
    || sessionBoundary.handoffPackagePrepared !== true
    || sessionBoundary.stage12Prepared !== false
    || sessionBoundary.authorDraftWritten !== false
    || sessionBoundary.supabaseConnected !== false
    || sessionBoundary.awsConnected !== false
    || sessionBoundary.candidatePrepared !== false
    || sessionBoundary.published !== false
  ) throw new Error('Step 90A stopped because the local-only acceptance boundary changed.');
  return true;
}

export function buildStage90ALocalAcceptance({ session, handoffPackage, now = () => new Date() } = {}) {
  validateStage90AAcceptanceInputs({ session, handoffPackage });
  const acceptedAt = now().toISOString();
  const acceptance = {
    schemaVersion: 1,
    kind: 'author_local_handoff_human_acceptance',
    status: 'accepted',
    sessionId: session.sessionId,
    approvalStep: '90A',
    acceptedAt,
    handoffFingerprint: { ...handoffPackage.handoffFingerprint },
    authorDraftContentFingerprint: {
      algorithm: 'sha256-json-v1',
      value: fingerprintJson(handoffPackage.authorDraftContent)
    },
    acceptedRecordManifestFingerprint: {
      algorithm: 'sha256-json-v1',
      value: fingerprintJson(handoffPackage.acceptedRecordManifest)
    },
    acceptedSummary: { ...handoffPackage.summary },
    packageChanged: false,
    authorIdentityBound: false,
    wroteToAuthor: false,
    connectedToSupabase: false,
    connectedToAws: false,
    preparedReleaseCandidate: false,
    generatedCandidateId: false,
    approved: false,
    published: false,
    beganStage12: false
  };
  acceptance.acceptanceAuditFingerprint = {
    algorithm: 'sha256-json-v1',
    value: fingerprintJson(auditFingerprintContent(acceptance))
  };
  return acceptance;
}

export function verifyStage90AAcceptance(handoffPackage, acceptance) {
  return (
    acceptance?.status === 'accepted'
    && acceptance.approvalStep === '90A'
    && acceptance.sessionId === handoffPackage?.sessionId
    && verifyAuthorHandoffPackageFingerprint(handoffPackage)
    && acceptance.handoffFingerprint?.value === handoffPackage.handoffFingerprint?.value
    && acceptance.authorDraftContentFingerprint?.value === fingerprintJson(handoffPackage.authorDraftContent)
    && acceptance.acceptedRecordManifestFingerprint?.value === fingerprintJson(handoffPackage.acceptedRecordManifest)
    && acceptance.acceptanceAuditFingerprint?.value === fingerprintJson(auditFingerprintContent(acceptance))
  );
}
