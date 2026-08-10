import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { saveAuthorAssistantStage88BAcceptance } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { buildStage88BLocalAcceptance, validateStage88BAcceptanceInputs, verifyStage88BAcceptanceFingerprint } from '../scripts/author-assistant/authorAssistantStage88B.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step88b-test';

function fixture() {
  const stageNine = { schemaVersion: 1, kind: 'author_stage_9_local_authoring_check', status: 'human_accepted', sessionId, checkedAt: '2026-08-10T21:00:00Z', basedOnStage8Fingerprint: { value: 'eight' }, stageBoundary: {}, checks: {}, summary: { passed: true, errorCount: 0 }, errors: [], warnings: [], retainedManualReviewFindings: [], acceptedStagesOneToEightChanged: false, acceptedAt: '2026-08-10T21:01:00Z' };
  const { status, acceptedAt, acceptanceFingerprint, ...stageNineContent } = stageNine;
  const stageNineFingerprint = fingerprintJson(stageNineContent); stageNine.acceptanceFingerprint = { value: stageNineFingerprint };
  const stageNineAcceptance = { sessionId, status: 'accepted', approvalStep: '87A', stageNineFingerprint: { value: stageNineFingerprint } };
  const stageTen = {
    schemaVersion: 1, kind: 'author_stage_10_local_learner_preview', status: 'awaiting_human_preview_review', sessionId, generatedAt: '2026-08-10T21:02:00Z', basedOnStage9Fingerprint: { value: stageNineFingerprint },
    stageBoundary: { preparedLocally: [10], notPrepared: [11, 12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false },
    privacyBoundary: { learnerFacingFieldsOnly: true, privateReviewFindingsIncluded: false, acceptanceFingerprintsIncluded: false, aiResponseDataIncluded: false, futureCliGuidanceIncluded: false, commandsExecuted: false, progressSaved: false },
    programme: {}, phases: [],
    tasks: [
      { id: 'task-sqs-receive-and-inspect-the-test-message-004', goal: 'Poll the queue and inspect the message in the Console.', consoleSteps: [{ instructions: [{ id: 'check-1', text: 'Poll for messages.' }] }], verification: [{ id: 'verify-1' }] },
      { id: 'task-sqs-delete-the-received-test-message-005', goal: 'Select and delete the message in the Console.', consoleSteps: [{ instructions: [{ id: 'check-2', text: 'Choose Delete.' }] }], verification: [{ id: 'verify-2' }] }
    ],
    warnings: {}, cleanup: { taskSteps: [{ id: 'cleanup-1' }], programmeSteps: [{ id: 'cleanup-2' }] },
    summary: { taskCount: 2, checkboxCount: 2, verificationCheckCount: 2, cleanupItemCount: 2, officialAwsReferenceCount: 1, availableModes: ['console'] }, acceptedStagesOneToNineChanged: false
  };
  const correctionAudit = { sessionId, status: 'applied_locally', approvalStep: '88A', goalCorrections: stageTen.tasks.map(task => ({ taskId: task.id })), newFingerprints: { stageNine: stageNineFingerprint, stageTen: fingerprintJson(stageTen) }, stageNineRerunPassed: true, futureCliGuidancePreserved: true, acceptedConsoleInstructionsChanged: false, unrelatedContentChanged: false };
  const session = { sessionId, status: 'stage_10_ready_for_review', boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], stage10Prepared: true, stage11Prepared: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false } };
  return { session, stageNine, stageNineAcceptance, stageTen, correctionAudit };
}

test('Step 88B corrected Stage 10 acceptance', async t => {
  await t.test('1. corrected learner preview receives a deterministic fingerprint', () => {
    const accepted = buildStage88BLocalAcceptance({ ...fixture(), now: () => new Date('2026-08-10T21:05:00Z') });
    assert.equal(accepted.stageTen.status, 'human_accepted'); assert.match(accepted.acceptance.stageTenFingerprint.value, /^[a-f0-9]{64}$/); assert.equal(verifyStage88BAcceptanceFingerprint(accepted.stageTen, accepted.acceptance), true);
  });
  await t.test('2. reviewed learner preview content remains exact', () => {
    const original = fixture(); const accepted = buildStage88BLocalAcceptance(original);
    const { status, acceptedAt, acceptanceFingerprint, ...newContent } = accepted.stageTen; const { status: oldStatus, ...oldContent } = original.stageTen;
    assert.equal(status, 'human_accepted'); assert.equal(oldStatus, 'awaiting_human_preview_review'); assert.ok(acceptedAt); assert.equal(acceptanceFingerprint.value, accepted.acceptance.stageTenFingerprint.value); assert.deepEqual(newContent, oldContent);
  });
  await t.test('3. receipt-handle goals, private leakage or changed counts stop acceptance', () => {
    const receipt = fixture(); receipt.stageTen.tasks[0].goal = 'Retain the receipt handle.'; receipt.correctionAudit.newFingerprints.stageTen = fingerprintJson(receipt.stageTen); assert.throws(() => validateStage88BAcceptanceInputs(receipt), /receipt-handle wording/);
    const privacy = fixture(); privacy.stageTen.privacyBoundary.futureCliGuidanceIncluded = true; privacy.correctionAudit.newFingerprints.stageTen = fingerprintJson(privacy.stageTen); assert.throws(() => validateStage88BAcceptanceInputs(privacy), /learner-only preview boundary/);
    const count = fixture(); count.stageTen.summary.checkboxCount = 3; count.correctionAudit.newFingerprints.stageTen = fingerprintJson(count.stageTen); assert.throws(() => validateStage88BAcceptanceInputs(count), /counts no longer match/);
  });
  await t.test('4. changed correction audit or unlocked Stage 11 stops acceptance', () => {
    const audit = fixture(); audit.correctionAudit.futureCliGuidancePreserved = false; assert.throws(() => validateStage88BAcceptanceInputs(audit), /correction audit no longer matches/);
    const unlocked = fixture(); unlocked.session.boundaries.stage11Prepared = true; assert.throws(() => validateStage88BAcceptanceInputs(unlocked), /safety boundary changed/);
  });
  await t.test('5. save writes only Stage 10 acceptance metadata, audit and session', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step88b-'));
    try { const original = fixture(); const accepted = buildStage88BLocalAcceptance(original); const directory = path.join(root, sessionId); await mkdir(directory); await writeFile(path.join(directory, 'author-stage-10-learner-preview.json'), `${JSON.stringify(original.stageTen, null, 2)}\n`, 'utf8'); const saved = await saveAuthorAssistantStage88BAcceptance({ sessionRoot: root, existingSession: original.session, acceptedSession: accepted.session, existingStageTen: original.stageTen, acceptedStageTen: accepted.stageTen, acceptance: accepted.acceptance }); assert.equal(JSON.parse(await readFile(saved.stageTenPath, 'utf8')).status, 'human_accepted'); assert.equal(JSON.parse(await readFile(saved.acceptancePath, 'utf8')).approvalStep, '88B'); const session = JSON.parse(await readFile(path.join(directory, 'session.json'), 'utf8')); assert.equal(session.boundaries.stage10Accepted, true); assert.equal(session.boundaries.stage11Prepared, false); } finally { await rm(root, { recursive: true, force: true }); }
  });
  await t.test('6. command has no AI, API-key or external write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/applyStage88B.mjs', import.meta.url), 'utf8'); assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|@supabase|aws-sdk|saveAuthorDraft/i); const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')); assert.equal(packageJson.scripts['author-assistant:apply-88b'], 'node scripts/author-assistant/applyStage88B.mjs');
  });
});
