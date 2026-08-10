import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  AUTHOR_HANDOFF_IMPORT_CONFIRMATION,
  AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE,
  executeAuthorHandoffControlledImport,
  prepareAuthorHandoffControlledImport
} from '../src/features/followAlongAuthor/authorHandoffControlledImport.js';
import { loadAuthorDrafts, storeNewAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import { buildStage90ALocalAcceptance } from '../scripts/author-assistant/authorAssistantStage90A.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-controlled-import';
const currentUser = { id: '00000000-0000-4000-8000-000000000092', email: 'author@example.com' };
const importedAt = '2026-08-10T15:00:00.000Z';

function packageFingerprintContent(handoffPackage) {
  const content = structuredClone(handoffPackage);
  delete content.status;
  delete content.preparedAt;
  delete content.handoffFingerprint;
  return content;
}

function auditFingerprintContent(acceptance) {
  const content = structuredClone(acceptance);
  delete content.acceptedAt;
  delete content.acceptanceAuditFingerprint;
  return content;
}

function acceptedContent() {
  const taskId = 'task-syn-create-test-001';
  const sourceId = 'source-synthetic-service-guide';
  return {
    schema: { profile: 'canonical-follow-along', version: '1.0.0', authorPackageVersion: '1.0.0', sharedContractHash: null, createdWith: 'author-v1' },
    programme: {
      serviceSlug: 'syn',
      serviceName: 'Amazon Synthetic Service',
      shortName: 'SYN',
      displayName: 'Synthetic Follow Along',
      subtitle: 'Create one harmless test resource',
      description: 'A safe synthetic programme used to test the controlled Author import.',
      learningOutcome: 'Create and inspect one harmless synthetic resource.',
      programmeId: 'synthetic-learning-path',
      pathId: 'synthetic-learning-path',
      componentNamespace: '',
      category: 'Testing',
      difficulty: 'Beginner',
      estimatedMinutes: 15,
      defaultRegion: 'eu-west-2',
      regionScope: 'regional',
      supportedModes: ['console'],
      publicationVisibility: 'unpublished'
    },
    sources: [{ id: sourceId, title: 'Synthetic service guide', url: 'https://docs.aws.amazon.com/example/latest/guide/start.html', purpose: 'Support the learner Console path.', taskIds: [taskId] }],
    presentation: { accentColor: '#0891b2', iconLabel: 'SYN', iconName: '', badgeText: '' },
    storage: {},
    progress: { initialTaskId: taskId, supportedModes: ['console'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_cleaned'] },
    capabilities: {},
    phases: [{ id: 'phase-1-prepare', phaseNumber: 1, title: 'Prepare', description: 'Prepare the harmless test.', taskIds: [taskId], isOptional: false }],
    tasks: [{
      id: taskId,
      slug: 'create-test',
      title: 'Create the test resource',
      service: 'Amazon Synthetic Service',
      feature: 'Synthetic resources',
      goal: 'Create one harmless test resource.',
      whyItMatters: 'The learner can verify the basic service workflow.',
      difficulty: 'Easy',
      estimatedMinutes: 10,
      region: 'eu-west-2',
      status: 'draft',
      phaseId: 'phase-1-prepare',
      prerequisites: [],
      isOptional: false,
      sourceIds: [sourceId],
      concepts: [],
      values: [],
      modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'not_applicable', reason: 'CLI is outside the accepted path.' } },
      consoleSteps: [{
        id: 'console-step-1',
        stepNumber: 1,
        number: 1,
        title: 'Open the service',
        instruction: 'Open the AWS Console.',
        instructions: [{ id: 'check-1', text: 'Open the AWS Console.', detail: '' }],
        commands: [],
        expectedResult: 'The service page is visible.',
        warning: '',
        sourceIds: [sourceId]
      }],
      cliSteps: [],
      createdResourceKeys: [],
      verification: [{ id: 'verify-1', title: 'Verify the page', instruction: 'Inspect the page.', expectedResult: 'The service page is visible.', mode: 'console' }],
      cleanup: []
    }],
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} },
    warnings: { cost: '', safety: 'Cleanup is manual only.', credentials: 'Never save AWS credentials.', region: '' },
    cleanup: {
      steps: [{ id: 'programme-cleanup-1', stepNumber: 1, title: 'Confirm cleanup', instruction: 'Confirm the test is complete.', description: 'Confirm the test is complete.', verification: 'No test resource remains.', resourceKeys: [] }],
      completionGate: 'acknowledgement',
      manualOnly: true,
      ordering: 'reverse_dependency'
    },
    extensions: { registrations: [] },
    review: { validationStatus: 'not_run', validationErrors: [], validationWarnings: [], sourceReviewStatus: 'not_run', learnerPreviewStatus: 'reviewed', approvalDecision: 'pending', reviewStatus: 'ready_for_approval', findings: [] },
    publication: { publishStatus: 'not_published', targetProgrammeId: 'synthetic-learning-path', proposedChanges: [] }
  };
}

