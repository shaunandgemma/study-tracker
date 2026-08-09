import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import {
  AUTHOR_APPROVAL_STORAGE_AUTHORITY,
  approveAuthorReleaseCandidate,
  buildAuthorReleaseSnapshot,
  canApproveAuthorRelease,
  compareAuthorReleaseCandidate,
  createAuthorReleaseCandidate,
  getAuthorApproverRoles,
  serializeAuthorReleaseCandidate,
  verifyAuthorReleaseCandidate
} from '../src/features/followAlongAuthor/authorApproval.js';

const passed = { valid: true, errors: [], warnings: [] };
const failed = { valid: false, errors: [{ message: 'Fix this.' }], warnings: [] };

function readyDraft() {
  const draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'Amazon VPC', shortName: 'VPC' }, now: () => new Date('2026-08-09T10:00:00.000Z'), idFactory: () => 'approval' });
  return {
    ...draft,
    programme: { ...draft.programme, subtitle: 'Virtual Private Cloud and Networking' },
    review: { ...draft.review, learnerPreviewStatus: 'reviewed', reviewStatus: 'ready_for_approval', approvalDecision: 'pending', findings: [] }
  };
}

async function candidateFor(draft = readyDraft()) {
  const result = await createAuthorReleaseCandidate({ draft, userId: 'author-1', planningValidation: passed, contentValidation: passed, reviewValidation: passed, now: () => new Date('2026-08-09T12:00:00.000Z') });
  assert.equal(result.success, true, result.error);
  return result.candidate;
}

