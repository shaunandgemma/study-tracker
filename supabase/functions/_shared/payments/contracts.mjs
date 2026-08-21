export const CANONICAL_EXAM_IDS = Object.freeze([
  'aws-saa-c03',
  'terraform-associate-004',
  'comptia-sec-plus'
]);

export const SUPPORTED_STRIPE_EVENT_TYPES = Object.freeze([
  'checkout.session.completed',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'charge.refunded',
  'refund.created',
  'refund.updated'
]);

const canonicalExamIds = new Set(CANONICAL_EXAM_IDS);
const supportedEventTypes = new Set(SUPPORTED_STRIPE_EVENT_TYPES);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const stripeIdPatterns = Object.freeze({
  customerId: /^cus_[A-Za-z0-9]+$/,
  eventId: /^evt_[A-Za-z0-9]+$/,
  invoiceId: /^in_[A-Za-z0-9]+$/,
  priceId: /^price_[A-Za-z0-9]+$/,
  productId: /^prod_[A-Za-z0-9]+$/,
  sessionId: /^cs_(?:test|live)_[A-Za-z0-9]+$/,
  subscriptionId: /^sub_[A-Za-z0-9]+$/
});

export class PaymentHttpError extends Error {
  constructor(status, code, message = code) {
    super(message);
    this.name = 'PaymentHttpError';
    this.status = status;
    this.code = code;
  }
}

export function isCanonicalExamId(value) {
  return typeof value === 'string' && canonicalExamIds.has(value);
}

export function isSupportedStripeEventType(value) {
  return typeof value === 'string' && supportedEventTypes.has(value);
}

export function isUuid(value) {
  return typeof value === 'string' && uuidPattern.test(value);
}

export function isStripeId(kind, value, { optional = false } = {}) {
  if (optional && (value === null || value === undefined)) return true;
  return typeof value === 'string' && stripeIdPatterns[kind]?.test(value) === true;
}

export function assertExactObject(value, allowedKeys, code = 'invalid_request') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new PaymentHttpError(400, code);
  }

  const unexpectedKeys = Object.keys(value).filter(key => !allowedKeys.includes(key));
  if (unexpectedKeys.length > 0) throw new PaymentHttpError(400, code);
}

export function assertAuthenticatedUser(user) {
  if (!user || !isUuid(user.id) || typeof user.email !== 'string' || user.email.trim() === '') {
    throw new PaymentHttpError(401, 'authentication_required');
  }

  if (user.isDemo === true || user.isAnonymous === true) {
    throw new PaymentHttpError(401, 'authentication_required');
  }

  if (!user.emailConfirmedAt) {
    throw new PaymentHttpError(403, 'verified_email_required');
  }

  return {
    id: user.id,
    email: user.email.trim(),
    emailConfirmedAt: user.emailConfirmedAt
  };
}

export function assertCheckoutContext(context, { examId, livemode }) {
  if (!context || typeof context !== 'object') {
    throw new PaymentHttpError(503, 'payment_unavailable');
  }

  if (context.examId !== examId || context.livemode !== livemode || context.enabled !== true) {
    throw new PaymentHttpError(404, 'exam_purchase_unavailable');
  }

  if (!isStripeId('productId', context.productId) || !isStripeId('priceId', context.priceId)) {
    throw new PaymentHttpError(503, 'payment_unavailable');
  }

  if (context.customerId !== null && !isStripeId('customerId', context.customerId)) {
    throw new PaymentHttpError(503, 'payment_unavailable');
  }

  if (context.hasCurrentSubscription === true) {
    throw new PaymentHttpError(409, 'exam_access_already_active');
  }

  return context;
}

export function assertPortalContext(context, { livemode }) {
  if (!context || context.livemode !== livemode || !isStripeId('customerId', context.customerId)) {
    throw new PaymentHttpError(404, 'billing_account_unavailable');
  }
  return context;
}

export function assertReconciliationState(state, { event, livemode }) {
  if (!state || typeof state !== 'object') throw new PaymentHttpError(503, 'webhook_processing_failed');

  const valid =
    state.stripeEventId === event.id &&
    state.eventType === event.type &&
    state.livemode === livemode &&
    isUuid(state.userId) &&
    isCanonicalExamId(state.examId) &&
    isStripeId('customerId', state.stripeCustomerId) &&
    isStripeId('subscriptionId', state.stripeSubscriptionId) &&
    isStripeId('productId', state.stripeProductId) &&
    isStripeId('priceId', state.stripePriceId) &&
    isStripeId('invoiceId', state.latestInvoiceId, { optional: true }) &&
    ['incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused'].includes(state.providerStatus) &&
    typeof state.cancelAtPeriodEnd === 'boolean' &&
    typeof state.providerEventCreatedAt === 'string' &&
    ['activate', 'revoke', 'no_change'].includes(state.accessAction) &&
    typeof state.reasonCode === 'string' &&
    /^[a-z0-9_]{1,80}$/.test(state.reasonCode);

  if (!valid) throw new PaymentHttpError(503, 'webhook_processing_failed');
  return state;
}
