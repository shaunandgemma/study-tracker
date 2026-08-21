import { supabase } from '../../lib/supabase.js';
import { APPLICATION_EXAM_IDS } from '../access/applicationAccessPolicy.js';

const runtimeEnv = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' ? process.env : {});

export function isSandboxPaymentRuntimeEnabled(env = {}) {
  return env.VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED === 'true';
}

export const PAYMENT_RUNTIME_INVOCATION_ENABLED = isSandboxPaymentRuntimeEnabled(runtimeEnv);

const PAYMENT_FUNCTIONS = Object.freeze({
  checkout: 'create-exam-checkout',
  portal: 'create-stripe-portal-session'
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

  async function requireCurrentSession() {
    const { data, error } = await client.auth.getSession();
    const session = data?.session;
    if (error || !session?.access_token || !session?.user?.id) {
      return failure('Sign in again before using protected billing.', { authenticationRequired: true });
    }
    return Object.freeze({ success: true, session });
  }

  async function invokeProtectedFunction({ functionName, body, urlKind }) {
    if (!enabled) {
      return failure('Sandbox payment controls are prepared but not enabled.', { runtimeDisabled: true });
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
      functionName: PAYMENT_FUNCTIONS.checkout,
      body: { examId },
      urlKind: 'checkout'
    });
  }

  async function createBillingPortalSession() {
    return invokeProtectedFunction({
      functionName: PAYMENT_FUNCTIONS.portal,
      body: {},
      urlKind: 'portal'
    });
  }

  return Object.freeze({ createExamCheckout, createBillingPortalSession });
}

export const paymentBrowserService = createPaymentBrowserService({
  enabled: PAYMENT_RUNTIME_INVOCATION_ENABLED
});
