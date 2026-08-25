import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { createAuthoritativeStateResolver } from '../supabase/functions/_shared/payments/serverAdapters.mjs';

const migrationPath = 'supabase/migrations/20260914_protect_qualifying_full_refund_revocation.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');

const ids = {
  charge: 'ch_fullRefund001',
  customer: 'cus_fullRefund001',
  event: 'evt_fullRefund001',
  exam: 'aws-saa-c03',
  invoice: 'in_fullRefund001',
  paymentIntent: 'pi_fullRefund001',
  price: 'price_fullRefund001',
  product: 'prod_fullRefund001',
  refund: 're_fullRefund001',
  subscription: 'sub_fullRefund001',
  user: '11111111-2222-4333-8444-555555555555'
};

function refundRuntime({
  charge = {},
  invoice = {},
  invoicePayments,
  subscription = {}
} = {}) {
  const authoritativeCharge = {
    amount: 1999,
    amount_refunded: 1999,
    id: ids.charge,
    livemode: false,
    paid: true,
    payment_intent: ids.paymentIntent,
    refunded: true,
    status: 'succeeded',
    ...charge
  };
  const authoritativeInvoice = {
    amount_due: 1999,
    amount_paid: 1999,
    amount_remaining: 0,
    id: ids.invoice,
    livemode: false,
    parent: { subscription_details: { subscription: ids.subscription } },
    status: 'paid',
    status_transitions: { paid_at: 1810000000 },
    ...invoice
  };
  const authoritativeSubscription = {
    cancel_at_period_end: false,
    customer: ids.customer,
    id: ids.subscription,
    items: { data: [{
      current_period_end: 1840046614,
      current_period_start: 1808510614,
      price: { id: ids.price, product: { id: ids.product } }
    }] },
    latest_invoice: 'in_newerLifecycleInvoice001',
    livemode: false,
    metadata: { latt_exam_id: ids.exam, latt_user_id: ids.user },
    status: 'past_due',
    ...subscription
  };

  return {
    charges: { retrieve: async () => authoritativeCharge },
    invoicePayments: { list: async () => invoicePayments || ({
      data: [{
        id: 'inpay_fullRefund001',
        invoice: ids.invoice,
        payment: { payment_intent: ids.paymentIntent, type: 'payment_intent' }
      }],
      has_more: false
    }) },
    invoices: { retrieve: async () => authoritativeInvoice },
    subscriptions: { retrieve: async () => authoritativeSubscription }
  };
}

function refundEvent(type, object = {}) {
  return {
    created: 1810000000,
    data: { object: {
      charge: type.startsWith('refund.') ? ids.charge : undefined,
      id: type === 'charge.refunded' ? ids.charge : ids.refund,
      payment_intent: ids.paymentIntent,
      status: type.startsWith('refund.') ? 'succeeded' : undefined,
      ...object
    } },
    id: `${ids.event}${type.replaceAll('.', '')}`,
    livemode: false,
    type
  };
}

