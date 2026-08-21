import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationPath = 'supabase/migrations/20260901_create_private_learner_item_progress.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');

test('20260901 creates only private authenticated learner progress storage', async t => {
  await t.test('1. migration has one explicit transaction boundary', () => {
    assert.equal((migration.match(/^BEGIN;/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;/gm) || []).length, 1);
  });

  await t.test('2. migration fails closed if the table already exists', () => {
    assert.match(migration, /to_regclass\('public\.learner_item_progress'\) IS NOT NULL/);
    assert.match(migration, /learner_item_progress already exists/i);
    assert.doesNotMatch(executable, /DROP\s+TABLE/i);
  });

  await t.test('3. schema uses the approved private per-item identity', () => {
    assert.match(migration, /CREATE TABLE public\.learner_item_progress/);
    assert.match(migration, /user_id UUID NOT NULL REFERENCES auth\.users\(id\) ON DELETE RESTRICT/);
    assert.match(migration, /PRIMARY KEY \(user_id, exam_id, progress_type, content_id\)/);
    assert.match(migration, /'study_item'/);
    assert.match(migration, /'question_flag'/);
    assert.match(migration, /'troubleshooting_challenge'/);
    assert.match(migration, /'workspace_state'/);
  });

  await t.test('4. progress data is small, structured and restricted to approved keys', () => {
    assert.match(migration, /jsonb_typeof\(progress_data\) = 'object'/);
    assert.match(migration, /octet_length\(progress_data::text\) <= 65536/);
    assert.match(migration, /learner_item_progress_allowed_keys_check/);
    assert.match(migration, /learner_item_progress_value_types_check/);
  });

  await t.test('5. trusted trigger owns inserts and protects immutable identity', () => {
    assert.match(migration, /requester_id UUID := auth\.uid\(\)/);
    assert.match(migration, /NEW\.user_id := requester_id/);
    assert.match(migration, /BEFORE INSERT OR UPDATE ON public\.learner_item_progress/);
    assert.match(migration, /Progress ownership and content identity are immutable/);
    assert.match(migration, /NEW\.created_at := OLD\.created_at/);
    assert.match(migration, /NEW\.updated_at := trusted_now/);
  });

  await t.test('6. only authenticated own-row policies are created', () => {
    assert.match(migration, /CREATE POLICY "Learners read own item progress"[\s\S]*?FOR SELECT[\s\S]*?TO authenticated[\s\S]*?USING \(auth\.uid\(\) = user_id\)/);
    assert.match(migration, /CREATE POLICY "Learners insert own item progress"[\s\S]*?FOR INSERT[\s\S]*?TO authenticated[\s\S]*?WITH CHECK \(auth\.uid\(\) = user_id\)/);
    assert.match(migration, /CREATE POLICY "Learners update own item progress"[\s\S]*?FOR UPDATE[\s\S]*?TO authenticated[\s\S]*?USING \(auth\.uid\(\) = user_id\)[\s\S]*?WITH CHECK \(auth\.uid\(\) = user_id\)/);
    assert.doesNotMatch(migration, /CREATE POLICY[\s\S]*?TO anon/);
  });

  await t.test('7. browser grants are limited to authenticated read, insert and update', () => {
    assert.match(migration, /REVOKE ALL PRIVILEGES[\s\S]*?ON TABLE public\.learner_item_progress[\s\S]*?FROM PUBLIC, anon, authenticated/);
    assert.match(migration, /GRANT SELECT, INSERT, UPDATE[\s\S]*?ON TABLE public\.learner_item_progress[\s\S]*?TO authenticated/);
    assert.doesNotMatch(migration, /GRANT[^;]*\bTO anon\b/i);
    assert.doesNotMatch(migration, /GRANT\s+(?:ALL|DELETE|TRUNCATE|REFERENCES|TRIGGER)/i);
  });

  await t.test('8. migration creates no entitlement, signup or payment object', () => {
    for (const forbiddenDefinition of [
      /CREATE\s+TABLE\s+(?:public\.)?exam_entitlements/i,
      /CREATE\s+TABLE\s+(?:public\.)?exam_catalogue/i,
      /CREATE\s+TABLE\s+(?:public\.)?learner_progress_imports/i,
      /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION[^;]*(?:payment|checkout|subscription)/i
    ]) {
      assert.doesNotMatch(executable, forbiddenDefinition);
    }
  });

  await t.test('9. migration does not alter existing application tables or data', () => {
    assert.doesNotMatch(executable, /\bDELETE\s+FROM\b/i);
    assert.doesNotMatch(executable, /^\s*UPDATE\s+/gmi);
    assert.doesNotMatch(executable, /\bINSERT\s+INTO\b/i);
    assert.doesNotMatch(executable, /^\s*TRUNCATE\s+/gmi);
    assert.doesNotMatch(executable, /\bALTER\s+TABLE\s+(?!public\.learner_item_progress\b)/i);

    for (const table of [
      'exam_attempts',
      'exam_questions',
      'question_topics',
      'user_learning_path_progress',
      'user_learning_path_resources',
      'follow_along_published_programmes',
      'follow_along_author_drafts',
      'follow_along_release_candidates'
    ]) {
      assert.doesNotMatch(executable, new RegExp(`\\b${table}\\b`, 'i'));
    }
  });
});
