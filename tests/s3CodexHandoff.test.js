import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../src/features/followAlongAuthor/authorReview.js';
import { validateAuthorHandoffImportPreview } from '../src/features/followAlongAuthor/authorHandoffPreview.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, 'docs', 'author-assistant', 'handoffs', 'author-assistant-s3-codex-20260814-001');
const packagePath = path.join(folder, 'author-local-handoff-package.json');

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(value) {
  return crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
}

test('S3 Codex handoff is complete, valid, local-only, and human accepted', () => {
  const handoff = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const content = handoff.authorDraftContent;
  assert.equal(handoff.kind, 'author_local_handoff_package');
  assert.equal(handoff.status, 'awaiting_human_handoff_review');
  assert.equal(content.programme.programmeId, 's3-learning-path');
  assert.equal(content.phases.length, 6);
  assert.equal(content.tasks.length, 11);
  assert.ok(content.tasks.every(task => task.modeAvailability.console.status === 'available' && task.consoleSteps.length));
  assert.ok(content.tasks.every(task => task.modeAvailability.cli.status === 'available' && task.cliSteps.length));
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

test('S3 Step 90A audit validates with the unchanged handoff package in read-only preview', async () => {
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
  assert.equal(preview.canCreateCandidate, false);
  assert.equal(preview.handoffFingerprint, '2772e86abe5b52067adc1faf14b11c8996bdd3a7110d12bca833af4c2f9d8a75');
});

test('every local supporting file referenced by an S3 CLI command is displayed in the handoff', () => {
  const handoff = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const tasks = handoff.authorDraftContent.tasks;
  const visibleBlocks = new Set(tasks.flatMap(task => task.consoleSteps).flatMap(step => step.jsonBlocks || []).map(block => block.title));
  const references = tasks
    .flatMap(task => task.cliSteps)
    .flatMap(step => [...step.command.matchAll(/fileb?:\/\/([^\s]+)/g)].map(match => match[1]))
    .filter(filename => filename !== 'fa-s3-object-inspector.zip');
  assert.deepEqual(references.filter(filename => !visibleBlocks.has(filename)), []);
});
