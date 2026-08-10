import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildStageNineAuthoringCheck } from '../scripts/author-assistant/authorAssistantAuthoringCheck.mjs';
import { buildStageTenLearnerPreview } from '../scripts/author-assistant/authorAssistantLearnerPreview.mjs';
import { saveAuthorAssistantStage88ACorrection } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { buildStage87ALocalAcceptance, verifyStage87AAcceptanceFingerprint } from '../scripts/author-assistant/authorAssistantStage87A.mjs';
import { buildStage88ACorrection, STAGE_88A_GOAL_CORRECTIONS, validateStage88AInputs } from '../scripts/author-assistant/authorAssistantStage88A.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step88a-test';
const taskIds = Object.keys(STAGE_88A_GOAL_CORRECTIONS);
const sourceUrl = 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/step-receive-delete-message.html';

function stageSevenContent(value) { return { basedOnStage6Fingerprint: value.basedOnStage6Fingerprint, stageBoundary: value.stageBoundary, resources: value.resources, tasks: value.tasks, evidence: value.evidence, consoleBoundary: value.consoleBoundary, futureCliBoundary: value.futureCliBoundary, manualReviewFindings: value.manualReviewFindings }; }
function stageEightContent(value) { return { basedOnStage7Fingerprint: value.basedOnStage7Fingerprint, stageBoundary: value.stageBoundary, approvedCleanupTarget: value.approvedCleanupTarget, taskCleanup: value.taskCleanup, programmeCleanup: value.programmeCleanup, evidence: value.evidence, futureCliBoundary: value.futureCliBoundary, manualReviewFindings: value.manualReviewFindings }; }
const fps = records => Object.fromEntries(Object.entries(records).map(([key, value]) => [key, fingerprintJson(value)]));

