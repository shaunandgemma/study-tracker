import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  STEP_94_SQS_DRAFT_ID,
  STEP_94_SQS_HANDOFF_FINGERPRINT,
  buildAuthorCandidateReadinessPreview,
  isStep94VerifiedSqsDraft
} from '../src/features/followAlongAuthor/authorCandidateReadiness.js';
import { AUTHOR_STORAGE_MODE, createAuthorStorageCoordinator } from '../src/features/followAlongAuthor/authorStorageCoordinator.js';
import { createAuthorReleaseCandidate } from '../src/features/followAlongAuthor/authorApproval.js';

const userId = '00000000-0000-4000-8000-000000000094';
const authorEmail = 'author@example.com';

function sqsDraft() {
  const phases = Array.from({ length: 5 }, (_, index) => ({ id: `phase-${index + 1}`, phaseNumber: index + 1, title: `Phase ${index + 1}`, taskIds: index < 4 ? [`task-${index + 1}`] : ['task-5', 'task-6'] }));
  const tasks = Array.from({ length: 6 }, (_, index) => ({
    id: `task-${index + 1}`,
    phaseId: index < 4 ? `phase-${index + 1}` : 'phase-5',
    consoleSteps: [{ id: `step-${index + 1}`, instructions: Array.from({ length: 4 }, (__, instructionIndex) => ({ id: `instruction-${index + 1}-${instructionIndex + 1}`, text: 'Do one safe Console action.' })) }],
    verification: Array.from({ length: index === 0 ? 2 : 1 }, (__, verificationIndex) => ({ id: `verification-${index + 1}-${verificationIndex + 1}` })),
    cleanup: index < 3 ? [{ id: `cleanup-${index + 1}` }] : []
  }));
  return {
    schema: { profile: 'canonical-follow-along', version: '1.0.0' },
    draft: {
      draftId: STEP_94_SQS_DRAFT_ID,
      revision: 1,
      status: 'draft',
      createdAt: '2026-08-10T10:00:00.000Z',
      createdBy: userId,
      updatedAt: '2026-08-10T10:00:00.000Z',
      updatedBy: userId,
      importedFrom: {
        type: 'author_assistant_handoff',
        importStep: '92',
        sessionId: 'author-assistant-sqs-test',
        handoffFingerprint: STEP_94_SQS_HANDOFF_FINGERPRINT,
        acceptanceAuditFingerprint: 'a'.repeat(64),
        authorDraftContentFingerprint: 'b'.repeat(64),
        acceptedStages: '1-11'
      }
    },
    programme: { serviceSlug: 'sqs', serviceName: 'Amazon Simple Queue Service', displayName: 'Amazon SQS: Basic Message Queue Test', publicationVisibility: 'unpublished' },
    phases,
    tasks,
    sources: Array.from({ length: 11 }, (_, index) => ({ id: `source-${index + 1}` })),
    resources: { schema: [] },
    cleanup: { steps: [{ id: 'programme-cleanup' }] },
    review: { reviewStatus: 'ready_for_approval', approvalDecision: 'pending' },
    publication: { publishStatus: 'not_published' }
  };
}

function validInputs(overrides = {}) {
  const draft = sqsDraft();
  return {
    draft,
    userId,
    authorEmail,
    storageMode: AUTHOR_STORAGE_MODE.SHARED,
    serverDraft: structuredClone(draft),
    serverRow: { draft_id: draft.draft.draftId, owner_id: userId, revision: 1, status: 'ready_for_approval', content_hash: 'c'.repeat(64) },
    candidates: [],
    planningValidation: { valid: true },
    contentValidation: { valid: true },
    reviewValidation: { valid: true },
    ...overrides
  };
}

