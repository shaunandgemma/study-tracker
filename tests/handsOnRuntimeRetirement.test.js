import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');

test('Step 60 Hands On runtime retirement', async (t) => {
  const appSource = read('src/App.jsx');
  const archiveService = read('src/services/handsOnProgressArchiveService.js');
  const archivePolicy = read('src/data/handsOnProgressArchivePolicy.js');
  const storageSource = read('src/utils/storage.js');

  await t.test('1. obsolete UI, TaskContext, and task service are absent', () => {
    for (const path of [
      'src/components/HandsOnTasks',
      'src/context/TaskContext.jsx',
      'src/services/taskService.js'
    ]) assert.equal(existsSync(path), false, `${path} must be retired`);
  });

  await t.test('2. the app no longer imports or mounts TaskProvider', () => {
    assert.doesNotMatch(appSource, /TaskProvider|TaskContext|HandsOnTasks/);
    assert.match(appSource, /<ExamProvider[^>]*>\s*<MainContent \/>\s*<\/ExamProvider>/);
  });

  await t.test('3. the replacement archive boundary is read-only during normal use', () => {
    assert.match(archivePolicy, /mode: 'read-only'/);
    assert.match(archiveService, /\.from\('hands_on_task_progress'\)\s*\.select\('\*'\)/);
    assert.doesNotMatch(archiveService, /\.upsert\(|\.insert\(|\.update\(|\.delete\(/);
    assert.doesNotMatch(archiveService, /mergeGuestProgress/);
  });

  await t.test('4. explicit backup restore is the only preserved local archive write', () => {
    assert.match(archiveService, /restoreLocalHandsOnProgressArchiveFromBackup/);
    assert.equal((archiveService.match(/storage\.setItem\(/g) || []).length, 1);
    assert.match(storageSource, /taskProgress: readLocalHandsOnProgressArchive\(\)/);
    assert.match(storageSource, /restoreLocalHandsOnProgressArchiveFromBackup\(parsed\.taskProgress\)/);
    assert.doesNotMatch(storageSource, /loadTaskProgressState|saveTaskProgressState|TASK_PROGRESS/);
  });

  await t.test('5. database history remains while Step 62 local content is retired', () => {
    assert.equal(existsSync('supabase/migrations/20260801_hands_on_tasks.sql'), true);
    for (const path of ['src/data/tasksData.js', 'src/data/tasks', 'scripts/importHandsOnTasks.js']) {
      assert.equal(existsSync(path), false, `${path} must be retired by Step 62`);
    }
  });

  await t.test('6. authentication and Follow Along owners remain', () => {
    for (const path of [
      'src/features/auth/AuthContext.jsx',
      'src/features/followAlongAuthor'
    ]) assert.equal(existsSync(path), true, `${path} must remain`);
    for (const path of [
      'src/features/awsConnection',
      'src/features/followAlongs/runtime/FollowAlongAwsValidationPanel.jsx'
    ]) assert.equal(existsSync(path), false, `${path} must be retired`);
  });
});
