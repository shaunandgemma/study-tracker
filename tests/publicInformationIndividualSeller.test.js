import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  PUBLIC_INFORMATION_PUBLICATION_GATE,
  PUBLIC_INFORMATION_PUBLICATION_MANIFEST,
  PUBLIC_INFORMATION_PUBLICATION_SCHEMA_VERSION
} from '../src/features/publicInformation/publicInformationPublicationReadiness.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Step 010C5 individual UK app-creator publication model', async t => {
  await t.test('the checked-in seller is an individual using the exact trading name', () => {
    assert.equal(PUBLIC_INFORMATION_PUBLICATION_SCHEMA_VERSION, 2);
    assert.deepEqual(PUBLIC_INFORMATION_PUBLICATION_MANIFEST.seller, {
      capacity: 'individual',
      legalName: null,
      tradingName: 'Learning All Things Tech',
      publicContactAddress: null,
      country: 'United Kingdom',
      publicContactEmail: null
    });
    assert.equal(PUBLIC_INFORMATION_PUBLICATION_GATE.ready, false);
  });

  await t.test('no personal seller value has been collected or published', () => {
    const manifest = read('src/features/publicInformation/publicInformationPublicationReadiness.js');
    const entry = read('src/features/publicInformation/PublicInformationEntry.jsx');

    assert.doesNotMatch(manifest, /legalTraderName|publicBusinessAddress|businessCountry/);
    assert.doesNotMatch(entry, /Example Learning Limited|1 Example Street|contact@example\.test/);
    assert.match(entry, /individual UK app creator/);
    assert.match(entry, /seller’s legal name, safe public contact address and monitored support email remain seller-review fields/);
    assert.match(entry, /SELLER REVIEW REQUIRED/);
    assert.match(entry, /SELLER DECISION REQUIRED/);
  });

  await t.test('public and purchase copy use seller language without changing the product offer', () => {
    const entry = read('src/features/publicInformation/PublicInformationEntry.jsx');
    const paymentControls = read('src/features/payments/ExamPaymentControls.jsx');

    assert.match(entry, /Seller and contract details/);
    assert.match(entry, /Seller and professional review required before live payments can be enabled/);
    assert.match(entry, /Seller and professional review pending/);
    assert.match(paymentControls, /Seller and professional review remain required before live payments/);
    assert.match(paymentControls, /£19\.99/);
    assert.match(paymentControls, /LATT LEARNING/);
  });

  await t.test('payment and deployment boundaries remain disabled', () => {
    const env = read('.env.example');
    const config = read('supabase/config.toml');

    assert.match(env, /VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED=false/);
    assert.match(env, /VITE_STRIPE_LIVE_PAYMENTS_ENABLED=false/);
    assert.match(config, /\[functions\.create-exam-checkout-live\][\s\S]*?enabled = false/);
    assert.match(config, /\[functions\.create-stripe-portal-session-live\][\s\S]*?enabled = false/);
    assert.match(config, /\[functions\.stripe-webhook-live\][\s\S]*?enabled = false/);
  });
});