test('Step 009J authoritative Stripe full-refund classification', async t => {
  await t.test('all three supported successful full-refund events revoke only through the refunded paid Invoice', async () => {
    for (const type of ['charge.refunded', 'refund.created', 'refund.updated']) {
      const state = await createAuthoritativeStateResolver(refundRuntime())(refundEvent(type));
      assert.equal(state.accessAction, 'revoke');
      assert.equal(state.reasonCode, 'full_refund');
      assert.equal(state.latestInvoiceId, ids.invoice);
      assert.equal(state.paidThrough, null);
      assert.equal(state.examId, ids.exam);
      assert.equal(state.userId, ids.user);
      assert.equal(state.stripeSubscriptionId, ids.subscription);
    }
  });

  await t.test('uses the current dahlia Invoice proof without relying on the removed legacy paid boolean', async () => {
    const stripe = refundRuntime({ invoice: { paid: undefined } });
    const state = await createAuthoritativeStateResolver(stripe)(refundEvent('charge.refunded'));

    assert.equal(state.accessAction, 'revoke');
    assert.equal(state.reasonCode, 'full_refund');
    assert.equal(state.latestInvoiceId, ids.invoice);
  });

  await t.test('partial, pending, failed and non-authoritative refunds preserve access for manual review', async () => {
    const cases = [
      [refundRuntime({ charge: { amount_refunded: 100, refunded: false } }), refundEvent('refund.created')],
      [refundRuntime(), refundEvent('refund.created', { status: 'pending' })],
      [refundRuntime(), refundEvent('refund.updated', { status: 'failed' })],
      [refundRuntime({ charge: { paid: false } }), refundEvent('charge.refunded')],
      [refundRuntime({ charge: { status: 'pending' } }), refundEvent('charge.refunded')],
      [refundRuntime({ invoice: { status: 'open' } }), refundEvent('charge.refunded')],
      [refundRuntime({ invoice: { amount_due: 2000 } }), refundEvent('charge.refunded')],
      [refundRuntime({ invoice: { amount_paid: 1998 } }), refundEvent('charge.refunded')],
      [refundRuntime({ invoice: { amount_remaining: 1 } }), refundEvent('charge.refunded')],
      [refundRuntime({ invoice: { status_transitions: { paid_at: null } } }), refundEvent('charge.refunded')],
      [refundRuntime({ invoice: { livemode: true } }), refundEvent('charge.refunded')]
    ];

    for (const [stripe, event] of cases) {
      const state = await createAuthoritativeStateResolver(stripe)(event);
      assert.equal(state.accessAction, 'no_change');
      assert.equal(state.reasonCode, 'refund_manual_review');
      assert.equal(state.latestInvoiceId, ids.invoice);
    }
  });

  await t.test('a canceled Subscription cannot turn a partial refund into termination', async () => {
    const stripe = refundRuntime({
      charge: { amount_refunded: 100, refunded: false },
      subscription: { status: 'canceled' }
    });
    const state = await createAuthoritativeStateResolver(stripe)(refundEvent('refund.updated'));
    assert.equal(state.accessAction, 'no_change');
    assert.equal(state.reasonCode, 'refund_manual_review');
  });

  await t.test('charge, PaymentIntent, mode and unique Invoice Payment boundaries fail closed', async () => {
    await assert.rejects(
      createAuthoritativeStateResolver(refundRuntime({ charge: { id: 'ch_different001' } }))(refundEvent('refund.created')),
      /Charge boundary changed/
    );
    await assert.rejects(
      createAuthoritativeStateResolver(refundRuntime())(refundEvent('refund.updated', { payment_intent: 'pi_different001' })),
      /PaymentIntent boundary changed/
    );
    await assert.rejects(
      createAuthoritativeStateResolver(refundRuntime({ charge: { livemode: true } }))(refundEvent('charge.refunded')),
      /mode mismatch/
    );
    await assert.rejects(
      createAuthoritativeStateResolver(refundRuntime({ invoicePayments: { data: [], has_more: false } }))(refundEvent('refund.created')),
      /exactly one Invoice Payment/
    );
    await assert.rejects(
      createAuthoritativeStateResolver(refundRuntime({ invoicePayments: {
        data: [
          { invoice: ids.invoice, payment: { payment_intent: ids.paymentIntent } },
          { invoice: 'in_ambiguous002', payment: { payment_intent: ids.paymentIntent } }
        ],
        has_more: false
      } }))(refundEvent('refund.created')),
      /exactly one Invoice Payment/
    );
  });
});

