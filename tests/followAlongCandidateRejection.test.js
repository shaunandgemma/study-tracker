import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migrationPath = 'supabase/migrations/20260817_follow_along_release_candidate_rejection.sql';
const queuePath = 'src/features/followAlongAuthor/AuthorApprovalQueue.jsx';
const servicePath = 'src/features/followAlongAuthor/authorSharedStorageService.js';

test('Follow Along release-candidate rejection preserves immutable audit history', async t => {
  const sql = readFileSync(migrationPath, 'utf8');
  const executable = sql.replace(/--.*$/gm, '');

  await t.test('1. Migration is transactional and adds rejection audit fields', () => {
    assert.equal((sql.match(/^BEGIN;/gm) || []).length, 1);
    assert.equal((sql.match(/^COMMIT;/gm) || []).length, 1);
    assert.match(sql, /ADD COLUMN IF NOT EXISTS rejected_by/);
    assert.match(sql, /ADD COLUMN IF NOT EXISTS rejected_at/);
    assert.match(sql, /ADD COLUMN IF NOT EXISTS rejection_reason/);
  });

  await t.test('2. Protected rejection requires Approver role, separation and a reason', () => {
    assert.match(sql, /reject_follow_along_release_candidate/);
    assert.match(sql, /trusted_approval_enabled/);
    assert.match(sql, /follow_along_is_approver\(\)/);
    assert.match(sql, /candidate\.created_by = auth\.uid\(\)/);
    assert.match(sql, /between 5 and 500 characters/i);
  });

  await t.test('3. Rejection moves a pending request to superseded and records the audit', () => {
    assert.match(sql, /SET status = 'superseded'/);
    assert.match(sql, /rejected_by = auth\.uid\(\)/);
    assert.match(sql, /rejected_at = NOW\(\)/);
    assert.match(sql, /rejection_reason = clean_reason/);
  });

  await t.test('4. Candidate content remains immutable and no record is deleted', () => {
    assert.match(sql, /NEW\.snapshot = OLD\.snapshot/);
    assert.match(sql, /NEW\.content_hash = OLD\.content_hash/);
    assert.match(sql, /NEW\.draft_content_hash = OLD\.draft_content_hash/);
    assert.doesNotMatch(executable, /^\s*(DELETE|TRUNCATE)\b/im);
    assert.doesNotMatch(executable, /DROP TABLE/);
  });

  await t.test('5. Browser receives execute permission but no direct mutation policy', () => {
    assert.match(sql, /GRANT EXECUTE ON FUNCTION public\.reject_follow_along_release_candidate\(TEXT, TEXT\) TO authenticated/);
    assert.doesNotMatch(executable, /CREATE POLICY[\s\S]*FOR (UPDATE|DELETE)/i);
  });

  await t.test('6. Approvals UI and browser service expose controlled rejection and a separate Rejects tab', () => {
    const queue = readFileSync(queuePath, 'utf8');
    const service = readFileSync(servicePath, 'utf8');
    assert.match(service, /rejectReleaseCandidate\(candidateId, reason\)/);
    assert.match(service, /reject_follow_along_release_candidate/);
    assert.match(queue, /Reject request/);
    assert.match(queue, /Reason for rejection/);
    assert.match(queue, /queueView === "rejects"/);
    assert.match(queue, /Rejected: \{candidate\.rejection_reason/);
    assert.match(queue, /\{approved && \(\s*<ControlledPublishingPanel/);
  });
});
