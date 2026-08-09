import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = file => readFileSync(file, 'utf8');

test('Step 58 Hands On entry-point retirement', async (t) => {
  const appSource = read('src/App.jsx');
  const navbarSource = read('src/components/Navbar.jsx');
  const mobileSource = read('src/components/MobileBottomNav.jsx');
  const examContextSource = read('src/context/ExamContext.jsx');
  const setupSource = read('src/features/awsConnection/AwsSetupGuide.jsx');
  const landingSource = read('src/components/FollowAlongs/FollowAlongLandingPage.jsx');
  const templateSource = read('src/data/cloudFormationTemplate.js');

  await t.test('1. the retired Hands On page is no longer imported or rendered', () => {
    assert.doesNotMatch(appSource, /HandsOnTasksView|viewMode === 'hands-on-tasks'/);
    assert.match(appSource, /viewMode === 'follow-alongs'/);
  });

  await t.test('2. desktop navigation has no Hands On entry or progress dependency', () => {
    assert.doesNotMatch(navbarSource, /hands-on-tasks|Hands-On Tasks|useTask|calculateTaskProgress/);
    assert.match(navbarSource, /setViewMode\('follow-alongs'\)/);
  });

  await t.test('3. mobile navigation has no Hands On entry or progress dependency', () => {
    assert.doesNotMatch(mobileSource, /hands-on-tasks|Hands-On|useTask|calculateTaskProgress|Terminal/);
    assert.match(mobileSource, /id: 'follow-alongs'/);
  });

  await t.test('4. the retired Hands On mode is gone while the old VPC route remains safe', () => {
    assert.doesNotMatch(examContextSource, /hands-on-tasks/);
    assert.match(examContextSource, /mode === 'vpc-learning-path'/);
    assert.match(examContextSource, /\? 'follow-alongs'/);
    assert.match(examContextSource, /setViewModeRaw\(normalizedMode\)/);
  });

  await t.test('5. user-facing wording describes Follow Alongs', () => {
    assert.match(appSource, /Interactive Study & AWS Follow Alongs/);
    assert.match(setupSource, /Back to Follow Alongs/);
    assert.match(setupSource, /Follow Along Verification/);
    assert.match(landingSource, /multiple guided tasks/);
    assert.doesNotMatch(`${appSource}\n${setupSource}\n${landingSource}`, /Hands-On Labs|hands-on labs|Back to All Labs/);
  });

  await t.test('6. the established AWS role identifiers remain compatible', () => {
    assert.match(setupSource, /StudyTrackerHandsOnRole/);
    assert.match(templateSource, /RoleName: StudyTrackerHandsOnRole/);
    assert.match(templateSource, /StudyTrackerHandsOnRole\.Arn/);
  });

  await t.test('7. retired runtime, local catalogue and importer are absent', () => {
    for (const path of ['src/components/HandsOnTasks', 'src/context/TaskContext.jsx', 'src/services/taskService.js']) {
      assert.equal(existsSync(path), false, `${path} must be retired`);
    }
    for (const path of ['scripts/importHandsOnTasks.js', 'src/data/tasks', 'src/data/tasksData.js']) {
      assert.equal(existsSync(path), false, `${path} must be retired by Step 62`);
    }
    assert.equal(existsSync('supabase/migrations'), true, 'database history must remain');
  });
});
