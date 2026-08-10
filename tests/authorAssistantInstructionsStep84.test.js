import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAuthorAssistantSession,
  buildAwsResearchRequest,
  loadAuthorAssistantSession,
  saveAuthorAssistantSession,
  saveAuthorAssistantStageSixInstructions
} from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildStageSixPayload,
  extractStageSixProtectedUrls,
  formatStageSixPreview,
  requestStageSixInstructions
} from '../scripts/author-assistant/authorAssistantInstructions.mjs';

const sourceUrls = [
  'https://docs.aws.amazon.com/sns/latest/dg/sns-getting-started.html',
  'https://docs.aws.amazon.com/cli/latest/reference/sns/create-topic.html'
];

const sources = sourceUrls.map((url, index) => ({
  sourceType: index ? 'cli_reference' : 'service_guide',
  documentTitle: index ? 'create-topic CLI reference' : 'Getting started with Amazon SNS',
  url,
  whyThisSourceApplies: 'It supports the accepted learner task.',
  supports: ['Accepted task']
}));

function acceptedSession() {
  const initial = buildAuthorAssistantSession({
    serviceName: 'Amazon Simple Notification Service',
    shortName: 'SNS',
    learnerLevel: 'Beginner',
    buildOutcome: 'Create and inspect a safe notification topic',
    preferredRegion: 'eu-west-2'
  }, { now: () => new Date('2026-08-10T10:00:00.000Z'), idFactory: () => 'step84-session' });
  return {
    ...initial,
    status: 'blueprint_accepted',
    currentStep: 'local_stages_1_5_blueprint_accepted',
    boundaries: {
      ...initial.boundaries,
      aiCalled: true,
      authorStagesPrepared: [1, 2, 3, 4, 5],
      authorDraftWritten: false,
      stage6Prepared: false
    }
  };
}

function acceptedSources(session) {
  return {
    schemaVersion: 1,
    kind: 'accepted_aws_documentation_sources',
    status: 'accepted',
    sessionId: session.sessionId,
    sources,
    manualReviewFindings: []
  };
}

function acceptedBlueprint(session) {
  return {
    schemaVersion: 1,
    kind: 'author_stages_1_to_5_blueprint',
    status: 'human_accepted',
    sessionId: session.sessionId,
    generatedAt: '2026-08-10T10:05:00.000Z',
    stageBoundary: {
      preparedLocally: [1, 2, 3, 4, 5],
      notPrepared: [6, 7, 8, 9, 10, 11, 12],
      writtenToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      candidatePrepared: false,
      published: false
    },
    tasks: [
      {
        id: 'task-sns-plan-001',
        title: 'Plan a safe topic',
        goal: 'Confirm a harmless topic name.',
        whyItMatters: 'Safe names avoid confidential information.',
        region: 'eu-west-2',
        sourceIds: ['source-guide']
      },
      {
        id: 'task-sns-create-002',
        title: 'Create a topic',
        goal: 'Create one basic topic.',
        whyItMatters: 'The topic supports the learner test.',
        region: 'eu-west-2',
        sourceIds: ['source-guide', 'source-cli']
      }
    ],
    sources: [
      { id: 'source-guide', title: sources[0].documentTitle, url: sourceUrls[0], purpose: sources[0].whyThisSourceApplies },
      { id: 'source-cli', title: sources[1].documentTitle, url: sourceUrls[1], purpose: sources[1].whyThisSourceApplies }
    ],
    manualReviewFindings: ['Keep names free from confidential data.']
  };
}

const proposal = {
  tasks: [
    {
      taskId: 'task-sns-plan-001',
      status: 'prepared',
      manualReviewReason: '',
      consoleSteps: [{
        title: 'Open Amazon SNS',
        instructions: [
          { text: 'Open the Amazon SNS console.', detail: 'Use the AWS Management Console.' },
          { text: 'Choose Topics.', detail: '' }
        ],
        expectedResult: 'The Topics page opens.',
        warning: 'Do not enter confidential information in a topic name.',
        sourceUrls: [sourceUrls[0]]
      }]
    },
    {
      taskId: 'task-sns-create-002',
      status: 'needs_manual_review',
      manualReviewReason: 'The accepted source does not confirm the current final button label.',
      consoleSteps: []
    }
  ],
  manualReviewFindings: ['Confirm the current final button label before acceptance.']
};

