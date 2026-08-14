import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent, isOfficialTerraformDocumentationUrl } from '../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorHandoffImportPreview } from '../src/features/followAlongAuthor/authorHandoffPreview.js';
import { validateAuthorReview } from '../src/features/followAlongAuthor/authorReview.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, 'docs', 'author-assistant', 'handoffs', 'author-assistant-terraform-state-codex-20260814-001');
const packagePath = path.join(folder, 'author-local-handoff-package.json');
const acceptancePath = path.join(folder, 'author-local-handoff-acceptance-90a.json');
const stableStringify = value => Array.isArray(value)
  ? `[${value.map(stableStringify).join(',')}]`
  : value && typeof value === 'object'
    ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`
    : JSON.stringify(value);
const fingerprint = value => crypto.createHash('sha256').update(stableStringify(value)).digest('hex');

test('Terraform state and remote backend handoff is complete, valid, accepted, and local-only', async () => {
  const handoff = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const acceptance = JSON.parse(fs.readFileSync(acceptancePath, 'utf8'));
  const content = handoff.authorDraftContent;

  assert.equal(content.programme.programmeId, 'terraform-state-backend-learning-path');
  assert.equal(content.programme.examId, 'terraform-associate-004');
  assert.equal(content.phases.length, 6);
  assert.equal(content.tasks.length, 8);
  assert.equal(handoff.summary.checkboxCount, 130);
  assert.equal(handoff.summary.cliCommandCount, 73);
  assert.equal(handoff.summary.verificationCheckCount, 16);
  assert.equal(handoff.summary.cleanupItemCount, 7);
  assert.ok(content.tasks.every(task => task.consoleSteps.length && task.cliSteps.length && task.verification.length));
  assert.ok(content.sources.every(source => source.publisher === 'AWS' || source.publisher === 'HashiCorp'));
  assert.ok(content.sources.filter(source => source.publisher === 'HashiCorp').every(source => isOfficialTerraformDocumentationUrl(source.url)));
  assert.equal(validateAuthorPlanning(content).valid, true);
  assert.equal(validateAuthorContent(content).valid, true);
  assert.equal(validateAuthorReview(content).valid, true);
  assert.equal(handoff.handoffBoundary.connectedToAuthor, false);
  assert.equal(handoff.handoffBoundary.connectedToSupabase, false);
  assert.equal(handoff.handoffBoundary.connectedToAws, false);
  assert.equal(handoff.handoffBoundary.releaseCandidatePrepared, false);
  assert.equal(handoff.handoffBoundary.published, false);

  const fingerprintContent = structuredClone(handoff);
  delete fingerprintContent.status;
  delete fingerprintContent.preparedAt;
  delete fingerprintContent.handoffFingerprint;
  assert.equal(fingerprint(fingerprintContent), handoff.handoffFingerprint.value);

  const preview = await validateAuthorHandoffImportPreview({
    handoffPackage: handoff,
    acceptance,
    currentUser: { id: 'test-author', email: 'author@example.com' },
    cryptoImpl: globalThis.crypto,
  });
  assert.equal(preview.valid, true);
  assert.equal(preview.readOnly, true);
  assert.equal(preview.canSaveDraft, false);
});

test('Terraform Card 2 teaches state, backends, drift, workspaces, import, and ordered teardown', () => {
  const handoff = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const serialized = JSON.stringify(handoff.authorDraftContent);
  for (const required of [
    'terraform init -migrate-state',
    'use_lockfile = true',
    'terraform plan -refresh-only',
    'terraform workspace new development',
    'terraform import aws_s3_bucket.imported',
    'terraform plan -destroy -out=destroy.tfplan',
    'fa-tf-state-<ACCOUNT_ID>',
  ]) assert.ok(serialized.includes(required), `missing ${required}`);

  const visibleBlocks = handoff.authorDraftContent.tasks
    .flatMap(task => task.consoleSteps)
    .flatMap(step => step.jsonBlocks || [])
    .map(block => block.title);
  for (const file of ['versions.tf', 'variables.tf', 'main.tf', 'outputs.tf', 'backend.tf', 'backend.hcl', 'Add to import.tf']) {
    assert.ok(visibleBlocks.includes(file), `missing visible file block ${file}`);
  }
  assert.equal(handoff.authorDraftContent.cleanup.ordering, 'reverse_dependency');
});
