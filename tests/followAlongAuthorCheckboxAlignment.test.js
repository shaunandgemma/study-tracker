import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  createAuthorDraft,
  loadAuthorDrafts,
  normalizeAuthorDraft
} from '../src/features/followAlongAuthor/authorDraftService.js';
import { buildAuthorReleaseSnapshot } from '../src/features/followAlongAuthor/authorApproval.js';
import {
  addAuthorCleanupStep,
  addAuthorInstructionItem,
  addAuthorInstructionStep,
  moveAuthorInstructionItem,
  removeAuthorInstructionItem,
  setAuthorTaskMode,
  updateAuthorInstructionItem,
  validateAuthorContent
} from '../src/features/followAlongAuthor/authorContent.js';
import { addAuthorPhase, addAuthorTask } from '../src/features/followAlongAuthor/authorPlanning.js';
import { buildPublishedFollowAlongConfig } from '../src/features/followAlongs/published/publishedFollowAlongService.js';

function authorDraft() {
  let draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'AWS Lambda', shortName: 'Lambda' }, idFactory: () => 'checkboxes' });
  draft = addAuthorPhase(draft, { title: 'Create', description: 'Create the function.' }).draft;
  draft = addAuthorTask(draft, {
    phaseId: draft.phases[0].id,
    title: 'Create a Lambda function',
    feature: 'Lambda functions',
    goal: 'Create the trial function.',
    whyItMatters: 'The learner sees the complete workflow.',
    estimatedMinutes: 10
  }).draft;
  return draft;
}

function withConsoleStep() {
  let draft = authorDraft();
  const taskId = draft.tasks[0].id;
  draft = setAuthorTaskMode(draft, taskId, 'console', 'available').draft;
  draft = addAuthorInstructionStep(draft, taskId, 'console', {
    title: 'Create the function',
    instruction: 'Open the Lambda console.',
    detail: 'Use the AWS search bar.',
    expectedResult: 'The function page opens.'
  }).draft;
  return draft;
}

