import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAwsResearchRequest,
  loadAuthorAssistantSession,
  saveAuthorAssistantSession,
  saveAuthorAssistantStage84DAcceptance
} from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildStage84DLocalAcceptance,
  fingerprintJson,
  validateStage84DAcceptanceInputs,
  verifyStage84DAcceptanceFingerprint
} from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step84d-test';
const iamFinding = 'A least-privilege IAM policy document should be manually reviewed before inclusion.';

function session() {
  return {
    schemaVersion: 1,
    sessionId,
    status: 'stage_6_ready_for_review',
    currentStep: 'local_stage_6_instruction_review',
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-08-10T09:00:00.000Z',
    inputs: { serviceName: 'Amazon Simple Queue Service', shortName: 'SQS', learnerLevel: 'Beginner', buildOutcome: 'Build a safe queue', preferredRegion: 'eu-west-2' },
    boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6], authorDraftWritten: false, stage6Prepared: true, stage7Prepared: false, awsConnected: false, supabaseConnected: false, candidatePrepared: false, published: false }
  };
}

function acceptedSources() {
  return {
    schemaVersion: 1,
    status: 'accepted',
    sessionId,
    sources: Array.from({ length: 11 }, (_, index) => ({ url: `https://docs.aws.amazon.com/source-${index + 1}.html` })),
    manualReviewFindings: ['Historical Region finding.', iamFinding],
    manualReviewResolutions: [{ approvalStep: '84C', status: 'resolved', finding: 'Historical Region finding.' }]
  };
}

function blueprint() {
  return { schemaVersion: 1, status: 'human_accepted', sessionId, tasks: Array.from({ length: 6 }, (_, index) => ({ id: `task-${index + 1}` })) };
}

