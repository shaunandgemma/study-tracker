import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateFollowAlongConfig } from '../src/components/FollowAlongs/shared/followAlongContract.js';
import {
  CONTROLLED_PUBLISHING_FLAG,
  buildPublishedFollowAlongConfig,
  buildPublishedProgrammeCard,
  isControlledPublishingEnabled,
  mergePublishedProgrammeCards
} from '../src/features/followAlongs/published/publishedFollowAlongService.js';
import {
  CONTROLLED_PUBLISHING_CONFIRMATION,
  CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID,
  createAuthorSharedStorageService,
  getControlledPublishingConfirmation
} from '../src/features/followAlongAuthor/authorSharedStorageService.js';
import { FOLLOW_ALONG_PROGRAMMES } from '../src/data/followAlongProgrammes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20260813_follow_along_controlled_publishing.sql'), 'utf8');
const programmeIdCorrection = fs.readFileSync(path.join(root, 'supabase/migrations/20260814_follow_along_publishing_programme_id_correction.sql'), 'utf8');
const versionPublishing = fs.readFileSync(path.join(root, 'supabase/migrations/20260818_follow_along_lambda_version_publishing.sql'), 'utf8');
const servicePublishing = fs.readFileSync(path.join(root, 'supabase/migrations/20260819_follow_along_service_specific_publishing.sql'), 'utf8');
const sqsPublishingEnablement = fs.readFileSync(path.join(root, 'supabase/migrations/20260820_enable_sqs_controlled_publishing.sql'), 'utf8');
const snsPublishingEnablement = fs.readFileSync(path.join(root, 'supabase/migrations/20260821_enable_sns_controlled_publishing.sql'), 'utf8');
const automaticPublishingRegistration = fs.readFileSync(path.join(root, 'supabase/migrations/20260822_auto_register_approved_follow_along_publishing.sql'), 'utf8');
const automaticPublishingIdentityFix = fs.readFileSync(path.join(root, 'supabase/migrations/20260823_fix_automatic_publishing_programme_identity.sql'), 'utf8');
const duplicateApprovalProtection = fs.readFileSync(path.join(root, 'supabase/migrations/20260824_prevent_duplicate_follow_along_approval_requests.sql'), 'utf8');
const rollback = fs.readFileSync(path.join(root, 'supabase/rollback/20260813_follow_along_controlled_publishing_rollback.sql'), 'utf8');
const queue = fs.readFileSync(path.join(root, 'src/features/followAlongAuthor/AuthorApprovalQueue.jsx'), 'utf8');

