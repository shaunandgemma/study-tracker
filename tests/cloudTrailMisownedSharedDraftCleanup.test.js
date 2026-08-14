import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const migrationUrl = new URL(
  '../supabase/migrations/20260827_remove_misowned_cloudtrail_shared_draft.sql',
  import.meta.url
);

test('20260827 removes only the verified misowned CloudTrail Shared Draft', async () => {
  const sql = await readFile(migrationUrl, 'utf8');

  assert.match(sql, /author-draft-import-9c389609207da8d022aa672f7b27a1d7574c85825a5329545367489eeedf9bde/);
  assert.match(sql, /cloudtrail-learning-path/);
  assert.match(sql, /0a70410c-912f-4a67-a0ad-a8543b6bf6d4/);
  assert.match(sql, /667ad4ce-312b-4f78-a3fa-366c8b669477/);
  assert.match(sql, /shaun19862010@hotmail\.co\.uk/);
  assert.match(sql, /target\.revision <> 1/);
  assert.match(sql, /target\.status <> 'ready_for_approval'/);
  assert.match(sql, /publicationVisibility.*unpublished/s);
  assert.match(sql, /publishStatus.*not_published/s);
  assert.match(sql, /release-candidate history/);
  assert.match(sql, /CloudTrail is already published/);
  assert.match(sql, /exactly one matching CloudTrail revision was not verified/);
});

test('20260827 preserves candidates, publications, other drafts and browser-local storage', async () => {
  const sql = await readFile(migrationUrl, 'utf8');

  assert.doesNotMatch(sql, /DELETE\s+FROM\s+public\.follow_along_release_candidates/i);
  assert.doesNotMatch(sql, /DELETE\s+FROM\s+public\.follow_along_published_programmes/i);
  assert.doesNotMatch(sql, /TRUNCATE/i);
  assert.match(sql, /DELETE FROM public\.follow_along_author_revisions\s+WHERE draft_id = target_draft_id\s+AND revision = 1\s+AND owner_id = incorrect_owner_id/s);
  assert.match(sql, /DELETE FROM public\.follow_along_author_drafts\s+WHERE draft_id = target_draft_id\s+AND programme_id = 'cloudtrail-learning-path'\s+AND revision = 1\s+AND owner_id = incorrect_owner_id/s);
  assert.match(sql, /browser-local Author draft is not\s+-- stored in these tables/s);
});

test('20260827 records the exact correction before deletion', async () => {
  const sql = await readFile(migrationUrl, 'utf8');

  assert.match(sql, /INSERT INTO public\.follow_along_author_draft_deletions/);
  assert.match(sql, /AG-created CloudTrail draft owned by the Approver account/);
  assert.match(sql, /BEGIN;/);
  assert.match(sql, /COMMIT;/);
});
