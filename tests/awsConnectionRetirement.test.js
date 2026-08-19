import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const retiredPaths = [
  'src/features/awsConnection',
  'src/services/awsConnectionService.js',
  'src/features/followAlongs/runtime/FollowAlongAwsValidationPanel.jsx',
  'src/data/taskValidationRegistry.js',
  'src/data/cloudFormationTemplate.js',
  'supabase/functions/aws-test-connection',
  'supabase/functions/aws-validate-task',
  'supabase/functions/_shared/awsTaskValidators'
];

test('unused AWS connection feature is fully retired without changing database history', () => {
  const app = readFileSync('src/App.jsx', 'utf8');

  assert.doesNotMatch(app, /AwsConnectionProvider|AwsSetupGuide|useAwsConnection/);
  for (const path of retiredPaths) {
    assert.equal(existsSync(path), false, `${path} must be removed`);
  }

  assert.equal(existsSync('supabase/migrations/20260802_user_aws_connections.sql'), true);
  assert.equal(existsSync('src/features/followAlongAuthor'), true);
  assert.equal(existsSync('src/features/followAlongs/published'), true);
  assert.equal(existsSync('src/features/auth/AuthContext.jsx'), true);

  const newMigrations = readdirSync('supabase/migrations').filter(name =>
    /drop.*aws|remove.*aws.*connection|aws.*connection.*retire/i.test(name)
  );
  assert.deepEqual(newMigrations, []);
});
