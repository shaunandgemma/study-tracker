import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isPrivilegedFollowAlongAccount } from '../src/features/followAlongAuthor/authorAccess.js';

test('Step 53H privileged-account Hands On containment', async t => {
  await t.test('1. Server-managed Author, Approver, and Admin roles are privileged', () => {
    for (const role of ['author', 'approver', 'admin']) {
      assert.equal(isPrivilegedFollowAlongAccount({ id: `${role}-1`, app_metadata: { role } }), true);
    }
    assert.equal(isPrivilegedFollowAlongAccount({ id: 'multi-1', app_metadata: { roles: ['learner', 'approver'] } }), true);
  });

  await t.test('2. Learners remain eligible to read their archived progress', () => {
    assert.equal(isPrivilegedFollowAlongAccount({ id: 'learner-1', app_metadata: { role: 'learner' } }), false);
    assert.equal(isPrivilegedFollowAlongAccount({ id: 'learner-2', app_metadata: {} }), false);
    assert.equal(isPrivilegedFollowAlongAccount({ id: 'learner-3' }), false);
  });

  await t.test('3. User-editable metadata cannot change archive access classification', () => {
    assert.equal(isPrivilegedFollowAlongAccount({ id: 'learner-1', user_metadata: { role: 'approver' } }), false);
  });

  await t.test('4. the retired runtime cannot transfer privileged or learner progress', () => {
    const appSource = readFileSync('src/App.jsx', 'utf8');
    const archiveSource = readFileSync('src/services/handsOnProgressArchiveService.js', 'utf8');
    assert.doesNotMatch(appSource, /TaskContext|TaskProvider|useTask/);
    assert.doesNotMatch(archiveSource, /mergeGuestProgress|saveProgressToSupabase|useAuth/);
  });

  await t.test('5. Author and Approver routes provide a direct safe account-switch action', () => {
    const source = readFileSync('src/features/followAlongAuthor/AuthorEntry.jsx', 'utf8');
    assert.match(source, /signOut/);
    assert.match(source, /Sign Out \/ Switch Account/);
    assert.equal((source.match(/<AuthorAccountControls/g) || []).length, 2);
  });

  await t.test('6. Cached initial sessions cannot expose privileged access before the server user check', () => {
    const source = readFileSync('src/features/auth/AuthContext.jsx', 'utf8');
    assert.match(source, /const isInitialSession = event === 'INITIAL_SESSION'/);
    assert.match(source, /if \(!isInitialSession\) authEventReceived = true/);
    assert.match(source, /if \(!isInitialSession\) setLoadingAuth\(false\)/);
    assert.match(source, /if \(!authEventReceived\) \{\s*setCurrentUser\(result\.user \|\| null\)/);
  });
});