function apiResponse(value = proposal, returnedUrls = sourceUrls) {
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        id: 'resp_step84',
        output: [
          { type: 'web_search_call', action: { sources: returnedUrls.map(url => ({ title: 'AWS source', url })) } },
          { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(value), annotations: [] }] }
        ]
      };
    }
  };
}

test('Step 84 local separate checkbox instructions', async t => {
  await t.test('1. payload is service-independent and restricts sources to accepted URLs', () => {
    const session = acceptedSession();
    const payload = buildStageSixPayload(session, acceptedSources(session), acceptedBlueprint(session));
    assert.deepEqual(payload.tools[0].filters.allowed_domains, ['docs.aws.amazon.com']);
    assert.equal(payload.tool_choice, 'required');
    assert.deepEqual(payload.include, ['web_search_call.action.sources', 'web_search_call.results']);
    assert.equal(payload.store, false);
    assert.deepEqual(
      payload.text.format.schema.properties.tasks.items.properties.consoleSteps.items.properties.sourceUrls.items.enum,
      sourceUrls
    );
    assert.doesNotMatch(JSON.stringify(payload), /Amazon Simple Queue Service|\bSQS\b/);
  });

  await t.test('2. a missing API key stops before web search', async () => {
    const session = acceptedSession();
    let called = false;
    await assert.rejects(
      requestStageSixInstructions({
        session,
        acceptedSources: acceptedSources(session),
        blueprint: acceptedBlueprint(session),
        apiKey: '',
        fetchImpl: async () => { called = true; }
      }),
      /OPENAI_API_KEY/
    );
    assert.equal(called, false);
  });

  await t.test('3. generated checkboxes receive separate stable local IDs', async () => {
    const session = acceptedSession();
    const document = await requestStageSixInstructions({
      session,
      acceptedSources: acceptedSources(session),
      blueprint: acceptedBlueprint(session),
      apiKey: 'private-test-key',
      fetchImpl: async () => apiResponse(),
      now: () => new Date('2026-08-10T10:10:00.000Z')
    });
    const instructions = document.tasks[0].consoleSteps[0].instructions;
    assert.equal(instructions.length, 2);
    assert.equal(new Set(instructions.map(item => item.id)).size, 2);
    assert.equal(instructions[0].text, 'Open the Amazon SNS console.');
    assert.equal(instructions[1].text, 'Choose Topics.');
    assert.equal(document.tasks[1].status, 'needs_manual_review');
    assert.deepEqual(document.tasks[1].consoleSteps, []);
    assert.equal(document.tasks[1].modeAvailability.console.reason, proposal.tasks[1].manualReviewReason);
    assert.deepEqual(document.stageBoundary.notPrepared, [7, 8, 9, 10, 11, 12]);
  });

  await t.test('4. instruction evidence must be returned by protected AWS Docs search', async () => {
    const session = acceptedSession();
    await assert.rejects(
      requestStageSixInstructions({
        session,
        acceptedSources: acceptedSources(session),
        blueprint: acceptedBlueprint(session),
        apiKey: 'private-test-key',
        fetchImpl: async () => apiResponse(proposal, [sourceUrls[1]])
      }),
      /not returned by protected AWS Docs search/
    );
  });

  await t.test('4A. a structured answer without a required search result is rejected', async () => {
    const session = acceptedSession();
    await assert.rejects(
      requestStageSixInstructions({
        session,
        acceptedSources: acceptedSources(session),
        blueprint: acceptedBlueprint(session),
        apiKey: 'private-test-key',
        fetchImpl: async () => apiResponse(proposal, [])
      }),
      /returned no readable source URLs/
    );
  });

  await t.test('4B. protected evidence reader supports current search, open-page, result and citation shapes', () => {
    const response = {
      output: [
        { type: 'web_search_call', action: { type: 'open_page', url: `${sourceUrls[0]}#section` } },
        { type: 'web_search_call', action: { type: 'find_in_page', page_url: sourceUrls[1] } },
        { type: 'web_search_call', action: { type: 'search', results: [{ url: `${sourceUrls[0]}?view=1` }] } },
        { type: 'web_search_call', action: { type: 'search' }, results: [{ link: sourceUrls[1] }] },
        {
          type: 'message',
          content: [{
            type: 'output_text',
            text: '{}',
            annotations: [
              { type: 'url_citation', url: sourceUrls[0] },
              { type: 'url_citation', url_citation: { url: sourceUrls[1] } }
            ]
          }]
        }
      ]
    };
    assert.deepEqual(extractStageSixProtectedUrls(response), sourceUrls);
  });

  await t.test('5. an accepted URL cannot be used for the wrong task', async () => {
    const session = acceptedSession();
    const invalid = structuredClone(proposal);
    invalid.tasks[0].consoleSteps[0].sourceUrls = [sourceUrls[1]];
    await assert.rejects(
      requestStageSixInstructions({
        session,
        acceptedSources: acceptedSources(session),
        blueprint: acceptedBlueprint(session),
        apiKey: 'private-test-key',
        fetchImpl: async () => apiResponse(invalid)
      }),
      /outside its accepted task boundary/
    );
  });

  await t.test('6. Stage 6 saves only local instruction files and stops before Stage 7', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step84-'));
    try {
      const session = acceptedSession();
      await saveAuthorAssistantSession({ sessionRoot: root, session, researchRequest: buildAwsResearchRequest({ ...session, status: 'input_complete' }) });
      const document = await requestStageSixInstructions({
        session,
        acceptedSources: acceptedSources(session),
        blueprint: acceptedBlueprint(session),
        apiKey: 'private-test-key',
        fetchImpl: async () => apiResponse()
      });
      const saved = await saveAuthorAssistantStageSixInstructions({
        sessionRoot: root,
        session,
        instructions: document,
        previewText: formatStageSixPreview(document),
        now: () => new Date('2026-08-10T10:15:00.000Z')
      });
      const loaded = await loadAuthorAssistantSession(root, session.sessionId);
      assert.equal(loaded.session.status, 'stage_6_ready_for_review');
      assert.deepEqual(loaded.session.boundaries.authorStagesPrepared, [1, 2, 3, 4, 5, 6]);
      assert.equal(loaded.session.boundaries.stage6Prepared, true);
      assert.equal(loaded.session.boundaries.stage7Prepared, false);
      assert.equal(loaded.session.boundaries.authorDraftWritten, false);
      assert.equal(loaded.session.boundaries.awsConnected, false);
      assert.equal(loaded.session.boundaries.supabaseConnected, false);
      assert.match(await readFile(saved.previewPath, 'utf8'), /Stages 7-12 have not been prepared/);
      assert.equal(loaded.stageSixInstructions.sessionId, session.sessionId);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('7. changed safety boundaries prevent Stage 6', () => {
    const session = acceptedSession();
    const blueprint = acceptedBlueprint(session);
    blueprint.stageBoundary.writtenToAuthor = true;
    assert.throws(
      () => buildStageSixPayload(session, acceptedSources(session), blueprint),
      /safety boundary changed/
    );
  });

  await t.test('8. implementation contains no service-specific production instructions or write path', async () => {
    const implementation = await readFile(new URL('../scripts/author-assistant/authorAssistantInstructions.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(implementation, /Amazon Simple Queue Service|\bSQS\b|sqs:/);
    assert.doesNotMatch(implementation, /storeNewAuthorDraft|saveAuthorDraft|from ['"]aws-sdk|@aws-sdk/);
  });
});
