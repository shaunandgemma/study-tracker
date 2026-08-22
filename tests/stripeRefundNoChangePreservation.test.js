import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationPath = 'supabase/migrations/20260911_preserve_refund_no_change_subscription_state.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');
const refundGuardStart = migration.indexOf("IF p_access_action = 'no_change'");
const subscriptionInsert = migration.indexOf('INSERT INTO public.payment_exam_subscriptions', refundGuardStart);
const guardedElse = migration.indexOf('ELSE', refundGuardStart);
const entitlementRead = migration.indexOf('SELECT * INTO previous_entitlement', refundGuardStart);

test('Step 009G5 refund no-change Subscription preservation', async t => {
  await t.test('uses one guarded corrective transaction without changing deployed migration history', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.equal((migration.match(/CREATE OR REPLACE FUNCTION/gi) || []).length, 1);
    assert.doesNotMatch(migration, /CREATE TABLE|ALTER TABLE|DROP TABLE|TRUNCATE/i);
    assert.match(migration, /20260911 stopped: the Stripe reconciliation prerequisite is missing/);
  });

  await t.test('records refund manual review without entering the Subscription write branch', () => {
    assert.ok(refundGuardStart >= 0);
    assert.ok(guardedElse > refundGuardStart);
    assert.ok(subscriptionInsert > guardedElse);
    assert.ok(entitlementRead > subscriptionInsert);
    assert.match(migration, /p_reason_code = 'refund_manual_review'/);
    assert.match(migration, /subscription_write_count := 1;/);
    assert.match(migration, /without changing any stored[\s\S]*Subscription field/);
  });

  await t.test('fails closed rather than creating Subscription state from a refund event', () => {
    assert.match(migration, /existing_subscription\.stripe_subscription_id IS NULL/);
    assert.match(migration, /refund event cannot create a missing Stripe Subscription state/i);
  });

  await t.test('retains duplicate, ownership and stale-event safeguards', () => {
    assert.match(migration, /ON CONFLICT \(stripe_event_id\) DO NOTHING/);
    assert.match(migration, /inserted_event_count = 0/);
    assert.match(migration, /Customer ownership does not match/);
    assert.match(migration, /Subscription ownership or exact-exam mapping changed unexpectedly/);
    assert.match(migration, /p_provider_event_created_at < existing_subscription\.latest_provider_event_created_at/);
    assert.match(migration, /safe_error_code = 'stale_provider_event'/);
  });

  await t.test('keeps refund access and learner progress unchanged', () => {
    assert.match(migration, /ELSIF p_access_action = 'revoke'/);
    assert.match(migration, /ELSE\s+resulting_entitlement := previous_entitlement;/);
    assert.doesNotMatch(
      executable,
      /(?:INSERT|UPDATE|DELETE)\s+(?:INTO\s+|FROM\s+)?public\.(?:learner_item_progress|exam_attempts|user_learning_path_progress|user_learning_path_resources)/i
    );
    assert.doesNotMatch(executable, /DELETE\s+FROM|TRUNCATE/i);
  });

  await t.test('preserves the service-role-only boundary', () => {
    assert.match(
      migration,
      /REVOKE ALL ON FUNCTION public\.reconcile_stripe_exam_entitlement\([\s\S]*?FROM PUBLIC, anon, authenticated;/
    );
    assert.match(
      migration,
      /GRANT EXECUTE ON FUNCTION public\.reconcile_stripe_exam_entitlement\([\s\S]*?TO service_role;/
    );
    assert.match(migration, /has_function_privilege\('anon'/);
    assert.match(migration, /has_function_privilege\('authenticated'/);
    assert.match(migration, /has_function_privilege\('service_role'/);
  });

  await t.test('contains no network, secret, browser or deployment operation', () => {
    assert.doesNotMatch(executable, /https?:\/\/|fetch\s*\(|stripe\.com|supabase\.(?:co|com)|VITE_|localStorage|sessionStorage/i);
    assert.doesNotMatch(executable, /(?:sk|rk)_(?:test|live)_|whsec_/i);
  });
});
