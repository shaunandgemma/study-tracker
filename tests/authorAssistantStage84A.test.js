import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAwsResearchRequest,
  loadAuthorAssistantSession,
  saveAuthorAssistantSession,
  saveAuthorAssistantStageSixRevision
} from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildStageSixPayload,
  formatStageSixPreview,
  requestStageSixInstructions
} from '../scripts/author-assistant/authorAssistantInstructions.mjs';
import {
  formatStage84APendingSources,
  loadApprovedStage84AAlignment,
  validateStage84AAlignment
} from '../scripts/author-assistant/authorAssistantStage84A.mjs';

const sessionId = 'author-assistant-sqs-step84a-test';
const sourceUrl = 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/step-receive-delete-message.html';
const affectedTaskIds = [
  'task-sqs-receive-and-inspect-the-test-message-004',
  'task-sqs-delete-the-received-test-message-005',
  'task-sqs-review-queue-deletion-effects-006'
];

function session() {
  return {
    schemaVersion: 1,
    sessionId,
    status: 'stage_6_ready_for_review',
    currentStep: 'local_stage_6_instruction_review',
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-08-10T09:00:00.000Z',
    inputs: {
      serviceName: 'Amazon Simple Queue Service',
      shortName: 'SQS',
      learnerLevel: 'Beginner',
      buildOutcome: 'Build and test a basic message queue safely',
      preferredRegion: 'eu-west-2'
    },
    boundaries: {
      authorStagesPrepared: [1, 2, 3, 4, 5, 6],
      aiCalled: true,
      awsConnected: false,
      supabaseConnected: false,
      authorDraftWritten: false,
      stage6Prepared: true,
      stage7Prepared: false,
      candidatePrepared: false,
      published: false
    }
  };
}

function blueprint() {
  const tasks = [
    { id: 'task-sqs-create-a-standard-queue-002', title: 'Create a standard queue', goal: 'Create a queue.', whyItMatters: 'It is needed.', region: 'eu-west-2' },
    { id: affectedTaskIds[0], title: 'Receive and inspect the test message', goal: 'Receive it.', whyItMatters: 'Inspect it.', region: 'eu-west-2' },
    { id: affectedTaskIds[1], title: 'Delete the received test message', goal: 'Delete it.', whyItMatters: 'Complete the test.', region: 'eu-west-2' },
    { id: affectedTaskIds[2], title: 'Review queue deletion effects', goal: 'Review lifecycle.', whyItMatters: 'Understand cleanup.', region: 'eu-west-2' }
  ].map(task => ({
    ...task,
    sourceIds: ['source-guide'],
    modeAvailability: {},
    consoleSteps: [],
    cliSteps: []
  }));
  return {
    schemaVersion: 1,
    kind: 'author_stages_1_to_5_blueprint',
    status: 'human_accepted',
    sessionId,
    generatedAt: '2026-08-10T08:00:00.000Z',
    stageBoundary: {
      preparedLocally: [1, 2, 3, 4, 5],
      notPrepared: [6, 7, 8, 9, 10, 11, 12],
      writtenToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      candidatePrepared: false,
      published: false
    },
    tasks,
    sources: [{ id: 'source-guide', title: 'AWS SQS guide', url: sourceUrl, purpose: 'Supports the task.' }],
    manualReviewFindings: ['Original finding.']
  };
}

function acceptedSources() {
  return {
    status: 'accepted',
    sessionId,
    sources: [{ documentTitle: 'AWS SQS guide', url: sourceUrl, whyThisSourceApplies: 'Supports the task.' }]
  };
}

function existingInstructions() {
  return {
    schemaVersion: 1,
    kind: 'author_stage_6_local_instructions',
    status: 'awaiting_human_stage_6_review',
    sessionId,
    stageBoundary: {
      preparedLocally: [6],
      notPrepared: [7, 8, 9, 10, 11, 12],
      writtenToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      candidatePrepared: false,
      published: false
    },
    tasks: [
      {
        taskId: 'task-sqs-create-a-standard-queue-002',
        title: 'Create a standard queue',
        status: 'prepared',
        manualReviewReason: '',
        modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'not_applicable', reason: 'Future scope.' } },
        consoleSteps: [{ id: 'preserved-step', instructions: [{ id: 'preserved-check', text: 'Preserve me.', detail: '' }] }],
        cliSteps: []
      },
      ...affectedTaskIds.map((taskId, index) => ({
        taskId,
        title: blueprint().tasks[index + 1].title,
        status: 'needs_manual_review',
        manualReviewReason: 'Old mode mismatch.',
        modeAvailability: { console: { status: 'not_applicable', reason: 'Old mode mismatch.' }, cli: { status: 'not_applicable', reason: 'Future scope.' } },
        consoleSteps: [],
        cliSteps: []
      }))
    ],
    protectedSourceUrlsUsed: [],
    manualReviewFindings: ['Original finding.']
  };
}

