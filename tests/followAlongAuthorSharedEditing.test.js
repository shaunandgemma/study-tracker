import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAuthorDraft, loadAuthorDrafts } from '../src/features/followAlongAuthor/authorDraftService.js';
import { AUTHOR_STORAGE_MODE, createAuthorStorageCoordinator } from '../src/features/followAlongAuthor/authorStorageCoordinator.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value))
  };
}

function draft(id = 'shared-edit') {
  return createAuthorDraft({ userId: 'author-1', input: { serviceName: 'Amazon VPC', shortName: 'VPC' }, idFactory: () => id });
}

function remoteService(overrides = {}) {
  return {
    enabled: true,
    async listDrafts() { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, drafts: [] }; },
    async listReleaseCandidates() { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, candidates: [] }; },
    async loadDraft() { return { success: false, notFound: true, storageMode: AUTHOR_STORAGE_MODE.SHARED }; },
    async storeNewDraft(value) { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, draft: value }; },
    async saveDraft({ draft: value, expectedRevision }) { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, draft: { ...value, draft: { ...value.draft, revision: expectedRevision + 1 } } }; },
    ...overrides
  };
}

test('Follow Along Author explicit shared-draft editing route', async t => {
  await t.test('1. Local mode is the starting mode even when shared storage is configured', () => {
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', enabled: true, sharedService: remoteService() });
    assert.equal(coordinator.isSharedConfigured, true);
    assert.equal(coordinator.getMode(), AUTHOR_STORAGE_MODE.LOCAL);
  });

  await t.test('2. Shared mode cannot be selected while the application flag is disabled', () => {
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', enabled: false, sharedService: remoteService() });
    const result = coordinator.selectSharedMode();
    assert.equal(result.success, false);
    assert.equal(result.disabled, true);
    assert.equal(coordinator.getMode(), AUTHOR_STORAGE_MODE.LOCAL);
  });

  await t.test('3. Local create, list, open and save remain entirely in browser storage', async () => {
    const storage = memoryStorage();
    let remoteCalls = 0;
    const remote = remoteService({
      async listDrafts() { remoteCalls += 1; throw new Error('must not run'); },
      async loadDraft() { remoteCalls += 1; throw new Error('must not run'); },
      async storeNewDraft() { remoteCalls += 1; throw new Error('must not run'); },
      async saveDraft() { remoteCalls += 1; throw new Error('must not run'); }
    });
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote });
    const source = draft('local-route');
    assert.equal((await coordinator.storeNewDraft(source)).success, true);
    assert.equal((await coordinator.listDrafts()).drafts.length, 1);
    assert.equal((await coordinator.loadDraft(source.draft.draftId)).success, true);
    const saved = await coordinator.saveDraft({ draft: source, expectedRevision: 1 });
    assert.equal(saved.success, true);
    assert.equal(saved.draft.draft.revision, 2);
    assert.equal(loadAuthorDrafts({ userId: 'author-1', storage }).drafts[0].draft.revision, 2);
    assert.equal(remoteCalls, 0);
  });

  await t.test('4. Explicit Shared Drafts selection routes listing and opening only to the remote service', async () => {
    const localStorage = memoryStorage();
    const local = draft('local-hidden');
    const shared = { ...draft('remote-visible'), draft: { ...draft('remote-visible').draft, revision: 4 } };
    let listCalls = 0;
    let loadedId = '';
    const remote = remoteService({
      async listDrafts() { listCalls += 1; return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, drafts: [shared] }; },
      async loadDraft(id) { loadedId = id; return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, draft: shared }; }
    });
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', storage: localStorage, enabled: true, sharedService: remote });
    await coordinator.storeNewDraft(local);
    assert.equal(coordinator.selectSharedMode().success, true);
    const listed = await coordinator.listDrafts();
    assert.deepEqual(listed.drafts.map(item => item.draft.draftId), [shared.draft.draftId]);
    const opened = await coordinator.loadDraft(shared.draft.draftId);
    assert.equal(opened.draft.draft.revision, 4);
    assert.equal(loadedId, shared.draft.draftId);
    assert.equal(listCalls, 1);
  });

  await t.test('5. New shared draft creation runs only after explicit Shared Drafts selection', async () => {
    const source = draft('remote-create');
    let stored;
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', enabled: true, sharedService: remoteService({ async storeNewDraft(value) { stored = value; return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, draft: value }; } }) });
    coordinator.selectSharedMode();
    const result = await coordinator.storeNewDraft(source);
    assert.equal(result.success, true);
    assert.equal(stored.draft.draftId, source.draft.draftId);
    assert.equal(stored.programme.publicationVisibility, 'unpublished');
    assert.equal(stored.publication.publishStatus, 'not_published');
  });

  await t.test('6. Shared save forwards the exact expected revision and accepts the server revision', async () => {
    const source = draft('remote-save');
    let received;
    const remote = remoteService({ async saveDraft(values) { received = values; return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, draft: { ...values.draft, draft: { ...values.draft.draft, revision: 6 } } }; } });
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', enabled: true, sharedService: remote });
    coordinator.selectSharedMode();
    const result = await coordinator.saveDraft({ draft: source, expectedRevision: 5 });
    assert.equal(received.expectedRevision, 5);
    assert.equal(result.draft.draft.revision, 6);
  });

  await t.test('7. Shared revision conflict is returned without a fallback local overwrite', async () => {
    const storage = memoryStorage();
    const source = draft('remote-conflict');
    let sharedSaves = 0;
    const remote = remoteService({ async saveDraft() { sharedSaves += 1; return { success: false, conflict: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, error: 'The shared draft has a newer revision.' }; } });
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote });
    coordinator.selectSharedMode();
    const result = await coordinator.saveDraft({ draft: source, expectedRevision: 2 });
    assert.equal(result.success, false);
    assert.equal(result.conflict, true);
    assert.equal(sharedSaves, 1);
    assert.equal(loadAuthorDrafts({ userId: 'author-1', storage }).drafts.length, 0);
  });

  await t.test('8. Returning to Local Drafts restores local routing immediately', async () => {
    const storage = memoryStorage();
    const source = draft('return-local');
    let remoteLists = 0;
    const remote = remoteService({ async listDrafts() { remoteLists += 1; return { success: true, drafts: [] }; } });
    const coordinator = createAuthorStorageCoordinator({ userId: 'author-1', storage, enabled: true, sharedService: remote });
    coordinator.selectSharedMode();
    await coordinator.listDrafts();
    coordinator.returnToLocalMode();
    await coordinator.storeNewDraft(source);
    const listed = await coordinator.listDrafts();
    assert.equal(listed.drafts.length, 1);
    assert.equal(remoteLists, 1);
  });

  await t.test('9. Author Home exposes an explicit flag-guarded Local Drafts or Shared Drafts choice', () => {
    const home = readFileSync('src/features/followAlongAuthor/AuthorHome.jsx', 'utf8');
    assert.match(home, /sharedFeatureEnabled &&/);
    assert.match(home, /Local Drafts is always the starting mode/);
    assert.match(home, /chooseMode\(AUTHOR_STORAGE_MODE\.SHARED\)/);
    assert.match(home, /coordinator\.loadDraft/);
    assert.match(home, /coordinator\.storeNewDraft/);
    assert.match(home, /coordinator\.saveDraft/);
    assert.match(home, /<AuthorStorageMigrationPanel[\s\S]*coordinator=\{coordinator\}[\s\S]*storageMode=\{storageMode\}/);
  });

  await t.test('10. Editor awaits the selected storage save and retains answers after a failed save', () => {
    const editor = readFileSync('src/features/followAlongAuthor/AuthorDraftEditor.jsx', 'utf8');
    assert.match(editor, /await onSaveDraft\(\{ draft: prepared, expectedRevision: savedRevision \}\)/);
    assert.match(editor, /const result = await save\(\)/);
    assert.match(editor, /Your answers remain on this screen/);
    assert.match(editor, /Shared draft/);
  });

  await t.test('11. Shared editing route has no Generator, Hands On, approval or publishing operation', () => {
    const source = ['src/features/followAlongAuthor/authorStorageCoordinator.js', 'src/features/followAlongAuthor/AuthorHome.jsx', 'src/features/followAlongAuthor/AuthorDraftEditor.jsx'].map(file => readFileSync(file, 'utf8')).join('\n');
    assert.doesNotMatch(source, /scripts\/generator|generator_v2|HandsOn|TaskContext|tasksData|approveFollowAlong|publishDraft|registerProgramme/);
  });
});
