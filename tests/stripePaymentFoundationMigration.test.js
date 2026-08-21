import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationPath = 'supabase/migrations/20260908_create_private_stripe_payment_foundation.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');
const postDeploymentVerification = readFileSync(
  'tests/sql/stripe_payment_foundation_post_deployment_verification.sql',
  'utf8'
);

const privateTables = [
  'payment_exam_products',
  'payment_customers',
  'payment_exam_subscriptions',
  'payment_webhook_events',
  'exam_entitlement_events'
];

const functionSignature = /public\.reconcile_stripe_exam_entitlement\([\s\S]*?\)\s+RETURNS JSONB[\s\S]*?SECURITY DEFINER/;

test('Step 008B private Stripe payment foundation migration', async t => {
  await t.test('1. uses one guarded transaction and creates only the five private payment tables', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);

    const createdPublicTables = [
      ...migration.matchAll(/CREATE TABLE public\.([a-z0-9_]+)/gi)
    ].map(match => match[1]);

    assert.deepEqual(createdPublicTables, privateTables);
    assert.match(migration, /an approved entitlement, content or progress prerequisite is missing/i);
    assert.match(migration, /public\.% already exists/);
  });

  await t.test('2. supports only the three canonical exams with separated Stripe test and live mappings', () => {
    for (const examId of ['aws-saa-c03', 'terraform-associate-004', 'comptia-sec-plus']) {
      assert.match(migration, new RegExp(`'${examId}'`));
    }

    assert.match(migration, /PRIMARY KEY \(exam_id, livemode\)/);
    assert.match(migration, /UNIQUE \(stripe_product_id, livemode\)/);
    assert.match(migration, /UNIQUE \(stripe_annual_price_id, livemode\)/);
    assert.match(migration, /FOREIGN KEY \(exam_id, livemode\)/);
  });

  await t.test('3. stores no payment credentials or raw Stripe payloads', () => {
    assert.doesNotMatch(
      executable,
      /card_number|cardholder|cvc|bank_account|payment_method_details|client_secret|stripe_secret_key|webhook_secret|raw_event|raw_payload/i
    );
    assert.match(migration, /Contains no card or bank data/);
    assert.match(migration, /stores no raw card data or Stripe secret/);
  });

  await t.test('4. gives browser and service roles no direct payment-table privilege', () => {
    for (const table of privateTables) {
      assert.match(
        migration,
        new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`)
      );
    }

    assert.equal((migration.match(/CREATE POLICY/gi) || []).length, 0);
    assert.match(
      migration,
      /REVOKE ALL PRIVILEGES ON TABLE[\s\S]*?FROM PUBLIC, anon, authenticated, service_role;/
    );
    assert.match(migration, /has_table_privilege\('service_role'/);
  });

  await t.test('5. exposes one security-definer reconciliation contract only to service_role', () => {
    assert.match(migration, functionSignature);
    assert.equal((migration.match(/CREATE OR REPLACE FUNCTION/gi) || []).length, 1);
    assert.match(
      migration,
      /REVOKE ALL ON FUNCTION public\.reconcile_stripe_exam_entitlement\([\s\S]*?FROM PUBLIC, anon, authenticated;/
    );
    assert.match(
      migration,
      /GRANT EXECUTE ON FUNCTION public\.reconcile_stripe_exam_entitlement\([\s\S]*?TO service_role;/
    );
    assert.match(migration, /has_function_privilege\([\s\S]*?'service_role'/);
  });

  await t.test('6. validates the exact enabled product, price, exam and Stripe mode', () => {
    assert.match(migration, /WHERE exam_id = p_exam_id/);
    assert.match(migration, /AND livemode = p_livemode/);
    assert.match(migration, /AND stripe_product_id = p_stripe_product_id/);
    assert.match(migration, /AND stripe_annual_price_id = p_stripe_price_id/);
    assert.match(migration, /AND enabled = TRUE/);
    assert.match(migration, /product, price, exam or mode is not enabled/i);
  });

  await t.test('7. makes delivery idempotent, rejects ownership changes and ignores stale events', () => {
    assert.match(migration, /ON CONFLICT \(stripe_event_id\) DO NOTHING/);
    assert.match(migration, /inserted_event_count = 0/);
    assert.match(migration, /'duplicate', TRUE/);
    assert.match(migration, /Customer ownership does not match/);
    assert.match(migration, /Subscription ownership or exact-exam mapping changed unexpectedly/);
    assert.match(migration, /p_provider_event_created_at < existing_subscription\.latest_provider_event_created_at/);
    assert.match(migration, /safe_error_code = 'stale_provider_event'/);
  });

  await t.test('8. grants access only from an active paid period and never adds a local year', () => {
    assert.match(migration, /p_access_action = 'activate'/);
    assert.match(migration, /p_provider_status NOT IN \('active', 'trialing'\)/);
    assert.match(migration, /p_paid_through IS DISTINCT FROM p_current_period_end/);
    assert.match(migration, /p_paid_through <= clock_timestamp\(\)/);
    assert.match(migration, /expires_at = GREATEST\(exam_entitlements\.expires_at, EXCLUDED\.expires_at\)/);
    assert.doesNotMatch(executable, /expires_at\s*\+|\+\s*INTERVAL\s*'1 year'|365\s*\*\s*INTERVAL/i);
  });

  await t.test('9. revokes access without deleting entitlement, content or learner progress', () => {
    assert.match(migration, /p_access_action = 'revoke'/);
    assert.match(migration, /SET status = 'revoked'/);
    assert.doesNotMatch(executable, /DELETE\s+FROM/i);
    assert.doesNotMatch(executable, /UPDATE\s+public\.(?:learner_item_progress|exam_attempts|user_learning_path_progress|user_learning_path_resources)/i);
    assert.doesNotMatch(executable, /INSERT\s+INTO\s+public\.(?:learner_item_progress|exam_attempts|user_learning_path_progress|user_learning_path_resources)/i);
  });

  await t.test('10. preserves existing access and progress counts and creates an empty foundation', () => {
    assert.match(migration, /CREATE TEMP TABLE step008b_existing_row_guard/);

    for (const table of [
      'exam_entitlements',
      'learner_content_items',
      'learner_item_progress',
      'exam_attempts',
      'user_learning_path_progress',
      'user_learning_path_resources'
    ]) {
      assert.match(migration, new RegExp(`COUNT\\(\\*\\) FROM public\\.${table}`));
    }

    for (const table of privateTables) {
      assert.match(migration, new RegExp(`COUNT\\(\\*\\) FROM public\\.${table}`));
    }

    assert.match(migration, /the existing learner entitlement privilege boundary changed/);
    assert.match(migration, /the payment foundation was not created empty/);
  });

  await t.test('11. contains no Stripe, Supabase, AWS, browser or deployment operation', () => {
    assert.doesNotMatch(executable, /https?:\/\/|fetch\s*\(|stripe\.com|supabase\.(?:co|com)|aws_/i);
    assert.doesNotMatch(executable, /CREATE\s+(?:PRODUCT|PRICE|CHECKOUT|CUSTOMER|SUBSCRIPTION)/i);
    assert.doesNotMatch(executable, /VITE_|localStorage|sessionStorage|window\.|document\./i);
  });

  await t.test('12. post-deployment verification is read-only and rollback-only', () => {
    const statements = postDeploymentVerification.replace(/^\s*--.*$/gm, '');

    assert.equal((statements.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((statements.match(/^SET TRANSACTION READ ONLY;$/gm) || []).length, 1);
    assert.equal((statements.match(/^ROLLBACK;$/gm) || []).length, 1);
    assert.equal((statements.match(/^COMMIT;$/gm) || []).length, 0);
    assert.doesNotMatch(
      statements,
      /^\s*(?:INSERT|UPDATE|DELETE|ALTER|CREATE|DROP|TRUNCATE|GRANT|REVOKE|CALL)\b/im
    );
    assert.match(statements, /version = '20260908'/);
    assert.match(statements, /payment_foundation_is_empty/);
    assert.match(statements, /reconciliation_function_is_service_role_only/);
    assert.match(statements, /existing_content_and_progress_tables_keep_rls/);
  });
});
