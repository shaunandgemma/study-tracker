import { fingerprintAuthorHandoffJson } from './authorHandoffPreview.js';
import { compareAuthorReleaseCandidate, verifyAuthorReleaseCandidate } from './authorApproval.js';

export const STEP_94_SQS_HANDOFF_FINGERPRINT = '8d9133a061e04bacfba136cad4680e329750c8f7daa0c170fa05672423a011ec';
export const STEP_94_SQS_DRAFT_ID = `author-draft-import-${STEP_94_SQS_HANDOFF_FINGERPRINT}`;

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function clean(value) {
  return String(value || '').trim().toLowerCase();
}

function counts(draft) {
  const tasks = draft?.tasks || [];
  return {
    phaseCount: (draft?.phases || []).length,
    taskCount: tasks.length,
    checkboxCount: tasks.flatMap(task => task.consoleSteps || []).flatMap(step => step.instructions || []).length,
    verificationCheckCount: tasks.flatMap(task => task.verification || []).length,
    cleanupItemCount: tasks.flatMap(task => task.cleanup || []).length + (draft?.cleanup?.steps || []).length,
    learnerResourceValueCount: draft?.resources?.schema?.length || 0,
    officialAwsSourceCount: (draft?.sources || []).length
  };
}

export function isStep94VerifiedSqsDraft(draft) {
  const source = draft?.draft?.importedFrom || {};
  return draft?.draft?.draftId === STEP_94_SQS_DRAFT_ID
    && draft?.programme?.serviceSlug === 'sqs'
    && draft?.programme?.serviceName === 'Amazon Simple Queue Service'
    && source.type === 'author_assistant_handoff'
    && source.importStep === '92'
    && source.acceptedStages === '1-11'
    && clean(source.handoffFingerprint) === STEP_94_SQS_HANDOFF_FINGERPRINT
    && SHA256_PATTERN.test(clean(source.acceptanceAuditFingerprint))
    && SHA256_PATTERN.test(clean(source.authorDraftContentFingerprint));
}

function check(id, label, passed, detail) {
  return { id, label, passed: Boolean(passed), detail };
}

export async function verifyStoredAuthorCandidate({ candidate, draft, expectedAuthorId, databaseContentHash, cryptoImpl = globalThis.crypto } = {}) {
  const candidateShape = {
    snapshot: candidate?.snapshot,
    contentHash: candidate?.content_hash,
    sourceRevision: candidate?.source_revision
  };
  const fingerprint = await verifyAuthorReleaseCandidate(candidateShape, cryptoImpl);
  const clientSnapshotHash = clean(fingerprint.actualHash);
  const comparison = await compareAuthorReleaseCandidate({ ...candidateShape, contentHash: clientSnapshotHash }, draft, cryptoImpl);
  const ownerMatches = candidate?.created_by === expectedAuthorId;
  const savedDraftHashMatches = clean(candidate?.draft_content_hash) === clean(databaseContentHash);
  const awaitingApproval = candidate?.status === 'awaiting_trusted_approval' && candidate?.approval_decision === 'pending';
  const serverSnapshotHash = clean(candidate?.content_hash);
  const serverSnapshotHashPresent = SHA256_PATTERN.test(serverSnapshotHash);
  const candidateIdMatchesSnapshot = SHA256_PATTERN.test(clientSnapshotHash) && String(candidate?.candidate_id || '').endsWith(`-${clientSnapshotHash.slice(0, 12)}`);
  return {
    candidateId: candidate?.candidate_id,
    sourceRevision: Number(candidate?.source_revision),
    createdBy: candidate?.created_by,
    status: candidate?.status,
    approvalDecision: candidate?.approval_decision,
    contentHash: serverSnapshotHash,
    clientSnapshotHash,
    draftContentHash: clean(candidate?.draft_content_hash),
    serverSnapshotHashPresent,
    candidateIdMatchesSnapshot,
    matchesCurrentDraft: comparison.matches,
    ownerMatches,
    savedDraftHashMatches,
    awaitingApproval,
    valid: serverSnapshotHashPresent && candidateIdMatchesSnapshot && comparison.matches && ownerMatches && savedDraftHashMatches && awaitingApproval
  };
}

