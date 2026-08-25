import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationPath = 'supabase/migrations/20260913_repair_fresh_out_of_order_paid_through.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');

test('Step 009H3D fresh out-of-order paid-through repair migration', async t => {
  await t.test('is one fail-closed transaction with no schema or function change', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.equal((migration.match(/^DO \$\$$/gm) || []).length, 1);
    assert.doesNotMatch(executable, /CREATE(?:\s+OR\s+REPLACE)?\s+(?:TABLE|FUNCTION)|ALTER\s+TABLE|DROP\s+|TRUNCATE/i);
    assert.match(migration, /IN SHARE ROW EXCLUSIVE MODE/);
  });

  await t.test('requires the deployed 20260912 preservation and privilege boundary', () => {
    assert.match(migration, /ELSE payment_exam_subscriptions\.paid_through/);
    assert.match(migration, /ELSE payment_exam_subscriptions\.latest_invoice_id/);
    assert.match(migration, /has_function_privilege\('anon', reconciliation_function, 'EXECUTE'\)/);
    assert.match(migration, /has_function_privilege\('authenticated', reconciliation_function, 'EXECUTE'\)/);
    assert.match(migration, /NOT has_function_privilege\('service_role', reconciliation_function, 'EXECUTE'\)/);
  });

  await t.test('locks and preserves every approved protected table count', () => {
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

    assert.match(migration, /'payment_exam_products', 3/);
    assert.match(migration, /'payment_customers', 3/);
    assert.match(migration, /'payment_exam_subscriptions', 3/);
    assert.match(migration, /'payment_webhook_events', 20/);
    assert.match(migration, /'exam_entitlement_events', 4/);
    assert.match(migration, /'exam_entitlements', 3/);
    assert.match(migration, /'learner_item_progress', 0/);
    assert.match(migration, /'exam_attempts', 12/);
    assert.match(migration, /baseline_after IS DISTINCT FROM baseline_before/);
  });

  await t.test('targets only the exact fresh sandbox Subscription state', () => {
    for (const value of [
      'sub_1U7vR33Ne8JYQdqLwXcMRAJs',
      'a54a5e55-482f-4bd2-adc1-d58f2b4f235b',
      'aws-saa-c03',
      'cus_V8BoF00adTS1kw',
      'prod_V73CMqyLhOZvIe',
      'price_1U6p6S3Ne8JYQdqLX9pxvu22',
      'in_1U7vR33Ne8JYQdqLND2NszLw',
      '2026-08-24 10:49:02+00',
      '2027-08-24 10:49:02+00',
      '2026-08-24 11:07:03+00'
    ]) assert.ok(migration.includes(value), `missing exact precondition: ${value}`);

    assert.match(migration, /provider_status = 'active'/);
    assert.match(migration, /cancel_at_period_end = false/);
    assert.match(migration, /paid_through IS NULL/);
  });

  await t.test('requires the exact processed paid Invoice and entitlement evidence', () => {
    assert.match(migration, /stripe_event_id = 'evt_1U7vR63Ne8JYQdqLVViJHkme'/);
    assert.match(migration, /event_type = 'invoice\.paid'/);
    assert.match(migration, /processing_status = 'processed'/);
    assert.match(migration, /safe_error_code IS NULL/);
    assert.match(migration, /processed_at = '2026-08-24 10:49:06\.523980\+00'/);
    assert.match(migration, /status = 'active'/);
    assert.match(migration, /reason_code = 'invoice_paid'/);
    assert.match(migration, /new_expiry = '2027-08-24 10:49:02\+00'/);
    assert.match(migration, /created_at = '2026-08-24 10:49:06\.548400\+00'/);
    assert.ok((migration.match(/matching_rows <> 1/g) || []).length >= 4);
  });

  await t.test('contains exactly one data write and changes only paid_through', () => {
    const updateStatement = executable.match(
      /UPDATE public\.payment_exam_subscriptions[\s\S]*?;/
    )?.[0];
    assert.ok(updateStatement);
    assert.equal((executable.match(/\bUPDATE\s+public\./gi) || []).length, 1);
    assert.equal((executable.match(/\bINSERT\s+INTO\s+public\./gi) || []).length, 0);
    assert.equal((executable.match(/\bDELETE\s+FROM\s+public\./gi) || []).length, 0);
    assert.match(
      migration,
      /UPDATE public\.payment_exam_subscriptions\s+SET paid_through = '2027-08-24 10:49:02\+00'::timestamptz\s+WHERE/s
    );
    const setClause = updateStatement.split(/\bWHERE\b/i)[0];
    assert.equal((setClause.match(/=/g) || []).length, 1);
    assert.doesNotMatch(updateStatement, /updated_at\s*=/);
    assert.match(migration, /GET DIAGNOSTICS updated_rows = ROW_COUNT/);
    assert.match(migration, /IF updated_rows <> 1 THEN/);
  });

  await t.test('contains no Stripe, remote, secret or learner-progress operation', () => {
    assert.doesNotMatch(executable, /https?:\/\/|fetch\s*\(|stripe\.com|supabase\.(?:co|com)|localStorage|sessionStorage/i);
    assert.doesNotMatch(executable, /(?:sk|rk)_(?:test|live)_|whsec_/i);
    assert.doesNotMatch(executable, /(?:INSERT|UPDATE|DELETE)\s+(?:INTO\s+|FROM\s+)?public\.(?:learner_item_progress|exam_attempts|exam_entitlements|exam_entitlement_events|payment_webhook_events|payment_customers|payment_exam_products)/i);
  });
});