test('Step 009J protected exact-exam full-refund reconciliation migration', async t => {
  await t.test('is one function-only guarded migration with no data repair', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.equal((migration.match(/CREATE OR REPLACE FUNCTION/gi) || []).length, 1);
    assert.match(migration, /20260914 stopped: the Stripe reconciliation prerequisite is missing/);
    assert.doesNotMatch(migration, /CREATE TABLE|ALTER TABLE|DROP TABLE|TRUNCATE|DELETE\s+FROM/i);
    assert.doesNotMatch(executable, /sub_1U|cus_V|ch_3U|UPDATE\s+public\.payment_exam_subscriptions\s+SET/i);
  });

  await t.test('accepts only the two exact refund action and reason pairings', () => {
    assert.match(migration, /p_event_type IN \('charge\.refunded', 'refund\.created', 'refund\.updated'\)/);
    assert.match(migration, /p_access_action = 'revoke' AND p_reason_code = 'full_refund'/);
    assert.match(migration, /p_access_action = 'no_change' AND p_reason_code = 'refund_manual_review'/);
    assert.match(migration, /refund reason cannot be used for a non-refund event/i);
  });

  await t.test('requires the refunded Invoice to equal the stored payment-backed Invoice', () => {
    assert.match(migration, /existing_subscription\.stripe_subscription_id IS NULL/);
    assert.match(migration, /p_latest_invoice_id IS NULL/);
    assert.match(migration, /existing_subscription\.latest_invoice_id IS NULL/);
    assert.match(migration, /existing_subscription\.latest_invoice_id IS DISTINCT FROM p_latest_invoice_id/);
    assert.match(migration, /full refund Invoice does not match the Subscription payment-backed Invoice/i);
  });

  await t.test('full and partial refunds bypass every Subscription write', () => {
    const fullRefund = migration.indexOf("p_reason_code = 'full_refund' THEN");
    const manualReview = migration.indexOf("p_reason_code = 'refund_manual_review' THEN", fullRefund);
    const subscriptionInsert = migration.indexOf('INSERT INTO public.payment_exam_subscriptions', manualReview);
    assert.ok(fullRefund >= 0 && manualReview > fullRefund && subscriptionInsert > manualReview);
    assert.match(migration.slice(fullRefund, subscriptionInsert), /subscription_write_count := 1;/);
    assert.doesNotMatch(migration.slice(fullRefund, subscriptionInsert), /UPDATE public\.payment_exam_subscriptions|INSERT INTO public\.payment_exam_subscriptions/);
  });

  await t.test('revokes only an existing active exact-exam entitlement without altering expiry or progress', () => {
    assert.match(migration, /full refund requires an existing active exact-exam entitlement/i);
    assert.match(migration, /WHERE user_id = p_user_id\s+AND exam_id = p_exam_id/s);
    assert.match(migration, /SET status = 'revoked',\s+updated_at = clock_timestamp\(\)/s);
    assert.doesNotMatch(migration, /SET status = 'revoked',[\s\S]{0,160}expires_at\s*=/);
    assert.doesNotMatch(
      executable,
      /(?:INSERT|UPDATE|DELETE)\s+(?:INTO\s+|FROM\s+)?public\.(?:learner_item_progress|exam_attempts|user_learning_path_progress|user_learning_path_resources)/i
    );
  });

  await t.test('retains duplicate, stale, ownership, product and service-role safeguards', () => {
    assert.match(migration, /ON CONFLICT \(stripe_event_id\) DO NOTHING/);
    assert.match(migration, /safe_error_code = 'stale_provider_event'/);
    assert.match(migration, /Customer ownership does not match/);
    assert.match(migration, /Subscription ownership or exact-exam mapping changed unexpectedly/);
    assert.match(migration, /Stripe product, price, exam or mode is not enabled/);
    assert.match(migration, /FROM PUBLIC, anon, authenticated;/);
    assert.match(migration, /TO service_role;/);
  });

  await t.test('contains no network, secret, browser or deployment operation', () => {
    assert.doesNotMatch(executable, /https?:\/\/|fetch\s*\(|stripe\.com|supabase\.(?:co|com)|VITE_|localStorage|sessionStorage/i);
    assert.doesNotMatch(executable, /(?:sk|rk)_(?:test|live)_|whsec_/i);
  });
});
