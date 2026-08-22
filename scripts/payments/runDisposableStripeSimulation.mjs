import { pathToFileURL } from 'node:url';

import {
  createDisposableSimulationHelper
} from './disposableStripeSimulationHelper.mjs';
import { createDisposableStripeApi } from './stripeDisposableSimulationApi.mjs';

export const DISPOSABLE_SIMULATION_RUNNER_ENABLED = false;
export const DISPOSABLE_SIMULATION_CONFIRMATION = 'CREATE DISPOSABLE STRIPE SIMULATION';
export const DISPOSABLE_SIMULATION_LEARNER_ID = '8bf0e3bc-bed7-43bf-a4db-e8f788c19852';
export const DISPOSABLE_SIMULATION_CUSTOMER_ID = 'cus_V7aJjrJFCVjm5I';
export const DISPOSABLE_SIMULATION_PAYMENT_METHOD_ID = 'pm_1U7L8b3Ne8JYQdqLrtVtiNLN';
export const DISPOSABLE_SIMULATION_KEY_ENV = 'LATT_DISPOSABLE_STRIPE_SETUP_KEY';
export const DISPOSABLE_SIMULATION_CONFIRM_ENV = 'LATT_DISPOSABLE_STRIPE_CONFIRMATION';

function stopped(message) {
  throw new Error(`Disposable Stripe simulation runner stopped safely: ${message}`);
}

export async function runDisposableStripeSimulation({
  adapterFactory = createDisposableStripeApi,
  environment = process.env,
  executionEnabled = DISPOSABLE_SIMULATION_RUNNER_ENABLED
} = {}) {
  const temporaryRestrictedKey = environment[DISPOSABLE_SIMULATION_KEY_ENV];
  try {
    if (executionEnabled !== true) stopped('real execution remains disabled in Step 009A.');
    if (environment[DISPOSABLE_SIMULATION_CONFIRM_ENV] !== DISPOSABLE_SIMULATION_CONFIRMATION) {
      stopped('the exact one-run confirmation token is missing.');
    }
    const stripe = adapterFactory({ temporaryRestrictedKey });
    const helper = createDisposableSimulationHelper({ executionEnabled: true, stripe });
    return await helper.resumeSuccessfulRenewal({
      customerId: DISPOSABLE_SIMULATION_CUSTOMER_ID,
      learnerId: DISPOSABLE_SIMULATION_LEARNER_ID,
      paymentMethodId: DISPOSABLE_SIMULATION_PAYMENT_METHOD_ID,
      temporaryRestrictedKey
    });
  } finally {
    delete environment[DISPOSABLE_SIMULATION_KEY_ENV];
    delete environment[DISPOSABLE_SIMULATION_CONFIRM_ENV];
  }
}

async function main() {
  try {
    const result = await runDisposableStripeSimulation();
    console.log('Disposable sandbox simulation prepared.');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Disposable Stripe simulation stopped safely.');
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
