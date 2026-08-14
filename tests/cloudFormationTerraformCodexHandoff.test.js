import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent, isOfficialTerraformDocumentationUrl } from '../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../src/features/followAlongAuthor/authorReview.js';
import { validateAuthorHandoffImportPreview } from '../src/features/followAlongAuthor/authorHandoffPreview.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, 'docs', 'author-assistant', 'handoffs', 'author-assistant-cloudformation-terraform-codex-20260814-001');
const packagePath = path.join(folder, 'author-local-handoff-package.json');
const stableStringify = value => Array.isArray(value) ? `[${value.map(stableStringify).join(',')}]` : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}` : JSON.stringify(value);
const fingerprint = value => crypto.createHash('sha256').update(stableStringify(value)).digest('hex');

test('CloudFormation and Terraform handoff is complete, valid, and local-only', () => {
  const handoff = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const content = handoff.authorDraftContent;
  assert.equal(handoff.kind, 'author_local_handoff_package');
  assert.equal(handoff.status, 'awaiting_human_handoff_review');
  assert.equal(content.programme.programmeId, 'cloudformation-terraform-learning-path');
  assert.equal(content.phases.length, 6);
  assert.equal(content.tasks.length, 12);
  assert.ok(content.tasks.every(task => task.consoleSteps.length && task.cliSteps.length && task.verification.length));
  assert.ok(content.sources.some(source => source.publisher === 'AWS'));
  assert.ok(content.sources.some(source => source.publisher === 'HashiCorp' && isOfficialTerraformDocumentationUrl(source.url)));
  assert.equal(validateAuthorPlanning(content).valid, true);
  assert.equal(validateAuthorContent(content).valid, true);
  assert.equal(validateAuthorReview(content).valid, true);
  assert.equal(handoff.handoffBoundary.connectedToAuthor, false);
  assert.equal(handoff.handoffBoundary.connectedToSupabase, false);
  assert.equal(handoff.handoffBoundary.connectedToAws, false);
  assert.equal(handoff.handoffBoundary.releaseCandidatePrepared, false);
  assert.equal(handoff.handoffBoundary.published, false);
  assert.equal(fs.existsSync(path.join(folder, 'author-local-handoff-acceptance-90a.json')), true);
  const fingerprintContent = structuredClone(handoff);
  delete fingerprintContent.status;
  delete fingerprintContent.preparedAt;
  delete fingerprintContent.handoffFingerprint;
  assert.equal(fingerprint(fingerprintContent), handoff.handoffFingerprint.value);
});

test('mixed AWS and Terraform source counts pass the accepted read-only preview', async () => {
  const handoffPackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const acceptance = JSON.parse(fs.readFileSync(path.join(folder, 'author-local-handoff-acceptance-90a.json'), 'utf8'));
  const preview = await validateAuthorHandoffImportPreview({
    handoffPackage,
    acceptance,
    currentUser: { id: 'test-author-id', email: 'author@example.com' },
    cryptoImpl: globalThis.crypto
  });
  assert.equal(preview.valid, true);
  assert.equal(preview.readOnly, true);
  assert.equal(preview.canSaveDraft, false);
  assert.equal(preview.summary.officialAwsSourceCount, 9);
});

test('all referenced local IaC files are supplied as visible blocks', () => {
  const handoff = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const tasks = handoff.authorDraftContent.tasks;
  const visible = new Set(tasks.flatMap(task => task.consoleSteps).flatMap(step => step.jsonBlocks || []).map(block => block.title));
  const references = tasks.flatMap(task => task.cliSteps).flatMap(step => [...step.command.matchAll(/file:\/\/([^\s]+)/g)].map(match => match[1]));
  assert.deepEqual(references.filter(filename => !visible.has(filename) && filename !== 'fa-iac-network-v2.yaml'), []);
  assert.ok(visible.has('fa-iac-backend.yaml'));
  assert.ok(visible.has('fa-iac-network.yaml'));
  assert.ok(visible.has('main.tf'));
  assert.ok(visible.has('backend.tf'));
  assert.equal(JSON.stringify(handoff).includes('\\u0002'), false);
});
