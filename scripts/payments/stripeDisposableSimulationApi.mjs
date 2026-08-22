const STRIPE_API_ORIGIN = 'https://api.stripe.com';

function stopped(message) {
  throw new Error(`Disposable Stripe API stopped safely: ${message}`);
}

function requireRestrictedSandboxKey(value) {
  if (typeof value !== 'string' || !value.startsWith('rk_test_') || value.length < 16) {
    stopped('a temporary Stripe sandbox restricted key is required.');
  }
  return value;
}

function requireStripeId(value, prefix, label) {
  if (typeof value !== 'string' || !value.startsWith(`${prefix}_`) || !/^[A-Za-z0-9_]+$/.test(value)) {
    stopped(`${label} is invalid.`);
  }
  return value;
}

function appendMetadata(body, metadata = {}) {
  for (const [key, value] of Object.entries(metadata)) {
    body.set(`metadata[${key}]`, String(value));
  }
}

function formDataFor(operation, input) {
  const body = new URLSearchParams();
  if (operation === 'testClocks.create') {
    body.set('frozen_time', String(input.frozen_time));
    body.set('name', input.name);
  } else if (operation === 'customers.create') {
    body.set('test_clock', input.test_clock);
    appendMetadata(body, input.metadata);
  } else if (operation === 'customers.update') {
    body.set('invoice_settings[default_payment_method]', input.invoice_settings.default_payment_method);
  } else if (operation === 'paymentMethods.attach') {
    body.set('customer', input.customer);
  } else if (operation === 'subscriptions.create') {
    body.set('customer', input.customer);
    body.set('default_payment_method', input.default_payment_method);
    body.set('items[0][price]', input.items[0].price);
    body.set('items[0][quantity]', String(input.items[0].quantity));
    for (const [index, value] of (input.expand || []).entries()) body.set(`expand[${index}]`, value);
    appendMetadata(body, input.metadata);
  } else if (operation === 'subscriptions.update') {
    body.set('default_payment_method', input.default_payment_method);
  } else {
    stopped('an unsupported Stripe operation was requested.');
  }
  return body;
}

export function createDisposableStripeApi({ fetchImpl = globalThis.fetch, temporaryRestrictedKey } = {}) {
  const key = requireRestrictedSandboxKey(temporaryRestrictedKey);
  if (typeof fetchImpl !== 'function') stopped('a fetch implementation is required.');

  async function post(path, operation, input) {
    if (!path.startsWith('/v1/') || path.includes('..')) stopped('the Stripe API path is invalid.');
    const response = await fetchImpl(`${STRIPE_API_ORIGIN}${path}`, {
      body: formDataFor(operation, input),
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    });
    if (!response?.ok) stopped(`${operation} failed with HTTP ${response?.status || 'unknown'}.`);
    const result = await response.json();
    if (!result || typeof result !== 'object') stopped(`${operation} returned an invalid response.`);
    return result;
  }

  return Object.freeze({
    customers: {
      create: input => post('/v1/customers', 'customers.create', input),
      update: (id, input) => post(
        `/v1/customers/${requireStripeId(id, 'cus', 'Customer ID')}`,
        'customers.update',
        input
      )
    },
    paymentMethods: {
      attach: (id, input) => post(
        `/v1/payment_methods/${requireStripeId(id, 'pm', 'PaymentMethod ID')}/attach`,
        'paymentMethods.attach',
        input
      )
    },
    subscriptions: {
      create: input => post('/v1/subscriptions', 'subscriptions.create', input),
      update: (id, input) => post(
        `/v1/subscriptions/${requireStripeId(id, 'sub', 'Subscription ID')}`,
        'subscriptions.update',
        input
      )
    },
    testClocks: {
      create: input => post('/v1/test_helpers/test_clocks', 'testClocks.create', input)
    }
  });
}
