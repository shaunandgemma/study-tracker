import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAuthorDraft, loadAuthorDrafts, saveAuthorDraft, storeNewAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import { addAuthorPhase, addAuthorTask } from '../src/features/followAlongAuthor/authorPlanning.js';
import {
  addAuthorCleanupStep,
  addAuthorInstructionStep,
  addAuthorJsonBlock,
  addAuthorResource,
  addAuthorSource,
  addAuthorVerification,
  isOfficialAwsDocumentationUrl,
  removeAuthorInstructionStep,
  removeAuthorJsonBlock,
  removeAuthorResource,
  removeAuthorSource,
  setAuthorSourceTaskLink,
  setAuthorTaskMode,
  updateAuthorJsonBlock,
  updateAuthorSource,
  validateAuthorContent
} from '../src/features/followAlongAuthor/authorContent.js';

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
}

function plannedDraft() {
  let draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'Amazon VPC', shortName: 'VPC' }, idFactory: () => 'content' });
  draft = addAuthorPhase(draft, { title: 'Build', description: 'Build the network.' }).draft;
  draft = addAuthorTask(draft, {
    phaseId: draft.phases[0].id,
    title: 'Create the VPC',
    feature: 'Virtual Private Cloud',
    goal: 'Create the project VPC.',
    whyItMatters: 'The VPC contains the connected project.',
    estimatedMinutes: 15
  }).draft;
  return draft;
}

