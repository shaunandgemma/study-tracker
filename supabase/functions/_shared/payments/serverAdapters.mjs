import {
  PaymentHttpError,
  isCanonicalExamId,
  isUuid
} from './contracts.mjs';

export const LIVE_PAYMENT_SITE_ORIGIN = 'https://learningallthingstech.co.uk';
export const STRIPE_PAYMENT_API_VERSION = '2026-07-29.dahlia';

const LIVE_CHECKOUT_IDEMPOTENCY_WINDOW_MS = 30 * 60 * 1000;

function requireValue(value, name) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`Missing payment runtime setting: ${name}`);
  return value.trim();
}

function objectId(value) {
  if (typeof value === 'string') return value;
  return value && typeof value.id === 'string' ? value.id : null;
}

function unixIso(value) {
  return Number.isFinite(value) ? new Date(value * 1000).toISOString() : null;
}

function rpcResult(result, code = 'payment_unavailable') {
  if (result?.error || result?.data === null || result?.data === undefined) {
    throw new PaymentHttpError(503, code);
  }
  return result.data;
}

function invoiceSubscriptionId(invoice) {
  return objectId(invoice?.parent?.subscription_details?.subscription) || objectId(invoice?.subscription);
}

function isRefundEvent(eventType) {
  return eventType === 'charge.refunded'
    || eventType === 'refund.created'
    || eventType === 'refund.updated';
}

async function invoiceForPaymentIntent(stripe, paymentIntentId) {
  if (!paymentIntentId) throw new Error('The Stripe refund has no PaymentIntent boundary.');

  const invoicePayments = await stripe.invoicePayments.list({
    limit: 2,
    payment: {
      payment_intent: paymentIntentId,
      type: 'payment_intent'
    }
  });
  const matches = Array.isArray(invoicePayments?.data)
    ? invoicePayments.data.filter(invoicePayment => (
        objectId(invoicePayment?.payment?.payment_intent) === paymentIntentId
      ))
    : [];

  if (invoicePayments?.has_more === true || matches.length !== 1) {
    throw new Error('The Stripe refund must resolve to exactly one Invoice Payment.');
  }

  const invoiceId = objectId(matches[0]?.invoice);
  if (!invoiceId) throw new Error('The Stripe Invoice Payment has no Invoice boundary.');
  return stripe.invoices.retrieve(invoiceId);
}

async function eventSubscription(event, stripe) {
  const object = event?.data?.object;
  let subscriptionId = null;
  let relatedCharge = null;
  let relatedInvoice = null;

  if (event.type.startsWith('customer.subscription.')) {
    subscriptionId = objectId(object);
  } else if (event.type === 'checkout.session.completed') {
    subscriptionId = objectId(object?.subscription);
  } else if (event.type.startsWith('invoice.')) {
    relatedInvoice = object;
    subscriptionId = invoiceSubscriptionId(object);
  } else if (isRefundEvent(event.type)) {
    const chargeId = event.type === 'charge.refunded'
      ? objectId(object)
      : objectId(object?.charge);
    if (!chargeId) throw new Error('The Stripe refund has no Charge boundary.');

    relatedCharge = await stripe.charges.retrieve(chargeId);
    if (objectId(relatedCharge) !== chargeId) {
      throw new Error('The Stripe refund Charge boundary changed unexpectedly.');
    }

    const paymentIntentId = objectId(relatedCharge?.payment_intent);
    const eventPaymentIntentId = objectId(object?.payment_intent);
    if (eventPaymentIntentId && eventPaymentIntentId !== paymentIntentId) {
      throw new Error('The Stripe refund PaymentIntent boundary changed unexpectedly.');
    }
    relatedInvoice = await invoiceForPaymentIntent(stripe, paymentIntentId);
    subscriptionId = invoiceSubscriptionId(relatedInvoice);
  }

  if (!subscriptionId) throw new Error('The Stripe event has no subscription boundary.');
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price.product', 'latest_invoice']
  });
  return { relatedCharge, relatedInvoice, subscription };
}

