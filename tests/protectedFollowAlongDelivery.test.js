import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  PROTECTED_FOLLOW_ALONG_PAGE_SIZE,
  PROTECTED_FOLLOW_ALONG_PREVIEW_LIMIT,
  PROTECTED_FOLLOW_ALONG_TABLE,
  PROTECTED_FOLLOW_ALONG_TYPE,
  applyProtectedFollowAlongVisibility,
  createProtectedFollowAlongContentService,
  mapProtectedFollowAlongRow,
  protectedFollowAlongContentId
} from '../src/services/protectedFollowAlongContentService.js';

const migration = readFileSync(
  new URL('../supabase/migrations/20260906_protect_published_follow_along_delivery.sql', import.meta.url),
  'utf8'
);

const postDeploymentVerification = readFileSync(
  new URL('./sql/protected_follow_along_post_deployment_verification.sql', import.meta.url),
  'utf8'
);

const runtime = ({ programmeId, examId, displayName = programmeId }) => ({
  schema: { profile: 'complete-follow-along', version: 1, sharedContractHash: 'b'.repeat(64) },
  programme: {
    programmeId,
    pathId: programmeId,
    examId,
    serviceSlug: programmeId.replace(/-learning-path$/, ''),
    serviceName: displayName,
    displayName,
    shortName: displayName,
    description: `Learn ${displayName}`,
    category: examId === 'terraform-associate-004' ? 'Terraform' : 'AWS Services',
    difficulty: 'Beginner',
    defaultRegion: 'eu-west-2',
    publicationVisibility: 'published'
  },
  publication: { publishStatus: 'published' },
  phases: [{ id: `${programmeId}-phase`, title: 'Prepare' }],
  tasks: [{
    id: `${programmeId}-task`,
    phaseId: `${programmeId}-phase`,
    title: 'Prepare safely',
    modeAvailability: { console: { status: 'available' }, cli: { status: 'not_applicable' } },
    consoleSteps: [{ id: `${programmeId}-step`, instructions: [{ id: `${programmeId}-instruction`, text: 'Open the service.' }] }],
    cliSteps: [],
    cleanup: []
  }],
  resources: { schema: [], variables: {}, chargeableResourceKeys: [] },
  cleanup: { steps: [] }
});

function databaseRow({
  programmeId,
  examId = 'aws-saa-c03',
  sortOrder = 0,
  previewOrder = null,
  displayName = programmeId
}) {
  return {
    content_id: protectedFollowAlongContentId(programmeId),
    exam_id: examId,
    content_type: PROTECTED_FOLLOW_ALONG_TYPE,
    parent_content_id: null,
    title: displayName,
    sort_order: sortOrder,
    preview_order: previewOrder,
    publication_status: 'published',
    content_version: 1,
    content_hash: 'a'.repeat(64),
    payload: runtime({ programmeId, examId, displayName }),
    published_at: '2026-08-21T12:00:00.000Z'
  };
}

function createMockClient(sourceRows, configuredError = null) {
  const calls = [];
  return {
    calls,
    from(table) {
      const query = { table, columns: '', filters: [], orders: [], range: null, single: false };
      calls.push(query);
      const execute = () => {
        const queryError = typeof configuredError === 'function' ? configuredError(query) : configuredError;
        if (queryError) return { data: null, error: queryError };
        let rows = [...sourceRows];
        for (const [column, value] of query.filters) rows = rows.filter(row => row[column] === value);
        for (const order of [...query.orders].reverse()) {
          rows.sort((left, right) => {
            if (left[order.column] === right[order.column]) return 0;
            const result = left[order.column] < right[order.column] ? -1 : 1;
            return order.ascending ? result : -result;
          });
        }
        if (query.range) rows = rows.slice(query.range.from, query.range.to + 1);
        return query.single ? { data: rows[0] || null, error: null } : { data: rows, error: null };
      };
      const builder = {
        select(columns) { query.columns = columns; return builder; },
        eq(column, value) { query.filters.push([column, value]); return builder; },
        order(column, { ascending = true } = {}) { query.orders.push({ column, ascending }); return builder; },
        range(from, to) { query.range = { from, to }; return builder; },
        maybeSingle() { query.single = true; return Promise.resolve(execute()); },
        then(resolve, reject) { return Promise.resolve(execute()).then(resolve, reject); }
      };
      return builder;
    }
  };
}

