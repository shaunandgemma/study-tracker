import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  PAYMENT_RUNTIME_INVOCATION_ENABLED,
  createPaymentBrowserService,
  getPaymentRuntimeConfiguration,
  isCanonicalPaymentExamId,
  isLivePaymentRuntimeEnabled,
  isSandboxPaymentRuntimeEnabled,
  validateStripeHostedReturnUrl
} from '../src/features/payments/paymentBrowserService.js';
import { getExamPaymentControlPolicy } from '../src/features/payments/examPaymentControlPolicy.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

function clientDouble({ responseUrl = 'https://checkout.stripe.com/c/pay/test' } = {}) {
  const calls = [];
  return {
    calls,
    auth: {
      getSession: async () => ({
        data: { session: { access_token: 'test-token', user: { id: 'test-user' } } },
        error: null
      })
    },
    functions: {
      invoke: async (name, options) => {
        calls.push({ name, options });
        return { data: { url: responseUrl }, error: null };
      }
    }
  };
}

test('Step 008L local exact-exam payment controls', async t => {
  await t.test('runtime payment invocation is hard-disabled by default', async () => {
    assert.equal(PAYMENT_RUNTIME_INVOCATION_ENABLED, false);
    assert.equal(isSandboxPaymentRuntimeEnabled({}), false);
    assert.equal(isSandboxPaymentRuntimeEnabled({ VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED: 'false' }), false);
    assert.equal(isSandboxPaymentRuntimeEnabled({ VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED: 'TRUE' }), false);
    assert.equal(isSandboxPaymentRuntimeEnabled({ VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED: 'true' }), true);
    assert.equal(isLivePaymentRuntimeEnabled({ VITE_STRIPE_LIVE_PAYMENTS_ENABLED: 'true' }), true);
    assert.deepEqual(getPaymentRuntimeConfiguration({
      VITE_STRIPE_LIVE_PAYMENTS_ENABLED: 'true',
      VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED: 'true'
    }), { enabled: false, invalid: true, mode: null });
    const client = clientDouble();
    const service = createPaymentBrowserService({ supabaseClient: client });
    const result = await service.createExamCheckout({ examId: 'aws-saa-c03' });
    assert.equal(result.runtimeDisabled, true);
    assert.equal(client.calls.length, 0);
  });

  await t.test('only canonical exact exam IDs can reach the protected checkout contract', async () => {
    assert.equal(isCanonicalPaymentExamId('aws-saa-c03'), true);
    assert.equal(isCanonicalPaymentExamId('terraform-associate-004'), true);
    assert.equal(isCanonicalPaymentExamId('comptia-sec-plus'), true);
    assert.equal(isCanonicalPaymentExamId(' aws-saa-c03 '), false);
    assert.equal(isCanonicalPaymentExamId('made-up-exam'), false);

    const client = clientDouble();
    const service = createPaymentBrowserService({ supabaseClient: client, enabled: true });
    const result = await service.createExamCheckout({ examId: 'terraform-associate-004' });
    assert.equal(result.success, true);
    assert.deepEqual(client.calls, [{
      name: 'create-exam-checkout',
      options: { body: { examId: 'terraform-associate-004' } }
    }]);
  });

  await t.test('only exact Stripe-hosted HTTPS destinations are accepted', () => {
    assert.equal(validateStripeHostedReturnUrl('https://checkout.stripe.com/c/pay/test', 'checkout'), 'https://checkout.stripe.com/c/pay/test');
    assert.equal(validateStripeHostedReturnUrl('https://billing.stripe.com/p/session/test', 'portal'), 'https://billing.stripe.com/p/session/test');
    assert.equal(validateStripeHostedReturnUrl('http://checkout.stripe.com/c/pay/test', 'checkout'), null);
    assert.equal(validateStripeHostedReturnUrl('https://checkout.stripe.com.evil.example/test', 'checkout'), null);
    assert.equal(validateStripeHostedReturnUrl('https://billing.stripe.com@evil.example/test', 'portal'), null);
    assert.equal(validateStripeHostedReturnUrl('https://checkout.stripe.com:444/test', 'checkout'), null);
    assert.equal(validateStripeHostedReturnUrl('https://checkout.stripe.com/test', 'portal'), null);
  });

  await t.test('portal invocation uses the current session and sends no browser-selected customer data', async () => {
    const client = clientDouble({ responseUrl: 'https://billing.stripe.com/p/session/test' });
    const service = createPaymentBrowserService({ supabaseClient: client, enabled: true });
    const result = await service.createBillingPortalSession();
    assert.equal(result.success, true);
    assert.deepEqual(client.calls, [{
      name: 'create-stripe-portal-session',
      options: { body: {} }
    }]);
  });

  await t.test('the landing page displays the offer and preserves separate preview, paid and staff states', () => {
    const landing = read('src/components/Landing/ExamLandingPage.jsx');
    const appLanding = read('src/components/Landing/AppLandingPage.jsx');
    const controls = read('src/features/payments/ExamPaymentControls.jsx');
    assert.match(landing, /<ExamPaymentControls accessPolicy=\{accessPolicy\} examId=\{exam\.id\}/);
    assert.match(appLanding, /Annual exam access/);
    assert.match(appLanding, /canShowLandingPaymentControl/);
    assert.match(appLanding, /<ExamPaymentControls accessPolicy=\{accessPolicy\} examId=\{exam\.id\}/);
    assert.match(controls, /<del[^>]*>\{comparisonPrice\}<\/del>/);
    assert.match(controls, /\{currentPrice\}/);
    assert.match(controls, /access\.kind === 'staff'/);
    assert.match(controls, /access\.kind === 'paid'/);
    assert.match(controls, /access\.kind === 'demo'/);
    assert.match(controls, /disabled/);
    assert.doesNotMatch(controls, /functions\.invoke/);
  });

  await t.test('the control policy preserves Demo, exact-exam paid, different-exam and staff boundaries', () => {
    const demo = getExamPaymentControlPolicy({ accountType: 'demo' }, 'aws-saa-c03', true);
    assert.deepEqual({ kind: demo.kind, action: demo.action, enabled: demo.actionEnabled }, {
      kind: 'demo', action: null, enabled: false
    });

    const free = getExamPaymentControlPolicy({
      accountType: 'registered_free', activeExamIds: [], activeExamEntitlements: []
    }, 'aws-saa-c03', true);
    assert.deepEqual({ kind: free.kind, action: free.action, enabled: free.actionEnabled }, {
      kind: 'preview', action: 'checkout', enabled: true
    });

    const differentExam = getExamPaymentControlPolicy({
      accountType: 'paid_learner',
      activeExamIds: ['terraform-associate-004'],
      activeExamEntitlements: [{ examId: 'terraform-associate-004', expiresAt: '2027-01-01T00:00:00.000Z' }]
    }, 'aws-saa-c03', true);
    assert.equal(differentExam.kind, 'preview');
    assert.equal(differentExam.action, 'checkout');

    const paid = getExamPaymentControlPolicy({
      accountType: 'paid_learner',
      activeExamIds: ['aws-saa-c03'],
      activeExamEntitlements: [{ examId: 'aws-saa-c03', expiresAt: '2027-01-01T00:00:00.000Z' }]
    }, 'aws-saa-c03', true);
    assert.equal(paid.kind, 'paid');
    assert.equal(paid.action, 'portal');
    assert.equal(paid.actionEnabled, true);

    const staff = getExamPaymentControlPolicy({ hasAllExamAccess: true }, 'aws-saa-c03', true);
    assert.deepEqual({ kind: staff.kind, action: staff.action, enabled: staff.actionEnabled }, {
      kind: 'staff', action: null, enabled: false
    });
  });
});
