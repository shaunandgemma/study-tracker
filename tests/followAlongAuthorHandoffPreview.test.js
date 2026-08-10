import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  readAuthorHandoffJsonFile,
  validateAuthorHandoffImportPreview
} from '../src/features/followAlongAuthor/authorHandoffPreview.js';
import { buildStage90ALocalAcceptance } from '../scripts/author-assistant/authorAssistantStage90A.mjs';
import { fingerprintJson } from '../scripts/author-assistant/authorAssistantStage84D.mjs';

const sessionId = 'author-assistant-browser-preview';
const currentUser = { id: '00000000-0000-4000-8000-000000000091', email: 'author@example.com' };

function packageFingerprintContent(handoffPackage) {
  const content = structuredClone(handoffPackage);
  delete content.status;
  delete content.preparedAt;
  delete content.handoffFingerprint;
  return content;
}

function auditFingerprintContent(acceptance) {
  const content = structuredClone(acceptance);
  delete content.acceptedAt;
  delete content.acceptanceAuditFingerprint;
  return content;
}

function fixture() {
  const handoffPackage = {
    schemaVersion: 1,
    kind: 'author_local_handoff_package',
    status: 'awaiting_human_handoff_review',
    sessionId,
    preparedAt: '2026-08-10T13:00:00.000Z',
    service: { officialName: 'Amazon Synthetic Service', shortName: 'SYN' },
    acceptedFingerprintChain: { stage11: { algorithm: 'sha256-json-v1', value: '1'.repeat(64) } },
    acceptedRecordManifest: { stageEleven: { algorithm: 'sha256-json-v1', value: '2'.repeat(64) } },
    authorDraftContent: {
      programme: { programmeId: 'synthetic-learning-path', displayName: 'Synthetic Follow Along', serviceName: 'Amazon Synthetic Service', shortName: 'SYN' },
      phases: [{ id: 'phase-1' }],
      tasks: [{ id: 'task-1', consoleSteps: [{ id: 'step-1', instructions: [{ id: 'check-1', text: 'Open the Console.' }] }], verification: [{ id: 'verify-1' }], cleanup: [{ id: 'cleanup-1' }] }],
      resources: { schema: [] },
      sources: [{ id: 'source-1' }],
      cleanup: { steps: [{ id: 'cleanup-ack' }] }
    },
    identityBinding: { status: 'required_before_author_write', assignedAuthorId: null, assignedDraftId: null, assignedRevision: null, rule: 'Bind later.' },
    summary: { phaseCount: 1, taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 2, learnerResourceValueCount: 0, officialAwsSourceCount: 1 },
    handoffBoundary: { localPackageOnly: true, stage12Started: false, authorDraftWritten: false, authorIdentityBound: false, connectedToAuthor: false, connectedToSupabase: false, connectedToAws: false, releaseCandidatePrepared: false, candidateIdGenerated: false, approvalPerformed: false, published: false },
    acceptedStagesOneToElevenChanged: false
  };
  handoffPackage.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprintJson(packageFingerprintContent(handoffPackage)) };
  const session = { sessionId, status: 'handoff_package_ready_for_review', boundaries: { handoffPackagePrepared: true, stage12Prepared: false, authorDraftWritten: false, supabaseConnected: false, awsConnected: false, candidatePrepared: false, published: false } };
  const acceptance = buildStage90ALocalAcceptance({ session, handoffPackage, now: () => new Date('2026-08-10T13:05:00.000Z') });
  return { handoffPackage, acceptance };
}

function refreshFingerprints(handoffPackage, acceptance) {
  handoffPackage.handoffFingerprint.value = fingerprintJson(packageFingerprintContent(handoffPackage));
  acceptance.handoffFingerprint.value = handoffPackage.handoffFingerprint.value;
  acceptance.authorDraftContentFingerprint.value = fingerprintJson(handoffPackage.authorDraftContent);
  acceptance.acceptedRecordManifestFingerprint.value = fingerprintJson(handoffPackage.acceptedRecordManifest);
  acceptance.acceptanceAuditFingerprint.value = fingerprintJson(auditFingerprintContent(acceptance));
}

