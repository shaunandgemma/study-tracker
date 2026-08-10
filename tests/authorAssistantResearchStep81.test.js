import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAuthorAssistantSession,
  buildAwsResearchRequest,
  loadAuthorAssistantSession,
  saveAuthorAssistantAcceptedSources,
  saveAuthorAssistantResearchResult,
  saveAuthorAssistantSession
} from '../scripts/author-assistant/authorAssistantCore.mjs';
import {
  buildAcceptedSourcesDocument,
  buildOpenAiResearchPayload,
  buildProtectedSourceCorrectionPayload,
  formatOpenAiRequestError,
  requestAwsDocumentationResearch
} from '../scripts/author-assistant/authorAssistantResearch.mjs';

const input = {
  serviceName: 'Amazon Simple Queue Service',
  shortName: 'SQS',
  learnerLevel: 'Beginner',
  buildOutcome: 'Build and test a basic message queue safely.',
  preferredRegion: 'eu-west-2'
};

function sessionAndRequest() {
  const session = buildAuthorAssistantSession(input, {
    now: () => new Date('2026-08-09T12:00:00.000Z'),
    idFactory: () => 'step81-session'
  });
  return { session, request: buildAwsResearchRequest(session) };
}

const sourceRows = [
  {
    sourceType: 'service_guide',
    documentTitle: 'Amazon SQS Developer Guide',
    url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html',
    supports: ['Console setup'],
    whyThisSourceApplies: 'It documents the service workflow.'
  },
  {
    sourceType: 'cli_reference',
    documentTitle: 'AWS CLI SQS Reference',
    url: 'https://docs.aws.amazon.com/cli/latest/reference/sqs/index.html',
    supports: ['CLI commands'],
    whyThisSourceApplies: 'It documents SQS commands and parameters.'
  },
  {
    sourceType: 'service_authorization',
    documentTitle: 'Actions for Amazon SQS',
    url: 'https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonsqs.html',
    supports: ['IAM permissions'],
    whyThisSourceApplies: 'It documents SQS actions and resource types.'
  }
];

function successfulApiResponse(proposal = { summary: 'Official SQS sources found.', proposedSources: sourceRows, manualReviewFindings: [] }) {
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        id: 'resp_step81',
        output: [
          { type: 'web_search_call', action: { sources: sourceRows.map(source => ({ title: source.documentTitle, url: source.url })) } },
          { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(proposal), annotations: [] }] }
        ]
      };
    }
  };
}

function structuredApiResponse(proposal, id = 'resp_correction') {
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        id,
        output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(proposal), annotations: [] }] }]
      };
    }
  };
}

