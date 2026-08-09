import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('TaskContext retirement and authentication independence', async (t) => {
  const appSource = readFileSync('src/App.jsx', 'utf8');
  const authSource = readFileSync('src/features/auth/AuthContext.jsx', 'utf8');
  const archiveSource = readFileSync('src/services/handsOnProgressArchiveService.js', 'utf8');

  await t.test('1. TaskContext and TaskProvider are fully retired', () => {
    assert.equal(existsSync('src/context/TaskContext.jsx'), false);
    assert.doesNotMatch(appSource, /TaskContext|TaskProvider|useTask/);
  });

  await t.test('2. authentication remains independently owned', () => {
    assert.match(authSource, /currentUser/);
    assert.match(authSource, /loadingAuth/);
    assert.match(authSource, /subscribeToAuthChanges/);
    assert.doesNotMatch(authSource, /TaskContext|taskProgress|HandsOn/);
  });

  await t.test('3. historical Hands On reads are isolated from authentication', () => {
    assert.match(archiveSource, /fetchHostedHandsOnProgressArchive/);
    assert.doesNotMatch(archiveSource, /useAuth|AuthContext|onAuthStateChange/);
  });

  await t.test('4. the archive has no normal progress write or merge operation', () => {
    assert.doesNotMatch(archiveSource, /mergeGuestProgress|saveProgressToSupabase|\.upsert\(|\.insert\(|\.update\(|\.delete\(/);
  });
});
