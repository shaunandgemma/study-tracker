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
