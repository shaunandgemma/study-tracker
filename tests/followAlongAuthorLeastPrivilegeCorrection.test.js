import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migrationPath = 'supabase/migrations/20260810_follow_along_author_least_privilege_correction.sql';

test('Follow Along Author hosted least-privilege correction', async t => {
  const migration = readFileSync(migrationPath, 'utf8');
  const executable = migration.replace(/--.*$/gm, '');

  await t.test('1. Correction is protected by one transaction', () => {
    assert.equal((migration.match(/^BEGIN;/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;/gm) || []).length, 1);
  });

  await t.test('2. All four Author tables first lose browser privileges', () => {
    for (const table of [
      'follow_along_author_drafts',
      'follow_along_author_revisions',
      'follow_along_release_candidates',
      'follow_along_author_configuration'
    ]) {
      assert.match(migration, new RegExp(`REVOKE ALL ON TABLE public\\.${table}\\s+FROM PUBLIC, anon, authenticated;`));
    }
  });

  await t.test('3. Only the intended minimum table privileges are restored', () => {
    assert.match(migration, /GRANT SELECT, INSERT, UPDATE\s+ON TABLE public\.follow_along_author_drafts TO authenticated;/);
    assert.match(migration, /GRANT SELECT\s+ON TABLE public\.follow_along_author_revisions TO authenticated;/);
    assert.match(migration, /GRANT SELECT, INSERT\s+ON TABLE public\.follow_along_release_candidates TO authenticated;/);
    assert.doesNotMatch(migration, /GRANT[^;]*follow_along_author_configuration/i);
    assert.doesNotMatch(migration, /GRANT\s+(ALL|DELETE|TRUNCATE|REFERENCES|TRIGGER)/i);
    assert.doesNotMatch(migration, /\bTO anon\b/i);
  });

  await t.test('4. Every Author function loses direct public and browser grants', () => {
    for (const signature of [
      'approve_follow_along_release_candidate\\(TEXT\\)',
      'follow_along_has_app_role\\(TEXT\\[\\]\\)',
      'follow_along_is_author\\(\\)',
      'follow_along_is_approver\\(\\)',
      'follow_along_shared_storage_enabled\\(\\)',
      'follow_along_jsonb_sha256\\(JSONB\\)',
      'protect_follow_along_author_draft\\(\\)',
      'archive_follow_along_author_revision\\(\\)',
      'protect_follow_along_release_candidate\\(\\)'
    ]) {
      assert.match(migration, new RegExp(`REVOKE ALL ON FUNCTION public\\.${signature}\\s+FROM PUBLIC, anon, authenticated;`));
    }
  });

  await t.test('5. Only five intended functions are restored to authenticated users', () => {
    const grants = [...migration.matchAll(/GRANT EXECUTE ON FUNCTION public\.([^\n]+)\s+TO authenticated;/g)]
      .map(match => match[1].trim());
    assert.deepEqual(grants, [
      'approve_follow_along_release_candidate(TEXT)',
      'follow_along_has_app_role(TEXT[])',
      'follow_along_is_author()',
      'follow_along_is_approver()',
      'follow_along_shared_storage_enabled()'
    ]);
  });

  await t.test('6. Correction performs no data, schema, policy or feature mutation', () => {
    assert.doesNotMatch(
      executable,
      /^\s*(INSERT\s+INTO|UPDATE\s+public\.|DELETE\s+FROM|TRUNCATE|DROP|CREATE|ALTER)\b/im
    );
    assert.doesNotMatch(executable, /shared_storage_enabled\s*=/i);
    assert.doesNotMatch(executable, /trusted_approval_enabled\s*=/i);
    assert.doesNotMatch(executable, /hands_on|exam_questions|exam_attempts/i);
  });
});
