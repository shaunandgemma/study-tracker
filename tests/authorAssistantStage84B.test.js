import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAwsResearchRequest,
  loadAuthorAssistantSession,
  saveAuthorAssistantSession,
  saveAuthorAssistantStage84BRevision
} from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildStageSixPayload,
  formatStageSixPreview,
  requestStageSixInstructions
} from '../scripts/author-assistant/authorAssistantInstructions.mjs';
import {
  buildStage84BAmendedInputs,
  loadApprovedStage84BAmendment,
  validateStage84BAmendment
} from '../scripts/author-assistant/authorAssistantStage84B.mjs';

const sessionId = 'author-assistant-sqs-step84b-test';
const safeTaskId = 'task-sqs-confirm-safe-scope-and-required-access-001';
const oldUrl = 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/creating-sqs-standard-queues.html';
const otherTaskIds = [
  'task-sqs-create-a-standard-queue-002',
  'task-sqs-send-one-harmless-test-message-003',
  'task-sqs-receive-and-inspect-the-test-message-004',
  'task-sqs-delete-the-received-test-message-005',
  'task-sqs-review-queue-deletion-effects-006'
];

function currentSession() {
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

function currentAcceptedSources() {
  return {
    schemaVersion: 1,
    kind: 'accepted_aws_documentation_sources',
    status: 'accepted',
    sessionId,
    sources: [{
      sourceType: 'service_guide',
      documentTitle: 'Creating an Amazon SQS standard queue',
      url: oldUrl,
      checkedAt: '2026-08-10T08:00:00.000Z',
      supports: ['Safe names.'],
      whyThisSourceApplies: 'Supports safe naming.'
    }],
    manualReviewFindings: []
  };
}

function currentBlueprint() {
  const makeTask = (id, title) => ({
    id,
    title,
    goal: `${title} goal.`,
    whyItMatters: `${title} matters.`,
    region: 'eu-west-2',
    sourceIds: ['source-old'],
    modeAvailability: {},
    consoleSteps: [],
    cliSteps: []
  });
  return {
    schemaVersion: 1,
    kind: 'author_stages_1_to_5_blueprint',
    status: 'human_accepted',
    sessionId,
    generatedAt: '2026-08-10T08:10:00.000Z',
    stageBoundary: {
      preparedLocally: [1, 2, 3, 4, 5],
      notPrepared: [6, 7, 8, 9, 10, 11, 12],
      writtenToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      candidatePrepared: false,
      published: false
    },
    tasks: [makeTask(safeTaskId, 'Confirm safe scope and required access'), ...otherTaskIds.map(id => makeTask(id, id))],
    sources: [{ id: 'source-old', title: 'Creating an Amazon SQS standard queue', url: oldUrl, publisher: 'AWS', sourceType: 'official_documentation', purpose: 'Supports safe naming.', taskIds: [safeTaskId, ...otherTaskIds] }],
    manualReviewFindings: []
  };
}

function currentInstructions() {
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
        taskId: safeTaskId,
        title: 'Confirm safe scope and required access',
        status: 'needs_manual_review',
        manualReviewReason: 'Sources are pending.',
        modeAvailability: { console: { status: 'not_applicable', reason: 'Sources are pending.' }, cli: { status: 'not_applicable', reason: 'Future scope.' } },
        consoleSteps: [],
        cliSteps: []
      },
      ...otherTaskIds.map(taskId => ({
        taskId,
        title: taskId,
        status: 'prepared',
        manualReviewReason: '',
        modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'not_applicable', reason: 'Future scope.' } },
        consoleSteps: [{ id: `${taskId}-protected`, instructions: [{ id: `${taskId}-checkbox`, text: 'Protected existing checkbox.', detail: '' }] }],
        cliSteps: []
      }))
    ],
    protectedSourceUrlsUsed: [oldUrl],
    manualReviewFindings: [],
    boundaryAlignment: {
      alignmentId: 'step-84a-sqs-console-boundary-v1',
      approvalStep: '84A',
      appliedAt: '2026-08-10T09:22:00.000Z',
      futureCliGuidance: { existing: 'Keep this.' },
      stage8CleanupGuidance: { existing: 'Keep this too.' },
      pendingSourceCandidates: []
    }
  };
}

