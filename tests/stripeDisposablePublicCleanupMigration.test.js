import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationPath = 'supabase/migrations/20260918_remove_disposable_payment_simulation_rows.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');

test('Step 009V disposable public cleanup migration', async t => {
  await t.test('is one serializable, locked, fail-closed transaction', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.equal((migration.match(/^DO \$\$$/gm) || []).length, 1);
    assert.match(migration, /SET TRANSACTION ISOLATION LEVEL SERIALIZABLE/);
    assert.match(migration, /pg_advisory_xact_lock/);
    assert.match(migration, /IN SHARE ROW EXCLUSIVE MODE/);
    assert.doesNotMatch(executable, /CREATE(?:\s+OR\s+REPLACE)?\s+(?:TABLE|FUNCTION)|ALTER\s+TABLE|DROP\s+|TRUNCATE/i);
  });

  await t.test('requires all prior lifecycle migrations and exact global baselines', () => {
    for (const version of ['20260912', '20260913', '20260914', '20260915', '20260916', '20260917']) {
      assert.ok(migration.includes(`'${version}'`));
    }
    assert.match(migration, /migration_count <> 6/);
    for (const [name, count] of [
      ['payment_exam_products', 3],
      ['payment_customers', 3],
      ['payment_exam_subscriptions', 3],
      ['payment_webhook_events', 26],
      ['exam_entitlement_events', 6],
      ['exam_entitlements', 3],
      ['learner_item_progress', 3],
      ['exam_attempts', 12]
    ]) assert.match(migration, new RegExp(`'${name}', ${count}`));
    for (const fingerprint of [
      '96c237275970d366a275757c9ad2709e',
      '02be1138e0ba986b57627663a324cdc9',
      '4a21373ec0ecdfb94fabf1e532e323e1'
    ]) assert.ok(migration.includes(fingerprint));
  });

  await t.test('requires exact disposable Auth, dependency and payment identities', () => {
    for (const value of [
      '8bf0e3bc-bed7-43bf-a4db-e8f788c19852',
      'a54a5e55-482f-4bd2-adc1-d58f2b4f235b',
      'latt-stripe-sim-008z@example.com',
      'aaaabbbb@yahoo.com',
      'cus_V7aJjrJFCVjm5I',
      'cus_V8BoF00adTS1kw',
      'sub_1U7LH93Ne8JYQdqLKUFDoY7s',
      'sub_1U7vR33Ne8JYQdqLwXcMRAJs',
      'in_1U7LYD3Ne8JYQdqLIobN0T3Q',
      'in_1U7vR33Ne8JYQdqLND2NszLw'
    ]) assert.ok(migration.includes(value), `missing exact cleanup identity: ${value}`);

    assert.match(migration, /disposable Auth dependency count is % instead of 0/);
    assert.match(migration, /disposable learner-data dependency count is % instead of 0/);
    assert.match(migration, /disposable staff-work dependency count is % instead of 0/);
    assert.match(migration, /auth\.refresh_tokens/);
    assert.match(migration, /public\.user_aws_connections/);
  });

  await t.test('requires all five exact entitlement transitions', () => {
    for (const value of [
      '7906ce0c-d156-46bf-be39-dd0142684e0e',
      '3ff0eafa-7315-41cd-afb5-73e21c8a7610',
      '9d70cab3-6dd0-45d8-bce4-c44d59ed3ae6',
      'ca95a91f-254a-4669-a8f8-149159963f88',
      '5934c0a2-4525-406e-8feb-4242a2d79fc3',
      'evt_1U7LHB3Ne8JYQdqLlvuMu8kp',
      'evt_1U7LYK3Ne8JYQdqLb1E3I2lR',
      'evt_3U7LYG3Ne8JYQdqL1wBsusMg',
      'evt_1U7vR63Ne8JYQdqLVViJHkme',
      'evt_1U8KM13Ne8JYQdqLBfgWwcyP'
    ]) assert.ok(migration.includes(value), `missing entitlement transition: ${value}`);
    assert.match(migration, /exact disposable entitlement transitions matched % rows/);
    assert.match(migration, /matching_rows <> 5/);
  });

  await t.test('deletes only the four approved tables with exact row-count assertions', () => {
    const deletes = [...executable.matchAll(/DELETE FROM public\.([a-z_]+)/g)].map(match => match[1]);
    assert.deepEqual(deletes, [
      'exam_entitlement_events',
      'exam_entitlements',
      'payment_exam_subscriptions',
      'payment_customers'
    ]);
    assert.equal((executable.match(/\bDELETE\s+FROM\s+public\./gi) || []).length, 4);
    assert.equal((executable.match(/\bUPDATE\s+public\./gi) || []).length, 0);
    assert.equal((executable.match(/\bINSERT\s+INTO\s+public\./gi) || []).length, 0);
    assert.match(migration, /deleted_entitlement_events <> 5/);
    assert.match(migration, /deleted_entitlements <> 2/);
    assert.match(migration, /deleted_subscriptions <> 2/);
    assert.match(migration, /deleted_customers <> 2/);
    assert.match(migration, /\+ deleted_customers <> 11/);
  });

  await t.test('retains all webhooks, catalogue mappings, paid access, Auth and progress', () => {
    for (const value of [
      'df06f24d-3620-4889-ae2a-6883d87d29a2',
      'cus_V76jo6wpeXM5Y9',
      'sub_1U6ser3Ne8JYQdqLp5IpnM4x',
      'in_1U6seq3Ne8JYQdqLl2elRcEu',
      'evt_1U6ses3Ne8JYQdqLNlUmLdJ5',
      'prod_V73CMqyLhOZvIe',
      'prod_V73DdOKBBVtyOf',
      'prod_V73E3DraGTbgV2'
    ]) assert.ok(migration.includes(value), `missing preservation identity: ${value}`);

    for (const guard of [
      'products_after IS DISTINCT FROM products_before',
      'webhooks_after IS DISTINCT FROM webhooks_before',
      'progress_after IS DISTINCT FROM progress_before',
      'attempts_after IS DISTINCT FROM attempts_before',
      'non_target_customers_after IS DISTINCT FROM non_target_customers_before',
      'non_target_subscriptions_after IS DISTINCT FROM non_target_subscriptions_before',
      'non_target_entitlements_after IS DISTINCT FROM non_target_entitlements_before',
      'non_target_entitlement_events_after IS DISTINCT FROM non_target_entitlement_events_before',
      'auth_users_after IS DISTINCT FROM auth_users_before',
      'auth_identities_after IS DISTINCT FROM auth_identities_before'
    ]) assert.ok(migration.includes(guard), `missing preservation guard: ${guard}`);

    assert.match(migration, /'payment_webhook_events', 26/);
    assert.match(migration, /'payment_customers', 1/);
    assert.match(migration, /'payment_exam_subscriptions', 1/);
    assert.match(migration, /'exam_entitlements', 1/);
    assert.match(migration, /'exam_entitlement_events', 1/);
  });

  await t.test('contains no Auth deletion, remote call, secret or deployment action', () => {
    assert.doesNotMatch(executable, /DELETE\s+FROM\s+auth\./i);
    assert.doesNotMatch(executable, /https?:\/\/|fetch\s*\(|stripe\.com|supabase\.(?:co|com)|localStorage|sessionStorage/i);
    assert.doesNotMatch(executable, /(?:sk|rk)_(?:test|live)_|whsec_/i);
  });
});
