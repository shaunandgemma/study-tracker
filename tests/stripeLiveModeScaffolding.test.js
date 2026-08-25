import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  LIVE_PAYMENT_SITE_ORIGIN,
  STRIPE_PAYMENT_API_VERSION,
  createLivePaymentIdempotencyKeys,
  createLiveServerPaymentDependencies,
  validateLiveRuntimeSettings,
  validateSandboxRuntimeSettings
} from '../supabase/functions/_shared/payments/serverAdapters.mjs';
import {
  createExamCheckoutHandler,
  createStripeWebhookHandler
} from '../supabase/functions/_shared/payments/handlers.mjs';
import {
  createPaymentBrowserService,
  getPaymentRuntimeConfiguration,
  isLivePaymentRuntimeEnabled
} from '../src/features/payments/paymentBrowserService.js';

const userId = '667ad4ce-312b-4f78-a3fa-366c8b669477';
const examId = 'aws-saa-c03';
const customerId = 'cus_liveLearner001';
const productId = 'prod_liveAws001';
const priceId = 'price_liveAwsAnnual001';

const read = path => readFileSync(path, 'utf8');

function request(body, headers = {}) {
  return new Request('https://functions.example.test/create-exam-checkout-live', {
    body: JSON.stringify(body),
    headers: {
      Authorization: 'Bearer live-user-session',
      'Content-Type': 'application/json',
      Origin: LIVE_PAYMENT_SITE_ORIGIN,
      ...headers
    },
    method: 'POST'
  });
}

function createLiveRuntime({ existingCustomer = null, now = 1800000000000 } = {}) {
  const calls = { checkout: [], customers: [], rpc: [] };
  const serviceClient = {
    rpc: async (name, args) => {
      calls.rpc.push({ args, name });
      if (name === 'get_stripe_exam_checkout_context') {
        return { data: {
          customerId: existingCustomer,
          enabled: true,
          examId,
          hasCurrentSubscription: false,
          livemode: true,
          priceId,
          productId
        }, error: null };
      }
      if (name === 'bind_stripe_customer') return { data: { bound: true }, error: null };
      return { data: { duplicate: false, processed: true, stale: false }, error: null };
    }
  };
  const stripe = {
    billingPortal: { sessions: { create: async () => ({ url: 'https://billing.stripe.com/p/live' }) } },
    checkout: { sessions: { create: async (input, options) => {
      calls.checkout.push({ input, options });
      return { id: 'cs_live_checkout001', url: 'https://checkout.stripe.com/c/pay/live' };
    } } },
    customers: { create: async (input, options) => {
      calls.customers.push({ input, options });
      return { id: customerId };
    } },
    webhooks: { constructEventAsync: async () => ({
      id: 'evt_liveInvoicePaid001', livemode: true, type: 'invoice.paid'
    }) }
  };
  const dependencies = createLiveServerPaymentDependencies({
    authClientFactory: () => ({ auth: { getUser: async () => ({
      data: { user: {
        email: 'live-learner@example.test',
        email_confirmed_at: '2026-08-25T12:00:00.000Z',
        id: userId,
        is_anonymous: false
      } },
      error: null
    }) } }),
    now: () => now,
    serviceClient,
    settings: {
      allowedOrigins: [LIVE_PAYMENT_SITE_ORIGIN],
      livemode: true,
      siteOrigin: LIVE_PAYMENT_SITE_ORIGIN,
      webhookSecret: 'whsec_live_fixture'
    },
    stripe
  });
  return { calls, dependencies };
}

