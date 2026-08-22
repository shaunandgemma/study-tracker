import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  DISPOSABLE_FAILED_RENEWAL_CONFIRMATION,
  DISPOSABLE_FAILED_RENEWAL_CONFIRM_ENV,
  DISPOSABLE_FAILED_RENEWAL_CUSTOMER_ID,
  DISPOSABLE_FAILED_RENEWAL_KEY_ENV,
  DISPOSABLE_FAILED_RENEWAL_RUNNER_ENABLED,
  DISPOSABLE_FAILED_RENEWAL_SUBSCRIPTION_ID,
  runDisposableFailedRenewalPreparation
} from '../scripts/payments/runDisposableFailedRenewalPreparation.mjs';
import { createDisposableStripeApi } from '../scripts/payments/stripeDisposableSimulationApi.mjs';

const temporaryKey = 'rk_test_temporary_failed_renewal_fixture';

function jsonResponse(value) {
  return { json: async () => value, ok: true, status: 200 };
}

test('Step 009D disposable Stripe failed-renewal runner', async t => {
  await t.test('real execution is disabled and secrets clear before any adapter call', async () => {
    const environment = {
      [DISPOSABLE_FAILED_RENEWAL_CONFIRM_ENV]: DISPOSABLE_FAILED_RENEWAL_CONFIRMATION,
      [DISPOSABLE_FAILED_RENEWAL_KEY_ENV]: temporaryKey
    };
    let adapterCalls = 0;

    await assert.rejects(runDisposableFailedRenewalPreparation({
      adapterFactory: () => { adapterCalls += 1; return {}; },
      environment
    }), /real execution remains disabled/i);

    assert.equal(DISPOSABLE_FAILED_RENEWAL_RUNNER_ENABLED, false);
    assert.equal(adapterCalls, 0);
    assert.deepEqual(environment, {});
  });

  await t.test('requires the exact confirmation and always clears the temporary key', async () => {
    const environment = {
      [DISPOSABLE_FAILED_RENEWAL_CONFIRM_ENV]: 'wrong',
      [DISPOSABLE_FAILED_RENEWAL_KEY_ENV]: temporaryKey
    };

    await assert.rejects(runDisposableFailedRenewalPreparation({
      environment,
      executionEnabled: true
    }), /confirmation token/i);

    assert.deepEqual(environment, {});
  });

  await t.test('attaches only the failure method and updates only the disposable Subscription', async () => {
    const requests = [];
    const responses = [
      {
        customer: DISPOSABLE_FAILED_RENEWAL_CUSTOMER_ID,
        id: 'pm_FailedRenewal009d',
        livemode: false
      },
      {
        id: DISPOSABLE_FAILED_RENEWAL_SUBSCRIPTION_ID,
        livemode: false
      }
    ];
    const fetchImpl = async (url, init) => {
      requests.push({
        authorization: init.headers.Authorization,
        body: init.body.toString(),
        method: init.method,
        url
      });
      return jsonResponse(responses.shift());
    };
    const environment = {
      [DISPOSABLE_FAILED_RENEWAL_CONFIRM_ENV]: DISPOSABLE_FAILED_RENEWAL_CONFIRMATION,
      [DISPOSABLE_FAILED_RENEWAL_KEY_ENV]: temporaryKey
    };

    const result = await runDisposableFailedRenewalPreparation({
      adapterFactory: options => createDisposableStripeApi({ ...options, fetchImpl }),
      environment,
      executionEnabled: true
    });

    assert.deepEqual(requests.map(request => request.url), [
      'https://api.stripe.com/v1/payment_methods/pm_card_chargeCustomerFail/attach',
      `https://api.stripe.com/v1/subscriptions/${DISPOSABLE_FAILED_RENEWAL_SUBSCRIPTION_ID}`
    ]);
    assert.deepEqual(requests.map(request => request.method), ['POST', 'POST']);
    assert.ok(requests.every(request => request.authorization === `Bearer ${temporaryKey}`));
    assert.ok(requests.every(request => !request.url.includes(temporaryKey)));
    assert.ok(requests.every(request => !request.body.includes(temporaryKey)));
    assert.equal(requests[0].body, `customer=${DISPOSABLE_FAILED_RENEWAL_CUSTOMER_ID}`);
    assert.equal(requests[1].body, 'default_payment_method=pm_FailedRenewal009d');
    assert.deepEqual(result, {
      customerId: DISPOSABLE_FAILED_RENEWAL_CUSTOMER_ID,
      paymentMethodId: 'pm_FailedRenewal009d',
      subscriptionId: DISPOSABLE_FAILED_RENEWAL_SUBSCRIPTION_ID
    });
    assert.deepEqual(environment, {});
  });

  await t.test('rejects live responses and preserved Subscription output', async () => {
    const makeEnvironment = () => ({
      [DISPOSABLE_FAILED_RENEWAL_CONFIRM_ENV]: DISPOSABLE_FAILED_RENEWAL_CONFIRMATION,
      [DISPOSABLE_FAILED_RENEWAL_KEY_ENV]: temporaryKey
    });

    await assert.rejects(runDisposableFailedRenewalPreparation({
      adapterFactory: () => ({
        customers: { create() {}, update() {} },
        paymentMethods: {
          attach: async () => ({ id: 'pm_LiveFailure', livemode: true })
        },
        subscriptions: { create() {}, update() {} },
        testClocks: { create() {} }
      }),
      environment: makeEnvironment(),
      executionEnabled: true
    }), /not explicitly a sandbox object/i);

    await assert.rejects(runDisposableFailedRenewalPreparation({
      adapterFactory: () => ({
        customers: { create() {}, update() {} },
        paymentMethods: {
          attach: async () => ({ id: 'pm_FailedRenewal009d', livemode: false })
        },
        subscriptions: {
          create() {},
          update: async () => ({ id: 'sub_1U6ser3Ne8JYQdqLp5IpnM4x', livemode: false })
        },
        testClocks: { create() {} }
      }),
      environment: makeEnvironment(),
      executionEnabled: true
    }), /preserved control ID/i);
  });

  await t.test('rejects live and unrestricted key shapes before any request', async () => {
    for (const key of ['rk_live_forbidden', 'sk_test_unrestricted']) {
      let fetchCalls = 0;
      const environment = {
        [DISPOSABLE_FAILED_RENEWAL_CONFIRM_ENV]: DISPOSABLE_FAILED_RENEWAL_CONFIRMATION,
        [DISPOSABLE_FAILED_RENEWAL_KEY_ENV]: key
      };

      await assert.rejects(runDisposableFailedRenewalPreparation({
        adapterFactory: options => createDisposableStripeApi({
          ...options,
          fetchImpl: async () => { fetchCalls += 1; return jsonResponse({}); }
        }),
        environment,
        executionEnabled: true
      }), /restricted key/i);

      assert.equal(fetchCalls, 0);
      assert.deepEqual(environment, {});
    }
  });

  await t.test('PowerShell launcher uses a hidden one-use key and exact locked IDs', () => {
    const source = readFileSync(
      'scripts/payments/startDisposableFailedRenewalPreparation.ps1',
      'utf8'
    );

    assert.match(source, /Read-Host[^\r\n]+-AsSecureString/);
    assert.match(source, /SecureStringToBSTR/);
    assert.match(source, /ZeroFreeBSTR/);
    assert.match(source, /SetEnvironmentVariable\(\$keyEnvironmentName, \$null, 'Process'\)/);
    assert.match(source, /PREPARE DISPOSABLE FAILED RENEWAL/);
    assert.match(source, /cus_V7aJjrJFCVjm5I/);
    assert.match(source, /sub_1U7LH93Ne8JYQdqLKUFDoY7s/);
    assert.match(source, /pm_card_chargeCustomerFail/);
    assert.match(source, /runtime-disabled and cannot change Stripe objects/);
    assert.doesNotMatch(source, /rk_test_[A-Za-z0-9]{12,}/);
  });
});
