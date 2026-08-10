import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildAwsResearchRequest, loadAuthorAssistantSession, saveAuthorAssistantSession } from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildStageEightDocument,
  buildStageEightPayload,
  formatStageEightPreview,
  requestStageEightCleanup,
  saveStageEightCleanup,
  validateStage86Inputs
} from '../scripts/author-assistant/authorAssistantCleanup.mjs';
import { buildStage85BLocalAcceptance } from '../scripts/author-assistant/authorAssistantStage85B.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step86-test';
const cleanupTaskId = 'task-sqs-review-queue-deletion-effects-006';
const cleanupUrl = 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/step-delete-queue.html';
const cleanupBoundary = { taskId: cleanupTaskId, targetType: 'Amazon SQS queue', targetName: 'sqs-beginner-test' };

function fixture() {
  const urls = Array.from({ length: 6 }, (_, index) => index === 5 ? cleanupUrl : `https://docs.aws.amazon.com/sqs/console-${index + 1}.html`);
  const taskIds = Array.from({ length: 6 }, (_, index) => index === 5 ? cleanupTaskId : `task-sqs-${index + 1}`);
  const blueprint = {
    schemaVersion: 1,
    status: 'human_accepted',
    sessionId,
    sources: urls.map((url, index) => ({ id: `source-${index + 1}`, title: `Source ${index + 1}`, url, taskIds: [taskIds[index]] })),
    tasks: taskIds.map((id, index) => ({ id, title: index === 5 ? 'Review queue deletion effects' : `Task ${index + 1}`, sourceIds: [`source-${index + 1}`] }))
  };
  const acceptedSources = { schemaVersion: 1, status: 'accepted', sessionId, sources: urls.map(url => ({ url })) };
  const supportRecords = {
    blueprintAcceptance: { schemaVersion: 1, status: 'accepted', sessionId },
    sourceAmendment84B: { schemaVersion: 1, status: 'applied_locally', approvalStep: '84B', sessionId },
    consistencyCorrection84C: { schemaVersion: 1, status: 'applied_locally', approvalStep: '84C', sessionId }
  };
  const stageSixInstructions = {
    schemaVersion: 1,
    status: 'human_accepted',
    sessionId,
    tasks: taskIds.map(taskId => ({ taskId, consoleSteps: [] })),
    protectedSourceUrlsUsed: urls,
    manualReviewFindings: ['Manual cleanup only.'],
    boundaryAlignment: {
      futureCliGuidance: { [cleanupTaskId]: 'A future CLI cleanup path may use delete-queue only in Stage 8.' },
      stage8CleanupGuidance: { [cleanupTaskId]: 'Actual manual queue deletion belongs to Stage 8.' }
    }
  };
  const stageSixContent = { tasks: stageSixInstructions.tasks, protectedSourceUrlsUsed: stageSixInstructions.protectedSourceUrlsUsed, manualReviewFindings: stageSixInstructions.manualReviewFindings, boundaryAlignment: stageSixInstructions.boundaryAlignment };
  const stageSixFingerprint = fingerprintJson(stageSixContent);
  stageSixInstructions.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageSixFingerprint };
  const stagesOneToSix = { acceptedSources, blueprint, ...supportRecords };
  const stageSixAcceptance = {
    schemaVersion: 1,
    status: 'accepted',
    approvalStep: '84D',
    sessionId,
    instructionFingerprint: { algorithm: 'sha256-json-v1', value: stageSixFingerprint },
    supportFingerprints: {
      acceptedSources: fingerprintJson(acceptedSources),
      blueprint: fingerprintJson(blueprint),
      blueprintAcceptance: fingerprintJson(supportRecords.blueprintAcceptance),
      sourceAmendment84B: fingerprintJson(supportRecords.sourceAmendment84B),
      consistencyCorrection84C: fingerprintJson(supportRecords.consistencyCorrection84C)
    }
  };
  const checksPerTask = [2, 1, 1, 1, 1, 1];
  const stageSevenPending = {
    schemaVersion: 1,
    kind: 'author_stage_7_local_resources_checks',
    status: 'awaiting_human_stage_7_review',
    sessionId,
    basedOnStage6Fingerprint: { algorithm: 'sha256-json-v1', value: stageSixFingerprint },
    stageBoundary: { preparedLocally: [7], notPrepared: [8, 9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} },
    tasks: taskIds.map((taskId, taskIndex) => ({
      taskId,
      title: blueprint.tasks[taskIndex].title,
      createdResourceKeys: [],
      verification: Array.from({ length: checksPerTask[taskIndex] }, (_, checkIndex) => ({ id: `verify-${taskIndex + 1}-${checkIndex + 1}`, title: `Check ${taskIndex + 1}.${checkIndex + 1}`, instruction: `Inspect task ${taskIndex + 1}.`, expectedResult: `Task ${taskIndex + 1} is visible.`, mode: 'console' }))
    })),
    evidence: {
      resources: [],
      verifications: taskIds.flatMap((taskId, taskIndex) => Array.from({ length: checksPerTask[taskIndex] }, (_, checkIndex) => ({ taskId, verificationId: `verify-${taskIndex + 1}-${checkIndex + 1}`, sourceUrls: [urls[taskIndex]] }))),
      protectedSourceUrls: urls
    },
    consoleBoundary: { verificationModes: ['console'], cliCommandsPrepared: false },
    futureCliBoundary: { prepared: false, guidancePreservedFromStage6: { ...stageSixInstructions.boundaryAlignment.futureCliGuidance } },
    manualReviewFindings: ['Manual cleanup only.']
  };
  const reviewSession = {
    schemaVersion: 1,
    sessionId,
    status: 'stage_7_ready_for_review',
    currentStep: 'local_stage_7_resources_checks_review',
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-08-10T13:00:00.000Z',
    inputs: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS', learnerLevel: 'Beginner', buildOutcome: 'Build and test a queue safely', preferredRegion: 'eu-west-2' },
    boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7], authorDraftWritten: false, stage6Prepared: true, stage6Accepted: true, stage7Prepared: true, stage8Prepared: false, awsConnected: false, supabaseConnected: false, candidatePrepared: false, published: false }
  };
  const stageSevenAccepted = buildStage85BLocalAcceptance({
    session: reviewSession,
    stageSeven: stageSevenPending,
    stageSixInstructions,
    stageSixAcceptance,
    supportRecords: stagesOneToSix,
    now: () => new Date('2026-08-10T14:00:00.000Z')
  });
  return {
    session: stageSevenAccepted.session,
    acceptedSources,
    blueprint,
    stageSixInstructions,
    stageSixAcceptance,
    stageSeven: stageSevenAccepted.stageSeven,
    stageSevenAcceptance: stageSevenAccepted.acceptance,
    supportRecords,
    cleanupBoundary: { ...cleanupBoundary }
  };
}