test('Step 010B deployment-disabled Stripe live-mode scaffolding', async t => {
  await t.test('live settings require fixed live mode, a restricted live key and the canonical origin', () => {
    assert.equal(STRIPE_PAYMENT_API_VERSION, '2026-07-29.dahlia');
    assert.equal(validateLiveRuntimeSettings({
      allowedOrigins: [LIVE_PAYMENT_SITE_ORIGIN],
      livemode: true,
      siteOrigin: `${LIVE_PAYMENT_SITE_ORIGIN}/`,
      stripeSecretKey: 'rk_live_fixture',
      webhookSecret: 'whsec_fixture'
    }).livemode, true);

    for (const stripeSecretKey of ['rk_test_fixture', 'sk_live_fixture', 'sk_test_fixture']) {
      assert.throws(() => validateLiveRuntimeSettings({
        allowedOrigins: [LIVE_PAYMENT_SITE_ORIGIN],
        livemode: true,
        siteOrigin: LIVE_PAYMENT_SITE_ORIGIN,
        stripeSecretKey,
        webhookSecret: 'whsec_fixture'
      }), /live restricted key/i);
    }
    assert.throws(() => validateLiveRuntimeSettings({
      allowedOrigins: [LIVE_PAYMENT_SITE_ORIGIN],
      livemode: false,
      siteOrigin: LIVE_PAYMENT_SITE_ORIGIN,
      stripeSecretKey: 'rk_live_fixture',
      webhookSecret: 'whsec_fixture'
    }), /fixed live mode/i);
    assert.throws(() => validateLiveRuntimeSettings({
      allowedOrigins: ['https://attacker.invalid'],
      livemode: true,
      siteOrigin: LIVE_PAYMENT_SITE_ORIGIN,
      stripeSecretKey: 'rk_live_fixture',
      webhookSecret: 'whsec_fixture'
    }), /canonical production origin/i);
    assert.throws(() => validateSandboxRuntimeSettings({
      livemode: false,
      stripeSecretKey: 'rk_live_fixture',
      webhookSecret: 'whsec_fixture'
    }), /sandbox restricted key/i);
  });

  await t.test('server-owned idempotency keys are stable within one window and isolated by exam and window', () => {
    const first = createLivePaymentIdempotencyKeys({ examId, now: 1800000000000, userId });
    const retry = createLivePaymentIdempotencyKeys({ examId, now: 1800000001000, userId });
    const later = createLivePaymentIdempotencyKeys({ examId, now: 1800001800000, userId });
    const otherExam = createLivePaymentIdempotencyKeys({
      examId: 'terraform-associate-004', now: 1800000000000, userId
    });

    assert.deepEqual(first, retry);
    assert.equal(first.customer, later.customer);
    assert.notEqual(first.checkout, later.checkout);
    assert.notEqual(first.checkout, otherExam.checkout);
    assert.match(first.customer, /^latt-live-v1-customer-/);
    assert.match(first.checkout, /^latt-live-v1-checkout-/);
    assert.throws(() => createLivePaymentIdempotencyKeys({
      examId: 'attacker-exam', now: 1800000000000, userId
    }), /invalid/i);
  });

  await t.test('live Checkout uses only server catalogue values, card payment and server retry keys', async () => {
    const { calls, dependencies } = createLiveRuntime();
    const handler = createExamCheckoutHandler(dependencies);
    const first = await handler(request({ examId }));
    const retry = await handler(request({ examId }));

    assert.equal(first.status, 200);
    assert.equal(retry.status, 200);
    assert.equal(calls.customers.length, 2);
    assert.equal(calls.checkout.length, 2);
    assert.deepEqual(calls.customers[0].options, calls.customers[1].options);
    assert.deepEqual(calls.checkout[0].options, calls.checkout[1].options);
    assert.match(calls.customers[0].options.idempotencyKey, /^latt-live-v1-customer-/);
    assert.match(calls.checkout[0].options.idempotencyKey, /^latt-live-v1-checkout-/);
    assert.deepEqual(calls.checkout[0].input.payment_method_types, ['card']);
    assert.deepEqual(calls.checkout[0].input.line_items, [{ price: priceId, quantity: 1 }]);
    assert.equal(calls.checkout[0].input.customer, customerId);
    assert.equal(calls.checkout[0].input.success_url, `${LIVE_PAYMENT_SITE_ORIGIN}/#payment/success`);
    assert.equal(calls.checkout[0].input.cancel_url, `${LIVE_PAYMENT_SITE_ORIGIN}/#payment/cancelled`);
    assert.deepEqual(calls.rpc[0].args, {
      p_exam_id: examId,
      p_livemode: true,
      p_user_id: userId
    });

    const injected = await handler(request({ examId, priceId: 'price_attacker' }));
    assert.equal(injected.status, 400);
    assert.equal(calls.checkout.length, 2);
  });

  await t.test('live webhook accepts only signed live events and preserves mode isolation', async () => {
    const liveEvent = { id: 'evt_liveInvoicePaid001', livemode: true, type: 'invoice.paid' };
    const state = {
      accessAction: 'activate', cancelAtPeriodEnd: false,
      currentPeriodEnd: '2027-08-25T12:00:00.000Z',
      currentPeriodStart: '2026-08-25T12:00:00.000Z',
      eventType: liveEvent.type, examId, latestInvoiceId: 'in_liveInvoice001', livemode: true,
      paidThrough: '2027-08-25T12:00:00.000Z',
      providerEventCreatedAt: '2026-08-25T12:00:00.000Z', providerStatus: 'active',
      reasonCode: 'invoice_paid', stripeCustomerId: customerId,
      stripeEventId: liveEvent.id, stripePriceId: priceId, stripeProductId: productId,
      stripeSubscriptionId: 'sub_liveAws001', userId
    };
    const reconciled = [];
    const dependencies = {
      livemode: true,
      reconcileEntitlement: async value => {
        reconciled.push(value);
        return { duplicate: false, stale: false };
      },
      resolveAuthoritativeState: async () => state,
      stripe: { constructEvent: async () => liveEvent }
    };
    const handler = createStripeWebhookHandler(dependencies);
    const response = await handler(new Request('https://functions.example.test/stripe-webhook-live', {
      body: '{}', headers: { 'Stripe-Signature': 't=1,v1=signed' }, method: 'POST'
    }));
    assert.equal(response.status, 200);
    assert.deepEqual(reconciled, [state]);

    const wrongModeHandler = createStripeWebhookHandler({
      ...dependencies,
      stripe: { constructEvent: async () => ({ ...liveEvent, livemode: false }) }
    });
    const wrongMode = await wrongModeHandler(new Request('https://functions.example.test/stripe-webhook-live', {
      body: '{}', headers: { 'Stripe-Signature': 't=1,v1=signed' }, method: 'POST'
    }));
    assert.equal(wrongMode.status, 400);
    assert.equal(reconciled.length, 1);
  });

  await t.test('browser flags are mutually exclusive and use only fixed mode-specific functions', async () => {
    assert.equal(isLivePaymentRuntimeEnabled({ VITE_STRIPE_LIVE_PAYMENTS_ENABLED: 'true' }), true);
    assert.deepEqual(getPaymentRuntimeConfiguration({
      VITE_STRIPE_LIVE_PAYMENTS_ENABLED: 'true',
      VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED: 'true'
    }), { enabled: false, invalid: true, mode: null });
    assert.deepEqual(getPaymentRuntimeConfiguration({ VITE_STRIPE_LIVE_PAYMENTS_ENABLED: 'true' }), {
      enabled: true, invalid: false, mode: 'live'
    });

    const calls = [];
    const service = createPaymentBrowserService({
      enabled: true,
      mode: 'live',
      supabaseClient: {
        auth: { getSession: async () => ({
          data: { session: { access_token: 'token', user: { id: userId } } }, error: null
        }) },
        functions: { invoke: async (name, options) => {
          calls.push({ name, options });
          return { data: { url: 'https://checkout.stripe.com/c/pay/live' }, error: null };
        } }
      }
    });
    assert.equal((await service.createExamCheckout({ examId })).success, true);
    assert.deepEqual(calls, [{
      name: 'create-exam-checkout-live', options: { body: { examId } }
    }]);

    const failClosed = createPaymentBrowserService({
      enabled: true,
      invalidConfiguration: true,
      mode: 'live',
      supabaseClient: { auth: {}, functions: {} }
    });
    const rejected = await failClosed.createExamCheckout({ examId });
    assert.equal(rejected.runtimeDisabled, true);
    assert.equal(rejected.configurationInvalid, true);
  });

  await t.test('all live entrypoints are fixed, separate and deployment-disabled with exact JWT boundaries', () => {
    const config = read('supabase/config.toml');
    const runtime = read('supabase/functions/_shared/payments/stripeLiveRuntime.ts');
    const envExample = read('.env.example');
    const entries = [
      'supabase/functions/create-exam-checkout-live/index.ts',
      'supabase/functions/create-stripe-portal-session-live/index.ts',
      'supabase/functions/stripe-webhook-live/index.ts'
    ].map(read).join('\n');

    assert.match(config, /\[functions\.create-exam-checkout-live\][\s\S]*?enabled = false[\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.create-stripe-portal-session-live\][\s\S]*?enabled = false[\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.stripe-webhook-live\][\s\S]*?enabled = false[\s\S]*?verify_jwt = false/);
    assert.equal((entries.match(/createStripeLiveDependencies\(\)/g) || []).length, 3);
    assert.match(runtime, /STRIPE_LIVE_RESTRICTED_KEY/);
    assert.match(runtime, /STRIPE_LIVE_WEBHOOK_SECRET/);
    assert.match(runtime, /PAYMENT_LIVE_SITE_ORIGIN/);
    assert.match(runtime, /apiVersion: STRIPE_PAYMENT_API_VERSION/);
    assert.match(envExample, /VITE_STRIPE_LIVE_PAYMENTS_ENABLED=false/);
    assert.doesNotMatch(runtime + entries, /(?:sk|rk)_(?:test|live)_[A-Za-z0-9]{12,}|whsec_[A-Za-z0-9]{12,}/);
    assert.doesNotMatch(runtime + entries, /\.from\(['"]payment_|\.from\(['"]exam_entitlements/);
  });
});