function isQualifyingFullRefund(event, charge, invoice, livemode) {
  if (!isRefundEvent(event.type) || charge?.livemode !== livemode) return false;

  const amount = charge?.amount;
  const amountRefunded = charge?.amount_refunded;
  const invoiceAmountDue = invoice?.amount_due;
  const invoiceAmountPaid = invoice?.amount_paid;
  const invoiceAmountRemaining = invoice?.amount_remaining;
  const invoicePaidAt = invoice?.status_transitions?.paid_at;
  const refundStatus = event.type.startsWith('refund.')
    ? event?.data?.object?.status
    : 'succeeded';

  return Number.isSafeInteger(amount)
    && amount > 0
    && Number.isSafeInteger(amountRefunded)
    && amountRefunded === amount
    && charge?.paid === true
    && charge?.refunded === true
    && charge?.status === 'succeeded'
    && refundStatus === 'succeeded'
    && invoice?.livemode === livemode
    && invoice?.status === 'paid'
    && Number.isSafeInteger(invoiceAmountDue)
    && invoiceAmountDue === amount
    && Number.isSafeInteger(invoiceAmountPaid)
    && invoiceAmountPaid === amount
    && Number.isSafeInteger(invoiceAmountRemaining)
    && invoiceAmountRemaining === 0
    && Number.isSafeInteger(invoicePaidAt)
    && invoicePaidAt > 0;
}

function reconciliationDecision(eventType, status, qualifyingFullRefund = false) {
  if (eventType === 'invoice.paid' && (status === 'active' || status === 'trialing')) {
    return { accessAction: 'activate', reasonCode: 'invoice_paid' };
  }
  if (isRefundEvent(eventType)) {
    return qualifyingFullRefund
      ? { accessAction: 'revoke', reasonCode: 'full_refund' }
      : { accessAction: 'no_change', reasonCode: 'refund_manual_review' };
  }
  if (eventType === 'customer.subscription.deleted' || status === 'canceled' || status === 'unpaid') {
    return { accessAction: 'revoke', reasonCode: 'subscription_ended' };
  }
  if (eventType === 'invoice.payment_failed') {
    return { accessAction: 'no_change', reasonCode: 'invoice_payment_failed' };
  }
  return { accessAction: 'no_change', reasonCode: 'provider_state_refreshed' };
}

export function createAuthoritativeStateResolver(stripe, { livemode = false } = {}) {
  return async event => {
    const { relatedCharge, relatedInvoice, subscription } = await eventSubscription(event, stripe);
    if (subscription?.livemode !== livemode) throw new Error('Stripe subscription mode mismatch.');
    if (event?.livemode !== livemode) throw new Error('Stripe event mode mismatch.');
    if (relatedCharge && relatedCharge?.livemode !== livemode) {
      throw new Error('Stripe refund Charge mode mismatch.');
    }

    const items = subscription?.items?.data;
    if (!Array.isArray(items) || items.length !== 1) {
      throw new Error('The exam subscription must contain exactly one Price.');
    }

    const item = items[0];
    const price = item?.price;
    const metadata = subscription?.metadata || {};
    const providerStatus = subscription?.status;
    const currentPeriodStart = unixIso(item?.current_period_start ?? subscription?.current_period_start);
    const currentPeriodEnd = unixIso(item?.current_period_end ?? subscription?.current_period_end);
    const qualifyingFullRefund = isQualifyingFullRefund(
      event,
      relatedCharge,
      relatedInvoice,
      livemode
    );
    const decision = reconciliationDecision(event.type, providerStatus, qualifyingFullRefund);
    const isRefund = isRefundEvent(event.type);
    const latestInvoiceId = isRefund
      ? objectId(relatedInvoice)
      : objectId(relatedInvoice) || objectId(subscription?.latest_invoice);

    if (isRefund && !latestInvoiceId) {
      throw new Error('The Stripe refund has no authoritative paid Invoice.');
    }

    return {
      ...decision,
      cancelAtPeriodEnd: subscription?.cancel_at_period_end === true,
      currentPeriodEnd,
      currentPeriodStart,
      eventType: event.type,
      examId: metadata.latt_exam_id,
      latestInvoiceId,
      livemode,
      paidThrough: decision.accessAction === 'activate' ? currentPeriodEnd : null,
      providerEventCreatedAt: unixIso(event.created),
      providerStatus,
      stripeCustomerId: objectId(subscription?.customer),
      stripeEventId: event.id,
      stripePriceId: objectId(price),
      stripeProductId: objectId(price?.product),
      stripeSubscriptionId: subscription.id,
      userId: metadata.latt_user_id
    };
  };
}

