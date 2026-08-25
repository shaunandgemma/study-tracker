import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  createAuthoritativeStateResolver,
  createServerPaymentDependencies,
  validateSandboxRuntimeSettings
} from '../supabase/functions/_shared/payments/serverAdapters.mjs';
import { stripeTestFixture as fixture } from './fixtures/stripe/paymentFixtures.mjs';

function createRuntime(overrides = {}) {
  const calls = { rpc: [] };
  const rpcData = {
    bind_stripe_customer: { bound: true },
    get_stripe_exam_checkout_context: {
      customerId: fixture.customerId,
      enabled: true,
      examId: fixture.examId,
      hasCurrentSubscription: false,
      livemode: false,
      priceId: fixture.priceId,
      productId: fixture.productId
    },
    get_stripe_portal_context: { customerId: fixture.customerId, livemode: false },
    reconcile_stripe_exam_entitlement: { duplicate: false, processed: true, stale: false },
    ...(overrides.rpcData || {})
  };
  const serviceClient = {
    rpc: async (name, args) => {
      calls.rpc.push({ args, name });
      return { data: rpcData[name], error: null };
    }
  };
  const authClientFactory = () => ({
    auth: {
      getUser: async token => ({
        data: {
          user: {
            email: fixture.email,
            email_confirmed_at: '2026-08-20T12:00:00.000Z',
            id: fixture.userId,
            is_anonymous: false
          }
        },
        error: null,
        token
      })
    }
  });
  const stripe = overrides.stripe || {
    billingPortal: { sessions: { create: async () => ({ url: fixture.portalUrl }) } },
    checkout: { sessions: { create: async () => ({ id: fixture.sessionId, url: fixture.sessionUrl }) } },
    customers: { create: async () => ({ id: fixture.customerId }) },
    webhooks: { constructEventAsync: async () => fixture.event }
  };
  const dependencies = createServerPaymentDependencies({
    authClientFactory,
    serviceClient,
    settings: {
      allowedOrigins: [fixture.allowedOrigin],
      livemode: false,
      siteOrigin: 'http://127.0.0.1:5173',
      webhookSecret: 'whsec_test_fixture'
    },
    stripe
  });
  return { calls, dependencies };
}

