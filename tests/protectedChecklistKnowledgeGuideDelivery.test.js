import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import {
  buildPrivateChecklistKnowledgeGuideSeedSql,
  buildPrivateChecklistKnowledgeGuideSeedChunks,
  buildPrivateChecklistKnowledgeGuideVerificationSql,
  buildProtectedChecklistKnowledgeGuideSeed,
  checklistDeliveryId,
  knowledgeGuideDeliveryId,
  loadExistingChecklistKnowledgeGuideSource,
  sha256,
  stableStringify
} from '../scripts/buildProtectedChecklistKnowledgeGuideSeed.mjs';
import {
  CHECKLIST_CONTENT_TYPE,
  CHECKLIST_GUIDE_CONTENT_TABLE,
  KNOWLEDGE_GUIDE_CONTENT_TYPE,
  PROTECTED_STUDY_CONTENT_PAGE_SIZE,
  createProtectedChecklistKnowledgeGuideService,
  mapProtectedChecklistRow,
  mapProtectedKnowledgeGuideRow
} from '../src/services/protectedChecklistKnowledgeGuideService.js';

const EXPECTED_MANIFEST_FINGERPRINT = '1c2a99413f692c3933414f61875301393d1adf63ae4ece472a35846ea1429556';

const asDatabaseRow = row => ({ ...row, published_at: '2026-08-20T12:00:00.000Z' });

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
        range(from, to) {
          query.range = { from, to };
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

test('Step 007D protected Checklist and Knowledge Guide preparation', async t => {
  const source = await loadExistingChecklistKnowledgeGuideSource();
  const seed = buildProtectedChecklistKnowledgeGuideSeed(source);
  const databaseRows = seed.rows.map(asDatabaseRow);

  await t.test('preserves every current checklist and guide with deterministic fingerprints', () => {
    assert.equal(seed.counts.checklistItems, 1592);
    assert.equal(seed.counts.knowledgeGuides, 1584);
    assert.equal(seed.counts.total, 3176);
    assert.deepEqual(seed.counts.byExam, {
      'aws-saa-c03': {
        checklistItems: 1547,
        knowledgeGuides: 1547,
        checklistPreviews: 10,
        knowledgeGuidePreviews: 10
      },
      'terraform-associate-004': {
        checklistItems: 37,
        knowledgeGuides: 37,
        checklistPreviews: 10,
        knowledgeGuidePreviews: 10
      },
      'comptia-sec-plus': {
        checklistItems: 8,
        knowledgeGuides: 0,
        checklistPreviews: 8,
        knowledgeGuidePreviews: 0
      }
    });
    assert.equal(seed.manifestFingerprint, EXPECTED_MANIFEST_FINGERPRINT);
    for (const row of seed.rows) {
      assert.equal(row.content_hash, sha256(stableStringify(row.payload)));
      assert.equal(row.payload.id, row.content_type === CHECKLIST_CONTENT_TYPE
        ? row.payload.checklistItem.id
        : row.payload.knowledgeGuide.id);
    }
  });

  await t.test('uses delivery-only row keys while returning every original stable learner ID', () => {
    const checklistRows = seed.rows.filter(row => row.content_type === CHECKLIST_CONTENT_TYPE);
    const guideRows = seed.rows.filter(row => row.content_type === KNOWLEDGE_GUIDE_CONTENT_TYPE);
    assert.equal(new Set(seed.rows.map(row => row.content_id)).size, seed.rows.length);
    for (const row of checklistRows) {
      assert.equal(row.content_id, checklistDeliveryId(row.exam_id, row.payload.id));
      assert.equal(mapProtectedChecklistRow(asDatabaseRow(row)).id, row.payload.id);
    }
    for (const row of guideRows) {
      assert.equal(row.content_id, knowledgeGuideDeliveryId(row.exam_id, row.payload.id));
      assert.equal(row.parent_content_id, checklistDeliveryId(row.exam_id, row.payload.id));
      assert.equal(mapProtectedKnowledgeGuideRow(asDatabaseRow(row)).id, row.payload.id);
    }
  });

  await t.test('selects the same first ten checklist and guide IDs for each available guide set', () => {
    const previews = type => seed.rows
      .filter(row => row.content_type === type && row.preview_order !== null)
      .sort((left, right) => left.exam_id.localeCompare(right.exam_id) || left.preview_order - right.preview_order);
    const checklistPreviews = previews(CHECKLIST_CONTENT_TYPE);
    const guidePreviews = previews(KNOWLEDGE_GUIDE_CONTENT_TYPE);

    for (const examId of ['aws-saa-c03', 'terraform-associate-004']) {
      assert.deepEqual(
        guidePreviews.filter(row => row.exam_id === examId).map(row => row.payload.id),
        checklistPreviews.filter(row => row.exam_id === examId).map(row => row.payload.id)
      );
    }
    assert.deepEqual(
      checklistPreviews.filter(row => row.exam_id === 'aws-saa-c03').map(row => row.payload.id),
      ['vpc-1', 'vpc-6', 'vpc-7', 'vpc-8', 'vpc-9', 'vpc-10', 'vpc-11', 'vpc-12', 'vpc-13', 'vpc-14']
    );
    assert.deepEqual(
      checklistPreviews.filter(row => row.exam_id === 'terraform-associate-004').map(row => row.payload.id),
      ['tf004-1a', 'tf004-1b', 'tf004-1c', 'tf004-2a', 'tf004-2b', 'tf004-2c', 'tf004-2d', 'tf004-3a', 'tf004-3b', 'tf004-3c']
    );
    assert.deepEqual(
      checklistPreviews.filter(row => row.exam_id === 'comptia-sec-plus').map(row => row.payload.id),
      ['sec-1', 'sec-2', 'sec-3', 'sec-4', 'sec-5', 'sec-6', 'sec-7', 'sec-8']
    );
  });

  await t.test('preserves exact checklist ordering and every checklist-to-guide relationship', () => {
    for (const exam of source.exams) {
      const expectedIds = exam.topics.flatMap(topic => topic.items.map(item => item.id));
      const checklistIds = seed.rows
        .filter(row => row.exam_id === exam.id && row.content_type === CHECKLIST_CONTENT_TYPE)
        .sort((left, right) => left.sort_order - right.sort_order)
        .map(row => row.payload.id);
      const guideRows = seed.rows
        .filter(row => row.exam_id === exam.id && row.content_type === KNOWLEDGE_GUIDE_CONTENT_TYPE)
        .sort((left, right) => left.sort_order - right.sort_order);
      assert.deepEqual(checklistIds, expectedIds);
      assert.deepEqual(
        guideRows.map(row => row.payload.id),
        expectedIds.filter(id => source.guidesByExam[exam.id].some(guide => guide.id === id))
      );
      for (const guideRow of guideRows) {
        assert.equal(guideRow.payload.checklistItemId, guideRow.payload.id);
        assert.equal(guideRow.parent_content_id, checklistDeliveryId(exam.id, guideRow.payload.id));
      }
    }
  });

  await t.test('creates only a private guarded seed and preserves learner study progress', () => {
    const sql = buildPrivateChecklistKnowledgeGuideSeedSql(seed);
    const chunks = buildPrivateChecklistKnowledgeGuideSeedChunks(seed);
    const verificationSql = buildPrivateChecklistKnowledgeGuideVerificationSql(seed);
    assert.match(sql, /PRIVATE STEP 007D CHECKLIST AND KNOWLEDGE GUIDE SEED/);
    assert.match(sql, /content_type IN \('checklist_item', 'knowledge_guide'\)/);
    assert.match(sql, /progress_type = 'study_item'/);
    assert.match(sql, /learner study progress changed unexpectedly/);
    assert.match(sql, new RegExp(EXPECTED_MANIFEST_FINGERPRINT));
    assert.doesNotMatch(sql, /^\s*(?:DELETE FROM|TRUNCATE|DROP TABLE public\.)/im);
    assert.ok(chunks.length > 1);
    assert.ok(chunks.every(chunk => Buffer.byteLength(chunk, 'utf8') < 500000));
    assert.equal(chunks.reduce((count, chunk) => {
      const match = chunk.match(/SELECT \d+ AS imported_chunk, \d+ AS total_chunks, (\d+) AS verified_rows;/);
      return count + Number(match?.[1] || 0);
    }, 0), 3176);
    for (const chunk of chunks) {
      assert.match(chunk, /ON CONFLICT \(content_id\) DO NOTHING/);
      assert.match(chunk, /exact row fingerprints did not match/);
      assert.match(chunk, /learner study progress changed unexpectedly/);
      assert.doesNotMatch(chunk, /^\s*(?:DELETE FROM|TRUNCATE|DROP TABLE public\.)/im);
    }
    assert.match(verificationSql, /fingerprint_matches/);
    assert.match(verificationSql, new RegExp(EXPECTED_MANIFEST_FINGERPRINT));
    const gitignore = readFileSync('.gitignore', 'utf8');
    assert.match(gitignore, /^docs\/user-access-and-payments\/$/m);
    assert.equal(
      readdirSync('supabase/migrations').filter(name => name.includes('checklist') || name.includes('knowledge_guide')).length,
      0
    );
  });

  await t.test('browser service requests only both protected types for the selected exact exam', async () => {
    const client = createMockClient(databaseRows);
    const service = createProtectedChecklistKnowledgeGuideService(client);
    const result = await service.listForExam('terraform-associate-004');

    assert.equal(result.success, true);
    assert.equal(result.checklistItems.length, 37);
    assert.equal(result.knowledgeGuides.length, 37);
    assert.deepEqual(result.checklistItems.map(item => item.id), result.knowledgeGuides.map(guide => guide.id));
    assert.equal(client.calls.length, 2);
    assert.deepEqual(client.calls.map(call => call.table), [CHECKLIST_GUIDE_CONTENT_TABLE, CHECKLIST_GUIDE_CONTENT_TABLE]);
    assert.deepEqual(client.calls.map(call => call.filters), [
      [
        ['exam_id', 'terraform-associate-004'],
        ['content_type', CHECKLIST_CONTENT_TYPE],
        ['publication_status', 'published']
      ],
      [
        ['exam_id', 'terraform-associate-004'],
        ['content_type', KNOWLEDGE_GUIDE_CONTENT_TYPE],
        ['publication_status', 'published']
      ]
    ]);
    assert.deepEqual(client.calls.map(call => call.range), [
      { from: 0, to: PROTECTED_STUDY_CONTENT_PAGE_SIZE - 1 },
      { from: 0, to: PROTECTED_STUDY_CONTENT_PAGE_SIZE - 1 }
    ]);
  });

  await t.test('browser service retrieves every ordered AWS row across protected result pages', async () => {
    const client = createMockClient(databaseRows);
    const service = createProtectedChecklistKnowledgeGuideService(client);
    const result = await service.listForExam('aws-saa-c03');

    assert.equal(result.success, true);
    assert.equal(result.checklistItems.length, 1547);
    assert.equal(result.knowledgeGuides.length, 1547);
    assert.deepEqual(result.checklistItems.map(item => item.id), result.knowledgeGuides.map(guide => guide.id));

    const rangesByType = Object.fromEntries([CHECKLIST_CONTENT_TYPE, KNOWLEDGE_GUIDE_CONTENT_TYPE].map(type => [
      type,
      client.calls
        .filter(call => call.filters.some(([column, value]) => column === 'content_type' && value === type))
        .map(call => call.range)
    ]));
    const expectedRanges = [
      { from: 0, to: 499 },
      { from: 500, to: 999 },
      { from: 1000, to: 1499 },
      { from: 1500, to: 1999 }
    ];
    assert.deepEqual(rangesByType[CHECKLIST_CONTENT_TYPE], expectedRanges);
    assert.deepEqual(rangesByType[KNOWLEDGE_GUIDE_CONTENT_TYPE], expectedRanges);
  });

  await t.test('browser service fails closed when any later protected page fails', async () => {
    const client = createMockClient(databaseRows, query => (
      query.range?.from === PROTECTED_STUDY_CONTENT_PAGE_SIZE
        ? { message: 'later protected page unavailable' }
        : null
    ));
    const result = await createProtectedChecklistKnowledgeGuideService(client).listForExam('aws-saa-c03');

    assert.equal(result.success, false);
    assert.deepEqual(result.checklistItems, []);
    assert.deepEqual(result.knowledgeGuides, []);
    assert.equal(result.error, 'later protected page unavailable');
  });

  await t.test('browser service loads guides by stable ID and fails closed on mismatches', async () => {
    const client = createMockClient(databaseRows);
    const service = createProtectedChecklistKnowledgeGuideService(client);
    const loaded = await service.loadGuide('aws-saa-c03', 'vpc-1');
    assert.equal(loaded.success, true);
    assert.equal(loaded.guide.id, 'vpc-1');
    assert.equal(loaded.guide.checklistItemId, 'vpc-1');

    const sourceGuide = databaseRows.find(row => row.content_id === knowledgeGuideDeliveryId('aws-saa-c03', 'vpc-1'));
    assert.equal(mapProtectedKnowledgeGuideRow({
      ...sourceGuide,
      parent_content_id: checklistDeliveryId('aws-saa-c03', 'vpc-6')
    }), null);
    assert.equal(mapProtectedChecklistRow({
      ...databaseRows.find(row => row.content_id === checklistDeliveryId('aws-saa-c03', 'vpc-1')),
      payload: { ...sourceGuide.payload, examId: 'terraform-associate-004' }
    }), null);
  });

  await t.test('browser service reports protected-read failures with no bundled fallback', async () => {
    const service = createProtectedChecklistKnowledgeGuideService(
      createMockClient([], { message: 'protected study content unavailable' })
    );
    const result = await service.listForExam('aws-saa-c03');
    assert.equal(result.success, false);
    assert.deepEqual(result.checklistItems, []);
    assert.deepEqual(result.knowledgeGuides, []);
    assert.equal(result.error, 'protected study content unavailable');

    const throwing = createProtectedChecklistKnowledgeGuideService({
      from() {
        throw new Error('unexpected protected study read failure');
      }
    });
    const thrownResult = await throwing.listForExam('aws-saa-c03');
    assert.equal(thrownResult.success, false);
    assert.deepEqual(thrownResult.checklistItems, []);
    assert.deepEqual(thrownResult.knowledgeGuides, []);
    assert.equal(thrownResult.error, 'unexpected protected study read failure');
  });

  await t.test('retains every existing frontend checklist and guide source', () => {
    assert.equal(readdirSync('src/data/awsKnowledgeGuide', { recursive: true })
      .filter(name => name.endsWith('.js') && !name.endsWith('createAwsKnowledgeGuide.js')).length, 1547);
    assert.equal(readdirSync('src/data/terraformKnowledgeGuide', { recursive: true })
      .filter(name => name.endsWith('.js') && !name.endsWith('index.js')).length, 37);
    assert.match(readFileSync('src/data/examData.js', 'utf8'), /"id": "vpc-1"/);
    assert.match(readFileSync('src/data/exams/terraformAssociateExam.js', 'utf8'), /id: 'tf004-1a'/);
  });
});