export async function buildAuthorCandidateReadinessPreview({
  draft,
  userId,
  authorEmail = '',
  storageMode,
  serverDraft,
  serverRow,
  candidates = [],
  planningValidation,
  contentValidation,
  reviewValidation,
  cryptoImpl = globalThis.crypto
} = {}) {
  const source = draft?.draft?.importedFrom || {};
  const currentRevision = Number(draft?.draft?.revision) || 0;
  const [currentDraftFingerprint, savedSharedDraftFingerprint] = await Promise.all([
    fingerprintAuthorHandoffJson(draft, cryptoImpl),
    fingerprintAuthorHandoffJson(serverDraft, cryptoImpl)
  ]);
  const draftCandidates = candidates.filter(candidate => candidate?.draft_id === draft?.draft?.draftId);
  const currentRevisionCandidates = draftCandidates.filter(candidate => Number(candidate?.source_revision) === currentRevision);
  const duplicateState = currentRevisionCandidates.length === 0
    ? 'none_for_current_revision'
    : currentRevisionCandidates.length === 1
      ? 'existing_candidate_for_current_revision'
      : 'multiple_candidates_for_current_revision';
  const serverOwnerId = String(serverRow?.owner_id || '');
  const databaseContentHash = clean(serverRow?.content_hash);
  const existingCandidateRecords = await Promise.all(currentRevisionCandidates.map(candidate => verifyStoredAuthorCandidate({ candidate, draft, expectedAuthorId: userId, databaseContentHash, cryptoImpl })));

  const checks = [
    check('verified_sqs_handoff', 'Exact verified SQS handoff', isStep94VerifiedSqsDraft(draft), 'The deterministic SQS draft ID and Step 92 source fingerprints match.'),
    check('shared_storage', 'Private Shared Draft storage', storageMode === 'shared_supabase', 'Candidate readiness is available only for the saved Shared Draft.'),
    check('server_identity', 'Saved server draft identity', serverRow?.draft_id === draft?.draft?.draftId, 'The open editor and saved server row use the same draft ID.'),
    check('author_ownership', 'Signed-in Author owns the saved draft', serverOwnerId === userId && serverDraft?.draft?.createdBy === userId && draft?.draft?.createdBy === userId, 'The editor, saved content and server owner all match the signed-in Author.'),
    check('saved_revision', 'Open and saved revisions match', Number(serverRow?.revision) === currentRevision && Number(serverDraft?.draft?.revision) === currentRevision, `The current shared revision is ${currentRevision}.`),
    check('exact_saved_content', 'Open content matches the saved Shared Draft', currentDraftFingerprint === savedSharedDraftFingerprint, 'The complete SHA-256 fingerprints match.'),
    check('database_fingerprint', 'Database content fingerprint is present', SHA256_PATTERN.test(databaseContentHash), 'The protected server row contains its database-generated SHA-256 content hash.'),
    check('ready_review_state', 'Draft is Ready for Approval', serverRow?.status === 'ready_for_approval' && draft?.review?.reviewStatus === 'ready_for_approval', 'Both the saved row and reviewed content are ready.'),
    check('planning_validation', 'Planning validation passed', planningValidation?.valid, 'The current planning rules pass.'),
    check('content_validation', 'Content and safety validation passed', contentValidation?.valid, 'The current content and safety rules pass.'),
    check('review_validation', 'Structured review validation passed', reviewValidation?.valid, 'The current structured review rules pass.'),
    check('approval_pending', 'Approval decision remains pending', draft?.review?.approvalDecision === 'pending', 'No approval decision has been recorded.'),
    check('unpublished', 'Programme remains unpublished', draft?.programme?.publicationVisibility === 'unpublished' && draft?.publication?.publishStatus === 'not_published', 'Learners still cannot see this programme.'),
    check('no_duplicate_candidate', 'No candidate exists for this revision', currentRevisionCandidates.length === 0, currentRevisionCandidates.length === 0 ? `Revision ${currentRevision} has no release candidate.` : `Revision ${currentRevision} already has ${currentRevisionCandidates.length} release candidate record(s).`)
  ];

  return {
    success: true,
    step: '94',
    previewOnly: true,
    readyForCandidateGeneration: checks.every(item => item.passed),
    programmeTitle: draft?.programme?.displayName || '',
    draftId: draft?.draft?.draftId || '',
    currentRevision,
    intendedAuthor: { id: userId || '', email: authorEmail || '' },
    serverOwnerId,
    counts: counts(draft),
    fingerprints: {
      handoff: clean(source.handoffFingerprint),
      acceptedContent: clean(source.authorDraftContentFingerprint),
      currentDraft: currentDraftFingerprint,
      savedSharedDraft: savedSharedDraftFingerprint,
      databaseContent: databaseContentHash
    },
    exactSavedContent: currentDraftFingerprint === savedSharedDraftFingerprint,
    duplicateState,
    draftCandidateCount: draftCandidates.length,
    currentRevisionCandidateCount: currentRevisionCandidates.length,
    existingCandidateIds: currentRevisionCandidates.map(candidate => candidate.candidate_id),
    existingCandidateRecords,
    checks,
    boundaries: {
      databaseReadsOnly: true,
      databaseWrites: 0,
      candidateCreated: false,
      candidateIdGenerated: false,
      approvalPerformed: false,
      publicationPerformed: false
    }
  };
}