test('Step 81 read-only AWS documentation research', async t => {
  await t.test('1. the API payload allows exactly docs.aws.amazon.com', () => {
    const { request } = sessionAndRequest();
    const payload = buildOpenAiResearchPayload(request);
    assert.deepEqual(payload.tools, [{ type: 'web_search', filters: { allowed_domains: ['docs.aws.amazon.com'] } }]);
    assert.deepEqual(payload.include, ['web_search_call.action.sources']);
    assert.equal(payload.store, false);
    assert.equal(payload.text.format.type, 'json_schema');
    assert.equal(payload.text.format.strict, true);
  });

  await t.test('2. a missing key stops before any network request', async () => {
    const { request } = sessionAndRequest();
    let called = false;
    await assert.rejects(
      requestAwsDocumentationResearch({ researchRequest: request, apiKey: '', fetchImpl: async () => { called = true; } }),
      /OPENAI_API_KEY/
    );
    assert.equal(called, false);
  });

  await t.test('3. the key stays in the Authorization header and is not written into the payload', async () => {
    const { request } = sessionAndRequest();
    let captured;
    await requestAwsDocumentationResearch({
      researchRequest: request,
      apiKey: 'test-secret-key',
      fetchImpl: async (url, options) => { captured = { url, options }; return successfulApiResponse(); },
      now: () => new Date('2026-08-09T13:00:00.000Z')
    });
    assert.equal(captured.options.headers.Authorization, 'Bearer test-secret-key');
    assert.doesNotMatch(captured.options.body, /test-secret-key/);
  });

  await t.test('3A. correction permits only exact URLs returned by protected search', () => {
    const { request } = sessionAndRequest();
    const protectedSources = sourceRows.map(source => ({ title: source.documentTitle, url: source.url }));
    const payload = buildProtectedSourceCorrectionPayload(request, protectedSources);
    assert.equal(payload.tools, undefined);
    assert.equal(payload.store, false);
    assert.deepEqual(
      payload.text.format.schema.properties.proposedSources.items.properties.url.enum,
      sourceRows.map(source => source.url)
    );
    assert.doesNotMatch(payload.input, /example\.com/);
  });

  await t.test('3B. a rewritten URL is corrected once using only the protected source list', async () => {
    const { request } = sessionAndRequest();
    const rewrittenRows = sourceRows.map((source, index) => index
      ? source
      : { ...source, url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/' });
    let calls = 0;
    const result = await requestAwsDocumentationResearch({
      researchRequest: request,
      apiKey: 'test-key',
      fetchImpl: async (_url, options) => {
        calls += 1;
        if (calls === 1) return successfulApiResponse({ summary: 'Needs URL correction.', proposedSources: rewrittenRows, manualReviewFindings: [] });
        const correctionPayload = JSON.parse(options.body);
        assert.equal(correctionPayload.tools, undefined);
        assert.equal(options.headers.Authorization, 'Bearer test-key');
        assert.doesNotMatch(options.body, /test-key/);
        assert.deepEqual(
          correctionPayload.text.format.schema.properties.proposedSources.items.properties.url.enum,
          sourceRows.map(source => source.url)
        );
        return structuredApiResponse({ summary: 'Protected SQS sources selected.', proposedSources: sourceRows, manualReviewFindings: [] });
      },
      now: () => new Date('2026-08-09T13:00:00.000Z')
    });
    assert.equal(calls, 2);
    assert.equal(result.protectedSourceCorrectionApplied, true);
    assert.equal(result.protectedSourceCorrectionResponseId, 'resp_correction');
    assert.deepEqual(result.proposedSources.map(source => source.url), sourceRows.map(source => source.url));
  });

  await t.test('3C. exact protected sources do not incur a correction request', async () => {
    const { request } = sessionAndRequest();
    let calls = 0;
    const result = await requestAwsDocumentationResearch({
      researchRequest: request,
      apiKey: 'test-key',
      fetchImpl: async () => { calls += 1; return successfulApiResponse(); }
    });
    assert.equal(calls, 1);
    assert.equal(result.protectedSourceCorrectionApplied, false);
    assert.equal(result.protectedSourceCorrectionResponseId, '');
  });

  await t.test('4. an outside-domain source is rejected', async () => {
    const { request } = sessionAndRequest();
    const unsafeRows = sourceRows.map((source, index) => index ? source : { ...source, url: 'https://example.com/fake-aws-guide' });
    await assert.rejects(
      requestAwsDocumentationResearch({
        researchRequest: request,
        apiKey: 'test-key',
        fetchImpl: async () => successfulApiResponse({ summary: 'Unsafe', proposedSources: unsafeRows, manualReviewFindings: [] })
      }),
      /outside docs\.aws\.amazon\.com/
    );
  });

  await t.test('5. a correction still rejects a URL not returned by protected web search', async () => {
    const { request } = sessionAndRequest();
    const uncited = sourceRows.map((source, index) => index ? source : { ...source, url: 'https://docs.aws.amazon.com/fake/page.html' });
    let calls = 0;
    await assert.rejects(
      requestAwsDocumentationResearch({
        researchRequest: request,
        apiKey: 'test-key',
        fetchImpl: async () => {
          calls += 1;
          if (calls === 1) return successfulApiResponse({ summary: 'Uncited', proposedSources: uncited, manualReviewFindings: [] });
          return structuredApiResponse({ summary: 'Still uncited', proposedSources: uncited, manualReviewFindings: [] });
        }
      }),
      /not returned by the protected web search/
    );
    assert.equal(calls, 2);
  });

  await t.test('6. accepted and rejected source choices remain explicit', async () => {
    const { request } = sessionAndRequest();
    const result = await requestAwsDocumentationResearch({
      researchRequest: request,
      apiKey: 'test-key',
      fetchImpl: async () => successfulApiResponse(),
      now: () => new Date('2026-08-09T13:00:00.000Z')
    });
    const accepted = buildAcceptedSourcesDocument(result, [sourceRows[0].url, sourceRows[2].url], {
      now: () => new Date('2026-08-09T13:05:00.000Z')
    });
    assert.equal(accepted.sources.length, 2);
    assert.deepEqual(accepted.rejectedSourceUrls, [sourceRows[1].url]);
  });

  await t.test('7. research and acceptance save into the same session without preparing Author stages', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step81-'));
    try {
      const { session, request } = sessionAndRequest();
      await saveAuthorAssistantSession({ sessionRoot: root, session, researchRequest: request });
      const result = await requestAwsDocumentationResearch({
        researchRequest: request,
        apiKey: 'test-key',
        fetchImpl: async () => successfulApiResponse(),
        now: () => new Date('2026-08-09T13:00:00.000Z')
      });
      const researched = await saveAuthorAssistantResearchResult({ sessionRoot: root, session, researchResult: result });
      const accepted = buildAcceptedSourcesDocument(result, sourceRows.map(source => source.url));
      await saveAuthorAssistantAcceptedSources({ sessionRoot: root, session: researched.session, acceptedSources: accepted });
      const loaded = await loadAuthorAssistantSession(root, session.sessionId);
      assert.equal(loaded.session.status, 'sources_accepted');
      assert.equal(loaded.researchResult.sessionId, session.sessionId);
      assert.equal(loaded.acceptedSources.sources.length, 3);
      assert.deepEqual(loaded.session.boundaries.authorStagesPrepared, []);
      assert.equal(loaded.session.boundaries.awsConnected, false);
      assert.equal(loaded.session.boundaries.supabaseConnected, false);
      assert.equal(loaded.session.boundaries.candidatePrepared, false);
      assert.equal(loaded.session.boundaries.published, false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('8. billing and rate-limit errors provide safe specific guidance', async () => {
    assert.match(formatOpenAiRequestError(429, { code: 'credit_balance_exhausted' }), /Add API credits/);
    assert.match(formatOpenAiRequestError(429, { code: 'project_spend_limit_exceeded' }), /project spend limit/);
    assert.match(formatOpenAiRequestError(429, { type: 'insufficient_quota' }), /API quota is unavailable/);
    assert.match(formatOpenAiRequestError(429, { code: 'rate_limit_exceeded' }), /Wait before retrying/);
  });

  await t.test('9. an API error body is reduced to its safe code and guidance', async () => {
    const { request } = sessionAndRequest();
    await assert.rejects(
      requestAwsDocumentationResearch({
        researchRequest: request,
        apiKey: 'test-key',
        fetchImpl: async () => ({
          ok: false,
          status: 429,
          async json() {
            return { error: { code: 'credit_balance_exhausted', type: 'insufficient_quota', message: 'raw provider message' } };
          }
        })
      }),
      error => {
        assert.match(error.message, /code credit_balance_exhausted/);
        assert.match(error.message, /Add API credits/);
        assert.doesNotMatch(error.message, /raw provider message/);
        return true;
      }
    );
  });
});
