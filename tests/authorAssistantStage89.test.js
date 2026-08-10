import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import { buildStageElevenStructuredReview, validateStage89Inputs } from '../scripts/author-assistant/authorAssistantStructuredReview.mjs';
import { saveAuthorAssistantStageElevenReview } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step89-test';

function validDraft() {
  const base = createAuthorDraft({ userId: 'local-review', input: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS', displayName: 'SQS Test', description: 'Test a queue.' }, idFactory: () => 'review', now: () => new Date('2026-08-10T22:00:00Z') });
  const taskId = 'task-sqs-test-001'; const sourceId = 'source-sqs';
  return {
    ...base,
    programme: { ...base.programme, subtitle: 'Queue basics', learningOutcome: 'Test a queue safely.', category: 'Application Integration', difficulty: 'Beginner', regionScope: 'regional', defaultRegion: 'eu-west-2', estimatedMinutes: 10 },
    phases: [{ id: 'phase-1', phaseNumber: 1, title: 'Test', description: 'Test the queue.', taskIds: [taskId], isOptional: false }],
    sources: [{ id: sourceId, title: 'SQS guide', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/creating-sqs-standard-queues.html', purpose: 'Supports the task.', taskIds: [taskId] }],
    tasks: [{ id: taskId, title: 'Test queue', goal: 'Test the queue.', whyItMatters: 'Learn safely.', feature: 'Standard queue', difficulty: 'Easy', estimatedMinutes: 10, phaseId: 'phase-1', prerequisites: [], sourceIds: [sourceId], modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'not_applicable', reason: 'Console-only trial.' } }, consoleSteps: [{ id: 'step-1', stepNumber: 1, title: 'Test', instructions: [{ id: 'check-1', text: 'Inspect the queue.', detail: '' }], expectedResult: 'The queue is visible.' }], cliSteps: [], createdResourceKeys: [], verification: [{ id: 'verify-1', title: 'Verify', instruction: 'Inspect the Console.', expectedResult: 'The result is visible.', mode: 'console' }], cleanup: [] }],
    cleanup: { steps: [{ id: 'cleanup-1', stepNumber: 1, title: 'Cleanup acknowledgement', instruction: 'Record cleanup.', verification: 'Cleanup is recorded.', resourceKeys: [] }], completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' }
  };
}

function fixture() {
  const stageNine = { sessionId, status: 'human_accepted', retainedManualReviewFindings: ['An exact least-privilege IAM policy must not be inferred.', 'The learner must use an account already authorized by an administrator.', 'Receipt-handle guidance is preserved only for a future CLI path.'], acceptedAt: '2026-08-10T22:01:00Z' };
  const { status, acceptedAt, acceptanceFingerprint, ...nineContent } = stageNine; const nineFp = fingerprintJson(nineContent); stageNine.acceptanceFingerprint = { value: nineFp };
  const stageNineAcceptance = { sessionId, status: 'accepted', stageNineFingerprint: { value: nineFp } };
  const stageTen = { sessionId, status: 'human_accepted', basedOnStage9Fingerprint: { value: nineFp }, acceptedAt: '2026-08-10T22:02:00Z', tasks: [], summary: {}, privacyBoundary: {}, stageBoundary: {} };
  const { status: tenStatus, generatedAt, acceptedAt: tenAccepted, acceptanceFingerprint: tenAcceptance, ...tenContent } = stageTen; const tenFp = fingerprintJson(tenContent); stageTen.acceptanceFingerprint = { value: tenFp };
  const stageTenAcceptance = { sessionId, status: 'accepted', approvalStep: '88B', stageTenFingerprint: { value: tenFp } };
  const correctionAudit = { sessionId, approvalStep: '88A', newFingerprints: { stageNine: nineFp }, futureCliGuidancePreserved: true };
  const session = { sessionId, status: 'stage_10_accepted', boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], stage10Accepted: true, stage11Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false } };
  return { session, stageNine, stageNineAcceptance, stageTen, stageTenAcceptance, correctionAudit };
}

test('Step 89 local Stage 11 structured review', async t => {
  await t.test('1. uses app review rules and prepares ready-for-approval state without approval', () => {
    const document = buildStageElevenStructuredReview(fixture(), { draftOverride: validDraft(), now: () => new Date('2026-08-10T22:05:00Z') });
    assert.equal(document.validations.planning.valid, true); assert.equal(document.validations.content.valid, true); assert.equal(document.validations.structuredReview.valid, true);
    assert.equal(document.reviewState.learnerPreviewStatus, 'reviewed'); assert.equal(document.reviewState.reviewStatus, 'ready_for_approval'); assert.equal(document.reviewState.approvalDecision, 'pending'); assert.equal(document.safetyBoundary.approvalPerformed, false);
  });
  await t.test('2. consolidates overlapping IAM findings into one open advisory', () => {
    const document = buildStageElevenStructuredReview(fixture(), { draftOverride: validDraft() });
    assert.equal(document.findings.length, 1); assert.equal(document.findings[0].priority, 'advisory'); assert.equal(document.findings[0].status, 'open'); assert.equal(document.findings[0].consolidatedFrom.length, 2); assert.equal(document.summary.openBlockingFindingCount, 0); assert.equal(document.summary.resolvedFindingCount, 1);
  });
  await t.test('3. changed Stage 10 or unlocked Stage 11 stops review', () => {
    const changed = fixture(); changed.stageTen.tasks.push({ id: 'changed' }); assert.throws(() => validateStage89Inputs(changed), /Stage 10 fingerprint no longer matches/);
    const unlocked = fixture(); unlocked.session.boundaries.stage11Prepared = true; assert.throws(() => validateStage89Inputs(unlocked), /safety boundary changed/);
  });
  await t.test('4. invalid accepted Author content stops ready-for-approval preparation', () => {
    const draft = validDraft(); draft.warnings.credentials = ''; assert.throws(() => buildStageElevenStructuredReview(fixture(), { draftOverride: draft }), /Author checks no longer pass/);
  });
  await t.test('5. save writes only Stage 11 report, preview and local session boundary', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step89-'));
    try { const inputs = fixture(); const document = buildStageElevenStructuredReview(inputs, { draftOverride: validDraft() }); const directory = path.join(root, sessionId); await mkdir(directory); const saved = await saveAuthorAssistantStageElevenReview({ sessionRoot: root, existingSession: inputs.session, document, previewText: 'preview', now: () => new Date('2026-08-10T22:10:00Z') }); assert.equal(JSON.parse(await readFile(saved.documentPath, 'utf8')).kind, 'author_stage_11_local_structured_review'); assert.equal(await readFile(saved.previewPath, 'utf8'), 'preview'); const session = JSON.parse(await readFile(path.join(directory, 'session.json'), 'utf8')); assert.equal(session.boundaries.stage11Prepared, true); assert.equal(session.boundaries.stage12Prepared, false); assert.equal(session.boundaries.candidatePrepared, false); } finally { await rm(root, { recursive: true, force: true }); }
  });
  await t.test('6. command has no AI, approval, publishing or external write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/prepareStage89.mjs', import.meta.url), 'utf8'); assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|@supabase|aws-sdk|saveAuthorDraft|releaseCandidate|publishProgramme/i); const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')); assert.equal(packageJson.scripts['author-assistant:stage-89'], 'node scripts/author-assistant/prepareStage89.mjs');
  });
});
