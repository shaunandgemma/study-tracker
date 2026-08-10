import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createAuthorDraft, loadAuthorDrafts, storeNewAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import { AUTHOR_DRAFT_COPY_STATUS, AUTHOR_STORAGE_MODE, createAuthorStorageCoordinator } from '../src/features/followAlongAuthor/authorStorageCoordinator.js';

const userId = '00000000-0000-4000-8000-000000000093';
const handoffFingerprint = 'a'.repeat(64);
const draftId = `author-draft-import-${handoffFingerprint}`;

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value))
  };
}

function verifiedLocalDraft(storage) {
  const created = createAuthorDraft({
    userId,
    input: { serviceName: 'Amazon Synthetic Queue Service', shortName: 'SYNQ', displayName: 'Synthetic Queue Follow Along' },
    idFactory: () => 'unused'
  });
  const taskId = 'task-synq-001';
  const draft = {
    ...created,
    draft: {
      ...created.draft,
      draftId,
      importedFrom: {
        type: 'author_assistant_handoff',
        importStep: '92',
        sessionId: 'author-assistant-synq-session',
        handoffFingerprint,
        acceptanceAuditFingerprint: 'c'.repeat(64),
        authorDraftContentFingerprint: 'b'.repeat(64),
        importedAt: '2026-08-10T16:00:00.000Z',
        importedBy: userId,
        acceptedStages: '1-11'
      }
    },
    programme: { ...created.programme, serviceSlug: 'synq', programmeId: 'synq-learning-path', pathId: 'synq-learning-path' },
    phases: [{ id: 'phase-1', phaseNumber: 1, title: 'Test', description: 'Test safely.', taskIds: [taskId], isOptional: false }],
    tasks: [{
      id: taskId,
      title: 'Create test queue',
      phaseId: 'phase-1',
      consoleSteps: [{ id: 'step-1', stepNumber: 1, number: 1, instruction: 'Open the Console.', instructions: [{ id: 'check-1', text: 'Open the Console.', detail: '' }], commands: [] }],
      cliSteps: [],
      verification: [{ id: 'verify-1' }],
      cleanup: [{ id: 'cleanup-1', stepNumber: 1, instruction: 'Delete the test queue.', description: 'Delete the test queue.' }]
    }],
    sources: [{ id: 'source-1' }],
    cleanup: { ...created.cleanup, steps: [{ id: 'cleanup-final', stepNumber: 1, instruction: 'Confirm cleanup.', description: 'Confirm cleanup.' }] }
  };
  assert.equal(storeNewAuthorDraft({ userId, draft, storage }).success, true);
  return loadAuthorDrafts({ userId, storage }).drafts[0];
}

function sharedService(overrides = {}) {
  return {
    enabled: true,
    async listDrafts() { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, drafts: [] }; },
    async loadDraft() { return { success: false, notFound: true, storageMode: AUTHOR_STORAGE_MODE.SHARED }; },
    async storeNewDraft(draft) { return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, draft, row: { draft_id: draft.draft.draftId, revision: 1 } }; },
    ...overrides
  };
}

function sharedCoordinator(storage, remote = sharedService()) {
  const coordinator = createAuthorStorageCoordinator({ userId, storage, enabled: true, sharedService: remote });
  assert.equal(coordinator.selectSharedMode().success, true);
  return coordinator;
}

test('Step 93 verified Author Assistant Local-to-Shared copy', async t => {
  await t.test('1. preview displays the verified handoff, exact local fingerprint and content counts', async () => {
    const storage = memoryStorage();
    verifiedLocalDraft(storage);
    const preview = await sharedCoordinator(storage).previewLocalDraftCopies();
    assert.equal(preview.success, true);
    assert.equal(preview.readyCount, 1);
    assert.equal(preview.conflictCount, 0);
    assert.equal(preview.drafts.length, 1);
    const item = preview.drafts[0];
    assert.equal(item.draftId, draftId);
    assert.equal(item.isVerifiedHandoff, true);
    assert.equal(item.handoffFingerprint, handoffFingerprint);
    assert.match(item.localContentFingerprint, /^[a-f0-9]{64}$/);
    assert.deepEqual(item.counts, { phaseCount: 1, taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 2, officialAwsSourceCount: 1 });
    assert.equal(item.canCopy, true);
  });

  await t.test('2. one confirmed copy preserves Local Draft and verifies the exact shared content at revision 1', async () => {
    const storage = memoryStorage();
    const local = verifiedLocalDraft(storage);
    let stores = 0;
    let storedDraft;
    const remote = sharedService({ async storeNewDraft(draft) { stores += 1; storedDraft = structuredClone(draft); return { success: true, storageMode: AUTHOR_STORAGE_MODE.SHARED, draft: structuredClone(draft), row: { draft_id: draft.draft.draftId, revision: 1 } }; } });
    const result = await sharedCoordinator(storage, remote).copyLocalDraft({ draftId, confirmedDraftId: draftId, expectedLocalRevision: 1 });
    assert.equal(result.success, true);
    assert.equal(stores, 1);
    assert.equal(result.localPreserved, true);
    assert.equal(result.localVerified, true);
    assert.equal(result.exactContentVerified, true);
    assert.equal(result.localContentFingerprint, result.sharedContentFingerprint);
    assert.equal(result.initialSharedRevision, 1);
    assert.deepEqual(storedDraft, local);
    assert.equal(loadAuthorDrafts({ userId, storage }).drafts.length, 1);
  });

  await t.test('3. an existing exact shared draft is reported and cannot be copied again', async () => {
    const storage = memoryStorage();
    const local = verifiedLocalDraft(storage);
    const preview = await sharedCoordinator(storage, sharedService({ async listDrafts() { return { success: true, drafts: [structuredClone(local)] }; } })).previewLocalDraftCopies();
    const item = preview.drafts[0];
    assert.equal(preview.readyCount, 0);
    assert.equal(preview.conflictCount, 1);
    assert.equal(item.status, AUTHOR_DRAFT_COPY_STATUS.CONFLICT);
    assert.equal(item.canCopy, false);
    assert.equal(item.remoteContentMatches, true);
  });

  await t.test('4. a different shared object with the same ID is visibly separated as a conflict', async () => {
    const storage = memoryStorage();
    const local = verifiedLocalDraft(storage);
    const changed = { ...structuredClone(local), programme: { ...local.programme, displayName: 'Changed remote content' } };
    const preview = await sharedCoordinator(storage, sharedService({ async listDrafts() { return { success: true, drafts: [changed] }; } })).previewLocalDraftCopies();
    assert.equal(preview.drafts[0].remoteContentMatches, false);
    assert.equal(preview.drafts[0].canCopy, false);
  });

  await t.test('5. shared-copy UI shows verification evidence and exposes no candidate, approval or publishing action', async () => {
    const panel = await readFile(new URL('../src/features/followAlongAuthor/AuthorStorageMigrationPanel.jsx', import.meta.url), 'utf8');
    const coordinator = await readFile(new URL('../src/features/followAlongAuthor/authorStorageCoordinator.js', import.meta.url), 'utf8');
    assert.match(panel, /Verified Author Assistant handoff/);
    assert.match(panel, /Handoff SHA-256/);
    assert.match(panel, /Local content SHA-256/);
    assert.match(panel, /existing shared content exactly matches/);
    assert.match(panel, /typeof onCopied === 'function'/);
    assert.match(panel, /await onCopied\(\)/);
    assert.match(coordinator, /exactContentVerified/);
    assert.doesNotMatch(panel, /storeReleaseCandidate|approveReleaseCandidate|publishReleaseCandidate/);
  });
});
