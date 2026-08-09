import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migrationPath = 'supabase/migrations/20260815_hands_on_progress_read_only_archive.sql';
const migration = readFileSync(migrationPath, 'utf8');
const privilegeCorrection = readFileSync('supabase/migrations/20260816_hands_on_progress_select_only_privileges.sql', 'utf8');

test('Step 61 hosted Hands On progress read-only archive migration', async (t) => {
  await t.test('1. migration targets only the progress archive table', () => {
    const alteredTables = [...migration.matchAll(/(?:ALTER TABLE|ON TABLE|ON)\s+(public\.[a-z0-9_]+)/gi)].map(match => match[1]);
    assert.ok(alteredTables.length > 0);
    assert.deepEqual(new Set(alteredTables), new Set(['public.hands_on_task_progress']));
  });

  await t.test('2. learner write policies and privileges are removed', () => {
    for (const policy of [
      'Users can insert own task progress',
      'Users can update own task progress',
      'Users can delete own task progress'
    ]) assert.match(migration, new RegExp(`DROP POLICY IF EXISTS "${policy}"`));
    assert.match(migration, /REVOKE INSERT, UPDATE, DELETE, TRUNCATE/);
    assert.match(migration, /FROM anon, authenticated/);
  });

  await t.test('3. historical read access is required and retained', () => {
    assert.match(migration, /Users can view own task progress/);
    assert.match(migration, /AND cmd = 'SELECT'/);
    assert.match(migration, /GRANT SELECT[\s\S]*TO anon, authenticated/);
  });

  await t.test('4. migration contains no row or table destruction', () => {
    assert.doesNotMatch(migration, /DROP TABLE|TRUNCATE TABLE|DELETE FROM|UPDATE public\.|INSERT INTO/);
    assert.doesNotMatch(migration, /hands_on_tasks\s+(?:DROP|RENAME|ALTER)/i);
  });

  await t.test('5. protected application data is not named as a mutation target', () => {
    assert.doesNotMatch(migration, /user_learning_path_progress|user_learning_path_resources|exam_questions|user_aws_connections|follow_along_/);
  });

  await t.test('6. transaction, assertions, archive comment, and rollback note are present', () => {
    assert.match(migration, /BEGIN;/);
    assert.match(migration, /COMMIT;/);
    assert.match(migration, /RAISE EXCEPTION/);
    assert.match(migration, /Read-only historical Hands On progress archive/);
    assert.match(migration, /ROLLBACK NOTE/);
  });

  await t.test('7. post-deployment correction leaves ordinary roles with SELECT only', () => {
    assert.match(privilegeCorrection, /REVOKE ALL PRIVILEGES/);
    assert.match(privilegeCorrection, /FROM anon, authenticated/);
    assert.match(privilegeCorrection, /GRANT SELECT[\s\S]*TO anon, authenticated/);
    for (const privilege of ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN']) {
      assert.match(privilegeCorrection, new RegExp(`has_table_privilege\\([^\\n]+${privilege}`));
    }
    assert.doesNotMatch(privilegeCorrection, /DROP TABLE|TRUNCATE TABLE|DELETE FROM|UPDATE public\.|INSERT INTO/);
  });
});
