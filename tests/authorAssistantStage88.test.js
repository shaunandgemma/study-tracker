import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildStageTenLearnerPreview, validateStage88Inputs } from '../scripts/author-assistant/authorAssistantLearnerPreview.mjs';
import { saveAuthorAssistantStageTenPreview } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { buildStage87ALocalAcceptance } from '../scripts/author-assistant/authorAssistantStage87A.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step88-test';
const taskId = 'task-sqs-test-001';
const sourceId = 'source-sqs';
const sourceUrl = 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/creating-sqs-standard-queues.html';

function fixture() {
  const acceptedSources = { id: 1 };
  const blueprint = {
    id: 2,
    programme: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS', displayName: 'SQS Test', subtitle: 'Queue basics', description: 'Build a queue.', learningOutcome: 'Build and test a queue.', category: 'Application Integration', difficulty: 'Beginner', regionScope: 'regional', defaultRegion: 'eu-west-2', estimatedMinutes: 10 },
    phases: [{ id: 'phase-1', phaseNumber: 1, title: 'Test', description: 'Test a queue.', taskIds: [taskId], isOptional: false }],
    tasks: [{ id: taskId, title: 'Create queue', service: 'Amazon Simple Queue Service', feature: 'Standard queue', goal: 'Create a safe queue.', whyItMatters: 'Learn queue basics.', difficulty: 'Easy', estimatedMinutes: 10, region: 'eu-west-2', phaseId: 'phase-1', prerequisites: [], isOptional: false, sourceIds: [sourceId] }],
    sources: [{ id: sourceId, title: 'Creating a queue', url: sourceUrl, publisher: 'AWS', sourceType: 'official_documentation', purpose: 'Supports this task.', taskIds: [taskId] }]
  };
  const stageSix = { id: 6, tasks: [{ taskId, title: 'Create queue', modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'not_applicable', reason: 'Future CLI path only.' } }, consoleSteps: [{ id: 'step-1', stepNumber: 1, title: 'Create queue', instructions: [{ id: 'check-1', text: 'Choose Create queue.', detail: '' }], expectedResult: 'The queue is displayed.', warning: '', sourceIds: [sourceId] }], cliSteps: [] }] };
  const stageSeven = { id: 8, resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} }, tasks: [{ taskId, createdResourceKeys: [], verification: [{ id: 'verify-1', title: 'Verify queue', instruction: 'Inspect the queue list.', expectedResult: 'The queue is listed.', mode: 'console' }] }] };
  const stageEight = { id: 10, acceptanceFingerprint: { value: 'stage-eight-fingerprint' }, taskCleanup: { taskId, steps: [{ id: 'cleanup-1', stepNumber: 1, title: 'Delete queue', instruction: 'Delete the test queue.', verification: 'The queue is no longer listed.', resourceKeys: [] }] }, programmeCleanup: { steps: [{ id: 'cleanup-final', stepNumber: 1, title: 'Acknowledge cleanup', instruction: 'Record cleanup completion.', verification: 'Cleanup is recorded.', resourceKeys: [] }], completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' } };
  const supportingRecords = { acceptedSources, blueprint, blueprintAcceptance: { id: 3 }, sourceAmendment84B: { id: 4 }, consistencyCorrection84C: { id: 5 }, stageSix, stageSixAcceptance: { id: 7 }, stageSeven, stageSevenAcceptance: { id: 9 }, stageEight, stageEightAcceptance: { id: 11 } };
  const fingerprints = Object.fromEntries(Object.entries(supportingRecords).map(([key, value]) => [key, fingerprintJson(value)]));
  const stageNineReview = {
    schemaVersion: 1, kind: 'author_stage_9_local_authoring_check', status: 'passed_awaiting_human_review', sessionId, checkedAt: '2026-08-10T20:00:00Z', basedOnStage8Fingerprint: { value: 'stage-eight-fingerprint' }, stageBoundary: { preparedLocally: [9], notPrepared: [10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false }, checks: { planning: { valid: true }, content: { valid: true }, encoding: { valid: true }, packageIntegrity: { valid: true, supportingFingerprints: fingerprints }, iamLimitation: { active: true, finding: 'Use administrator-authorized access.' } }, summary: { passed: true, errorCount: 0, warningCount: 1, retainedFindingCount: 1, taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 2, resourceValueCount: 0 }, errors: [], warnings: [], retainedManualReviewFindings: ['Use administrator-authorized access.'], acceptedStagesOneToEightChanged: false
  };
  const reviewSession = { sessionId, status: 'stage_9_ready_for_review', inputs: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS' }, boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9], stage9Prepared: true, stage10Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false } };
  const accepted = buildStage87ALocalAcceptance({ session: reviewSession, stageNine: stageNineReview, supportingRecords, now: () => new Date('2026-08-10T20:05:00Z') });
  return { session: accepted.session, acceptedSources, blueprint, stageSix, stageSeven, stageEight, stageNine: accepted.stageNine, stageNineAcceptance: accepted.acceptance, supportingRecords };
}

test('Step 88 local Stage 10 learner preview', async t => {
  await t.test('1. creates a learner-only preview matching accepted counts', () => {
    const document = buildStageTenLearnerPreview(fixture(), { now: () => new Date('2026-08-10T20:10:00Z') });
    assert.equal(document.status, 'awaiting_human_preview_review');
    assert.equal(document.summary.taskCount, 1);
    assert.equal(document.summary.checkboxCount, 1);
    assert.equal(document.summary.verificationCheckCount, 1);
    assert.equal(document.summary.cleanupItemCount, 2);
    assert.deepEqual(document.summary.availableModes, ['console']);
  });

  await t.test('2. preview retains learner instructions, verification, references and cleanup', () => {
    const document = buildStageTenLearnerPreview(fixture());
    assert.equal(document.tasks[0].consoleSteps[0].instructions[0].text, 'Choose Create queue.');
    assert.equal(document.tasks[0].verification[0].title, 'Verify queue');
    assert.equal(document.tasks[0].officialAwsReferences[0].url, sourceUrl);
    assert.equal(document.cleanup.taskSteps.length, 1);
    assert.equal(document.cleanup.programmeSteps.length, 1);
  });

  await t.test('3. private review, fingerprints, future CLI and AI data are excluded', () => {
    const document = buildStageTenLearnerPreview(fixture());
    const learnerText = JSON.stringify({ programme: document.programme, phases: document.phases, tasks: document.tasks, warnings: document.warnings, cleanup: document.cleanup });
    assert.doesNotMatch(learnerText, /manualReviewFindings|retainedManualReviewFindings|responseId|futureCliBoundary|supportingFingerprints|acceptanceFingerprint|OPENAI_API_KEY/i);
    assert.equal(document.privacyBoundary.privateReviewFindingsIncluded, false);
    assert.equal(document.privacyBoundary.acceptanceFingerprintsIncluded, false);
    assert.equal(document.privacyBoundary.futureCliGuidanceIncluded, false);
  });

  await t.test('4. changed Stage 9 or unlocked Stage 10 stops preview creation', () => {
    const changed = fixture();
    changed.stageNine.summary.checkboxCount = 2;
    assert.throws(() => validateStage88Inputs(changed), /Stage 9 fingerprint no longer matches/);
    const unlocked = fixture();
    unlocked.session.boundaries.stage10Prepared = true;
    assert.throws(() => validateStage88Inputs(unlocked), /safety boundary changed/);
  });

  await t.test('5. save creates only preview records and advances only the local boundary', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step88-'));
    try {
      const inputs = fixture();
      const directory = path.join(root, sessionId);
      await mkdir(directory);
      const document = buildStageTenLearnerPreview(inputs);
      const saved = await saveAuthorAssistantStageTenPreview({ sessionRoot: root, existingSession: inputs.session, document, previewText: 'preview', now: () => new Date('2026-08-10T20:15:00Z') });
      assert.equal(JSON.parse(await readFile(saved.documentPath, 'utf8')).kind, 'author_stage_10_local_learner_preview');
      assert.equal(await readFile(saved.previewPath, 'utf8'), 'preview');
      const session = JSON.parse(await readFile(path.join(directory, 'session.json'), 'utf8'));
      assert.equal(session.status, 'stage_10_ready_for_review');
      assert.equal(session.boundaries.stage10Prepared, true);
      assert.equal(session.boundaries.stage11Prepared, false);
      assert.equal(session.boundaries.authorDraftWritten, false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('6. command has no AI, API key or external write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/prepareStage88.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|@supabase|aws-sdk|saveAuthorDraft/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:stage-88'], 'node scripts/author-assistant/prepareStage88.mjs');
  });
});
