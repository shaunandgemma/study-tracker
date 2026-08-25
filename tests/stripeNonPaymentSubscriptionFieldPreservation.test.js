import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationPath = 'supabase/migrations/20260912_preserve_non_payment_subscription_fields.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');
const staleGuard = migration.indexOf('p_provider_event_created_at < existing_subscription.latest_provider_event_created_at');
const refundGuard = migration.indexOf("IF p_access_action = 'no_change'");
const subscriptionInsert = migration.indexOf('INSERT INTO public.payment_exam_subscriptions', refundGuard);

test('Step 009H3A non-payment Subscription field preservation', async t => {
  await t.test('uses one corrective function-only transaction', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.equal((migration.match(/CREATE OR REPLACE FUNCTION/gi) || []).length, 1);
    assert.doesNotMatch(migration, /CREATE TABLE|ALTER TABLE|DROP TABLE|TRUNCATE/i);
    assert.match(migration, /20260912 stopped: the Stripe reconciliation prerequisite is missing/);
  });

  await t.test('accepts payment-backed insert values only from a verified paid Invoice activation', () => {
    assert.match(
      migration,
      /p_current_period_end,\s+CASE\s+WHEN p_event_type = 'invoice\.paid'\s+AND p_access_action = 'activate' THEN p_paid_through\s+ELSE NULL\s+END,\s+CASE\s+WHEN p_event_type = 'invoice\.paid'\s+AND p_access_action = 'activate' THEN p_latest_invoice_id\s+ELSE NULL\s+END,/s
    );
  });

  await t.test('preserves existing payment-backed fields during every non-payment update', () => {
    assert.match(
      migration,
      /paid_through = CASE\s+WHEN p_event_type = 'invoice\.paid'\s+AND p_access_action = 'activate' THEN EXCLUDED\.paid_through\s+ELSE payment_exam_subscriptions\.paid_through\s+END,/s
    );
    assert.match(
      migration,
      /latest_invoice_id = CASE\s+WHEN p_event_type = 'invoice\.paid'\s+AND p_access_action = 'activate' THEN EXCLUDED\.latest_invoice_id\s+ELSE payment_exam_subscriptions\.latest_invoice_id\s+END,/s
    );
  });

  await t.test('still refreshes authoritative lifecycle fields', () => {
    for (const assignment of [
      'provider_status = EXCLUDED.provider_status',
      'cancel_at_period_end = EXCLUDED.cancel_at_period_end',
      'current_period_start = EXCLUDED.current_period_start',
      'current_period_end = EXCLUDED.current_period_end',
      'latest_provider_event_created_at = EXCLUDED.latest_provider_event_created_at'
    ]) assert.match(migration, new RegExp(assignment.replaceAll('.', '\\.')));
  });

  await t.test('retains duplicate, ownership, stale and refund no-change safeguards before writes', () => {
    assert.match(migration, /ON CONFLICT \(stripe_event_id\) DO NOTHING/);
    assert.match(migration, /Customer ownership does not match/);
    assert.match(migration, /Subscription ownership or exact-exam mapping changed unexpectedly/);
    assert.ok(staleGuard >= 0 && staleGuard < subscriptionInsert);
    assert.match(migration, /safe_error_code = 'stale_provider_event'/);
    assert.ok(refundGuard >= 0 && refundGuard < subscriptionInsert);
    assert.match(migration, /p_reason_code = 'refund_manual_review'/);
    assert.match(migration, /subscription_write_count := 1;/);
  });

  await t.test('preserves learner access, progress and service-role-only execution', () => {
    assert.doesNotMatch(
      executable,
      /(?:INSERT|UPDATE|DELETE)\s+(?:INTO\s+|FROM\s+)?public\.(?:learner_item_progress|exam_attempts|user_learning_path_progress|user_learning_path_resources)/i
    );
    assert.match(
      migration,
      /REVOKE ALL ON FUNCTION public\.reconcile_stripe_exam_entitlement\([\s\S]*?FROM PUBLIC, anon, authenticated;/
    );
    assert.match(
      migration,
      /GRANT EXECUTE ON FUNCTION public\.reconcile_stripe_exam_entitlement\([\s\S]*?TO service_role;/
    );
  });

  await t.test('contains no remote operation or secret value', () => {
    assert.doesNotMatch(executable, /https?:\/\/|fetch\s*\(|stripe\.com|supabase\.(?:co|com)|VITE_|localStorage|sessionStorage/i);
    assert.doesNotMatch(executable, /(?:sk|rk)_(?:test|live)_|whsec_/i);
    assert.doesNotMatch(executable, /DELETE\s+FROM|TRUNCATE/i);
  });
});
