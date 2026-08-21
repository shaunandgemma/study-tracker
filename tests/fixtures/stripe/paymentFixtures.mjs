export const stripeTestFixture = Object.freeze({
  allowedOrigin: 'http://127.0.0.1:5173',
  cancelUrl: 'http://127.0.0.1:5173/#payment/cancelled',
  customerId: 'cus_testLearner001',
  email: 'learner@example.test',
  event: Object.freeze({
    id: 'evt_testInvoicePaid001',
    livemode: false,
    type: 'invoice.paid'
  }),
  examId: 'terraform-associate-004',
  invoiceId: 'in_testInvoice001',
  priceId: 'price_testTerraformAnnual001',
  productId: 'prod_testTerraform001',
  portalUrl: 'https://billing.stripe.test/session/test_portal_001',
  returnUrl: 'http://127.0.0.1:5173/#account/billing',
  sessionId: 'cs_test_checkout001',
  sessionUrl: 'https://checkout.stripe.test/c/pay/cs_test_checkout001',
  signature: 't=1787148000,v1=test_signature_001',
  subscriptionId: 'sub_testTerraform001',
  successUrl: 'http://127.0.0.1:5173/#payment/success',
  userId: '667ad4ce-312b-4f78-a3fa-366c8b669477'
});

export function createAuthoritativeStripeState(overrides = {}) {
  const fixture = stripeTestFixture;
  return {
    accessAction: 'activate',
    cancelAtPeriodEnd: false,
    currentPeriodEnd: '2027-08-21T12:00:00.000Z',
    currentPeriodStart: '2026-08-21T12:00:00.000Z',
    eventType: fixture.event.type,
    examId: fixture.examId,
    latestInvoiceId: fixture.invoiceId,
    livemode: false,
    paidThrough: '2027-08-21T12:00:00.000Z',
    providerEventCreatedAt: '2026-08-21T12:00:00.000Z',
    providerStatus: 'active',
    reasonCode: 'invoice_paid',
    stripeCustomerId: fixture.customerId,
    stripeEventId: fixture.event.id,
    stripePriceId: fixture.priceId,
    stripeProductId: fixture.productId,
    stripeSubscriptionId: fixture.subscriptionId,
    userId: fixture.userId,
    ...overrides
  };
}

export function createStripeTestDependencies(overrides = {}) {
  const fixture = stripeTestFixture;
  const calls = {
    bindCustomer: [],
    checkoutSessions: [],
    constructEvent: [],
    customers: [],
    portalSessions: [],
    reconcile: [],
    resolve: []
  };

  const base = {
    allowedOrigins: [fixture.allowedOrigin],
    authenticate: async () => ({
      email: fixture.email,
      emailConfirmedAt: '2026-08-20T12:00:00.000Z',
      id: fixture.userId
    }),
    bindCustomer: async input => calls.bindCustomer.push(input),
    cancelUrl: fixture.cancelUrl,
    getCheckoutContext: async ({ examId, livemode }) => ({
      customerId: fixture.customerId,
      enabled: true,
      examId,
      hasCurrentSubscription: false,
      livemode,
      priceId: fixture.priceId,
      productId: fixture.productId
    }),
    getPortalContext: async ({ livemode }) => ({
      customerId: fixture.customerId,
      livemode
    }),
    livemode: false,
    reconcileEntitlement: async state => {
      calls.reconcile.push(state);
      return { duplicate: false, processed: true, stale: false };
    },
    resolveAuthoritativeState: async event => {
      calls.resolve.push(event);
      return createAuthoritativeStripeState();
    },
    returnUrl: fixture.returnUrl,
    stripe: {
      constructEvent: async (rawBody, signature) => {
        calls.constructEvent.push({ rawBody, signature });
        return fixture.event;
      },
      createCheckoutSession: async input => {
        calls.checkoutSessions.push(input);
        return { id: fixture.sessionId, url: fixture.sessionUrl };
      },
      createCustomer: async input => {
        calls.customers.push(input);
        return { id: fixture.customerId };
      },
      createPortalSession: async input => {
        calls.portalSessions.push(input);
        return { url: fixture.portalUrl };
      }
    },
    successUrl: fixture.successUrl
  };

  return {
    calls,
    dependencies: {
      ...base,
      ...overrides,
      stripe: { ...base.stripe, ...(overrides.stripe || {}) }
    }
  };
}
