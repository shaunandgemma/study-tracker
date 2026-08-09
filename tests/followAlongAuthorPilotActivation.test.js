import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migrationPath = 'supabase/migrations/20260811_follow_along_author_shared_storage_pilot_activation.sql';

test('Follow Along Author controlled Shared Drafts pilot activation', async t => {
  const migration = readFileSync(migrationPath, 'utf8');
  const executable = migration.replace(/--.*$/gm, '');

  await t.test('1. Activation is protected by one transaction', () => {
    assert.equal((migration.match(/^BEGIN;/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;/gm) || []).length, 1);
  });

  await t.test('2. Only the singleton Author configuration row is updated', () => {
    assert.match(migration, /UPDATE public\.follow_along_author_configuration/);
    assert.match(migration, /WHERE singleton = TRUE/);
    assert.equal((executable.match(/\bUPDATE\b/g) || []).length, 1);
  });

  await t.test('3. Shared storage moves from false to true', () => {
    assert.match(migration, /SET shared_storage_enabled = TRUE/);
    assert.match(migration, /AND shared_storage_enabled = FALSE/);
  });

  await t.test('4. Trusted approval must already be and remain disabled', () => {
    const setClause = migration.match(/SET([\s\S]*?)WHERE/i)?.[1] || '';
    assert.match(migration, /AND trusted_approval_enabled = FALSE/);
    assert.doesNotMatch(setClause, /trusted_approval_enabled/i);
    assert.doesNotMatch(migration, /trusted_approval_enabled\s*=\s*TRUE/i);
  });

  await t.test('5. Exactly one changed row is required', () => {
    assert.match(migration, /GET DIAGNOSTICS updated_rows = ROW_COUNT/);
    assert.match(migration, /IF updated_rows <> 1 THEN/);
    assert.match(migration, /RAISE EXCEPTION/);
  });

  await t.test('6. No data, schema, policy, function or unrelated feature is changed', () => {
    assert.doesNotMatch(executable, /^\s*(INSERT|DELETE|TRUNCATE|DROP|CREATE|ALTER|GRANT|REVOKE)\b/im);
    assert.doesNotMatch(executable, /exam_questions|exam_attempts|hands_on|learning_path/i);
    assert.doesNotMatch(executable, /follow_along_author_(drafts|revisions)/i);
    assert.doesNotMatch(executable, /follow_along_release_candidates/i);
  });
});
