import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import { buildAuthorReleaseSnapshot } from '../src/features/followAlongAuthor/authorApproval.js';
import {
  AUTHOR_SHARED_STORAGE_FLAG,
  AUTHOR_SHARED_STORAGE_TABLES,
  createAuthorSharedStorageService,
  getAuthorStorageMode,
  isAuthorSharedStorageEnabled
} from '../src/features/followAlongAuthor/authorSharedStorageService.js';

const migrationPath = 'supabase/migrations/20260809_follow_along_author_shared_storage.sql';

function privateDraft() {
  return createAuthorDraft({ userId: '00000000-0000-4000-8000-000000000001', input: { serviceName: 'Amazon VPC', shortName: 'VPC' }, idFactory: () => 'shared' });
}

function builder(result, calls = []) {
  const query = {
    insert(value) { calls.push(['insert', value]); return this; },
    update(value) { calls.push(['update', value]); return this; },
    select(value) { calls.push(['select', value]); return this; },
    eq(field, value) { calls.push(['eq', field, value]); return this; },
    order(field, options) { calls.push(['order', field, options]); return this; },
    single() { calls.push(['single']); return Promise.resolve(typeof result === 'function' ? result(calls) : result); },
    maybeSingle() { calls.push(['maybeSingle']); return Promise.resolve(typeof result === 'function' ? result(calls) : result); },
    then(resolve, reject) { return Promise.resolve(typeof result === 'function' ? result(calls) : result).then(resolve, reject); }
  };
  return query;
}