function approvedRuntimeRow() {
  const task = {
    id: 'lambda-create-function',
    phaseId: 'lambda-create',
    title: 'Create Node.js Lambda Function',
    isOptional: false,
    prerequisites: [],
    createdResourceKeys: ['functionName'],
    modeAvailability: {
      console: { status: 'available', reason: '' },
      cli: { status: 'not_applicable', reason: 'The approved pilot uses AWS Console steps.' }
    },
    consoleSteps: [{ id: 'console-create', instructions: [{ id: 'open-lambda', text: 'Open Lambda.' }], commands: [] }],
    cliSteps: []
  };
  return {
    programme_id: 'lambda-learning-path',
    candidate_id: CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID,
    source_revision: 13,
    content_hash: 'approved-hash',
    published_at: '2026-08-09T12:00:00.000Z',
    runtime_content: {
      schema: { profile: 'canonical-follow-along', version: '1.0.0' },
      programme: {
        programmeId: 'lambda-learning-path',
        pathId: 'lambda-learning-path',
        serviceSlug: 'lambda',
        serviceName: 'AWS Lambda',
        shortName: 'Lambda',
        displayName: 'Build and Test Your First AWS Lambda Function',
        description: 'Create, test, observe, and safely clean up a first Lambda function.',
        category: 'Compute',
        difficulty: 'Beginner',
        estimatedMinutes: 45,
        defaultRegion: 'eu-west-2',
        supportedModes: ['console', 'cli', 'both'],
        publicationVisibility: 'published'
      },
      presentation: { iconLabel: 'LAM', accentColor: '#0891b2' },
      storage: {},
      progress: { initialTaskId: task.id, supportedModes: ['console', 'cli', 'both'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned'] },
      capabilities: {},
      phases: [{ id: 'lambda-create', title: 'Create Lambda Function', taskIds: [task.id] }],
      tasks: [task],
      resources: { schema: [{ key: 'functionName', type: 'text', label: 'Function name', validator: { kind: 'none' } }], interpolationAliases: {}, chargeableResourceKeys: [], variables: {} },
      warnings: {},
      cleanup: { steps: [{ id: 'delete-function', title: 'Delete the trial function' }], completionGate: 'all_items', manualOnly: true, ordering: 'reverse_dependency' },
      extensions: { registrations: [] },
      implementationRequirements: [],
      publication: { publishStatus: 'published' }
    }
  };
}

test('Step 54 controlled publishing', async t => {
  await t.test('1. Client flag is strict and disabled by default', () => {
    assert.equal(CONTROLLED_PUBLISHING_FLAG, 'VITE_FOLLOW_ALONG_CONTROLLED_PUBLISHING');
    assert.equal(isControlledPublishingEnabled({}), false);
    assert.equal(isControlledPublishingEnabled({ [CONTROLLED_PUBLISHING_FLAG]: 'true' }), true);
    assert.equal(isControlledPublishingEnabled({ [CONTROLLED_PUBLISHING_FLAG]: 'TRUE' }), true);
    assert.equal(isControlledPublishingEnabled({ [CONTROLLED_PUBLISHING_FLAG]: '1' }), false);
  });

  await t.test('2. Published snapshot adapter satisfies the shared Follow Along contract', () => {
    const config = buildPublishedFollowAlongConfig(approvedRuntimeRow());
    assert.ok(config);
    assert.deepEqual(validateFollowAlongConfig(config), { valid: true, errors: [], warnings: [] });
    assert.equal(config.identity.programmeId, 'lambda-learning-path');
    assert.equal(config.tasks[0].modeAvailability.console.status, 'supported');
    assert.equal(approvedRuntimeRow().runtime_content.tasks[0].modeAvailability.console.status, 'available');
    assert.equal(config.storage.remoteProgressTable, 'user_learning_path_progress');
    assert.equal(config.storage.remoteResourcesTable, 'user_learning_path_resources');
  });

  await t.test('3. Published Lambda replaces only its coming-soon card', () => {
    const original = structuredClone(FOLLOW_ALONG_PROGRAMMES);
    const lambda = buildPublishedProgrammeCard(approvedRuntimeRow());
    const merged = mergePublishedProgrammeCards(FOLLOW_ALONG_PROGRAMMES, [lambda]);
    assert.equal(merged.length, FOLLOW_ALONG_PROGRAMMES.length);
    assert.equal(merged.find(item => item.id === 'lambda-learning-path').status, 'available');
    assert.deepEqual(merged.filter(item => item.id !== 'lambda-learning-path'), FOLLOW_ALONG_PROGRAMMES.filter(item => item.id !== 'lambda-learning-path'));
    assert.deepEqual(FOLLOW_ALONG_PROGRAMMES, original);
  });

  await t.test('4. Database function is exact-candidate, exact-confirmation and insert-only', () => {
    assert.match(migration, /publish_follow_along_release_candidate/);
    assert.match(migration, new RegExp(CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID));
    assert.match(migration, /p_confirmation IS DISTINCT FROM 'PUBLISH LAMBDA'/);
    assert.match(migration, /programme_id IS DISTINCT FROM 'lambda-learning-path'/);
    assert.match(migration, /candidate\.status <> 'approved_release_candidate'/);
    assert.match(migration, /public\.follow_along_jsonb_sha256\(candidate\.snapshot\) <> candidate\.content_hash/);
    assert.match(migration, /INSERT INTO public\.follow_along_published_programmes/);
    assert.doesNotMatch(migration, /DELETE\s+FROM\s+public\.follow_along_published_programmes/i);
  });

  await t.test('5. Learner package is sanitized and safe columns only are granted', () => {
    assert.match(migration, /candidate\.snapshot - ARRAY\['author', 'draft', 'review', 'sources'\]/);
    assert.match(migration, /publicationVisibility.*published/s);
    assert.match(migration, /GRANT SELECT \(\s*programme_id,\s*candidate_id,\s*source_revision,\s*content_hash,\s*runtime_content,\s*change_summary,\s*published_at\s*\)/s);
    assert.doesNotMatch(migration, /GRANT\s+ALL\s+ON TABLE public\.follow_along_published_programmes/i);
  });

  await t.test('6. Migration and rollback leave unrelated learner and legacy tables alone', () => {
    const executable = `${migration}\n${rollback}`.replace(/^\s*--.*$/gm, '');
    for (const protectedName of ['exam_questions', 'exam_attempts', 'hands_on_tasks', 'hands_on_task_progress', 'user_learning_path_progress', 'user_learning_path_resources']) {
      assert.doesNotMatch(executable, new RegExp(`(?:INSERT|UPDATE|DELETE|TRUNCATE|ALTER|DROP)\\s+(?:TABLE\\s+)?(?:public\\.)?${protectedName}`, 'i'));
    }
    assert.doesNotMatch(rollback, /\b(?:DELETE|DROP|TRUNCATE)\b/i);
    assert.match(rollback, /controlled_publishing_enabled = FALSE/);
    assert.match(rollback, /publication_status = 'withdrawn'/);
  });

  await t.test('7. UI shows the exact summary and requires the candidate service phrase', () => {
    assert.match(queue, /Exact change summary/);
    assert.match(queue, /Leave all existing Follow Alongs unchanged/);
    assert.match(queue, /Leave all existing learner progress unchanged/);
    assert.match(queue, /getControlledPublishingConfirmation\(candidate\)/);
    assert.match(queue, /confirmation !== requiredConfirmation/);
    assert.equal(CONTROLLED_PUBLISHING_CONFIRMATION, 'PUBLISH LAMBDA');
    assert.equal(getControlledPublishingConfirmation({ snapshot: { programme: { serviceSlug: 'lambda' } } }), 'PUBLISH LAMBDA');
    assert.equal(getControlledPublishingConfirmation({ snapshot: { programme: { serviceSlug: 's3' } } }), 'PUBLISH S3');
    assert.equal(getControlledPublishingConfirmation({ snapshot: { programme: { serviceSlug: 'route-53' } } }), 'PUBLISH ROUTE 53');
  });

  await t.test('8. Browser service calls only the protected two-argument RPC', async () => {
    const calls = [];
    const client = { rpc: async (name, args) => { calls.push({ name, args }); return { data: { programmeId: 'lambda-learning-path' }, error: null }; } };
    const service = createAuthorSharedStorageService(client, { enabled: true, publishingEnabled: true });
    const result = await service.publishReleaseCandidate(CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID, CONTROLLED_PUBLISHING_CONFIRMATION);
    assert.equal(result.success, true);
    assert.deepEqual(calls, [{ name: 'publish_follow_along_release_candidate', args: { p_candidate_id: CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID, p_confirmation: 'PUBLISH LAMBDA' } }]);
  });

  await t.test('9. Missing candidates and malformed confirmations never reach the RPC', async () => {
    let calls = 0;
    const client = { rpc: async () => { calls += 1; return { data: null, error: null }; } };
    const service = createAuthorSharedStorageService(client, { enabled: true, publishingEnabled: true });
    assert.equal((await service.publishReleaseCandidate('', CONTROLLED_PUBLISHING_CONFIRMATION)).success, false);
    assert.equal((await service.publishReleaseCandidate(CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID, 'publish lambda')).success, false);
    assert.equal(calls, 0);
  });

  await t.test('10. Programme identifier correction removes the PL/pgSQL ambiguity', () => {
    assert.match(programmeIdCorrection, /target_programme_id TEXT/);
    assert.match(programmeIdCorrection, /published\.programme_id = 'lambda-learning-path'/);
    assert.match(programmeIdCorrection, /published\.candidate_id = p_candidate_id/);
    assert.doesNotMatch(programmeIdCorrection, /^\s+programme_id TEXT;/m);
    assert.doesNotMatch(programmeIdCorrection, /WHERE\s+programme_id\s*=/i);
    assert.doesNotMatch(programmeIdCorrection, /\b(?:DELETE|DROP|TRUNCATE)\b/i);
  });

  await t.test('11. Lambda version migration accepts approved newer revisions and preserves history', () => {
    assert.match(versionPublishing, /candidate\.source_revision <= current_publication\.source_revision/);
    assert.match(versionPublishing, /INSERT INTO public\.follow_along_publication_history/);
    assert.doesNotMatch(versionPublishing, new RegExp(`p_candidate_id IS DISTINCT FROM '${CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID}'`));
  });

  await t.test('12. Service-specific publishing derives the phrase on the server and uses an allow-list', () => {
    assert.match(servicePublishing, /CREATE TABLE IF NOT EXISTS public\.follow_along_publishable_programmes/);
    assert.match(servicePublishing, /expected_confirmation := 'PUBLISH ' \|\| allowed_programme\.publish_token/);
    assert.match(servicePublishing, /p_confirmation IS DISTINCT FROM expected_confirmation/);
    assert.match(servicePublishing, /allowed\.programme_id = target_programme_id/);
    assert.match(servicePublishing, /allowed\.service_slug = target_service_slug/);
    assert.match(servicePublishing, /allowed\.enabled = TRUE/);
    assert.doesNotMatch(servicePublishing.replace(/^\s*--.*$/gm, ''), /^\s*(DELETE|TRUNCATE)\b/im);
  });

  await t.test('13. UI blocks stale keys, limits publishing waits and hides controls for published history', () => {
    assert.match(queue, /service\.loadDraft\(candidate\.draft_id\)/);
    assert.match(queue, /currentRevision !== candidateRevision \|\| !fingerprintsMatch/);
    assert.match(queue, /Publishing did not respond within 15 seconds/);
    assert.match(queue, /finally\s*{\s*setBusy\(false\)/);
    assert.match(queue, /if \(published\)/);
    assert.match(queue, /if \(olderThanPublished\)/);
  });

  await t.test('14. Browser passes a newer service candidate only after a valid shaped confirmation', async () => {
    const calls = [];
    const client = { rpc: async (name, args) => { calls.push({ name, args }); return { data: { candidateId: args.p_candidate_id }, error: null }; } };
    const service = createAuthorSharedStorageService(client, { enabled: true, publishingEnabled: true });
    const result = await service.publishReleaseCandidate('new-approved-s3-candidate', 'PUBLISH S3');
    assert.equal(result.success, true);
    assert.deepEqual(calls, [{ name: 'publish_follow_along_release_candidate', args: { p_candidate_id: 'new-approved-s3-candidate', p_confirmation: 'PUBLISH S3' } }]);
  });

  await t.test('15. SQS enablement adds only the exact protected publishing allow-list row', () => {
    assert.match(sqsPublishingEnablement, /INSERT INTO public\.follow_along_publishable_programmes/);
    assert.match(sqsPublishingEnablement, /'sqs-learning-path'/);
    assert.match(sqsPublishingEnablement, /'sqs'/);
    assert.match(sqsPublishingEnablement, /'SQS'/);
    assert.match(sqsPublishingEnablement, /'Amazon Simple Queue Service'/);
    assert.match(sqsPublishingEnablement, /enabled = EXCLUDED\.enabled/);
    assert.doesNotMatch(sqsPublishingEnablement, /lambda-learning-path|dynamodb/i);
    assert.doesNotMatch(sqsPublishingEnablement, /follow_along_release_candidates|follow_along_published_programmes|follow_along_author_drafts/);
    assert.doesNotMatch(sqsPublishingEnablement, /publish_follow_along_release_candidate\s*\(/);
    assert.doesNotMatch(sqsPublishingEnablement, /\b(?:DELETE|DROP|TRUNCATE|ALTER)\b/i);
  });

  await t.test('16. SNS enablement adds only the exact protected publishing allow-list row', () => {
    assert.match(snsPublishingEnablement, /INSERT INTO public\.follow_along_publishable_programmes/);
    assert.match(snsPublishingEnablement, /'sns-learning-path'/);
    assert.match(snsPublishingEnablement, /'sns'/);
    assert.match(snsPublishingEnablement, /'SNS'/);
    assert.match(snsPublishingEnablement, /'Amazon Simple Notification Service'/);
    assert.match(snsPublishingEnablement, /enabled = EXCLUDED\.enabled/);
    assert.doesNotMatch(snsPublishingEnablement, /lambda-learning-path|sqs-learning-path|dynamodb/i);
    assert.doesNotMatch(snsPublishingEnablement, /follow_along_release_candidates|follow_along_published_programmes|follow_along_author_drafts/);
    assert.doesNotMatch(snsPublishingEnablement, /publish_follow_along_release_candidate\s*\(/);
    assert.doesNotMatch(snsPublishingEnablement, /\b(?:DELETE|DROP|TRUNCATE|ALTER)\b/i);
  });

  await t.test('17. trusted approval automatically registers future services without publishing them', () => {
    assert.match(automaticPublishingRegistration, /AFTER UPDATE OF status, approval_decision/);
    assert.match(automaticPublishingRegistration, /OLD\.status = 'awaiting_trusted_approval'/);
    assert.match(automaticPublishingRegistration, /OLD\.approval_decision = 'pending'/);
    assert.match(automaticPublishingRegistration, /NEW\.status = 'approved_release_candidate'/);
    assert.match(automaticPublishingRegistration, /NEW\.approval_decision = 'approved'/);
    assert.match(automaticPublishingRegistration, /NEW\.approved_by IS NOT NULL/);
    assert.match(automaticPublishingRegistration, /NEW\.approved_at IS NOT NULL/);
    assert.match(automaticPublishingRegistration, /NEW\.programme_id IS DISTINCT FROM \(candidate_service_slug \|\| '-learning-path'\)/);
    assert.match(automaticPublishingRegistration, /programme,programmeId/);
    assert.match(automaticPublishingRegistration, /INSERT INTO public\.follow_along_publishable_programmes/);
    assert.match(automaticPublishingRegistration, /upper\(replace\(candidate_service_slug, '-', ' '\)\)/);
    assert.match(automaticPublishingRegistration, /enabled = TRUE/);
    assert.match(automaticPublishingRegistration, /SECURITY DEFINER/);
    assert.match(automaticPublishingRegistration, /REVOKE ALL ON FUNCTION public\.register_approved_follow_along_for_publishing\(\) FROM PUBLIC, anon, authenticated/);
    assert.doesNotMatch(automaticPublishingRegistration, /INSERT INTO public\.follow_along_published_programmes/);
    assert.doesNotMatch(automaticPublishingRegistration, /publish_follow_along_release_candidate\s*\(/);
    assert.doesNotMatch(automaticPublishingRegistration, /\b(?:DELETE|TRUNCATE)\b/i);
  });

  await t.test('18. automatic registration reads programme identity only from the immutable snapshot', () => {
    assert.match(automaticPublishingIdentityFix, /candidate_programme_id := trim\(NEW\.snapshot #>> '\{programme,programmeId\}'\)/);
    assert.match(automaticPublishingIdentityFix, /candidate_service_slug := lower\(trim\(NEW\.snapshot #>> '\{programme,serviceSlug\}'\)\)/);
    assert.match(automaticPublishingIdentityFix, /candidate_programme_id IS DISTINCT FROM \(candidate_service_slug \|\| '-learning-path'\)/);
    assert.match(automaticPublishingIdentityFix, /VALUES \(\s*candidate_programme_id,/s);
    assert.doesNotMatch(automaticPublishingIdentityFix, /NEW\.programme_id/);
    assert.doesNotMatch(automaticPublishingIdentityFix, /INSERT INTO public\.follow_along_published_programmes/);
    assert.doesNotMatch(automaticPublishingIdentityFix, /publish_follow_along_release_candidate\s*\(/);
    assert.doesNotMatch(automaticPublishingIdentityFix, /\b(?:DELETE|DROP|TRUNCATE|ALTER)\b/i);
  });

  await t.test('19. approval queue cannot remain stuck loading when either read fails or stalls', () => {
    assert.match(queue, /const QUEUE_TIMEOUT_MS = 15000/);
    assert.match(queue, /withQueueTimeout\(\s*service\.listReleaseCandidates\(\)/s);
    assert.match(queue, /withQueueTimeout\(\s*publishedService\.listPublishedProgrammes\(\)/s);
    assert.match(queue, /finally\s*{\s*setLoading\(false\)/s);
    assert.doesNotMatch(queue, /Promise\.all\(\[\s*service\.listReleaseCandidates\(\),\s*publishedService\.listPublishedProgrammes\(\)/s);
  });

  await t.test('20. approval permits one browser request and duplicate database requests fail without waiting', () => {
    assert.match(queue, /const queueActionRef = useRef\(null\)/);
    assert.match(queue, /if \(queueActionRef\.current\)/);
    assert.match(queue, /queueActionRef\.current = action/);
    assert.match(queue, /Approval request sent once/);
    assert.match(queue, /Boolean\(queueAction\)/);
    assert.match(queue, /Approving once\.\.\./);
    assert.match(duplicateApprovalProtection, /pg_try_advisory_xact_lock\(hashtextextended\(p_candidate_id, 0\)\)/);
    assert.match(duplicateApprovalProtection, /FOR UPDATE NOWAIT/);
    assert.match(duplicateApprovalProtection, /Approval is already in progress for this release candidate/);
    assert.match(duplicateApprovalProtection, /ERRCODE = '55P03'/);
    assert.doesNotMatch(duplicateApprovalProtection, /\b(?:DELETE|TRUNCATE|DROP TABLE)\b/i);
    assert.doesNotMatch(duplicateApprovalProtection, /follow_along_published_programmes/);
  });
});