test('Step 91 read-only Author handoff import preview', async t => {
  await t.test('1. matching browser fingerprints produce only a read-only intended-owner preview', async () => {
    const documents = fixture();
    const preview = await validateAuthorHandoffImportPreview({ ...documents, currentUser });
    assert.equal(preview.valid, true);
    assert.equal(preview.readOnly, true);
    assert.equal(preview.canBindIdentity, false);
    assert.equal(preview.canSaveDraft, false);
    assert.equal(preview.canConnectToSupabase, false);
    assert.equal(preview.canConnectToAws, false);
    assert.equal(preview.canCreateCandidate, false);
    assert.equal(preview.stage12Started, false);
    assert.deepEqual(preview.intendedAuthor, currentUser);
    assert.equal(preview.handoffFingerprint, documents.handoffPackage.handoffFingerprint.value);
  });

  await t.test('2. displayed counts are recalculated from content instead of trusted blindly', async () => {
    const documents = fixture();
    const preview = await validateAuthorHandoffImportPreview({ ...documents, currentUser });
    assert.deepEqual(preview.summary, { phaseCount: 1, taskCount: 1, checkboxCount: 1, verificationCheckCount: 1, cleanupItemCount: 2, learnerResourceValueCount: 0, officialAwsSourceCount: 1 });
    documents.handoffPackage.summary.taskCount = 2;
    refreshFingerprints(documents.handoffPackage, documents.acceptance);
    await assert.rejects(() => validateAuthorHandoffImportPreview({ ...documents, currentUser }), /counts do not match/);
  });

  await t.test('3. changed package content or a mismatched audit stops the preview', async () => {
    const changed = fixture();
    changed.handoffPackage.authorDraftContent.programme.displayName = 'Changed after acceptance';
    await assert.rejects(() => validateAuthorHandoffImportPreview({ ...changed, currentUser }), /Fingerprint verification failed/);
    const mismatch = fixture();
    mismatch.acceptance.sessionId = 'other-session';
    await assert.rejects(() => validateAuthorHandoffImportPreview({ ...mismatch, currentUser }), /matching Step 90/);
  });

  await t.test('4. even correctly re-fingerprinted unsafe boundaries are rejected', async () => {
    const documents = fixture();
    documents.handoffPackage.handoffBoundary.connectedToSupabase = true;
    refreshFingerprints(documents.handoffPackage, documents.acceptance);
    await assert.rejects(() => validateAuthorHandoffImportPreview({ ...documents, currentUser }), /read-only handoff boundary/);
  });

  await t.test('5. a signed-in Author with an email is required without binding that identity', async () => {
    const documents = fixture();
    await assert.rejects(() => validateAuthorHandoffImportPreview({ ...documents, currentUser: null }), /signed-in Author/);
    await assert.rejects(() => validateAuthorHandoffImportPreview({ ...documents, currentUser: { id: 'author-only' } }), /signed-in Author/);
    assert.equal(documents.handoffPackage.identityBinding.assignedAuthorId, null);
  });

  await t.test('6. file reading accepts small JSON and rejects invalid or oversized input', async () => {
    const valid = { size: 20, text: async () => '{"kind":"test"}' };
    assert.deepEqual(await readAuthorHandoffJsonFile(valid), { kind: 'test' });
    await assert.rejects(() => readAuthorHandoffJsonFile({ size: 4, text: async () => 'nope' }), /not valid JSON/);
    await assert.rejects(() => readAuthorHandoffJsonFile({ size: 21, text: async () => '{}' }, { maxBytes: 20 }), /safe preview limit/);
  });

  await t.test('7. Step 91 validation stays browser-local while Step 92 storage is delegated by the parent', async () => {
    const component = await readFile(new URL('../src/features/followAlongAuthor/AuthorHandoffImportPreview.jsx', import.meta.url), 'utf8');
    const home = await readFile(new URL('../src/features/followAlongAuthor/AuthorHome.jsx', import.meta.url), 'utf8');
    assert.match(home, /<AuthorHandoffImportPreview/);
    assert.match(home, /onCreatePrivateDraft=\{importPrivateHandoffDraft\}/);
    assert.match(component, /Step 91 · Read-only handoff preview/);
    assert.match(component, /Intended future draft owner — not yet bound/);
    assert.doesNotMatch(component, /from\s+['"][^'"]*(?:authorStorageCoordinator|authorSharedStorageService|authorDraftService|supabase)[^'"]*['"]|\b(?:storeNewDraft|saveAuthorDraft|storeReleaseCandidate)\s*\(/i);
  });
});
