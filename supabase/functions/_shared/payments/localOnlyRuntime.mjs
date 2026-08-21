const localOnlyError = () => {
  throw new Error('Step 008C payment function is disabled and has no deployed runtime adapter.');
};

export function createLocalOnlyDependencies(overrides = {}) {
  return {
    allowedOrigins: [],
    authenticate: localOnlyError,
    bindCustomer: localOnlyError,
    cancelUrl: 'https://learningallthingstech.co.uk/#payment/cancelled',
    getCheckoutContext: localOnlyError,
    getPortalContext: localOnlyError,
    livemode: false,
    reconcileEntitlement: localOnlyError,
    resolveAuthoritativeState: localOnlyError,
    returnUrl: 'https://learningallthingstech.co.uk/#account/billing',
    stripe: {
      constructEvent: localOnlyError,
      createCheckoutSession: localOnlyError,
      createCustomer: localOnlyError,
      createPortalSession: localOnlyError
    },
    successUrl: 'https://learningallthingstech.co.uk/#payment/success',
    ...overrides
  };
}
