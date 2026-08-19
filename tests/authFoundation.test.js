import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAuthService } from '../src/features/auth/authService.js';

const clientWithAuth = (auth) => ({ auth });

test('Independent authentication foundation', async (t) => {
  await t.test('1. Current user loads through the shared Supabase auth client', async () => {
    const user = { id: 'user-123', email: 'learner@example.com' };
    const service = createAuthService(clientWithAuth({
      getUser: async () => ({ data: { user }, error: null }),
    }));
    assert.deepEqual(await service.getCurrentUser(), { success: true, user });
  });

  await t.test('2. Signed-out and failed user loads return clear results', async () => {
    const signedOutService = createAuthService(clientWithAuth({
      getUser: async () => ({ data: { user: null }, error: null }),
    }));
    assert.deepEqual(await signedOutService.getCurrentUser(), { success: true, user: null });

    const failedService = createAuthService(clientWithAuth({
      getUser: async () => ({ data: null, error: { message: 'Session unavailable' } }),
    }));
    assert.deepEqual(await failedService.getCurrentUser(), {
      success: false,
      user: null,
      error: 'Session unavailable',
    });
  });

  await t.test('3. Sign-in trims email and returns success or readable failure', async () => {
    let receivedCredentials;
    const user = { id: 'signed-in-user' };
    const successService = createAuthService(clientWithAuth({
      signInWithPassword: async credentials => {
        receivedCredentials = credentials;
        return { data: { user }, error: null };
      },
    }));
    assert.deepEqual(await successService.signInWithEmail('  learner@example.com  ', 'secret12'), {
      success: true,
      user,
    });
    assert.deepEqual(receivedCredentials, { email: 'learner@example.com', password: 'secret12' });

    const failedService = createAuthService(clientWithAuth({
      signInWithPassword: async () => ({ data: null, error: { message: 'Incorrect password' } }),
    }));
    assert.deepEqual(await failedService.signInWithEmail('learner@example.com', 'wrong12'), {
      success: false,
      error: 'Incorrect password',
    });
  });

  await t.test('4. Sign-up distinguishes immediate sessions from email confirmation', async () => {
    const user = { id: 'new-user' };
    const immediateService = createAuthService(clientWithAuth({
      signUp: async () => ({ data: { user, session: { access_token: 'test-token' } }, error: null }),
    }));
    const immediate = await immediateService.signUpWithEmail(' new@example.com ', 'secret12');
    assert.equal(immediate.success, true);
    assert.equal(immediate.user, user);
    assert.equal(immediate.message, 'Account created and signed in successfully!');

    const confirmationService = createAuthService(clientWithAuth({
      signUp: async () => ({ data: { user, session: null }, error: null }),
    }));
    const confirmation = await confirmationService.signUpWithEmail('new@example.com', 'secret12');
    assert.equal(confirmation.success, true);
    assert.match(confirmation.message, /check your email inbox/i);
  });

  await t.test('5. Sign-out returns a stable success or failure result', async () => {
    const successService = createAuthService(clientWithAuth({
      signOut: async () => ({ error: null }),
    }));
    assert.deepEqual(await successService.signOut(), { success: true });

    const failedService = createAuthService(clientWithAuth({
      signOut: async () => ({ error: { message: 'Network unavailable' } }),
    }));
    assert.deepEqual(await failedService.signOut(), { success: false, error: 'Network unavailable' });
  });

  await t.test('6. Auth subscriptions forward user changes and unsubscribe cleanly', () => {
    let authCallback;
    let unsubscribeCount = 0;
    const service = createAuthService(clientWithAuth({
      onAuthStateChange: callback => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: () => { unsubscribeCount += 1; } } } };
      },
    }));

    let received;
    const unsubscribe = service.subscribeToAuthChanges((user, event) => { received = { user, event }; });
    authCallback('SIGNED_IN', { user: { id: 'user-456' } });
    assert.deepEqual(received, { user: { id: 'user-456' }, event: 'SIGNED_IN' });
    authCallback('SIGNED_OUT', null);
    assert.deepEqual(received, { user: null, event: 'SIGNED_OUT' });
    unsubscribe();
    assert.equal(unsubscribeCount, 1);
  });

  await t.test('7. AuthContext is independent of Hands On and AWS connection state', () => {
    const contextSource = readFileSync('src/features/auth/AuthContext.jsx', 'utf8');
    const hookSource = readFileSync('src/features/auth/useAuth.js', 'utf8');
    assert.doesNotMatch(contextSource, /TaskContext|useTask|awsConnection|taskProgress|HandsOn/);
    assert.match(contextSource, /currentUser/);
    assert.match(contextSource, /loadingAuth/);
    assert.match(contextSource, /isAuthModalOpen/);
    assert.match(contextSource, /subscribeToAuthChanges/);
    assert.match(contextSource, /unsubscribe\(\)/);
    assert.match(contextSource, /event === 'INITIAL_SESSION'/);
    assert.match(contextSource, /if \(!isInitialSession\) setLoadingAuth\(false\)/);
    assert.match(hookSource, /useAuth must be used within an AuthProvider/);
  });

  await t.test('8. AuthProvider owns the user above the existing feature providers', () => {
    const appSource = readFileSync('src/App.jsx', 'utf8');
    assert.match(appSource, /<AuthProvider>[\s\S]*<AuthenticatedApplication \/>/);
    assert.match(appSource, /<AwsConnectionProvider enabled=\{!isDemoAccount\}>[\s\S]*<ExamProvider[^>]*>[\s\S]*<MainContent \/>/);
    assert.doesNotMatch(appSource, /TaskProvider|TaskContext/);
  });
});
