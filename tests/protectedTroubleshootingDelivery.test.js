import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { TROUBLESHOOTING_CHALLENGES } from '../src/data/troubleshootingChallenges/index.js';
import {
  buildPrivateTroubleshootingSeedSql,
  buildProtectedTroubleshootingSeed,
  sha256,
  stableStringify
} from '../scripts/buildProtectedTroubleshootingSeed.mjs';
import {
  PROTECTED_CONTENT_TABLE,
  TROUBLESHOOTING_CONTENT_TYPE,
  createProtectedTroubleshootingContentService,
  mapProtectedTroubleshootingRow
} from '../src/services/protectedTroubleshootingContentService.js';

const migration = fs.readFileSync(
  new URL('../supabase/migrations/20260905_create_protected_learner_content_items.sql', import.meta.url),
  'utf8'
);
const EXPECTED_MANIFEST_FINGERPRINT = '29d30623e8b5a57db5d9c72b6f224a519e4dfd6cb390a683702282d115a84ec7';

function asDatabaseRow(row) {
  return {
    ...row,
    published_at: '2026-08-20T12:00:00.000Z'
  };
}

function createMockClient(sourceRows, configuredError = null) {
  const calls = [];
  return {
    calls,
    from(table) {
      const query = { table, columns: '', filters: [], orders: [], single: false };
      calls.push(query);
      const execute = () => {
        if (configuredError) return { data: null, error: configuredError };
        let rows = [...sourceRows];
        for (const [column, value] of query.filters) {
          rows = rows.filter(row => row[column] === value);
        }
        for (const order of [...query.orders].reverse()) {
          rows.sort((left, right) => {
            const leftValue = left[order.column];
            const rightValue = right[order.column];
            if (leftValue === rightValue) return 0;
            const result = leftValue < rightValue ? -1 : 1;
            return order.ascending ? result : -result;
          });
        }
        return query.single
          ? { data: rows[0] || null, error: null }
          : { data: rows, error: null };
      };
      const builder = {
        select(columns) {
          query.columns = columns;
          return builder;
        },
        eq(column, value) {
          query.filters.push([column, value]);
          return builder;
        },
        order(column, { ascending = true } = {}) {
          query.orders.push({ column, ascending });
          return builder;
        },
        maybeSingle() {
          query.single = true;
          return Promise.resolve(execute());
        },
        then(resolve, reject) {
          return Promise.resolve(execute()).then(resolve, reject);
        }
      };
      return builder;
    }
  };
}

