import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');

test('AWS connection ownership switch', async (t) => {
  const app = read('src/App.jsx');
  const connectionContext = read('src/features/awsConnection/AwsConnectionContext.jsx');
  const setup = read('src/features/awsConnection/AwsSetupGuide.jsx');
  const followAlongValidation = read('src/features/followAlongs/runtime/FollowAlongAwsValidationPanel.jsx');

  await t.test('1. The independent provider is active', () => {
    assert.match(app, /<AwsConnectionProvider enabled=\{true\}>/);
  });

  await t.test('2. The independent context is the sole connection loader', () => {
    assert.match(connectionContext, /services\.loadUserAwsConnection\(userId\)/);
    assert.equal(existsSync('src/context/TaskContext.jsx'), false);
  });

  await t.test('3. TaskContext is retired', () => {
    assert.equal(existsSync('src/context/TaskContext.jsx'), false);
  });

  await t.test('4. Follow Along validation reads the independent context', () => {
    assert.match(followAlongValidation, /const \{ awsConnection, openSetup \} = useAwsConnection\(\)/);
  });

  await t.test('5. Setup guide reads connection operations from the independent context', () => {
    assert.match(setup, /testConnection: testAwsConnection/);
    assert.match(setup, /saveConnection: saveAwsConnection/);
    assert.match(setup, /disconnectConnection: disconnectAwsConnection/);
    assert.match(setup, /regenerateExternalId: regenerateAwsExternalId/);
    assert.match(setup, /\} = useAwsConnection\(\)/);
  });

  await t.test('6. retired Hands On validation is absent', () => {
    assert.equal(existsSync('src/components/HandsOnTasks/AwsValidationPanel.jsx'), false);
  });

  await t.test('7. Follow Along validation reads connection data from the independent context', () => {
    assert.match(followAlongValidation, /const \{ awsConnection, openSetup \} = useAwsConnection\(\)/);
    assert.doesNotMatch(followAlongValidation, /useTask|openAwsSetup/);
  });

  await t.test('8. Existing connection service and backend boundary remain in use', () => {
    assert.match(connectionContext, /awsConnectionService/);
    assert.match(connectionContext, /testAwsConnection|saveUserAwsConnection|deleteUserAwsConnection|regenerateUserExternalId/);
  });
});
