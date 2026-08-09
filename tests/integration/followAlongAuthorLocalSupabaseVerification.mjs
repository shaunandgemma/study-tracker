import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { createAuthorDraft } from '../../src/features/followAlongAuthor/authorDraftService.js';
import { createAuthorSharedStorageService } from '../../src/features/followAlongAuthor/authorSharedStorageService.js';
import { AUTHOR_STORAGE_MODE, createAuthorStorageCoordinator } from '../../src/features/followAlongAuthor/authorStorageCoordinator.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readLocalStatus() {
  const workdir = process.env.STEP46_SUPABASE_WORKDIR;
  assert(workdir, 'The disposable local Supabase work folder is required.');
  const output = execFileSync('./node_modules/.bin/supabase', [
    '--workdir', workdir, 'status', '-o', 'env'
  ], { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  return Object.fromEntries(output.trim().split(/\r?\n/).map(line => {
    const separator = line.indexOf('=');
    return [line.slice(0, separator), line.slice(separator + 1).replace(/^"|"$/g, '')];
  }));
}

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

const status = readLocalStatus();
const url = status.API_URL;
const key = status.PUBLISHABLE_KEY;
assert(url?.startsWith('http://127.0.0.1:'), 'The test URL must be loopback-only.');
assert(key?.startsWith('sb_publishable_'), 'The disposable local publishable key is required.');

const password = 'Step46-Local-Only!2026';
const accounts = {
  author1: 'step46-author-1@example.test',
  author2: 'step46-author-2@example.test',
  approver: 'step46-approver@example.test',
  learner: 'step46-learner@example.test'
};

async function signedInClient(email) {
  const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  assert(data.user?.id, `Local sign-in failed for ${email}.`);
  return { client, user: data.user };
}

const author1 = await signedInClient(accounts.author1);
const author2 = await signedInClient(accounts.author2);
const approver = await signedInClient(accounts.approver);
const learner = await signedInClient(accounts.learner);
const author1Service = createAuthorSharedStorageService(author1.client, { enabled: true });
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const original = createAuthorDraft({
  userId: author1.user.id,
  input: { serviceName: 'Amazon VPC', shortName: 'VPC', displayName: `Step 46 Shared VPC ${runId}` },
  idFactory: () => `step46-${runId}`
});
const created = await author1Service.storeNewDraft(original);
assert(created.success && created.draft.draft.revision === 1, `Shared create failed: ${created.error || 'unknown error'}`);

const ownerList = await author1Service.listDrafts();
assert(ownerList.success && ownerList.drafts.some(item => item.draft.draftId === original.draft.draftId), 'Author 1 could not list the new shared draft.');
const opened = await author1Service.loadDraft(original.draft.draftId);
assert(opened.success && opened.draft.draft.createdBy === author1.user.id, 'Author 1 could not reopen the shared draft.');

const readyDraft = {
  ...opened.draft,
  review: {
    ...opened.draft.review,
    learnerPreviewStatus: 'reviewed',
    reviewStatus: 'ready_for_approval'
  }
};
const saved = await author1Service.saveDraft({ draft: readyDraft, expectedRevision: 1 });
assert(saved.success && saved.draft.draft.revision === 2, `Shared revision save failed: ${saved.error || 'unknown error'}`);
const stale = await author1Service.saveDraft({ draft: readyDraft, expectedRevision: 1 });
assert(!stale.success && stale.conflict, 'A stale shared save was not safely rejected.');
const revisions = await author1Service.listRevisions(original.draft.draftId);
assert(revisions.success && revisions.revisions.length >= 1, 'The append-only revision history was not recorded.');

const author2List = await createAuthorSharedStorageService(author2.client, { enabled: true }).listDrafts();
assert(author2List.success && author2List.drafts.length === 0, 'Author 2 could see Author 1 private drafts.');
const learnerList = await createAuthorSharedStorageService(learner.client, { enabled: true }).listDrafts();
assert(learnerList.success && learnerList.drafts.length === 0, 'The learner could see private Author drafts.');
const approverList = await createAuthorSharedStorageService(approver.client, { enabled: true }).listDrafts();
assert(approverList.success && approverList.drafts.some(item => item.draft.draftId === original.draft.draftId), 'The approver could not see the Ready for Approval draft.');

const localStorage = new MemoryStorage();
const coordinator = createAuthorStorageCoordinator({
  userId: author1.user.id,
  storage: localStorage,
  enabled: true,
  sharedService: author1Service,
  initialMode: AUTHOR_STORAGE_MODE.LOCAL
});
const localDraft = createAuthorDraft({
  userId: author1.user.id,
  input: { serviceName: 'Amazon S3', shortName: 'S3', displayName: `Step 46 Local Copy ${runId}` },
  idFactory: () => `step46-copy-${runId}`
});
const storedLocal = await coordinator.storeNewDraft(localDraft);
assert(storedLocal.success, 'The private local draft could not be prepared.');
assert(coordinator.selectSharedMode().success, 'Shared mode could not be explicitly selected.');
const preview = await coordinator.previewLocalDraftCopies();
assert(preview.success && preview.previewOnly && preview.readyCount === 1 && preview.localPreserved, 'The local-to-shared copy preview was not safe.');
const copied = await coordinator.copyLocalDraft({
  draftId: localDraft.draft.draftId,
  confirmedDraftId: localDraft.draft.draftId,
  expectedLocalRevision: 1
});
assert(copied.success && copied.localVerified && copied.localPreserved, 'The confirmed local-to-shared copy failed or removed the local original.');

const approvalAttempt = await createAuthorSharedStorageService(approver.client, { enabled: true })
  .approveReleaseCandidate('step46-deliberately-missing');
assert(!approvalAttempt.success && /disabled/i.test(approvalAttempt.error || ''), 'Trusted approval was not kept disabled.');

console.log(JSON.stringify({
  success: true,
  localOnly: true,
  checks: {
    fakeSignIns: 4,
    sharedCreateListOpenSave: true,
    savedRevision: saved.draft.draft.revision,
    staleSaveRejected: stale.conflict === true,
    appendOnlyHistoryRecorded: revisions.revisions.length >= 1,
    authorIsolation: true,
    learnerDenied: true,
    approverReadyDraftRead: true,
    localCopyPreviewOnlyFirst: preview.previewOnly === true,
    localOriginalPreserved: copied.localVerified === true,
    trustedApprovalDisabled: true
  }
}, null, 2));
