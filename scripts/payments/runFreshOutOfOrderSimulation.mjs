import { pathToFileURL } from 'node:url';

import { createDisposableSimulationHelper } from './disposableStripeSimulationHelper.mjs';
import { createDisposableStripeApi } from './stripeDisposableSimulationApi.mjs';

export const FRESH_OUT_OF_ORDER_RUNNER_ENABLED = false;
export const FRESH_OUT_OF_ORDER_CONFIRMATION = 'CREATE FRESH OUT OF ORDER SIMULATION';
export const FRESH_OUT_OF_ORDER_LEARNER_ID = 'a54a5e55-482f-4bd2-adc1-d58f2b4f235b';
export const FRESH_OUT_OF_ORDER_CLOCK_NAME = 'latt-aws-out-of-order-009h';
export const FRESH_OUT_OF_ORDER_SCENARIO = 'step-009h-fresh-out-of-order';
export const FRESH_OUT_OF_ORDER_KEY_ENV = 'LATT_FRESH_OUT_OF_ORDER_KEY';
export const FRESH_OUT_OF_ORDER_CONFIRM_ENV = 'LATT_FRESH_OUT_OF_ORDER_CONFIRMATION';

function stopped(message) {
  throw new Error(`Fresh out-of-order simulation stopped safely: ${message}`);
}

export async function runFreshOutOfOrderSimulation({
  adapterFactory = createDisposableStripeApi,
  environment = process.env,
  executionEnabled = FRESH_OUT_OF_ORDER_RUNNER_ENABLED,
  frozenTime = Math.floor(Date.now() / 1000)
} = {}) {
  const temporaryRestrictedKey = environment[FRESH_OUT_OF_ORDER_KEY_ENV];
  try {
    if (executionEnabled !== true) stopped('real execution remains disabled.');
    if (environment[FRESH_OUT_OF_ORDER_CONFIRM_ENV] !== FRESH_OUT_OF_ORDER_CONFIRMATION) {
      stopped('the exact one-run confirmation token is missing.');
    }

    const stripe = adapterFactory({ temporaryRestrictedKey });
    const helper = createDisposableSimulationHelper({ executionEnabled: true, stripe });
    return await helper.prepareSuccessfulRenewal({
      clockName: FRESH_OUT_OF_ORDER_CLOCK_NAME,
      frozenTime,
      learnerId: FRESH_OUT_OF_ORDER_LEARNER_ID,
      scenario: FRESH_OUT_OF_ORDER_SCENARIO,
      temporaryRestrictedKey
    });
  } finally {
    delete environment[FRESH_OUT_OF_ORDER_KEY_ENV];
    delete environment[FRESH_OUT_OF_ORDER_CONFIRM_ENV];
  }
}

async function main() {
  try {
    const result = await runFreshOutOfOrderSimulation();
    console.log('Fresh out-of-order sandbox simulation prepared.');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Fresh out-of-order simulation stopped safely.');
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
