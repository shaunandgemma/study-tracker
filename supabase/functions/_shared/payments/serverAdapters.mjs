import { PaymentHttpError } from './contracts.mjs';

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

async function eventSubscription(event, stripe) {
  const object = event?.data?.object;
  let subscriptionId = null;
  let relatedInvoice = null;

  if (event.type.startsWith('customer.subscription.')) {
    subscriptionId = objectId(object);
  } else if (event.type === 'checkout.session.completed') {
    subscriptionId = objectId(object?.subscription);
  } else if (event.type.startsWith('invoice.')) {
    relatedInvoice = object;
    subscriptionId = invoiceSubscriptionId(object);
  } else if (event.type === 'charge.refunded') {
    const invoiceId = objectId(object?.invoice);
    if (invoiceId) relatedInvoice = await stripe.invoices.retrieve(invoiceId);
    subscriptionId = invoiceSubscriptionId(relatedInvoice);
  } else if (event.type.startsWith('refund.')) {
    const chargeId = objectId(object?.charge);
    const charge = chargeId ? await stripe.charges.retrieve(chargeId) : null;
    const invoiceId = objectId(charge?.invoice);
    if (invoiceId) relatedInvoice = await stripe.invoices.retrieve(invoiceId);
    subscriptionId = invoiceSubscriptionId(relatedInvoice);
  }

  if (!subscriptionId) throw new Error('The Stripe event has no subscription boundary.');
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price.product', 'latest_invoice']
  });
  return { relatedInvoice, subscription };
}

function reconciliationDecision(eventType, status) {
  if (eventType === 'invoice.paid' && (status === 'active' || status === 'trialing')) {
    return { accessAction: 'activate', reasonCode: 'invoice_paid' };
  }
  if (eventType === 'customer.subscription.deleted' || status === 'canceled' || status === 'unpaid') {
    return { accessAction: 'revoke', reasonCode: 'subscription_ended' };
  }
  if (eventType === 'invoice.payment_failed') {
    return { accessAction: 'no_change', reasonCode: 'invoice_payment_failed' };
  }
  if (eventType === 'charge.refunded' || eventType.startsWith('refund.')) {
    return { accessAction: 'no_change', reasonCode: 'refund_manual_review' };
  }
  return { accessAction: 'no_change', reasonCode: 'provider_state_refreshed' };
}

export function createAuthoritativeStateResolver(stripe, { livemode = false } = {}) {
  return async event => {
    const { relatedInvoice, subscription } = await eventSubscription(event, stripe);
    if (subscription?.livemode !== livemode) throw new Error('Stripe subscription mode mismatch.');

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
    const decision = reconciliationDecision(event.type, providerStatus);
    const latestInvoiceId = objectId(relatedInvoice) || objectId(subscription?.latest_invoice);

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

export function createServerPaymentDependencies({
  authClientFactory,
  serviceClient,
  stripe,
  settings
}) {
  if (typeof authClientFactory !== 'function' || !serviceClient?.rpc || !stripe) {
    throw new TypeError('Payment server adapters require auth, service-role RPC and Stripe clients.');
  }

  const livemode = settings?.livemode === true;
  if (livemode) throw new Error('Step 008E1 permits Stripe sandbox mode only.');

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
      createCheckoutSession: input => stripe.checkout.sessions.create(input),
      createCustomer: input => stripe.customers.create(input),
      createPortalSession: input => stripe.billingPortal.sessions.create(input)
    },
    successUrl: `${siteOrigin}/#payment/success`
  };
}

export function validateSandboxRuntimeSettings(settings) {
  const secretKey = requireValue(settings?.stripeSecretKey, 'STRIPE_SECRET_KEY');
  const webhookSecret = requireValue(settings?.webhookSecret, 'STRIPE_WEBHOOK_SECRET');
  if (!secretKey.startsWith('rk_test_')) throw new Error('Only a Stripe sandbox restricted key is permitted.');
  if (!webhookSecret.startsWith('whsec_')) throw new Error('The Stripe webhook signing secret is invalid.');
  if (settings?.livemode === true) throw new Error('Stripe live mode is not permitted in Step 008E1.');
  return { ...settings, livemode: false, stripeSecretKey: secretKey, webhookSecret };
}
