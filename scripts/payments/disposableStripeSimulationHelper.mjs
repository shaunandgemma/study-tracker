const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STRIPE_ID_PATTERN = /^(clock|cus|pm|sub)_[A-Za-z0-9]+$/;

export const DISPOSABLE_SIMULATION_EXECUTION_ENABLED = false;

export const DISPOSABLE_SIMULATION_CATALOGUE = Object.freeze({
  clockName: 'latt-aws-renewal-008x',
  examId: 'aws-saa-c03',
  failurePaymentMethod: 'pm_card_chargeCustomerFail',
  initialPaymentMethod: 'pm_card_visa',
  priceId: 'price_1U6p6S3Ne8JYQdqLX9pxvu22',
  productId: 'prod_V73CMqyLhOZvIe',
  quantity: 1,
  scenario: 'step-008x-disposable-renewal'
});

export const PRESERVED_PAYMENT_IDS = Object.freeze(new Set([
  'df06f24d-3620-4889-ae2a-6883d87d29a2',
  'cus_V76jo6wpeXM5Y9',
  'sub_1U6ser3Ne8JYQdqLp5IpnM4x'
]));

function fail(message) {
  throw new Error(`Disposable Stripe simulation stopped safely: ${message}`);
}

function assertStripeId(value, prefix, label) {
  if (typeof value !== 'string' || !STRIPE_ID_PATTERN.test(value) || !value.startsWith(`${prefix}_`)) {
    fail(`${label} did not return a valid sandbox ${prefix} ID.`);
  }
  if (PRESERVED_PAYMENT_IDS.has(value)) fail(`${label} returned a preserved control ID.`);
  return value;
}

function assertSandboxObject(value, label) {
  if (!value || typeof value !== 'object' || value.livemode !== false) {
    fail(`${label} was not explicitly a sandbox object.`);
  }
  return value;
}

function assertTemporaryKey(value) {
  if (typeof value !== 'string' || !value.startsWith('rk_test_') || value.length < 16) {
    fail('a temporary Stripe sandbox restricted key is required.');
  }
  return true;
}

function assertLearnerId(value) {
  if (!UUID_PATTERN.test(value || '')) fail('the disposable Supabase learner UUID is invalid.');
  if (PRESERVED_PAYMENT_IDS.has(value)) fail('the preserved paid learner cannot be used.');
  return value;
}

function requireMethod(object, path) {
  const method = path.split('.').reduce((value, key) => value?.[key], object);
  if (typeof method !== 'function') fail(`the Stripe adapter is missing ${path}.`);
  return method.bind(path.split('.').slice(0, -1).reduce((value, key) => value[key], object));
}

export function validateDisposableSimulationInput({ learnerId, temporaryRestrictedKey }) {
  assertTemporaryKey(temporaryRestrictedKey);
  return Object.freeze({ learnerId: assertLearnerId(learnerId) });
}

