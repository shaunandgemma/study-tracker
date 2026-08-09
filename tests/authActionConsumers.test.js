import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');

test('Shared authentication action consumers', async (t) => {
  const modalSource = read('src/components/Modals/AuthModal.jsx');
  const navbarSource = read('src/components/Navbar.jsx');
  const setupSource = read('src/features/awsConnection/AwsSetupGuide.jsx');

  await t.test('1. AuthModal uses the independent authentication context', () => {
    assert.match(modalSource, /features\/auth\/useAuth\.js/);
    assert.match(modalSource, /isAuthModalOpen/);
    assert.match(modalSource, /closeAuthModal/);
    assert.match(modalSource, /signInWithEmail/);
    assert.match(modalSource, /signUpWithEmail/);
    assert.match(modalSource, /\} = useAuth\(\)/);
    assert.doesNotMatch(modalSource, /TaskContext|useTask\(/);
  });

  await t.test('2. AuthModal keeps its visible validation and success flow', () => {
    assert.match(modalSource, /Please enter a valid email address/);
    assert.match(modalSource, /Password must be at least 6 characters long/);
    assert.match(modalSource, /Signed in successfully!/);
    assert.match(modalSource, /Please check your email to confirm registration/);
    assert.match(modalSource, /closeAuthModal\(\)/);
  });

  await t.test('3. Navbar keeps account controls independent after Hands On navigation retirement', () => {
    assert.match(navbarSource, /const \{ currentUser, openAuthModal, signOut: signOutUser \} = useAuth\(\)/);
    assert.doesNotMatch(navbarSource, /useTask|calculateTaskProgress|hands-on-tasks|Hands-On Tasks/);
  });

  await t.test('4. Desktop and mobile Navbar controls share the new actions', () => {
    assert.equal((navbarSource.match(/openAuthModal\(\)/g) || []).length, 2);
    assert.equal((navbarSource.match(/signOutUser/g) || []).length, 3);
    assert.match(navbarSource, /Sign In \/ Create Account/);
    assert.match(navbarSource, /Sign Out/);
  });

  await t.test('5. AWS setup gets authentication and all AWS feature values from their independent owners', () => {
    assert.match(setupSource, /const \{ currentUser, openAuthModal \} = useAuth\(\)/);
    assert.match(setupSource, /\} = useAwsConnection\(\)/);
    assert.match(setupSource, /saveConnection: saveAwsConnection/);
    assert.match(setupSource, /regenerateExternalId: regenerateAwsExternalId/);
    assert.match(setupSource, /closeSetup/);
    assert.doesNotMatch(setupSource, /useTask|TaskContext|closeAwsSetup/);
  });

  await t.test('6. AWS setup remains selected while the shared modal opens', () => {
    assert.match(setupSource, /openAuthModal\('aws-setup'\)/);
    assert.doesNotMatch(setupSource, /setSubView/);
    const authContextSource = read('src/features/auth/AuthContext.jsx');
    assert.match(authContextSource, /const openAuthModal = useCallback\(\(\) => setIsAuthModalOpen\(true\)/);
  });

  await t.test('7. TaskContext is retired after authentication migration', () => {
    assert.equal(existsSync('src/context/TaskContext.jsx'), false);
  });
});
