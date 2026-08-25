import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  PUBLIC_INFORMATION_PUBLICATION_GATE,
  PUBLIC_INFORMATION_PUBLICATION_MANIFEST,
  PUBLIC_INFORMATION_REQUIRED_ROUTES,
  fingerprintPublicInformationContent,
  validatePublicInformationPublicationReadiness
} from '../src/features/publicInformation/publicInformationPublicationReadiness.js';
import { PUBLIC_INFORMATION_ROUTE_HASHES } from '../src/features/publicInformation/publicInformationRoutes.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
async function approvedFixture(content = approvedScreenContent()) {
  const manifest = structuredClone(PUBLIC_INFORMATION_PUBLICATION_MANIFEST);
  manifest.publicationStatus = 'approved';
  manifest.seller = {
    capacity: 'individual',
    legalName: 'Alex Example',
    tradingName: 'Learning All Things Tech',
    publicContactAddress: '1 Example Street, Example Town, EX1 1EX',
    country: 'United Kingdom',
    publicContactEmail: 'contact@example.test'
  };
  manifest.support = {
    monitoredEmail: 'support@example.test',
    responseTarget: 'Two working days',
    complaintsRoute: 'Written escalation to the published support address'
  };
  manifest.legal = {
    termsApproved: true,
    refundCancellationApproved: true,
    reviewRecord: 'Approved legal review record 2026-08-25'
  };
  manifest.privacy = {
    controllerIdentityApproved: true,
    lawfulBasisInventoryApproved: true,
    rightsAndIcoWordingApproved: true,
    reviewRecord: 'Approved privacy review record 2026-08-25'
  };
  manifest.retention = {
    scheduleApproved: true,
    scheduleReference: 'Approved retention schedule version 1'
  };
  manifest.processors = {
    inventoryApproved: true,
    entries: [
      { name: 'Stripe', purpose: 'Payment processing', locationOrTransferSafeguard: 'Approved production record' },
      { name: 'Supabase', purpose: 'Authentication and application data', locationOrTransferSafeguard: 'Approved production record' }
    ]
  };
  manifest.coolingOff = {
    decisionApproved: true,
    immediateDigitalAccessWording: 'Approved immediate digital-access wording'
  };
  manifest.tax = {
    priceTreatment: 'tax_inclusive',
    customerWording: 'The displayed annual price includes applicable tax.',
    adviceRecord: 'Approved tax decision record 2026-08-25'
  };
  manifest.statementDescriptor = {
    value: 'LATT LEARNING',
    sellerApproved: true,
    stripeAccepted: true
  };
  manifest.screens = Object.fromEntries(await Promise.all(PUBLIC_INFORMATION_REQUIRED_ROUTES.map(async route => [
    route,
    {
      hash: PUBLIC_INFORMATION_ROUTE_HASHES[route],
      status: 'approved',
      reviewedAt: '2026-08-25T12:00:00.000Z',
      contentFingerprint: await fingerprintPublicInformationContent(content[route])
    }
  ])));
  return manifest;
}

const approvedScreenContent = () => Object.fromEntries(
  PUBLIC_INFORMATION_REQUIRED_ROUTES.map(route => [route, `Approved final customer information for ${route}.`])
);

