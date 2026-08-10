import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAwsResearchRequest,
  loadAuthorAssistantSession,
  saveAuthorAssistantSession,
  saveAuthorAssistantStage85BAcceptance
} from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildStage85BLocalAcceptance,
  validateStage85BAcceptanceInputs,
  verifyStage85BAcceptanceFingerprint
} from '../scripts/author-assistant/authorAssistantStage85B.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step85b-test';
const sourceUrls = Array.from({ length: 6 }, (_, index) => `https://docs.aws.amazon.com/sqs/console-${index + 1}.html`);

function fixture() {
  const supportRecords = {
    acceptedSources: { schemaVersion: 1, status: 'accepted', sessionId, sources: sourceUrls.map(url => ({ url })) },
    blueprint: { schemaVersion: 1, status: 'human_accepted', sessionId, tasks: Array.from({ length: 6 }, (_, index) => ({ id: `task-${index + 1}` })) },
    blueprintAcceptance: { schemaVersion: 1, status: 'accepted', sessionId },
    sourceAmendment84B: { schemaVersion: 1, status: 'applied_locally', approvalStep: '84B', sessionId },
    consistencyCorrection84C: { schemaVersion: 1, status: 'applied_locally', approvalStep: '84C', sessionId }
  };
  const stageSixInstructions = {
    schemaVersion: 1,
    status: 'human_accepted',
    sessionId,
    tasks: Array.from({ length: 6 }, (_, index) => ({ taskId: `task-${index + 1}`, consoleSteps: [] })),
    protectedSourceUrlsUsed: sourceUrls,
    manualReviewFindings: ['Preserve safety review.'],
    boundaryAlignment: { futureCliGuidance: { 'task-4': 'Future CLI guidance only.' } }
  };
  const stageSixFingerprintContent = {
    tasks: stageSixInstructions.tasks,
    protectedSourceUrlsUsed: stageSixInstructions.protectedSourceUrlsUsed,
    manualReviewFindings: stageSixInstructions.manualReviewFindings,
    boundaryAlignment: stageSixInstructions.boundaryAlignment
  };
  const stageSixFingerprint = fingerprintJson(stageSixFingerprintContent);
  stageSixInstructions.acceptanceFingerprint = { algorithm: 'sha256-json-v1', value: stageSixFingerprint };
  const stageSixAcceptance = {
    schemaVersion: 1,
    status: 'accepted',
    approvalStep: '84D',
    sessionId,
    instructionFingerprint: { algorithm: 'sha256-json-v1', value: stageSixFingerprint },
    supportFingerprints: Object.fromEntries(Object.entries(supportRecords).map(([key, value]) => [key, fingerprintJson(value)]))
  };
  const checksPerTask = [2, 1, 1, 1, 1, 1];
  const tasks = checksPerTask.map((count, taskIndex) => ({
    taskId: `task-${taskIndex + 1}`,
    title: `Task ${taskIndex + 1}`,
    createdResourceKeys: [],
    verification: Array.from({ length: count }, (_, checkIndex) => ({
      id: `verify-${taskIndex + 1}-${checkIndex + 1}`,
      title: `Check ${taskIndex + 1}.${checkIndex + 1}`,
      instruction: `Inspect task ${taskIndex + 1}.`,
      expectedResult: `Task ${taskIndex + 1} is visible.`,
      mode: 'console'
    }))
  }));
  const verificationEvidence = tasks.flatMap((task, taskIndex) => task.verification.map(check => ({ taskId: task.taskId, verificationId: check.id, sourceUrls: [sourceUrls[taskIndex]] })));
  const stageSeven = {
    schemaVersion: 1,
    kind: 'author_stage_7_local_resources_checks',
    status: 'awaiting_human_stage_7_review',
    sessionId,
    responseId: 'response-85',
    model: 'test-model',
    generatedAt: '2026-08-10T13:00:00.000Z',
    basedOnStage6Fingerprint: { algorithm: 'sha256-json-v1', value: stageSixFingerprint },
    stageBoundary: { preparedLocally: [7], notPrepared: [8, 9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} },
    tasks,
    evidence: { resources: [], verifications: verificationEvidence, protectedSourceUrls: sourceUrls },
    consoleBoundary: { verificationModes: ['console'], cliCommandsPrepared: false },
    futureCliBoundary: { prepared: false, guidancePreservedFromStage6: { 'task-4': 'Future CLI guidance only.' } },
    manualReviewFindings: ['Preserve safety review.']
  };
  const session = {
    schemaVersion: 1,
    sessionId,
    status: 'stage_7_ready_for_review',
    currentStep: 'local_stage_7_resources_checks_review',
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-08-10T13:00:00.000Z',
    inputs: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS', learnerLevel: 'Beginner', buildOutcome: 'Build and test a queue', preferredRegion: 'eu-west-2' },
    boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7], authorDraftWritten: false, stage6Prepared: true, stage6Accepted: true, stage7Prepared: true, stage8Prepared: false, awsConnected: false, supabaseConnected: false, candidatePrepared: false, published: false }
  };
  return { session, stageSeven, stageSixInstructions, stageSixAcceptance, supportRecords };
}

