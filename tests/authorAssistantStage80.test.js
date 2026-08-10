import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  AUTHOR_ASSISTANT_ALLOWED_DOMAINS,
  buildAuthorAssistantSession,
  buildAwsResearchRequest,
  findLatestAuthorAssistantSession,
  loadAuthorAssistantSession,
  saveAuthorAssistantSession,
  validateAuthorAssistantInput
} from '../scripts/author-assistant/authorAssistantCore.mjs';

const validInput = {
  serviceName: 'AWS Lambda',
  shortName: 'Lambda',
  learnerLevel: 'Beginner',
  buildOutcome: 'Build and test a small serverless function.',
  preferredRegion: 'eu-west-2'
};

function deterministicSession(input = validInput, timestamp = '2026-08-09T12:00:00.000Z') {
  return buildAuthorAssistantSession(input, {
    now: () => new Date(timestamp),
    idFactory: () => 'test-session-id'
  });
}

test('Step 80 Author Assistant foundation', async t => {
  await t.test('1. valid answers produce a pending read-only research request', () => {
    const session = deterministicSession();
    const request = buildAwsResearchRequest(session);
    assert.equal(session.status, 'input_complete');
    assert.equal(request.status, 'pending_research');
    assert.equal(request.service.officialName, 'AWS Lambda');
    assert.equal(request.authorBoundary.stopBeforeStage, 12);
    assert.deepEqual(session.boundaries.authorStagesPrepared, []);
    assert.equal(session.boundaries.aiCalled, false);
    assert.equal(session.boundaries.awsConnected, false);
    assert.equal(session.boundaries.supabaseConnected, false);
  });

  await t.test('2. missing or invalid answers are rejected before saving', () => {
    const result = validateAuthorAssistantInput({ serviceName: 'AWS Lambda' });
    assert.equal(result.valid, false);
    assert.ok(result.errors.length >= 4);
    assert.throws(() => deterministicSession({ ...validInput, preferredRegion: 'London' }), /AWS Region/);
  });

  await t.test('3. research is restricted to exactly the official AWS Docs domain', () => {
    const request = buildAwsResearchRequest(deterministicSession());
    assert.deepEqual(AUTHOR_ASSISTANT_ALLOWED_DOMAINS, ['docs.aws.amazon.com']);
    assert.deepEqual(request.allowedDomains, ['docs.aws.amazon.com']);
  });

  await t.test('4. a saved session and research request can be loaded again', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step80-'));
    try {
      const session = deterministicSession();
      const request = buildAwsResearchRequest(session);
      const saved = await saveAuthorAssistantSession({ sessionRoot: root, session, researchRequest: request });
      const loaded = await loadAuthorAssistantSession(root, session.sessionId);
      assert.deepEqual(loaded.session, session);
      assert.deepEqual(loaded.researchRequest, request);
      assert.match(await readFile(saved.sessionPath, 'utf8'), /"input_complete"/);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('5. resume finds the same latest session instead of creating another', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-resume-'));
    try {
      const session = deterministicSession();
      await saveAuthorAssistantSession({ sessionRoot: root, session, researchRequest: buildAwsResearchRequest(session) });
      const latest = await findLatestAuthorAssistantSession(root);
      assert.equal(latest.session.sessionId, session.sessionId);
      assert.equal(latest.researchRequest.sessionId, session.sessionId);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('6. the foundation has no external service or command-execution imports', async () => {
    const core = await readFile(new URL('../scripts/author-assistant/authorAssistantCore.mjs', import.meta.url), 'utf8');
    const cli = await readFile(new URL('../scripts/author-assistant/authorAssistant.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(`${core}\n${cli}`, /from ['"](?:@supabase|openai|aws-sdk|@aws-sdk|node:child_process)/);
    assert.doesNotMatch(`${core}\n${cli}`, /Prepare Candidate|PUBLISH [A-Z]|learner.progress/i);
  });
});
