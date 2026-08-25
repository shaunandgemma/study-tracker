import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  PUBLIC_INFORMATION_ROUTE_HASHES,
  getPublicInformationRoute
} from '../src/features/publicInformation/publicInformationRoutes.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Step 010C3 public customer information screens', async t => {
  await t.test('only the four exact public hashes resolve', () => {
    assert.deepEqual(PUBLIC_INFORMATION_ROUTE_HASHES, {
      privacy: '#legal/privacy',
      refunds: '#legal/refund-cancellation',
      support: '#support',
      terms: '#legal/terms'
    });
    assert.equal(getPublicInformationRoute({ hash: '#legal/terms' }), 'terms');
    assert.equal(getPublicInformationRoute({ hash: '#LEGAL/PRIVACY' }), 'privacy');
    assert.equal(getPublicInformationRoute({ hash: '#legal/refund-cancellation' }), 'refunds');
    assert.equal(getPublicInformationRoute({ hash: '#support' }), 'support');
    assert.equal(getPublicInformationRoute({ hash: '#legal/terms/extra' }), null);
    assert.equal(getPublicInformationRoute({ hash: '#support?email=forbidden' }), null);
    assert.equal(getPublicInformationRoute({ hash: '#payment/success' }), null);
  });

  await t.test('the app exposes public information before authentication gates', () => {
    const app = read('src/App.jsx');
    assert.match(app, /getPublicInformationRoute/);
    assert.match(app, /addEventListener\?\.\('hashchange', updateEntry\)/);
    assert.ok(app.indexOf('if (publicInformationRoute)') < app.indexOf('if (loadingAuth)'));
    assert.ok(app.indexOf('if (publicInformationRoute)') < app.indexOf('if (!currentUser)'));
    assert.match(app, /<PublicInformationEntry/);
  });

  await t.test('all four draft screens fail closed on unresolved individual-seller information', () => {
    const entry = read('src/features/publicInformation/PublicInformationEntry.jsx');
    assert.match(entry, /Draft — not approved for live sales/);
    assert.match(entry, /individual UK app creator/);
    assert.match(entry, /Seller and professional review required before live payments can be enabled/);
    assert.match(entry, /SELLER REVIEW REQUIRED/);
    assert.match(entry, /£19\.99/);
    assert.match(entry, /renew annually/);
    assert.match(entry, /LATT LEARNING/);
    assert.match(entry, /Stripe’s hosted Customer Portal/);
    assert.match(entry, /does not receive or store full card details/);
    assert.match(entry, /Statutory rights remain unaffected/);
    assert.doesNotMatch(entry, /functions\.invoke|STRIPE_LIVE_RESTRICTED_KEY|SUPABASE_SERVICE_ROLE_KEY/);
  });

  await t.test('customer-information links are present in public, signed-out, payment and signed-in surfaces', () => {
    const links = read('src/features/publicInformation/PublicInformationLinks.jsx');
    const app = read('src/App.jsx');
    const demoGate = read('src/features/demo/DemoAccessGate.jsx');
    const paymentControls = read('src/features/payments/ExamPaymentControls.jsx');
    const paymentReturn = read('src/features/payments/PaymentReturnEntry.jsx');
    assert.match(links, /Terms/);
    assert.match(links, /Privacy/);
    assert.match(links, /Refunds & cancellation/);
    assert.match(links, /Support/);
    assert.match(app, /<PublicInformationLinks/);
    assert.match(demoGate, /<PublicInformationLinks/);
    assert.match(paymentControls, /<PublicInformationLinks compact/);
    assert.match(paymentReturn, /<PublicInformationLinks/);
  });

  await t.test('both browser payment flags and all live functions remain disabled by default', () => {
    const env = read('.env.example');
    const config = read('supabase/config.toml');
    assert.match(env, /VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED=false/);
    assert.match(env, /VITE_STRIPE_LIVE_PAYMENTS_ENABLED=false/);
    assert.match(config, /\[functions\.create-exam-checkout-live\][\s\S]*?enabled = false[\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.create-stripe-portal-session-live\][\s\S]*?enabled = false[\s\S]*?verify_jwt = true/);
    assert.match(config, /\[functions\.stripe-webhook-live\][\s\S]*?enabled = false[\s\S]*?verify_jwt = false/);
  });
});
