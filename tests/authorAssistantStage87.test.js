import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildStageNineAuthoringCheck, composeStageNineDraft, validateStage87Inputs } from '../scripts/author-assistant/authorAssistantAuthoringCheck.mjs';
import { saveAuthorAssistantStageNineCheck } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step87-test';
const taskId = 'task-sqs-review-queue-deletion-effects-006';
const sourceId = 'source-sqs-delete';
const sourceUrl = 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/step-delete-queue.html';

function fixture({ damagedText = false } = {}) {
  const acceptedSources = { sessionId, status: 'accepted', sources: [{ documentTitle: 'Delete queue', url: sourceUrl }] };
  const blueprint = {
    sessionId,
    status: 'human_accepted',
    programme: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS', displayName: 'SQS Test', subtitle: 'Queue basics', description: 'Build a test queue.', learningOutcome: 'Build and test a queue safely.', category: 'Application Integration', difficulty: 'Beginner', regionScope: 'regional', defaultRegion: 'eu-west-2', estimatedMinutes: 10 },
    phases: [{ id: 'phase-1', phaseNumber: 1, title: 'Test', description: 'Create and test.', taskIds: [taskId], isOptional: false }],
    tasks: [{ id: taskId, title: 'Review queue deletion effects', service: 'Amazon Simple Queue Service', feature: 'Queue lifecycle', goal: 'Review cleanup.', whyItMatters: 'Avoid leftover resources.', difficulty: 'Easy', estimatedMinutes: 10, region: 'eu-west-2', phaseId: 'phase-1', prerequisites: [], isOptional: false, sourceIds: [sourceId] }],
    sources: [{ id: sourceId, title: 'Delete queue', url: sourceUrl, publisher: 'AWS', sourceType: 'official_documentation', purpose: 'Supports queue cleanup.', taskIds: [taskId] }]
  };
  const blueprintAcceptance = { sessionId, status: 'accepted' };
  const sourceAmendment84B = { sessionId, status: 'applied_locally' };
  const consistencyCorrection84C = { sessionId, status: 'applied_locally' };
  const stageSix = {
    sessionId,
    status: 'human_accepted',
    tasks: [{ taskId, title: 'Review queue deletion effects', modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'not_applicable', reason: 'Future CLI path only.' } }, consoleSteps: [{ id: 'console-1', stepNumber: 1, title: 'Review lifecycle', instruction: 'Review deletion.', instructions: [{ id: 'instruction-1', text: damagedText ? 'Review the queueâ€™s lifecycle.' : 'Review the queue lifecycle.', detail: '' }], expectedResult: 'The deletion effect is understood.', warning: '', sourceIds: [sourceId] }], cliSteps: [] }],
    protectedSourceUrlsUsed: [sourceUrl],
    manualReviewFindings: ['An exact least-privilege policy must not be inferred. Use access already authorized by an administrator.'],
    boundaryAlignment: { futureCliGuidance: { [taskId]: 'Future CLI guidance remains separate.' } }
  };
  const stageSixFingerprint = fingerprintJson({ tasks: stageSix.tasks, protectedSourceUrlsUsed: stageSix.protectedSourceUrlsUsed, manualReviewFindings: stageSix.manualReviewFindings, boundaryAlignment: stageSix.boundaryAlignment });
  stageSix.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageSixFingerprint };
  const stageSixAcceptance = { sessionId, status: 'accepted', instructionFingerprint: { algorithm: 'sha256-json-v1', value: stageSixFingerprint } };
  const stageSeven = {
    sessionId,
    status: 'human_accepted',
    basedOnStage6Fingerprint: { algorithm: 'sha256-json-v1', value: stageSixFingerprint },
    stageBoundary: { preparedLocally: [7], notPrepared: [8, 9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} },
    tasks: [{ taskId, title: 'Review queue deletion effects', createdResourceKeys: [], verification: [{ id: 'verify-1', title: 'Verify understanding', instruction: 'Inspect the guidance.', expectedResult: 'The cleanup effect is clear.', mode: 'console' }] }],
    evidence: { resources: [], verifications: [{ taskId, verificationId: 'verify-1', sourceUrls: [sourceUrl] }], protectedSourceUrls: [sourceUrl] },
    consoleBoundary: { verificationModes: ['console'], cliCommandsPrepared: false },
    futureCliBoundary: { prepared: false, guidancePreservedFromStage6: { [taskId]: 'Future CLI guidance remains separate.' } },
    manualReviewFindings: [...stageSix.manualReviewFindings]
  };
  const stageSevenFingerprint = fingerprintJson({ basedOnStage6Fingerprint: stageSeven.basedOnStage6Fingerprint, stageBoundary: stageSeven.stageBoundary, resources: stageSeven.resources, tasks: stageSeven.tasks, evidence: stageSeven.evidence, consoleBoundary: stageSeven.consoleBoundary, futureCliBoundary: stageSeven.futureCliBoundary, manualReviewFindings: stageSeven.manualReviewFindings });
  stageSeven.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageSevenFingerprint };
  const firstFive = { acceptedSources, blueprint, blueprintAcceptance, sourceAmendment84B, consistencyCorrection84C };
  const stageSevenAcceptance = { sessionId, status: 'accepted', stageSevenFingerprint: { algorithm: 'sha256-json-v1', value: stageSevenFingerprint }, supportingRecordFingerprints: { ...Object.fromEntries(Object.entries(firstFive).map(([key, value]) => [key, fingerprintJson(value)])), stageSixInstructions: fingerprintJson(stageSix), stageSixAcceptance: fingerprintJson(stageSixAcceptance) } };
  const stageEight = {
    sessionId,
    status: 'human_accepted',
    basedOnStage7Fingerprint: { algorithm: 'sha256-json-v1', value: stageSevenFingerprint },
    stageBoundary: { preparedLocally: [8], notPrepared: [9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    approvedCleanupTarget: { taskId, targetType: 'Amazon SQS queue', targetName: 'sqs-beginner-test' },
    taskCleanup: { taskId, steps: [{ id: 'cleanup-1', stepNumber: 1, title: 'Delete test queue', instruction: 'Delete sqs-beginner-test.', verification: 'sqs-beginner-test is no longer listed.', resourceKeys: [] }] },
    programmeCleanup: { steps: [{ id: 'cleanup-final', stepNumber: 1, title: 'Cleanup acknowledgement', instruction: 'Record cleanup completion.', verification: 'Cleanup is recorded.', resourceKeys: [] }], completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' },
    evidence: { cleanupSteps: [{ cleanupStepId: 'cleanup-1', sourceUrls: [sourceUrl] }, { cleanupStepId: 'cleanup-final', sourceUrls: [sourceUrl] }], protectedSourceUrls: [sourceUrl] },
    futureCliBoundary: { prepared: false },
    manualReviewFindings: [...stageSix.manualReviewFindings]
  };
  const stageEightContent = { basedOnStage7Fingerprint: stageEight.basedOnStage7Fingerprint, stageBoundary: stageEight.stageBoundary, approvedCleanupTarget: stageEight.approvedCleanupTarget, taskCleanup: stageEight.taskCleanup, programmeCleanup: stageEight.programmeCleanup, evidence: stageEight.evidence, futureCliBoundary: stageEight.futureCliBoundary, manualReviewFindings: stageEight.manualReviewFindings };
  const stageEightFingerprint = fingerprintJson(stageEightContent);
  stageEight.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageEightFingerprint };
  const stageEightAcceptance = { sessionId, status: 'accepted', approvalStep: '86A', stageEightFingerprint: { algorithm: 'sha256-json-v1', value: stageEightFingerprint }, supportingRecordFingerprints: { ...stageSevenAcceptance.supportingRecordFingerprints, stageSeven: fingerprintJson(stageSeven), stageSevenAcceptance: fingerprintJson(stageSevenAcceptance) } };
  const session = { sessionId, status: 'stage_8_accepted', inputs: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS' }, boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8], stage8Accepted: true, stage9Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false, candidatePrepared: false, published: false } };
  return { session, acceptedSources, blueprint, blueprintAcceptance, sourceAmendment84B, consistencyCorrection84C, stageSix, stageSixAcceptance, stageSeven, stageSevenAcceptance, stageEight, stageEightAcceptance };
}

test('Step 87 local Author Stage 9 check', async t => {
  await t.test('1. exact accepted Stages 1-8 package passes Author checks', () => {
    const document = buildStageNineAuthoringCheck(fixture(), { now: () => new Date('2026-08-10T18:00:00Z') });
    assert.equal(document.status, 'passed_awaiting_human_review');
    assert.equal(document.summary.passed, true);
    assert.equal(document.summary.taskCount, 1);
    assert.equal(document.summary.checkboxCount, 1);
    assert.equal(document.summary.verificationCheckCount, 1);
    assert.equal(document.summary.cleanupItemCount, 2);
    assert.equal(document.checks.iamLimitation.active, true);
  });

  await t.test('2. temporary Author-shaped draft preserves accepted content counts', () => {
    const draft = composeStageNineDraft(fixture());
    assert.equal(draft.tasks[0].consoleSteps[0].instructions[0].text, 'Review the queue lifecycle.');
    assert.equal(draft.tasks[0].verification.length, 1);
    assert.equal(draft.tasks[0].cleanup.length, 1);
    assert.equal(draft.cleanup.steps.length, 1);
  });

  await t.test('3. damaged text encoding is reported as a correction', () => {
    const document = buildStageNineAuthoringCheck(fixture({ damagedText: true }));
    assert.equal(document.status, 'needs_correction');
    assert.equal(document.checks.encoding.valid, false);
    assert.match(document.errors[0].message, /damaged text encoding/);
  });

  await t.test('4. changed accepted content or unlocked Stage 9 stops the check', () => {
    const changed = fixture();
    changed.stageEight.taskCleanup.steps[0].title = 'Changed';
    assert.throws(() => validateStage87Inputs(changed), /Stage 8 fingerprint no longer matches/);
    const unlocked = fixture();
    unlocked.session.boundaries.stage9Prepared = true;
    assert.throws(() => validateStage87Inputs(unlocked), /safety boundary changed/);
  });

  await t.test('5. save writes only Stage 9 report, preview and session state', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step87-'));
    try {
      const inputs = fixture();
      const directory = path.join(root, sessionId);
      await mkdir(directory);
      const preserved = `${JSON.stringify(inputs.stageEight, null, 2)}\n`;
      await writeFile(path.join(directory, 'author-stage-8-cleanup.json'), preserved, 'utf8');
      const document = buildStageNineAuthoringCheck(inputs);
      const saved = await saveAuthorAssistantStageNineCheck({ sessionRoot: root, existingSession: inputs.session, document, previewText: 'preview', now: () => new Date('2026-08-10T18:05:00Z') });
      assert.equal(JSON.parse(await readFile(saved.documentPath, 'utf8')).kind, 'author_stage_9_local_authoring_check');
      assert.equal(await readFile(saved.previewPath, 'utf8'), 'preview');
      assert.equal(await readFile(path.join(directory, 'author-stage-8-cleanup.json'), 'utf8'), preserved);
      const names = await readdir(directory);
      assert.deepEqual(names.sort(), ['author-stage-8-cleanup.json', 'author-stage-9-authoring-check.json', 'author-stage-9-authoring-check.txt', 'session.json']);
      const session = JSON.parse(await readFile(path.join(directory, 'session.json'), 'utf8'));
      assert.equal(session.boundaries.stage9Prepared, true);
      assert.equal(session.boundaries.stage10Prepared, false);
      assert.equal(session.boundaries.authorDraftWritten, false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('6. Stage 9 command has no AI, API key, AWS, Supabase or Author write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/prepareStage87.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|@supabase|aws-sdk|saveAuthorDraft/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:stage-87'], 'node scripts/author-assistant/prepareStage87.mjs');
  });
});