test('Step 57B Author checkbox alignment', async t => {
  await t.test('1. A new Console step starts with one stable learner checkbox instruction', () => {
    const draft = withConsoleStep();
    const step = draft.tasks[0].consoleSteps[0];
    assert.equal(step.number, 1);
    assert.equal(step.instructions.length, 1);
    assert.match(step.instructions[0].id, new RegExp(`^${draft.tasks[0].id}-console-step-1-`));
    assert.equal(step.instructions[0].text, 'Open the Lambda console.');
    assert.equal(step.instructions[0].detail, 'Use the AWS search bar.');
  });

  await t.test('2. Checkbox items can be added, edited, reordered and removed without changing their IDs', () => {
    let draft = withConsoleStep();
    const taskId = draft.tasks[0].id;
    const stepId = draft.tasks[0].consoleSteps[0].id;
    draft = addAuthorInstructionItem(draft, taskId, stepId, { text: 'Choose Create function.', detail: 'Use Author from scratch.' }).draft;
    const firstId = draft.tasks[0].consoleSteps[0].instructions[0].id;
    const secondId = draft.tasks[0].consoleSteps[0].instructions[1].id;
    draft = updateAuthorInstructionItem(draft, taskId, stepId, secondId, { text: 'Choose Create function now.' }).draft;
    assert.equal(draft.tasks[0].consoleSteps[0].instructions[1].id, secondId);
    draft = moveAuthorInstructionItem(draft, taskId, stepId, secondId, -1).draft;
    assert.deepEqual(draft.tasks[0].consoleSteps[0].instructions.map(item => item.id), [secondId, firstId]);
    draft = removeAuthorInstructionItem(draft, taskId, stepId, firstId).draft;
    assert.deepEqual(draft.tasks[0].consoleSteps[0].instructions.map(item => item.id), [secondId]);
    assert.equal(draft.tasks[0].consoleSteps[0].instruction, 'Choose Create function now.');
  });

  await t.test('3. Content validation requires non-empty checkbox instructions and unique stable IDs', () => {
    let draft = withConsoleStep();
    const step = draft.tasks[0].consoleSteps[0];
    draft = {
      ...draft,
      tasks: draft.tasks.map(task => ({
        ...task,
        consoleSteps: [{ ...step, instructions: [{ id: 'same', text: '' }, { id: 'same', text: 'Choose Create function.' }] }]
      }))
    };
    const validation = validateAuthorContent(draft);
    assert.ok(validation.errors.some(item => /unique stable checkbox IDs/i.test(item.message)));
    assert.ok(validation.errors.some(item => /needs exact learner text/i.test(item.message)));
  });

  await t.test('4. Old singular instructions convert into one checkbox without losing their wording', () => {
    const legacy = authorDraft();
    legacy.tasks[0].consoleSteps = [{
      id: 'legacy-console-step',
      stepNumber: 1,
      title: 'Open Lambda',
      instruction: 'Open the Lambda console and select Functions.',
      expectedResult: 'The Functions page opens.'
    }];
    const normalized = normalizeAuthorDraft(legacy);
    const step = normalized.tasks[0].consoleSteps[0];
    assert.equal(step.instruction, 'Open the Lambda console and select Functions.');
    assert.deepEqual(step.instructions, [{
      id: `${legacy.tasks[0].id}-legacy-console-step-instruction-1`,
      text: 'Open the Lambda console and select Functions.',
      detail: ''
    }]);
  });

  await t.test('5. Loading a saved old browser draft performs the same non-destructive conversion', () => {
    const legacy = authorDraft();
    legacy.tasks[0].consoleSteps = [{ id: 'saved-step', stepNumber: 1, title: 'Open Lambda', instruction: 'Open Lambda.', expectedResult: 'Lambda opens.' }];
    const key = `studytracker_follow_along_author_v1:author-1:drafts`;
    const storage = { getItem: requested => requested === key ? JSON.stringify([legacy]) : null };
    const loaded = loadAuthorDrafts({ userId: 'author-1', storage });
    assert.equal(loaded.success, true);
    assert.equal(loaded.drafts[0].tasks[0].consoleSteps[0].instructions[0].text, 'Open Lambda.');
    assert.equal(loaded.drafts[0].draft.revision, 1);
  });

  await t.test('6. Release candidates preserve checkbox instructions before approval and publishing', () => {
    const draft = withConsoleStep();
    const snapshot = buildAuthorReleaseSnapshot(draft);
    assert.deepEqual(snapshot.tasks[0].consoleSteps[0].instructions, draft.tasks[0].consoleSteps[0].instructions);
    assert.equal(snapshot.programme.publicationVisibility, 'unpublished');
    assert.equal(snapshot.publication.publishStatus, 'not_published');
  });

  await t.test('7. Published runtime receives checkboxes, CLI commands and complete cleanup descriptions', () => {
    let draft = withConsoleStep();
    const taskId = draft.tasks[0].id;
    draft = setAuthorTaskMode(draft, taskId, 'cli', 'available').draft;
    draft = addAuthorInstructionStep(draft, taskId, 'cli', { command: 'aws lambda list-functions', explanation: 'List functions.', expectedResult: 'The function is listed.' }).draft;
    draft = addAuthorCleanupStep(draft, taskId, { title: 'Delete the function', instruction: 'Select the trial function and choose Delete.', verification: 'The function is absent.' }).draft;
    draft = addAuthorCleanupStep(draft, null, { title: 'Confirm cleanup', instruction: 'Refresh the Functions list.', verification: 'No trial function remains.' }).draft;
    const snapshot = buildAuthorReleaseSnapshot(draft);
    const config = buildPublishedFollowAlongConfig({ runtime_content: snapshot, content_hash: 'hash' });
    assert.equal(config.tasks[0].consoleSteps[0].instructions[0].text, 'Open the Lambda console.');
    assert.equal(config.tasks[0].cliSteps[0].commands[0].text, 'aws lambda list-functions');
    assert.deepEqual(config.cleanup.steps.map(step => step.description), [
      'Select the trial function and choose Delete.',
      'Refresh the Functions list.'
    ]);
    assert.equal(config.cleanup.manualOnly, true);
  });

  await t.test('8. Author UI and private preview expose the intended checkbox workflow', () => {
    const editor = readFileSync('src/features/followAlongAuthor/AuthorContentStages.jsx', 'utf8');
    const preview = readFileSync('src/features/followAlongAuthor/AuthorReviewStages.jsx', 'utf8');
    const runner = readFileSync('src/components/FollowAlongs/shared/FollowAlongTaskRunner.jsx', 'utf8');
    assert.match(editor, /Add Checkbox Instruction/);
    assert.match(editor, /Move up/);
    assert.match(editor, /Move down/);
    assert.match(editor, /Optional extra help/);
    assert.match(preview, /FollowAlongStepCard/);
    assert.match(preview, /temporary and are not saved as learner progress/);
    assert.match(runner, /onSaveProgress\(\{ taskId, checkedSteps/);
  });
});
