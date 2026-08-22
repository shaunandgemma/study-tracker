import { pathToFileURL } from 'node:url';

import {
  createDisposableSimulationHelper
} from './disposableStripeSimulationHelper.mjs';
import { createDisposableStripeApi } from './stripeDisposableSimulationApi.mjs';

export const DISPOSABLE_FAILED_RENEWAL_RUNNER_ENABLED = false;
export const DISPOSABLE_FAILED_RENEWAL_CONFIRMATION = 'PREPARE DISPOSABLE FAILED RENEWAL';
export const DISPOSABLE_FAILED_RENEWAL_CUSTOMER_ID = 'cus_V7aJjrJFCVjm5I';
export const DISPOSABLE_FAILED_RENEWAL_SUBSCRIPTION_ID = 'sub_1U7LH93Ne8JYQdqLKUFDoY7s';
export const DISPOSABLE_FAILED_RENEWAL_KEY_ENV = 'LATT_DISPOSABLE_STRIPE_FAILURE_KEY';
export const DISPOSABLE_FAILED_RENEWAL_CONFIRM_ENV = 'LATT_DISPOSABLE_STRIPE_FAILURE_CONFIRMATION';

function stopped(message) {
  throw new Error(`Disposable failed-renewal runner stopped safely: ${message}`);
}

export async function runDisposableFailedRenewalPreparation({
  adapterFactory = createDisposableStripeApi,
  environment = process.env,
  executionEnabled = DISPOSABLE_FAILED_RENEWAL_RUNNER_ENABLED
} = {}) {
  const temporaryRestrictedKey = environment[DISPOSABLE_FAILED_RENEWAL_KEY_ENV];
  try {
    if (executionEnabled !== true) stopped('real execution remains disabled in Step 009D.');
    if (environment[DISPOSABLE_FAILED_RENEWAL_CONFIRM_ENV]
        !== DISPOSABLE_FAILED_RENEWAL_CONFIRMATION) {
      stopped('the exact one-run confirmation token is missing.');
    }

    const stripe = adapterFactory({ temporaryRestrictedKey });
    const helper = createDisposableSimulationHelper({ executionEnabled: true, stripe });
    return await helper.prepareFailedRenewal({
      customerId: DISPOSABLE_FAILED_RENEWAL_CUSTOMER_ID,
      subscriptionId: DISPOSABLE_FAILED_RENEWAL_SUBSCRIPTION_ID,
      temporaryRestrictedKey
    });
  } finally {
    delete environment[DISPOSABLE_FAILED_RENEWAL_KEY_ENV];
    delete environment[DISPOSABLE_FAILED_RENEWAL_CONFIRM_ENV];
  }
}

async function main() {
  try {
    const result = await runDisposableFailedRenewalPreparation();
    console.log('Disposable failed-renewal method prepared.');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : 'Disposable failed-renewal runner stopped safely.'
    );
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