function addLinkedSource(draft) {
  const added = addAuthorSource(draft, { title: 'Create a VPC', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html', purpose: 'Reference the current VPC Console workflow.' });
  assert.equal(added.success, true);
  return setAuthorSourceTaskLink(added.draft, added.source.id, added.draft.tasks[0].id, true).draft;
}

function addCompleteConsolePath(draft) {
  const taskId = draft.tasks[0].id;
  draft = setAuthorTaskMode(draft, taskId, 'console', 'available').draft;
  draft = addAuthorInstructionStep(draft, taskId, 'console', { title: 'Open VPC', instruction: 'Open the VPC console and choose Create VPC.', expectedResult: 'The Create VPC page opens.', warning: 'Use the example Region.' }).draft;
  draft = addAuthorVerification(draft, taskId, { title: 'Check the VPC', instruction: 'Open Your VPCs and select the project VPC.', expectedResult: 'State is Available.', mode: 'console' }).draft;
  return draft;
}

test('Follow Along Author sources, instructions, verification and cleanup', async t => {
  await t.test('1. Only official HTTPS AWS documentation addresses are accepted', () => {
    assert.equal(isOfficialAwsDocumentationUrl('https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html'), true);
    assert.equal(isOfficialAwsDocumentationUrl('https://aws.amazon.com/vpc/'), true);
    assert.equal(isOfficialAwsDocumentationUrl('http://docs.aws.amazon.com/vpc/'), false);
    assert.equal(isOfficialAwsDocumentationUrl('https://example.com/aws-vpc'), false);
    assert.equal(addAuthorSource(plannedDraft(), { title: 'Unofficial', url: 'https://example.com', purpose: 'No' }).success, false);
  });

  await t.test('2. Source IDs remain stable and task links are stored on both sides', () => {
    let draft = addLinkedSource(plannedDraft());
    const sourceId = draft.sources[0].id;
    const taskId = draft.tasks[0].id;
    assert.deepEqual(draft.sources[0].taskIds, [taskId]);
    assert.deepEqual(draft.tasks[0].sourceIds, [sourceId]);
    const updated = updateAuthorSource(draft, sourceId, { title: 'Updated AWS VPC guide' });
    assert.equal(updated.draft.sources[0].id, sourceId);
    assert.equal(removeAuthorSource(updated.draft, sourceId).success, false);
    draft = setAuthorSourceTaskLink(updated.draft, sourceId, taskId, false).draft;
    assert.equal(removeAuthorSource(draft, sourceId).success, true);
  });

  await t.test('3. Console steps receive stable IDs and continuous numbers', () => {
    let draft = plannedDraft();
    const taskId = draft.tasks[0].id;
    draft = setAuthorTaskMode(draft, taskId, 'console', 'available').draft;
    draft = addAuthorInstructionStep(draft, taskId, 'console', { title: 'Open VPC', instruction: 'Open the VPC console.', expectedResult: 'The VPC dashboard opens.' }).draft;
    draft = addAuthorInstructionStep(draft, taskId, 'console', { title: 'Create VPC', instruction: 'Choose Create VPC.', expectedResult: 'The form opens.' }).draft;
    const secondId = draft.tasks[0].consoleSteps[1].id;
    draft = removeAuthorInstructionStep(draft, taskId, 'console', draft.tasks[0].consoleSteps[0].id).draft;
    assert.equal(draft.tasks[0].consoleSteps[0].id, secondId);
    assert.equal(draft.tasks[0].consoleSteps[0].stepNumber, 1);
  });

  await t.test('4. CLI validation rejects credential-like text and warns about chained commands', () => {
    let draft = addLinkedSource(plannedDraft());
    const taskId = draft.tasks[0].id;
    draft = setAuthorTaskMode(draft, taskId, 'cli', 'available').draft;
    draft = addAuthorInstructionStep(draft, taskId, 'cli', { command: 'aws configure set aws_secret_access_key=unsafe && aws ec2 describe-vpcs', explanation: 'Unsafe example.', expectedResult: 'A list.' }).draft;
    draft = addAuthorVerification(draft, taskId, { title: 'Check', instruction: 'Describe the VPC.', expectedResult: 'The VPC is returned.', mode: 'cli' }).draft;
    const result = validateAuthorContent(draft);
    assert.ok(result.errors.some(item => /credential-like text/i.test(item.message)));
    assert.ok(result.warnings.some(item => /chained CLI command/i.test(item.message)));
  });

  await t.test('4A. Author stores valid JSON and keeps imperfect edited examples reviewable without accepting secrets', () => {
    let draft = addCompleteConsolePath(addLinkedSource(plannedDraft()));
    const taskId = draft.tasks[0].id;
    const stepId = draft.tasks[0].consoleSteps[0].id;
    const policy = JSON.stringify({ Version: '2012-10-17', Statement: [{ Effect: 'Allow', Action: ['ec2:DescribeVpcs'], Resource: '*' }] }, null, 2);
    const added = addAuthorJsonBlock(draft, taskId, stepId, { title: 'Read-only VPC policy', content: policy });
    assert.equal(added.success, true);
    draft = added.draft;
    assert.equal(draft.tasks[0].consoleSteps[0].jsonBlocks[0].language, 'json');
    assert.equal(addAuthorJsonBlock(draft, taskId, stepId, { title: 'Broken', content: '{broken' }).success, false);

    const blockId = draft.tasks[0].consoleSteps[0].jsonBlocks[0].id;
    draft = updateAuthorJsonBlock(draft, taskId, stepId, blockId, { content: '{broken' }).draft;
    assert.equal(draft.tasks[0].consoleSteps[0].jsonBlocks[0].language, 'text');
    assert.ok(validateAuthorContent(draft).warnings.some(item => /editable JSON-shaped guidance/i.test(item.message)));
    draft = updateAuthorJsonBlock(draft, taskId, stepId, blockId, { content: policy }).draft;
    assert.equal(draft.tasks[0].consoleSteps[0].jsonBlocks[0].language, 'json');
    draft = removeAuthorJsonBlock(draft, taskId, stepId, blockId).draft;
    assert.equal(draft.tasks[0].consoleSteps[0].jsonBlocks.length, 0);
  });

  await t.test('5. Every task requires a source, a usable path and verification', () => {
    const result = validateAuthorContent(plannedDraft());
    assert.ok(result.errors.some(item => /official AWS source/i.test(item.message)));
    assert.ok(result.errors.some(item => /Console or CLI learning path/i.test(item.message)));
    assert.ok(result.errors.some(item => /verification check/i.test(item.message)));
  });

  await t.test('6. Resource captures use stable keys and connect to their creating task', () => {
    let draft = plannedDraft();
    const taskId = draft.tasks[0].id;
    const result = addAuthorResource(draft, taskId, { label: 'Project VPC ID', type: 'network', description: 'Save the VPC ID for later subnet tasks.' });
    assert.equal(result.success, true);
    const key = result.resource.key;
    assert.match(key, /^resource-project-vpc-id/);
    assert.deepEqual(result.draft.tasks[0].createdResourceKeys, [key]);
    assert.equal(result.draft.resources.schema[0].sourceTaskId, taskId);
  });

  await t.test('7. Every created resource must be covered by manual cleanup', () => {
    let draft = addCompleteConsolePath(addLinkedSource(plannedDraft()));
    const taskId = draft.tasks[0].id;
    draft = addAuthorResource(draft, taskId, { label: 'Project VPC', type: 'network', description: 'Keep the VPC ID.' }).draft;
    let result = validateAuthorContent(draft);
    assert.ok(result.errors.some(item => /needs a cleanup step/i.test(item.message)));
    const key = draft.resources.schema[0].key;
    draft = addAuthorCleanupStep(draft, taskId, { title: 'Delete VPC', instruction: 'Select the project VPC and choose Delete VPC.', verification: 'The VPC no longer appears.', resourceKeys: [key] }).draft;
    result = validateAuthorContent(draft);
    assert.ok(result.errors.some(item => /final programme cleanup check/i.test(item.message)));
  });

  await t.test('8. Resources cannot be removed while cleanup still refers to them', () => {
    let draft = plannedDraft();
    const taskId = draft.tasks[0].id;
    draft = addAuthorResource(draft, taskId, { label: 'Project VPC', type: 'network', description: 'Keep the VPC ID.' }).draft;
    const key = draft.resources.schema[0].key;
    draft = addAuthorCleanupStep(draft, taskId, { title: 'Delete VPC', instruction: 'Delete it.', verification: 'It is absent.', resourceKeys: [key] }).draft;
    const result = removeAuthorResource(draft, key);
    assert.equal(result.success, false);
    assert.match(result.error, /cleanup instructions/i);
  });

  await t.test('9. A complete source, instruction, verification and cleanup package passes', () => {
    let draft = addCompleteConsolePath(addLinkedSource(plannedDraft()));
    const taskId = draft.tasks[0].id;
    draft = addAuthorResource(draft, taskId, { label: 'Project VPC', type: 'network', description: 'Save the VPC ID for later tasks.' }).draft;
    const key = draft.resources.schema[0].key;
    draft = addAuthorCleanupStep(draft, taskId, { title: 'Delete the project VPC', instruction: 'In Your VPCs, select the project VPC and choose Delete VPC.', verification: 'The project VPC no longer appears.', resourceKeys: [key] }).draft;
    draft = addAuthorCleanupStep(draft, null, { title: 'Confirm account cleanup', instruction: 'Review the VPC dashboard for project resources.', verification: 'No project resources remain.', resourceKeys: [key] }).draft;
    draft = { ...draft, warnings: { ...draft.warnings, cost: 'Resources may create AWS charges until deleted.' } };
    const result = validateAuthorContent(draft);
    assert.equal(result.valid, true, JSON.stringify(result.errors));
    assert.equal(draft.cleanup.manualOnly, true);
  });

  await t.test('10. Broken one-sided links and unknown cleanup resources are reported', () => {
    let draft = addCompleteConsolePath(addLinkedSource(plannedDraft()));
    draft = { ...draft, sources: draft.sources.map(source => ({ ...source, taskIds: [] })), cleanup: { ...draft.cleanup, steps: [{ id: 'bad', stepNumber: 1, title: 'Clean', instruction: 'Clean it.', verification: 'Gone.', resourceKeys: ['missing'] }] } };
    const result = validateAuthorContent(draft);
    assert.ok(result.errors.some(item => /one-sided source link/i.test(item.message)));
    assert.ok(result.errors.some(item => /unknown resource/i.test(item.message)));
  });

  await t.test('11. Detailed authoring persists privately as a new unpublished revision', () => {
    const privateStorage = storage();
    const draft = addCompleteConsolePath(addLinkedSource(plannedDraft()));
    assert.equal(storeNewAuthorDraft({ userId: 'author-1', draft, storage: privateStorage }).success, true);
    const saved = saveAuthorDraft({ userId: 'author-1', draft, expectedRevision: 1, storage: privateStorage, now: () => new Date('2026-08-09T15:00:00.000Z') });
    assert.equal(saved.success, true);
    assert.equal(saved.draft.draft.revision, 2);
    assert.equal(saved.draft.programme.publicationVisibility, 'unpublished');
    assert.equal(saved.draft.publication.publishStatus, 'not_published');
    const loaded = loadAuthorDrafts({ userId: 'author-1', storage: privateStorage }).drafts[0];
    assert.equal(loaded.sources.length, 1);
    assert.equal(loaded.tasks[0].consoleSteps.length, 1);
  });

  await t.test('12. Detailed authoring stays independent and exposes no publishing action', () => {
    const files = ['src/features/followAlongAuthor/authorContent.js', 'src/features/followAlongAuthor/AuthorContentStages.jsx'];
    const source = files.map(file => readFileSync(file, 'utf8')).join('\n');
    assert.doesNotMatch(source, /scripts\/generator|generator_v2|HandsOn|TaskContext|tasksData|FOLLOW_ALONG_PROGRAMMES/);
    assert.doesNotMatch(source, /publishDraft|registerProgramme|writeFile|executeCleanup/);
    assert.match(source, /official AWS/i);
    assert.match(source, /always manual/i);
  });
});
