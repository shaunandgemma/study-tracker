import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  FRESH_OUT_OF_ORDER_CLOCK_NAME,
  FRESH_OUT_OF_ORDER_CONFIRMATION,
  FRESH_OUT_OF_ORDER_CONFIRM_ENV,
  FRESH_OUT_OF_ORDER_KEY_ENV,
  FRESH_OUT_OF_ORDER_LEARNER_ID,
  FRESH_OUT_OF_ORDER_RUNNER_ENABLED,
  FRESH_OUT_OF_ORDER_SCENARIO,
  runFreshOutOfOrderSimulation
} from '../scripts/payments/runFreshOutOfOrderSimulation.mjs';

const temporaryKey = 'rk_test_fresh_out_of_order_fixture';

function mockAdapterFactory({ calls }) {
  return () => ({
    customers: {
      create: async input => {
        calls.push(['customers.create', input]);
        return { id: 'cus_Fresh009h', livemode: false, test_clock: input.test_clock };
      },
      update: async (id, input) => {
        calls.push(['customers.update', id, input]);
        return { id, livemode: false };
      }
    },
    paymentMethods: {
      attach: async (id, input) => {
        calls.push(['paymentMethods.attach', id, input]);
        return { id: 'pm_Fresh009h', livemode: false };
      }
    },
    subscriptions: {
      create: async input => {
        calls.push(['subscriptions.create', input]);
        return {
          customer: input.customer,
          id: 'sub_Fresh009h',
          items: { data: [{
            price: {
              id: 'price_1U6p6S3Ne8JYQdqLX9pxvu22',
              product: { id: 'prod_V73CMqyLhOZvIe' }
            },
            quantity: 1
          }] },
          livemode: false,
          metadata: input.metadata
        };
      },
      update: async () => { throw new Error('unexpected subscription update'); }
    },
    testClocks: {
      create: async input => {
        calls.push(['testClocks.create', input]);
        return { id: 'clock_Fresh009h', livemode: false };
      }
    }
  });
}

test('fresh Step 009H out-of-order simulation runner', async t => {
  await t.test('is disabled by default and clears the temporary process values', async () => {
    const environment = {
      [FRESH_OUT_OF_ORDER_CONFIRM_ENV]: FRESH_OUT_OF_ORDER_CONFIRMATION,
      [FRESH_OUT_OF_ORDER_KEY_ENV]: temporaryKey
    };
    let adapterCalls = 0;
    await assert.rejects(runFreshOutOfOrderSimulation({
      adapterFactory: () => { adapterCalls += 1; return {}; },
      environment
    }), /disabled/i);
    assert.equal(FRESH_OUT_OF_ORDER_RUNNER_ENABLED, false);
    assert.equal(adapterCalls, 0);
    assert.deepEqual(environment, {});
  });

  await t.test('creates only one fresh exact AWS simulation for the new learner', async () => {
    const calls = [];
    const environment = {
      [FRESH_OUT_OF_ORDER_CONFIRM_ENV]: FRESH_OUT_OF_ORDER_CONFIRMATION,
      [FRESH_OUT_OF_ORDER_KEY_ENV]: temporaryKey
    };
    const result = await runFreshOutOfOrderSimulation({
      adapterFactory: mockAdapterFactory({ calls }),
      environment,
      executionEnabled: true,
      frozenTime: 1787587200
    });

    assert.deepEqual(calls.map(call => call[0]), [
      'testClocks.create',
      'customers.create',
      'paymentMethods.attach',
      'customers.update',
      'subscriptions.create'
    ]);
    assert.deepEqual(calls[0][1], {
      frozen_time: 1787587200,
      name: FRESH_OUT_OF_ORDER_CLOCK_NAME
    });
    assert.deepEqual(calls[1][1].metadata, {
      latt_test_scenario: FRESH_OUT_OF_ORDER_SCENARIO,
      latt_user_id: FRESH_OUT_OF_ORDER_LEARNER_ID
    });
    assert.deepEqual(calls[4][1].metadata, {
      latt_exam_id: 'aws-saa-c03',
      latt_user_id: FRESH_OUT_OF_ORDER_LEARNER_ID
    });
    assert.equal(result.learnerId, FRESH_OUT_OF_ORDER_LEARNER_ID);
    assert.deepEqual(environment, {});
  });

  await t.test('PowerShell keeps the key hidden and remains runtime-disabled', () => {
    const source = readFileSync('scripts/payments/startFreshOutOfOrderSimulation.ps1', 'utf8');
    assert.match(source, /Read-Host[^\r\n]+-AsSecureString/);
    assert.match(source, /ZeroFreeBSTR/);
    assert.match(source, /runtime-disabled and cannot create Stripe objects/);
    assert.match(source, new RegExp(FRESH_OUT_OF_ORDER_LEARNER_ID));
    assert.doesNotMatch(source, /rk_test_[A-Za-z0-9]{12,}/);
  });
});
