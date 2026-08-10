import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createAuthorDraft, deleteAuthorDraft, loadAuthorDrafts, storeNewAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import { createAuthorSharedStorageService, publishedDraftIdFromCandidateId } from '../src/features/followAlongAuthor/authorSharedStorageService.js';

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
}

test('Step 162 safe unwanted-draft deletion and live protection', async t => {
  await t.test('1. local deletion requires exact identity and current revision', () => {
    const storage = memoryStorage();
    const draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'Test' }, idFactory: () => 'delete-test' });
    storeNewAuthorDraft({ userId: 'author-1', draft, storage });
    assert.equal(deleteAuthorDraft({ userId: 'author-1', draftId: draft.draft.draftId, expectedRevision: 1, confirmation: '', storage }).success, false);
    assert.equal(deleteAuthorDraft({ userId: 'author-1', draftId: draft.draft.draftId, expectedRevision: 2, confirmation: `DELETE ${draft.draft.draftId}`, storage }).conflict, true);
    assert.equal(deleteAuthorDraft({ userId: 'author-1', draftId: draft.draft.draftId, expectedRevision: 1, confirmation: `DELETE ${draft.draft.draftId}`, storage }).success, true);
    assert.equal(loadAuthorDrafts({ userId: 'author-1', storage }).drafts.length, 0);
  });

  await t.test('2. live status is tied to the exact candidate draft ID', () => {
    assert.equal(publishedDraftIdFromCandidateId('release-author-draft-original-r87-abcdef123456'), 'author-draft-original');
    assert.equal(publishedDraftIdFromCandidateId('not-a-candidate'), '');
  });

  await t.test('3. shared deletion calls only the protected RPC with exact confirmation', async () => {
    const calls = [];
    const client = { async rpc(name, args) { calls.push([name, args]); return { data: { deletedDraftId: args.p_draft_id }, error: null }; } };
    const service = createAuthorSharedStorageService(client, { enabled: true });
    const result = await service.deleteDraft({ draftId: 'draft-1', expectedRevision: 4, confirmation: 'DELETE draft-1' });
    assert.equal(result.success, true);
    assert.deepEqual(calls, [['delete_unpublished_follow_along_author_draft', { p_draft_id: 'draft-1', p_expected_revision: 4, p_confirmation: 'DELETE draft-1' }]]);
  });

  await t.test('4. migration protects ownership, candidates and live publications', async () => {
    const sql = await readFile(new URL('../supabase/migrations/20260825_safe_author_draft_deletion_and_lambda_duplicate_cleanup.sql', import.meta.url), 'utf8');
    assert.match(sql, /target\.owner_id IS DISTINCT FROM auth\.uid\(\)/);
    assert.match(sql, /follow_along_release_candidates WHERE draft_id = target\.draft_id/);
    assert.match(sql, /A live production Shared Draft cannot be deleted/);
    assert.match(sql, /p_confirmation IS DISTINCT FROM 'DELETE ' \|\| p_draft_id/);
    assert.match(sql, /author-draft-import-0d8165e5eee4eb9b108f34b46bef58346da44792d495b635e241896f3c9fdb28/);
    assert.match(sql, /original\.revision < 87/);
    assert.doesNotMatch(sql, /GRANT\s+DELETE\s+ON/i);
  });

  await t.test('5. Author list marks live drafts and disables their deletion', async () => {
    const home = await readFile(new URL('../src/features/followAlongAuthor/AuthorHome.jsx', import.meta.url), 'utf8');
    assert.match(home, />Live</);
    assert.match(home, /Deletion disabled/);
    assert.match(home, /Live status unavailable · deletion disabled/);
    assert.match(home, /published\.success === true/);
    assert.match(home, /Confirm Delete Draft/);
    assert.match(home, /publishedDraftIds\.has\(draft\.draft\.draftId\)/);
  });
});