test('Step 007C protected Troubleshooting Challenge delivery', async t => {
  const seed = buildProtectedTroubleshootingSeed();
  const databaseRows = seed.rows.map(asDatabaseRow);

  await t.test('preserves all 55 exact challenge IDs and canonical payload fingerprints', () => {
    assert.equal(seed.rows.length, 55);
    assert.equal(seed.counts.byExam['aws-saa-c03'], 23);
    assert.equal(seed.counts.byExam['terraform-associate-004'], 32);
    assert.equal(seed.manifestFingerprint, EXPECTED_MANIFEST_FINGERPRINT);
    assert.deepEqual(
      new Set(seed.rows.map(row => row.content_id)),
      new Set(TROUBLESHOOTING_CHALLENGES.map(challenge => challenge.id))
    );
    for (const row of seed.rows) {
      assert.equal(row.content_id, row.payload.id);
      assert.equal(row.exam_id, row.payload.examId);
      assert.equal(row.content_hash, sha256(stableStringify(row.payload)));
    }
  });

  await t.test('selects exactly the first two ordered challenges per exam as public preview', () => {
    const previewRows = seed.rows.filter(row => row.preview_order !== null);
    assert.deepEqual(
      previewRows.map(row => `${row.exam_id}:${row.preview_order}:${row.content_id}`),
      [
        'aws-saa-c03:1:aws-private-subnet-connectivity',
        'aws-saa-c03:2:aws-alb-unhealthy-targets',
        'terraform-associate-004:1:terraform-syntax-validation',
        'terraform-associate-004:2:terraform-unwanted-replacement'
      ]
    );
  });

  await t.test('creates an empty protected schema migration with no paid payload embedded', () => {
    assert.match(migration, /^BEGIN;$/m);
    assert.match(migration, /^COMMIT;$/m);
    assert.match(migration, /CREATE TABLE public\.learner_content_items/);
    assert.match(migration, /learner_content_items was not created empty/);
    assert.doesNotMatch(migration, /INSERT INTO public\.learner_content_items/i);
    for (const challenge of TROUBLESHOOTING_CHALLENGES) {
      assert.doesNotMatch(migration, new RegExp(challenge.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  await t.test('enforces preview, exact entitlement and conflict-safe trusted staff reads', () => {
    assert.match(migration, /CREATE POLICY "Preview learner content"/);
    assert.match(migration, /publication_status = 'published'[\s\S]*?preview_order IS NOT NULL/);
    assert.match(migration, /CREATE POLICY "Entitled exact-exam learner content"/);
    assert.match(migration, /entitlement\.user_id = auth\.uid\(\)/);
    assert.match(migration, /entitlement\.exam_id = learner_content_items\.exam_id/);
    assert.match(migration, /entitlement\.starts_at <= clock_timestamp\(\)/);
    assert.match(migration, /entitlement\.expires_at > clock_timestamp\(\)/);
    assert.match(migration, /CREATE POLICY "Trusted role learner content"/);
    for (const role of ['admin', 'author', 'approver']) {
      assert.match(migration, new RegExp(`'${role}'`));
    }
    assert.match(migration, /AND NOT \([\s\S]*?'approver'/);
    assert.match(migration, /AND NOT \([\s\S]*?'author'/);
  });

  await t.test('gives browser roles SELECT only and leaves every existing table untouched', () => {
    assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
    assert.match(migration, /REVOKE ALL PRIVILEGES[\s\S]*?FROM PUBLIC, anon, authenticated/);
    assert.match(migration, /GRANT SELECT[\s\S]*?TO anon, authenticated/);
    assert.doesNotMatch(migration, /GRANT\s+(?:INSERT|UPDATE|DELETE|ALL)[\s\S]*?TO\s+(?:anon|authenticated)/i);
    assert.doesNotMatch(migration, /(?:INSERT INTO|UPDATE|DELETE FROM)\s+public\.(?!learner_content_items)/i);
    for (const protectedTable of [
      'learner_item_progress',
      'exam_entitlements',
      'exam_questions',
      'follow_along_published_programmes'
    ]) {
      assert.doesNotMatch(migration, new RegExp(`(?:ALTER|DROP|TRUNCATE|INSERT INTO|UPDATE|DELETE FROM)\\s+(?:TABLE\\s+)?public\\.${protectedTable}`, 'i'));
    }
  });

  await t.test('private seed SQL verifies counts, previews, fingerprints and unchanged progress', () => {
    const sql = buildPrivateTroubleshootingSeedSql(seed);
    assert.match(sql, /expected 55 Troubleshooting Challenges/);
    assert.match(sql, /exam_id = 'aws-saa-c03'[\s\S]*?<> 23/);
    assert.match(sql, /exam_id = 'terraform-associate-004'[\s\S]*?<> 32/);
    assert.match(sql, /HAVING COUNT\(\*\) <> 2/);
    assert.match(sql, new RegExp(EXPECTED_MANIFEST_FINGERPRINT));
    assert.match(sql, /progress_type = 'troubleshooting_challenge'/);
    assert.match(sql, /learner progress changed unexpectedly/);
    assert.doesNotMatch(sql, /DELETE FROM|TRUNCATE|DROP TABLE public\./i);
  });

  await t.test('browser reader requests only the exact exam and Troubleshooting type', async () => {
    const client = createMockClient(databaseRows);
    const service = createProtectedTroubleshootingContentService(client);
    const result = await service.listForExam('terraform-associate-004');

    assert.equal(result.success, true);
    assert.equal(result.challenges.length, 32);
    assert.deepEqual(
      result.challenges.map(challenge => challenge.id),
      TROUBLESHOOTING_CHALLENGES
        .filter(challenge => challenge.examId === 'terraform-associate-004')
        .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id))
        .map(challenge => challenge.id)
    );
    assert.equal(client.calls[0].table, PROTECTED_CONTENT_TABLE);
    assert.deepEqual(client.calls[0].filters, [
      ['exam_id', 'terraform-associate-004'],
      ['content_type', TROUBLESHOOTING_CONTENT_TYPE],
      ['publication_status', 'published']
    ]);
  });

  await t.test('single challenge reads preserve IDs and fail closed on mismatched payloads', async () => {
    const expected = databaseRows.find(row => row.content_id === 'aws-iam-access-denied');
    const client = createMockClient(databaseRows);
    const service = createProtectedTroubleshootingContentService(client);
    const result = await service.loadChallenge('aws-saa-c03', expected.content_id);

    assert.equal(result.success, true);
    assert.equal(result.challenge.id, expected.content_id);
    assert.equal(result.challenge.examId, 'aws-saa-c03');
    assert.equal(result.challenge.contentHash, expected.content_hash);

    assert.equal(mapProtectedTroubleshootingRow({
      ...expected,
      payload: { ...expected.payload, id: 'different-id' }
    }), null);
    assert.equal(mapProtectedTroubleshootingRow({
      ...expected,
      payload: { ...expected.payload, examId: 'terraform-associate-004' }
    }), null);
  });

  await t.test('browser reader reports database failures without a frontend fallback', async () => {
    const service = createProtectedTroubleshootingContentService(
      createMockClient([], { message: 'protected read unavailable' })
    );
    const result = await service.listForExam('aws-saa-c03');

    assert.equal(result.success, false);
    assert.deepEqual(result.challenges, []);
    assert.equal(result.error, 'protected read unavailable');

    const throwingService = createProtectedTroubleshootingContentService({
      from() {
        throw new Error('unexpected protected read failure');
      }
    });
    const thrownResult = await throwingService.listForExam('aws-saa-c03');
    assert.equal(thrownResult.success, false);
    assert.deepEqual(thrownResult.challenges, []);
    assert.equal(thrownResult.error, 'unexpected protected read failure');
  });
});