test('Step 85B local Stage 7 human acceptance', async t => {
  await t.test('1. reviewed six-task, seven-check, zero-resource package is accepted', () => {
    const accepted = buildStage85BLocalAcceptance({ ...fixture(), now: () => new Date('2026-08-10T14:00:00.000Z') });
    assert.equal(accepted.acceptance.taskCount, 6);
    assert.equal(accepted.acceptance.verificationCount, 7);
    assert.equal(accepted.acceptance.resourceCount, 0);
    assert.match(accepted.acceptance.stageSevenFingerprint.value, /^[a-f0-9]{64}$/);
    assert.equal(verifyStage85BAcceptanceFingerprint(accepted.stageSeven, accepted.acceptance), true);
  });

  await t.test('2. all reviewed Stage 7 content remains exact', () => {
    const original = fixture();
    const accepted = buildStage85BLocalAcceptance(original);
    const { status, acceptedAt, acceptanceFingerprint, ...acceptedContent } = accepted.stageSeven;
    const { status: oldStatus, ...originalContent } = original.stageSeven;
    assert.equal(status, 'human_accepted');
    assert.equal(oldStatus, 'awaiting_human_stage_7_review');
    assert.ok(acceptedAt);
    assert.equal(acceptanceFingerprint.value, accepted.acceptance.stageSevenFingerprint.value);
    assert.deepEqual(acceptedContent, originalContent);
    assert.equal(accepted.acceptance.stagesOneToSixChanged, false);
  });

  await t.test('3. changed checks, added resources or missing evidence stop acceptance', () => {
    const changed = fixture();
    changed.stageSeven.tasks[0].verification[0].instruction = '';
    assert.throws(() => validateStage85BAcceptanceInputs(changed), /complete Console check/);

    const resource = fixture();
    resource.stageSeven.resources.schema.push({ key: 'unexpected' });
    assert.throws(() => validateStage85BAcceptanceInputs(resource), /zero resource values/);

    const evidence = fixture();
    evidence.stageSeven.evidence.verifications.pop();
    assert.throws(() => validateStage85BAcceptanceInputs(evidence), /matching protected AWS source evidence/);
  });

  await t.test('4. changed Stage 6 fingerprint or unlocked Stage 8 stops acceptance', () => {
    const changed = fixture();
    changed.stageSixInstructions.tasks[0].consoleSteps.push({ id: 'changed' });
    assert.throws(() => validateStage85BAcceptanceInputs(changed), /Stage 6 fingerprint no longer matches/);

    const unlocked = fixture();
    unlocked.session.boundaries.stage8Prepared = true;
    assert.throws(() => validateStage85BAcceptanceInputs(unlocked), /safety boundary changed/);
  });

  await t.test('5. a later content change breaks the recorded Stage 7 fingerprint', () => {
    const accepted = buildStage85BLocalAcceptance(fixture());
    accepted.stageSeven.tasks[1].verification[0].expectedResult = 'Changed later.';
    assert.equal(verifyStage85BAcceptanceFingerprint(accepted.stageSeven, accepted.acceptance), false);
  });

  await t.test('6. save writes only accepted Stage 7 metadata, audit and session state', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step85b-'));
    try {
      const original = fixture();
      const accepted = buildStage85BLocalAcceptance({ ...original, now: () => new Date('2026-08-10T14:05:00.000Z') });
      const savedSession = await saveAuthorAssistantSession({ sessionRoot: root, session: original.session, researchRequest: buildAwsResearchRequest({ ...original.session, status: 'input_complete' }) });
      await writeFile(path.join(savedSession.sessionDirectory, 'author-stage-7-resources-checks.json'), `${JSON.stringify(original.stageSeven, null, 2)}\n`, 'utf8');
      const preservedPath = path.join(savedSession.sessionDirectory, 'accepted-sources.json');
      const preservedText = `${JSON.stringify(original.supportRecords.acceptedSources, null, 2)}\n`;
      await writeFile(preservedPath, preservedText, 'utf8');
      const saved = await saveAuthorAssistantStage85BAcceptance({
        sessionRoot: root,
        existingSession: original.session,
        acceptedSession: accepted.session,
        existingStageSeven: original.stageSeven,
        acceptedStageSeven: accepted.stageSeven,
        acceptance: accepted.acceptance
      });
      const loaded = await loadAuthorAssistantSession(root, sessionId);
      assert.equal(loaded.session.status, 'stage_7_accepted');
      assert.equal(loaded.session.boundaries.stage7Accepted, true);
      assert.equal(loaded.session.boundaries.stage8Prepared, false);
      assert.equal(loaded.stageSevenResourcesChecks.status, 'human_accepted');
      assert.equal(await readFile(preservedPath, 'utf8'), preservedText);
      const audit = JSON.parse(await readFile(saved.acceptancePath, 'utf8'));
      assert.equal(audit.verificationCount, 7);
      assert.equal(audit.resourceCount, 0);
      assert.equal(audit.beganStage8, false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('7. acceptance command has no AI, API-key or external write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/applyStage85B.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|requestStageSevenResourcesChecks|@supabase|aws-sdk/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:apply-85b'], 'node scripts/author-assistant/applyStage85B.mjs');
  });
});
