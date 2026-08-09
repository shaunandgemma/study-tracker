import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');

test('AWS setup feature location', async (t) => {
  const app = read('src/App.jsx');
  const setup = read('src/features/awsConnection/AwsSetupGuide.jsx');

  await t.test('1. AWS setup screen lives in the independent AWS feature folder', () => {
    assert.equal(existsSync('src/features/awsConnection/AwsSetupGuide.jsx'), true);
    assert.equal(existsSync('src/components/HandsOnTasks/AwsSetupGuide.jsx'), false);
  });

  await t.test('2. App imports setup from the independent AWS feature', () => {
    assert.match(app, /features\/awsConnection\/AwsSetupGuide\.jsx/);
    assert.doesNotMatch(app, /components\/HandsOnTasks\/AwsSetupGuide/);
  });

  await t.test('3. Setup uses nearby independent auth and AWS hooks', () => {
    assert.match(setup, /from '\.\.\/auth\/useAuth\.js'/);
    assert.match(setup, /from '\.\/useAwsConnection\.js'/);
    assert.doesNotMatch(setup, /HandsOnTasks|TaskContext|useTask/);
  });

  await t.test('4. Existing service and CloudFormation helpers remain in their original locations', () => {
    assert.match(setup, /from '\.\.\/\.\.\/services\/awsConnectionService'/);
    assert.match(setup, /from '\.\.\/\.\.\/data\/cloudFormationTemplate'/);
  });

  await t.test('5. Setup retains its connection and navigation operations', () => {
    for (const name of [
      'testConnection: testAwsConnection',
      'saveConnection: saveAwsConnection',
      'disconnectConnection: disconnectAwsConnection',
      'regenerateExternalId: regenerateAwsExternalId',
      'closeSetup',
    ]) assert.ok(setup.includes(name), `AWS setup must retain ${name}`);
  });
});
