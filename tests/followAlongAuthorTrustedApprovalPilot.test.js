import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  canAccessFollowAlongApprovals,
  canAccessFollowAlongAuthor,
  isAuthorApprovalEntryRequested,
  isUnsupportedAuthorEntryRequested
} from '../src/features/followAlongAuthor/authorAccess.js';
import {
  AUTHOR_TRUSTED_APPROVAL_FLAG,
  isAuthorTrustedApprovalEnabled
} from '../src/features/followAlongAuthor/authorSharedStorageService.js';
import { AUTHOR_STORAGE_MODE, createAuthorStorageCoordinator } from '../src/features/followAlongAuthor/authorStorageCoordinator.js';

const migrationPath = 'supabase/migrations/20260812_follow_along_trusted_approval_pilot_activation.sql';
const rollbackPath = 'supabase/rollback/20260812_follow_along_trusted_approval_pilot_activation_rollback.sql';

test('Step 53 trusted approval pilot', async t => {
  await t.test('1. Author and Approver routes use separate server-managed roles', () => {
    const author = { id: 'author-1', app_metadata: { role: 'author' } };
    const approver = { id: 'approver-1', app_metadata: { role: 'approver' } };
    assert.equal(canAccessFollowAlongAuthor(author), true);
    assert.equal(canAccessFollowAlongApprovals(author), false);
    assert.equal(canAccessFollowAlongAuthor(approver), false);
    assert.equal(canAccessFollowAlongApprovals(approver), true);
    assert.equal(canAccessFollowAlongApprovals({ id: 'fake', user_metadata: { role: 'approver' } }), false);
    assert.equal(isAuthorApprovalEntryRequested({ hash: '#author/approvals' }), true);
    assert.equal(isAuthorApprovalEntryRequested({ hash: '#author' }), false);
    assert.equal(isAuthorApprovalEntryRequested({ hash: '#author/approvals/' }), false);
    assert.equal(isUnsupportedAuthorEntryRequested({ hash: '#author/approvals/' }), true);
  });

  await t.test('2. Trusted approval application flag is strict and disabled by default', () => {
    assert.equal(AUTHOR_TRUSTED_APPROVAL_FLAG, 'VITE_FOLLOW_ALONG_TRUSTED_APPROVAL');
    assert.equal(isAuthorTrustedApprovalEnabled({}), false);
    assert.equal(isAuthorTrustedApprovalEnabled({ [AUTHOR_TRUSTED_APPROVAL_FLAG]: 'true' }), true);
    assert.equal(isAuthorTrustedApprovalEnabled({ [AUTHOR_TRUSTED_APPROVAL_FLAG]: 'TRUE' }), true);
    assert.equal(isAuthorTrustedApprovalEnabled({ [AUTHOR_TRUSTED_APPROVAL_FLAG]: '1' }), false);
  });

  await t.test('3. Local drafts cannot store a trusted release candidate', async () => {
    let calls = 0;
    const sharedService = { enabled: true, async storeReleaseCandidate() { calls += 1; return { success: true }; } };
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', enabled: true, sharedService, initialMode: AUTHOR_STORAGE_MODE.LOCAL });
    const result = await coordinator.storeReleaseCandidate({ candidateId: 'candidate-1' });
    assert.equal(result.success, false);
    assert.equal(result.disabled, true);
    assert.match(result.error, /shared draft/i);
    assert.equal(calls, 0);
  });

  await t.test('4. Shared mode delegates candidate storage to the protected service', async () => {
    const candidate = { candidateId: 'candidate-1' };
    const sharedService = { enabled: true, async storeReleaseCandidate(value) { assert.equal(value, candidate); return { success: true, candidate: value }; } };
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', enabled: true, sharedService });
    assert.equal(coordinator.selectSharedMode().success, true);
    assert.equal((await coordinator.storeReleaseCandidate(candidate)).success, true);
  });

  await t.test('5. Activation migration requires the protected function and a confirmed Approver', () => {
    const sql = readFileSync(migrationPath, 'utf8');
    assert.match(sql, /approve_follow_along_release_candidate\(text\)/);
    assert.match(sql, /email_confirmed_at IS NOT NULL/);
    assert.match(sql, /raw_app_meta_data/);
    assert.match(sql, /shared_storage_enabled = TRUE/);
    assert.match(sql, /trusted_approval_enabled = FALSE/);
    assert.match(sql, /SET trusted_approval_enabled = TRUE/);
    assert.match(sql, /updated_rows <> 1/);
    assert.doesNotMatch(sql, /hands_on_|exam_questions|exam_attempts|published/);
  });

  await t.test('6. Emergency rollback disables approval without deleting data', () => {
    const sql = readFileSync(rollbackPath, 'utf8');
    assert.match(sql, /SET trusted_approval_enabled = FALSE/);
    assert.doesNotMatch(sql, /DELETE|DROP|TRUNCATE/);
  });

  await t.test('7. UI keeps approval separate from the later protected publishing action', () => {
    const entry = readFileSync('src/features/followAlongAuthor/AuthorEntry.jsx', 'utf8');
    const queue = readFileSync('src/features/followAlongAuthor/AuthorApprovalQueue.jsx', 'utf8');
    const stage = readFileSync('src/features/followAlongAuthor/AuthorTrustedApprovalStage.jsx', 'utf8');
    assert.match(entry, /isAuthorApprovalEntryRequested/);
    assert.match(entry, /canAccessFollowAlongApprovals/);
    assert.match(queue, /approveReleaseCandidate/);
    assert.match(queue, /exact candidate ID/i);
    assert.match(queue, /This is a separate action from approval/);
    assert.match(queue, /approveReleaseCandidate/);
    assert.match(queue, /publishReleaseCandidate/);
    assert.doesNotMatch(`${entry}\n${queue}\n${stage}`, /publishDraft|registerProgramme|FOLLOW_ALONG_PROGRAMMES|HandsOn|TaskContext|generator_v2/);
  });

  await t.test('8. Author clearly labels and copies the candidate approval key', () => {
    const stage = readFileSync('src/features/followAlongAuthor/AuthorTrustedApprovalStage.jsx', 'utf8');
    assert.match(stage, /Candidate Approval Key/);
    assert.match(stage, /Copy Candidate Approval Key/);
    assert.match(stage, /navigator\?\.clipboard\?\.writeText\(candidate\.candidateId\)/);
    assert.match(stage, /http:\/\/127\.0\.0\.1:5173\/#author\/approvals/);
  });
});
