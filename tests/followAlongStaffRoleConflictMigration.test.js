import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migrationPath = 'supabase/migrations/20260904_align_follow_along_staff_role_conflicts.sql';
const migration = readFileSync(migrationPath, 'utf8');

test('Step 006B Follow Along staff-role conflict correction', async t => {
  await t.test('replaces only the two shared staff-role decision helpers', () => {
    assert.match(migration, /CREATE OR REPLACE FUNCTION public\.follow_along_is_author\(\)/);
    assert.match(migration, /CREATE OR REPLACE FUNCTION public\.follow_along_is_approver\(\)/);
    assert.doesNotMatch(migration, /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+public\.(?:approve|reject|publish)_follow_along_release_candidate/i);
    assert.doesNotMatch(migration, /CREATE\s+POLICY|DROP\s+POLICY|ALTER\s+TABLE/i);
  });

  await t.test('preserves Admin precedence and rejects non-Admin role conflicts', () => {
    assert.match(migration, /follow_along_is_author[\s\S]*?ARRAY\['admin'\][\s\S]*?ARRAY\['author'\][\s\S]*?AND NOT public\.follow_along_has_app_role\(ARRAY\['approver'\]\)/);
    assert.match(migration, /follow_along_is_approver[\s\S]*?ARRAY\['admin'\][\s\S]*?ARRAY\['approver'\][\s\S]*?AND NOT public\.follow_along_has_app_role\(ARRAY\['author'\]\)/);
  });

  await t.test('keeps role decisions authenticated and changes no data', () => {
    assert.match(migration, /REVOKE ALL ON FUNCTION public\.follow_along_is_author\(\)[\s\S]*?FROM PUBLIC, anon/);
    assert.match(migration, /REVOKE ALL ON FUNCTION public\.follow_along_is_approver\(\)[\s\S]*?FROM PUBLIC, anon/);
    assert.match(migration, /GRANT EXECUTE ON FUNCTION public\.follow_along_is_author\(\)[\s\S]*?TO authenticated/);
    assert.match(migration, /GRANT EXECUTE ON FUNCTION public\.follow_along_is_approver\(\)[\s\S]*?TO authenticated/);
    assert.doesNotMatch(migration, /\b(?:INSERT|UPDATE|DELETE|TRUNCATE)\b/i);
  });

  await t.test('is transactional', () => {
    assert.match(migration, /^\s*--[\s\S]*?\bBEGIN;/);
    assert.match(migration, /COMMIT;\s*$/);
  });
});
