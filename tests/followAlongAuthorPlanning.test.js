import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAuthorDraft, loadAuthorDrafts, saveAuthorDraft, storeNewAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import {
  addAuthorPhase,
  addAuthorTask,
  getOrderedAuthorTasks,
  moveAuthorPhase,
  moveAuthorTask,
  removeAuthorTask,
  removeEmptyAuthorPhase,
  updateAuthorPhase,
  updateAuthorTask,
  validateAuthorPlanning
} from '../src/features/followAlongAuthor/authorPlanning.js';

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
}

function completeProgramme() {
  const draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'Amazon VPC', shortName: 'VPC' }, idFactory: () => 'planning' });
  return {
    ...draft,
    programme: {
      ...draft.programme,
      subtitle: 'Virtual Private Cloud and Networking',
      description: 'Build a connected VPC project.',
      learningOutcome: 'Create, verify and safely clean up a VPC.',
      category: 'Networking and Content Delivery',
      difficulty: 'Intermediate',
      estimatedMinutes: 120,
      defaultRegion: 'eu-west-2',
      regionScope: 'regional'
    }
  };
}

function addPhase(draft, title, description = `${title} description`) {
  const result = addAuthorPhase(draft, { title, description });
  assert.equal(result.success, true);
  return result.draft;
}

function addTask(draft, phaseId, title, overrides = {}) {
  const result = addAuthorTask(draft, {
    phaseId,
    title,
    feature: 'Virtual Private Cloud',
    goal: `Complete ${title}.`,
    whyItMatters: `${title} supports the connected project.`,
    estimatedMinutes: 15,
    ...overrides
  });
  assert.equal(result.success, true);
  return result.draft;
}

