import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationPath = 'supabase/migrations/20260917_repair_preserved_paid_through.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');

test('Step 009N1 preserved paid-through repair migration', async t => {
  await t.test('is one fail-closed transaction with no schema or function change', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.equal((migration.match(/^DO \$\$$/gm) || []).length, 1);
    assert.match(migration, /pg_advisory_xact_lock/);
    assert.match(migration, /IN SHARE ROW EXCLUSIVE MODE/);
    assert.doesNotMatch(executable, /CREATE(?:\s+OR\s+REPLACE)?\s+(?:TABLE|FUNCTION)|ALTER\s+TABLE|DROP\s+|TRUNCATE/i);
  });

  await t.test('requires all audited migrations and the service-role-only reconciliation contract', () => {
    for (const version of ['20260912', '20260913', '20260914', '20260915', '20260916']) {
      assert.ok(migration.includes(`'${version}'`));
    }
    assert.match(migration, /migration_count <> 5/);
    assert.match(migration, /ELSE payment_exam_subscriptions\.paid_through/);
    assert.match(migration, /ELSE payment_exam_subscriptions\.latest_invoice_id/);
    assert.match(migration, /prior_full_refund_transition_count <> 1/);
    assert.match(migration, /has_function_privilege\('anon', reconciliation_function, 'EXECUTE'\)/);
    assert.match(migration, /has_function_privilege\('authenticated', reconciliation_function, 'EXECUTE'\)/);
    assert.match(migration, /NOT has_function_privilege\('service_role', reconciliation_function, 'EXECUTE'\)/);
  });

  await t.test('locks, snapshots and preserves every protected table', () => {
    for (const table of [
      'payment_exam_products',
      'payment_customers',
      'payment_exam_subscriptions',
      'payment_webhook_events',
      'exam_entitlement_events',
      'exam_entitlements',
      'learner_item_progress',
      'exam_attempts'
    ]) assert.match(migration, new RegExp(`public\\.${table}`));

    for (const [name, count] of [
      ['payment_exam_products', 3],
      ['payment_customers', 3],
      ['payment_exam_subscriptions', 3],
      ['payment_webhook_events', 25],
      ['exam_entitlement_events', 6],
      ['exam_entitlements', 3],
      ['learner_item_progress', 3],
      ['exam_attempts', 12]
    ]) assert.match(migration, new RegExp(`'${name}', ${count}`));

    assert.match(migration, /counts_after IS DISTINCT FROM counts_before/);
    assert.match(migration, /target_subscription_after IS DISTINCT FROM target_subscription_before/);
    assert.match(migration, /non_target_subscriptions_after IS DISTINCT FROM non_target_subscriptions_before/);
    assert.match(migration, /progress_after IS DISTINCT FROM progress_before/);
    assert.match(migration, /attempts_after IS DISTINCT FROM attempts_before/);
  });

  await t.test('requires the exact preserved Stripe, subscription and entitlement evidence', () => {
    for (const value of [
      'sub_1U6ser3Ne8JYQdqLp5IpnM4x',
      'df06f24d-3620-4889-ae2a-6883d87d29a2',
      'aws-saa-c03',
      'cus_V76jo6wpeXM5Y9',
      'prod_V73CMqyLhOZvIe',
      'price_1U6p6S3Ne8JYQdqLX9pxvu22',
      'in_1U6seq3Ne8JYQdqLl2elRcEu',
      'evt_1U6ses3Ne8JYQdqLNlUmLdJ5',
      '2026-08-21 13:38:55+00',
      '2027-08-21 13:38:55+00',
      '2026-08-21 13:38:58+00',
      '2026-08-21 13:39:00.486664+00',
      '2026-08-21 13:39:00.505431+00',
      '2026-08-21 14:02:24+00'
    ]) assert.ok(migration.includes(value), `missing exact precondition: ${value}`);

    assert.match(migration, /event_type = 'invoice\.paid'/);
    assert.match(migration, /provider_object_id = 'sub_1U6ser3Ne8JYQdqLp5IpnM4x'/);
    assert.match(migration, /processing_status = 'processed'/);
    assert.match(migration, /safe_error_code IS NULL/);
    assert.match(migration, /status = 'active'/);
    assert.match(migration, /reason_code = 'invoice_paid'/);
    assert.match(migration, /provider_status = 'active'[\s\S]*paid_through IS NULL/);
    assert.match(migration, /active NULL paid-through isolation matched/);
  });

  await t.test('contains exactly one write and changes only the exact paid_through field', () => {
    const updateStatement = executable.match(/UPDATE public\.payment_exam_subscriptions[\s\S]*?;/)?.[0];
    assert.ok(updateStatement);
    assert.equal((executable.match(/\bUPDATE\s+public\./gi) || []).length, 1);
    assert.equal((executable.match(/\bINSERT\s+INTO\s+public\./gi) || []).length, 0);
    assert.equal((executable.match(/\bDELETE\s+FROM\s+public\./gi) || []).length, 0);
    assert.match(
      updateStatement,
      /SET paid_through = '2027-08-21 13:38:55\+00'::timestamptz\s+WHERE/s
    );
    const setClause = updateStatement.split(/\bWHERE\b/i)[0];
    assert.equal((setClause.match(/=/g) || []).length, 1);
    assert.doesNotMatch(setClause, /updated_at\s*=/);
    assert.match(migration, /GET DIAGNOSTICS updated_rows = ROW_COUNT/);
    assert.match(migration, /IF updated_rows <> 1 THEN/);
  });

  await t.test('contains no remote, secret, Stripe-object or unrelated data operation', () => {
    assert.doesNotMatch(executable, /https?:\/\/|fetch\s*\(|stripe\.com|supabase\.(?:co|com)|localStorage|sessionStorage/i);
    assert.doesNotMatch(executable, /(?:sk|rk)_(?:test|live)_|whsec_/i);
    assert.doesNotMatch(executable, /(?:INSERT|UPDATE|DELETE)\s+(?:INTO\s+|FROM\s+)?public\.(?:learner_item_progress|exam_attempts|exam_entitlements|exam_entitlement_events|payment_webhook_events|payment_customers|payment_exam_products)/i);
  });
});