test('Step 010C4 fail-closed public-information publication readiness', async t => {
  await t.test('the checked-in manifest is explicitly blocked for all four exact routes', () => {
    assert.deepEqual(PUBLIC_INFORMATION_REQUIRED_ROUTES, ['terms', 'privacy', 'refunds', 'support']);
    assert.equal(PUBLIC_INFORMATION_PUBLICATION_MANIFEST.publicationStatus, 'blocked');
    assert.equal(PUBLIC_INFORMATION_PUBLICATION_GATE.ready, false);
    assert.ok(PUBLIC_INFORMATION_PUBLICATION_GATE.blockers.length >= 30);

    for (const route of PUBLIC_INFORMATION_REQUIRED_ROUTES) {
      const screen = PUBLIC_INFORMATION_PUBLICATION_MANIFEST.screens[route];
      assert.equal(screen.hash, PUBLIC_INFORMATION_ROUTE_HASHES[route]);
      assert.equal(screen.status, 'draft');
      assert.equal(screen.reviewedAt, null);
      assert.equal(screen.contentFingerprint, null);
    }
  });

  await t.test('a complete synthetic approval manifest can pass without changing the checked-in gate', async () => {
    const content = approvedScreenContent();
    const result = await validatePublicInformationPublicationReadiness(
      await approvedFixture(content),
      content
    );
    assert.deepEqual(result, { ready: true, blockers: [] });
    assert.equal(PUBLIC_INFORMATION_PUBLICATION_GATE.ready, false);
  });

  await t.test('every required seller, legal, privacy, retention, processor, cooling-off and tax decision fails closed', async () => {
    const cases = [
      ['seller', 'capacity', 'company', /individual seller capacity/],
      ['seller', 'legalName', null, /individual seller legal name/],
      ['seller', 'tradingName', 'Example Limited', /approved trading name/],
      ['seller', 'publicContactAddress', '', /safe public contact address/],
      ['support', 'monitoredEmail', 'not-an-email', /monitored support email/],
      ['support', 'responseTarget', null, /support response target/],
      ['legal', 'termsApproved', false, /Terms legal approval/],
      ['legal', 'refundCancellationApproved', false, /refund and cancellation legal approval/],
      ['privacy', 'lawfulBasisInventoryApproved', false, /lawful-basis inventory approval/],
      ['retention', 'scheduleApproved', false, /retention schedule approval/],
      ['processors', 'inventoryApproved', false, /processor inventory approval/],
      ['processors', 'entries', [], /processor inventory/],
      ['coolingOff', 'decisionApproved', false, /cooling-off decision approval/],
      ['tax', 'priceTreatment', 'undecided', /tax-inclusive price decision/],
      ['statementDescriptor', 'sellerApproved', false, /seller statement-descriptor approval/],
      ['statementDescriptor', 'stripeAccepted', false, /Stripe statement-descriptor acceptance/]
    ];

    for (const [section, field, value, expected] of cases) {
      const content = approvedScreenContent();
      const manifest = await approvedFixture(content);
      manifest[section][field] = value;
      const result = await validatePublicInformationPublicationReadiness(manifest, content);
      assert.equal(result.ready, false, `${section}.${field} must block publication`);
      assert.match(result.blockers.join('\n'), expected);
    }
  });

  await t.test('each screen requires its exact route, approval, review date, fingerprint and placeholder-free content', async () => {
    for (const route of PUBLIC_INFORMATION_REQUIRED_ROUTES) {
      const content = approvedScreenContent();
      const wrongRoute = await approvedFixture(content);
      wrongRoute.screens[route].hash = '#wrong';
      assert.match(
        (await validatePublicInformationPublicationReadiness(wrongRoute, content)).blockers.join('\n'),
        new RegExp(`${route} screen does not use its exact approved route`)
      );

      const draft = await approvedFixture(content);
      draft.screens[route].status = 'draft';
      assert.match(
        (await validatePublicInformationPublicationReadiness(draft, content)).blockers.join('\n'),
        new RegExp(`${route} screen is not approved`)
      );

      const noReview = await approvedFixture(content);
      noReview.screens[route].reviewedAt = null;
      assert.match(
        (await validatePublicInformationPublicationReadiness(noReview, content)).blockers.join('\n'),
        new RegExp(`${route} screen has no valid review date`)
      );

      const noFingerprint = await approvedFixture(content);
      noFingerprint.screens[route].contentFingerprint = 'not-a-fingerprint';
      assert.match(
        (await validatePublicInformationPublicationReadiness(noFingerprint, content)).blockers.join('\n'),
        new RegExp(`${route} screen has no approved SHA-256 content fingerprint`)
      );

      const placeholderContent = approvedScreenContent();
      const placeholderManifest = await approvedFixture(placeholderContent);
      placeholderContent[route] = 'SELLER REVIEW REQUIRED';
      assert.match(
        (await validatePublicInformationPublicationReadiness(placeholderManifest, placeholderContent)).blockers.join('\n'),
        new RegExp(`${route} screen still contains a review placeholder`)
      );

      const changedContent = approvedScreenContent();
      const fingerprintManifest = await approvedFixture(changedContent);
      changedContent[route] = `Changed customer information for ${route}.`;
      assert.match(
        (await validatePublicInformationPublicationReadiness(fingerprintManifest, changedContent)).blockers.join('\n'),
        new RegExp(`${route} screen content does not match its approved SHA-256 fingerprint`)
      );
    }
  });

  await t.test('the visible draft banner is driven by the blocked gate and no payment runtime is enabled', () => {
    const entry = read('src/features/publicInformation/PublicInformationEntry.jsx');
    const manifest = read('src/features/publicInformation/publicInformationPublicationReadiness.js');
    const env = read('.env.example');
    const config = read('supabase/config.toml');

    assert.match(entry, /PUBLIC_INFORMATION_PUBLICATION_GATE/);
    assert.match(entry, /data-publication-ready=\{String\(PUBLIC_INFORMATION_PUBLICATION_GATE\.ready\)\}/);
    assert.match(manifest, /publicationStatus: 'blocked'/);
    assert.doesNotMatch(manifest, /functions\.invoke|fetch\(|STRIPE_LIVE_RESTRICTED_KEY|SUPABASE_SERVICE_ROLE_KEY/);
    assert.match(env, /VITE_STRIPE_SANDBOX_PAYMENTS_ENABLED=false/);
    assert.match(env, /VITE_STRIPE_LIVE_PAYMENTS_ENABLED=false/);
    assert.match(config, /\[functions\.create-exam-checkout-live\][\s\S]*?enabled = false/);
    assert.match(config, /\[functions\.create-stripe-portal-session-live\][\s\S]*?enabled = false/);
    assert.match(config, /\[functions\.stripe-webhook-live\][\s\S]*?enabled = false/);
  });
});