export function createDisposableSimulationHelper({
  stripe,
  executionEnabled = DISPOSABLE_SIMULATION_EXECUTION_ENABLED
} = {}) {
  if (!stripe || typeof stripe !== 'object') fail('a Stripe adapter is required.');

  const createClock = requireMethod(stripe, 'testClocks.create');
  const createCustomer = requireMethod(stripe, 'customers.create');
  const updateCustomer = requireMethod(stripe, 'customers.update');
  const attachPaymentMethod = requireMethod(stripe, 'paymentMethods.attach');
  const createSubscription = requireMethod(stripe, 'subscriptions.create');
  const updateSubscription = requireMethod(stripe, 'subscriptions.update');

  function requireExecutionApproval() {
    if (executionEnabled !== true) {
      fail('runtime execution is disabled; this helper is available only to injected mock tests.');
    }
  }

  return Object.freeze({
    async prepareFailedRenewal({ customerId, subscriptionId, temporaryRestrictedKey }) {
      requireExecutionApproval();
      assertTemporaryKey(temporaryRestrictedKey);
      assertStripeId(customerId, 'cus', 'Customer input');
      assertStripeId(subscriptionId, 'sub', 'Subscription input');

      const attached = assertSandboxObject(
        await attachPaymentMethod(DISPOSABLE_SIMULATION_CATALOGUE.failurePaymentMethod, {
          customer: customerId
        }),
        'Failure PaymentMethod'
      );
      const paymentMethodId = assertStripeId(attached.id, 'pm', 'Failure PaymentMethod');
      const subscription = assertSandboxObject(
        await updateSubscription(subscriptionId, { default_payment_method: paymentMethodId }),
        'Updated Subscription'
      );
      assertStripeId(subscription.id, 'sub', 'Updated Subscription');
      if (subscription.id !== subscriptionId) fail('Stripe updated a different Subscription.');

      return Object.freeze({ customerId, paymentMethodId, subscriptionId });
    },

    async prepareSuccessfulRenewal({
      clockName = DISPOSABLE_SIMULATION_CATALOGUE.clockName,
      frozenTime,
      learnerId,
      scenario = DISPOSABLE_SIMULATION_CATALOGUE.scenario,
      temporaryRestrictedKey
    }) {
      requireExecutionApproval();
      const input = validateDisposableSimulationInput({ learnerId, temporaryRestrictedKey });
      if (!Number.isSafeInteger(frozenTime) || frozenTime <= 0) {
        fail('the test clock frozen time must be a positive Unix timestamp.');
      }
      if (typeof clockName !== 'string' || !/^latt-[a-z0-9-]+$/.test(clockName)) {
        fail('the test clock name is outside the approved LATT boundary.');
      }
      if (typeof scenario !== 'string' || !/^step-[a-z0-9-]+$/.test(scenario)) {
        fail('the test scenario is outside the approved LATT boundary.');
      }

      const clock = assertSandboxObject(await createClock({
        frozen_time: frozenTime,
        name: clockName
      }), 'Test Clock');
      const clockId = assertStripeId(clock.id, 'clock', 'Test Clock');

      const customer = assertSandboxObject(await createCustomer({
        metadata: {
          latt_test_scenario: scenario,
          latt_user_id: input.learnerId
        },
        test_clock: clockId
      }), 'Customer');
      const customerId = assertStripeId(customer.id, 'cus', 'Customer');
      if (customer.test_clock !== clockId) fail('the Customer was not attached to the new Test Clock.');

      const attached = assertSandboxObject(
        await attachPaymentMethod(DISPOSABLE_SIMULATION_CATALOGUE.initialPaymentMethod, {
          customer: customerId
        }),
        'Initial PaymentMethod'
      );
      const paymentMethodId = assertStripeId(attached.id, 'pm', 'Initial PaymentMethod');

      const updatedCustomer = assertSandboxObject(await updateCustomer(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId }
      }), 'Updated Customer');
      if (assertStripeId(updatedCustomer.id, 'cus', 'Updated Customer') !== customerId) {
        fail('Stripe updated a different Customer.');
      }

      const metadata = {
        latt_exam_id: DISPOSABLE_SIMULATION_CATALOGUE.examId,
        latt_user_id: input.learnerId
      };
      const subscription = assertSandboxObject(await createSubscription({
        customer: customerId,
        default_payment_method: paymentMethodId,
        expand: [],
        items: [{
          price: DISPOSABLE_SIMULATION_CATALOGUE.priceId,
          quantity: DISPOSABLE_SIMULATION_CATALOGUE.quantity
        }],
        metadata
      }), 'Subscription');
      const subscriptionId = assertStripeId(subscription.id, 'sub', 'Subscription');
      if (subscription.customer !== customerId) fail('the Subscription Customer does not match.');
      if (subscription.metadata?.latt_exam_id !== metadata.latt_exam_id
          || subscription.metadata?.latt_user_id !== metadata.latt_user_id) {
        fail('the Subscription metadata was not preserved atomically.');
      }
      const items = subscription.items?.data;
      if (!Array.isArray(items) || items.length !== 1
          || items[0]?.price?.id !== DISPOSABLE_SIMULATION_CATALOGUE.priceId
          || (typeof items[0]?.price?.product === 'string'
            ? items[0].price.product
            : items[0]?.price?.product?.id) !== DISPOSABLE_SIMULATION_CATALOGUE.productId
          || items[0]?.quantity !== DISPOSABLE_SIMULATION_CATALOGUE.quantity) {
        fail('the Subscription does not match the exact protected AWS catalogue item.');
      }

      return Object.freeze({
        clockId,
        customerId,
        learnerId: input.learnerId,
        paymentMethodId,
        subscriptionId
      });
    },

    async resumeSuccessfulRenewal({ customerId, learnerId, paymentMethodId, temporaryRestrictedKey }) {
      requireExecutionApproval();
      const input = validateDisposableSimulationInput({ learnerId, temporaryRestrictedKey });
      assertStripeId(customerId, 'cus', 'Customer input');
      assertStripeId(paymentMethodId, 'pm', 'PaymentMethod input');

      const metadata = {
        latt_exam_id: DISPOSABLE_SIMULATION_CATALOGUE.examId,
        latt_user_id: input.learnerId
      };
      const subscription = assertSandboxObject(await createSubscription({
        customer: customerId,
        default_payment_method: paymentMethodId,
        expand: [],
        items: [{
          price: DISPOSABLE_SIMULATION_CATALOGUE.priceId,
          quantity: DISPOSABLE_SIMULATION_CATALOGUE.quantity
        }],
        metadata
      }), 'Subscription');
      const subscriptionId = assertStripeId(subscription.id, 'sub', 'Subscription');
      if (subscription.customer !== customerId) fail('the Subscription Customer does not match.');
      if (subscription.metadata?.latt_exam_id !== metadata.latt_exam_id
          || subscription.metadata?.latt_user_id !== metadata.latt_user_id) {
        fail('the Subscription metadata was not preserved atomically.');
      }
      const items = subscription.items?.data;
      if (!Array.isArray(items) || items.length !== 1
          || items[0]?.price?.id !== DISPOSABLE_SIMULATION_CATALOGUE.priceId
          || (typeof items[0]?.price?.product === 'string'
            ? items[0].price.product
            : items[0]?.price?.product?.id) !== DISPOSABLE_SIMULATION_CATALOGUE.productId
          || items[0]?.quantity !== DISPOSABLE_SIMULATION_CATALOGUE.quantity) {
        fail('the Subscription does not match the exact protected AWS catalogue item.');
      }

      return Object.freeze({
        customerId,
        learnerId: input.learnerId,
        paymentMethodId,
        subscriptionId
      });
    }
  });
}
