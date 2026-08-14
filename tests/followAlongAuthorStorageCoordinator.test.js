import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAuthorDraft, loadAuthorDrafts, saveAuthorDraft, storeNewAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import { AUTHOR_DRAFT_COPY_STATUS, AUTHOR_STORAGE_MODE, createAuthorStorageCoordinator } from '../src/features/followAlongAuthor/authorStorageCoordinator.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value))
  };
}

function localDraft(storage, id = 'copy', userId = 'author-1') {
  const draft = createAuthorDraft({ userId, input: { serviceName: `Amazon ${id}`, shortName: id }, idFactory: () => id });
  assert.equal(storeNewAuthorDraft({ userId, draft, storage }).success, true);
  return draft;
}

function sharedService(overrides = {}) {
  return {
    enabled: true,
    async listDrafts() { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, drafts: [] }; },
    async listReleaseCandidates() { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, candidates: [] }; },
    async listPublishedDrafts() { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, publications: [], publishedDraftIds: [] }; },
    async loadDraft() { return { success: false, notFound: true, storageMode: AUTHOR_STORAGE_MODE.SHARED }; },
    async storeNewDraft(draft) { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, draft, row: { draft_id: draft.draft.draftId } }; },
    ...overrides
  };
}

function selectedSharedCoordinator(options) {
  const coordinator = createAuthorStorageCoordinator(options);
  assert.equal(coordinator.getMode(), AUTHOR_STORAGE_MODE.LOCAL);
  assert.equal(coordinator.selectSharedMode().success, true);
  return coordinator;
}

