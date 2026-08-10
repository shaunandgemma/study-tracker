import { canAccessFollowAlongApprovals, getAuthorRoles } from './authorAccess.js';
import { AUTHOR_APPROVAL_STORAGE_AUTHORITY, canApproveAuthorRelease } from './authorApproval.js';
import { STEP_94_SQS_DRAFT_ID, verifyStoredAuthorCandidate } from './authorCandidateReadiness.js';

export const STEP_96_SQS_CANDIDATE_ID = 'release-author-draft-import-8d9133a061e04bacfba136cad4680e329750c8f7daa0c170fa05672423a011ec-r2-b56d599d5479';

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function clean(value) {
  return String(value || '').trim().toLowerCase();
}

function check(id, label, passed, detail) {
  return { id, label, passed: Boolean(passed), detail };
}

function counts(candidate) {
  const snapshot = candidate?.snapshot || {};
  const tasks = snapshot.tasks || [];
  return {
    phaseCount: (snapshot.phases || []).length,
    taskCount: tasks.length,
    checkboxCount: tasks.flatMap(task => task.consoleSteps || []).flatMap(step => step.instructions || []).length,
    verificationCheckCount: tasks.flatMap(task => task.verification || []).length,
    cleanupItemCount: tasks.flatMap(task => task.cleanup || []).length + (snapshot.cleanup?.steps || []).length,
    officialAwsSourceCount: (snapshot.sources || []).length
  };
}

export function isStep96SqsCandidate(candidate) {
  return candidate?.candidate_id === STEP_96_SQS_CANDIDATE_ID
    && candidate?.draft_id === STEP_94_SQS_DRAFT_ID
    && Number(candidate?.source_revision) === 2
    && candidate?.snapshot?.programme?.serviceSlug === 'sqs'
    && candidate?.snapshot?.programme?.serviceName === 'Amazon Simple Queue Service';
}

export async function buildAuthorApproverReadinessPreview({ candidate, currentUser, draftResult, currentPublication, cryptoImpl = globalThis.crypto } = {}) {
  const serverRow = draftResult?.row || {};
  const serverDraft = draftResult?.draft;
  const roles = getAuthorRoles(currentUser);
  const access = canApproveAuthorRelease({ user: currentUser, createdBy: candidate?.created_by, storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER });
  const candidateVerification = await verifyStoredAuthorCandidate({
    candidate,
    draft: serverDraft,
    expectedAuthorId: serverRow.owner_id,
    databaseContentHash: serverRow.content_hash,
    cryptoImpl
  });
  const unpublished = candidate?.snapshot?.programme?.publicationVisibility === 'unpublished'
    && candidate?.snapshot?.publication?.publishStatus === 'not_published'
    && currentPublication?.candidate_id !== candidate?.candidate_id;
  const checks = [
    check('exact_candidate_key', 'Exact verified SQS Candidate Approval Key', isStep96SqsCandidate(candidate), 'The complete candidate key, SQS draft ID and source revision match Step 95.'),
    check('server_approver_role', 'Server-managed Approver role', canAccessFollowAlongApprovals(currentUser) && roles.some(role => role === 'approver' || role === 'admin'), 'Approver access comes only from protected app metadata.'),
    check('separate_identity', 'Approver is different from the Author', access.allowed && currentUser?.id !== candidate?.created_by, 'The signed-in Approver cannot be the candidate Author.'),
    check('saved_draft_identity', 'Candidate points to the saved SQS Shared Draft', serverRow.draft_id === candidate?.draft_id && serverDraft?.draft?.draftId === candidate?.draft_id, 'The protected draft row and candidate use the same draft ID.'),
    check('source_revision', 'Candidate and saved revision match', Number(serverRow.revision) === Number(candidate?.source_revision) && Number(serverDraft?.draft?.revision) === Number(candidate?.source_revision), `The candidate and saved Shared Draft are revision ${candidate?.source_revision}.`),
    check('candidate_key_hash', 'Candidate key matches its canonical snapshot hash', candidateVerification.candidateIdMatchesSnapshot, 'The key suffix matches the first 12 characters of the canonical snapshot SHA-256.'),
    check('server_candidate_hash', 'Protected candidate fingerprint is present', candidateVerification.serverSnapshotHashPresent && SHA256_PATTERN.test(clean(candidate?.content_hash)), 'The immutable candidate row contains its protected server SHA-256.'),
    check('snapshot_matches_draft', 'Candidate snapshot matches the current Shared Draft', candidateVerification.matchesCurrentDraft, 'The complete candidate snapshot still matches the saved revision.'),
    check('saved_draft_hash', 'Candidate is bound to the saved draft hash', candidateVerification.savedDraftHashMatches, 'The candidate draft hash matches the protected current draft row.'),
    check('candidate_author', 'Candidate creator matches the Shared Draft owner', candidateVerification.ownerMatches && serverRow.owner_id === candidate?.created_by, 'The candidate Author and protected draft owner match.'),
    check('pending_state', 'Candidate is awaiting a decision', candidateVerification.awaitingApproval && !candidate?.approved_by && !candidate?.approved_at, 'No approval or rejection decision has been recorded.'),
    check('unpublished_state', 'Candidate remains unpublished', unpublished, 'The candidate and programme have no publication record.'),
    check('review_state', 'Reviewed snapshot remains Ready for Approval', candidate?.snapshot?.review?.reviewStatus === 'ready_for_approval' && candidate?.snapshot?.review?.approvalDecision === 'pending', 'The immutable reviewed snapshot is ready and pending.'),
    check('complete_verification', 'Stored candidate integrity passed', candidateVerification.valid, 'Candidate key, snapshot, Author, revision and saved draft hash all match.')
  ];

  return {
    success: true,
    step: '96',
    previewOnly: true,
    readyForManualApproval: checks.every(item => item.passed),
    candidateId: candidate?.candidate_id || '',
    programmeTitle: candidate?.snapshot?.programme?.displayName || '',
    sourceRevision: Number(candidate?.source_revision) || 0,
    approver: { id: currentUser?.id || '', email: currentUser?.email || '', roles },
    authorId: candidate?.created_by || '',
    serverOwnerId: serverRow.owner_id || '',
    status: candidate?.status || '',
    approvalDecision: candidate?.approval_decision || '',
    publicationStatus: unpublished ? 'not_published' : 'publication_found',
    counts: counts(candidate),
    candidateVerification,
    checks,
    boundaries: { databaseReadsOnly: true, databaseWrites: 0, approvalPerformed: false, rejectionPerformed: false, publicationPerformed: false }
  };
}