test('Follow Along Author programme, phase and task planning', async t => {
  await t.test('1. Programme validation explains every missing planning field', () => {
    const draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'Amazon VPC' }, idFactory: () => 'empty' });
    const result = validateAuthorPlanning(draft);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(item => item.field === 'subtitle'));
    assert.ok(result.errors.some(item => item.field === 'learningOutcome'));
    assert.ok(result.errors.some(item => item.field === 'defaultRegion'));
    assert.ok(result.errors.some(item => item.section === 'phases'));
    assert.ok(result.errors.some(item => item.section === 'tasks'));
  });

  await t.test('2. Phases receive stable unique IDs and continuous numbers', () => {
    let draft = completeProgramme();
    draft = addPhase(draft, 'Foundation');
    draft = addPhase(draft, 'Foundation');
    assert.deepEqual(draft.phases.map(item => item.phaseNumber), [1, 2]);
    assert.equal(new Set(draft.phases.map(item => item.id)).size, 2);
    assert.equal(draft.phases[0].id, 'phase-1-foundation');
    assert.equal(draft.phases[1].id, 'phase-2-foundation');

    const moved = moveAuthorPhase(draft, draft.phases[1].id, 'up');
    assert.equal(moved.success, true);
    assert.deepEqual(moved.draft.phases.map(item => item.phaseNumber), [1, 2]);
    assert.equal(moved.draft.phases[0].id, 'phase-2-foundation');
  });

  await t.test('3. Phase titles can change without changing stable IDs', () => {
    let draft = addPhase(completeProgramme(), 'Foundation');
    const id = draft.phases[0].id;
    const updated = updateAuthorPhase(draft, id, { title: 'Network Foundation', description: 'Plan and build the network.' });
    assert.equal(updated.success, true);
    assert.equal(updated.draft.phases[0].id, id);
    assert.equal(updated.draft.phases[0].title, 'Network Foundation');
  });

  await t.test('4. Tasks join exactly one phase and the first task becomes the initial task', () => {
    let draft = addPhase(completeProgramme(), 'Foundation');
    draft = addTask(draft, draft.phases[0].id, 'Create the VPC');
    const task = draft.tasks[0];
    assert.match(task.id, /^task-vpc-create-the-vpc-001/);
    assert.deepEqual(draft.phases[0].taskIds, [task.id]);
    assert.equal(draft.progress.initialTaskId, task.id);
    assert.equal(task.status, 'draft');
    assert.deepEqual(task.prerequisites, []);
    assert.equal(task.modeAvailability.console.status, 'not_applicable');
    assert.equal(task.modeAvailability.cli.status, 'not_applicable');
  });

  await t.test('5. Moving a task between phases updates both phase lists without copying it', () => {
    let draft = addPhase(completeProgramme(), 'Foundation');
    draft = addPhase(draft, 'Security');
    draft = addTask(draft, draft.phases[0].id, 'Create the VPC');
    const taskId = draft.tasks[0].id;
    const moved = updateAuthorTask(draft, taskId, { phaseId: draft.phases[1].id });
    assert.equal(moved.success, true);
    assert.deepEqual(moved.draft.phases[0].taskIds, []);
    assert.deepEqual(moved.draft.phases[1].taskIds, [taskId]);
    assert.equal(moved.draft.tasks.length, 1);
  });

  await t.test('6. Task title edits preserve stable ID and slug', () => {
    let draft = addPhase(completeProgramme(), 'Foundation');
    draft = addTask(draft, draft.phases[0].id, 'Create the VPC');
    const original = draft.tasks[0];
    const updated = updateAuthorTask(draft, original.id, { title: 'Create the project VPC' });
    assert.equal(updated.draft.tasks[0].id, original.id);
    assert.equal(updated.draft.tasks[0].slug, original.slug);
    assert.equal(updated.draft.tasks[0].title, 'Create the project VPC');
  });

  await t.test('7. Valid earlier-task prerequisites pass the planning check', () => {
    let draft = addPhase(completeProgramme(), 'Foundation');
    draft = addTask(draft, draft.phases[0].id, 'Plan the CIDR');
    draft = addTask(draft, draft.phases[0].id, 'Create the VPC');
    const [first, second] = getOrderedAuthorTasks(draft);
    draft = updateAuthorTask(draft, second.id, { prerequisites: [first.id] }).draft;
    const result = validateAuthorPlanning(draft);
    assert.equal(result.valid, true, JSON.stringify(result.errors));
  });

  await t.test('8. Later dependencies and required-to-optional dependencies are blocked', () => {
    let draft = addPhase(completeProgramme(), 'Foundation');
    draft = addTask(draft, draft.phases[0].id, 'Optional setup', { isOptional: true });
    draft = addTask(draft, draft.phases[0].id, 'Required build');
    const [optional, required] = getOrderedAuthorTasks(draft);
    draft = updateAuthorTask(draft, required.id, { prerequisites: [optional.id] }).draft;
    let result = validateAuthorPlanning(draft);
    assert.ok(result.errors.some(item => /required and cannot depend on optional task/i.test(item.message)));

    draft = updateAuthorTask(draft, optional.id, { prerequisites: [required.id] }).draft;
    result = validateAuthorPlanning(draft);
    assert.ok(result.errors.some(item => /only on an earlier task/i.test(item.message)));
    assert.ok(result.errors.some(item => /circular dependency/i.test(item.message)));
  });

  await t.test('9. Reordering exposes an unsafe prerequisite instead of silently repairing it', () => {
    let draft = addPhase(completeProgramme(), 'Foundation');
    draft = addTask(draft, draft.phases[0].id, 'Plan the CIDR');
    draft = addTask(draft, draft.phases[0].id, 'Create the VPC');
    const [first, second] = getOrderedAuthorTasks(draft);
    draft = updateAuthorTask(draft, second.id, { prerequisites: [first.id] }).draft;
    draft = moveAuthorTask(draft, second.id, 'up').draft;
    const result = validateAuthorPlanning(draft);
    assert.ok(result.errors.some(item => /only on an earlier task/i.test(item.message)));
  });

  await t.test('10. Non-empty phases and depended-on tasks cannot be removed unsafely', () => {
    let draft = addPhase(completeProgramme(), 'Foundation');
    const phaseId = draft.phases[0].id;
    draft = addTask(draft, phaseId, 'Plan the CIDR');
    draft = addTask(draft, phaseId, 'Create the VPC');
    const [first, second] = getOrderedAuthorTasks(draft);
    draft = updateAuthorTask(draft, second.id, { prerequisites: [first.id] }).draft;
    assert.equal(removeEmptyAuthorPhase(draft, phaseId).success, false);
    const blocked = removeAuthorTask(draft, first.id);
    assert.equal(blocked.success, false);
    assert.match(blocked.error, /prerequisites first/);
    const removedSecond = removeAuthorTask(draft, second.id);
    assert.equal(removedSecond.success, true);
    assert.equal(removeAuthorTask(removedSecond.draft, first.id).success, true);
  });

  await t.test('11. Programme planning persists as a new private revision', () => {
    const privateStorage = storage();
    let draft = addPhase(completeProgramme(), 'Foundation');
    draft = addTask(draft, draft.phases[0].id, 'Create the VPC');
    assert.equal(storeNewAuthorDraft({ userId: 'author-1', draft, storage: privateStorage }).success, true);
    const saved = saveAuthorDraft({ userId: 'author-1', draft, expectedRevision: 1, storage: privateStorage, now: () => new Date('2026-08-09T12:00:00.000Z') });
    assert.equal(saved.success, true);
    assert.equal(saved.draft.draft.revision, 2);
    assert.equal(saved.draft.programme.publicationVisibility, 'unpublished');
    assert.equal(saved.draft.publication.publishStatus, 'not_published');
    const loaded = loadAuthorDrafts({ userId: 'author-1', storage: privateStorage }).drafts[0];
    assert.equal(loaded.phases.length, 1);
    assert.equal(loaded.tasks.length, 1);
  });

  await t.test('12. Planning UI remains independent of Generator, Hands On and publishing', () => {
    const files = ['src/features/followAlongAuthor/authorPlanning.js', 'src/features/followAlongAuthor/AuthorDraftEditor.jsx'];
    const source = files.map(file => readFileSync(file, 'utf8')).join('\n');
    assert.doesNotMatch(source, /scripts\/generator|generator_v2|HandsOn|TaskContext|tasksData|FOLLOW_ALONG_PROGRAMMES/);
    assert.doesNotMatch(source, /publishDraft|registerProgramme|writeFile/);
    assert.match(source, /Private browser draft/);
    assert.match(source, /Shared draft/);
  });

  await t.test('13. Programme and task durations are optional and non-blocking', () => {
    let draft = completeProgramme();
    draft = { ...draft, programme: { ...draft.programme, estimatedMinutes: null } };
    draft = addPhase(draft, 'Foundation');
    draft = addTask(draft, draft.phases[0].id, 'Create the VPC', { estimatedMinutes: null });
    assert.equal(draft.tasks[0].estimatedMinutes, null);
    assert.equal(validateAuthorPlanning(draft).valid, true);
    const updated = updateAuthorTask(draft, draft.tasks[0].id, { estimatedMinutes: '' });
    assert.equal(updated.draft.tasks[0].estimatedMinutes, null);
  });
});