test('Follow Along Author local-to-shared storage coordinator', async t => {
  await t.test('1. Disabled configuration stays in private browser mode', async () => {
    const storage = memoryStorage();
    localDraft(storage);
    let remoteCalls = 0;
    const remote = sharedService({ async listDrafts() { remoteCalls += 1; throw new Error('must not run'); } });
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', storage, enabled: false, sharedService: remote });
    assert.equal(coordinator.getMode(), AUTHOR_STORAGE_MODE.LOCAL);
    const listed = await coordinator.listDrafts();
    assert.equal(listed.success, true);
    assert.equal(listed.drafts.length, 1);
    assert.equal(remoteCalls, 0);
  });

  await t.test('2. Disabled preview performs no remote operation and changes no local draft', async () => {
    const storage = memoryStorage();
    const draft = localDraft(storage);
    let remoteCalls = 0;
    const remote = sharedService({ async listDrafts() { remoteCalls += 1; return { success: true, drafts: [] }; } });
    const result = await createAuthorStorageCoordinator({ userId: 'author-1', storage, enabled: false, sharedService: remote }).previewLocalDraftCopies();
    assert.equal(result.disabled, true);
    assert.equal(result.previewOnly, true);
    assert.equal(result.localPreserved, true);
    assert.equal(result.drafts[0].draftId, draft.draft.draftId);
    assert.equal(remoteCalls, 0);
    assert.equal(loadAuthorDrafts({ userId: 'author-1', storage }).drafts.length, 1);
  });

  await t.test('3. Preview clearly separates copyable drafts from existing remote IDs', async () => {
    const storage = memoryStorage();
    const ready = localDraft(storage, 'ready');
    const conflict = localDraft(storage, 'conflict');
    const remoteConflict = { ...conflict, draft: { ...conflict.draft, revision: 7 } };
    const remote = sharedService({ async listDrafts() { return { success: true, drafts: [remoteConflict] }; } });
    const result = await selectedSharedCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote }).previewLocalDraftCopies();
    assert.equal(result.success, true);
    assert.equal(result.previewOnly, true);
    assert.equal(result.readyCount, 1);
    assert.equal(result.conflictCount, 1);
    assert.equal(result.drafts.find(item => item.draftId === ready.draft.draftId).status, AUTHOR_DRAFT_COPY_STATUS.READY);
    assert.equal(result.drafts.find(item => item.draftId === conflict.draft.draftId).remoteRevision, 7);
  });

  await t.test('4. Copy requires confirmation of the exact draft ID', async () => {
    const storage = memoryStorage();
    const draft = localDraft(storage);
    let remoteCalls = 0;
    const remote = sharedService({ async loadDraft() { remoteCalls += 1; return { success: false, notFound: true }; } });
    const coordinator = selectedSharedCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote });
    const missing = await coordinator.copyLocalDraft({ draftId: draft.draft.draftId, confirmedDraftId: '' });
    const wrong = await coordinator.copyLocalDraft({ draftId: draft.draft.draftId, confirmedDraftId: 'another-draft' });
    assert.equal(missing.confirmationRequired, true);
    assert.equal(wrong.confirmationRequired, true);
    assert.equal(remoteCalls, 0);
  });

  await t.test('5. A changed local revision invalidates the earlier preview', async () => {
    const storage = memoryStorage();
    const draft = localDraft(storage);
    saveAuthorDraft({ userId: 'author-1', draft, expectedRevision: 1, storage });
    let remoteCalls = 0;
    const remote = sharedService({ async loadDraft() { remoteCalls += 1; return { success: false, notFound: true }; } });
    const result = await selectedSharedCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote }).copyLocalDraft({ draftId: draft.draft.draftId, confirmedDraftId: draft.draft.draftId, expectedLocalRevision: 1 });
    assert.equal(result.conflict, true);
    assert.match(result.error, /changed to revision 2/);
    assert.equal(remoteCalls, 0);
  });

  await t.test('6. Existing remote draft blocks copying without overwrite', async () => {
    const storage = memoryStorage();
    const draft = localDraft(storage);
    let stores = 0;
    const remote = sharedService({ async loadDraft() { return { success: true, draft: { ...draft, draft: { ...draft.draft, revision: 4 } } }; }, async storeNewDraft() { stores += 1; throw new Error('must not run'); } });
    const result = await selectedSharedCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote }).copyLocalDraft({ draftId: draft.draft.draftId, confirmedDraftId: draft.draft.draftId, expectedLocalRevision: 1 });
    assert.equal(result.conflict, true);
    assert.equal(result.remoteRevision, 4);
    assert.equal(stores, 0);
    assert.equal(result.localPreserved, true);
  });

  await t.test('7. Confirmed copy creates a new remote draft and preserves the local source', async () => {
    const storage = memoryStorage();
    const draft = localDraft(storage);
    let copied;
    const remote = sharedService({ async storeNewDraft(value) { copied = value; return { success: true, draft: value, row: { draft_id: value.draft.draftId } }; } });
    const result = await selectedSharedCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote }).copyLocalDraft({ draftId: draft.draft.draftId, confirmedDraftId: draft.draft.draftId, expectedLocalRevision: 1 });
    assert.equal(result.success, true);
    assert.equal(copied.draft.draftId, draft.draft.draftId);
    assert.equal(result.localPreserved, true);
    assert.equal(result.localVerified, true);
    assert.equal(loadAuthorDrafts({ userId: 'author-1', storage }).drafts.length, 1);
  });

  await t.test('8. A last-moment unique-ID collision is reported as a conflict', async () => {
    const storage = memoryStorage();
    const draft = localDraft(storage);
    const remote = sharedService({ async storeNewDraft() { return { success: false, errorCode: '23505', error: 'duplicate key' }; } });
    const result = await selectedSharedCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote }).copyLocalDraft({ draftId: draft.draft.draftId, confirmedDraftId: draft.draft.draftId, expectedLocalRevision: 1 });
    assert.equal(result.conflict, true);
    assert.match(result.error, /created before this copy finished/);
    assert.equal(result.localPreserved, true);
  });

  await t.test('9. Return to local mode immediately stops further remote operations', async () => {
    const storage = memoryStorage();
    localDraft(storage);
    let remoteCalls = 0;
    const remote = sharedService({ async listDrafts() { remoteCalls += 1; return { success: true, drafts: [] }; } });
    const coordinator = selectedSharedCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote });
    assert.equal(coordinator.getMode(), AUTHOR_STORAGE_MODE.SHARED);
    const returned = coordinator.returnToLocalMode();
    assert.equal(returned.storageMode, AUTHOR_STORAGE_MODE.LOCAL);
    const listed = await coordinator.listDrafts();
    assert.equal(listed.drafts.length, 1);
    assert.equal(remoteCalls, 0);
  });

  await t.test('10. Migration panel follows the Home coordinator and contains no duplicate mode, move or delete action', () => {
    const panel = readFileSync('src/features/followAlongAuthor/AuthorStorageMigrationPanel.jsx', 'utf8');
    const home = readFileSync('src/features/followAlongAuthor/AuthorHome.jsx', 'utf8');
    assert.match(panel, /if \(!featureEnabled\) return null/);
    assert.match(panel, /copy this exact .*draft/);
    assert.match(panel, /storageMode === AUTHOR_STORAGE_MODE\.SHARED/);
    assert.match(panel, /Select Shared Drafts above/);
    assert.doesNotMatch(panel, /createAuthorStorageCoordinator|selectSharedMode|returnToLocalMode|Enter Shared Preparation|Return to Local Mode/);
    assert.match(home, /coordinator=\{coordinator\}/);
    assert.match(home, /storageMode=\{storageMode\}/);
    assert.doesNotMatch(panel, /removeItem|deleteAuthorDraft|moveLocalDraft/);
  });

  await t.test('11. Coordinator and panel remain independent of Generator, Hands On, approval and publishing', () => {
    const source = ['src/features/followAlongAuthor/authorStorageCoordinator.js', 'src/features/followAlongAuthor/AuthorStorageMigrationPanel.jsx'].map(file => readFileSync(file, 'utf8')).join('\n');
    assert.doesNotMatch(source, /scripts\/generator|generator_v2|HandsOn|TaskContext|tasksData|approveFollowAlong|publishDraft|registerProgramme/);
  });
});
