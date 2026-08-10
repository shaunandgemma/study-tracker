import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildAwsResearchRequest, loadAuthorAssistantSession, saveAuthorAssistantSession } from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildStageSevenDocument,
  buildStageSevenEvidenceRetryPayload,
  buildStageSevenPayload,
  formatStageSevenPreview,
  getStageSevenConsoleSourceUrls,
  requestStageSevenResourcesChecks,
  saveStageSevenResourcesChecks,
  validateStage85Inputs
} from '../scripts/author-assistant/authorAssistantResourcesChecks.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-generic-step85-test';
const urls = Array.from({ length: 6 }, (_, index) => `https://docs.aws.amazon.com/service/task-${index + 1}.html`);

function supportRecords() {
  return {
    acceptedSources: { schemaVersion: 1, status: 'accepted', sessionId, sources: urls.map((url, index) => ({ documentTitle: `Source ${index + 1}`, url })), manualReviewFindings: ['Keep IAM review active.'] },
    blueprint: {
      schemaVersion: 1,
      status: 'human_accepted',
      sessionId,
      generatedAt: '2026-08-10T10:00:00.000Z',
      sources: urls.map((url, index) => ({ id: `source-${index + 1}`, title: `Source ${index + 1}`, url, purpose: 'Task evidence', taskIds: [`task-${index + 1}`] })),
      tasks: urls.map((url, index) => ({ id: `task-${index + 1}`, title: `Task ${index + 1}`, goal: `Complete task ${index + 1}`, region: 'eu-west-2', sourceIds: [`source-${index + 1}`] }))
    },
    blueprintAcceptance: { schemaVersion: 1, status: 'accepted', sessionId },
    sourceAmendment84B: { schemaVersion: 1, status: 'applied_locally', approvalStep: '84B', sessionId },
    consistencyCorrection84C: { schemaVersion: 1, status: 'applied_locally', approvalStep: '84C', sessionId }
  };
}

function acceptedInputs() {
  const records = supportRecords();
  const instructions = {
    schemaVersion: 1,
    kind: 'author_stage_6_local_instructions',
    status: 'human_accepted',
    sessionId,
    acceptanceFingerprint: { algorithm: 'sha256-json-v1', value: '' },
    stageBoundary: { preparedLocally: [6], notPrepared: [7, 8, 9, 10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    tasks: records.blueprint.tasks.map((task, index) => ({
      taskId: task.id,
      title: task.title,
      status: 'prepared',
      consoleSteps: [{ id: `step-${index + 1}`, title: `Do task ${index + 1}`, instructions: [{ id: `item-${index + 1}`, text: `Perform action ${index + 1}.`, detail: '' }], expectedResult: `Task ${index + 1} is visible.`, sourceIds: [`source-${index + 1}`] }],
      cliSteps: []
    })),
    protectedSourceUrlsUsed: [...urls],
    manualReviewFindings: ['Keep IAM review active.'],
    boundaryAlignment: { futureCliGuidance: { 'task-2': 'A future CLI path may use the saved service URL.' } }
  };
  const content = { tasks: instructions.tasks, protectedSourceUrlsUsed: instructions.protectedSourceUrlsUsed, manualReviewFindings: instructions.manualReviewFindings, boundaryAlignment: instructions.boundaryAlignment };
  instructions.acceptanceFingerprint.value = fingerprintJson(content);
  const acceptance = {
    schemaVersion: 1,
    status: 'accepted',
    approvalStep: '84D',
    sessionId,
    instructionFingerprint: { algorithm: 'sha256-json-v1', value: instructions.acceptanceFingerprint.value },
    supportFingerprints: Object.fromEntries(Object.entries(records).map(([key, value]) => [key, fingerprintJson(value)]))
  };
  const session = {
    schemaVersion: 1,
    sessionId,
    status: 'stage_6_accepted',
    currentStep: 'local_stage_6_instructions_accepted',
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-08-10T12:00:00.000Z',
    inputs: { serviceName: 'Amazon Example Service', shortName: 'EXAMPLE', learnerLevel: 'Beginner', buildOutcome: 'Build a safe example', preferredRegion: 'eu-west-2' },
    boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6], authorDraftWritten: false, stage6Prepared: true, stage6Accepted: true, stage7Prepared: false, awsConnected: false, supabaseConnected: false, candidatePrepared: false, published: false }
  };
  return { session, acceptedSources: records.acceptedSources, blueprint: records.blueprint, instructions, acceptance, supportRecords: records };
}

