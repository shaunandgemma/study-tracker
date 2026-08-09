import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');

test('Independent AWS setup navigation', async (t) => {
  const app = read('src/App.jsx');
  const connectionContext = read('src/features/awsConnection/AwsConnectionContext.jsx');
  const setupGuide = read('src/features/awsConnection/AwsSetupGuide.jsx');
  const followAlongValidation = read('src/features/followAlongs/runtime/FollowAlongAwsValidationPanel.jsx');

  await t.test('1. AWS feature owns setup visibility and stable open and close actions', () => {
    assert.match(connectionContext, /const \[isSetupOpen, setIsSetupOpen\] = useState\(false\)/);
    assert.match(connectionContext, /const openSetup = useCallback\(\(\) => setIsSetupOpen\(true\), \[\]\)/);
    assert.match(connectionContext, /const closeSetup = useCallback\(\(\) => setIsSetupOpen\(false\), \[\]\)/);
  });

  await t.test('2. App renders AWS setup above individual page choices', () => {
    assert.match(app, /const \{ isSetupOpen, closeSetup \} = useAwsConnection\(\)/);
    assert.match(app, /isSetupOpen \? \(\s*<AwsSetupGuide \/>/);
    assert.match(app, /<AwsSetupGuide \/>[\s\S]*viewMode === 'follow-alongs'/);
  });

  await t.test('3. Closing setup returns naturally because the selected view is not changed', () => {
    assert.match(setupGuide, /onClick=\{closeSetup\}/);
    assert.doesNotMatch(connectionContext, /setViewMode|subView|TaskContext/);
  });

  await t.test('3a. Choosing another main page closes setup navigation cleanly', () => {
    assert.match(app, /useEffect\(\(\) => \{\s*closeSetup\(\);\s*\}, \[viewMode, closeSetup\]\)/);
  });

  await t.test('4. TaskContext is retired', () => {
    assert.equal(existsSync('src/context/TaskContext.jsx'), false);
  });

  await t.test('5. Hands On view is retired', () => {
    assert.equal(existsSync('src/components/HandsOnTasks/HandsOnTasksView.jsx'), false);
  });

  await t.test('6. AWS setup remains available independently', () => {
    assert.match(setupGuide, /useAwsConnection\(\)/);
  });

  await t.test('7. Hands On validation is retired', () => {
    assert.equal(existsSync('src/components/HandsOnTasks/AwsValidationPanel.jsx'), false);
  });

  await t.test('8. Follow Along validation opens the shared setup screen without TaskContext', () => {
    assert.match(followAlongValidation, /awsConnection, openSetup/);
    assert.doesNotMatch(followAlongValidation, /useTask|TaskContext/);
  });

  await t.test('9. AWS setup guide closes through the AWS feature without TaskContext', () => {
    assert.match(setupGuide, /closeSetup/);
    assert.doesNotMatch(setupGuide, /useTask|TaskContext|closeAwsSetup/);
  });
});
