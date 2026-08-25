import { supabase } from '../../lib/supabase.js';
import { APPLICATION_EXAM_IDS } from '../access/applicationAccessPolicy.js';

const runtimeEnv = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' ? process.env : {});

export function isSandboxPaymentRuntimeEnabled(env = {}) {
  return env.VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED === 'true';
}

export function isLivePaymentRuntimeEnabled(env = {}) {
  return env.VITE_STRIPE_LIVE_PAYMENTS_ENABLED === 'true';
}

export function getPaymentRuntimeConfiguration(env = {}) {
  const sandboxEnabled = isSandboxPaymentRuntimeEnabled(env);
  const liveEnabled = isLivePaymentRuntimeEnabled(env);
  if (sandboxEnabled && liveEnabled) {
    return Object.freeze({ enabled: false, invalid: true, mode: null });
  }
  if (liveEnabled) return Object.freeze({ enabled: true, invalid: false, mode: 'live' });
  if (sandboxEnabled) return Object.freeze({ enabled: true, invalid: false, mode: 'sandbox' });
  return Object.freeze({ enabled: false, invalid: false, mode: null });
}

const runtimeConfiguration = getPaymentRuntimeConfiguration(runtimeEnv);

export const PAYMENT_RUNTIME_INVOCATION_ENABLED = runtimeConfiguration.enabled;
export const PAYMENT_RUNTIME_MODE = runtimeConfiguration.mode;
export const PAYMENT_RUNTIME_CONFIGURATION_INVALID = runtimeConfiguration.invalid;

const PAYMENT_FUNCTIONS = Object.freeze({
  live: Object.freeze({
    checkout: 'create-exam-checkout-live',
    portal: 'create-stripe-portal-session-live'
  }),
  sandbox: Object.freeze({
    checkout: 'create-exam-checkout',
    portal: 'create-stripe-portal-session'
  })
});

const STRIPE_HOSTS = Object.freeze({
  checkout: 'checkout.stripe.com',
  portal: 'billing.stripe.com'
});

function failure(error, extra = {}) {
  return Object.freeze({ success: false, error, ...extra });
}

export function isCanonicalPaymentExamId(examId) {
  return typeof examId === 'string'
    && examId === examId.trim()
    && APPLICATION_EXAM_IDS.includes(examId);
}

export function validateStripeHostedReturnUrl(value, kind) {
  if (typeof value !== 'string' || !Object.hasOwn(STRIPE_HOSTS, kind)) return null;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') return null;
    if (parsed.hostname !== STRIPE_HOSTS[kind]) return null;
    if (parsed.username || parsed.password || parsed.port) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

export function createPaymentBrowserService(options = {}) {
  const client = options.supabaseClient || supabase;
  const enabled = options.enabled === true;
  const invalidConfiguration = options.invalidConfiguration === true;
  const mode = options.mode === 'live' ? 'live' : 'sandbox';
  const functions = PAYMENT_FUNCTIONS[mode];

  async function requireCurrentSession() {
    const { data, error } = await client.auth.getSession();
    const session = data?.session;
    if (error || !session?.access_token || !session?.user?.id) {
      return failure('Sign in again before using protected billing.', { authenticationRequired: true });
    }
    return Object.freeze({ success: true, session });
  }

  async function invokeProtectedFunction({ functionName, body, urlKind }) {
    if (!enabled || invalidConfiguration) {
      return failure('Payment controls are prepared but not enabled.', {
        configurationInvalid: invalidConfiguration,
        runtimeDisabled: true
      });
    }

    const authenticated = await requireCurrentSession();
    if (!authenticated.success) return authenticated;

    const { data, error } = await client.functions.invoke(functionName, { body });
    if (error) return failure('The protected payment service was unavailable.', { invocationFailed: true });

    const url = validateStripeHostedReturnUrl(data?.url, urlKind);
    if (!url) return failure('The payment service returned an untrusted destination.', { unsafeRedirect: true });
    return Object.freeze({ success: true, url });
  }

  async function createExamCheckout({ examId } = {}) {
    if (!isCanonicalPaymentExamId(examId)) {
      return failure('A supported exact exam is required.', { validationError: true });
    }

    return invokeProtectedFunction({
      functionName: functions.checkout,
      body: { examId },
      urlKind: 'checkout'
    });
  }

  async function createBillingPortalSession() {
    return invokeProtectedFunction({
      functionName: functions.portal,
      body: {},
      urlKind: 'portal'
    });
  }

  return Object.freeze({ createExamCheckout, createBillingPortalSession });
}

export const paymentBrowserService = createPaymentBrowserService({
  enabled: PAYMENT_RUNTIME_INVOCATION_ENABLED,
  invalidConfiguration: PAYMENT_RUNTIME_CONFIGURATION_INVALID,
  mode: PAYMENT_RUNTIME_MODE
});
