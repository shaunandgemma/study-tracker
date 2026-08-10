import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildAwsResearchRequest, loadAuthorAssistantSession, saveAuthorAssistantSession, saveAuthorAssistantStage86AAcceptance } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { buildStage85BLocalAcceptance } from '../scripts/author-assistant/authorAssistantStage85B.mjs';
import { buildStage86ALocalAcceptance, validateStage86AAcceptanceInputs, verifyStage86AAcceptanceFingerprint } from '../scripts/author-assistant/authorAssistantStage86A.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step86a-test';
const cleanupTaskId = 'task-sqs-review-queue-deletion-effects-006';
const sourceUrl = 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/step-delete-queue.html';

function fixture() {
  const taskIds = ['task-1', 'task-2', 'task-3', 'task-4', 'task-5', cleanupTaskId];
  const acceptedSources = { status: 'accepted', sessionId, sources: [{ url: sourceUrl }] };
  const blueprint = { status: 'human_accepted', sessionId, tasks: taskIds.map((id, index) => ({ id, title: `Task ${index + 1}` })) };
  const supportRecords = {
    acceptedSources,
    blueprint,
    blueprintAcceptance: { status: 'accepted', sessionId },
    sourceAmendment84B: { status: 'applied_locally', approvalStep: '84B', sessionId },
    consistencyCorrection84C: { status: 'applied_locally', approvalStep: '84C', sessionId }
  };
  const stageSixInstructions = {
    status: 'human_accepted',
    sessionId,
    tasks: taskIds.map(taskId => ({ taskId })),
    protectedSourceUrlsUsed: [sourceUrl],
    manualReviewFindings: ['Manual cleanup only.'],
    boundaryAlignment: { futureCliGuidance: { [cleanupTaskId]: 'Future CLI cleanup only.' } }
  };
  const stageSixContent = { tasks: stageSixInstructions.tasks, protectedSourceUrlsUsed: stageSixInstructions.protectedSourceUrlsUsed, manualReviewFindings: stageSixInstructions.manualReviewFindings, boundaryAlignment: stageSixInstructions.boundaryAlignment };
  const stageSixFingerprint = fingerprintJson(stageSixContent);
  stageSixInstructions.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageSixFingerprint };
  const stageSixAcceptance = {
    status: 'accepted',
    approvalStep: '84D',
    sessionId,
    instructionFingerprint: { algorithm: 'sha256-json-v1', value: stageSixFingerprint },
    supportFingerprints: Object.fromEntries(Object.entries(supportRecords).map(([key, value]) => [key, fingerprintJson(value)]))
  };
  const counts = [2, 1, 1, 1, 1, 1];
  const pendingStageSeven = {
    status: 'awaiting_human_stage_7_review',
    sessionId,
    basedOnStage6Fingerprint: { algorithm: 'sha256-json-v1', value: stageSixFingerprint },
    stageBoundary: { preparedLocally: [7], notPrepared: [8, 9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    resources: { schema: [] },
    tasks: taskIds.map((taskId, taskIndex) => ({ taskId, title: `Task ${taskIndex + 1}`, createdResourceKeys: [], verification: Array.from({ length: counts[taskIndex] }, (_, checkIndex) => ({ id: `verify-${taskIndex}-${checkIndex}`, title: 'Check', instruction: 'Inspect the result.', expectedResult: 'The result is visible.', mode: 'console' })) })),
    evidence: { resources: [], verifications: taskIds.flatMap((taskId, taskIndex) => Array.from({ length: counts[taskIndex] }, (_, checkIndex) => ({ taskId, verificationId: `verify-${taskIndex}-${checkIndex}`, sourceUrls: [sourceUrl] }))), protectedSourceUrls: [sourceUrl] },
    consoleBoundary: { verificationModes: ['console'], cliCommandsPrepared: false },
    futureCliBoundary: { prepared: false, guidancePreservedFromStage6: { [cleanupTaskId]: 'Future CLI cleanup only.' } },
    manualReviewFindings: ['Manual cleanup only.']
  };
  const reviewSession = {
    sessionId,
    status: 'stage_7_ready_for_review',
    currentStep: 'local_stage_7_resources_checks_review',
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-08-10T13:00:00.000Z',
    inputs: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS', learnerLevel: 'Beginner', buildOutcome: 'Build and test a queue safely', preferredRegion: 'eu-west-2' },
    boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7], authorDraftWritten: false, stage6Prepared: true, stage6Accepted: true, stage7Prepared: true, stage8Prepared: false, awsConnected: false, supabaseConnected: false }
  };
  const acceptedStageSeven = buildStage85BLocalAcceptance({ session: reviewSession, stageSeven: pendingStageSeven, stageSixInstructions, stageSixAcceptance, supportRecords, now: () => new Date('2026-08-10T14:00:00.000Z') });
  const stageEight = {
    status: 'awaiting_human_stage_8_review',
    sessionId,
    basedOnStage7Fingerprint: { ...acceptedStageSeven.stageSeven.acceptanceFingerprint },
    stageBoundary: { preparedLocally: [8], notPrepared: [9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    approvedCleanupTarget: { taskId: cleanupTaskId, targetType: 'Amazon SQS queue', targetName: 'sqs-beginner-test' },
    taskCleanup: {
      taskId: cleanupTaskId,
      steps: [
        { id: 'cleanup-1', stepNumber: 1, title: 'Open the target queue', instruction: 'Select sqs-beginner-test only.', description: 'Select sqs-beginner-test only.', verification: 'sqs-beginner-test is selected.', resourceKeys: [] },
        { id: 'cleanup-2', stepNumber: 2, title: 'Delete the approved queue', instruction: 'Choose Delete for sqs-beginner-test and confirm.', description: 'Choose Delete for sqs-beginner-test and confirm.', verification: 'Deletion was submitted for sqs-beginner-test.', resourceKeys: [] },
        { id: 'cleanup-3', stepNumber: 3, title: 'Verify removal', instruction: 'Refresh after deleting sqs-beginner-test.', description: 'Refresh after deleting sqs-beginner-test.', verification: 'sqs-beginner-test is no longer listed.', resourceKeys: [] }
      ]
    },
    programmeCleanup: { manualOnly: true, completionGate: 'acknowledgement', steps: [{ id: 'cleanup-final', stepNumber: 1, title: 'Manual cleanup acknowledgement', instruction: 'Record that cleanup is complete for sqs-beginner-test.', description: 'Record that cleanup is complete for sqs-beginner-test.', verification: 'The acknowledgement is recorded.', resourceKeys: [] }] },
    evidence: { cleanupSteps: [
      { scope: 'task', taskId: cleanupTaskId, cleanupStepId: 'cleanup-1', sourceUrls: [sourceUrl] },
      { scope: 'task', taskId: cleanupTaskId, cleanupStepId: 'cleanup-2', sourceUrls: [sourceUrl] },
      { scope: 'task', taskId: cleanupTaskId, cleanupStepId: 'cleanup-3', sourceUrls: [sourceUrl] },
      { scope: 'programme', taskId: null, cleanupStepId: 'cleanup-final', sourceUrls: [sourceUrl] }
    ], protectedSourceUrls: [sourceUrl] },
    futureCliBoundary: { prepared: false, guidancePreservedFromStage7: { [cleanupTaskId]: 'Future CLI cleanup only.' } },
    manualReviewFindings: ['Manual cleanup only.']
  };
  const session = { ...acceptedStageSeven.session, status: 'stage_8_ready_for_review', currentStep: 'local_stage_8_manual_cleanup_review', boundaries: { ...acceptedStageSeven.session.boundaries, authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8], stage8Prepared: true, stage9Prepared: false } };
  return { session, stageEight, stageSeven: acceptedStageSeven.stageSeven, stageSevenAcceptance: acceptedStageSeven.acceptance, stageSixInstructions, stageSixAcceptance, supportRecords };
}

