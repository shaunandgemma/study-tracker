import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  DISPOSABLE_SIMULATION_CONFIRMATION,
  DISPOSABLE_SIMULATION_CONFIRM_ENV,
  DISPOSABLE_SIMULATION_KEY_ENV,
  DISPOSABLE_SIMULATION_LEARNER_ID,
  DISPOSABLE_SIMULATION_RUNNER_ENABLED,
  runDisposableStripeSimulation
} from '../scripts/payments/runDisposableStripeSimulation.mjs';
import { createDisposableStripeApi } from '../scripts/payments/stripeDisposableSimulationApi.mjs';

const temporaryKey = 'rk_test_temporary_runner_fixture';

function jsonResponse(value) {
  return { json: async () => value, ok: true, status: 200 };
}

test('Step 009A disposable Stripe simulation runner and API adapter', async t => {
  await t.test('real execution is disabled and secrets are cleared before any adapter call', async () => {
    const environment = {
      [DISPOSABLE_SIMULATION_CONFIRM_ENV]: DISPOSABLE_SIMULATION_CONFIRMATION,
      [DISPOSABLE_SIMULATION_KEY_ENV]: temporaryKey
    };
    let adapterCalls = 0;
    await assert.rejects(runDisposableStripeSimulation({
      adapterFactory: () => { adapterCalls += 1; return {}; },
      environment
    }), /real execution remains disabled/i);
    assert.equal(DISPOSABLE_SIMULATION_RUNNER_ENABLED, false);
    assert.equal(adapterCalls, 0);
    assert.equal(environment[DISPOSABLE_SIMULATION_KEY_ENV], undefined);
    assert.equal(environment[DISPOSABLE_SIMULATION_CONFIRM_ENV], undefined);
  });

  await t.test('requires the exact one-run confirmation and always clears the key', async () => {
    const environment = {
      [DISPOSABLE_SIMULATION_CONFIRM_ENV]: 'wrong',
      [DISPOSABLE_SIMULATION_KEY_ENV]: temporaryKey
    };
    await assert.rejects(runDisposableStripeSimulation({
      environment,
      executionEnabled: true
    }), /confirmation token/i);
    assert.deepEqual(environment, {});
  });

  await t.test('resumes from the approved partial objects and creates only the Subscription', async () => {
    const requests = [];
    const responses = [
      {
        customer: 'cus_V7aJjrJFCVjm5I',
        id: 'sub_Runner009a',
        items: { data: [{
          price: {
            id: 'price_1U6p6S3Ne8JYQdqLX9pxvu22',
            product: { id: 'prod_V73CMqyLhOZvIe' }
          },
          quantity: 1
        }] },
        livemode: false,
        metadata: {
          latt_exam_id: 'aws-saa-c03',
          latt_user_id: DISPOSABLE_SIMULATION_LEARNER_ID
        }
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
      [DISPOSABLE_SIMULATION_CONFIRM_ENV]: DISPOSABLE_SIMULATION_CONFIRMATION,
      [DISPOSABLE_SIMULATION_KEY_ENV]: temporaryKey
    };
    const result = await runDisposableStripeSimulation({
      adapterFactory: options => createDisposableStripeApi({ ...options, fetchImpl }),
      environment,
      executionEnabled: true,
      frozenTime: 1787371200
    });
    assert.deepEqual(requests.map(request => request.url), [
      'https://api.stripe.com/v1/subscriptions'
    ]);
    assert.ok(requests.every(request => request.method === 'POST'));
    assert.ok(requests.every(request => request.authorization === `Bearer ${temporaryKey}`));
    assert.ok(requests.every(request => !request.url.includes(temporaryKey)));
    assert.ok(requests.every(request => !request.body.includes(temporaryKey)));
    assert.match(requests[0].body, /items%5B0%5D%5Bprice%5D=price_1U6p6S3Ne8JYQdqLX9pxvu22/);
    assert.match(requests[0].body, /metadata%5Blatt_user_id%5D=8bf0e3bc-bed7-43bf-a4db-e8f788c19852/);
    assert.match(requests[0].body, /metadata%5Blatt_exam_id%5D=aws-saa-c03/);
    assert.doesNotMatch(requests[0].body, /expand%5B/);
    assert.equal(result.learnerId, DISPOSABLE_SIMULATION_LEARNER_ID);
    assert.deepEqual(environment, {});
  });

  await t.test('rejects live and unrestricted keys without calling fetch', () => {
    let calls = 0;
    const fetchImpl = async () => { calls += 1; return jsonResponse({}); };
    assert.throws(() => createDisposableStripeApi({
      fetchImpl,
      temporaryRestrictedKey: 'sk_test_unrestricted'
    }), /restricted key/i);
    assert.throws(() => createDisposableStripeApi({
      fetchImpl,
      temporaryRestrictedKey: 'rk_live_forbidden'
    }), /restricted key/i);
    assert.equal(calls, 0);
  });

  await t.test('PowerShell prompts invisibly and clears sensitive process state', () => {
    const source = readFileSync('scripts/payments/startDisposableStripeSimulation.ps1', 'utf8');
    assert.match(source, /Read-Host[^\r\n]+-AsSecureString/);
    assert.match(source, /SecureStringToBSTR/);
    assert.match(source, /ZeroFreeBSTR/);
    assert.match(source, /SetEnvironmentVariable\(\$keyEnvironmentName, \$null, 'Process'\)/);
    assert.match(source, /CREATE DISPOSABLE STRIPE SIMULATION/);
    assert.match(source, /runtime-disabled and cannot create Stripe objects/);
    assert.doesNotMatch(source, /rk_test_[A-Za-z0-9]{12,}/);
  });
});
