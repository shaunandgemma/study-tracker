import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { HANDS_ON_PROGRESS_ARCHIVE_POLICY } from '../src/data/handsOnProgressArchivePolicy.js';

const read = file => readFileSync(file, 'utf8');

test('Step 59 Hands On progress archive policy', async (t) => {
  const storageSource = read('src/utils/storage.js');
  const archiveServiceSource = read('src/services/handsOnProgressArchiveService.js');
  const migrationSource = read('supabase/migrations/20260801_hands_on_tasks.sql');
  const followAlongSources = [
    read('src/services/vpcLearningPathService.js'),
    read('src/features/followAlongs/published/publishedFollowAlongService.js')
  ].join('\n');

  await t.test('1. the approved policy is indefinite read-only retention', () => {
    assert.equal(Object.isFrozen(HANDS_ON_PROGRESS_ARCHIVE_POLICY), true);
    assert.equal(HANDS_ON_PROGRESS_ARCHIVE_POLICY.mode, 'read-only');
    assert.equal(HANDS_ON_PROGRESS_ARCHIVE_POLICY.retention, 'indefinite-until-separately-approved');
    assert.equal(HANDS_ON_PROGRESS_ARCHIVE_POLICY.allowHistoricalReads, true);
    assert.equal(HANDS_ON_PROGRESS_ARCHIVE_POLICY.allowProgressWrites, false);
    assert.equal(HANDS_ON_PROGRESS_ARCHIVE_POLICY.allowGuestProgressMerge, false);
    assert.equal(HANDS_ON_PROGRESS_ARCHIVE_POLICY.allowFollowAlongConversion, false);
    assert.equal(HANDS_ON_PROGRESS_ARCHIVE_POLICY.allowExplicitBackupRestore, true);
  });

  await t.test('2. the archive service can read history but cannot persist or merge progress', () => {
    assert.match(archiveServiceSource, /fetchHostedHandsOnProgressArchive/);
    assert.match(archiveServiceSource, /\.from\('hands_on_task_progress'\)/);
    assert.doesNotMatch(archiveServiceSource, /mergeGuestProgress|saveProgressToSupabase|\.upsert\(|\.insert\(|\.update\(|\.delete\(/);
  });

  await t.test('3. the existing browser archive key and backup field remain intact', () => {
    assert.match(archiveServiceSource, /HANDS_ON_PROGRESS_ARCHIVE_KEY = 'exampulse_task_progress_v1'/);
    assert.match(storageSource, /taskProgress: readLocalHandsOnProgressArchive\(\)/);
    assert.match(storageSource, /if \(parsed\.taskProgress\) restoreLocalHandsOnProgressArchiveFromBackup\(parsed\.taskProgress\)/);
  });

  await t.test('4. the original hosted progress table remains intact', () => {
    assert.match(migrationSource, /CREATE TABLE IF NOT EXISTS public\.hands_on_task_progress/);
    assert.match(migrationSource, /Users can view own task progress/);
  });

  await t.test('5. Hands On history is never converted into Follow Along progress', () => {
    assert.doesNotMatch(followAlongSources, /\.from\(['"]hands_on_task_progress['"]\)|exampulse_task_progress_v1|mergeGuestProgressIntoSupabase/);
  });
});