test('Step 94 read-only SQS candidate-readiness preview', async t => {
  await t.test('1. the exact verified SQS Shared Draft passes without generating a candidate ID', async () => {
    const input = validInputs();
    assert.equal(isStep94VerifiedSqsDraft(input.draft), true);
    const preview = await buildAuthorCandidateReadinessPreview(input);
    assert.equal(preview.success, true);
    assert.equal(preview.previewOnly, true);
    assert.equal(preview.readyForCandidateGeneration, true);
    assert.equal(preview.intendedAuthor.id, userId);
    assert.equal(preview.serverOwnerId, userId);
    assert.equal(preview.currentRevision, 1);
    assert.equal(preview.duplicateState, 'none_for_current_revision');
    assert.equal(preview.currentRevisionCandidateCount, 0);
    assert.equal(preview.exactSavedContent, true);
    assert.equal(preview.fingerprints.currentDraft, preview.fingerprints.savedSharedDraft);
    assert.match(preview.fingerprints.databaseContent, /^[a-f0-9]{64}$/);
    assert.deepEqual(preview.counts, { phaseCount: 5, taskCount: 6, checkboxCount: 24, verificationCheckCount: 7, cleanupItemCount: 4, learnerResourceValueCount: 0, officialAwsSourceCount: 11 });
    assert.deepEqual(preview.boundaries, { databaseReadsOnly: true, databaseWrites: 0, candidateCreated: false, candidateIdGenerated: false, approvalPerformed: false, publicationPerformed: false });
  });

  await t.test('2. the coordinator performs only one saved-draft read and one candidate-list read', async () => {
    const input = validInputs();
    let loads = 0;
    let candidateLists = 0;
    let candidateWrites = 0;
    const remote = {
      enabled: true,
      async loadDraft(id) { loads += 1; assert.equal(id, STEP_94_SQS_DRAFT_ID); return { success: true, draft: input.serverDraft, row: input.serverRow }; },
      async listReleaseCandidates() { candidateLists += 1; return { success: true, candidates: [] }; },
      async storeReleaseCandidate() { candidateWrites += 1; throw new Error('must not write'); }
    };
    const coordinator = createAuthorStorageCoordinator({ userId, enabled: true, sharedService: remote });
    assert.equal(coordinator.selectSharedMode().success, true);
    const result = await coordinator.previewReleaseCandidateReadiness({ draft: input.draft, authorEmail, planningValidation: { valid: true }, contentValidation: { valid: true }, reviewValidation: { valid: true } });
    assert.equal(result.readyForCandidateGeneration, true);
    assert.equal(loads, 1);
    assert.equal(candidateLists, 1);
    assert.equal(candidateWrites, 0);
  });

  await t.test('3. ownership, revision or saved-content differences block readiness', async () => {
    const base = validInputs();
    const wrongOwner = await buildAuthorCandidateReadinessPreview({ ...base, serverRow: { ...base.serverRow, owner_id: 'other-author' } });
    assert.equal(wrongOwner.readyForCandidateGeneration, false);
    assert.equal(wrongOwner.checks.find(item => item.id === 'author_ownership').passed, false);
    const wrongRevision = await buildAuthorCandidateReadinessPreview({ ...base, serverRow: { ...base.serverRow, revision: 2 } });
    assert.equal(wrongRevision.readyForCandidateGeneration, false);
    assert.equal(wrongRevision.checks.find(item => item.id === 'saved_revision').passed, false);
    const changedServerDraft = structuredClone(base.serverDraft);
    changedServerDraft.programme.displayName = 'Changed saved content';
    const changed = await buildAuthorCandidateReadinessPreview({ ...base, serverDraft: changedServerDraft });
    assert.equal(changed.readyForCandidateGeneration, false);
    assert.equal(changed.exactSavedContent, false);
  });

  await t.test('4. any existing immutable candidate for revision 1 is reported and blocks a duplicate', async () => {
    const base = validInputs();
    const prepared = await createAuthorReleaseCandidate({ draft: base.draft, userId, planningValidation: { valid: true }, contentValidation: { valid: true }, reviewValidation: { valid: true } });
    assert.equal(prepared.success, true);
    const row = {
      candidate_id: prepared.candidate.candidateId,
      draft_id: STEP_94_SQS_DRAFT_ID,
      source_revision: 1,
      created_by: userId,
      snapshot: prepared.candidate.snapshot,
      content_hash: prepared.candidate.contentHash,
      draft_content_hash: base.serverRow.content_hash,
      status: 'awaiting_trusted_approval',
      approval_decision: 'pending'
    };
    const preview = await buildAuthorCandidateReadinessPreview({ ...base, candidates: [row] });
    assert.equal(preview.readyForCandidateGeneration, false);
    assert.equal(preview.duplicateState, 'existing_candidate_for_current_revision');
    assert.equal(preview.currentRevisionCandidateCount, 1);
    assert.deepEqual(preview.existingCandidateIds, [prepared.candidate.candidateId]);
    assert.equal(preview.existingCandidateRecords[0].valid, true);
    assert.equal(preview.existingCandidateRecords[0].serverSnapshotHashPresent, true);
    assert.equal(preview.existingCandidateRecords[0].candidateIdMatchesSnapshot, true);
    assert.equal(preview.existingCandidateRecords[0].matchesCurrentDraft, true);
    assert.equal(preview.existingCandidateRecords[0].savedDraftHashMatches, true);
  });

  await t.test('5. a different draft is rejected before any remote operation', async () => {
    const draft = sqsDraft();
    draft.draft.draftId = 'different-draft';
    let remoteReads = 0;
    const remote = { enabled: true, async loadDraft() { remoteReads += 1; }, async listReleaseCandidates() { remoteReads += 1; } };
    const coordinator = createAuthorStorageCoordinator({ userId, enabled: true, sharedService: remote });
    coordinator.selectSharedMode();
    const result = await coordinator.previewReleaseCandidateReadiness({ draft });
    assert.equal(result.success, false);
    assert.equal(result.wrongTarget, true);
    assert.equal(remoteReads, 0);
  });

  await t.test('6. the Stage 12 preview UI contains no candidate-generation or write implementation', async () => {
    const panel = await readFile(new URL('../src/features/followAlongAuthor/AuthorCandidateReadinessPreview.jsx', import.meta.url), 'utf8');
    const logic = await readFile(new URL('../src/features/followAlongAuthor/authorCandidateReadiness.js', import.meta.url), 'utf8');
    const coordinator = await readFile(new URL('../src/features/followAlongAuthor/authorStorageCoordinator.js', import.meta.url), 'utf8');
    assert.match(panel, /Read-only Stage 12 candidate readiness/);
    assert.match(panel, /Preview Stage 12 Readiness/);
    assert.match(panel, /Candidate IDs generated by this preview: 0/);
    assert.match(panel, /Database writes: 0/);
    assert.match(panel, /Candidate records for this draft/);
    assert.match(panel, /Existing Shared Candidate Approval Key/);
    assert.match(panel, /Candidate key, snapshot, owner, source revision and saved draft hash all match/);
    assert.doesNotMatch(`${panel}\n${logic}`, /createAuthorReleaseCandidate|storeReleaseCandidate|approveReleaseCandidate|publishReleaseCandidate/);
    assert.match(coordinator, /remote\.loadDraft/);
    assert.match(coordinator, /remote\.listReleaseCandidates/);
    const stage = await readFile(new URL('../src/features/followAlongAuthor/AuthorTrustedApprovalStage.jsx', import.meta.url), 'utf8');
    assert.match(stage, /Prepare New Local Package/);
    assert.match(stage, /Local package only — approval unavailable/);
  });
});
