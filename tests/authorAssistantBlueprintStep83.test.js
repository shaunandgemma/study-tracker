import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAuthorAssistantSession,
  buildAwsResearchRequest,
  loadAuthorAssistantSession,
  saveAuthorAssistantBlueprint,
  saveAuthorAssistantSession
} from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildBlueprintPayload,
  buildStagesOneToFiveBlueprint,
  formatBlueprintPreview,
  requestStagesOneToFiveBlueprint
} from '../scripts/author-assistant/authorAssistantBlueprint.mjs';

const session = buildAuthorAssistantSession({
  serviceName: 'Amazon Simple Notification Service',
  shortName: 'SNS',
  learnerLevel: 'Beginner',
  buildOutcome: 'Create and test a basic notification topic safely',
  preferredRegion: 'eu-west-2'
}, {
  now: () => new Date('2026-08-09T12:00:00.000Z'),
  idFactory: () => 'generic-step83-session'
});

const sources = [
  {
    sourceType: 'service_guide',
    documentTitle: 'Getting started with Amazon SNS',
    url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-getting-started.html',
    supports: ['Create and test a topic'],
    whyThisSourceApplies: 'It documents the service workflow.'
  },
  {
    sourceType: 'cli_reference',
    documentTitle: 'AWS CLI SNS reference',
    url: 'https://docs.aws.amazon.com/cli/latest/reference/sns/index.html',
    supports: ['SNS CLI commands'],
    whyThisSourceApplies: 'It documents supported commands.'
  },
  {
    sourceType: 'service_authorization',
    documentTitle: 'Actions for Amazon SNS',
    url: 'https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonsns.html',
    supports: ['IAM actions'],
    whyThisSourceApplies: 'It documents service authorization.'
  }
];

const acceptedSources = {
  schemaVersion: 1,
  kind: 'accepted_aws_documentation_sources',
  status: 'accepted',
  sessionId: session.sessionId,
  acceptedAt: '2026-08-09T12:05:00.000Z',
  sources,
  rejectedSourceUrls: [],
  manualReviewFindings: ['Review least-privilege permissions before instructions.']
};

const proposal = {
  programme: {
    displayName: 'SNS Follow Along',
    subtitle: 'Topics and test notifications',
    category: 'Application Integration',
    description: 'Build and test a basic Amazon SNS topic using a safe learner message.',
    learningOutcome: 'Create a topic, test notification behaviour and understand the required permissions.',
    difficulty: 'Beginner',
    regionScope: 'regional'
  },
  phases: [
    { phaseNumber: 1, title: 'Create the topic', description: 'Create the learner topic and record its identifier.', isOptional: false },
    { phaseNumber: 2, title: 'Test the topic', description: 'Test the topic with a harmless notification.', isOptional: false },
    { phaseNumber: 3, title: 'Review access', description: 'Review the required service authorization boundary.', isOptional: false },
    { phaseNumber: 4, title: 'Confirm the outcome', description: 'Confirm the learner journey completed safely.', isOptional: false }
  ],
  tasks: [
    {
      taskNumber: 1,
      phaseNumber: 1,
      title: 'Create a notification topic',
      feature: 'SNS topics',
      goal: 'Create a basic notification topic in the selected Region.',
      whyItMatters: 'The topic is the central resource used by the notification exercise.',
      difficulty: 'Easy',
      estimatedMinutes: 10,
      isOptional: false,
      prerequisiteTaskNumbers: [],
      sourceUrls: [sources[0].url, sources[1].url]
    },
    {
      taskNumber: 2,
      phaseNumber: 2,
      title: 'Test the topic safely',
      feature: 'SNS publishing',
      goal: 'Use a harmless message to test the topic workflow.',
      whyItMatters: 'A test confirms that the learner understands the basic publishing workflow.',
      difficulty: 'Easy',
      estimatedMinutes: 10,
      isOptional: false,
      prerequisiteTaskNumbers: [1],
      sourceUrls: [sources[0].url, sources[1].url]
    },
    {
      taskNumber: 3,
      phaseNumber: 3,
      title: 'Review required permissions',
      feature: 'SNS authorization',
      goal: 'Identify the service actions and resources relevant to the learner workflow.',
      whyItMatters: 'Permission review supports a later least-privilege instruction set.',
      difficulty: 'Easy',
      estimatedMinutes: 5,
      isOptional: false,
      prerequisiteTaskNumbers: [1],
      sourceUrls: [sources[2].url]
    },
    {
      taskNumber: 4,
      phaseNumber: 4,
      title: 'Confirm the completed test',
      feature: 'SNS verification',
      goal: 'Confirm that the safe learner test produced the expected result.',
      whyItMatters: 'Final confirmation makes the learner outcome visible and reviewable.',
      difficulty: 'Easy',
      estimatedMinutes: null,
      isOptional: false,
      prerequisiteTaskNumbers: [2, 3],
      sourceUrls: [sources[0].url]
    }
  ],
  manualReviewFindings: ['Do not infer a final IAM policy during planning.']
};

