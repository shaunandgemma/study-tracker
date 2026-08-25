import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const priorMigrationPath = 'supabase/migrations/20260914_protect_qualifying_full_refund_revocation.sql';
const migrationPath = 'supabase/migrations/20260915_protect_full_refund_multi_event_idempotency.sql';
const priorMigration = readFileSync(priorMigrationPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');

function dollarConstant(name) {
  const expression = new RegExp(
    `${name} CONSTANT TEXT := \\$fragment\\$([\\s\\S]*?)\\$fragment\\$;`
  );
  const match = migration.match(expression);
  assert.ok(match, `Missing ${name} migration fragment.`);
  return match[1];
}

function occurrences(source, fragment) {
  return source.split(fragment).length - 1;
}

function mockAlreadyRevokedDecision({
  entitlementStatus = 'revoked',
  matchingTransitions = 1
} = {}) {
  if (entitlementStatus === 'active') return { entitlementChanged: true, accepted: true };
  if (entitlementStatus === 'revoked' && matchingTransitions === 1) {
    return { entitlementChanged: false, accepted: true };
  }
  return { entitlementChanged: false, accepted: false };
}

test('Step 009J2 full-refund multi-event idempotency migration', async t => {
  await t.test('uses one guarded function-only migration and no data repair', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.match(migration, /20260915 stopped: the Stripe reconciliation prerequisite is missing/);
    assert.match(migration, /deployed reconciliation definition is not the reviewed 20260914 contract/);
    assert.doesNotMatch(migration, /CREATE TABLE|ALTER TABLE|DROP TABLE|TRUNCATE|DELETE\s+FROM/i);
    assert.doesNotMatch(
      executable,
      /UPDATE\s+public\.(?:payment_exam_subscriptions|exam_entitlements|exam_entitlement_events|learner_item_progress|exam_attempts)/i
    );
  });

  await t.test('keeps the stored paid-Invoice boundary from the reviewed prior contract', () => {
    assert.match(priorMigration, /existing_subscription\.latest_invoice_id IS DISTINCT FROM p_latest_invoice_id/);
    assert.match(priorMigration, /full refund Invoice does not match the Subscription payment-backed Invoice/i);
    assert.match(migration, /reviewed 20260914 contract/);
  });

  await t.test('matches and replaces only the exact reviewed function fragments', () => {
    const functionMatch = priorMigration.match(
      /CREATE OR REPLACE FUNCTION public\.reconcile_stripe_exam_entitlement\([\s\S]*?AS \$\$([\s\S]*?)\$\$;/
    );
    assert.ok(functionMatch, 'Missing reviewed 20260914 reconciliation body.');

    const priorBody = functionMatch[1];
    const declarationFragment = dollarConstant('declaration_fragment');
    const declarationReplacement = dollarConstant('declaration_replacement');
    const guardFragment = dollarConstant('entitlement_guard_fragment');
    const guardReplacement = dollarConstant('entitlement_guard_replacement');

    assert.equal(occurrences(priorBody, declarationFragment), 1);
    assert.equal(occurrences(priorBody, guardFragment), 1);

    const updatedBody = priorBody
      .replace(declarationFragment, declarationReplacement)
      .replace(guardFragment, guardReplacement);

    assert.equal(occurrences(updatedBody, declarationFragment), 0);
    assert.equal(occurrences(updatedBody, guardFragment), 0);
    assert.equal(occurrences(updatedBody, declarationReplacement), 1);
    assert.equal(occurrences(updatedBody, guardReplacement), 1);
    assert.match(updatedBody, /prior_full_refund_transition_count <> 1/);
  });

  await t.test('allows the first exact active entitlement revocation once', () => {
    assert.deepEqual(mockAlreadyRevokedDecision({ entitlementStatus: 'active' }), {
      entitlementChanged: true,
      accepted: true
    });
    assert.match(migration, /ELSIF previous_entitlement\.status = 'active' THEN/);
    assert.match(migration, /first qualifying event proceeds to the single revocation branch/i);
  });

  await t.test('allows one later unique event only after one exact processed transition', () => {
    assert.deepEqual(mockAlreadyRevokedDecision(), {
      entitlementChanged: false,
      accepted: true
    });
    assert.match(migration, /prior_full_refund_transition_count <> 1/);
    assert.match(migration, /entitlement_event\.user_id = p_user_id/);
    assert.match(migration, /entitlement_event\.exam_id = p_exam_id/);
    assert.match(migration, /entitlement_event\.source_reference = p_stripe_subscription_id/);
    assert.match(migration, /entitlement_event\.previous_status = 'active'/);
    assert.match(migration, /entitlement_event\.new_status = 'revoked'/);
    assert.match(migration, /entitlement_event\.reason_code = 'full_refund'/);
    assert.match(migration, /webhook_event\.provider_object_id = p_stripe_subscription_id/);
    assert.match(migration, /webhook_event\.livemode = p_livemode/);
    assert.match(migration, /webhook_event\.processing_status = 'processed'/);
    assert.match(migration, /'charge\.refunded',[\s\S]*'refund\.created',[\s\S]*'refund\.updated'/);
  });

  await t.test('requires unchanged expiry and creates no second transition', () => {
    assert.match(
      migration,
      /entitlement_event\.previous_expiry IS NOT DISTINCT FROM previous_entitlement\.expires_at/
    );
    assert.match(
      migration,
      /entitlement_event\.new_expiry IS NOT DISTINCT FROM previous_entitlement\.expires_at/
    );
    assert.match(migration, /entitlementChanged=false and writes no second audit row/);
    assert.doesNotMatch(
      executable,
      /(?:INSERT|UPDATE|DELETE)\s+(?:INTO\s+|FROM\s+)?public\.(?:learner_item_progress|exam_attempts|user_learning_path_progress|user_learning_path_resources)/i
    );
  });

  await t.test('rejects missing, unrelated and ambiguous revoked entitlement histories', () => {
    for (const input of [
      { entitlementStatus: null, matchingTransitions: 0 },
      { entitlementStatus: 'revoked', matchingTransitions: 0 },
      { entitlementStatus: 'revoked', matchingTransitions: 2 },
      { entitlementStatus: 'unsupported', matchingTransitions: 1 }
    ]) {
      assert.equal(mockAlreadyRevokedDecision(input).accepted, false);
    }
    assert.match(migration, /requires an existing exact-exam entitlement/i);
    assert.match(migration, /lacks one exact prior full-refund transition/i);
    assert.match(migration, /unsupported entitlement state/i);
  });

  await t.test('preserves duplicate, audit and service-role-only boundaries', () => {
    assert.match(priorMigration, /ON CONFLICT \(stripe_event_id\) DO NOTHING/);
    assert.match(priorMigration, /IF entitlement_changed THEN\s+INSERT INTO public\.exam_entitlement_events/s);
    assert.match(migration, /FROM PUBLIC, anon, authenticated;/);
    assert.match(migration, /TO service_role;/);
    assert.match(migration, /has_function_privilege\('anon'/);
    assert.match(migration, /has_function_privilege\('authenticated'/);
    assert.match(migration, /has_function_privilege\('service_role'/);
  });

  await t.test('contains no network, secret, browser or deployment operation', () => {
    assert.doesNotMatch(executable, /https?:\/\/|fetch\s*\(|stripe\.com|supabase\.(?:co|com)|VITE_|localStorage|sessionStorage/i);
    assert.doesNotMatch(executable, /(?:sk|rk)_(?:test|live)_|whsec_/i);
  });
});
