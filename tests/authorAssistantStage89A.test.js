import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { saveAuthorAssistantStage89AAcceptance } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { buildStage89ALocalAcceptance, validateStage89AAcceptanceInputs, verifyStage89AAcceptanceFingerprint } from '../scripts/author-assistant/authorAssistantStage89A.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-sqs-step89a-test';

function fixture() {
  const stageTen = { sessionId, status: 'human_accepted', programme: {}, tasks: [], acceptedAt: '2026-08-10T23:00:00Z' }; const { status, generatedAt, acceptedAt, acceptanceFingerprint, ...tenContent } = stageTen; const tenFp = fingerprintJson(tenContent); stageTen.acceptanceFingerprint = { value: tenFp };
  const stageTenAcceptance = { sessionId, status: 'accepted', approvalStep: '88B', stageTenFingerprint: { value: tenFp } };
  const resolvedByAcceptedContent = Array.from({ length: 8 }, (_, index) => ({ resolutionNumber: index + 1, message: `Resolved ${index + 1}`, status: 'resolved_by_accepted_stages_6_to_10' }));
  const stageEleven = {
    schemaVersion: 1, kind: 'author_stage_11_local_structured_review', status: 'awaiting_human_stage_11_review', sessionId, reviewedAt: '2026-08-10T23:01:00Z', basedOnStage10Fingerprint: { value: tenFp },
    stageBoundary: { preparedLocally: [11], notPrepared: [12], writtenToAuthor: false, connectedToSupabase: false, connectedToAws: false, candidatePrepared: false, published: false },
    reviewState: { learnerPreviewStatus: 'reviewed', reviewStatus: 'ready_for_approval', approvalDecision: 'pending', publicationVisibility: 'unpublished', publishStatus: 'not_published' },
    validations: { planning: { valid: true }, content: { valid: true }, structuredReview: { valid: true } },
    findings: [{ id: 'finding-1', findingNumber: 1, section: 'warnings', priority: 'advisory', message: 'Approver should confirm the learner uses an account already authorized by an administrator.', status: 'open', consolidatedFrom: ['IAM finding 1', 'IAM finding 2'] }],
    resolvedByAcceptedContent,
    summary: { sourceFindingCount: 10, consolidatedAdvisoryCount: 1, openBlockingFindingCount: 0, openAdvisoryFindingCount: 1, resolvedFindingCount: 8, planningErrorCount: 0, contentErrorCount: 0, reviewErrorCount: 0 },
    safetyBoundary: { approvalPerformed: false, releaseCandidatePrepared: false, published: false, authorDraftWritten: false, awsConnected: false, supabaseConnected: false }, acceptedStagesOneToTenChanged: false
  };
  const correctionAudit = { sessionId, approvalStep: '88A', futureCliGuidancePreserved: true };
  const session = { sessionId, status: 'stage_11_ready_for_review', boundaries: { authorStagesPrepared: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], stage11Prepared: true, stage12Prepared: false, candidatePrepared: false, published: false, authorDraftWritten: false } };
  return { session, stageTen, stageTenAcceptance, stageEleven, correctionAudit };
}

test('Step 89A local Stage 11 acceptance', async t => {
  await t.test('1. passed review receives a deterministic fingerprint', () => { const accepted = buildStage89ALocalAcceptance({ ...fixture(), now: () => new Date('2026-08-10T23:05:00Z') }); assert.equal(accepted.stageEleven.status, 'human_accepted'); assert.match(accepted.acceptance.stageElevenFingerprint.value, /^[a-f0-9]{64}$/); assert.equal(verifyStage89AAcceptanceFingerprint(accepted.stageEleven, accepted.acceptance), true); });
  await t.test('2. reviewed Stage 11 content remains exact', () => { const original = fixture(); const accepted = buildStage89ALocalAcceptance(original); const { status, acceptedAt, acceptanceFingerprint, ...newContent } = accepted.stageEleven; const { status: oldStatus, ...oldContent } = original.stageEleven; assert.equal(status, 'human_accepted'); assert.equal(oldStatus, 'awaiting_human_stage_11_review'); assert.ok(acceptedAt); assert.equal(acceptanceFingerprint.value, accepted.acceptance.stageElevenFingerprint.value); assert.deepEqual(newContent, oldContent); });
  await t.test('3. blocking finding, approval decision or changed finding counts stop acceptance', () => { const blocking = fixture(); blocking.stageEleven.summary.openBlockingFindingCount = 1; assert.throws(() => validateStage89AAcceptanceInputs(blocking), /single IAM advisory/); const approved = fixture(); approved.stageEleven.reviewState.approvalDecision = 'approved'; assert.throws(() => validateStage89AAcceptanceInputs(approved), /single IAM advisory/); const count = fixture(); count.stageEleven.summary.sourceFindingCount = 9; assert.throws(() => validateStage89AAcceptanceInputs(count), /review or Stage 12 safety boundary/); });
  await t.test('4. changed Stage 10 or unlocked Stage 12 stops acceptance', () => { const changed = fixture(); changed.stageTen.programme.title = 'Changed'; assert.throws(() => validateStage89AAcceptanceInputs(changed), /Stage 10 fingerprint no longer matches/); const unlocked = fixture(); unlocked.session.boundaries.stage12Prepared = true; assert.throws(() => validateStage89AAcceptanceInputs(unlocked), /Stage 12 safety boundary/); });
  await t.test('5. save writes only Stage 11 acceptance metadata, audit and session', async () => { const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step89a-')); try { const original = fixture(); const accepted = buildStage89ALocalAcceptance(original); const directory = path.join(root, sessionId); await mkdir(directory); await writeFile(path.join(directory, 'author-stage-11-structured-review.json'), `${JSON.stringify(original.stageEleven, null, 2)}\n`, 'utf8'); const saved = await saveAuthorAssistantStage89AAcceptance({ sessionRoot: root, existingSession: original.session, acceptedSession: accepted.session, existingStageEleven: original.stageEleven, acceptedStageEleven: accepted.stageEleven, acceptance: accepted.acceptance }); assert.equal(JSON.parse(await readFile(saved.stageElevenPath, 'utf8')).status, 'human_accepted'); assert.equal(JSON.parse(await readFile(saved.acceptancePath, 'utf8')).approvalStep, '89A'); const session = JSON.parse(await readFile(path.join(directory, 'session.json'), 'utf8')); assert.equal(session.boundaries.stage11Accepted, true); assert.equal(session.boundaries.stage12Prepared, false); assert.equal(session.boundaries.candidatePrepared, false); } finally { await rm(root, { recursive: true, force: true }); } });
  await t.test('6. command has no AI, approval, candidate or publishing dependency', async () => { const command = await readFile(new URL('../scripts/author-assistant/applyStage89A.mjs', import.meta.url), 'utf8'); assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|@supabase|aws-sdk|saveAuthorDraft|releaseCandidate|publishProgramme/i); const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')); assert.equal(packageJson.scripts['author-assistant:apply-89a'], 'node scripts/author-assistant/applyStage89A.mjs'); });
});