test('Step 007E2 protected Follow Along delivery preparation', async t => {
  await t.test('backfills only from authoritative published runtime without embedding learner payloads', () => {
    assert.match(migration, /^BEGIN;$/m);
    assert.match(migration, /^COMMIT;$/m);
    assert.match(migration, /INSERT INTO public\.learner_content_items[\s\S]*?FROM public\.follow_along_published_programmes published/);
    assert.match(migration, /public\.follow_along_jsonb_sha256\(published\.runtime_content\)/);
    assert.doesNotMatch(migration, /Learn .* Follow Along|Replace the policy editor|terraform apply/i);
    assert.doesNotMatch(migration, /DELETE FROM public\.follow_along_published_programmes|DELETE FROM public\.learner_content_items|TRUNCATE/i);
  });

  await t.test('stores exact exam, stable order and no more than two deterministic previews', () => {
    assert.match(migration, /ADD COLUMN exam_id TEXT/);
    assert.match(migration, /ADD COLUMN learner_sort_order INTEGER/);
    assert.match(migration, /ADD COLUMN preview_order SMALLINT/);
    assert.match(migration, /follow_along_publishable_programmes_exam_sort_key/);
    assert.match(migration, /follow_along_publishable_programmes_exam_preview_key/);
    assert.match(migration, /preview_order BETWEEN 1 AND 2/);
    assert.match(migration, /row_number\(\) OVER[\s\S]*?PARTITION BY exam_id/);
    assert.match(migration, /HAVING COUNT\(\*\) > 2[\s\S]*?MIN\(preview_order\) <> 1/);
  });

  await t.test('requires exact exam ownership for new programmes while limiting legacy inference to backfill', () => {
    assert.match(migration, /p_allow_legacy_inference BOOLEAN DEFAULT FALSE/);
    assert.match(migration, /follow_along_runtime_exam_id\(published\.runtime_content, TRUE\)/);
    assert.match(migration, /follow_along_runtime_exam_id\(NEW\.runtime_content, FALSE\)/);
    assert.match(migration, /A new Follow Along must declare one supported exact exam ID/);
    assert.match(migration, /approved Follow Along exam ID does not match its server catalogue/);
  });

  await t.test('atomically mirrors future controlled publications without altering publishing safeguards', () => {
    assert.match(migration, /CREATE TRIGGER follow_along_prepare_protected_delivery[\s\S]*?BEFORE INSERT OR UPDATE/);
    assert.match(migration, /CREATE TRIGGER follow_along_sync_protected_delivery[\s\S]*?AFTER INSERT OR UPDATE/);
    assert.match(migration, /ON CONFLICT \(content_id\) DO UPDATE/);
    assert.match(migration, /pg_advisory_xact_lock/);
    assert.doesNotMatch(migration, /CREATE OR REPLACE FUNCTION public\.publish_follow_along_release_candidate/);
    assert.doesNotMatch(migration, /DROP (?:POLICY|TABLE|FUNCTION).*follow_along/i);
  });

  await t.test('preserves progress and retains legacy learner reads until later parity approval', () => {
    assert.match(migration, /step007e2_progress_guard/);
    assert.match(migration, /learner Follow Along progress changed unexpectedly/);
    assert.doesNotMatch(
      migration,
      /REVOKE[^;]*ON\s+(?:TABLE\s+)?public\.follow_along_published_programmes/i,
    );
    assert.doesNotMatch(migration, /(?:INSERT INTO|UPDATE|DELETE FROM) public\.user_learning_path_(?:progress|resources)/i);
  });

  await t.test('maps complete protected rows and rejects mismatched identities', () => {
    const row = databaseRow({
      programmeId: 'terraform-modules-learning-path',
      examId: 'terraform-associate-004',
      displayName: 'Terraform Modules Follow Along'
    });
    const mapped = mapProtectedFollowAlongRow(row);
    assert.ok(mapped);
    assert.equal(mapped.programme.id, 'terraform-modules-learning-path');
    assert.equal(mapped.examId, 'terraform-associate-004');
    assert.equal(mapped.config.identity.programmeId, 'terraform-modules-learning-path');
    assert.equal(mapProtectedFollowAlongRow({ ...row, content_id: 'follow-along:different' }), null);
    assert.equal(mapProtectedFollowAlongRow({ ...row, exam_id: 'aws-saa-c03' }), null);
  });

  await t.test('returns complete exact-exam rows and only ordered previews when requested', async () => {
    const rows = [
      databaseRow({ programmeId: 'aws-one', sortOrder: 0, previewOrder: 1 }),
      databaseRow({ programmeId: 'aws-two', sortOrder: 1, previewOrder: 2 }),
      databaseRow({ programmeId: 'aws-paid', sortOrder: 2 }),
      databaseRow({ programmeId: 'tf-one', examId: 'terraform-associate-004', sortOrder: 0, previewOrder: 1 })
    ];
    const client = createMockClient(rows);
    const result = await createProtectedFollowAlongContentService(client).listForExam('aws-saa-c03');
    assert.equal(result.success, true);
    assert.deepEqual(result.followAlongs.map(item => item.programme.id), ['aws-one', 'aws-two', 'aws-paid']);
    assert.deepEqual(
      applyProtectedFollowAlongVisibility({
        followAlongs: result.followAlongs,
        examId: 'aws-saa-c03',
        previewOnly: true
      }).followAlongs.map(item => item.programme.id),
      ['aws-one', 'aws-two']
    );
    assert.equal(PROTECTED_FOLLOW_ALONG_PREVIEW_LIMIT, 2);
    assert.equal(PROTECTED_FOLLOW_ALONG_PAGE_SIZE, 100);
    assert.deepEqual(client.calls[0].filters, [
      ['exam_id', 'aws-saa-c03'],
      ['content_type', PROTECTED_FOLLOW_ALONG_TYPE],
      ['publication_status', 'published']
    ]);
    assert.deepEqual(client.calls[0].range, { from: 0, to: 99 });
    assert.equal(client.calls[0].table, PROTECTED_FOLLOW_ALONG_TABLE);
  });

  await t.test('loads one exact selected programme and fails closed on unavailable reads', async () => {
    const row = databaseRow({ programmeId: 'aws-one', previewOrder: 1 });
    const client = createMockClient([row]);
    const loaded = await createProtectedFollowAlongContentService(client).loadProgramme('aws-saa-c03', 'aws-one');
    assert.equal(loaded.success, true);
    assert.equal(loaded.followAlong.programme.id, 'aws-one');

    const unavailable = await createProtectedFollowAlongContentService(
      createMockClient([], { message: 'protected Follow Along read unavailable' })
    ).listForExam('aws-saa-c03');
    assert.equal(unavailable.success, false);
    assert.deepEqual(unavailable.followAlongs, []);
    assert.equal(unavailable.error, 'protected Follow Along read unavailable');
  });

  await t.test('connects catalogue and runner without a legacy paid-content fallback', () => {
    const landing = readFileSync('src/components/FollowAlongs/FollowAlongLandingPage.jsx', 'utf8');
    const runner = readFileSync('src/components/FollowAlongs/PublishedFollowAlongView.jsx', 'utf8');

    assert.match(landing, /protectedFollowAlongContentService\.listForExam\(examId\)/);
    assert.match(landing, /applyProtectedFollowAlongVisibility\([\s\S]*?previewOnly/);
    assert.match(landing, /No bundled or legacy paid content was substituted/);
    assert.doesNotMatch(landing, /createPublishedFollowAlongService|listPublishedProgrammes|mergePublishedProgrammeCards/);
    assert.doesNotMatch(landing, /FOLLOW_ALONG_LANDING_PROGRAMMES|limitDemoFollowAlongs/);
    assert.match(runner, /createProtectedFollowAlongContentService/);
    assert.match(runner, /loadProgramme\(expectedExamId, programmeId\)/);
    assert.doesNotMatch(runner, /createPublishedFollowAlongService|loadPublishedProgramme/);
  });

  await t.test('keeps post-deployment verification read-only and rollback-only', () => {
    const executableSql = postDeploymentVerification.replace(/'(?:''|[^'])*'/g, "''");

    assert.match(postDeploymentVerification, /BEGIN;[\s\S]*?SET TRANSACTION READ ONLY;/);
    assert.match(postDeploymentVerification, /ROLLBACK;/);
    assert.equal((postDeploymentVerification.match(/SET LOCAL ROLE anon;/g) || []).length, 1);
    assert.equal((postDeploymentVerification.match(/SET LOCAL ROLE authenticated;/g) || []).length, 5);
    assert.doesNotMatch(
      executableSql,
      /(?:INSERT\s+INTO|UPDATE\s+public\.|DELETE\s+FROM|TRUNCATE|ALTER\s+TABLE|CREATE\s+(?:TABLE|POLICY|FUNCTION|TRIGGER)|DROP\s+)/i,
    );
  });
});
