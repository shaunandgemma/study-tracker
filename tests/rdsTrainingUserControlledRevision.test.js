import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAuthorContent } from '../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorHandoffImportPreview } from '../src/features/followAlongAuthor/authorHandoffPreview.js';
import { validateAuthorPlanning } from '../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorReview } from '../src/features/followAlongAuthor/authorReview.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseFolder = path.join(root, 'docs', 'author-assistant', 'handoffs', 'author-assistant-rds-451073fe-d52f-411e-9d7d-91c9d91bbbf4');
const revisionFolder = path.join(root, 'docs', 'author-assistant', 'handoffs', 'author-assistant-rds-training-user-numbered-20260825');
const base = JSON.parse(fs.readFileSync(path.join(baseFolder, 'author-local-handoff-package.json'), 'utf8'));
const revision = JSON.parse(fs.readFileSync(path.join(revisionFolder, 'author-local-handoff-package.json'), 'utf8'));
const acceptance = JSON.parse(fs.readFileSync(path.join(revisionFolder, 'author-local-handoff-acceptance-90a.json'), 'utf8'));
const targetTaskId = 'task-rds-protect-the-root-user-and-create-the-training-iam-user-001';
const targetStepId = `${targetTaskId}-console-step-1-create-the-dedicated-training-user`;

function stepFrom(content) {
  return content.tasks.find(task => task.id === targetTaskId).consoleSteps.find(step => step.id === targetStepId);
}

function withoutApprovedStep(content) {
  const copy = structuredClone(content);
  const task = copy.tasks.find(item => item.id === targetTaskId);
  const index = task.consoleSteps.findIndex(item => item.id === targetStepId);
  task.consoleSteps[index] = { approvedStepPlaceholder: true };
  return copy;
}

test('controlled RDS training-user revision', async t => {
  await t.test('1. is an accepted but unpublished, fail-closed update of verified RDS revision 4', async () => {
    assert.equal(revision.generationMode, 'update_existing');
    assert.deepEqual(revision.updateTarget, base.updateTarget);
    assert.equal(revision.updateTarget.programmeId, 'rds-learning-path');
    assert.equal(revision.updateTarget.sourceRevision, 4);
    assert.equal(revision.handoffBoundary.localPackageOnly, true);
    assert.equal(revision.handoffBoundary.published, false);
    assert.equal(acceptance.handoffFingerprint.value, revision.handoffFingerprint.value);
    assert.equal(acceptance.published, false);
    const preview = await validateAuthorHandoffImportPreview({
      handoffPackage: revision,
      acceptance,
      currentUser: { id: 'local-review-author', email: 'local-review@example.invalid' }
    });
    assert.equal(preview.valid, true);
    assert.equal(preview.readOnly, true);
  });

  await t.test('2. changes no Author content outside the exact approved console step', () => {
    assert.deepEqual(
      withoutApprovedStep(revision.authorDraftContent),
      withoutApprovedStep(base.authorDraftContent)
    );
  });

  await t.test('3. preserves every task, step and instruction ID', () => {
    assert.deepEqual(
      revision.authorDraftContent.tasks.map(task => task.id),
      base.authorDraftContent.tasks.map(task => task.id)
    );
    const before = stepFrom(base.authorDraftContent);
    const after = stepFrom(revision.authorDraftContent);
    assert.equal(after.id, before.id);
    assert.deepEqual(after.instructions.map(item => item.id), before.instructions.map(item => item.id));
  });

  await t.test('4. uses numbered text, no typed checkbox glyphs and 13 functional instruction records', () => {
    const step = stepFrom(revision.authorDraftContent);
    assert.equal(step.instructions.length, 13);
    step.instructions.forEach((instruction, index) => {
      assert.match(instruction.text, new RegExp(`^${index + 1}\\. `));
      assert.doesNotMatch(instruction.text, /☐/);
    });
    assert.equal(step.instruction, step.instructions[0].text);
    assert.match(step.description, /AWS root user is not used at any point/);
    assert.match(step.warning, /Do not give the training user administrator access/);
    assert.match(step.expectedResult, /no lab permissions yet/);
  });

  await t.test('5. continues to pass the complete Author validation boundary', () => {
    assert.equal(validateAuthorPlanning(revision.authorDraftContent).valid, true);
    assert.equal(validateAuthorContent(revision.authorDraftContent).valid, true);
    assert.equal(validateAuthorReview(revision.authorDraftContent).valid, true);
  });
});