function proposal() {
  return {
    cleanupTaskId,
    taskCleanupSteps: [
      { title: 'Open the test queue', instruction: 'In Amazon SQS, select sqs-beginner-test.', verification: 'The details page for sqs-beginner-test is displayed.', sourceUrls: [cleanupUrl] },
      { title: 'Delete the test queue', instruction: 'Choose Delete for sqs-beginner-test and confirm the manual deletion.', verification: 'After refreshing the queue list, sqs-beginner-test is no longer listed.', sourceUrls: [cleanupUrl] }
    ],
    finalProgrammeAcknowledgement: { title: 'Acknowledge cleanup completion', instruction: 'Review the cleanup result and confirm the test environment is clean.', verification: 'The acknowledgement is recorded after sqs-beginner-test is no longer listed.', sourceUrls: [cleanupUrl] },
    manualReviewFindings: []
  };
}

function response(value = proposal(), sources = [cleanupUrl]) {
  return {
    id: 'response-stage86',
    output: [
      { type: 'web_search_call', action: { type: 'open_page', sources: sources.map(url => ({ url })) } },
      { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(value) }] }
    ]
  };
}

test('Step 86 local manual cleanup preparation', async t => {
  await t.test('1. accepted Stages 1-7 package and exact SQS target are required', () => {
    assert.deepEqual(validateStage86Inputs(fixture()), cleanupBoundary);
    const wrong = fixture();
    wrong.cleanupBoundary.targetName = 'another-queue';
    assert.throws(() => validateStage86Inputs(wrong), /approved only.*sqs-beginner-test/);
  });

  await t.test('2. request permits only task-linked protected Console cleanup sources', () => {
    const payload = buildStageEightPayload(fixture());
    const allowed = payload.text.format.schema.properties.taskCleanupSteps.items.properties.sourceUrls.items.enum;
    assert.deepEqual(allowed, [cleanupUrl]);
    assert.match(payload.instructions, /only AWS service resource.*sqs-beginner-test/i);
    assert.match(payload.instructions, /Do not create CLI commands/i);
    assert.match(payload.instructions, /Do not prepare Stage 9/i);
  });

  await t.test('3. proposal becomes Author-compatible separate manual cleanup steps', () => {
    const document = buildStageEightDocument(fixture(), proposal(), [cleanupUrl], { now: () => new Date('2026-08-10T15:00:00.000Z') });
    assert.equal(document.taskCleanup.taskId, cleanupTaskId);
    assert.equal(document.taskCleanup.steps.length, 2);
    assert.deepEqual(document.taskCleanup.steps.map(step => step.stepNumber), [1, 2]);
    assert.equal(document.taskCleanup.steps.every(step => step.resourceKeys.length === 0), true);
    assert.equal(document.programmeCleanup.steps.length, 1);
    assert.equal(document.programmeCleanup.manualOnly, true);
    assert.equal(document.futureCliBoundary.prepared, false);
    assert.deepEqual(document.stageBoundary.notPrepared, [9, 10, 11, 12]);
  });

  await t.test('4. broader deletion, missing target name and CLI commands are rejected', () => {
    const broad = proposal();
    broad.taskCleanupSteps[1].instruction = 'Delete all queues including sqs-beginner-test.';
    assert.throws(() => buildStageEightDocument(fixture(), broad, [cleanupUrl]), /outside the single approved queue/);
    const missingName = proposal();
    missingName.taskCleanupSteps[0].instruction = 'Open the queue.';
    missingName.taskCleanupSteps[0].verification = 'The details page is displayed.';
    assert.throws(() => buildStageEightDocument(fixture(), missingName, [cleanupUrl]), /must identify sqs-beginner-test/);
    const cli = proposal();
    cli.taskCleanupSteps[1].instruction = 'Run aws sqs delete-queue for sqs-beginner-test.';
    assert.throws(() => buildStageEightDocument(fixture(), cli, [cleanupUrl]), /must not contain.*CLI commands/);
  });

  await t.test('5. protected response remains local and retains the exact cleanup target', async () => {
    let requestBody;
    const document = await requestStageEightCleanup({
      ...fixture(),
      apiKey: 'test-key',
      fetchImpl: async (_url, options) => { requestBody = JSON.parse(options.body); return { ok: true, json: async () => response() }; }
    });
    assert.equal(requestBody.store, false);
    assert.equal(document.status, 'awaiting_human_stage_8_review');
    assert.equal(document.approvedCleanupTarget.targetName, 'sqs-beginner-test');
    assert.equal(document.stageBoundary.connectedToAws, false);
  });

  await t.test('6. one failed protected retry reports the exact missing cleanup source', async () => {
    let calls = 0;
    await assert.rejects(
      requestStageEightCleanup({
        ...fixture(),
        apiKey: 'test-key',
        fetchImpl: async () => ({ ok: true, json: async () => ++calls === 1 ? response(proposal(), []) : response({ checkedUrls: [] }, []) })
      }),
      /one targeted retry: https:\/\/docs\.aws\.amazon\.com\/AWSSimpleQueueService/
    );
    assert.equal(calls, 2);
  });

  await t.test('7. save writes only local Stage 8 review files and stops before Stage 9', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step86-'));
    try {
      const inputs = fixture();
      await saveAuthorAssistantSession({ sessionRoot: root, session: inputs.session, researchRequest: buildAwsResearchRequest({ ...inputs.session, status: 'input_complete' }) });
      const document = buildStageEightDocument(inputs, proposal(), [cleanupUrl]);
      const saved = await saveStageEightCleanup({ sessionRoot: root, existingSession: inputs.session, document, previewText: formatStageEightPreview(document), now: () => new Date('2026-08-10T15:05:00.000Z') });
      const loaded = await loadAuthorAssistantSession(root, sessionId);
      assert.equal(loaded.session.status, 'stage_8_ready_for_review');
      assert.equal(loaded.session.boundaries.stage8Prepared, true);
      assert.equal(loaded.session.boundaries.stage9Prepared, false);
      assert.equal(loaded.session.boundaries.authorDraftWritten, false);
      assert.equal(loaded.stageEightCleanup.status, 'awaiting_human_stage_8_review');
      assert.match(await readFile(saved.previewPath, 'utf8'), /Stage 9 prepared: no/);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('8. dedicated secure command has no Author, AWS or Supabase write path', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/prepareStage86.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /saveAuthorDraft\s*\(|from ['"]@supabase|from ['"]aws-sdk/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:stage-86:secure'], 'powershell -NoProfile -ExecutionPolicy Bypass -File scripts/author-assistant/startStage86.ps1');
  });
});
