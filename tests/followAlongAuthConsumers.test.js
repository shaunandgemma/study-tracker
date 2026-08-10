import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');

const authConsumerFiles = [
  'src/components/FollowAlongs/shared/FollowAlongProgramme.jsx',
  'src/components/VpcLearningPath/VpcLearningPathView.jsx',
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

  await t.test('4. VPC retains its guest and signed-in persistence paths', () => {
    const expectations = [
      ['src/components/VpcLearningPath/VpcLearningPathView.jsx', 'loadGuestPathState', 'fetchUserPathProgressFromSupabase', 'saveUserPathProgressToSupabase', 'saveGuestPathState'],
    ];
    for (const [file, ...functionNames] of expectations) {
      const source = read(file);
      assert.match(source, /currentUser\?\.id/);
      for (const functionName of functionNames) assert.ok(source.includes(functionName), `${file} must retain ${functionName}`);
    }
  });

  await t.test('5. TaskContext is no longer needed for authentication compatibility', () => {
    assert.equal(existsSync('src/context/TaskContext.jsx'), false);
  });
});
