import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { saveAuthorAssistantStage87AAcceptance } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { buildStage87ALocalAcceptance, validateStage87AAcceptanceInputs, verifyStage87AAcceptanceFingerprint } from '../scripts/author-assistant/authorAssistantStage87A.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step87a-test';

function fixture() {
  const supportingRecords = {
    acceptedSources: { id: 1 }, blueprint: { id: 2 }, blueprintAcceptance: { id: 3 }, sourceAmendment84B: { id: 4 }, consistencyCorrection84C: { id: 5 }, stageSix: { id: 6 }, stageSixAcceptance: { id: 7 }, stageSeven: { id: 8 }, stageSevenAcceptance: { id: 9 }, stageEight: { id: 10, acceptanceFingerprint: { value: 'stage-eight-fingerprint' } }, stageEightAcceptance: { id: 11 }
  };
  const supportingFingerprints = Object.fromEntries(Object.entries(supportingRecords).map(([key, value]) => [key, fingerprintJson(value)]));
  const stageNine = {
    schemaVersion: 1,
    kind: 'author_stage_9_local_authoring_check',
    status: 'passed_awaiting_human_review',
    sessionId,
    checkedAt: '2026-08-10T19:00:00.000Z',
    basedOnStage8Fingerprint: { algorithm: 'sha256-json-v1', value: 'stage-eight-fingerprint' },
    stageBoundary: { preparedLocally: [9], notPrepared: [10, 11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    checks: {
      planning: { valid: true, errors: [], warnings: [] },
      content: { valid: true, errors: [], warnings: [] },
      encoding: { valid: true, errors: [] },
      packageIntegrity: { valid: true, supportingFingerprints },
      iamLimitation: { active: true, finding: 'Use access already authorized by an administrator.' }
    },
    summary: { passed: true, errorCount: 0, warningCount: 1, retainedFindingCount: 1, taskCount: 6, checkboxCount: 24, verificationCheckCount: 7, cleanupItemCount: 4, resourceValueCount: 0 },
    errors: [],
    warnings: [],
    retainedManualReviewFindings: ['Use access already authorized by an administrator.'],
    acceptedStagesOneToEightChanged: false
  };
  const session = { sessionId, status: 'stage_9_ready_for_review', boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9], stage9Prepared: true, stage10Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false } };
  return { session, stageNine, supportingRecords };
}

test('Step 87A local Stage 9 acceptance', async t => {
  await t.test('1. passed report receives a deterministic SHA-256 fingerprint', () => {
    const accepted = buildStage87ALocalAcceptance({ ...fixture(), now: () => new Date('2026-08-10T19:05:00Z') });
    assert.equal(accepted.stageNine.status, 'human_accepted');
    assert.match(accepted.acceptance.stageNineFingerprint.value, /^[a-f0-9]{64}$/);
    assert.equal(verifyStage87AAcceptanceFingerprint(accepted.stageNine, accepted.acceptance), true);
    assert.equal(accepted.acceptance.acceptedSummary.checkboxCount, 24);
  });

  await t.test('2. reviewed Stage 9 report content remains exact', () => {
    const original = fixture();
    const accepted = buildStage87ALocalAcceptance(original);
    const { status, acceptedAt, acceptanceFingerprint, ...acceptedContent } = accepted.stageNine;
    const { status: oldStatus, ...originalContent } = original.stageNine;
    assert.equal(status, 'human_accepted');
    assert.equal(oldStatus, 'passed_awaiting_human_review');
    assert.ok(acceptedAt);
    assert.equal(acceptanceFingerprint.value, accepted.acceptance.stageNineFingerprint.value);
    assert.deepEqual(acceptedContent, originalContent);
  });

  await t.test('3. errors, inactive IAM limitation or changed counts stop acceptance', () => {
    const error = fixture();
    error.stageNine.summary.errorCount = 1;
    assert.throws(() => validateStage87AAcceptanceInputs(error), /zero-error/);
    const iam = fixture();
    iam.stageNine.checks.iamLimitation.active = false;
    assert.throws(() => validateStage87AAcceptanceInputs(iam), /IAM limitation active/);
    const count = fixture();
    count.stageNine.summary.warningCount = 2;
    assert.throws(() => validateStage87AAcceptanceInputs(count), /counts no longer match/);
  });

  await t.test('4. changed accepted record or unlocked Stage 10 stops acceptance', () => {
    const changed = fixture();
    changed.supportingRecords.stageEight.id = 99;
    assert.throws(() => validateStage87AAcceptanceInputs(changed), /record no longer matches/);
    const unlocked = fixture();
    unlocked.session.boundaries.stage10Prepared = true;
    assert.throws(() => validateStage87AAcceptanceInputs(unlocked), /safety boundary changed/);
  });

  await t.test('5. save writes only Stage 9 acceptance metadata, audit and session state', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step87a-'));
    try {
      const original = fixture();
      const accepted = buildStage87ALocalAcceptance({ ...original, now: () => new Date('2026-08-10T19:10:00Z') });
      const directory = path.join(root, sessionId);
      await mkdir(directory);
      await writeFile(path.join(directory, 'author-stage-9-authoring-check.json'), `${JSON.stringify(original.stageNine, null, 2)}\n`, 'utf8');
      const saved = await saveAuthorAssistantStage87AAcceptance({ sessionRoot: root, existingSession: original.session, acceptedSession: accepted.session, existingStageNine: original.stageNine, acceptedStageNine: accepted.stageNine, acceptance: accepted.acceptance });
      const report = JSON.parse(await readFile(saved.stageNinePath, 'utf8'));
      const audit = JSON.parse(await readFile(saved.acceptancePath, 'utf8'));
      const session = JSON.parse(await readFile(path.join(directory, 'session.json'), 'utf8'));
      assert.equal(report.status, 'human_accepted');
      assert.equal(audit.approvalStep, '87A');
      assert.equal(session.status, 'stage_9_accepted');
      assert.equal(session.boundaries.stage9Accepted, true);
      assert.equal(session.boundaries.stage10Prepared, false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('6. acceptance command has no AI, API-key or external write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/applyStage87A.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|@supabase|aws-sdk|saveAuthorDraft/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:apply-87a'], 'node scripts/author-assistant/applyStage87A.mjs');
  });
});
