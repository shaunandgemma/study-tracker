import {
  PaymentHttpError,
  assertAuthenticatedUser,
  assertCheckoutContext,
  assertExactObject,
  assertPortalContext,
  assertReconciliationState,
  isCanonicalExamId,
  isStripeId,
  isSupportedStripeEventType
} from './contracts.mjs';
import {
  addHeaders,
  corsHeaders,
  errorResponse,
  jsonResponse,
  methodNotAllowed,
  readJsonObject,
  readRawBody
} from './http.mjs';

function requireFunction(value, name) {
  if (typeof value !== 'function') throw new TypeError(`Missing payment dependency: ${name}`);
  return value;
}

function createBrowserRoute(dependencies, route) {
  const allowedOrigins = dependencies.allowedOrigins || [];

  return async request => {
    let headers = { Vary: 'Origin' };
    try {
      headers = corsHeaders(request, allowedOrigins);
      if (request.method === 'OPTIONS') return addHeaders(new Response(null, { status: 204 }), headers);
      if (request.method !== 'POST') return addHeaders(methodNotAllowed(['POST', 'OPTIONS']), headers);
      return addHeaders(await route(request), headers);
    } catch (error) {
      return addHeaders(errorResponse(error), headers);
    }
  };
}

export function createExamCheckoutHandler(dependencies) {
  const authenticate = requireFunction(dependencies.authenticate, 'authenticate');
  const getCheckoutContext = requireFunction(dependencies.getCheckoutContext, 'getCheckoutContext');
  const bindCustomer = requireFunction(dependencies.bindCustomer, 'bindCustomer');
  const createCustomer = requireFunction(dependencies.stripe?.createCustomer, 'stripe.createCustomer');
  const createCheckoutSession = requireFunction(
    dependencies.stripe?.createCheckoutSession,
    'stripe.createCheckoutSession'
  );
  const livemode = dependencies.livemode === true;
  const successUrl = dependencies.successUrl;
  const cancelUrl = dependencies.cancelUrl;

  return createBrowserRoute(dependencies, async request => {
    const user = assertAuthenticatedUser(await authenticate(request));
    const body = await readJsonObject(request);
    assertExactObject(body, ['examId']);
    if (!isCanonicalExamId(body.examId)) throw new PaymentHttpError(400, 'invalid_exam');

    const context = assertCheckoutContext(
      await getCheckoutContext({ userId: user.id, examId: body.examId, livemode }),
      { examId: body.examId, livemode }
    );

    let customerId = context.customerId;
    if (!customerId) {
      const customer = await createCustomer({
        email: user.email,
        metadata: { latt_user_id: user.id }
      });
      if (!isStripeId('customerId', customer?.id)) throw new PaymentHttpError(503, 'payment_unavailable');
      await bindCustomer({ userId: user.id, customerId: customer.id, livemode });
      customerId = customer.id;
    }

    const metadata = { latt_exam_id: body.examId, latt_user_id: user.id };
    const session = await createCheckoutSession({
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      customer: customerId,
      line_items: [{ price: context.priceId, quantity: 1 }],
      metadata,
      mode: 'subscription',
      subscription_data: { metadata },
      success_url: successUrl
    });

    if (!isStripeId('sessionId', session?.id) || typeof session?.url !== 'string') {
      throw new PaymentHttpError(503, 'payment_unavailable');
    }

    return jsonResponse(200, { url: session.url });
  });
}

export function createStripePortalSessionHandler(dependencies) {
  const authenticate = requireFunction(dependencies.authenticate, 'authenticate');
  const getPortalContext = requireFunction(dependencies.getPortalContext, 'getPortalContext');
  const createPortalSession = requireFunction(
    dependencies.stripe?.createPortalSession,
    'stripe.createPortalSession'
  );
  const livemode = dependencies.livemode === true;
  const returnUrl = dependencies.returnUrl;

  return createBrowserRoute(dependencies, async request => {
    const user = assertAuthenticatedUser(await authenticate(request));
    const body = await readJsonObject(request, { allowEmpty: true });
    assertExactObject(body, []);
    const context = assertPortalContext(
      await getPortalContext({ userId: user.id, livemode }),
      { livemode }
    );
    const session = await createPortalSession({ customer: context.customerId, return_url: returnUrl });
    if (typeof session?.url !== 'string') throw new PaymentHttpError(503, 'payment_unavailable');
    return jsonResponse(200, { url: session.url });
  });
}

export function createStripeWebhookHandler(dependencies) {
  const constructEvent = requireFunction(dependencies.stripe?.constructEvent, 'stripe.constructEvent');
  const resolveAuthoritativeState = requireFunction(
    dependencies.resolveAuthoritativeState,
    'resolveAuthoritativeState'
  );
  const reconcileEntitlement = requireFunction(dependencies.reconcileEntitlement, 'reconcileEntitlement');
  const livemode = dependencies.livemode === true;

  return async request => {
    try {
      if (request.method !== 'POST') return methodNotAllowed(['POST']);
      const signature = request.headers.get('Stripe-Signature');
      if (!signature) throw new PaymentHttpError(400, 'stripe_signature_required');

      const rawBody = await readRawBody(request);
      let event;
      try {
        event = await constructEvent(rawBody, signature);
      } catch {
        throw new PaymentHttpError(400, 'stripe_signature_invalid');
      }

      if (!isStripeId('eventId', event?.id) || typeof event?.type !== 'string') {
        throw new PaymentHttpError(400, 'stripe_event_invalid');
      }
      if (event.livemode !== livemode) throw new PaymentHttpError(400, 'stripe_mode_mismatch');

      if (!isSupportedStripeEventType(event.type)) {
        return jsonResponse(200, { received: true, ignored: true });
      }

      const state = assertReconciliationState(
        await resolveAuthoritativeState(event),
        { event, livemode }
      );
      const result = await reconcileEntitlement(state);
      return jsonResponse(200, {
        received: true,
        duplicate: result?.duplicate === true,
        stale: result?.stale === true
      });
    } catch (error) {
      if (error instanceof PaymentHttpError) return errorResponse(error);
      return jsonResponse(503, { error: 'webhook_processing_failed' });
    }
  };
}
