import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationPath = 'supabase/migrations/20260916_repair_fully_refunded_exam_entitlement.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');

test('Step 009K5 fully refunded entitlement repair migration', async t => {
  await t.test('is one locked fail-closed transaction with no schema or function change', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.equal((migration.match(/^DO \$\$$/gm) || []).length, 1);
    assert.match(migration, /pg_advisory_xact_lock/);
    assert.match(migration, /IN SHARE ROW EXCLUSIVE MODE/);
    assert.doesNotMatch(executable, /CREATE(?:\s+OR\s+REPLACE)?\s+(?:TABLE|FUNCTION)|ALTER\s+TABLE|DROP\s+|TRUNCATE/i);
  });

  await t.test('requires migration 20260915 and its service-role-only reconciliation boundary', () => {
    assert.match(migration, /version = '20260915'/);
    assert.match(migration, /migration_count <> 1/);
    assert.match(migration, /prior_full_refund_transition_count <> 1/);
    assert.match(migration, /entitlement_event\.source_reference = p_stripe_subscription_id/);
    assert.match(migration, /has_function_privilege\('anon', reconciliation_function, 'EXECUTE'\)/);
    assert.match(migration, /has_function_privilege\('authenticated', reconciliation_function, 'EXECUTE'\)/);
    assert.match(migration, /NOT has_function_privilege\('service_role', reconciliation_function, 'EXECUTE'\)/);
  });

  await t.test('requires the exact audited Subscription, entitlement and full-refund event chain', () => {
    for (const value of [
      'sub_1U7LH93Ne8JYQdqLKUFDoY7s',
      '8bf0e3bc-bed7-43bf-a4db-e8f788c19852',
      'aws-saa-c03',
      'cus_V7aJjrJFCVjm5I',
      'prod_V73CMqyLhOZvIe',
      'price_1U6p6S3Ne8JYQdqLX9pxvu22',
      'in_1U7LYD3Ne8JYQdqLIobN0T3Q',
      'evt_3U7LYG3Ne8JYQdqL1wBsusMg',
      'evt_3U7LYG3Ne8JYQdqL1NzRE6te',
      'evt_3U7LYG3Ne8JYQdqL1EQ1GYzN',
      '2028-08-22 20:03:34+00'
    ]) assert.ok(migration.includes(value), `missing exact precondition: ${value}`);

    assert.match(migration, /provider_status = 'past_due'/);
    assert.match(migration, /paid_through IS NULL/);
    assert.match(migration, /processing_status = 'processed'/);
    assert.match(migration, /processed_at IS NOT NULL/);
    assert.match(migration, /safe_error_code IS NULL/);
    assert.match(migration, /matching_rows <> 3/);
  });

  await t.test('requires exactly two prior invoice-paid transitions and no prior full refund', () => {
    for (const eventId of [
      'evt_1U7LHB3Ne8JYQdqLlvuMu8kp',
      'evt_1U7LYK3Ne8JYQdqLb1E3I2lR'
    ]) assert.ok(migration.includes(eventId));

    assert.match(migration, /the exact prior entitlement history contains % rows/);
    assert.match(migration, /reason_code = 'invoice_paid'/);
    assert.match(migration, /reason_code = 'full_refund'/);
    assert.match(migration, /matching_rows <> 0/);
  });

  await t.test('performs exactly one target update and one append-only audit insert', () => {
    assert.equal((executable.match(/\bUPDATE\s+public\./gi) || []).length, 1);
    assert.equal((executable.match(/\bINSERT\s+INTO\s+public\./gi) || []).length, 1);
    assert.equal((executable.match(/\bDELETE\s+FROM\s+public\./gi) || []).length, 0);
    assert.match(
      migration,
      /UPDATE public\.exam_entitlements\s+SET status = 'revoked',\s+updated_at = clock_timestamp\(\)/s
    );
    assert.match(migration, /GET DIAGNOSTICS updated_rows = ROW_COUNT/);
    assert.match(migration, /IF updated_rows <> 1 THEN/);
    assert.match(migration, /INSERT INTO public\.exam_entitlement_events/);
    assert.match(migration, /GET DIAGNOSTICS inserted_rows = ROW_COUNT/);
    assert.match(migration, /IF inserted_rows <> 1 THEN/);
    assert.match(migration, /'active',\s+'revoked'/s);
    assert.match(migration, /'full_refund'/);
  });

  await t.test('preserves expiry, every payment table, other entitlements and progress', () => {
    assert.match(migration, /previous_expiry,\s+new_expiry/s);
    assert.match(
      migration,
      /'2028-08-22 20:03:34\+00'::timestamptz,\s+'2028-08-22 20:03:34\+00'::timestamptz/s
    );
    for (const pair of [
      'payment_products_after IS DISTINCT FROM payment_products_before',
      'payment_customers_after IS DISTINCT FROM payment_customers_before',
      'payment_subscriptions_after IS DISTINCT FROM payment_subscriptions_before',
      'webhook_events_after IS DISTINCT FROM webhook_events_before',
      'progress_after IS DISTINCT FROM progress_before',
      'attempts_after IS DISTINCT FROM attempts_before',
      'non_target_entitlements_after IS DISTINCT FROM non_target_entitlements_before',
      'prior_entitlement_events_after IS DISTINCT FROM entitlement_events_before'
    ]) assert.ok(migration.includes(pair), `missing preservation guard: ${pair}`);
    assert.match(migration, /row_value\.progress_type, row_value\.content_id/);
  });

  await t.test('contains no network, Stripe key, secret or remote operation', () => {
    assert.doesNotMatch(executable, /https?:\/\/|fetch\s*\(|stripe\.com|supabase\.(?:co|com)|localStorage|sessionStorage/i);
    assert.doesNotMatch(executable, /(?:sk|rk)_(?:test|live)_|whsec_/i);
  });
});
