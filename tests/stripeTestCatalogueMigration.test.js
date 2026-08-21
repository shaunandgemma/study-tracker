import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  annualExamPromotion,
  formatAnnualExamPrice
} from '../src/features/payments/examPricing.js';

const migrationPath = 'supabase/migrations/20260909_seed_stripe_test_exam_catalogue.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');
const postDeploymentVerification = readFileSync(
  'tests/sql/stripe_test_catalogue_post_deployment_verification.sql',
  'utf8'
);

const mappings = [
  ['aws-saa-c03', 'prod_V73CMqyLhOZvIe', 'price_1U6p6S3Ne8JYQdqLX9pxvu22'],
  ['terraform-associate-004', 'prod_V73DdOKBBVtyOf', 'price_1U6p7A3Ne8JYQdqLSFLCNE8W'],
  ['comptia-sec-plus', 'prod_V73E3DraGTbgV2', 'price_1U6p7f3Ne8JYQdqLFEQS3gPb']
];

test('Step 008D exact Stripe test-mode catalogue', async t => {
  await t.test('1. inserts exactly the three verified sandbox Product and Price mappings', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.equal((executable.match(/INSERT INTO public\.payment_exam_products/gi) || []).length, 1);
    for (const [examId, productId, priceId] of mappings) {
      assert.match(migration, new RegExp(`'${examId}'`));
      assert.match(migration, new RegExp(`'${productId}'`));
      assert.match(migration, new RegExp(`'${priceId}'`));
    }
  });

  await t.test('2. enables only yearly GBP 19.99 test mappings and creates no live catalogue row', () => {
    assert.equal((migration.match(/\n\s+1999,\n\s+TRUE/g) || []).length, 3);
    assert.equal((migration.match(/\n\s+FALSE,\n\s+'prod_/g) || []).length, 3);
    assert.doesNotMatch(executable, /\n\s+TRUE,\n\s+'prod_/);
    assert.match(migration, /WHERE livemode = FALSE/);
    assert.match(migration, /WHERE livemode = TRUE/);
    assert.match(migration, /currency = 'gbp' AND unit_amount = 1999 AND enabled = TRUE/);
  });

  await t.test('3. refuses to overwrite an existing catalogue or seed after payment activity', () => {
    assert.match(migration, /protected Stripe product catalogue is not empty/);
    assert.match(migration, /payment activity exists before the test catalogue seed/);
    assert.doesNotMatch(executable, /ON CONFLICT|UPDATE\s+public\.payment_exam_products/i);
  });

  await t.test('4. preserves payment activity, entitlements and every learner progress table', () => {
    for (const table of [
      'payment_customers',
      'payment_exam_subscriptions',
      'payment_webhook_events',
      'exam_entitlement_events',
      'exam_entitlements',
      'learner_item_progress',
      'exam_attempts',
      'user_learning_path_progress',
      'user_learning_path_resources'
    ]) {
      assert.match(migration, new RegExp(`COUNT\\(\\*\\) FROM public\\.${table}`));
    }
    assert.doesNotMatch(executable, /INSERT INTO public\.(?!payment_exam_products)/i);
    assert.doesNotMatch(executable, /\b(?:UPDATE|DELETE|TRUNCATE)\s+(?:TABLE\s+)?public\./i);
  });

  await t.test('5. preserves the private no-direct-access catalogue boundary', () => {
    assert.match(migration, /has_table_privilege\('anon', 'public\.payment_exam_products', 'SELECT'\)/);
    assert.match(migration, /has_table_privilege\('authenticated', 'public\.payment_exam_products', 'SELECT'\)/);
    assert.match(migration, /has_table_privilege\('service_role', 'public\.payment_exam_products', 'SELECT'\)/);
  });

  await t.test('6. retains £29.99 only as local comparison display and £19.99 as the current price', () => {
    assert.deepEqual(annualExamPromotion, {
      billingInterval: 'year',
      comparisonAmountMinor: 2999,
      currency: 'GBP',
      currentAmountMinor: 1999,
      label: 'Limited-time annual price'
    });
    assert.equal(formatAnnualExamPrice(annualExamPromotion.comparisonAmountMinor), '£29.99');
    assert.equal(formatAnnualExamPrice(annualExamPromotion.currentAmountMinor), '£19.99');
    assert.doesNotMatch(migration, /2999|29\.99/);
  });

  await t.test('7. contains no Stripe secret, browser operation, entitlement grant or external call', () => {
    assert.doesNotMatch(executable, /sk_(?:test|live)_|whsec_|https?:\/\/|fetch\s*\(|VITE_|localStorage|sessionStorage/i);
    assert.doesNotMatch(executable, /INSERT INTO public\.exam_entitlements|UPDATE public\.exam_entitlements/i);
    assert.doesNotMatch(executable, /CREATE\s+(?:PRODUCT|PRICE|CUSTOMER|CHECKOUT|SUBSCRIPTION)/i);
  });

  await t.test('8. post-deployment verification is read-only, rollback-only and checks all boundaries', () => {
    const statements = postDeploymentVerification.replace(/^\s*--.*$/gm, '');
    assert.equal((statements.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((statements.match(/^SET TRANSACTION READ ONLY;$/gm) || []).length, 1);
    assert.equal((statements.match(/^ROLLBACK;$/gm) || []).length, 1);
    assert.equal((statements.match(/^COMMIT;$/gm) || []).length, 0);
    assert.doesNotMatch(
      statements,
      /^\s*(?:INSERT|UPDATE|DELETE|ALTER|CREATE|DROP|TRUNCATE|GRANT|REVOKE|CALL)\b/im
    );
    assert.match(statements, /version = '20260909'/);
    assert.match(statements, /exact_three_verified_test_mappings/);
    assert.match(statements, /three_enabled_gbp_1999_yearly_catalogue_rows/);
    assert.match(statements, /no_live_stripe_mapping/);
    assert.match(statements, /no_customer_subscription_webhook_or_entitlement_event/);
    assert.match(statements, /catalogue_has_no_direct_application_role_access/);
    assert.match(statements, /learner_progress_tables_keep_rls/);
  });
});