function fixture() {
  const handoffPackage = {
    schemaVersion: 1,
    kind: 'author_local_handoff_package',
    status: 'awaiting_human_handoff_review',
    sessionId,
    preparedAt: '2026-08-10T14:00:00.000Z',
    service: { officialName: 'Amazon Synthetic Service', shortName: 'SYN' },
    acceptedFingerprintChain: { stage11: { algorithm: 'sha256-json-v1', value: '1'.repeat(64) } },
    acceptedRecordManifest: { stageEleven: { algorithm: 'sha256-json-v1', value: '2'.repeat(64) } },
    authorDraftContent: acceptedContent(),
    identityBinding: { status: 'required_before_author_write', assignedAuthorId: null, assignedDraftId: null, assignedRevision: null, rule: 'Bind later.' },
    summary: { phaseCount: 1, taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 1, learnerResourceValueCount: 0, officialAwsSourceCount: 1 },
    handoffBoundary: { localPackageOnly: true, stage12Started: false, authorDraftWritten: false, authorIdentityBound: false, connectedToAuthor: false, connectedToSupabase: false, connectedToAws: false, releaseCandidatePrepared: false, candidateIdGenerated: false, approvalPerformed: false, published: false },
    acceptedStagesOneToElevenChanged: false
  };
  handoffPackage.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprintJson(packageFingerprintContent(handoffPackage)) };
  const session = { sessionId, status: 'handoff_package_ready_for_review', boundaries: { handoffPackagePrepared: true, stage12Prepared: false, authorDraftWritten: false, supabaseConnected: false, awsConnected: false, candidatePrepared: false, published: false } };
  const acceptance = buildStage90ALocalAcceptance({ session, handoffPackage, now: () => new Date('2026-08-10T14:05:00.000Z') });
  return { handoffPackage, acceptance };
}

function refreshFingerprints(handoffPackage, acceptance) {
  handoffPackage.handoffFingerprint.value = fingerprintJson(packageFingerprintContent(handoffPackage));
  acceptance.handoffFingerprint.value = handoffPackage.handoffFingerprint.value;
  acceptance.authorDraftContentFingerprint.value = fingerprintJson(handoffPackage.authorDraftContent);
  acceptance.acceptedRecordManifestFingerprint.value = fingerprintJson(handoffPackage.acceptedRecordManifest);
  acceptance.acceptanceAuditFingerprint.value = fingerprintJson(auditFingerprintContent(acceptance));
}

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

function storageCallbacks(storage, storeCount = { value: 0 }) {
  return {
    listDrafts: async () => loadAuthorDrafts({ userId: currentUser.id, storage }),
    storeDraft: async draft => {
      storeCount.value += 1;
      return storeNewAuthorDraft({ userId: currentUser.id, draft, storage });
    }
  };
}