function apiResponse(value = proposal) {
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        id: 'resp_generic_step83',
        output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(value) }] }]
      };
    }
  };
}

test('Step 83 reusable Author Stages 1-5 blueprint', async t => {
  await t.test('1. payload is service-independent and permits only accepted source URLs', () => {
    const payload = buildBlueprintPayload(session, acceptedSources);
    assert.equal(payload.tools, undefined);
    assert.equal(payload.store, false);
    assert.match(payload.input, /Amazon Simple Notification Service/);
    assert.doesNotMatch(JSON.stringify(payload), /Amazon Simple Queue Service|\bSQS\b/);
    assert.deepEqual(
      payload.text.format.schema.properties.tasks.items.properties.sourceUrls.items.enum,
      sources.map(source => source.url)
    );
  });

  await t.test('2. missing API key stops before the network request', async () => {
    let called = false;
    await assert.rejects(
      requestStagesOneToFiveBlueprint({
        session,
        acceptedSources,
        apiKey: '',
        fetchImpl: async () => { called = true; }
      }),
      /OPENAI_API_KEY/
    );
    assert.equal(called, false);
  });

  await t.test('3. unaccepted source state cannot prepare a blueprint', () => {
    assert.throws(
      () => buildBlueprintPayload(session, { ...acceptedSources, status: 'needs_review' }),
      /Accepted AWS documentation sources/
    );
  });

  await t.test('4. generic proposal becomes a valid local Stages 1-5 blueprint', () => {
    const blueprint = buildStagesOneToFiveBlueprint({
      session,
      acceptedSources,
      proposal,
      now: () => new Date('2026-08-09T12:10:00.000Z')
    });
    assert.equal(blueprint.service.shortName, 'SNS');
    assert.equal(blueprint.planningCheck.valid, true);
    assert.deepEqual(blueprint.stageBoundary.preparedLocally, [1, 2, 3, 4, 5]);
    assert.deepEqual(blueprint.stageBoundary.notPrepared, [6, 7, 8, 9, 10, 11, 12]);
    assert.equal(blueprint.stageBoundary.writtenToAuthor, false);
    assert.equal(blueprint.sources.length, 3);
    assert.equal(blueprint.tasks.length, 4);
    assert.equal(blueprint.tasks.some(task => 'consoleSteps' in task || 'cliSteps' in task || 'cleanup' in task), false);
    assert.equal(blueprint.sources.every(source => source.taskIds.length > 0), true);
  });

  await t.test('5. a task cannot introduce a source that was not accepted', () => {
    const unsafeProposal = structuredClone(proposal);
    unsafeProposal.tasks[0].sourceUrls = ['https://docs.aws.amazon.com/fake/unaccepted.html'];
    assert.throws(
      () => buildStagesOneToFiveBlueprint({ session, acceptedSources, proposal: unsafeProposal }),
      /source that was not accepted/
    );
  });

  await t.test('6. a task cannot depend on a later task', () => {
    const invalidProposal = structuredClone(proposal);
    invalidProposal.tasks[0].prerequisiteTaskNumbers = [2];
    assert.throws(
      () => buildStagesOneToFiveBlueprint({ session, acceptedSources, proposal: invalidProposal }),
      /only on an earlier task/
    );
  });

  await t.test('7. API key remains in the header and a successful response stays local', async () => {
    let captured;
    const blueprint = await requestStagesOneToFiveBlueprint({
      session,
      acceptedSources,
      apiKey: 'private-test-key',
      fetchImpl: async (url, options) => { captured = { url, options }; return apiResponse(); },
      now: () => new Date('2026-08-09T12:10:00.000Z')
    });
    assert.equal(captured.options.headers.Authorization, 'Bearer private-test-key');
    assert.doesNotMatch(captured.options.body, /private-test-key/);
    assert.equal(blueprint.responseId, 'resp_generic_step83');
    assert.equal(blueprint.stageBoundary.connectedToSupabase, false);
    assert.equal(blueprint.stageBoundary.connectedToAws, false);
  });

  await t.test('8. save creates only local blueprint files and updates the local boundary', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step83-'));
    try {
      await saveAuthorAssistantSession({ sessionRoot: root, session, researchRequest: buildAwsResearchRequest(session) });
      const blueprint = buildStagesOneToFiveBlueprint({
        session,
        acceptedSources,
        proposal,
        now: () => new Date('2026-08-09T12:10:00.000Z')
      });
      const preview = formatBlueprintPreview(blueprint);
      const saved = await saveAuthorAssistantBlueprint({
        sessionRoot: root,
        session,
        blueprint,
        previewText: preview,
        now: () => new Date('2026-08-09T12:11:00.000Z')
      });
      assert.match(await readFile(saved.previewPath, 'utf8'), /Stages 6-12 have not been prepared/);
      const loaded = await loadAuthorAssistantSession(root, session.sessionId);
      assert.equal(loaded.session.status, 'blueprint_ready_for_review');
      assert.deepEqual(loaded.session.boundaries.authorStagesPrepared, [1, 2, 3, 4, 5]);
      assert.equal(loaded.session.boundaries.authorDraftWritten, false);
      assert.equal(loaded.session.boundaries.stage6Prepared, false);
      assert.equal(loaded.blueprint.sessionId, session.sessionId);
      assert.equal(loaded.session.boundaries.awsConnected, false);
      assert.equal(loaded.session.boundaries.supabaseConnected, false);
      assert.equal(loaded.session.boundaries.candidatePrepared, false);
      assert.equal(loaded.session.boundaries.published, false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('9. implementation contains no SQS-specific production content', async () => {
    const implementation = await readFile(new URL('../scripts/author-assistant/authorAssistantBlueprint.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(implementation, /Amazon Simple Queue Service|\bSQS\b|sqs:/);
    assert.doesNotMatch(implementation, /storeNewAuthorDraft|saveAuthorDraft|supabase|from ['"]aws-sdk|@aws-sdk/);
  });

  await t.test('10. every proposed phase must contain a task', () => {
    const emptyPhaseProposal = structuredClone(proposal);
    emptyPhaseProposal.phases.push({ phaseNumber: 5, title: 'Unused phase', description: 'This phase has no task.', isOptional: false });
    assert.throws(
      () => buildStagesOneToFiveBlueprint({ session, acceptedSources, proposal: emptyPhaseProposal }),
      /Every blueprint phase must contain at least one task/
    );
  });

  await t.test('11. tasks cannot move backwards through the phase order', () => {
    const outOfOrderProposal = structuredClone(proposal);
    outOfOrderProposal.tasks[2].phaseNumber = 1;
    assert.throws(
      () => buildStagesOneToFiveBlueprint({ session, acceptedSources, proposal: outOfOrderProposal }),
      /must follow the phase order/
    );
  });

  await t.test('12. the interactive runner reaches Step 83 without an Author write path', async () => {
    const runner = await readFile(new URL('../scripts/author-assistant/authorAssistant.mjs', import.meta.url), 'utf8');
    assert.match(runner, /Prepare a local Author Stages 1-5 blueprint now/);
    assert.match(runner, /requestStagesOneToFiveBlueprint/);
    assert.match(runner, /saveAuthorAssistantBlueprint/);
    assert.doesNotMatch(runner, /storeNewAuthorDraft|saveAuthorDraft|shared_supabase|onStoreReleaseCandidate/);
  });
});