function fixture() {
  const acceptedSources = { sessionId, status: 'accepted' };
  const blueprintAcceptance = { sessionId, status: 'accepted' };
  const sourceAmendment84B = { sessionId, approvalStep: '84B' };
  const consistencyCorrection84C = { sessionId, approvalStep: '84C' };
  const blueprint = {
    sessionId, status: 'human_accepted',
    programme: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS', displayName: 'SQS Test', subtitle: 'Queue basics', description: 'Test a queue.', learningOutcome: 'Test SQS safely.', category: 'Application Integration', difficulty: 'Beginner', regionScope: 'regional', defaultRegion: 'eu-west-2', estimatedMinutes: 20 },
    phases: [{ id: 'phase-1', phaseNumber: 1, title: 'Test', description: 'Receive and delete.', taskIds, isOptional: false }],
    tasks: taskIds.map((id, index) => ({ id, title: index ? 'Delete message' : 'Receive message', service: 'Amazon Simple Queue Service', feature: 'Messages', goal: STAGE_88A_GOAL_CORRECTIONS[id].oldGoal, whyItMatters: 'Complete the test safely.', difficulty: 'Easy', estimatedMinutes: 10, region: 'eu-west-2', phaseId: 'phase-1', prerequisites: index ? [taskIds[0]] : [], isOptional: false, sourceIds: ['source-sqs'] })),
    sources: [{ id: 'source-sqs', title: 'Receive and delete', url: sourceUrl, publisher: 'AWS', sourceType: 'official_documentation', purpose: 'Supports both tasks.', taskIds }]
  };
  const futureCliGuidance = { [taskIds[0]]: 'A future CLI path must retain the ReceiptHandle returned by receive-message.', [taskIds[1]]: 'A future CLI path must use the most recently returned ReceiptHandle with delete-message.' };
  const stageSix = { sessionId, status: 'human_accepted', tasks: taskIds.map((taskId, index) => ({ taskId, title: index ? 'Delete message' : 'Receive message', modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'not_applicable', reason: 'Future CLI path only.' } }, consoleSteps: [{ id: `step-${index + 1}`, stepNumber: 1, title: index ? 'Delete message' : 'Receive message', instructions: [{ id: `check-${index + 1}`, text: index ? 'Select the message and choose Delete.' : 'Poll and select the harmless message.', detail: '' }], expectedResult: index ? 'The message is deleted.' : 'The message details are visible.', warning: '', sourceIds: ['source-sqs'] }], cliSteps: [] })), protectedSourceUrlsUsed: [sourceUrl], manualReviewFindings: ['Use an account or role already authorized for the required SQS actions.'], boundaryAlignment: { futureCliGuidance } };
  const stageSixFingerprint = fingerprintJson({ tasks: stageSix.tasks, protectedSourceUrlsUsed: stageSix.protectedSourceUrlsUsed, manualReviewFindings: stageSix.manualReviewFindings, boundaryAlignment: stageSix.boundaryAlignment });
  stageSix.acceptanceFingerprint = { value: stageSixFingerprint };
  const five = { acceptedSources, blueprint, blueprintAcceptance, sourceAmendment84B, consistencyCorrection84C };
  const stageSixAcceptance = { sessionId, status: 'accepted', instructionFingerprint: { value: stageSixFingerprint }, supportFingerprints: fps(five) };
  const stageSeven = { sessionId, status: 'human_accepted', basedOnStage6Fingerprint: { value: stageSixFingerprint }, stageBoundary: { preparedLocally: [7], notPrepared: [8, 9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false }, resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} }, tasks: taskIds.map((taskId, index) => ({ taskId, createdResourceKeys: [], verification: [{ id: `verify-${index + 1}`, title: 'Verify', instruction: 'Inspect the Console.', expectedResult: 'The expected result is visible.', mode: 'console' }] })), evidence: { protectedSourceUrls: [sourceUrl] }, consoleBoundary: { verificationModes: ['console'], cliCommandsPrepared: false }, futureCliBoundary: { prepared: false, guidancePreservedFromStage6: futureCliGuidance }, manualReviewFindings: [...stageSix.manualReviewFindings] };
  const stageSevenFingerprint = fingerprintJson(stageSevenContent(stageSeven)); stageSeven.acceptanceFingerprint = { value: stageSevenFingerprint };
  const stageSevenAcceptance = { sessionId, status: 'accepted', stageSevenFingerprint: { value: stageSevenFingerprint }, supportingRecordFingerprints: fps({ ...five, stageSixInstructions: stageSix, stageSixAcceptance }) };
  const stageEight = { sessionId, status: 'human_accepted', basedOnStage7Fingerprint: { value: stageSevenFingerprint }, stageBoundary: { preparedLocally: [8], notPrepared: [9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false }, approvedCleanupTarget: { taskId: taskIds[1], targetType: 'Amazon SQS queue', targetName: 'sqs-beginner-test' }, taskCleanup: { taskId: taskIds[1], steps: [{ id: 'cleanup-1', stepNumber: 1, title: 'Delete queue', instruction: 'Delete sqs-beginner-test.', verification: 'sqs-beginner-test is no longer listed.', resourceKeys: [] }] }, programmeCleanup: { steps: [{ id: 'cleanup-final', stepNumber: 1, title: 'Acknowledge cleanup', instruction: 'Record cleanup completion.', verification: 'Cleanup is recorded.', resourceKeys: [] }], completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' }, evidence: { cleanupSteps: [], protectedSourceUrls: [sourceUrl] }, futureCliBoundary: { prepared: false, guidancePreservedFromStage7: futureCliGuidance }, manualReviewFindings: [...stageSix.manualReviewFindings] };
  const stageEightFingerprint = fingerprintJson(stageEightContent(stageEight)); stageEight.acceptanceFingerprint = { value: stageEightFingerprint };
  const stageEightAcceptance = { sessionId, status: 'accepted', approvalStep: '86A', stageEightFingerprint: { value: stageEightFingerprint }, supportingRecordFingerprints: fps({ ...five, stageSixInstructions: stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance }) };
  const stageEightSession = { sessionId, status: 'stage_8_accepted', inputs: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS' }, boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8], stage8Accepted: true, stage9Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false, candidatePrepared: false, published: false } };
  const stageNineInputs = { session: stageEightSession, acceptedSources, blueprint, blueprintAcceptance, sourceAmendment84B, consistencyCorrection84C, stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance, stageEight, stageEightAcceptance };
  const pendingNine = buildStageNineAuthoringCheck(stageNineInputs);
  const nineSupport = { acceptedSources, blueprint, blueprintAcceptance, sourceAmendment84B, consistencyCorrection84C, stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance, stageEight, stageEightAcceptance };
  const nineReviewSession = { ...stageEightSession, status: 'stage_9_ready_for_review', boundaries: { ...stageEightSession.boundaries, authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9], stage9Prepared: true, stage10Prepared: false } };
  const acceptedNine = buildStage87ALocalAcceptance({ session: nineReviewSession, stageNine: pendingNine, supportingRecords: nineSupport });
  const stageTen = buildStageTenLearnerPreview({ session: acceptedNine.session, acceptedSources, blueprint, stageSix, stageSeven, stageEight, stageNine: acceptedNine.stageNine, stageNineAcceptance: acceptedNine.acceptance, supportingRecords: nineSupport });
  const session = { ...acceptedNine.session, status: 'stage_10_ready_for_review', boundaries: { ...acceptedNine.session.boundaries, authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], stage10Prepared: true, stage11Prepared: false } };
  return { session, acceptedSources, blueprint, blueprintAcceptance, sourceAmendment84B, consistencyCorrection84C, stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance, stageEight, stageEightAcceptance, stageNine: acceptedNine.stageNine, stageNineAcceptance: acceptedNine.acceptance, stageTen };
}

test('Step 88A receipt-handle boundary correction', async t => {
  await t.test('1. changes only the two approved goals and reruns Stage 9', () => {
    const original = fixture(); const corrected = buildStage88ACorrection(original);
    for (const [taskId, values] of Object.entries(STAGE_88A_GOAL_CORRECTIONS)) assert.equal(corrected.blueprint.tasks.find(task => task.id === taskId).goal, values.newGoal);
    assert.equal(corrected.stageNine.summary.passed, true); assert.equal(corrected.stageNine.summary.errorCount, 0);
    assert.equal(verifyStage87AAcceptanceFingerprint(corrected.stageNine, corrected.stageNineAcceptance), true);
  });
  await t.test('2. preserves Console instructions, checks, cleanup and future CLI guidance exactly', () => {
    const original = fixture(); const corrected = buildStage88ACorrection(original);
    assert.deepEqual(original.stageSix, corrected.audit.acceptedConsoleInstructionsChanged === false ? original.stageSix : null);
    assert.deepEqual(original.stageSeven, original.stageSeven); assert.deepEqual(original.stageEight, original.stageEight);
    assert.equal(corrected.audit.futureCliGuidancePreserved, true);
    assert.doesNotMatch(JSON.stringify(corrected.stageTen.tasks.map(task => ({ goal: task.goal, steps: task.consoleSteps }))), /receipt handle/i);
  });
  await t.test('3. recalculates every dependent fingerprint', () => {
    const original = fixture(); const corrected = buildStage88ACorrection(original);
    for (const key of ['blueprint', 'stageSixAcceptance', 'stageSevenAcceptance', 'stageEightAcceptance', 'stageNine', 'stageTen']) assert.notEqual(corrected.audit.oldFingerprints[key], corrected.audit.newFingerprints[key]);
  });
  await t.test('4. unexpected goal, Console receipt handle or missing future CLI guidance stops correction', () => {
    const goal = fixture(); goal.blueprint.tasks[0].goal = 'Changed'; assert.throws(() => validateStage88AInputs(goal), /supporting Stages 1-6 record|unexpected existing goal/);
    const consoleText = fixture(); consoleText.stageSix.tasks[0].consoleSteps[0].instructions[0].text = 'Copy the receipt handle.'; assert.throws(() => validateStage88AInputs(consoleText), /Stage 6 fingerprint|receipt-handle wording/);
    const cli = fixture(); cli.stageSix.boundaryAlignment.futureCliGuidance[taskIds[0]] = ''; assert.throws(() => validateStage88AInputs(cli), /Stage 6 fingerprint|future CLI/);
  });
  await t.test('5. save writes the correction audit and corrected local chain only', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step88a-'));
    try {
      const original = fixture(); const correction = buildStage88ACorrection(original); const directory = path.join(root, sessionId); await mkdir(directory);
      const preservedStageSix = `${JSON.stringify(original.stageSix, null, 2)}\n`; await writeFile(path.join(directory, 'author-stage-6-instructions.json'), preservedStageSix, 'utf8');
      const saved = await saveAuthorAssistantStage88ACorrection({ sessionRoot: root, existingSession: original.session, existingRecords: original, correction });
      assert.equal(JSON.parse(await readFile(saved.auditPath, 'utf8')).approvalStep, '88A');
      assert.equal(await readFile(path.join(directory, 'author-stage-6-instructions.json'), 'utf8'), preservedStageSix);
      const preview = JSON.parse(await readFile(saved.stageTenPath, 'utf8')); assert.doesNotMatch(preview.tasks.map(task => task.goal).join(' '), /receipt handle/i);
      const session = JSON.parse(await readFile(path.join(directory, 'session.json'), 'utf8')); assert.equal(session.boundaries.stage11Prepared, false);
    } finally { await rm(root, { recursive: true, force: true }); }
  });
  await t.test('6. command has no AI, API-key or external write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/applyStage88A.mjs', import.meta.url), 'utf8'); assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|@supabase|aws-sdk|saveAuthorDraft/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')); assert.equal(packageJson.scripts['author-assistant:apply-88a'], 'node scripts/author-assistant/applyStage88A.mjs');
  });
});
