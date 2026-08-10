import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildAuthorAssistantSession,
  buildAwsResearchRequest,
  consolidateDuplicateReviewFindings,
  loadAuthorAssistantSession,
  saveAuthorAssistantBlueprint,
  saveAuthorAssistantBlueprintAcceptance,
  saveAuthorAssistantSession
} from '../scripts/author-assistant/authorAssistantCore.mjs';

const now = value => () => new Date(value);

function makeSession() {
  return buildAuthorAssistantSession({
    serviceName: 'Amazon Test Service',
    shortName: 'ATS',
    learnerLevel: 'Beginner',
    buildOutcome: 'Build and test a safe example',
    preferredRegion: 'eu-west-2'
  }, { now: now('2026-08-10T08:00:00.000Z'), idFactory: () => 'step83a-session' });
}

function makeBlueprint(session) {
  return {
    schemaVersion: 1,
    kind: 'author_stages_1_to_5_blueprint',
    status: 'awaiting_human_blueprint_review',
    sessionId: session.sessionId,
    stageBoundary: {
      preparedLocally: [1, 2, 3, 4, 5],
      notPrepared: [6, 7, 8, 9, 10, 11, 12],
      writtenToAuthor: false,
      connectedToSupabase: false,
      connectedToAws: false,
      candidatePrepared: false,
      published: false
    },
    manualReviewFindings: ['Full Region note.', 'Full permissions note.', 'Repeated Region note.', 'Distinct cleanup note.']
  };
}

test('Step 83A local blueprint acceptance', async t => {
  await t.test('1. only explicitly grouped duplicate findings are removed', () => {
    const result = consolidateDuplicateReviewFindings(
      ['Full Region note.', 'Full permissions note.', 'Repeated Region note.', 'Distinct cleanup note.'],
      [[0, 2]]
    );
    assert.deepEqual(result.findings, ['Full Region note.', 'Full permissions note.', 'Distinct cleanup note.']);
    assert.equal(result.removedCount, 1);
    assert.equal(result.audit[0].removedFindings[0], 'Repeated Region note.');
  });

  await t.test('2. acceptance is local, audited and preserves every safety boundary', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step83a-'));
    try {
      const initialSession = makeSession();
      await saveAuthorAssistantSession({
        sessionRoot: root,
        session: initialSession,
        researchRequest: buildAwsResearchRequest(initialSession)
      });
      const pendingBlueprint = makeBlueprint(initialSession);
      const savedBlueprint = await saveAuthorAssistantBlueprint({
        sessionRoot: root,
        session: initialSession,
        blueprint: pendingBlueprint,
        previewText: 'Local preview only.\n',
        now: now('2026-08-10T08:05:00.000Z')
      });
      const result = await saveAuthorAssistantBlueprintAcceptance({
        sessionRoot: root,
        session: savedBlueprint.session,
        blueprint: pendingBlueprint,
        duplicateGroups: [[0, 2]],
        now: now('2026-08-10T08:10:00.000Z')
      });
      const loaded = await loadAuthorAssistantSession(root, initialSession.sessionId);
      assert.equal(result.blueprint.status, 'human_accepted');
      assert.equal(loaded.session.status, 'blueprint_accepted');
      assert.equal(loaded.blueprintAcceptance.status, 'accepted');
      assert.equal(loaded.blueprintAcceptance.reviewConsolidation.removedDuplicateCount, 1);
      assert.equal(loaded.blueprint.manualReviewFindings.length, 3);
      assert.equal(loaded.session.boundaries.authorDraftWritten, false);
      assert.equal(loaded.session.boundaries.stage6Prepared, false);
      assert.equal(loaded.session.boundaries.awsConnected, false);
      assert.equal(loaded.session.boundaries.supabaseConnected, false);
      assert.equal(loaded.session.boundaries.candidatePrepared, false);
      assert.equal(loaded.session.boundaries.published, false);
      assert.doesNotMatch(await readFile(result.acceptancePath, 'utf8'), /api[_-]?key/i);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('3. changed boundaries stop acceptance before files are written', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step83a-boundary-'));
    try {
      const session = {
        ...makeSession(),
        status: 'blueprint_ready_for_review',
        boundaries: { ...makeSession().boundaries, authorStagesPrepared: [1, 2, 3, 4, 5], authorDraftWritten: false, stage6Prepared: false }
      };
      const blueprint = makeBlueprint(session);
      blueprint.stageBoundary.writtenToAuthor = true;
      await assert.rejects(
        saveAuthorAssistantBlueprintAcceptance({ sessionRoot: root, session, blueprint }),
        /safety boundary changed/
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('4. the same pending blueprint cannot be accepted twice', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step83a-repeat-'));
    try {
      const session = { ...makeSession(), status: 'blueprint_accepted' };
      await assert.rejects(
        saveAuthorAssistantBlueprintAcceptance({ sessionRoot: root, session, blueprint: makeBlueprint(session) }),
        /waiting for human review/
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('5. the runner reports an accepted blueprint without starting Stage 6', async () => {
    const runner = await readFile(new URL('../scripts/author-assistant/authorAssistant.mjs', import.meta.url), 'utf8');
    assert.match(runner, /STEPS 80 TO 84/);
    assert.match(runner, /has been human accepted/);
    assert.match(runner, /author-stages-1-5-acceptance\.json/);
    assert.match(runner, /Stage 6 has not started/);
  });
});
