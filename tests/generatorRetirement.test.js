import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const retiredTargets = [
  'scripts/create_follow_along.py',
  'scripts/follow_along.py',
  'scripts/remove_follow_along.py',
  'scripts/follow_along_v2',
  'scripts/generator',
  'scripts/generator_v2',
  'scripts/generator_freeze.py',
  'tests/python',
  '.generator_v2',
  'plans'
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function sourceFiles(relativeDirectory) {
  const directory = path.join(root, relativeDirectory);
  return fs.readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(?:js|jsx)$/.test(entry.name))
    .map(entry => path.join(entry.parentPath, entry.name));
}

test('Step 57 Generator retirement', async t => {
  await t.test('1. Generator entry points, core, tests, state and plans are absent', () => {
    for (const relativePath of retiredTargets) {
      assert.equal(fs.existsSync(path.join(root, relativePath)), false, `${relativePath} should be retired.`);
    }
  });

  await t.test('2. Package commands and current documentation do not advertise Generator commands', () => {
    const packageJson = read('package.json');
    assert.doesNotMatch(packageJson, /create_follow_along|remove_follow_along|follow_along_v2|generator_v2|tests[\\/]python/);
    if (fs.existsSync(path.join(root, 'README.md'))) {
      assert.doesNotMatch(read('README.md'), /scripts\/(?:create_follow_along|follow_along\.py|remove_follow_along|follow_along_v2|generator(?:_v2)?)/);
    }
  });

  await t.test('3. Learner app and Author source remain independent from retired Generator code', () => {
    for (const file of sourceFiles('src')) {
      assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /scripts[\\/]generator|generator_v2|follow_along_v2/);
    }
  });

  await t.test('4. Learner programmes and the published Follow Along service remain present', () => {
    for (const relativePath of [
      'src/data/followAlongProgrammes.js',
      'src/data/vpcLearningPathData.js',
      'src/data/s3LearningPathData.js',
      'src/data/ec2LearningPathData.js',
      'src/data/iamLearningPathData.js',
      'src/features/followAlongs/published/publishedFollowAlongService.js'
    ]) assert.equal(fs.existsSync(path.join(root, relativePath)), true, `${relativePath} must remain.`);
  });

  await t.test('5. Author workflow remains present', () => {
    assert.equal(fs.existsSync(path.join(root, 'src/features/followAlongAuthor')), true);
  });

  await t.test('6. later retirement does not affect exam and publishing migrations', () => {
    for (const relativePath of [
      'src/services/questionService.js',
      'supabase/migrations/20260813_follow_along_controlled_publishing.sql',
      'supabase/migrations/20260814_follow_along_publishing_programme_id_correction.sql'
    ]) assert.equal(fs.existsSync(path.join(root, relativePath)), true, `${relativePath} must remain.`);
    for (const relativePath of ['src/components/HandsOnTasks', 'src/context/TaskContext.jsx']) {
      assert.equal(fs.existsSync(path.join(root, relativePath)), false, `${relativePath} was retired after Step 57.`);
    }
  });

  await t.test('7. App and Supabase migration reports remain preserved', () => {
    const reportDirectory = path.join(root, 'migration_work/reports');
    assert.equal(fs.existsSync(reportDirectory), true);
    assert.ok(fs.readdirSync(reportDirectory).length > 0, 'Migration reports must remain available.');
  });
});