function proposal(sourceUrls, text = 'Confirm that the Region selector shows Europe (London) eu-west-2.') {
  return {
    tasks: [{
      taskId: safeTaskId,
      status: 'prepared',
      manualReviewReason: '',
      consoleSteps: [{
        title: 'Confirm the safe prerequisites',
        instructions: [
          { text, detail: '' },
          { text: 'Use a queue name that contains no confidential information.', detail: '' },
          { text: 'Confirm that your signed-in account or role already has the required SQS Console access.', detail: 'Ask your administrator if access has not already been granted.' },
          { text: 'Do not create or attach an IAM policy during this Follow Along.', detail: '' }
        ],
        expectedResult: 'The Region and safe access prerequisites are confirmed.',
        warning: 'Do not change IAM permissions during this Follow Along.',
        sourceUrls
      }]
    }],
    manualReviewFindings: []
  };
}

function apiResponse(value, returnedUrls) {
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        id: 'resp_step84b',
        output: [
          { type: 'web_search_call', action: { sources: returnedUrls.map(url => ({ url })) } },
          { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(value) }] }
        ]
      };
    }
  };
}

test('Step 84B approved SQS safe-scope source amendment', async t => {
  const amendment = await loadApprovedStage84BAmendment({
    session: currentSession(),
    acceptedSources: currentAcceptedSources(),
    blueprint: currentBlueprint(),
    existingInstructions: currentInstructions()
  });

  await t.test('1. exactly two approved sources are added and linked only to task 1', () => {
    const amended = buildStage84BAmendedInputs({
      acceptedSources: currentAcceptedSources(),
      blueprint: currentBlueprint(),
      amendment,
      now: () => new Date('2026-08-10T10:00:00.000Z')
    });
    assert.equal(amended.acceptedSources.sources.length, 3);
    assert.deepEqual(amended.acceptedSources.sources.slice(1).map(source => source.url), amendment.approvedSources.map(source => source.url));
    const newBlueprintSources = amended.blueprint.sources.slice(1);
    assert.equal(newBlueprintSources.every(source => source.taskIds.join(',') === safeTaskId), true);
    for (const taskId of otherTaskIds) {
      assert.deepEqual(amended.blueprint.tasks.find(task => task.id === taskId), currentBlueprint().tasks.find(task => task.id === taskId));
    }
  });

  await t.test('2. the AI request contains only task 1 and the amended accepted source boundary', () => {
    const amended = buildStage84BAmendedInputs({ acceptedSources: currentAcceptedSources(), blueprint: currentBlueprint(), amendment });
    const payload = buildStageSixPayload(currentSession(), amended.acceptedSources, amended.blueprint, {
      alignment: amendment,
      existingInstructions: currentInstructions()
    });
    assert.deepEqual(payload.text.format.schema.properties.tasks.items.properties.taskId.enum, [safeTaskId]);
    assert.match(payload.input, /Do not create, attach, recommend or edit an IAM policy/);
    assert.equal(payload.text.format.schema.properties.tasks.items.properties.consoleSteps.items.properties.sourceUrls.items.enum.length, 3);
  });

  await t.test('3. task 1 is regenerated while all five completed tasks remain exact', async () => {
    const amended = buildStage84BAmendedInputs({ acceptedSources: currentAcceptedSources(), blueprint: currentBlueprint(), amendment });
    const sourceUrls = amended.blueprint.tasks[0].sourceIds.map(sourceId => amended.blueprint.sources.find(source => source.id === sourceId).url);
    const revised = await requestStageSixInstructions({
      session: currentSession(),
      acceptedSources: amended.acceptedSources,
      blueprint: amended.blueprint,
      existingInstructions: currentInstructions(),
      alignment: amendment,
      apiKey: 'private-test-key',
      fetchImpl: async () => apiResponse(proposal(sourceUrls), sourceUrls),
      now: () => new Date('2026-08-10T10:05:00.000Z')
    });
    assert.equal(revised.tasks[0].status, 'prepared');
    assert.equal(revised.tasks[0].consoleSteps[0].instructions.length, 4);
    assert.deepEqual(revised.tasks.slice(1), currentInstructions().tasks.slice(1));
    assert.deepEqual(revised.manualReviewFindings, amendment.canonicalManualReviewFindings);
    assert.equal(revised.boundaryAlignment.approvalStep, '84B');
    assert.equal(revised.boundaryAlignment.alignmentHistory[0].approvalStep, '84A');
    assert.equal(revised.boundaryAlignment.futureCliGuidance.existing, 'Keep this.');
  });

  await t.test('4. IAM policy creation or recommendation is rejected before saving', async () => {
    const amended = buildStage84BAmendedInputs({ acceptedSources: currentAcceptedSources(), blueprint: currentBlueprint(), amendment });
    const sourceUrls = amended.blueprint.tasks[0].sourceIds.map(sourceId => amended.blueprint.sources.find(source => source.id === sourceId).url);
    await assert.rejects(
      requestStageSixInstructions({
        session: currentSession(),
        acceptedSources: amended.acceptedSources,
        blueprint: amended.blueprint,
        existingInstructions: currentInstructions(),
        alignment: amendment,
        apiKey: 'private-test-key',
        fetchImpl: async () => apiResponse(proposal(sourceUrls, 'Create an IAM policy for SQS access.'), sourceUrls)
      }),
      /must not create or recommend an IAM policy/
    );
  });

  await t.test('5. the complete amendment saves locally with an audit and Stage 7 remains false', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step84b-'));
    try {
      const amended = buildStage84BAmendedInputs({ acceptedSources: currentAcceptedSources(), blueprint: currentBlueprint(), amendment });
      const sourceUrls = amended.blueprint.tasks[0].sourceIds.map(sourceId => amended.blueprint.sources.find(source => source.id === sourceId).url);
      const revised = await requestStageSixInstructions({
        session: currentSession(),
        acceptedSources: amended.acceptedSources,
        blueprint: amended.blueprint,
        existingInstructions: currentInstructions(),
        alignment: amendment,
        apiKey: 'private-test-key',
        fetchImpl: async () => apiResponse(proposal(sourceUrls), sourceUrls)
      });
      await saveAuthorAssistantSession({
        sessionRoot: root,
        session: currentSession(),
        researchRequest: buildAwsResearchRequest({ ...currentSession(), status: 'input_complete' })
      });
      const saved = await saveAuthorAssistantStage84BRevision({
        sessionRoot: root,
        session: currentSession(),
        existingAcceptedSources: currentAcceptedSources(),
        amendedAcceptedSources: amended.acceptedSources,
        existingBlueprint: currentBlueprint(),
        amendedBlueprint: amended.blueprint,
        existingInstructions: currentInstructions(),
        revisedInstructions: revised,
        amendment,
        previewText: formatStageSixPreview(revised),
        now: () => new Date('2026-08-10T10:10:00.000Z')
      });
      const loaded = await loadAuthorAssistantSession(root, sessionId);
      assert.equal(loaded.acceptedSources.sources.length, 3);
      assert.equal(loaded.stageSixInstructions.tasks.every(task => task.status === 'prepared'), true);
      assert.equal(loaded.session.boundaries.stage7Prepared, false);
      assert.equal(loaded.session.boundaries.authorDraftWritten, false);
      const audit = JSON.parse(await readFile(saved.auditPath, 'utf8'));
      assert.deepEqual(audit.acceptedSourceUrls, amendment.approvedSources.map(source => source.url));
      assert.equal(audit.protectedTaskIds.length, 5);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('6. a third source or changed boundary is rejected', () => {
    const invalid = structuredClone(amendment);
    invalid.approvedSources.push({ ...invalid.approvedSources[0], url: 'https://docs.aws.amazon.com/third-source.html' });
    assert.throws(
      () => validateStage84BAmendment(invalid, currentSession(), currentAcceptedSources(), currentBlueprint(), currentInstructions()),
      /exactly the two approved AWS sources/
    );
  });
});
