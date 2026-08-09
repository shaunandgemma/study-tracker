import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { canAccessFollowAlongAuthor, getAuthorRoles, isAuthorEntryRequested } from '../src/features/followAlongAuthor/authorAccess.js';
import { createAuthorDraft, getAuthorDraftStorageKey, loadAuthorDrafts, saveAuthorDraft, storeNewAuthorDraft } from '../src/features/followAlongAuthor/authorDraftService.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    values
  };
}

const times = (...values) => {
  let index = 0;
  return () => new Date(values[Math.min(index++, values.length - 1)]);
};

test('Follow Along Author foundation', async t => {
  await t.test('1. Author entry is unlinked and requested only by the isolated hash', () => {
    assert.equal(isAuthorEntryRequested({ hash: '#author' }), true);
    assert.equal(isAuthorEntryRequested({ hash: '#author/drafts' }), true);
    assert.equal(isAuthorEntryRequested({ hash: '#follow-alongs' }), false);
    assert.equal(isAuthorEntryRequested({ hash: '' }), false);

    const navbar = readFileSync('src/components/Navbar.jsx', 'utf8');
    const mobile = readFileSync('src/components/MobileBottomNav.jsx', 'utf8');
    assert.doesNotMatch(navbar, /Follow Along Author|#author/);
    assert.doesNotMatch(mobile, /Follow Along Author|#author/);
  });

  await t.test('2. Access uses server-managed app metadata and rejects user metadata', () => {
    assert.deepEqual(getAuthorRoles({ app_metadata: { role: 'AUTHOR', roles: ['admin', 'author'] } }), ['author', 'admin']);
    assert.equal(canAccessFollowAlongAuthor({ id: 'a1', app_metadata: { role: 'author' } }), true);
    assert.equal(canAccessFollowAlongAuthor({ id: 'a2', app_metadata: { roles: ['admin'] } }), true);
    assert.equal(canAccessFollowAlongAuthor({ id: 'l1', app_metadata: { role: 'learner' } }), false);
    assert.equal(canAccessFollowAlongAuthor({ id: 'fake', user_metadata: { role: 'admin' } }), false);
    assert.equal(canAccessFollowAlongAuthor(null), false);
  });

  await t.test('3. New drafts use the canonical contract and start private at revision one', () => {
    const draft = createAuthorDraft({
      userId: 'author-1',
      input: { serviceName: 'Amazon VPC', shortName: 'VPC' },
      now: () => new Date('2026-08-09T10:00:00.000Z'),
      idFactory: () => 'fixed-id'
    });
    assert.equal(draft.schema.profile, 'canonical-follow-along');
    assert.equal(draft.schema.createdWith, 'author-v1');
    assert.equal(draft.draft.draftId, 'author-draft-fixed-id');
    assert.equal(draft.draft.revision, 1);
    assert.equal(draft.draft.status, 'draft');
    assert.equal(draft.draft.createdBy, 'author-1');
    assert.equal(draft.programme.programmeId, 'vpc-learning-path');
    assert.equal(draft.programme.publicationVisibility, 'unpublished');
    assert.equal(draft.publication.publishStatus, 'not_published');
    assert.deepEqual(draft.phases, []);
    assert.deepEqual(draft.tasks, []);
    assert.deepEqual(draft.sources, []);
  });

  await t.test('4. Draft storage is isolated by signed-in author', () => {
    const storage = memoryStorage();
    const draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'Amazon S3', shortName: 'S3' }, idFactory: () => 's3' });
    assert.equal(storeNewAuthorDraft({ userId: 'author-1', draft, storage }).success, true);
    assert.equal(loadAuthorDrafts({ userId: 'author-1', storage }).drafts.length, 1);
    assert.equal(loadAuthorDrafts({ userId: 'author-2', storage }).drafts.length, 0);
    assert.notEqual(getAuthorDraftStorageKey('author-1'), getAuthorDraftStorageKey('author-2'));
    assert.equal(storeNewAuthorDraft({ userId: 'author-2', draft, storage }).success, false);
  });

  await t.test('5. Saving creates a new revision and preserves unpublished status', () => {
    const storage = memoryStorage();
    const draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'Amazon EC2', shortName: 'EC2' }, now: times('2026-08-09T10:00:00.000Z'), idFactory: () => 'ec2' });
    storeNewAuthorDraft({ userId: 'author-1', draft, storage });
    const edited = { ...draft, draft: { ...draft.draft, status: 'published' }, programme: { ...draft.programme, description: 'Private edit', publicationVisibility: 'published' }, publication: { ...draft.publication, publishStatus: 'published' } };
    const result = saveAuthorDraft({ userId: 'author-1', draft: edited, expectedRevision: 1, storage, now: () => new Date('2026-08-09T11:00:00.000Z') });
    assert.equal(result.success, true);
    assert.equal(result.draft.draft.revision, 2);
    assert.equal(result.draft.draft.status, 'draft');
    assert.equal(result.draft.draft.updatedAt, '2026-08-09T11:00:00.000Z');
    assert.equal(result.draft.programme.description, 'Private edit');
    assert.equal(result.draft.programme.publicationVisibility, 'unpublished');
    assert.equal(result.draft.publication.publishStatus, 'not_published');
  });

  await t.test('6. Revision conflicts stop silent overwrites', () => {
    const storage = memoryStorage();
    const draft = createAuthorDraft({ userId: 'author-1', input: { serviceName: 'AWS Lambda' }, idFactory: () => 'lambda' });
    storeNewAuthorDraft({ userId: 'author-1', draft, storage });
    const first = saveAuthorDraft({ userId: 'author-1', draft, expectedRevision: 1, storage });
    assert.equal(first.success, true);
    const stale = saveAuthorDraft({ userId: 'author-1', draft, expectedRevision: 1, storage });
    assert.equal(stale.success, false);
    assert.equal(stale.conflict, true);
    assert.match(stale.error, /newer revision \(2\)/);
  });

  await t.test('7. Author foundation has no Generator, Hands On or published-registry dependency', () => {
    const files = ['src/features/followAlongAuthor/authorAccess.js', 'src/features/followAlongAuthor/authorDraftService.js', 'src/features/followAlongAuthor/authorPlanning.js', 'src/features/followAlongAuthor/authorContent.js', 'src/features/followAlongAuthor/authorReview.js', 'src/features/followAlongAuthor/authorApproval.js', 'src/features/followAlongAuthor/authorSharedStorageService.js', 'src/features/followAlongAuthor/authorStorageCoordinator.js', 'src/features/followAlongAuthor/AuthorStorageMigrationPanel.jsx', 'src/features/followAlongAuthor/AuthorHome.jsx', 'src/features/followAlongAuthor/AuthorDraftEditor.jsx', 'src/features/followAlongAuthor/AuthorContentStages.jsx', 'src/features/followAlongAuthor/AuthorReviewStages.jsx', 'src/features/followAlongAuthor/AuthorApprovalStage.jsx', 'src/features/followAlongAuthor/AuthorEntry.jsx'];
    const source = files.map(file => readFileSync(file, 'utf8')).join('\n');
    assert.doesNotMatch(source, /scripts\/generator|generator_v2|HandsOn|TaskContext|tasksData|FOLLOW_ALONG_PROGRAMMES/);
    assert.match(source, /publicationVisibility: 'unpublished'/);
    assert.match(source, /publishStatus: 'not_published'/);
  });

  await t.test('8. App keeps Author outside learner feature providers', () => {
    const app = readFileSync('src/App.jsx', 'utf8');
    assert.match(app, /if \(authorRequested\) return <AuthorEntry \/>/);
    assert.match(app, /<AuthProvider>[\s\S]*<AuthenticatedApplication \/>/);
    assert.match(app, /return \([\s\S]*<AwsConnectionProvider[\s\S]*<ExamProvider>[\s\S]*<MainContent \/>/);
    assert.doesNotMatch(app, /TaskProvider|TaskContext/);
  });
});