test('Step 008E1 Stripe sandbox runtime adapters', async t => {
  await t.test('strict authentication accepts only a supplied bearer session', async () => {
    const { dependencies } = createRuntime();
    assert.equal(await dependencies.authenticate(new Request('http://localhost')), null);
    const user = await dependencies.authenticate(new Request('http://localhost', {
      headers: { Authorization: 'Bearer test-user-session' }
    }));
    assert.equal(user.id, fixture.userId);
    assert.equal(user.emailConfirmedAt, '2026-08-20T12:00:00.000Z');
    assert.equal(user.isAnonymous, false);
  });

  await t.test('checkout and portal use only the three service-role RPC contracts', async () => {
    const { calls, dependencies } = createRuntime();
    await dependencies.getCheckoutContext({ examId: fixture.examId, userId: fixture.userId });
    await dependencies.bindCustomer({ customerId: fixture.customerId, userId: fixture.userId });
    await dependencies.getPortalContext({ userId: fixture.userId });
    assert.deepEqual(calls.rpc.map(call => call.name), [
      'get_stripe_exam_checkout_context',
      'bind_stripe_customer',
      'get_stripe_portal_context'
    ]);
    assert.deepEqual(calls.rpc[0].args, {
      p_exam_id: fixture.examId,
      p_livemode: false,
      p_user_id: fixture.userId
    });
  });

  await t.test('webhook reconciliation maps every field to the existing service-role function', async () => {
    const { calls, dependencies } = createRuntime();
    const state = {
      accessAction: 'activate', cancelAtPeriodEnd: false,
      currentPeriodEnd: '2027-08-21T12:00:00.000Z', currentPeriodStart: '2026-08-21T12:00:00.000Z',
      eventType: 'invoice.paid', examId: fixture.examId, latestInvoiceId: fixture.invoiceId,
      livemode: false, paidThrough: '2027-08-21T12:00:00.000Z',
      providerEventCreatedAt: '2026-08-21T12:00:00.000Z', providerStatus: 'active',
      reasonCode: 'invoice_paid', stripeCustomerId: fixture.customerId,
      stripeEventId: fixture.event.id, stripePriceId: fixture.priceId,
      stripeProductId: fixture.productId, stripeSubscriptionId: fixture.subscriptionId,
      userId: fixture.userId
    };
    await dependencies.reconcileEntitlement(state);
    assert.equal(calls.rpc[0].name, 'reconcile_stripe_exam_entitlement');
    assert.equal(Object.keys(calls.rpc[0].args).length, 18);
    assert.equal(calls.rpc[0].args.p_stripe_event_id, fixture.event.id);
    assert.equal(calls.rpc[0].args.p_access_action, 'activate');
  });

  await t.test('authoritative resolution supports current Stripe item periods and invoice parents', async () => {
    const subscription = {
      cancel_at_period_end: false,
      customer: fixture.customerId,
      id: fixture.subscriptionId,
      items: { data: [{
        current_period_end: 1818859200,
        current_period_start: 1787323200,
        price: { id: fixture.priceId, product: { id: fixture.productId } }
      }] },
      latest_invoice: fixture.invoiceId,
      livemode: false,
      metadata: { latt_exam_id: fixture.examId, latt_user_id: fixture.userId },
      status: 'active'
    };
    const stripe = { subscriptions: { retrieve: async id => {
      assert.equal(id, fixture.subscriptionId);
      return subscription;
    } } };
    const event = {
      created: 1787323200,
      data: { object: {
        id: fixture.invoiceId,
        parent: { subscription_details: { subscription: fixture.subscriptionId }, type: 'subscription_details' }
      } },
      id: fixture.event.id,
      livemode: false,
      type: 'invoice.paid'
    };
    const state = await createAuthoritativeStateResolver(stripe)(event);
    assert.equal(state.accessAction, 'activate');
    assert.equal(state.paidThrough, state.currentPeriodEnd);
    assert.equal(state.stripeProductId, fixture.productId);
    assert.equal(state.userId, fixture.userId);
  });

  await t.test('non-payment lifecycle events carry no new paid-through authority', async () => {
    const subscription = {
      cancel_at_period_end: true,
      customer: fixture.customerId,
      id: fixture.subscriptionId,
      items: { data: [{
        current_period_end: 1818859200,
        current_period_start: 1787323200,
        price: { id: fixture.priceId, product: { id: fixture.productId } }
      }] },
      latest_invoice: fixture.invoiceId,
      livemode: false,
      metadata: { latt_exam_id: fixture.examId, latt_user_id: fixture.userId },
      status: 'active'
    };
    const stripe = { subscriptions: { retrieve: async () => subscription } };
    const state = await createAuthoritativeStateResolver(stripe)({
      created: 1787326800,
      data: { object: subscription },
      id: 'evt_testSubscriptionUpdated001',
      livemode: false,
      type: 'customer.subscription.updated'
    });

    assert.equal(state.accessAction, 'no_change');
    assert.equal(state.reasonCode, 'provider_state_refreshed');
    assert.equal(state.cancelAtPeriodEnd, true);
    assert.equal(state.currentPeriodEnd, '2027-08-21T14:40:00.000Z');
    assert.equal(state.latestInvoiceId, fixture.invoiceId);
    assert.equal(state.paidThrough, null);
  });

  await t.test('current Stripe refund events resolve through PaymentIntent and Invoice Payment without changing access', async () => {
    const paymentIntentId = 'pi_testRefund001';
    const refundedInvoiceId = 'in_testRefunded001';
    const chargeId = 'ch_testRefund001';
    const calls = { charges: [], invoicePayments: [], invoices: [], subscriptions: [] };
    const charge = {
      amount: 1999,
      amount_refunded: 100,
      id: chargeId,
      livemode: false,
      paid: true,
      payment_intent: paymentIntentId,
      refunded: false,
      status: 'succeeded'
    };
    const subscription = {
      cancel_at_period_end: false,
      customer: fixture.customerId,
      id: fixture.subscriptionId,
      items: { data: [{
        current_period_end: 1840046614,
        current_period_start: 1808510614,
        price: { id: fixture.priceId, product: { id: fixture.productId } }
      }] },
      latest_invoice: fixture.invoiceId,
      livemode: false,
      metadata: { latt_exam_id: fixture.examId, latt_user_id: fixture.userId },
      status: 'past_due'
    };
    const stripe = {
      charges: { retrieve: async id => {
        calls.charges.push(id);
        return charge;
      } },
      invoicePayments: { list: async params => {
        calls.invoicePayments.push(params);
        return {
          data: [{
            id: 'inpay_testRefund001',
            invoice: refundedInvoiceId,
            payment: { payment_intent: paymentIntentId, type: 'payment_intent' }
          }],
          has_more: false
        };
      } },
      invoices: { retrieve: async id => {
        calls.invoices.push(id);
        return {
          id,
          paid: true,
          parent: { subscription_details: { subscription: fixture.subscriptionId } },
          status: 'paid'
        };
      } },
      subscriptions: { retrieve: async id => {
        calls.subscriptions.push(id);
        return subscription;
      } }
    };

    for (const type of ['charge.refunded', 'refund.created', 'refund.updated']) {
      const state = await createAuthoritativeStateResolver(stripe)({
        created: 1787433464,
        data: { object: {
          charge: type.startsWith('refund.') ? chargeId : undefined,
          id: type === 'charge.refunded' ? chargeId : 're_testRefund001',
          payment_intent: paymentIntentId,
          status: type.startsWith('refund.') ? 'succeeded' : undefined
        } },
        id: `evt_test_${type.replace('.', '_')}`,
        livemode: false,
        type
      });

      assert.equal(state.accessAction, 'no_change');
      assert.equal(state.reasonCode, 'refund_manual_review');
      assert.equal(state.latestInvoiceId, refundedInvoiceId);
      assert.equal(state.paidThrough, null);
      assert.equal(state.providerStatus, 'past_due');
      assert.equal(state.currentPeriodEnd, '2028-04-22T20:03:34.000Z');
      assert.equal(state.stripeSubscriptionId, fixture.subscriptionId);
    }

    assert.deepEqual(calls.charges, Array.from({ length: 3 }, () => chargeId));
    assert.deepEqual(calls.invoicePayments, Array.from({ length: 3 }, () => ({
      limit: 2,
      payment: { payment_intent: paymentIntentId, type: 'payment_intent' }
    })));
    assert.deepEqual(calls.invoices, Array.from({ length: 3 }, () => refundedInvoiceId));
    assert.deepEqual(calls.subscriptions, Array.from({ length: 3 }, () => fixture.subscriptionId));
  });

  await t.test('refund resolution uses its paid Invoice rather than the Subscription latest Invoice', async () => {
    const paymentIntentId = 'pi_testRefundLatestBoundary001';
    const chargeId = 'ch_testRefundLatestBoundary001';
    const stripe = {
      charges: { retrieve: async () => ({
        amount: 1999,
        amount_refunded: 100,
        id: chargeId,
        livemode: false,
        paid: true,
        payment_intent: paymentIntentId,
        refunded: false,
        status: 'succeeded'
      }) },
      invoicePayments: { list: async () => ({
        data: [{
          invoice: 'in_testRefundedBoundary001',
          payment: { payment_intent: paymentIntentId, type: 'payment_intent' }
        }],
        has_more: false
      }) },
      invoices: { retrieve: async id => ({
        id,
        paid: true,
        status: 'paid',
        parent: { subscription_details: { subscription: fixture.subscriptionId } }
      }) },
      subscriptions: { retrieve: async () => ({
        cancel_at_period_end: false,
        customer: fixture.customerId,
        id: fixture.subscriptionId,
        items: { data: [{
          current_period_end: 1840046614,
          current_period_start: 1808510614,
          price: { id: fixture.priceId, product: { id: fixture.productId } }
        }] },
        latest_invoice: null,
        livemode: false,
        metadata: { latt_exam_id: fixture.examId, latt_user_id: fixture.userId },
        status: 'past_due'
      }) }
    };

    const state = await createAuthoritativeStateResolver(stripe)({
      created: 1787433464,
      data: { object: {
        charge: chargeId,
        id: 're_testRefundLatestBoundary001',
        payment_intent: paymentIntentId,
        status: 'succeeded'
      } },
      id: 'evt_testRefundLatestBoundary001',
      livemode: false,
      type: 'refund.updated'
    });

    assert.equal(state.accessAction, 'no_change');
    assert.equal(state.reasonCode, 'refund_manual_review');
    assert.equal(state.latestInvoiceId, 'in_testRefundedBoundary001');
  });

  await t.test('refund resolution fails closed when Invoice Payment is absent or ambiguous', async () => {
    const paymentIntentId = 'pi_testRefundBoundary001';
    const event = {
      created: 1787433464,
      data: { object: {
        charge: 'ch_testRefundBoundary001',
        id: 're_testRefundBoundary001',
        payment_intent: paymentIntentId,
        status: 'succeeded'
      } },
      id: 'evt_testRefundBoundary001',
      livemode: false,
      type: 'refund.created'
    };
    const stripeWith = invoicePayments => ({
      charges: { retrieve: async () => ({
        amount: 1999,
        amount_refunded: 100,
        id: 'ch_testRefundBoundary001',
        livemode: false,
        paid: true,
        payment_intent: paymentIntentId,
        refunded: false,
        status: 'succeeded'
      }) },
      invoicePayments: { list: async () => invoicePayments },
      invoices: { retrieve: async () => { throw new Error('No Invoice may be selected from an invalid boundary.'); } },
      subscriptions: { retrieve: async () => { throw new Error('No Subscription may be selected from an invalid boundary.'); } }
    });

    await assert.rejects(
      createAuthoritativeStateResolver(stripeWith({ data: [], has_more: false }))(event),
      /exactly one Invoice Payment/
    );
    await assert.rejects(
      createAuthoritativeStateResolver(stripeWith({
        data: [
          { invoice: 'in_testOne', payment: { payment_intent: paymentIntentId } },
          { invoice: 'in_testTwo', payment: { payment_intent: paymentIntentId } }
        ],
        has_more: false
      }))(event),
      /exactly one Invoice Payment/
    );
    await assert.rejects(
      createAuthoritativeStateResolver(stripeWith({
        data: [{ invoice: fixture.invoiceId, payment: { payment_intent: paymentIntentId } }],
        has_more: true
      }))(event),
      /exactly one Invoice Payment/
    );
  });

  await t.test('live-mode settings are rejected before any Stripe operation', () => {
    assert.equal(validateSandboxRuntimeSettings({
      livemode: false,
      stripeSecretKey: 'rk_test_restricted_fixture',
      webhookSecret: 'whsec_fixture'
    }).livemode, false);
    assert.throws(() => createServerPaymentDependencies({
      authClientFactory: () => ({}),
      serviceClient: { rpc: async () => ({ data: {} }) },
      settings: { allowedOrigins: [], livemode: true, siteOrigin: 'https://example.test' },
      stripe: {}
    }), /sandbox mode only/i);
    assert.throws(() => validateSandboxRuntimeSettings({
      livemode: true,
      stripeSecretKey: 'sk_live_forbidden',
      webhookSecret: 'whsec_fixture'
    }), /sandbox|live mode/i);
    assert.throws(() => validateSandboxRuntimeSettings({
      livemode: false,
      stripeSecretKey: 'sk_live_forbidden',
      webhookSecret: 'whsec_fixture'
    }), /sandbox restricted key/i);
    assert.throws(() => validateSandboxRuntimeSettings({
      livemode: false,
      stripeSecretKey: 'rk_live_forbidden',
      webhookSecret: 'whsec_fixture'
    }), /sandbox restricted key/i);
    assert.throws(() => validateSandboxRuntimeSettings({
      livemode: false,
      stripeSecretKey: 'sk_test_unrestricted_forbidden',
      webhookSecret: 'whsec_fixture'
    }), /sandbox restricted key/i);
  });

  await t.test('entrypoints use sandbox adapters while all three approved sandbox functions are enabled', () => {
    const config = readFileSync('supabase/config.toml', 'utf8');
    const entries = [
      'supabase/functions/create-exam-checkout/index.ts',
      'supabase/functions/create-stripe-portal-session/index.ts',
      'supabase/functions/stripe-webhook/index.ts'
    ].map(path => readFileSync(path, 'utf8')).join('\n');
    assert.match(config, /\[functions\.create-exam-checkout\][\s\S]*?enabled = true[\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.create-stripe-portal-session\][\s\S]*?enabled = true[\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.stripe-webhook\][\s\S]*?enabled = true[\s\S]*?verify_jwt = false/);
    assert.equal((entries.match(/createStripeSandboxDependencies\(\)/g) || []).length, 3);
    assert.doesNotMatch(entries, /createLocalOnlyDependencies/);
  });

  await t.test('runtime source contains secret names but no secret values or direct private-table access', () => {
    const source = [
      'supabase/functions/_shared/payments/serverAdapters.mjs',
      'supabase/functions/_shared/payments/stripeSandboxRuntime.ts'
    ].map(path => readFileSync(path, 'utf8')).join('\n');
    assert.match(source, /STRIPE_SECRET_KEY/);
    assert.match(source, /STRIPE_WEBHOOK_SECRET/);
    assert.match(source, /SUPABASE_SERVICE_ROLE_KEY/);
    assert.doesNotMatch(source, /(?:sk|rk)_(?:test|live)_[A-Za-z0-9]{12,}|whsec_[A-Za-z0-9]{12,}/);
    assert.doesNotMatch(source, /\.from\(['"]payment_|\.from\(['"]exam_entitlements/);
  });
});
