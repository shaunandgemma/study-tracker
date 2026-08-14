import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorHandoffImportPreview } from '../src/features/followAlongAuthor/authorHandoffPreview.js';
import { validateAuthorReview } from '../src/features/followAlongAuthor/authorReview.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, 'docs', 'author-assistant', 'handoffs', 'author-assistant-terraform-beginner-codex-20260814-001');
const packagePath = path.join(folder, 'author-local-handoff-package.json');
const acceptancePath = path.join(folder, 'author-local-handoff-acceptance-90a.json');
const stableStringify = value => Array.isArray(value)
  ? `[${value.map(stableStringify).join(',')}]`
  : value && typeof value === 'object'
    ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`
    : JSON.stringify(value);
const fingerprint = value => crypto.createHash('sha256').update(stableStringify(value)).digest('hex');

test('Terraform beginner handoff is detailed, valid, local-only, and human accepted', () => {
  const handoff = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const content = handoff.authorDraftContent;
  assert.equal(handoff.kind, 'author_local_handoff_package');
  assert.equal(handoff.status, 'awaiting_human_handoff_review');
  assert.equal(content.programme.programmeId, 'terraform-beginner-learning-path');
  assert.equal(content.programme.examId, 'terraform-associate-004');
  assert.equal(content.programme.difficulty, 'Beginner');
  assert.equal(content.phases.length, 4);
  assert.equal(content.tasks.length, 5);
  assert.ok(content.tasks.every(task => task.consoleSteps.length && task.cliSteps.length && task.verification.length));
  assert.ok(content.sources.some(source => source.publisher === 'AWS'));
  assert.ok(content.sources.some(source => source.publisher === 'HashiCorp'));
  assert.equal(validateAuthorPlanning(content).valid, true);
  assert.equal(validateAuthorContent(content).valid, true);
  assert.equal(validateAuthorReview(content).valid, true);
  assert.equal(handoff.handoffBoundary.connectedToAuthor, false);
  assert.equal(handoff.handoffBoundary.connectedToSupabase, false);
  assert.equal(handoff.handoffBoundary.connectedToAws, false);
  assert.equal(handoff.handoffBoundary.releaseCandidatePrepared, false);
  assert.equal(handoff.handoffBoundary.published, false);
  assert.equal(handoff.summary.checkboxCount, 102);
  assert.equal(handoff.summary.cliCommandCount, 36);
  assert.equal(handoff.summary.verificationCheckCount, 11);
  assert.equal(fs.existsSync(acceptancePath), true);
  const fingerprintContent = structuredClone(handoff);
  delete fingerprintContent.status;
  delete fingerprintContent.preparedAt;
  delete fingerprintContent.handoffFingerprint;
  assert.equal(fingerprint(fingerprintContent), handoff.handoffFingerprint.value);
});

test('Terraform beginner handoff and acceptance pass the Author read-only preview', async () => {
  const handoffPackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const acceptance = JSON.parse(fs.readFileSync(acceptancePath, 'utf8'));
  const auditFingerprintContent = structuredClone(acceptance);
  delete auditFingerprintContent.acceptedAt;
  delete auditFingerprintContent.acceptanceAuditFingerprint;
  assert.equal(fingerprint(auditFingerprintContent), acceptance.acceptanceAuditFingerprint.value);
  const preview = await validateAuthorHandoffImportPreview({
    handoffPackage,
    acceptance,
    currentUser: { id: 'test-author', email: 'author@example.com' },
    cryptoImpl: globalThis.crypto,
  });
  assert.equal(preview.valid, true);
  assert.equal(preview.readOnly, true);
  assert.equal(preview.canSaveDraft, false);
});

test('Terraform beginner handoff contains the core workflow and complete ordered cleanup', () => {
  const handoff = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const serialized = JSON.stringify(handoff.authorDraftContent);
  for (const command of ['terraform init', 'terraform validate', 'terraform plan -out=tfplan', 'terraform apply tfplan', 'terraform state list', 'terraform plan -destroy -out=destroy.tfplan', 'terraform apply destroy.tfplan']) {
    assert.ok(serialized.includes(command), `missing ${command}`);
  }
  assert.equal(handoff.authorDraftContent.cleanup.steps.length, 5);
  assert.equal(serialized.includes('profile = var.aws_profile'), false);
  assert.equal(serialized.includes('fa-iac-tf'), false);
  assert.ok(serialized.includes('mkdir -p ~/fa-terraform-beginner'));
  assert.ok(serialized.includes('New-Item -ItemType Directory'));
  assert.ok(serialized.includes('Ctrl+O'));
  assert.ok(serialized.includes('The plan is Terraform’s safety preview'));
  assert.ok(serialized.includes('Terraform beginner command cheat sheet'));
});
