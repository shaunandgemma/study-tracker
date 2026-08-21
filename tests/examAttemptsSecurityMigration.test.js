import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationPath = 'supabase/migrations/20260831_secure_exam_attempts.sql';
const migration = readFileSync(migrationPath, 'utf8');
const executable = migration.replace(/^\s*--.*$/gm, '');

test('20260831 secures exam attempts without changing historical rows', async t => {
  await t.test('1. migration has one explicit transaction boundary', () => {
    assert.equal((migration.match(/^BEGIN;/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;/gm) || []).length, 1);
  });

  await t.test('2. preflight requires the verified 12-row legacy boundary', () => {
    assert.match(migration, /expected exactly 12 legacy exam attempts/i);
    assert.match(migration, /attempt_count\s*<>\s*12/);
    assert.match(migration, /exam_attempts\.user_id already exists/i);
    assert.match(migration, /policy_count\s*<>\s*2/);
    assert.match(migration, /Allow public read on exam_attempts/);
    assert.match(migration, /Allow public insert on exam_attempts/);
  });

  await t.test('3. ownership is nullable only for preserved legacy rows', () => {
    assert.match(migration, /ADD COLUMN user_id UUID NULL REFERENCES auth\.users\(id\) ON DELETE SET NULL/);
    assert.doesNotMatch(migration, /user_id UUID NOT NULL/);
    assert.match(migration, /COUNT\(\*\) FILTER \(WHERE user_id IS NULL\)/);
    assert.match(migration, /attempt_count\s*<>\s*12 OR ownerless_count\s*<>\s*12/);
  });

  await t.test('4. database trigger binds new attempts to auth.uid', () => {
    assert.match(migration, /CREATE OR REPLACE FUNCTION public\.assign_exam_attempt_owner\(\)/);
    assert.match(migration, /requester_id UUID := auth\.uid\(\)/);
    assert.match(migration, /IF requester_id IS NULL THEN/);
    assert.match(migration, /NEW\.user_id IS DISTINCT FROM requester_id/);
    assert.match(migration, /NEW\.user_id := requester_id/);
    assert.match(migration, /BEFORE INSERT ON public\.exam_attempts/);
  });

  await t.test('5. public policies are replaced with authenticated own-row policies', () => {
    assert.match(migration, /DROP POLICY IF EXISTS "Allow public read on exam_attempts"/);
    assert.match(migration, /DROP POLICY IF EXISTS "Allow public insert on exam_attempts"/);
    assert.match(migration, /CREATE POLICY "Learners read own exam attempts"[\s\S]*?FOR SELECT[\s\S]*?TO authenticated[\s\S]*?USING \(auth\.uid\(\) = user_id\)/);
    assert.match(migration, /CREATE POLICY "Learners insert own exam attempts"[\s\S]*?FOR INSERT[\s\S]*?TO authenticated[\s\S]*?WITH CHECK \(auth\.uid\(\) = user_id\)/);
    assert.doesNotMatch(migration, /CREATE POLICY[\s\S]*?TO anon/);
  });

  await t.test('6. browser grants are reduced to authenticated SELECT and INSERT', () => {
    assert.match(migration, /REVOKE ALL PRIVILEGES ON TABLE public\.exam_attempts\s+FROM PUBLIC, anon, authenticated;/);
    assert.match(migration, /GRANT SELECT, INSERT\s+ON TABLE public\.exam_attempts\s+TO authenticated;/);
    assert.doesNotMatch(migration, /GRANT[^;]*\bTO anon\b/i);
    assert.doesNotMatch(migration, /GRANT\s+(?:ALL|UPDATE|DELETE|TRUNCATE|REFERENCES|TRIGGER)/i);
  });

  await t.test('7. migration contains no row or table destruction', () => {
    assert.doesNotMatch(executable, /\bDELETE\s+FROM\b/i);
    assert.doesNotMatch(executable, /\bUPDATE\s+public\.exam_attempts\b/i);
    assert.doesNotMatch(executable, /\bINSERT\s+INTO\b/i);
    assert.doesNotMatch(executable, /\bTRUNCATE\s+(?:TABLE\s+)?public\.exam_attempts\b/i);
    assert.doesNotMatch(executable, /\bDROP\s+TABLE\b/i);
  });

  await t.test('8. migration does not touch unrelated application tables', () => {
    for (const table of [
      'exam_questions',
      'question_topics',
      'user_learning_path_progress',
      'user_learning_path_resources',
      'follow_along_published_programmes',
      'follow_along_author_drafts',
      'follow_along_author_revisions',
      'follow_along_release_candidates',
      'exam_entitlements',
      'learner_item_progress'
    ]) {
      assert.doesNotMatch(executable, new RegExp(`\\b${table}\\b`, 'i'));
    }
  });
});
