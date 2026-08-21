import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  PAYMENT_ROUTE_HASHES,
  getPaymentRoute
} from '../src/features/payments/paymentRoutes.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Step 008F1 Stripe sandbox deployment-readiness corrections', async t => {
  await t.test('the three exact return hashes resolve without accepting lookalike routes', () => {
    assert.deepEqual(PAYMENT_ROUTE_HASHES, {
      billing: '#account/billing',
      cancelled: '#payment/cancelled',
      success: '#payment/success'
    });
    assert.equal(getPaymentRoute({ hash: '#payment/success' }), 'success');
    assert.equal(getPaymentRoute({ hash: '#PAYMENT/CANCELLED' }), 'cancelled');
    assert.equal(getPaymentRoute({ hash: '#account/billing' }), 'billing');
    assert.equal(getPaymentRoute({ hash: '#payment/success/extra' }), null);
    assert.equal(getPaymentRoute({ hash: '#account/billing?customer=forbidden' }), null);
  });

  await t.test('the app renders the payment return entry before the signed-out gate', () => {
    const app = read('src/App.jsx');
    assert.match(app, /const \[paymentRoute, setPaymentRoute\] = useState\(\(\) => getPaymentRoute\(\)\)/);
    assert.match(app, /addEventListener\?\.\('hashchange', updateEntry\)/);
    assert.ok(app.indexOf('if (paymentRoute)') < app.indexOf('if (!currentUser)'));
    assert.match(app, /globalThis\.location\.hash = ''/);
  });

  await t.test('the screens explain server verification and perform no payment action', () => {
    const screen = read('src/features/payments/PaymentReturnEntry.jsx');
    assert.match(screen, /Your sandbox checkout returned successfully/);
    assert.match(screen, /No purchase was completed/);
    assert.match(screen, /Billing management/);
    assert.match(screen, /Access remains server verified/);
    assert.doesNotMatch(screen, /functions\.invoke|create-exam-checkout|create-stripe-portal-session|STRIPE_|SUPABASE_SERVICE_ROLE/);
  });

  await t.test('the runtime pins Stripe while all three approved sandbox functions are deployment-enabled', () => {
    const runtime = read('supabase/functions/_shared/payments/stripeSandboxRuntime.ts');
    const config = read('supabase/config.toml');
    assert.match(runtime, /from 'npm:stripe@22\.5\.0'/);
    assert.match(config, /\[functions\.create-exam-checkout\][\s\S]*?enabled = true[\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.create-stripe-portal-session\][\s\S]*?enabled = true[\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.stripe-webhook\][\s\S]*?enabled = true[\s\S]*?verify_jwt = false/);
  });
});