function createModePaymentDependencies({
  authClientFactory,
  serviceClient,
  stripe,
  settings,
  createIdempotencyKeys = null,
  checkoutPaymentMethodTypes = null
}) {
  if (typeof authClientFactory !== 'function' || !serviceClient?.rpc || !stripe) {
    throw new TypeError('Payment server adapters require auth, service-role RPC and Stripe clients.');
  }

  const livemode = settings?.livemode === true;

  const siteOrigin = requireValue(settings?.siteOrigin, 'PAYMENT_SITE_ORIGIN').replace(/\/$/, '');
  const allowedOrigins = Array.isArray(settings?.allowedOrigins)
    ? settings.allowedOrigins.map(value => requireValue(value, 'PAYMENT_ALLOWED_ORIGINS'))
    : [];

  const authenticate = async request => {
    const authorization = request.headers.get('Authorization') || '';
    if (!/^Bearer\s+\S+$/i.test(authorization)) return null;
    const token = authorization.replace(/^Bearer\s+/i, '');
    const { data, error } = await authClientFactory().auth.getUser(token);
    if (error || !data?.user) return null;
    return {
      email: data.user.email,
      emailConfirmedAt: data.user.email_confirmed_at,
      id: data.user.id,
      isAnonymous: data.user.is_anonymous === true
    };
  };

  return {
    allowedOrigins,
    authenticate,
    checkoutPaymentMethodTypes,
    createIdempotencyKeys,
    bindCustomer: async ({ userId, customerId }) => rpcResult(await serviceClient.rpc(
      'bind_stripe_customer',
      { p_user_id: userId, p_livemode: livemode, p_stripe_customer_id: customerId }
    )),
    cancelUrl: `${siteOrigin}/#payment/cancelled`,
    getCheckoutContext: async ({ userId, examId }) => rpcResult(await serviceClient.rpc(
      'get_stripe_exam_checkout_context',
      { p_user_id: userId, p_exam_id: examId, p_livemode: livemode }
    )),
    getPortalContext: async ({ userId }) => rpcResult(await serviceClient.rpc(
      'get_stripe_portal_context',
      { p_user_id: userId, p_livemode: livemode }
    )),
    livemode,
    reconcileEntitlement: async state => rpcResult(
      await serviceClient.rpc('reconcile_stripe_exam_entitlement', {
        p_access_action: state.accessAction,
        p_cancel_at_period_end: state.cancelAtPeriodEnd,
        p_current_period_end: state.currentPeriodEnd,
        p_current_period_start: state.currentPeriodStart,
        p_event_type: state.eventType,
        p_exam_id: state.examId,
        p_latest_invoice_id: state.latestInvoiceId,
        p_livemode: state.livemode,
        p_paid_through: state.paidThrough,
        p_provider_event_created_at: state.providerEventCreatedAt,
        p_provider_status: state.providerStatus,
        p_reason_code: state.reasonCode,
        p_stripe_customer_id: state.stripeCustomerId,
        p_stripe_event_id: state.stripeEventId,
        p_stripe_price_id: state.stripePriceId,
        p_stripe_product_id: state.stripeProductId,
        p_stripe_subscription_id: state.stripeSubscriptionId,
        p_user_id: state.userId
      }),
      'webhook_processing_failed'
    ),
    resolveAuthoritativeState: createAuthoritativeStateResolver(stripe, { livemode }),
    returnUrl: `${siteOrigin}/#account/billing`,
    stripe: {
      constructEvent: (rawBody, signature) => stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        settings.webhookSecret
      ),
      createCheckoutSession: (input, requestOptions) => stripe.checkout.sessions.create(
        input,
        requestOptions
      ),
      createCustomer: (input, requestOptions) => stripe.customers.create(input, requestOptions),
      createPortalSession: input => stripe.billingPortal.sessions.create(input)
    },
    successUrl: `${siteOrigin}/#payment/success`
  };
}

