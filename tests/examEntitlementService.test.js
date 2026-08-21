import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  EXAM_ENTITLEMENTS_TABLE,
  EXAM_ENTITLEMENT_COLUMNS,
  createExamEntitlementService,
  validateExamEntitlementRow
} from '../src/services/examEntitlementService.js';

const USER_ID = '11111111-1111-4111-8111-111111111111';

function entitlement(overrides = {}) {
  return {
    user_id: USER_ID,
    exam_id: 'aws-saa-c03',
    status: 'active',
    starts_at: '2026-08-20T00:00:00.000Z',
    expires_at: '2027-08-20T00:00:00.000Z',
    created_at: '2026-08-20T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
    ...overrides
  };
}

function mockClient(response) {
  const calls = [];
  const query = {
    select(columns) {
      calls.push(['select', columns]);
      return this;
    },
    eq(column, value) {
      calls.push(['eq', column, value]);
      return this;
    },
    order(column, options) {
      calls.push(['order', column, options]);
      return Promise.resolve(response);
    }
  };
  return {
    calls,
    client: {
      from(table) {
        calls.push(['from', table]);
        return query;
      }
    }
  };
}

test('Step 004I read-only exam-entitlement service', async t => {
  await t.test('1. rejects a missing or invalid authenticated learner ID before querying', async () => {
    let contacted = false;
    const service = createExamEntitlementService({
      supabaseClient: { from: () => { contacted = true; } }
    });

    const result = await service.loadOwnEntitlements({ userId: 'not-a-uuid' });
    assert.equal(result.success, false);
    assert.equal(result.validationError, true);
    assert.equal(contacted, false);
  });

  await t.test('2. selects only approved columns for the exact signed-in learner', async () => {
    const mock = mockClient({ data: [], error: null });
    const result = await createExamEntitlementService({ supabaseClient: mock.client })
      .loadOwnEntitlements({ userId: USER_ID });

    assert.equal(result.success, true);
    assert.deepEqual(mock.calls, [
      ['from', EXAM_ENTITLEMENTS_TABLE],
      ['select', EXAM_ENTITLEMENT_COLUMNS],
      ['eq', 'user_id', USER_ID],
      ['order', 'exam_id', { ascending: true }]
    ]);
  });

  await t.test('3. returns only fully verified owned rows', async () => {
    const row = entitlement();
    const mock = mockClient({ data: [row], error: null });
    const result = await createExamEntitlementService({ supabaseClient: mock.client })
      .loadOwnEntitlements({ userId: USER_ID });

    assert.equal(result.success, true);
    assert.equal(result.verified, true);
    assert.deepEqual(result.rows, [row]);
    assert.equal(Object.isFrozen(result.rows), true);
    assert.equal(Object.isFrozen(result.rows[0]), true);
  });

  await t.test('4. fails the complete load when any returned row belongs to another learner', async () => {
    const mock = mockClient({
      data: [entitlement(), entitlement({ user_id: '22222222-2222-4222-8222-222222222222' })],
      error: null
    });
    const result = await createExamEntitlementService({ supabaseClient: mock.client })
      .loadOwnEntitlements({ userId: USER_ID });

    assert.equal(result.success, false);
    assert.equal(result.verificationFailed, true);
    assert.deepEqual(result.rows, []);
  });

  await t.test('5. rejects unsupported exams, statuses and invalid time windows', () => {
    assert.equal(validateExamEntitlementRow(entitlement({ exam_id: 'unknown-exam' }), USER_ID).valid, false);
    assert.equal(validateExamEntitlementRow(entitlement({ status: 'paid' }), USER_ID).valid, false);
    assert.equal(validateExamEntitlementRow(entitlement({ expires_at: '2026-08-19T00:00:00.000Z' }), USER_ID).valid, false);
  });

  await t.test('6. database and malformed-response failures return no entitlement rows', async () => {
    const databaseFailure = mockClient({ data: null, error: { message: 'database unavailable' } });
    const failed = await createExamEntitlementService({ supabaseClient: databaseFailure.client })
      .loadOwnEntitlements({ userId: USER_ID });
    assert.equal(failed.success, false);
    assert.equal(failed.loadFailed, true);
    assert.deepEqual(failed.rows, []);

    const malformed = mockClient({ data: {}, error: null });
    const rejected = await createExamEntitlementService({ supabaseClient: malformed.client })
      .loadOwnEntitlements({ userId: USER_ID });
    assert.equal(rejected.success, false);
    assert.equal(rejected.verificationFailed, true);
    assert.deepEqual(rejected.rows, []);
  });

  await t.test('7. exposes no entitlement mutation method or mutation query', () => {
    const service = createExamEntitlementService({ supabaseClient: {} });
    assert.deepEqual(Object.keys(service), ['loadOwnEntitlements']);

    const source = fs.readFileSync(new URL('../src/services/examEntitlementService.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\.(?:insert|upsert|update|delete)\s*\(/);
    assert.doesNotMatch(source, /service_role|secret|payment|checkout|webhook/i);
  });

  await t.test('8. AuthContext passes only verified rows into the central policy and keeps gates unchanged', () => {
    const context = fs.readFileSync(new URL('../src/features/auth/AuthContext.jsx', import.meta.url), 'utf8');
    assert.match(context, /examEntitlementService as defaultExamEntitlementService/);
    assert.match(context, /resolveEntitlementRefreshResult\(result\)/);
    assert.match(context, /if \(decision\.accepted\)/);
    assert.match(context, /setVerifiedEntitlements\(\[\]\)/);
    assert.match(
      context,
      /buildApplicationAccessPolicy\(currentUser, \{\s*verifiedEntitlements,\s*now: accessEvaluationTime\s*\}\)/
    );

    const app = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
    assert.doesNotMatch(app, /canAccessCompleteExam|contentScope|activeExamIds/);
  });
});
