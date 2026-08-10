import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const retiredPaths = [
  'src/components/S3LearningPath/S3LearningPathView.jsx',
  'src/components/Ec2LearningPath/Ec2LearningPathView.jsx',
  'src/components/IamLearningPath/IamLearningPathView.jsx',
  'src/data/s3LearningPathData.js',
  'src/data/ec2LearningPathData.js',
  'src/data/iamLearningPathData.js',
  'src/services/s3LearningPathService.js',
  'src/services/ec2LearningPathService.js',
  'src/services/iamLearningPathService.js',
  'src/features/followAlongs/catalogues/s3FollowAlongTasks.js',
  'src/features/followAlongs/catalogues/ec2FollowAlongTasks.js',
  'src/features/followAlongs/catalogues/iamFollowAlongTasks.js'
];

test('Step 164 retires only the hard-coded S3, EC2, and IAM programmes', async t => {
  await t.test('1. dedicated legacy source paths are absent', () => {
    for (const path of retiredPaths) assert.equal(existsSync(path), false, `${path} must be retired`);
  });

  await t.test('2. static cards and special routes are absent', () => {
    const catalogue = readFileSync('src/data/followAlongProgrammes.js', 'utf8');
    const router = readFileSync('src/components/FollowAlongs/FollowAlongsView.jsx', 'utf8');
    const landing = readFileSync('src/components/FollowAlongs/FollowAlongLandingPage.jsx', 'utf8');
    for (const id of ['s3-learning-path', 'ec2-learning-path', 'iam-learning-path']) {
      assert.doesNotMatch(catalogue, new RegExp(id));
      assert.doesNotMatch(router, new RegExp(id));
    }
    assert.doesNotMatch(landing, /S3LearningPath|Ec2LearningPath|IamLearningPath|s3LearningPathService|ec2LearningPathService|iamLearningPathService/);
  });

  await t.test('3. VPC and controlled published runtime remain', () => {
    for (const path of [
      'src/data/vpcLearningPathData.js',
      'src/components/VpcLearningPath/VpcLearningPathView.jsx',
      'src/features/followAlongs/published/publishedFollowAlongService.js',
      'src/features/followAlongAuthor'
    ]) assert.equal(existsSync(path), true, `${path} must remain`);
  });

  await t.test('4. cleanup migration is exact-ID and preserves controlled records', () => {
    const sql = readFileSync('supabase/migrations/20260826_remove_legacy_s3_ec2_iam_progress.sql', 'utf8');
    for (const id of ['s3-learning-path', 'ec2-learning-path', 'iam-learning-path']) assert.match(sql, new RegExp(id));
    assert.match(sql, /DELETE FROM public\.user_learning_path_resources/);
    assert.match(sql, /DELETE FROM public\.user_learning_path_progress/);
    assert.match(sql, /follow_along_published_programmes/);
    assert.match(sql, /a controlled published S3, EC2, or IAM replacement already exists/);
    assert.doesNotMatch(sql, /DELETE FROM public\.follow_along_(?:published_programmes|author_drafts|release_candidates)/);
    assert.doesNotMatch(sql, /exam_questions|questions/);
  });
});
