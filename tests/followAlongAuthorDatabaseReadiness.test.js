import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migrationPath = 'supabase/migrations/20260809_follow_along_author_shared_storage.sql';
const rollbackPath = 'supabase/rollback/20260809_follow_along_author_shared_storage_rollback.sql';

test('Follow Along Author database deployment readiness safeguards', async t => {
  const migration = readFileSync(migrationPath, 'utf8');
  const rollback = readFileSync(rollbackPath, 'utf8');

  await t.test('1. Migration remains review-only and starts with both server switches disabled', () => {
    assert.match(migration, /REVIEW-ONLY MIGRATION/);
    assert.match(migration, /shared_storage_enabled BOOLEAN NOT NULL DEFAULT FALSE/);
    assert.match(migration, /trusted_approval_enabled BOOLEAN NOT NULL DEFAULT FALSE/);
    assert.match(migration, /VALUES \(TRUE, FALSE, FALSE\)/);
  });

  await t.test('2. Rollback is clearly review-only and protected by one transaction', () => {
    assert.match(rollback, /REVIEW-ONLY ROLLBACK/);
    assert.match(rollback, /approved backup/);
    assert.equal((rollback.match(/^BEGIN;/gm) || []).length, 1);
    assert.equal((rollback.match(/^COMMIT;/gm) || []).length, 1);
  });

  await t.test('3. Rollback removes only the four isolated Author tables', () => {
    const drops = [...rollback.matchAll(/DROP TABLE IF EXISTS public\.(\w+)/g)].map(match => match[1]);
    assert.deepEqual(drops, [
      'follow_along_release_candidates',
      'follow_along_author_revisions',
      'follow_along_author_drafts',
      'follow_along_author_configuration'
    ]);
  });

  await t.test('4. Rollback does not remove shared extensions or unrelated schemas', () => {
    const executable = rollback.replace(/--.*$/gm, '');
    assert.doesNotMatch(executable, /DROP EXTENSION/i);
    assert.doesNotMatch(executable, /DROP SCHEMA/i);
    assert.doesNotMatch(executable, /hands_on|learning_path|published/i);
  });

  await t.test('5. Every rollback removal is guarded when the object may be absent', () => {
    const executableDrops = rollback.replace(/--.*$/gm, '').match(/^DROP .+;$/gm) || [];
    assert.ok(executableDrops.length >= 13);
    assert.ok(executableDrops.every(statement => statement.includes('IF EXISTS')));
  });

  await t.test('6. Approval entry point is removed before its release-candidate row type', () => {
    assert.ok(rollback.indexOf('DROP FUNCTION IF EXISTS public.approve_follow_along_release_candidate') < rollback.indexOf('DROP TABLE IF EXISTS public.follow_along_release_candidates'));
  });

  await t.test('7. Tables remove their private triggers and policies before helper functions', () => {
    assert.match(rollback, /triggers, indexes and policies are removed with them/);
    assert.ok(rollback.indexOf('DROP TABLE IF EXISTS public.follow_along_author_drafts') < rollback.indexOf('DROP FUNCTION IF EXISTS public.protect_follow_along_author_draft'));
    assert.ok(rollback.indexOf('DROP TABLE IF EXISTS public.follow_along_author_configuration') < rollback.indexOf('DROP FUNCTION IF EXISTS public.follow_along_shared_storage_enabled'));
  });

  await t.test('8. Application still has no automatic migration or deployment command', () => {
    const packageJson = readFileSync('package.json', 'utf8');
    assert.doesNotMatch(packageJson, /supabase\s+(db\s+push|migration\s+up|link)/i);
  });

  await t.test('9. Shared editing remains feature-flagged and uses the coordinator instead of direct tables', () => {
    const home = readFileSync('src/features/followAlongAuthor/AuthorHome.jsx', 'utf8');
    const editor = readFileSync('src/features/followAlongAuthor/AuthorDraftEditor.jsx', 'utf8');
    const panel = readFileSync('src/features/followAlongAuthor/AuthorStorageMigrationPanel.jsx', 'utf8');
    assert.match(home, /AuthorStorageMigrationPanel/);
    assert.match(home, /sharedFeatureEnabled &&/);
    assert.match(home, /coordinator\.saveDraft/);
    assert.match(panel, /if \(!featureEnabled\) return null/);
    assert.doesNotMatch(panel, /createAuthorStorageCoordinator/);
    assert.doesNotMatch(editor, /authorSharedStorageService|authorStorageCoordinator|follow_along_author_drafts/);
  });

  await t.test('10. Ownership checks reject missing identities as well as different identities', () => {
    assert.match(migration, /NEW\.owner_id IS DISTINCT FROM auth\.uid\(\)/);
    assert.match(migration, /current_draft\.owner_id IS DISTINCT FROM auth\.uid\(\)/);
    assert.match(migration, /NEW\.created_by IS DISTINCT FROM auth\.uid\(\)/);
  });
});
