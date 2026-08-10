import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildStage90ALocalAcceptance,
  validateStage90AAcceptanceInputs,
  verifyStage90AAcceptance
} from '../scripts/author-assistant/authorAssistantStage90A.mjs';
import { saveAuthorAssistantStage90AAcceptance } from '../scripts/author-assistant/authorAssistantCore.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-synthetic-step-90a';

function fixture() {
  const handoffPackage = {
    schemaVersion: 1,
    kind: 'author_local_handoff_package',
    status: 'awaiting_human_handoff_review',
    sessionId,
    preparedAt: '2026-08-10T12:00:00.000Z',
    service: { officialName: 'Amazon Synthetic Service', shortName: 'SYN' },
    acceptedFingerprintChain: { stage11: { algorithm: 'sha256-json-v1', value: '1'.repeat(64) } },
    acceptedRecordManifest: { stageEleven: { algorithm: 'sha256-json-v1', value: '2'.repeat(64) } },
    authorDraftContent: { programme: { programmeId: 'synthetic-learning-path', displayName: 'Synthetic Follow Along' }, phases: [{ id: 'phase-1' }], tasks: [{ id: 'task-1' }] },
    identityBinding: { status: 'required_before_author_write', assignedAuthorId: null, assignedDraftId: null, assignedRevision: null, rule: 'Bind later.' },
    summary: { phaseCount: 1, taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 1, learnerResourceValueCount: 0, officialAwsSourceCount: 1 },
    handoffBoundary: { localPackageOnly: true, stage12Started: false, authorDraftWritten: false, authorIdentityBound: false, connectedToAuthor: false, connectedToSupabase: false, connectedToAws: false, releaseCandidatePrepared: false, candidateIdGenerated: false, approvalPerformed: false, published: false },
    acceptedStagesOneToElevenChanged: false
  };
  const fingerprintContent = structuredClone(handoffPackage);
  delete fingerprintContent.status;
  delete fingerprintContent.preparedAt;
  handoffPackage.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprintJson(fingerprintContent) };
  const session = {
    sessionId,
    status: 'handoff_package_ready_for_review',
    inputs: { serviceName: 'Amazon Synthetic Service', shortName: 'SYN' },
    boundaries: { handoffPackagePrepared: true, stage12Prepared: false, authorDraftWritten: false, supabaseConnected: false, awsConnected: false, candidatePrepared: false, published: false }
  };
  return { session, handoffPackage };
}

test('Step 90A local handoff acceptance', async t => {
  await t.test('1. records deterministic fingerprints for the exact verified package', () => {
    const inputs = fixture();
    const acceptance = buildStage90ALocalAcceptance({ ...inputs, now: () => new Date('2026-08-10T12:10:00.000Z') });
    assert.equal(acceptance.status, 'accepted');
    assert.equal(acceptance.approvalStep, '90A');
    assert.equal(acceptance.handoffFingerprint.value, inputs.handoffPackage.handoffFingerprint.value);
    assert.match(acceptance.authorDraftContentFingerprint.value, /^[a-f0-9]{64}$/);
    assert.match(acceptance.acceptedRecordManifestFingerprint.value, /^[a-f0-9]{64}$/);
    assert.match(acceptance.acceptanceAuditFingerprint.value, /^[a-f0-9]{64}$/);
    assert.equal(verifyStage90AAcceptance(inputs.handoffPackage, acceptance), true);
  });

  await t.test('2. acceptance preparation does not change any handoff package content', () => {
    const inputs = fixture();
    const before = structuredClone(inputs.handoffPackage);
    buildStage90ALocalAcceptance(inputs);
    assert.deepEqual(inputs.handoffPackage, before);
  });

  await t.test('3. changed content, bound identity or an open Stage 12 boundary stops acceptance', () => {
    const changed = fixture();
    changed.handoffPackage.authorDraftContent.programme.displayName = 'Changed';
    assert.throws(() => validateStage90AAcceptanceInputs(changed), /fingerprint no longer matches/);
    const bound = fixture();
    bound.handoffPackage.identityBinding.assignedAuthorId = 'author-1';
    assert.throws(() => validateStage90AAcceptanceInputs(bound), /fingerprint no longer matches|local-only acceptance boundary changed/);
    const stageTwelve = fixture();
    stageTwelve.session.boundaries.stage12Prepared = true;
    assert.throws(() => validateStage90AAcceptanceInputs(stageTwelve), /local-only acceptance boundary changed/);
  });

  await t.test('4. audit verification detects any changed acceptance field', () => {
    const inputs = fixture();
    const acceptance = buildStage90ALocalAcceptance(inputs);
    acceptance.wroteToAuthor = true;
    assert.equal(verifyStage90AAcceptance(inputs.handoffPackage, acceptance), false);
  });

  await t.test('5. save writes only the audit and local session while preserving the package bytes', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step90a-'));
    try {
      const inputs = fixture();
      const directory = path.join(root, sessionId);
      await mkdir(directory);
      const packagePath = path.join(directory, 'author-local-handoff-package.json');
      const packageText = `${JSON.stringify(inputs.handoffPackage, null, 2)}\n`;
      await writeFile(packagePath, packageText, 'utf8');
      const acceptance = buildStage90ALocalAcceptance(inputs);
      const saved = await saveAuthorAssistantStage90AAcceptance({ ...inputs, sessionRoot: root, existingSession: inputs.session, acceptance, now: () => new Date('2026-08-10T12:15:00.000Z') });
      assert.equal(await readFile(packagePath, 'utf8'), packageText);
      assert.equal(JSON.parse(await readFile(saved.acceptancePath, 'utf8')).approvalStep, '90A');
      const session = JSON.parse(await readFile(path.join(directory, 'session.json'), 'utf8'));
      assert.equal(session.status, 'handoff_package_accepted');
      assert.equal(session.boundaries.handoffPackageAccepted, true);
      assert.equal(session.boundaries.stage12Prepared, false);
      assert.equal(session.boundaries.authorDraftWritten, false);
      assert.deepEqual((await readdir(directory)).sort(), ['author-local-handoff-acceptance-90a.json', 'author-local-handoff-package.json', 'session.json']);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('6. an existing acceptance audit prevents a duplicate save', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'author-assistant-step90a-duplicate-'));
    try {
      const inputs = fixture();
      const directory = path.join(root, sessionId);
      await mkdir(directory);
      await writeFile(path.join(directory, 'author-local-handoff-acceptance-90a.json'), '{}\n', 'utf8');
      const acceptance = buildStage90ALocalAcceptance(inputs);
      await assert.rejects(() => saveAuthorAssistantStage90AAcceptance({ ...inputs, sessionRoot: root, existingSession: inputs.session, acceptance }), /already exists/);
      assert.deepEqual((await readdir(directory)).sort(), ['author-local-handoff-acceptance-90a.json']);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  await t.test('7. command has no AI, Author, Supabase, AWS, candidate or publishing write dependency', async () => {
    const command = await readFile(new URL('../scripts/author-assistant/applyStage90A.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(command, /OPENAI_API_KEY|fetch\s*\(|@supabase|aws-sdk|saveAuthorDraft|storeNewDraft|storeReleaseCandidate|publishReleaseCandidate/i);
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:apply-90a'], 'node scripts/author-assistant/applyStage90A.mjs');
  });
});