test('Step 86A local Stage 8 human acceptance', async t => {
  await t.test('1. exact reviewed cleanup package receives a deterministic fingerprint', () => {
    const accepted = buildStage86ALocalAcceptance({ ...fixture(), now: () => new Date('2026-08-10T16:00:00.000Z') });
    assert.equal(accepted.acceptance.taskCleanupStepCount, 3);
    assert.equal(accepted.acceptance.programmeAcknowledgementCount, 1);
    assert.equal(accepted.acceptance.approvedCleanupTarget.targetName, 'sqs-beginner-test');
    assert.match(accepted.acceptance.stageEightFingerprint.value, /^[a-f0-9]{64}$/);
    assert.equal(verifyStage86AAcceptanceFingerprint(accepted.stageEight, accepted.acceptance), true);
  });

  await t.test('2. reviewed cleanup content remains exact', () => {
    const original = fixture();
    const accepted = buildStage86ALocalAcceptance(original);
    const { status, acceptedAt, acceptanceFingerprint, ...acceptedContent } = accepted.stageEight;
    const { status: oldStatus, ...originalContent } = original.stageEight;
    assert.equal(status, 'human_accepted');
    assert.equal(oldStatus, 'awaiting_human_stage_8_review');
    assert.ok(acceptedAt);
    assert.equal(acceptanceFingerprint.value, accepted.acceptance.stageEightFingerprint.value);
    assert.deepEqual(acceptedContent, originalContent);
    assert.equal(accepted.acceptance.stagesOneToSevenChanged, false);
  });

  await t.test('3. changed target, step count or evidence stops acceptance', () => {
    const target = fixture();
    target.stageEight.approvedCleanupTarget.targetName = 'another-queue';
    assert.throws(() => validateStage86AAcceptanceInputs(target), /sqs-beginner-test cleanup boundary/);
    const steps = fixture();
    steps.stageEight.taskCleanup.steps.pop();
    assert.throws(() => validateStage86AAcceptanceInputs(steps), /exactly three task cleanup steps/);
    const evidence = fixture();
    evidence.stageEight.evidence.cleanupSteps.pop();
    assert.throws(() => validateStage86AAcceptanceInputs(evidence), /matching protected AWS evidence/);
  });

  await t.test('4. changed accepted Stage 7 or unlocked Stage 9 stops acceptance', () => {
    const changed = fixture();
    changed.stageSeven.tasks[0].verification[0].title = 'Changed';
    assert.throws(() => validateStage86AAcceptanceInputs(changed), /Stage 7 fingerprint no longer matches/);
    const unlocked = fixture();
    unlocked.session.boundaries.stage9Prepared = true;
    assert.throws(() => validateStage86AAcceptanceInputs(unlocked), /safety boundary changed/);
  });

  await t.test('5. later cleanup change breaks the recorded fingerprint', () => {
    const accepted = buildStage86ALocalAcceptance(fixture());
    accepted.stageEight.taskCleanup.steps[0].instruction = 'Changed later.';
    assert.equal(verifyStage86AAcceptanceFingerprint(accepted.stageEight, accepted.acceptance), false);
  });

  await t.test('6. save writes only accepted Stage 8 metadata, audit and session state', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step86a-'));
    try {
      const original = fixture();
      const accepted = buildStage86ALocalAcceptance({ ...original, now: () => new Date('2026-08-10T16:05:00.000Z') });
      const savedSession = await saveAuthorAssistantSession({ sessionRoot: root, session: original.session, researchRequest: buildAwsResearchRequest({ ...original.session, status: 'input_complete' }) });
      await writeFile(path.join(savedSession.sessionDirectory, 'author-stage-8-cleanup.json'), `${JSON.stringify(original.stageEight, null, 2)}\n`, 'utf8');
      const preservedPath = path.join(savedSession.sessionDirectory, 'author-stage-7-resources-checks.json');
      const preservedText = `${JSON.stringify(original.stageSeven, null, 2)}\n`;
      await writeFile(preservedPath, preservedText, 'utf8');
      const saved = await saveAuthorAssistantStage86AAcceptance({ sessionRoot: root, existingSession: original.session, acceptedSession: accepted.session, existingStageEight: original.stageEight, acceptedStageEight: accepted.stageEight, acceptance: accepted.acceptance });
      const loaded = await loadAuthorAssistantSession(root, sessionId);
      assert.equal(loaded.session.status, 'stage_8_accepted');
      assert.equal(loaded.session.boundaries.stage8Accepted, true);
      assert.equal(loaded.session.boundaries.stage9Prepared, false);
      assert.equal(loaded.stageEightCleanup.status, 'human_accepted');
      assert.equal(await readFile(preservedPath, 'utf8'), preservedText);
      const audit = JSON.parse(await readFile(saved.acceptancePath, 'utf8'));
      assert.equal(audit.taskCleanupStepCount, 3);
      assert.equal(audit.programmeAcknowledgementCount, 1);
      assert.equal(audit.beganStage9, false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('7. acceptance command has no AI, API-key or external write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/applyStage86A.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|requestStageEightCleanup|@supabase|aws-sdk/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:apply-86a'], 'node scripts/author-assistant/applyStage86A.mjs');
  });
});
