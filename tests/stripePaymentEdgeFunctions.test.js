import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  createExamCheckoutHandler,
  createStripePortalSessionHandler,
  createStripeWebhookHandler
} from '../supabase/functions/_shared/payments/handlers.mjs';
import {
  createAuthoritativeStripeState,
  createStripeTestDependencies,
  stripeTestFixture as fixture
} from './fixtures/stripe/paymentFixtures.mjs';

const config = readFileSync('supabase/config.toml', 'utf8');
const sharedSources = [
  'supabase/functions/_shared/payments/contracts.mjs',
  'supabase/functions/_shared/payments/http.mjs',
  'supabase/functions/_shared/payments/handlers.mjs',
  'supabase/functions/_shared/payments/localOnlyRuntime.mjs',
  'supabase/functions/_shared/payments/serverAdapters.mjs',
  'supabase/functions/_shared/payments/stripeSandboxRuntime.ts'
].map(path => readFileSync(path, 'utf8')).join('\n');
const entrySources = [
  'supabase/functions/create-exam-checkout/index.ts',
  'supabase/functions/create-stripe-portal-session/index.ts',
  'supabase/functions/stripe-webhook/index.ts'
].map(path => readFileSync(path, 'utf8')).join('\n');

function browserRequest(path, body = {}, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Origin')) headers.set('Origin', fixture.allowedOrigin);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return new Request(`http://localhost${path}`, {
    body: options.rawBody ?? JSON.stringify(body),
    headers,
    method: options.method || 'POST'
  });
}

async function responseJson(response) {
  return JSON.parse(await response.text());
}

