import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const migrationUrl = new URL(
  '../supabase/migrations/20260902_create_private_exam_entitlements.sql',
  import.meta.url
);
const migration = fs.readFileSync(migrationUrl, 'utf8');
const verificationScripts = [
  '../tests/sql/exam_entitlements_post_deployment_verification.sql',
  '../tests/sql/exam_entitlements_post_deployment_privilege_verification.sql'
].map(path => fs.readFileSync(new URL(path, import.meta.url), 'utf8'));

test('Step 004H private exam-entitlement migration', async t => {
  await t.test('1. creates only the new entitlement table inside one committed transaction', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.match(migration, /CREATE TABLE public\.exam_entitlements/);
    assert.equal((migration.match(/CREATE TABLE/gi) || []).length, 1);
    assert.doesNotMatch(migration, /ALTER TABLE public\.(?!exam_entitlements\b)/);
  });

  await t.test('2. binds one learner to one canonical exam', () => {
    assert.match(migration, /user_id UUID NOT NULL REFERENCES auth\.users\(id\) ON DELETE RESTRICT/);
    assert.match(migration, /PRIMARY KEY \(user_id, exam_id\)/);
    for (const examId of ['aws-saa-c03', 'terraform-associate-004', 'comptia-sec-plus']) {
      assert.match(migration, new RegExp(`'${examId}'`));
    }
  });

  await t.test('3. stores only a controlled status and valid access window', () => {
    assert.match(migration, /status TEXT NOT NULL DEFAULT 'active'/);
    assert.match(migration, /CHECK \(status IN \('active', 'revoked'\)\)/);
    assert.match(migration, /starts_at TIMESTAMPTZ NOT NULL/);
    assert.match(migration, /expires_at TIMESTAMPTZ NOT NULL/);
    assert.match(migration, /CHECK \(expires_at > starts_at\)/);
  });

  await t.test('4. enables RLS with exactly one own-row SELECT policy', () => {
    assert.match(migration, /ALTER TABLE public\.exam_entitlements ENABLE ROW LEVEL SECURITY/);
    assert.match(migration, /CREATE POLICY "Learners read own exam entitlements"[\s\S]*?FOR SELECT[\s\S]*?TO authenticated[\s\S]*?USING \(auth\.uid\(\) = user_id\)/);
    assert.equal((migration.match(/CREATE POLICY/gi) || []).length, 1);
    assert.doesNotMatch(migration, /FOR (?:INSERT|UPDATE|DELETE|ALL)/i);
  });

  await t.test('5. gives authenticated browsers SELECT and no write privilege', () => {
    assert.match(migration, /REVOKE ALL PRIVILEGES[\s\S]*?ON TABLE public\.exam_entitlements[\s\S]*?FROM PUBLIC, anon, authenticated/);
    assert.match(migration, /GRANT SELECT[\s\S]*?ON TABLE public\.exam_entitlements[\s\S]*?TO authenticated/);
    assert.doesNotMatch(migration, /GRANT\s+(?:INSERT|UPDATE|DELETE|ALL)/i);
  });

  await t.test('6. creates no browser-callable entitlement writer', () => {
    assert.doesNotMatch(migration, /CREATE(?: OR REPLACE)? FUNCTION/i);
    assert.doesNotMatch(migration, /CREATE TRIGGER/i);
    assert.doesNotMatch(migration, /SECURITY DEFINER/i);
  });

  await t.test('7. contains no payment or protected-content storage', () => {
    assert.doesNotMatch(migration, /CREATE TABLE public\.(?:payments|subscriptions|checkout_sessions|webhook_events)/i);
    assert.doesNotMatch(migration, /card_number|cardholder|payment_secret|client_secret|learning_content|question_snapshot/i);
  });

  await t.test('8. fails closed if the table exists and verifies the empty secure result', () => {
    assert.match(migration, /to_regclass\('public\.exam_entitlements'\) IS NOT NULL/);
    assert.match(migration, /COUNT\(\*\) FROM public\.exam_entitlements\) <> 0/);
    assert.match(migration, /relrowsecurity/);
    assert.match(migration, /cmd <> 'SELECT'/);
    assert.match(migration, /has_table_privilege\('anon'/);
    assert.match(migration, /has_table_privilege\([\s\S]*?'authenticated'/);
  });

  await t.test('9. post-deployment verification scripts are rollback-only reads', () => {
    for (const script of verificationScripts) {
      const statements = script.replace(/^--.*$/gm, '');
      assert.equal((statements.match(/^BEGIN;$/gm) || []).length, 1);
      assert.equal((statements.match(/^SET TRANSACTION READ ONLY;$/gm) || []).length, 1);
      assert.equal((statements.match(/^ROLLBACK;$/gm) || []).length, 1);
      assert.doesNotMatch(
        statements,
        /^\s*(?:INSERT|UPDATE|DELETE|ALTER|CREATE|DROP|TRUNCATE|GRANT|REVOKE|COMMIT)\b/im
      );
    }
  });
});