function proposal() {
  return {
    resources: [{
      taskId: 'task-2',
      label: 'Service URL',
      type: 'other',
      description: 'Save the generated service URL for the future command-line path.',
      required: false,
      captureInstruction: 'Copy the displayed service URL.',
      reusedByTaskIds: [],
      neededForFutureCli: true,
      neededForStage8Cleanup: false,
      sourceUrls: [urls[1]]
    }],
    taskChecks: urls.map((url, index) => ({
      taskId: `task-${index + 1}`,
      checks: [{ title: `Check task ${index + 1}`, instruction: `Inspect the Console result for task ${index + 1}.`, expectedResult: `The task ${index + 1} result is visible.`, mode: 'console', sourceUrls: [url] }]
    })),
    manualReviewFindings: []
  };
}

function apiResponse(value = proposal()) {
  return {
    id: 'resp-stage85',
    output: [
      { type: 'web_search_call', action: { type: 'open_page', sources: urls.map(url => ({ url })) } },
      { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(value) }] }
    ]
  };
}

test('Step 85 local Stage 7 resources and checks', async t => {
  await t.test('1. only a complete fingerprint-verified Stages 1-6 package is accepted', () => {
    const inputs = acceptedInputs();
    assert.equal(validateStage85Inputs(inputs), true);
    inputs.instructions.tasks[0].consoleSteps[0].expectedResult = 'Changed after acceptance.';
    assert.throws(() => validateStage85Inputs(inputs), /fingerprint no longer matches/);
  });

  await t.test('2. request is service-independent, accepted-source-only and Console-only', () => {
    const inputs = acceptedInputs();
    const payload = buildStageSevenPayload(inputs.session, inputs.acceptedSources, inputs.blueprint, inputs.instructions, inputs.acceptance, inputs.supportRecords);
    assert.equal(payload.tool_choice, 'required');
    assert.deepEqual(payload.tools[0].filters.allowed_domains, ['docs.aws.amazon.com']);
    assert.deepEqual(payload.text.format.schema.properties.taskChecks.items.properties.checks.items.properties.mode.enum, ['console']);
    assert.match(payload.instructions, /resource capture only when/i);
    assert.match(payload.instructions, /Do not write CLI commands/i);
    assert.match(payload.instructions, /Stage 8 cleanup is outside/i);
    assert.doesNotMatch(payload.input, /SQS|Lambda/);
  });

  await t.test('3. Author-compatible resources and separate verification objects are prepared locally', () => {
    const inputs = acceptedInputs();
    const document = buildStageSevenDocument({ ...inputs, proposal: proposal(), protectedUrls: urls, now: () => new Date('2026-08-10T13:00:00.000Z') });
    assert.equal(document.resources.schema.length, 1);
    assert.equal(document.resources.schema[0].key, 'resource-service-url');
    assert.equal(document.tasks.length, 6);
    assert.equal(document.tasks.every(task => task.verification.length === 1), true);
    assert.equal(document.tasks.every(task => task.verification.every(check => check.mode === 'console')), true);
    assert.equal(document.futureCliBoundary.prepared, false);
    assert.equal(document.consoleBoundary.cliCommandsPrepared, false);
    assert.deepEqual(document.stageBoundary.notPrepared, [8, 9, 10, 11, 12]);
  });

  await t.test('4. unnecessary resources, CLI commands and unprotected evidence are rejected', () => {
    const inputs = acceptedInputs();
    const unnecessary = proposal();
    unnecessary.resources[0].neededForFutureCli = false;
    assert.throws(() => buildStageSevenDocument({ ...inputs, proposal: unnecessary, protectedUrls: urls }), /genuine later use/);
    const cli = proposal();
    cli.taskChecks[0].checks[0].instruction = 'Run aws example describe-items.';
    assert.throws(() => buildStageSevenDocument({ ...inputs, proposal: cli, protectedUrls: urls }), /CLI commands/);
    assert.throws(() => buildStageSevenDocument({ ...inputs, proposal: proposal(), protectedUrls: urls.slice(1) }), /not returned by protected/);
  });

  await t.test('5. protected research response produces a review-only Stage 7 document', async () => {
    const inputs = acceptedInputs();
    let request;
    const document = await requestStageSevenResourcesChecks({
      ...inputs,
      apiKey: 'test-key',
      fetchImpl: async (_url, options) => { request = JSON.parse(options.body); return { ok: true, json: async () => apiResponse() }; },
      now: () => new Date('2026-08-10T13:05:00.000Z')
    });
    assert.equal(request.store, false);
    assert.equal(document.status, 'awaiting_human_stage_7_review');
    assert.equal(document.stageBoundary.connectedToAws, false);
    assert.equal(document.stageBoundary.writtenToAuthor, false);
  });

  await t.test('6. save writes only Stage 7 review files and stops before Stage 8', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step85-'));
    try {
      const inputs = acceptedInputs();
      await saveAuthorAssistantSession({ sessionRoot: root, session: inputs.session, researchRequest: buildAwsResearchRequest({ ...inputs.session, status: 'input_complete' }) });
      const document = buildStageSevenDocument({ ...inputs, proposal: proposal(), protectedUrls: urls });
      const saved = await saveStageSevenResourcesChecks({ sessionRoot: root, existingSession: inputs.session, document, previewText: formatStageSevenPreview(document), now: () => new Date('2026-08-10T13:10:00.000Z') });
      const loaded = await loadAuthorAssistantSession(root, sessionId);
      assert.equal(loaded.session.status, 'stage_7_ready_for_review');
      assert.equal(loaded.session.boundaries.stage7Prepared, true);
      assert.equal(loaded.session.boundaries.stage8Prepared, false);
      assert.equal(loaded.session.boundaries.authorDraftWritten, false);
      assert.equal(loaded.stageSevenResourcesChecks.status, 'awaiting_human_stage_7_review');
      assert.match(await readFile(saved.previewPath, 'utf8'), /Stage 8 cleanup prepared: no/);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('7. secure command and launcher are dedicated to Step 85', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/prepareStage85.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /from ['"]@supabase|from ['"]aws-sdk|saveAuthorDraft\s*\(/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:stage-85:secure'], 'powershell -NoProfile -ExecutionPolicy Bypass -File scripts/author-assistant/startStage85.ps1');
  });

  await t.test('8. CLI reference pages are excluded from the Stage 7 Console source boundary', () => {
    const consoleUrl = 'https://docs.aws.amazon.com/service/console-guide.html';
    const cliUrl = 'https://docs.aws.amazon.com/cli/latest/reference/service/action.html';
    const acceptedSources = { sources: [{ url: consoleUrl }, { url: cliUrl }] };
    const blueprint = {
      sources: [
        { id: 'console', url: consoleUrl, taskIds: ['task-1'] },
        { id: 'cli', url: cliUrl, taskIds: ['task-1'] }
      ],
      tasks: [{ id: 'task-1', sourceIds: ['console', 'cli'] }]
    };
    const instructions = { protectedSourceUrlsUsed: [consoleUrl, cliUrl] };
    assert.deepEqual(getStageSevenConsoleSourceUrls(acceptedSources, blueprint, instructions), [consoleUrl]);
  });

  await t.test('9. one targeted retry can supply missing eligible protected evidence', async () => {
    const inputs = acceptedInputs();
    const first = apiResponse();
    first.output[0].action.sources = urls.slice(0, -1).map(url => ({ url }));
    const retry = {
      id: 'resp-stage85-retry',
      output: [
        { type: 'web_search_call', action: { type: 'open_page', sources: [{ url: urls.at(-1) }] } },
        { type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ checkedUrls: [urls.at(-1)] }) }] }
      ]
    };
    const requests = [];
    const document = await requestStageSevenResourcesChecks({
      ...inputs,
      apiKey: 'test-key',
      fetchImpl: async (_url, options) => {
        requests.push(JSON.parse(options.body));
        return { ok: true, json: async () => requests.length === 1 ? first : retry };
      }
    });
    assert.equal(requests.length, 2);
    assert.match(requests[1].instructions, /one protected evidence check/i);
    assert.equal(document.evidence.protectedSourceUrls.includes(urls.at(-1)), true);
  });

  await t.test('10. a failed single retry reports the exact missing URL', async () => {
    const inputs = acceptedInputs();
    const first = apiResponse();
    first.output[0].action.sources = urls.slice(0, -1).map(url => ({ url }));
    const emptyRetry = {
      id: 'resp-stage85-empty-retry',
      output: [
        { type: 'web_search_call', action: { type: 'open_page', sources: [] } },
        { type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ checkedUrls: [] }) }] }
      ]
    };
    let calls = 0;
    await assert.rejects(
      requestStageSevenResourcesChecks({
        ...inputs,
        apiKey: 'test-key',
        fetchImpl: async () => ({ ok: true, json: async () => ++calls === 1 ? first : emptyRetry })
      }),
      new RegExp(`one targeted retry: ${urls.at(-1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
    );
    assert.equal(calls, 2);
  });

  await t.test('11. retry payload contains only the exact missing accepted URLs', () => {
    const payload = buildStageSevenEvidenceRetryPayload([urls[0], urls[0], urls[1]]);
    assert.deepEqual(payload.text.format.schema.properties.checkedUrls.items.enum, [urls[0], urls[1]]);
    assert.match(payload.input, new RegExp(urls[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.doesNotMatch(payload.input, /cli\/latest\/reference/);
  });
});