function proposal() {
  return {
    tasks: affectedTaskIds.map((taskId, index) => ({
      taskId,
      status: 'prepared',
      manualReviewReason: '',
      consoleSteps: [{
        title: `Console action ${index + 1}`,
        instructions: [{ text: `Complete safe Console action ${index + 1}.`, detail: '' }],
        expectedResult: 'The expected Console result is visible.',
        warning: index === 2 ? 'Do not delete the queue in Stage 6.' : '',
        sourceUrls: [sourceUrl]
      }]
    })),
    manualReviewFindings: ['A repeated AI restatement that must not replace the approved canonical list.']
  };
}

function apiResponse() {
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        id: 'resp_step84a',
        output: [
          { type: 'web_search_call', action: { sources: [{ url: sourceUrl }] } },
          { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(proposal()) }] }
        ]
      };
    }
  };
}

test('Step 84A controlled SQS Console boundary alignment', async t => {
  const alignment = await loadApprovedStage84AAlignment({
    session: session(),
    blueprint: blueprint(),
    existingInstructions: existingInstructions()
  });

  await t.test('1. alignment is SQS-only, approved and keeps new sources pending', () => {
    assert.equal(alignment.alignmentId, 'step-84a-sqs-console-boundary-v1');
    assert.deepEqual(alignment.affectedTaskIds, affectedTaskIds);
    assert.equal(alignment.pendingSourceCandidates.every(source => source.status === 'pending_human_approval'), true);
    assert.match(formatStage84APendingSources(alignment), /not accepted or used/i);
    assert.throws(
      () => validateStage84AAlignment(alignment, { ...session(), inputs: { ...session().inputs, shortName: 'SNS' } }, blueprint(), existingInstructions()),
      /does not match this service/
    );
  });

  await t.test('2. payload contains only affected tasks and separates Console, CLI and Stage 8 scope', () => {
    const payload = buildStageSixPayload(session(), acceptedSources(), blueprint(), {
      alignment,
      existingInstructions: existingInstructions()
    });
    assert.deepEqual(payload.text.format.schema.properties.tasks.items.properties.taskId.enum, affectedTaskIds);
    assert.match(payload.input, /Do not require the learner to copy or retain a receipt handle/);
    assert.match(payload.input, /future CLI path must retain the ReceiptHandle/);
    assert.match(payload.input, /Actual queue deletion belongs to Stage 8 cleanup/);
    assert.doesNotMatch(payload.input, /Choosing your Region - AWS Management Console/);
  });

  await t.test('3. revision preserves unaffected tasks and consolidates findings', async () => {
    const oldInstructions = existingInstructions();
    const revised = await requestStageSixInstructions({
      session: session(),
      acceptedSources: acceptedSources(),
      blueprint: blueprint(),
      existingInstructions: oldInstructions,
      alignment,
      apiKey: 'private-test-key',
      fetchImpl: async () => apiResponse(),
      now: () => new Date('2026-08-10T10:00:00.000Z')
    });
    assert.deepEqual(revised.tasks[0], oldInstructions.tasks[0]);
    assert.equal(revised.tasks.slice(1).every(task => task.status === 'prepared'), true);
    assert.deepEqual(revised.manualReviewFindings, alignment.canonicalManualReviewFindings);
    assert.equal(revised.boundaryAlignment.pendingSourceCandidates.every(source => source.status === 'pending_human_approval'), true);
    assert.deepEqual(revised.stageBoundary.notPrepared, [7, 8, 9, 10, 11, 12]);
  });

  await t.test('4. revision save remains local and Stage 7 stays false', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step84a-'));
    try {
      const currentSession = session();
      const oldInstructions = existingInstructions();
      const revised = await requestStageSixInstructions({
        session: currentSession,
        acceptedSources: acceptedSources(),
        blueprint: blueprint(),
        existingInstructions: oldInstructions,
        alignment,
        apiKey: 'private-test-key',
        fetchImpl: async () => apiResponse()
      });
      const researchSession = { ...currentSession, status: 'input_complete' };
      await saveAuthorAssistantSession({
        sessionRoot: root,
        session: currentSession,
        researchRequest: buildAwsResearchRequest(researchSession)
      });
      const saved = await saveAuthorAssistantStageSixRevision({
        sessionRoot: root,
        session: currentSession,
        existingInstructions: oldInstructions,
        revisedInstructions: revised,
        previewText: formatStageSixPreview(revised),
        now: () => new Date('2026-08-10T10:05:00.000Z')
      });
      const loaded = await loadAuthorAssistantSession(root, sessionId);
      assert.equal(loaded.session.boundaries.stage7Prepared, false);
      assert.equal(loaded.session.boundaries.authorDraftWritten, false);
      assert.equal(loaded.session.boundaries.awsConnected, false);
      assert.equal(loaded.session.boundaries.supabaseConnected, false);
      assert.match(await readFile(saved.previewPath, 'utf8'), /Stages 7-12 have not been prepared/);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
