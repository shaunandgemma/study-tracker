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
import { getTerraformFollowAlongNumber, sortTerraformFollowAlongs } from '../src/features/followAlongs/published/terraformFollowAlongOrder.js';
import { getPublishedFollowAlongDisplayName } from '../src/features/followAlongs/published/publishedFollowAlongService.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, 'docs', 'author-assistant', 'handoffs', 'author-assistant-terraform-configuration-codex-20260814-001');
const stableStringify = value => Array.isArray(value)
  ? `[${value.map(stableStringify).join(',')}]`
  : value && typeof value === 'object'
    ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`
    : JSON.stringify(value);
const fingerprint = value => crypto.createHash('sha256').update(stableStringify(value)).digest('hex');

test('Terraform Follow Along 0 handoff is complete, accepted, valid and local-only', async () => {
  const handoff = JSON.parse(fs.readFileSync(path.join(folder, 'author-local-handoff-package.json'), 'utf8'));
  const acceptance = JSON.parse(fs.readFileSync(path.join(folder, 'author-local-handoff-acceptance-90a.json'), 'utf8'));
  const content = handoff.authorDraftContent;

  assert.equal(content.programme.programmeId, 'terraform-configuration-foundations-learning-path');
  assert.equal(content.programme.examId, 'terraform-associate-004');
  assert.equal(content.programme.displayName, 'Understanding and Building Terraform Configuration');
  assert.equal(content.phases.length, 6);
  assert.equal(content.tasks.length, 9);
  assert.equal(handoff.summary.checkboxCount, 146);
  assert.equal(handoff.summary.cliCommandCount, 57);
  assert.equal(handoff.summary.verificationCheckCount, 19);
  assert.equal(handoff.summary.cleanupItemCount, 6);
  assert.ok(content.tasks.every(task => task.consoleSteps.length && task.cliSteps.length && task.verification.length));
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

test('Terraform Follow Along 0 teaches configuration construction rather than blind pasting', () => {
  const handoff = JSON.parse(fs.readFileSync(path.join(folder, 'author-local-handoff-package.json'), 'utf8'));
  const serialized = JSON.stringify(handoff.authorDraftContent);
  for (const required of [
    'Identify resource as the block type',
    'Create an empty file named versions.tf',
    'Add only the aws_region variable block',
    'Create locals.tf and add an empty locals block',
    'Create data.tf',
    'Create main.tf and add resource',
    'values(aws_ssm_parameter.training)[*].name',
    'Predict three resource instance addresses',
    'Without opening the finished references',
  ]) assert.ok(serialized.includes(required), `missing progressive teaching rule: ${required}`);

  const visibleFiles = handoff.authorDraftContent.tasks
    .flatMap(task => task.consoleSteps)
    .flatMap(step => step.jsonBlocks || [])
    .map(block => block.title);
  for (const file of ['Finished versions.tf reference', 'Finished providers.tf reference', 'Finished variables.tf reference', 'Finished locals.tf reference', 'Finished data.tf reference', 'Finished main.tf reference', 'Finished outputs.tf reference']) {
    assert.ok(visibleFiles.includes(file), `missing final comparison block: ${file}`);
  }
});

test('Terraform Follow Along 0 is sorted and numbered before the existing programmes', () => {
  const programmes = [
    { id: 'terraform-state-backend-learning-path' },
    { id: 'future-terraform-learning-path' },
    { id: 'terraform-beginner-learning-path' },
    { id: 'terraform-configuration-foundations-learning-path' },
  ];
  const sorted = sortTerraformFollowAlongs(programmes);
  assert.deepEqual(sorted.map(programme => programme.id), [
    'terraform-configuration-foundations-learning-path',
    'terraform-beginner-learning-path',
    'terraform-state-backend-learning-path',
    'future-terraform-learning-path',
  ]);
  assert.equal(getTerraformFollowAlongNumber('terraform-configuration-foundations-learning-path', programmes), 0);
  assert.equal(getTerraformFollowAlongNumber('terraform-beginner-learning-path', programmes), 1);
  assert.equal(getTerraformFollowAlongNumber('terraform-state-backend-learning-path', programmes), 2);
  assert.equal(getTerraformFollowAlongNumber('future-terraform-learning-path', programmes), 3);
});

test('Follow Along 0 is a card badge and is not repeated in the programme title', () => {
  assert.equal(getPublishedFollowAlongDisplayName({
    programmeId: 'terraform-configuration-foundations-learning-path',
    displayName: 'Follow Along 0 — Understanding and Building Terraform Configuration',
  }), 'Understanding and Building Terraform Configuration');
  assert.equal(getPublishedFollowAlongDisplayName({
    programmeId: 'terraform-state-backend-learning-path',
    displayName: 'Terraform State and Remote Backend Follow Along',
  }), 'Terraform State and Remote Backend Follow Along');
});
