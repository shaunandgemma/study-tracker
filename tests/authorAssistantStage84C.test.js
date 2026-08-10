import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAwsResearchRequest,
  loadAuthorAssistantSession,
  saveAuthorAssistantSession,
  saveAuthorAssistantStage84CCorrection
} from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildStage84CLocalCorrection,
  STAGE_84C_CANONICAL_QUEUE_NAME,
  STAGE_84C_OLD_QUEUE_NAME,
  validateStage84CInputs
} from '../scripts/author-assistant/authorAssistantStage84C.mjs';

const sessionId = 'author-assistant-sqs-step84c-test';
const taskId = 'task-sqs-confirm-safe-scope-and-required-access-001';
const regionFinding = 'The sources found do not provide a follow-along-specific instruction for selecting the preferred Region, eu-west-2.';
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
    kind: 'accepted_aws_documentation_sources',
    status: 'accepted',
    sessionId,
    sources: [{
      documentTitle: 'Choosing your Region',
      url: 'https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/select-region.html'
    }],
    manualReviewFindings: [regionFinding, iamFinding]
  };
}

function blueprint() {
  return { schemaVersion: 1, status: 'human_accepted', sessionId, tasks: [{ id: taskId }] };
}

function instructions() {
  const protectedTasks = Array.from({ length: 5 }, (_, index) => ({
    taskId: `protected-task-${index + 1}`,
    status: 'prepared',
    consoleSteps: [{ id: `protected-step-${index + 1}`, instructions: [{ id: `protected-item-${index + 1}`, text: 'Keep exactly.', detail: '' }] }]
  }));
  return {
    schemaVersion: 1,
    kind: 'author_stage_6_local_instructions',
    status: 'awaiting_human_stage_6_review',
    sessionId,
    stageBoundary: { preparedLocally: [6], notPrepared: [7, 8, 9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    tasks: [{
      taskId,
      status: 'prepared',
      consoleSteps: [{
        id: 'safe-name-step',
        instruction: `Choose the non-confidential queue name ${STAGE_84C_OLD_QUEUE_NAME}.`,
        instructions: [{ id: 'safe-name-item', text: `Choose the non-confidential queue name ${STAGE_84C_OLD_QUEUE_NAME}.`, detail: '' }]
      }]
    }, ...protectedTasks],
    boundaryAlignment: { approvalStep: '84B' }
  };
}

function amendmentAudit() {
  return { schemaVersion: 1, kind: 'author_stage_6_source_amendment', status: 'applied_locally', sessionId, approvalStep: '84B' };
}

test('Step 84C deterministic queue-name and Region-resolution correction', async t => {
  await t.test('1. only the task 1 queue name changes', () => {
    const oldInstructions = instructions();
    const corrected = buildStage84CLocalCorrection({
      session: session(),
      acceptedSources: acceptedSources(),
      blueprint: blueprint(),
      instructions: oldInstructions,
      sourceAmendmentAudit: amendmentAudit(),
      now: () => new Date('2026-08-10T11:00:00.000Z')
    });
    assert.match(corrected.instructions.tasks[0].consoleSteps[0].instruction, new RegExp(STAGE_84C_CANONICAL_QUEUE_NAME));
    assert.doesNotMatch(corrected.instructions.tasks[0].consoleSteps[0].instruction, new RegExp(STAGE_84C_OLD_QUEUE_NAME));
    assert.deepEqual(corrected.instructions.tasks.slice(1), oldInstructions.tasks.slice(1));
    assert.equal(corrected.audit.changedInstructionId, 'safe-name-item');
    assert.equal(corrected.audit.stage6Accepted, false);
  });

  await t.test('2. the historical Region finding is preserved and marked resolved while IAM remains active', () => {
    const corrected = buildStage84CLocalCorrection({
      session: session(),
      acceptedSources: acceptedSources(),
      blueprint: blueprint(),
      instructions: instructions(),
      sourceAmendmentAudit: amendmentAudit()
    });
    assert.deepEqual(corrected.acceptedSources.manualReviewFindings, [regionFinding, iamFinding]);
    assert.equal(corrected.acceptedSources.manualReviewResolutions.length, 1);
    assert.equal(corrected.acceptedSources.manualReviewResolutions[0].finding, regionFinding);
    assert.equal(corrected.acceptedSources.manualReviewResolutions[0].status, 'resolved');
    assert.ok(corrected.acceptedSources.manualReviewFindings.includes(iamFinding));
  });

  await t.test('3. changed expected text or a repeated application stops safely', () => {
    const changed = instructions();
    changed.tasks[0].consoleSteps[0].instructions[0].text = 'A different name.';
    assert.throws(
      () => validateStage84CInputs({ session: session(), acceptedSources: acceptedSources(), blueprint: blueprint(), instructions: changed, sourceAmendmentAudit: amendmentAudit() }),
      /expected single queue-name checkbox changed/
    );
    const alreadyApplied = acceptedSources();
    alreadyApplied.manualReviewResolutions = [{ approvalStep: '84C' }];
    assert.throws(
      () => validateStage84CInputs({ session: session(), acceptedSources: alreadyApplied, blueprint: blueprint(), instructions: instructions(), sourceAmendmentAudit: amendmentAudit() }),
      /already been applied/
    );
  });

  await t.test('4. local save writes the audit and keeps Stage 6 unaccepted and Stage 7 false', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step84c-'));
    try {
      const existingSession = session();
      const existingSources = acceptedSources();
      const existingInstructions = instructions();
      const corrected = buildStage84CLocalCorrection({
        session: existingSession,
        acceptedSources: existingSources,
        blueprint: blueprint(),
        instructions: existingInstructions,
        sourceAmendmentAudit: amendmentAudit(),
        now: () => new Date('2026-08-10T11:05:00.000Z')
      });
      await saveAuthorAssistantSession({
        sessionRoot: root,
        session: existingSession,
        researchRequest: buildAwsResearchRequest({ ...existingSession, status: 'input_complete' })
      });
      const saved = await saveAuthorAssistantStage84CCorrection({
        sessionRoot: root,
        existingSession,
        correctedSession: corrected.session,
        existingAcceptedSources: existingSources,
        correctedAcceptedSources: corrected.acceptedSources,
        existingInstructions,
        correctedInstructions: corrected.instructions,
        audit: corrected.audit
      });
      const loaded = await loadAuthorAssistantSession(root, sessionId);
      assert.equal(loaded.session.status, 'stage_6_ready_for_review');
      assert.equal(loaded.session.boundaries.stage7Prepared, false);
      assert.equal(loaded.session.boundaries.authorDraftWritten, false);
      assert.match(loaded.stageSixInstructions.tasks[0].consoleSteps[0].instruction, /sqs-beginner-test/);
      const audit = JSON.parse(await readFile(saved.auditPath, 'utf8'));
      assert.equal(audit.stage6Accepted, false);
      assert.equal(audit.beganStage7, false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('5. the local command has no AI or API-key dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/applyStage84C.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /OPENAI_API_KEY|requestStageSixInstructions|fetch\s*\(/);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:apply-84c'], 'node scripts/author-assistant/applyStage84C.mjs');
  });
});