test('Follow Along Author disabled shared-storage foundation', async t => {
  const sql = readFileSync(migrationPath, 'utf8');

  await t.test('1. Migration defines isolated draft, revision, candidate and configuration tables', () => {
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.follow_along_author_drafts/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.follow_along_author_revisions/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.follow_along_release_candidates/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.follow_along_author_configuration/);
    assert.doesNotMatch(sql, /ALTER TABLE public\.hands_on_tasks/);
    assert.doesNotMatch(sql, /ALTER TABLE public\.user_learning_path_progress/);
  });

  await t.test('2. Database roles use app_metadata and never user_metadata', () => {
    const executableSql = sql.replace(/--.*$/gm, '');
    assert.match(sql, /auth\.jwt\(\) -> 'app_metadata' ->> 'role'/);
    assert.match(sql, /auth\.jwt\(\) -> 'app_metadata' -> 'roles'/);
    assert.doesNotMatch(executableSql, /user_metadata/);
    assert.match(sql, /ARRAY\['author', 'admin'\]/);
    assert.match(sql, /ARRAY\['approver', 'admin'\]/);
  });

  await t.test('3. Row Level Security is enabled and every client policy uses the server kill switch', () => {
    for (const table of ['follow_along_author_drafts', 'follow_along_author_revisions', 'follow_along_release_candidates', 'follow_along_author_configuration']) {
      assert.match(sql, new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`));
    }
    assert.ok((sql.match(/public\.follow_along_shared_storage_enabled\(\)/g) || []).length >= 10);
  });

  await t.test('4. Revision history is append-only and candidates have no client update or delete policy', () => {
    assert.match(sql, /No client INSERT, UPDATE or DELETE policies on revision history/);
    assert.match(sql, /No client UPDATE or DELETE policies on release candidates/);
    assert.doesNotMatch(sql, /CREATE POLICY[^;]+follow_along_author_revisions FOR (INSERT|UPDATE|DELETE)/s);
    assert.doesNotMatch(sql, /CREATE POLICY[^;]+follow_along_release_candidates FOR (UPDATE|DELETE)/s);
  });

  await t.test('5. Draft trigger enforces ownership, one-step revisions and unpublished content', () => {
    assert.match(sql, /NEW\.owner_id IS DISTINCT FROM auth\.uid\(\)/);
    assert.match(sql, /NEW\.revision <> OLD\.revision \+ 1/);
    assert.match(sql, /publicationVisibility.*unpublished/s);
    assert.match(sql, /publishStatus.*not_published/s);
    assert.match(sql, /archive_follow_along_author_revision/);
  });

  await t.test('6. Both database feature switches are inserted as false', () => {
    assert.match(sql, /shared_storage_enabled BOOLEAN NOT NULL DEFAULT FALSE/);
    assert.match(sql, /trusted_approval_enabled BOOLEAN NOT NULL DEFAULT FALSE/);
    assert.match(sql, /GRANT SELECT, INSERT, UPDATE ON TABLE public\.follow_along_author_drafts TO authenticated/);
    assert.match(sql, /GRANT SELECT ON TABLE public\.follow_along_author_revisions TO authenticated/);
    assert.match(sql, /GRANT SELECT, INSERT ON TABLE public\.follow_along_release_candidates TO authenticated/);
    assert.match(sql, /REVOKE ALL ON TABLE public\.follow_along_author_configuration FROM anon, authenticated/);
    assert.doesNotMatch(sql, /GRANT (?:ALL|DELETE)[^;]*follow_along_author_/);
    assert.match(sql, /VALUES \(TRUE, FALSE, FALSE\)/);
  });

  await t.test('7. Trusted approval remains server-disabled and checks role, separation, fingerprint and revision', () => {
    assert.match(sql, /Trusted approval is disabled until server validation is deployed/);
    assert.match(sql, /NOT public\.follow_along_is_approver\(\)/);
    assert.match(sql, /candidate\.created_by = auth\.uid\(\)/);
    assert.match(sql, /follow_along_jsonb_sha256\(candidate\.snapshot\) <> candidate\.content_hash/);
    assert.match(sql, /current_draft\.revision <> candidate\.source_revision/);
    assert.doesNotMatch(sql, /status\s*=\s*'published'/);
  });

  await t.test('8. Application feature switch is strict and defaults to local browser mode', () => {
    assert.equal(AUTHOR_SHARED_STORAGE_FLAG, 'VITE_FOLLOW_ALONG_AUTHOR_SHARED_STORAGE');
    assert.equal(isAuthorSharedStorageEnabled({}), false);
    assert.equal(isAuthorSharedStorageEnabled({ [AUTHOR_SHARED_STORAGE_FLAG]: 'true' }), true);
    assert.equal(isAuthorSharedStorageEnabled({ [AUTHOR_SHARED_STORAGE_FLAG]: 'TRUE' }), true);
    assert.equal(isAuthorSharedStorageEnabled({ [AUTHOR_SHARED_STORAGE_FLAG]: '1' }), false);
    assert.equal(getAuthorStorageMode({ enabled: false }), 'private_local_browser');
    assert.equal(getAuthorStorageMode({ enabled: true, remoteAvailable: true }), 'shared_supabase');
  });

  await t.test('9. Disabled service performs no Supabase operation and preserves local fallback', async () => {
    let calls = 0;
    const client = { from() { calls += 1; throw new Error('must not run'); }, rpc() { calls += 1; throw new Error('must not run'); } };
    const service = createAuthorSharedStorageService(client, { enabled: false });
    const results = await Promise.all([service.listDrafts(), service.loadDraft('draft'), service.storeNewDraft(privateDraft()), service.saveDraft({ draft: privateDraft(), expectedRevision: 1 }), service.listRevisions('draft'), service.listReleaseCandidates(), service.approveReleaseCandidate('candidate')]);
    assert.equal(calls, 0);
    assert.ok(results.every(result => result.disabled && result.storageMode === 'private_local_browser'));
  });

  await t.test('10. New shared draft writes are forced private and unpublished', async () => {
    const calls = [];
    let inserted;
    const client = { from(name) { assert.equal(name, AUTHOR_SHARED_STORAGE_TABLES.drafts); const q = builder(() => ({ data: { ...inserted, content_hash: 'hash' }, error: null }), calls); const original = q.insert; q.insert = function (value) { inserted = value; return original.call(this, value); }; return q; } };
    const draft = privateDraft();
    draft.programme.publicationVisibility = 'published';
    draft.publication.publishStatus = 'published';
    const result = await createAuthorSharedStorageService(client, { enabled: true }).storeNewDraft(draft);
    assert.equal(result.success, true);
    assert.equal(inserted.content.programme.publicationVisibility, 'unpublished');
    assert.equal(inserted.content.publication.publishStatus, 'not_published');
    assert.equal(inserted.revision, 1);
  });

  await t.test('11. Shared save uses optimistic revision matching and reports conflicts', async () => {
    const calls = [];
    const client = { from() { return builder({ data: null, error: null }, calls); } };
    const result = await createAuthorSharedStorageService(client, { enabled: true }).saveDraft({ draft: privateDraft(), expectedRevision: 4 });
    assert.equal(result.success, false);
    assert.equal(result.conflict, true);
    assert.ok(calls.some(call => call[0] === 'update' && call[1].revision === 5));
    assert.ok(calls.some(call => call[0] === 'eq' && call[1] === 'revision' && call[2] === 4));
  });

  await t.test('12. Candidate storage binds the package to the server draft hash and revision', async () => {
    const calls = [];
    let inserted;
    const draft = privateDraft();
    draft.draft.revision = 3;
    draft.review.reviewStatus = 'ready_for_approval';
    const snapshot = buildAuthorReleaseSnapshot(draft);
    const client = { from(name) {
      if (name === AUTHOR_SHARED_STORAGE_TABLES.drafts) return builder({ data: { content_hash: 'server-draft-hash', revision: 3, status: 'ready_for_approval', owner_id: 'author', content: draft }, error: null }, calls);
      assert.equal(name, AUTHOR_SHARED_STORAGE_TABLES.candidates);
      const q = builder(() => ({ data: inserted, error: null }), calls);
      const original = q.insert;
      q.insert = function (value) { inserted = value; return original.call(this, value); };
      return q;
    } };
    const candidate = { candidateId: 'candidate-1', sourceDraftId: draft.draft.draftId, sourceRevision: 3, createdBy: draft.draft.createdBy, snapshot };
    const result = await createAuthorSharedStorageService(client, { enabled: true }).storeReleaseCandidate(candidate);
    assert.equal(result.success, true);
    assert.equal(inserted.draft_content_hash, 'server-draft-hash');
    assert.equal(inserted.source_revision, 3);
    assert.equal(inserted.snapshot.publication.publishStatus, 'not_published');
  });

  await t.test('12A. Exact duplicate candidate preparation reuses the immutable server row', async () => {
    const draft = privateDraft();
    draft.draft.revision = 3;
    draft.review.reviewStatus = 'ready_for_approval';
    const snapshot = buildAuthorReleaseSnapshot(draft);
    const candidate = { candidateId: 'candidate-1', sourceDraftId: draft.draft.draftId, sourceRevision: 3, createdBy: draft.draft.createdBy, snapshot };
    const existing = { candidate_id: 'candidate-1', draft_id: draft.draft.draftId, source_revision: 3, created_by: draft.draft.createdBy, snapshot, draft_content_hash: 'server-draft-hash' };
    let candidateCalls = 0;
    const client = { from(name) {
      if (name === AUTHOR_SHARED_STORAGE_TABLES.drafts) return builder({ data: { content_hash: 'server-draft-hash', revision: 3, status: 'ready_for_approval', owner_id: draft.draft.createdBy, content: draft }, error: null });
      candidateCalls += 1;
      return candidateCalls === 1
        ? builder({ data: null, error: { code: '23505', message: 'duplicate' } })
        : builder({ data: existing, error: null });
    } };
    const result = await createAuthorSharedStorageService(client, { enabled: true }).storeReleaseCandidate(candidate);
    assert.equal(result.success, true);
    assert.equal(result.reused, true);
    assert.equal(result.candidate, existing);
  });

  await t.test('12B. A duplicate ID with different immutable content remains blocked', async () => {
    const draft = privateDraft();
    draft.draft.revision = 3;
    draft.review.reviewStatus = 'ready_for_approval';
    const snapshot = buildAuthorReleaseSnapshot(draft);
    const candidate = { candidateId: 'candidate-1', sourceDraftId: draft.draft.draftId, sourceRevision: 3, createdBy: draft.draft.createdBy, snapshot };
    const existing = { candidate_id: 'candidate-1', draft_id: draft.draft.draftId, source_revision: 3, created_by: draft.draft.createdBy, snapshot: { ...snapshot, programme: { ...snapshot.programme, displayName: 'Different' } }, draft_content_hash: 'server-draft-hash' };
    let candidateCalls = 0;
    const client = { from(name) {
      if (name === AUTHOR_SHARED_STORAGE_TABLES.drafts) return builder({ data: { content_hash: 'server-draft-hash', revision: 3, status: 'ready_for_approval', owner_id: draft.draft.createdBy, content: draft }, error: null });
      candidateCalls += 1;
      return candidateCalls === 1
        ? builder({ data: null, error: { code: '23505', message: 'duplicate' } })
        : builder({ data: existing, error: null });
    } };
    const result = await createAuthorSharedStorageService(client, { enabled: true }).storeReleaseCandidate(candidate);
    assert.equal(result.success, false);
    assert.equal(result.conflict, true);
    assert.match(result.error, /different immutable release candidate/i);
  });

  await t.test('13. Trusted approval service calls only the protected database function', async () => {
    const calls = [];
    const client = { from() { throw new Error('approval must not write tables directly'); }, async rpc(name, args) { calls.push([name, args]); return { data: { candidate_id: args.p_candidate_id, approval_decision: 'approved', status: 'approved_release_candidate' }, error: null }; } };
    const result = await createAuthorSharedStorageService(client, { enabled: true }).approveReleaseCandidate('candidate-9');
    assert.equal(result.success, true);
    assert.deepEqual(calls, [['approve_follow_along_release_candidate', { p_candidate_id: 'candidate-9' }]]);
  });

  await t.test('14. Shared editing remains behind the guarded Home choice and has no direct table access', () => {
    const editor = readFileSync('src/features/followAlongAuthor/AuthorDraftEditor.jsx', 'utf8');
    const home = readFileSync('src/features/followAlongAuthor/AuthorHome.jsx', 'utf8');
    const panel = readFileSync('src/features/followAlongAuthor/AuthorStorageMigrationPanel.jsx', 'utf8');
    assert.match(editor, /onSaveDraft/);
    assert.doesNotMatch(editor, /authorSharedStorageService|authorStorageCoordinator|follow_along_author_drafts/);
    assert.match(home, /AuthorStorageMigrationPanel/);
    assert.match(home, /sharedFeatureEnabled &&/);
    assert.match(home, /chooseMode\(AUTHOR_STORAGE_MODE\.SHARED\)/);
    assert.match(panel, /if \(!featureEnabled\) return null/);
    assert.doesNotMatch(`${editor}\n${home}\n${panel}`, /follow_along_author_drafts/);
    const packageJson = readFileSync('package.json', 'utf8');
    assert.doesNotMatch(packageJson, /supabase db push|migration up/);
  });
});
