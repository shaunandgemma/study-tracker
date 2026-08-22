import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DISPOSABLE_SIMULATION_CATALOGUE as catalogue,
  DISPOSABLE_SIMULATION_EXECUTION_ENABLED,
  createDisposableSimulationHelper,
  validateDisposableSimulationInput
} from '../scripts/payments/disposableStripeSimulationHelper.mjs';

const learnerId = '3973f1f2-0351-4c61-a82f-a740fa4608c9';
const temporaryRestrictedKey = 'rk_test_disposable_fixture';

function mockStripe() {
  const calls = [];
  const stripe = {
    customers: {
      create: async input => {
        calls.push(['customers.create', input]);
        return { id: 'cus_Disposable008x', livemode: false, test_clock: input.test_clock };
      },
      update: async (id, input) => {
        calls.push(['customers.update', id, input]);
        return { id, livemode: false };
      }
    },
    paymentMethods: {
      attach: async (id, input) => {
        calls.push(['paymentMethods.attach', id, input]);
        return {
          id: id === catalogue.initialPaymentMethod ? 'pm_DisposableSuccess' : 'pm_DisposableFailure',
          livemode: false
        };
      }
    },
    subscriptions: {
      create: async input => {
        calls.push(['subscriptions.create', input]);
        return {
          customer: input.customer,
          id: 'sub_Disposable008x',
          items: { data: [{
            price: { id: catalogue.priceId, product: { id: catalogue.productId } },
            quantity: 1
          }] },
          livemode: false,
          metadata: input.metadata
        };
      },
      update: async (id, input) => {
        calls.push(['subscriptions.update', id, input]);
        return { id, livemode: false };
      }
    },
    testClocks: {
      create: async input => {
        calls.push(['testClocks.create', input]);
        return { id: 'clock_Disposable008x', livemode: false };
      }
    }
  };
  return { calls, stripe };
}

test('Step 008Y disposable Stripe simulation helper', async t => {
  await t.test('remains runtime-disabled by default', async () => {
    const { calls, stripe } = mockStripe();
    assert.equal(DISPOSABLE_SIMULATION_EXECUTION_ENABLED, false);
    const helper = createDisposableSimulationHelper({ stripe });
    await assert.rejects(helper.prepareSuccessfulRenewal({
      frozenTime: 1787371200,
      learnerId,
      temporaryRestrictedKey
    }), /runtime execution is disabled/i);
    assert.equal(calls.length, 0);
  });

  await t.test('rejects live, unrestricted and preserved identities before Stripe calls', async () => {
    assert.throws(() => validateDisposableSimulationInput({
      learnerId,
      temporaryRestrictedKey: 'sk_test_unrestricted'
    }), /restricted key/i);
    assert.throws(() => validateDisposableSimulationInput({
      learnerId,
      temporaryRestrictedKey: 'rk_live_forbidden'
    }), /restricted key/i);
    assert.throws(() => validateDisposableSimulationInput({
      learnerId: 'df06f24d-3620-4889-ae2a-6883d87d29a2',
      temporaryRestrictedKey
    }), /preserved paid learner/i);
  });

  await t.test('prepares one exact atomic AWS subscription using only mock calls', async () => {
    const { calls, stripe } = mockStripe();
    const helper = createDisposableSimulationHelper({ executionEnabled: true, stripe });
    const result = await helper.prepareSuccessfulRenewal({
      frozenTime: 1787371200,
      learnerId,
      temporaryRestrictedKey
    });

    assert.deepEqual(calls.map(call => call[0]), [
      'testClocks.create',
      'customers.create',
      'paymentMethods.attach',
      'customers.update',
      'subscriptions.create'
    ]);
    assert.deepEqual(calls[0][1], { frozen_time: 1787371200, name: catalogue.clockName });
    assert.deepEqual(calls[1][1], {
      metadata: { latt_test_scenario: catalogue.scenario, latt_user_id: learnerId },
      test_clock: 'clock_Disposable008x'
    });
    const subscriptionInput = calls[4][1];
    assert.deepEqual(subscriptionInput.items, [{ price: catalogue.priceId, quantity: 1 }]);
    assert.deepEqual(subscriptionInput.metadata, {
      latt_exam_id: 'aws-saa-c03',
      latt_user_id: learnerId
    });
    assert.equal(result.subscriptionId, 'sub_Disposable008x');
    assert.equal(JSON.stringify(result).includes('rk_test_'), false);
    assert.equal(JSON.stringify(calls).includes(temporaryRestrictedKey), false);
  });

  await t.test('prepares the attachable failure method for only the disposable subscription', async () => {
    const { calls, stripe } = mockStripe();
    const helper = createDisposableSimulationHelper({ executionEnabled: true, stripe });
    const result = await helper.prepareFailedRenewal({
      customerId: 'cus_Disposable008x',
      subscriptionId: 'sub_Disposable008x',
      temporaryRestrictedKey
    });
    assert.deepEqual(calls, [
      ['paymentMethods.attach', catalogue.failurePaymentMethod, { customer: 'cus_Disposable008x' }],
      ['subscriptions.update', 'sub_Disposable008x', {
        default_payment_method: 'pm_DisposableFailure'
      }]
    ]);
    assert.equal(result.paymentMethodId, 'pm_DisposableFailure');
    assert.equal(JSON.stringify(calls).includes(temporaryRestrictedKey), false);
  });

  await t.test('fails closed on wrong catalogue output or a preserved Stripe ID', async () => {
    const first = mockStripe();
    first.stripe.subscriptions.create = async input => ({
      customer: input.customer,
      id: 'sub_Disposable008x',
      items: { data: [{ price: { id: 'price_Wrong', product: { id: catalogue.productId } }, quantity: 1 }] },
      livemode: false,
      metadata: input.metadata
    });
    await assert.rejects(createDisposableSimulationHelper({
      executionEnabled: true,
      stripe: first.stripe
    }).prepareSuccessfulRenewal({ frozenTime: 1787371200, learnerId, temporaryRestrictedKey }), /catalogue/i);

    const second = mockStripe();
    second.stripe.customers.create = async input => ({
      id: 'cus_V76jo6wpeXM5Y9', livemode: false, test_clock: input.test_clock
    });
    await assert.rejects(createDisposableSimulationHelper({
      executionEnabled: true,
      stripe: second.stripe
    }).prepareSuccessfulRenewal({ frozenTime: 1787371200, learnerId, temporaryRestrictedKey }), /preserved control ID/i);
  });
});