test('Follow Along Author release candidate and secure approval boundary', async t => {
  await t.test('1. Approver roles come only from server-managed app metadata', () => {
    assert.deepEqual(getAuthorApproverRoles({ app_metadata: { roles: ['author', 'approver'] } }), ['approver']);
    assert.deepEqual(getAuthorApproverRoles({ app_metadata: { role: 'admin' } }), ['admin']);
    assert.deepEqual(getAuthorApproverRoles({ user_metadata: { role: 'admin' } }), []);
  });

  await t.test('2. Browser-only storage blocks final approval even for an admin', () => {
    const result = canApproveAuthorRelease({ user: { id: 'admin-1', app_metadata: { role: 'admin' } }, createdBy: 'author-1', storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.LOCAL_BROWSER });
    assert.equal(result.allowed, false);
    assert.match(result.reason, /trusted shared server storage/i);
  });

  await t.test('3. Trusted approval requires a different admin or approver', () => {
    const admin = canApproveAuthorRelease({ user: { id: 'admin-1', app_metadata: { role: 'admin' } }, createdBy: 'author-1', storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER });
    assert.equal(admin.allowed, true);
    const approver = canApproveAuthorRelease({ user: { id: 'reviewer-1', app_metadata: { roles: ['approver'] } }, createdBy: 'author-1', storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER });
    assert.equal(approver.allowed, true);
    const self = canApproveAuthorRelease({ user: { id: 'author-1', app_metadata: { role: 'admin' } }, createdBy: 'author-1', storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER });
    assert.equal(self.allowed, false);
    assert.match(self.reason, /cannot approve their own/i);
  });

  await t.test('4. Candidate preparation requires ownership, Ready for Approval and passing validation', async () => {
    const draft = readyDraft();
    assert.equal((await createAuthorReleaseCandidate({ draft, userId: 'other', planningValidation: passed, contentValidation: passed, reviewValidation: passed })).success, false);
    assert.equal((await createAuthorReleaseCandidate({ draft: { ...draft, review: { ...draft.review, reviewStatus: 'in_review' } }, userId: 'author-1', planningValidation: passed, contentValidation: passed, reviewValidation: passed })).success, false);
    assert.equal((await createAuthorReleaseCandidate({ draft, userId: 'author-1', planningValidation: failed, contentValidation: passed, reviewValidation: passed })).success, false);
  });

  await t.test('5. Candidate snapshot is private, manual-only and fingerprinted', async () => {
    const candidate = await candidateFor();
    assert.equal(candidate.immutable, true);
    assert.equal(candidate.status, 'awaiting_trusted_approval');
    assert.equal(candidate.storageAuthority, 'local_browser');
    assert.match(candidate.contentHash, /^[a-f0-9]{64}$/);
    assert.equal(candidate.snapshot.programme.publicationVisibility, 'unpublished');
    assert.equal(candidate.snapshot.publication.publishStatus, 'not_published');
    assert.equal(candidate.snapshot.cleanup.manualOnly, true);
    assert.equal(candidate.approval.decision, 'pending');
  });

  await t.test('6. Identical draft content produces the same SHA-256 content fingerprint', async () => {
    const draft = readyDraft();
    const first = await candidateFor(draft);
    const second = (await createAuthorReleaseCandidate({ draft, userId: 'author-1', planningValidation: passed, contentValidation: passed, reviewValidation: passed, now: () => new Date('2026-08-09T13:00:00.000Z') })).candidate;
    assert.equal(first.contentHash, second.contentHash);
    assert.equal(first.candidateId, second.candidateId);
    assert.notEqual(first.createdAt, second.createdAt);
  });

  await t.test('7. Candidate integrity verification detects snapshot tampering', async () => {
    const candidate = await candidateFor();
    assert.equal((await verifyAuthorReleaseCandidate(candidate)).valid, true);
    const changed = JSON.parse(JSON.stringify(candidate));
    changed.snapshot.programme.displayName = 'Changed after preparation';
    const result = await verifyAuthorReleaseCandidate(changed);
    assert.equal(result.valid, false);
    assert.match(result.error, /content has changed/i);
  });

  await t.test('8. Candidate comparison detects current draft content or revision changes', async () => {
    const draft = readyDraft();
    const candidate = await candidateFor(draft);
    assert.equal((await compareAuthorReleaseCandidate(candidate, draft)).matches, true);
    const changed = { ...draft, draft: { ...draft.draft, revision: 2 }, programme: { ...draft.programme, subtitle: 'Changed subtitle' } };
    const result = await compareAuthorReleaseCandidate(candidate, changed);
    assert.equal(result.matches, false);
    assert.equal(result.currentRevision, 2);
  });

  await t.test('9. Trusted approval records the different approver, time, revision and fingerprint', async () => {
    const draft = readyDraft();
    const candidate = await candidateFor(draft);
    const result = await approveAuthorReleaseCandidate({ candidate, currentDraft: draft, approver: { id: 'approver-2', app_metadata: { role: 'approver' } }, storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER, planningValidation: passed, contentValidation: passed, reviewValidation: passed, now: () => new Date('2026-08-09T14:00:00.000Z') });
    assert.equal(result.success, true, result.error);
    assert.equal(result.candidate.status, 'approved_release_candidate');
    assert.equal(result.candidate.approval.approvedBy, 'approver-2');
    assert.equal(result.candidate.approval.approvedAt, '2026-08-09T14:00:00.000Z');
    assert.equal(result.candidate.approval.approvedRevision, 1);
    assert.equal(result.candidate.approval.contentHash, candidate.contentHash);
  });

  await t.test('10. Approval rejects stale drafts, failed revalidation and user-editable role claims', async () => {
    const draft = readyDraft();
    const candidate = await candidateFor(draft);
    const base = { candidate, currentDraft: draft, storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER, planningValidation: passed, contentValidation: passed, reviewValidation: passed };
    const fakeRole = await approveAuthorReleaseCandidate({ ...base, approver: { id: 'fake', user_metadata: { role: 'admin' } } });
    assert.equal(fakeRole.success, false);
    const stale = await approveAuthorReleaseCandidate({ ...base, currentDraft: { ...draft, draft: { ...draft.draft, revision: 2 } }, approver: { id: 'admin-1', app_metadata: { role: 'admin' } } });
    assert.equal(stale.success, false);
    assert.match(stale.error, /changed after/i);
    const invalid = await approveAuthorReleaseCandidate({ ...base, approver: { id: 'admin-1', app_metadata: { role: 'admin' } }, contentValidation: failed });
    assert.equal(invalid.success, false);
    assert.match(invalid.error, /validation/i);
  });

  await t.test('11. Approval creates a release candidate only and never publishes it', async () => {
    const draft = readyDraft();
    const candidate = await candidateFor(draft);
    const result = await approveAuthorReleaseCandidate({ candidate, currentDraft: draft, approver: { id: 'admin-1', app_metadata: { role: 'admin' } }, storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER, planningValidation: passed, contentValidation: passed, reviewValidation: passed });
    assert.equal(result.success, true);
    assert.equal(result.candidate.publication.status, 'not_published');
    assert.equal(result.candidate.snapshot.publication.publishStatus, 'not_published');
    assert.equal(result.candidate.snapshot.programme.publicationVisibility, 'unpublished');
  });

  await t.test('12. Snapshot export is stable and the UI exposes no local approval or publishing action', async () => {
    const draft = readyDraft();
    const snapshot = buildAuthorReleaseSnapshot(draft);
    assert.equal(snapshot.review.approvalDecision, 'pending');
    const candidate = await candidateFor(draft);
    assert.deepEqual(JSON.parse(serializeAuthorReleaseCandidate(candidate)), candidate);
    const files = ['src/features/followAlongAuthor/authorApproval.js', 'src/features/followAlongAuthor/AuthorApprovalStage.jsx'];
    const source = files.map(file => readFileSync(file, 'utf8')).join('\n');
    assert.doesNotMatch(source, /scripts\/generator|generator_v2|HandsOn|TaskContext|tasksData|FOLLOW_ALONG_PROGRAMMES/);
    const ui = readFileSync('src/features/followAlongAuthor/AuthorApprovalStage.jsx', 'utf8');
    assert.doesNotMatch(ui, /approveAuthorReleaseCandidate|publishDraft|registerProgramme/);
    assert.match(ui, /Final approval is disabled/);
  });
});
