import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAuthorDraft, loadAuthorDrafts, saveAuthorDraft, storeNewAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';
import {
  addAuthorReviewFinding,
  createAuthorPreviewModel,
  getAuthorPreviewModes,
  markAuthorPreviewReviewed,
  removeAuthorReviewFinding,
  setAuthorReviewStatus,
  updateAuthorReviewFinding,
  validateAuthorReview
} from '../src/features/followAlongAuthor/authorReview.js';

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
}

function reviewDraft() {
  const draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'Amazon VPC', shortName: 'VPC' }, idFactory: () => 'review' });
  const task = {
    id: 'task-vpc-create-001', title: 'Create the VPC', goal: 'Create the project VPC.', phaseId: 'phase-1', prerequisites: [], isOptional: false,
    sourceIds: ['source-vpc'], createdResourceKeys: ['resource-vpc'],
    modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'not_applicable', reason: 'Console-first task.' } },
    consoleSteps: [{ id: 'console-1', stepNumber: 1, title: 'Open VPC', instruction: 'Open the VPC console.', expectedResult: 'The dashboard opens.', warning: '' }], cliSteps: [],
    verification: [{ id: 'verify-1', title: 'Check VPC', instruction: 'Open Your VPCs.', expectedResult: 'The VPC is Available.', mode: 'console' }],
    cleanup: [{ id: 'cleanup-1', stepNumber: 1, title: 'Delete VPC', instruction: 'Delete the project VPC.', verification: 'It no longer appears.', resourceKeys: ['resource-vpc'] }]
  };
  return {
    ...draft,
    phases: [{ id: 'phase-1', phaseNumber: 1, title: 'Foundation', description: 'Build the network.', taskIds: [task.id], isOptional: false }],
    tasks: [task],
    sources: [{ id: 'source-vpc', title: 'Create a VPC', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html', publisher: 'AWS', sourceType: 'official_documentation', purpose: 'Current AWS workflow.', taskIds: [task.id] }],
    resources: { ...draft.resources, schema: [{ key: 'resource-vpc', label: 'Project VPC ID', sourceTaskId: task.id, type: 'network', description: 'Save the VPC ID.', required: true }] },
    cleanup: { ...draft.cleanup, steps: [{ id: 'programme-cleanup-1', stepNumber: 1, title: 'Confirm cleanup', instruction: 'Review the VPC dashboard.', verification: 'No project resources remain.', resourceKeys: ['resource-vpc'] }] }
  };
}

const passed = { valid: true, errors: [], warnings: [] };
const failed = { valid: false, errors: [{ message: 'Fix this.' }], warnings: [] };

test('Follow Along Author private preview and structured review', async t => {
  await t.test('1. Preview model joins ordered phases, tasks, sources and resources without changing the draft', () => {
    const draft = reviewDraft();
    const before = JSON.stringify(draft);
    const model = createAuthorPreviewModel(draft);
    assert.equal(model.phases[0].tasks[0].id, draft.tasks[0].id);
    assert.equal(model.tasks[0].phaseNumber, 1);
    assert.equal(model.tasks[0].sources[0].id, 'source-vpc');
    assert.equal(model.tasks[0].createdResources[0].key, 'resource-vpc');
    assert.equal(model.cleanup.manualOnly, true);
    assert.equal(JSON.stringify(draft), before);
  });

  await t.test('2. Preview mode choices include only complete available paths', () => {
    const task = reviewDraft().tasks[0];
    assert.deepEqual(getAuthorPreviewModes(task), ['console']);
    const both = { ...task, modeAvailability: { console: { status: 'available' }, cli: { status: 'available' } }, cliSteps: [{ id: 'cli-1' }] };
    assert.deepEqual(getAuthorPreviewModes(both), ['console', 'cli']);
  });

  await t.test('3. Marking the private preview reviewed never approves or publishes it', () => {
    const draft = markAuthorPreviewReviewed(reviewDraft());
    assert.equal(draft.review.learnerPreviewStatus, 'reviewed');
    assert.equal(draft.review.approvalDecision, 'pending');
    assert.equal(draft.publication.publishStatus, 'not_published');
    assert.equal(draft.programme.publicationVisibility, 'unpublished');
  });

  await t.test('4. Review findings receive stable IDs and continuous numbers', () => {
    let draft = reviewDraft();
    draft = addAuthorReviewFinding(draft, { section: 'instructions', priority: 'blocking', message: 'Clarify the first click.' }).draft;
    draft = addAuthorReviewFinding(draft, { section: 'cleanup', priority: 'advisory', message: 'Make the final check simpler.' }).draft;
    assert.deepEqual(draft.review.findings.map(item => item.findingNumber), [1, 2]);
    assert.equal(new Set(draft.review.findings.map(item => item.id)).size, 2);
  });

  await t.test('5. Editing a finding preserves its stable ID and number', () => {
    let draft = addAuthorReviewFinding(reviewDraft(), { message: 'Clarify this step.' }).draft;
    const original = draft.review.findings[0];
    draft = updateAuthorReviewFinding(draft, original.id, { message: 'Clarify the exact Console selection.', section: 'instructions' }).draft;
    assert.equal(draft.review.findings[0].id, original.id);
    assert.equal(draft.review.findings[0].findingNumber, 1);
    assert.equal(draft.review.findings[0].section, 'instructions');
  });

  await t.test('6. Removing a finding renumbers the remaining list without changing stable IDs', () => {
    let draft = addAuthorReviewFinding(reviewDraft(), { message: 'First finding.' }).draft;
    draft = addAuthorReviewFinding(draft, { message: 'Second finding.' }).draft;
    const secondId = draft.review.findings[1].id;
    draft = removeAuthorReviewFinding(draft, draft.review.findings[0].id).draft;
    assert.equal(draft.review.findings[0].id, secondId);
    assert.equal(draft.review.findings[0].findingNumber, 1);
  });

  await t.test('7. Adding a finding safely requests changes and keeps approval pending', () => {
    const draft = addAuthorReviewFinding(reviewDraft(), { message: 'Add an expected result.' }).draft;
    assert.equal(draft.draft.status, 'changes_requested');
    assert.equal(draft.review.reviewStatus, 'changes_requested');
    assert.equal(draft.review.approvalDecision, 'pending');
    assert.equal(draft.publication.publishStatus, 'not_published');
  });

  await t.test('8. Ready for approval is blocked by an unreviewed preview, failed validation or open blocking finding', () => {
    let draft = reviewDraft();
    assert.match(setAuthorReviewStatus(draft, 'ready_for_approval', { planningValidation: passed, contentValidation: passed }).error, /preview/i);
    draft = markAuthorPreviewReviewed(draft);
    assert.match(setAuthorReviewStatus(draft, 'ready_for_approval', { planningValidation: failed, contentValidation: passed }).error, /validation/i);
    draft = addAuthorReviewFinding(draft, { priority: 'blocking', message: 'Fix the instruction.' }).draft;
    assert.match(setAuthorReviewStatus(draft, 'ready_for_approval', { planningValidation: passed, contentValidation: passed }).error, /blocking finding/i);
  });

  await t.test('9. A reviewed and validated draft with resolved blockers can become ready for later approval', () => {
    let draft = markAuthorPreviewReviewed(reviewDraft());
    draft = addAuthorReviewFinding(draft, { priority: 'blocking', message: 'Check the wording.' }).draft;
    draft = updateAuthorReviewFinding(draft, draft.review.findings[0].id, { status: 'resolved' }).draft;
    const result = setAuthorReviewStatus(draft, 'ready_for_approval', { planningValidation: passed, contentValidation: passed });
    assert.equal(result.success, true);
    assert.equal(result.draft.review.reviewStatus, 'ready_for_approval');
    assert.equal(result.draft.review.approvalDecision, 'pending');
    assert.equal(result.draft.publication.publishStatus, 'not_published');
  });

  await t.test('10. Review validation detects forged approval, publishing and invalid ready state', () => {
    const draft = reviewDraft();
    const forged = { ...draft, review: { ...draft.review, reviewStatus: 'ready_for_approval', learnerPreviewStatus: 'not_reviewed', approvalDecision: 'approved' }, programme: { ...draft.programme, publicationVisibility: 'published' }, publication: { ...draft.publication, publishStatus: 'published' } };
    const result = validateAuthorReview(forged);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(item => /requires a reviewed learner preview/i.test(item.message)));
    assert.ok(result.errors.some(item => /Final approval is not available/i.test(item.message)));
    assert.ok(result.errors.some(item => /remain unpublished/i.test(item.message)));
  });

  await t.test('11. Preview review and findings persist as a private unpublished revision', () => {
    const privateStorage = storage();
    let draft = markAuthorPreviewReviewed(reviewDraft());
    draft = addAuthorReviewFinding(draft, { section: 'sources', priority: 'advisory', message: 'Recheck the AWS page before approval.' }).draft;
    assert.equal(storeNewAuthorDraft({ userId: 'author-1', draft, storage: privateStorage }).success, true);
    const saved = saveAuthorDraft({ userId: 'author-1', draft, expectedRevision: 1, storage: privateStorage });
    assert.equal(saved.success, true);
    const loaded = loadAuthorDrafts({ userId: 'author-1', storage: privateStorage }).drafts[0];
    assert.equal(loaded.review.learnerPreviewStatus, 'reviewed');
    assert.equal(loaded.review.findings.length, 1);
    assert.equal(loaded.review.approvalDecision, 'pending');
    assert.equal(loaded.publication.publishStatus, 'not_published');
  });

  await t.test('12. Preview and review stay isolated from learner runtime, Generator, Hands On and publishing', () => {
    const files = ['src/features/followAlongAuthor/authorReview.js', 'src/features/followAlongAuthor/AuthorReviewStages.jsx'];
    const source = files.map(file => readFileSync(file, 'utf8')).join('\n');
    assert.doesNotMatch(source, /scripts\/generator|generator_v2|HandsOn|TaskContext|tasksData|FOLLOW_ALONG_PROGRAMMES/);
    assert.doesNotMatch(source, /VpcTaskRunner|FollowAlongProgramme|saveProgress|executeCleanup|publishDraft|registerProgramme/);
    assert.match(source, /Private preview only/);
    assert.match(source, /not_published/);
  });
});