test('Step 92 controlled Author handoff import', async t => {
  await t.test('1. exact comparison preserves accepted Stages 1-11 and adds only the private draft envelope', async () => {
    const documents = fixture();
    const existingDrafts = [{ draft: { draftId: 'unrelated-draft' } }];
    const plan = await prepareAuthorHandoffControlledImport({ ...documents, currentUser, existingDrafts, now: () => new Date(importedAt) });
    const storedContent = structuredClone(plan.draft);
    delete storedContent.draft;
    assert.deepEqual(storedContent, documents.handoffPackage.authorDraftContent);
    assert.equal(plan.acceptedContentUnchanged, true);
    assert.equal(plan.beforeDraftCount, 1);
    assert.equal(plan.afterDraftCount, 2);
    assert.equal(plan.canCreate, true);
    assert.equal(plan.draft.draft.createdBy, currentUser.id);
    assert.equal(plan.draft.draft.revision, 1);
    assert.equal(plan.draft.draft.importedFrom.handoffFingerprint, documents.handoffPackage.handoffFingerprint.value);
    assert.equal(plan.draft.programme.publicationVisibility, 'unpublished');
    assert.equal(plan.draft.publication.publishStatus, 'not_published');
    assert.ok(Object.values(plan.authorValidation).every(result => result.valid));
  });

  await t.test('2. deterministic identity and a non-local mode stop duplicate or shared creation', async () => {
    const documents = fixture();
    const first = await prepareAuthorHandoffControlledImport({ ...documents, currentUser, now: () => new Date(importedAt) });
    const duplicate = await prepareAuthorHandoffControlledImport({ ...documents, currentUser, existingDrafts: [first.draft], now: () => new Date(importedAt) });
    assert.equal(duplicate.duplicate, true);
    assert.equal(duplicate.canCreate, false);
    assert.equal(duplicate.afterDraftCount, 1);
    const shared = await prepareAuthorHandoffControlledImport({ ...documents, currentUser, storageMode: 'shared_supabase', now: () => new Date(importedAt) });
    assert.equal(shared.canCreate, false);
    assert.match(shared.blockedReason, /Local Drafts/);
  });

  await t.test('3. a missing human confirmation or comparison performs no write', async () => {
    const documents = fixture();
    const storage = memoryStorage();
    const calls = { value: 0 };
    const callbacks = storageCallbacks(storage, calls);
    const noConfirmation = await executeAuthorHandoffControlledImport({ ...documents, currentUser, ...callbacks });
    assert.equal(noConfirmation.success, false);
    assert.equal(noConfirmation.confirmationRequired, true);
    const noPlan = await executeAuthorHandoffControlledImport({ ...documents, currentUser, ...callbacks, confirmation: AUTHOR_HANDOFF_IMPORT_CONFIRMATION });
    assert.equal(noPlan.success, false);
    assert.equal(noPlan.comparisonRequired, true);
    assert.equal(calls.value, 0);
  });

  await t.test('4. confirmed execution creates exactly one private revision-one draft', async () => {
    const documents = fixture();
    const storage = memoryStorage();
    const calls = { value: 0 };
    const callbacks = storageCallbacks(storage, calls);
    const preparedPlan = await prepareAuthorHandoffControlledImport({ ...documents, currentUser, now: () => new Date(importedAt) });
    const result = await executeAuthorHandoffControlledImport({ ...documents, currentUser, preparedPlan, confirmation: AUTHOR_HANDOFF_IMPORT_CONFIRMATION, ...callbacks });
    assert.equal(result.success, true);
    assert.equal(result.createdCount, 1);
    assert.equal(result.revision, 1);
    assert.equal(result.ownerId, currentUser.id);
    assert.equal(result.storageMode, AUTHOR_HANDOFF_PRIVATE_STORAGE_MODE);
    assert.equal(result.stage12Started, false);
    assert.equal(result.candidateCreated, false);
    assert.equal(calls.value, 1);
    const saved = loadAuthorDrafts({ userId: currentUser.id, storage });
    assert.equal(saved.drafts.length, 1);
    const savedContent = structuredClone(saved.drafts[0]);
    delete savedContent.draft;
    assert.deepEqual(savedContent, documents.handoffPackage.authorDraftContent);
  });

  await t.test('5. a repeated or raced import is stopped before the storage write', async () => {
    const documents = fixture();
    const storage = memoryStorage();
    const firstCalls = { value: 0 };
    const firstCallbacks = storageCallbacks(storage, firstCalls);
    const preparedPlan = await prepareAuthorHandoffControlledImport({ ...documents, currentUser, now: () => new Date(importedAt) });
    assert.equal((await executeAuthorHandoffControlledImport({ ...documents, currentUser, preparedPlan, confirmation: AUTHOR_HANDOFF_IMPORT_CONFIRMATION, ...firstCallbacks })).success, true);
    const repeatedCalls = { value: 0 };
    const repeated = await executeAuthorHandoffControlledImport({ ...documents, currentUser, preparedPlan, confirmation: AUTHOR_HANDOFF_IMPORT_CONFIRMATION, ...storageCallbacks(storage, repeatedCalls) });
    assert.equal(repeated.success, false);
    assert.equal(repeated.duplicate, true);
    assert.equal(repeatedCalls.value, 0);
    assert.equal(loadAuthorDrafts({ userId: currentUser.id, storage }).drafts.length, 1);
  });

  await t.test('6. changed package, Author or comparison stops before writing', async () => {
    const documents = fixture();
    const preparedPlan = await prepareAuthorHandoffControlledImport({ ...documents, currentUser, now: () => new Date(importedAt) });
    const calls = { value: 0 };
    const callbacks = storageCallbacks(memoryStorage(), calls);
    const changedPackage = structuredClone(documents.handoffPackage);
    changedPackage.authorDraftContent.programme.displayName = 'Changed after comparison';
    const changed = await executeAuthorHandoffControlledImport({ handoffPackage: changedPackage, acceptance: documents.acceptance, currentUser, preparedPlan, confirmation: AUTHOR_HANDOFF_IMPORT_CONFIRMATION, ...callbacks });
    assert.equal(changed.success, false);
    assert.match(changed.error, /Fingerprint verification failed/);
    const otherAuthor = await executeAuthorHandoffControlledImport({ ...documents, currentUser: { id: 'other-author', email: 'other@example.com' }, preparedPlan, confirmation: AUTHOR_HANDOFF_IMPORT_CONFIRMATION, ...callbacks });
    assert.equal(otherAuthor.success, false);
    assert.equal(otherAuthor.comparisonChanged, true);
    assert.equal(calls.value, 0);
  });

  await t.test('7. a correctly re-fingerprinted published package is still rejected', async () => {
    const documents = fixture();
    documents.handoffPackage.authorDraftContent.programme.publicationVisibility = 'published';
    documents.handoffPackage.authorDraftContent.publication.publishStatus = 'published';
    refreshFingerprints(documents.handoffPackage, documents.acceptance);
    await assert.rejects(
      () => prepareAuthorHandoffControlledImport({ ...documents, currentUser, now: () => new Date(importedAt) }),
      /not an unpublished Author draft/
    );
  });

  await t.test('8. the UI delegates one local import and exposes no candidate, approval or publishing action', async () => {
    const component = await readFile(new URL('../src/features/followAlongAuthor/AuthorHandoffImportPreview.jsx', import.meta.url), 'utf8');
    const home = await readFile(new URL('../src/features/followAlongAuthor/AuthorHome.jsx', import.meta.url), 'utf8');
    assert.match(component, /Exact pre-import comparison/);
    assert.match(component, /Create One Private Author Draft/);
    assert.match(component, /onCreatePrivateDraft/);
    assert.match(home, /executeAuthorHandoffControlledImport/);
    assert.match(home, /storageMode !== AUTHOR_STORAGE_MODE\.LOCAL/);
    assert.doesNotMatch(component, /from\s+['"][^'"]*(?:authorSharedStorageService|supabase)[^'"]*['"]|\b(?:storeReleaseCandidate|approveReleaseCandidate|publishFollowAlong)\s*\(/i);
  });
});