function instructions() {
  const checkboxCounts = [3, 5, 5, 6, 3, 2];
  return {
    schemaVersion: 1,
    kind: 'author_stage_6_local_instructions',
    status: 'awaiting_human_stage_6_review',
    sessionId,
    stageBoundary: { preparedLocally: [6], notPrepared: [7, 8, 9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    tasks: checkboxCounts.map((count, taskIndex) => ({
      taskId: `task-${taskIndex + 1}`,
      status: 'prepared',
      consoleSteps: [{
        id: `step-${taskIndex + 1}`,
        instructions: Array.from({ length: count }, (_, itemIndex) => ({
          id: `item-${taskIndex + 1}-${itemIndex + 1}`,
          text: taskIndex === 0 && itemIndex === 0 ? 'Use sqs-beginner-test.' : `Safe checkbox ${taskIndex + 1}.${itemIndex + 1}.`,
          detail: ''
        }))
      }],
      cliSteps: []
    })),
    protectedSourceUrlsUsed: ['https://docs.aws.amazon.com/source-1.html'],
    manualReviewFindings: [iamFinding],
    boundaryAlignment: { approvalStep: '84B', alignmentHistory: [{ approvalStep: '84A' }] }
  };
}

function records() {
  return {
    blueprintAcceptance: { schemaVersion: 1, status: 'accepted', sessionId },
    sourceAmendmentAudit: { schemaVersion: 1, status: 'applied_locally', approvalStep: '84B', sessionId },
    consistencyAudit: { schemaVersion: 1, status: 'applied_locally', approvalStep: '84C', sessionId, stage6Accepted: false }
  };
}

function inputs() {
  return { session: session(), acceptedSources: acceptedSources(), blueprint: blueprint(), instructions: instructions(), ...records() };
}

test('Step 84D local Stage 6 human acceptance', async t => {
  await t.test('1. complete content receives a deterministic SHA-256 fingerprint', () => {
    const accepted = buildStage84DLocalAcceptance({ ...inputs(), now: () => new Date('2026-08-10T12:00:00.000Z') });
    assert.equal(accepted.acceptance.taskCount, 6);
    assert.equal(accepted.acceptance.checkboxCount, 24);
    assert.match(accepted.acceptance.instructionFingerprint.value, /^[a-f0-9]{64}$/);
    assert.equal(verifyStage84DAcceptanceFingerprint(accepted.instructions, accepted.acceptance), true);
    assert.equal(fingerprintJson({ b: 2, a: 1 }), fingerprintJson({ a: 1, b: 2 }));
  });

  await t.test('2. all tasks and supporting content remain exact', () => {
    const original = inputs();
    const accepted = buildStage84DLocalAcceptance({ ...original });
    assert.deepEqual(accepted.instructions.tasks, original.instructions.tasks);
    assert.deepEqual(accepted.instructions.protectedSourceUrlsUsed, original.instructions.protectedSourceUrlsUsed);
    assert.deepEqual(accepted.instructions.manualReviewFindings, original.instructions.manualReviewFindings);
    assert.deepEqual(accepted.instructions.boundaryAlignment, original.instructions.boundaryAlignment);
    assert.equal(accepted.acceptance.supportRecordsChanged, false);
    assert.equal(accepted.session.boundaries.stage7Prepared, false);
    assert.equal(accepted.session.boundaries.authorDraftWritten, false);
  });

  await t.test('3. missing checkbox, unresolved Region or missing IAM warning blocks acceptance', () => {
    const missingCheckbox = inputs();
    missingCheckbox.instructions.tasks[0].consoleSteps[0].instructions.pop();
    assert.throws(() => validateStage84DAcceptanceInputs(missingCheckbox), /six prepared tasks and 24 checkboxes/);

    const unresolved = inputs();
    unresolved.acceptedSources.manualReviewResolutions = [];
    assert.throws(() => validateStage84DAcceptanceInputs(unresolved), /resolved Region-source finding/);

    const noIam = inputs();
    noIam.acceptedSources.manualReviewFindings = ['Historical Region finding.'];
    assert.throws(() => validateStage84DAcceptanceInputs(noIam), /active IAM warning/);
  });

  await t.test('4. a content change breaks the recorded fingerprint', () => {
    const accepted = buildStage84DLocalAcceptance({ ...inputs() });
    accepted.instructions.tasks[0].consoleSteps[0].instructions[0].text = 'Changed later.';
    assert.equal(verifyStage84DAcceptanceFingerprint(accepted.instructions, accepted.acceptance), false);
  });

  await t.test('5. acceptance save writes only accepted instructions, audit and session state', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step84d-'));
    try {
      const original = inputs();
      const accepted = buildStage84DLocalAcceptance({ ...original, now: () => new Date('2026-08-10T12:05:00.000Z') });
      await saveAuthorAssistantSession({
        sessionRoot: root,
        session: original.session,
        researchRequest: buildAwsResearchRequest({ ...original.session, status: 'input_complete' })
      });
      const saved = await saveAuthorAssistantStage84DAcceptance({
        sessionRoot: root,
        existingSession: original.session,
        acceptedSession: accepted.session,
        existingInstructions: original.instructions,
        acceptedInstructions: accepted.instructions,
        acceptance: accepted.acceptance
      });
      const loaded = await loadAuthorAssistantSession(root, sessionId);
      assert.equal(loaded.session.status, 'stage_6_accepted');
      assert.equal(loaded.session.boundaries.stage6Accepted, true);
      assert.equal(loaded.session.boundaries.stage7Prepared, false);
      assert.equal(loaded.stageSixInstructions.status, 'human_accepted');
      const audit = JSON.parse(await readFile(saved.acceptancePath, 'utf8'));
      assert.equal(audit.checkboxCount, 24);
      assert.equal(audit.wroteToAuthor, false);
      assert.equal(audit.beganStage7, false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('6. the acceptance command has no AI or API-key dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/applyStage84D.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /OPENAI_API_KEY|requestStageSixInstructions|fetch\s*\(/);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:apply-84d'], 'node scripts/author-assistant/applyStage84D.mjs');
  });
});
