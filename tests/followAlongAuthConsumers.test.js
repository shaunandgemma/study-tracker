import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');

const authConsumerFiles = [
  'src/components/FollowAlongs/shared/FollowAlongProgramme.jsx',
  'src/components/VpcLearningPath/VpcLearningPathView.jsx',
  'src/components/Ec2LearningPath/Ec2LearningPathView.jsx',
  'src/components/S3LearningPath/S3LearningPathView.jsx',
  'src/components/IamLearningPath/IamLearningPathView.jsx',
  'src/components/FollowAlongs/FollowAlongsView.jsx',
];

test('Follow Along read-only authentication consumers', async (t) => {
  await t.test('1. Every audited Follow Along user consumer imports useAuth', () => {
    for (const file of authConsumerFiles) {
      const source = read(file);
      assert.match(source, /features\/auth\/useAuth\.js/);
      assert.match(source, /const \{ currentUser \} = useAuth\(\)/);
    }
  });

  await t.test('2. Follow Along no longer obtains currentUser from TaskContext or ExamContext', () => {
    for (const file of authConsumerFiles) {
      const source = read(file);
      assert.doesNotMatch(source, /const \{ currentUser \} = useTask\(\)/);
      assert.doesNotMatch(source, /const \{ currentUser(?:,| \})[^\n]*= useExam\(\)/);
    }
  });

  await t.test('3. Shared Follow Along persistence keeps the same user ID boundary', () => {
    const source = read('src/components/FollowAlongs/shared/FollowAlongProgramme.jsx');
    assert.match(source, /persistence\.load\(currentUser\?\.id\)/);
    assert.match(source, /persistence\.save\(currentUser\.id, loaded\.progress/);
    assert.match(source, /persistence\.save\(currentUser\?\.id, snapshot, nextResources\)/);
  });

  await t.test('4. VPC, EC2, and S3 retain guest and signed-in persistence paths', () => {
    const expectations = [
      ['src/components/VpcLearningPath/VpcLearningPathView.jsx', 'loadGuestPathState', 'fetchUserPathProgressFromSupabase', 'saveUserPathProgressToSupabase', 'saveGuestPathState'],
      ['src/components/Ec2LearningPath/Ec2LearningPathView.jsx', 'loadGuestEc2PathState', 'fetchUserEc2PathProgressFromSupabase', 'saveUserEc2PathProgressToSupabase', 'saveGuestEc2PathState'],
      ['src/components/S3LearningPath/S3LearningPathView.jsx', 'loadGuestS3PathState', 'fetchUserS3PathProgressFromSupabase', 'saveUserS3PathProgressToSupabase', 'saveGuestS3PathState'],
    ];
    for (const [file, ...functionNames] of expectations) {
      const source = read(file);
      assert.match(source, /currentUser\?\.id/);
      for (const functionName of functionNames) assert.ok(source.includes(functionName), `${file} must retain ${functionName}`);
    }
  });

  await t.test('5. IAM moves only currentUser and preserves its existing client argument', () => {
    const source = read('src/components/IamLearningPath/IamLearningPathView.jsx');
    assert.match(source, /const \{ currentUser \} = useAuth\(\)/);
    assert.match(source, /const \{ supabaseClient \} = useExam\(\)/);
    assert.match(source, /fetchUserIamPathProgressFromSupabase\(currentUser\?\.id, supabaseClient\)/);
    assert.match(source, /saveUserIamPathProgressToSupabase\(currentUser\?\.id, progressRecord, updatedResources, supabaseClient\)/);
  });

  await t.test('6. TaskContext is no longer needed for authentication compatibility', () => {
    assert.equal(existsSync('src/context/TaskContext.jsx'), false);
  });
});
