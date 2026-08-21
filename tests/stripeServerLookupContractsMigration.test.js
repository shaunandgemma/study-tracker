import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const sql = readFileSync(
  'supabase/migrations/20260910_create_stripe_server_lookup_contracts.sql',
  'utf8'
);

test('Step 008E1 Stripe server lookup migration', async t => {
  await t.test('creates exactly the three narrow SECURITY DEFINER contracts', () => {
    const creates = [...sql.matchAll(/CREATE FUNCTION public\.([a-z_]+)\s*\(/g)].map(match => match[1]);
    assert.deepEqual(creates, [
      'get_stripe_exam_checkout_context',
      'bind_stripe_customer',
      'get_stripe_portal_context'
    ]);
    assert.equal((sql.match(/^SECURITY DEFINER$/gm) || []).length, 3);
    assert.equal((sql.match(/SET search_path = public, extensions/g) || []).length, 3);
  });

  await t.test('grants only service_role execution and preserves direct table denial', () => {
    for (const name of [
      'get_stripe_exam_checkout_context',
      'bind_stripe_customer',
      'get_stripe_portal_context'
    ]) {
      assert.match(sql, new RegExp(`REVOKE ALL ON FUNCTION public\\.${name}[\\s\\S]*?FROM PUBLIC, anon, authenticated, service_role`));
      assert.match(sql, new RegExp(`GRANT EXECUTE ON FUNCTION public\\.${name}[\\s\\S]*?TO service_role`));
    }
    assert.match(sql, /has_table_privilege\('service_role',[\s\S]*?'SELECT'\)/);
    assert.match(sql, /has_function_privilege\('anon'/);
    assert.match(sql, /has_function_privilege\('authenticated'/);
  });

  await t.test('checkout is exact-exam, server-priced and duplicate-subscription aware', () => {
    assert.match(sql, /p_exam_id NOT IN \('aws-saa-c03', 'terraform-associate-004', 'comptia-sec-plus'\)/);
    assert.match(sql, /stripe_annual_price_id/);
    assert.match(sql, /hasCurrentSubscription/);
    assert.match(sql, /provider_status IN \('incomplete', 'trialing', 'active', 'past_due', 'unpaid', 'paused'\)/);
  });

  await t.test('customer binding is atomic and refuses ownership reassignment', () => {
    assert.match(sql, /LOCK TABLE public\.payment_customers IN SHARE ROW EXCLUSIVE MODE/);
    assert.match(sql, /already has a different Stripe Customer binding/);
    assert.match(sql, /already bound to a different learner/);
    assert.match(sql, /ON CONFLICT \(user_id, livemode\) DO UPDATE/);
  });

  await t.test('migration guards every protected row count and performs no contract invocation', () => {
    for (const column of [
      'product_rows',
      'customer_rows',
      'subscription_rows',
      'webhook_rows',
      'entitlement_event_rows',
      'entitlement_rows',
      'learner_item_progress_rows',
      'exam_attempt_rows',
      'follow_along_progress_rows',
      'follow_along_resource_rows'
    ]) assert.match(sql, new RegExp(column));
    assert.doesNotMatch(sql, /SELECT\s+public\.(?:get_stripe|bind_stripe|reconcile_stripe)/i);
    assert.match(sql, /^BEGIN;/m);
    assert.match(sql, /COMMIT;\s*$/);
  });
});