export function createServerPaymentDependencies(options) {
  if (options?.settings?.livemode === true) {
    throw new Error('Step 008E1 permits Stripe sandbox mode only.');
  }
  return createModePaymentDependencies(options);
}

export function createLivePaymentIdempotencyKeys({ examId, now = Date.now(), userId }) {
  if (!isUuid(userId) || !isCanonicalExamId(examId) || !Number.isFinite(now) || now < 0) {
    throw new Error('Live Stripe idempotency inputs are invalid.');
  }

  const checkoutWindow = Math.floor(now / LIVE_CHECKOUT_IDEMPOTENCY_WINDOW_MS);
  return Object.freeze({
    checkout: `latt-live-v1-checkout-${userId}-${examId}-${checkoutWindow}`,
    customer: `latt-live-v1-customer-${userId}`
  });
}

export function createLiveServerPaymentDependencies(options) {
  if (options?.settings?.livemode !== true) {
    throw new Error('The Stripe live adapter requires fixed live mode.');
  }

  const now = typeof options.now === 'function' ? options.now : Date.now;
  return createModePaymentDependencies({
    ...options,
    checkoutPaymentMethodTypes: Object.freeze(['card']),
    createIdempotencyKeys: input => createLivePaymentIdempotencyKeys({ ...input, now: now() })
  });
}

export function validateSandboxRuntimeSettings(settings) {
  const secretKey = requireValue(settings?.stripeSecretKey, 'STRIPE_SECRET_KEY');
  const webhookSecret = requireValue(settings?.webhookSecret, 'STRIPE_WEBHOOK_SECRET');
  if (!secretKey.startsWith('rk_test_')) throw new Error('Only a Stripe sandbox restricted key is permitted.');
  if (!webhookSecret.startsWith('whsec_')) throw new Error('The Stripe webhook signing secret is invalid.');
  if (settings?.livemode === true) throw new Error('Stripe live mode is not permitted in Step 008E1.');
  return { ...settings, livemode: false, stripeSecretKey: secretKey, webhookSecret };
}

export function validateLiveRuntimeSettings(settings) {
  const secretKey = requireValue(settings?.stripeSecretKey, 'STRIPE_LIVE_RESTRICTED_KEY');
  const webhookSecret = requireValue(settings?.webhookSecret, 'STRIPE_LIVE_WEBHOOK_SECRET');
  const siteOrigin = requireValue(settings?.siteOrigin, 'PAYMENT_LIVE_SITE_ORIGIN').replace(/\/$/, '');
  const allowedOrigins = Array.isArray(settings?.allowedOrigins)
    ? settings.allowedOrigins.map(value => requireValue(value, 'PAYMENT_LIVE_ALLOWED_ORIGINS'))
    : [];

  if (!secretKey.startsWith('rk_live_')) {
    throw new Error('Only a Stripe live restricted key is permitted.');
  }
  if (!webhookSecret.startsWith('whsec_')) {
    throw new Error('The Stripe live webhook signing secret is invalid.');
  }
  if (settings?.livemode !== true) {
    throw new Error('The Stripe live runtime requires fixed live mode.');
  }
  if (siteOrigin !== LIVE_PAYMENT_SITE_ORIGIN
      || allowedOrigins.length !== 1
      || allowedOrigins[0] !== LIVE_PAYMENT_SITE_ORIGIN) {
    throw new Error('The Stripe live runtime requires the canonical production origin.');
  }

  return {
    ...settings,
    allowedOrigins: Object.freeze([...allowedOrigins]),
    livemode: true,
    siteOrigin,
    stripeSecretKey: secretKey,
    webhookSecret
  };
}
