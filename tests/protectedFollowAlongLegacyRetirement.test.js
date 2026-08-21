import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');

test('Step 007E8 retires legacy Follow Along learner delivery without deleting history', async t => {
  const migration = read('supabase/migrations/20260907_retire_legacy_follow_along_learner_delivery.sql');
  const view = read('src/components/FollowAlongs/FollowAlongsView.jsx');
  const accessPolicy = read('src/features/access/followAlongAccessPolicy.js');
  const terraformOrder = read('src/features/followAlongs/published/terraformFollowAlongOrder.js');
  const approvalQueue = read('src/features/followAlongAuthor/AuthorApprovalQueue.jsx');

  await t.test('revokes legacy browser payload reads only after exact protected parity', () => {
    assert.match(migration, /LOCK TABLE public\.follow_along_published_programmes IN SHARE MODE/);
    assert.match(migration, /protected\.payload IS DISTINCT FROM published\.runtime_content/);
    assert.match(migration, /protected Follow Along parity is incomplete/);
    assert.match(migration, /DROP POLICY IF EXISTS "Learners read active published Follow Alongs"/);
    assert.match(migration, /REVOKE SELECT \([\s\S]*?runtime_content[\s\S]*?\) ON public\.follow_along_published_programmes[\s\S]*?FROM PUBLIC, anon, authenticated/);
    assert.match(migration, /legacy runtime_content remains browser-readable/);
  });

  await t.test('retains only safe staff publication metadata behind existing role helpers', () => {
    assert.match(migration, /GRANT SELECT \([\s\S]*?programme_id,[\s\S]*?candidate_id,[\s\S]*?source_revision,[\s\S]*?published_at[\s\S]*?\) ON public\.follow_along_published_programmes[\s\S]*?TO authenticated/);
    assert.match(migration, /CREATE POLICY "Trusted staff read published Follow Along metadata"[\s\S]*?public\.follow_along_is_author\(\)[\s\S]*?public\.follow_along_is_approver\(\)/);
    assert.doesNotMatch(migration, /GRANT SELECT \([\s\S]*?runtime_content[\s\S]*?\) ON public\.follow_along_published_programmes[\s\S]*?TO authenticated/);
  });

  await t.test('changes no publication, protected content, progress or editorial data', () => {
    assert.doesNotMatch(migration, /(?:INSERT INTO|UPDATE|DELETE FROM|TRUNCATE)\s+public\./i);
    assert.doesNotMatch(migration, /DROP\s+(?:TABLE|FUNCTION|TRIGGER)/i);
    assert.doesNotMatch(migration, /user_learning_path_(?:progress|resources)/i);
    assert.match(migration, /COMMIT;/);
  });

  await t.test('removes hidden VPC payload imports while retaining their source files', () => {
    assert.doesNotMatch(view, /VpcLearningPathView|vpc-learning-path/);
    assert.doesNotMatch(accessPolicy, /followAlongProgrammes|isFollowAlongProgrammeForExam/);
    assert.equal(existsSync('src/data/vpcLearningPathData.js'), true);
    assert.equal(existsSync('src/components/VpcLearningPath/VpcLearningPathView.jsx'), true);
  });

  await t.test('uses protected server order without private programme IDs in the ordering helper', () => {
    assert.doesNotMatch(terraformOrder, /learning-path/);
    assert.match(terraformOrder, /server-managed sort_order/);
    assert.match(terraformOrder, /return \[\.\.\.programmes\]/);
  });

  await t.test('keeps the approval queue on staff metadata instead of the legacy payload service', () => {
    assert.match(approvalQueue, /service\.listPublishedDrafts\(\)/);
    assert.doesNotMatch(approvalQueue, /createPublishedFollowAlongService|listPublishedProgrammes|runtime_content/);
  });
});