test('Step 008C local Stripe server functions', async t => {
  await t.test('1. both browser entrypoints and the signed webhook are enabled while only the webhook bypasses JWT verification', () => {
    assert.match(config, /\[functions\.create-exam-checkout\][\s\S]*?enabled = true/);
    assert.match(config, /\[functions\.create-stripe-portal-session\][\s\S]*?enabled = true/);
    assert.match(config, /\[functions\.stripe-webhook\][\s\S]*?enabled = true/);
    assert.match(config, /\[functions\.create-exam-checkout\][\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.create-stripe-portal-session\][\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.stripe-webhook\][\s\S]*?verify_jwt = false/);
    assert.equal((entrySources.match(/createStripeSandboxDependencies\(\)/g) || []).length, 3);
  });

  await t.test('2. checkout uses only the server-selected annual Price, customer and fixed redirects', async () => {
    const { calls, dependencies } = createStripeTestDependencies();
    const response = await createExamCheckoutHandler(dependencies)(
      browserRequest('/checkout', { examId: fixture.examId })
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await responseJson(response), { url: fixture.sessionUrl });
    assert.equal(calls.customers.length, 0);
    assert.equal(calls.checkoutSessions.length, 1);
    assert.deepEqual(calls.checkoutSessions[0], {
      cancel_url: fixture.cancelUrl,
      client_reference_id: fixture.userId,
      customer: fixture.customerId,
      line_items: [{ price: fixture.priceId, quantity: 1 }],
      metadata: { latt_exam_id: fixture.examId, latt_user_id: fixture.userId },
      mode: 'subscription',
      subscription_data: {
        metadata: { latt_exam_id: fixture.examId, latt_user_id: fixture.userId }
      },
      success_url: fixture.successUrl
    });
  });

  await t.test('3. checkout creates and immutably binds a missing Stripe Customer before creating a session', async () => {
    const { calls, dependencies } = createStripeTestDependencies({
      getCheckoutContext: async ({ examId, livemode }) => ({
        customerId: null,
        enabled: true,
        examId,
        hasCurrentSubscription: false,
        livemode,
        priceId: fixture.priceId,
        productId: fixture.productId
      })
    });
    const response = await createExamCheckoutHandler(dependencies)(
      browserRequest('/checkout', { examId: fixture.examId })
    );
    assert.equal(response.status, 200);
    assert.deepEqual(calls.customers[0], {
      email: fixture.email,
      metadata: { latt_user_id: fixture.userId }
    });
    assert.deepEqual(calls.bindCustomer[0], {
      customerId: fixture.customerId,
      livemode: false,
      userId: fixture.userId
    });
  });

  await t.test('4. checkout rejects identity, origin, exam and client-controlled payment fields fail closed', async () => {
    const unauthenticated = createStripeTestDependencies({ authenticate: async () => null });
    const unauthenticatedResponse = await createExamCheckoutHandler(unauthenticated.dependencies)(
      browserRequest('/checkout', { examId: fixture.examId })
    );
    assert.equal(unauthenticatedResponse.status, 401);

    const unverified = createStripeTestDependencies({
      authenticate: async () => ({ id: fixture.userId, email: fixture.email, emailConfirmedAt: null })
    });
    assert.equal(
      (await createExamCheckoutHandler(unverified.dependencies)(
        browserRequest('/checkout', { examId: fixture.examId })
      )).status,
      403
    );

    const standard = createStripeTestDependencies();
    const injectionResponse = await createExamCheckoutHandler(standard.dependencies)(
      browserRequest('/checkout', {
        examId: fixture.examId,
        priceId: 'price_attacker',
        customerId: 'cus_attacker',
        amount: 1,
        successUrl: 'https://attacker.invalid'
      })
    );
    assert.equal(injectionResponse.status, 400);
    assert.equal(standard.calls.checkoutSessions.length, 0);

    const invalidOriginRequest = browserRequest('/checkout', { examId: fixture.examId }, {
      headers: { Origin: 'https://attacker.invalid', 'Content-Type': 'application/json' }
    });
    assert.equal(
      (await createExamCheckoutHandler(standard.dependencies)(invalidOriginRequest)).status,
      403
    );
  });

  await t.test('5. checkout prevents a duplicate current exact-exam subscription', async () => {
    const { calls, dependencies } = createStripeTestDependencies({
      getCheckoutContext: async ({ examId, livemode }) => ({
        customerId: fixture.customerId,
        enabled: true,
        examId,
        hasCurrentSubscription: true,
        livemode,
        priceId: fixture.priceId,
        productId: fixture.productId
      })
    });
    const response = await createExamCheckoutHandler(dependencies)(
      browserRequest('/checkout', { examId: fixture.examId })
    );
    assert.equal(response.status, 409);
    assert.deepEqual(await responseJson(response), { error: 'exam_access_already_active' });
    assert.equal(calls.checkoutSessions.length, 0);
  });

  await t.test('6. portal ignores all client identity data and uses the signed-in learner mapping and fixed return URL', async () => {
    const { calls, dependencies } = createStripeTestDependencies();
    const handler = createStripePortalSessionHandler(dependencies);
    const response = await handler(browserRequest('/portal', {}));
    assert.equal(response.status, 200);
    assert.deepEqual(await responseJson(response), { url: fixture.portalUrl });
    assert.deepEqual(calls.portalSessions[0], {
      customer: fixture.customerId,
      return_url: fixture.returnUrl
    });

    const injected = await handler(browserRequest('/portal', { customerId: 'cus_attacker' }));
    assert.equal(injected.status, 400);
    assert.equal(calls.portalSessions.length, 1);
  });

  await t.test('7. webhook verifies the exact raw body before resolving authoritative Stripe state', async () => {
    const { calls, dependencies } = createStripeTestDependencies();
    const rawBody = '{\n  "id": "evt_testInvoicePaid001",\n  "type": "invoice.paid"\n}';
    const request = new Request('http://localhost/webhook', {
      body: rawBody,
      headers: { 'Stripe-Signature': fixture.signature },
      method: 'POST'
    });
    const response = await createStripeWebhookHandler(dependencies)(request);
    assert.equal(response.status, 200);
    assert.deepEqual(await responseJson(response), { received: true, duplicate: false, stale: false });
    assert.deepEqual(calls.constructEvent[0], { rawBody, signature: fixture.signature });
    assert.deepEqual(calls.resolve, [fixture.event]);
    assert.deepEqual(calls.reconcile, [createAuthoritativeStripeState()]);
  });

  await t.test('8. webhook rejects missing, invalid and wrong-mode signatures without reconciliation', async () => {
    const missing = createStripeTestDependencies();
    const missingResponse = await createStripeWebhookHandler(missing.dependencies)(
      new Request('http://localhost/webhook', { body: '{}', method: 'POST' })
    );
    assert.equal(missingResponse.status, 400);
    assert.equal(missing.calls.reconcile.length, 0);

    const invalid = createStripeTestDependencies({
      stripe: { constructEvent: async () => { throw new Error('bad signature'); } }
    });
    const invalidResponse = await createStripeWebhookHandler(invalid.dependencies)(
      new Request('http://localhost/webhook', {
        body: '{}',
        headers: { 'Stripe-Signature': fixture.signature },
        method: 'POST'
      })
    );
    assert.equal(invalidResponse.status, 400);
    assert.equal(invalid.calls.reconcile.length, 0);

    const wrongMode = createStripeTestDependencies({
      stripe: { constructEvent: async () => ({ ...fixture.event, livemode: true }) }
    });
    const wrongModeResponse = await createStripeWebhookHandler(wrongMode.dependencies)(
      new Request('http://localhost/webhook', {
        body: '{}',
        headers: { 'Stripe-Signature': fixture.signature },
        method: 'POST'
      })
    );
    assert.equal(wrongModeResponse.status, 400);
    assert.equal(wrongMode.calls.reconcile.length, 0);
  });

  await t.test('9. unsupported webhook events are acknowledged but cannot touch entitlement reconciliation', async () => {
    const { calls, dependencies } = createStripeTestDependencies({
      stripe: {
        constructEvent: async () => ({ id: 'evt_testIgnored001', livemode: false, type: 'customer.created' })
      }
    });
    const response = await createStripeWebhookHandler(dependencies)(
      new Request('http://localhost/webhook', {
        body: '{}',
        headers: { 'Stripe-Signature': fixture.signature },
        method: 'POST'
      })
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await responseJson(response), { received: true, ignored: true });
    assert.equal(calls.resolve.length, 0);
    assert.equal(calls.reconcile.length, 0);
  });

  await t.test('10. duplicate and partial-refund fixtures use only the idempotent reconciliation contract', async () => {
    const duplicate = createStripeTestDependencies({
      reconcileEntitlement: async state => {
        duplicate.calls.reconcile.push(state);
        return { duplicate: true, processed: false, stale: false };
      }
    });
    const duplicateResponse = await createStripeWebhookHandler(duplicate.dependencies)(
      new Request('http://localhost/webhook', {
        body: '{}',
        headers: { 'Stripe-Signature': fixture.signature },
        method: 'POST'
      })
    );
    assert.deepEqual(await responseJson(duplicateResponse), { received: true, duplicate: true, stale: false });

    const partialRefundEvent = { id: 'evt_testPartialRefund001', livemode: false, type: 'charge.refunded' };
    const partial = createStripeTestDependencies({
      resolveAuthoritativeState: async () => createAuthoritativeStripeState({
        accessAction: 'no_change',
        eventType: partialRefundEvent.type,
        reasonCode: 'partial_refund_manual_review',
        stripeEventId: partialRefundEvent.id
      }),
      stripe: { constructEvent: async () => partialRefundEvent }
    });
    const partialResponse = await createStripeWebhookHandler(partial.dependencies)(
      new Request('http://localhost/webhook', {
        body: '{}',
        headers: { 'Stripe-Signature': fixture.signature },
        method: 'POST'
      })
    );
    assert.equal(partialResponse.status, 200);
    assert.equal(partial.calls.reconcile[0].accessAction, 'no_change');
  });

  await t.test('11. function source contains no secrets, wildcard CORS, direct table writes or entitlement mutation', () => {
    assert.doesNotMatch(sharedSources + entrySources, /sk_(?:test|live)_[A-Za-z0-9]{12,}|whsec_[A-Za-z0-9]{12,}|SUPABASE_SERVICE_ROLE_KEY\s*=/);
    assert.doesNotMatch(sharedSources, /Access-Control-Allow-Origin['"]?\s*:\s*['"]\*['"]/);
    assert.doesNotMatch(sharedSources + entrySources, /\.from\(['"]payment_|\.from\(['"]exam_entitlements/);
    assert.doesNotMatch(sharedSources + entrySources, /insert\([^)]*exam_entitlements|update\([^)]*exam_entitlements/i);
    assert.match(sharedSources, /reconcileEntitlement/);
    assert.match(sharedSources, /constructEvent\(rawBody, signature\)/);
  });
});
