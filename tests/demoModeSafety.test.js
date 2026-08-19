import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  DEMO_SESSION_KEY,
  DEMO_USER,
  buildDemoAttempts,
  cloneDemoChecklist,
  cloneDemoExamHistory,
  demoProgressStorage,
  getApplicationRoles,
  isAdminUser,
  isDemoModeEnabled,
  isDemoUser,
  storeDemoSession
} from '../src/features/demo/demoMode.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('safe demo mode uses a strict explicit feature flag', () => {
  assert.equal(isDemoModeEnabled({ VITE_DEMO_MODE: 'true' }), true);
  assert.equal(isDemoModeEnabled({ VITE_DEMO_MODE: 'TRUE' }), true);
  assert.equal(isDemoModeEnabled({ VITE_DEMO_MODE: '1' }), false);
  assert.equal(isDemoModeEnabled({}), false);
});

test('demo identity can never inherit administrator authority', () => {
  assert.equal(isDemoUser(DEMO_USER), true);
  assert.equal(isAdminUser(DEMO_USER), false);
  assert.deepEqual(getApplicationRoles(DEMO_USER), ['demo']);
  assert.equal(isAdminUser({ id: 'admin-1', app_metadata: { roles: ['Admin'] } }), true);
  assert.equal(isAdminUser({ id: 'author-1', app_metadata: { role: 'author' } }), false);
});

test('demo records are independent fake copies and progress is memory-only', () => {
  const firstChecklist = cloneDemoChecklist();
  const secondChecklist = cloneDemoChecklist();
  firstChecklist['aws-saa-c03']['vpc-1'] = false;
  assert.equal(secondChecklist['aws-saa-c03']['vpc-1'], true);

  const history = cloneDemoExamHistory();
  assert.ok(history.length >= 2);
  assert.ok(history.every(attempt => attempt.demo === true));

  demoProgressStorage.clear();
  demoProgressStorage.setItem('progress', '{"complete":true}');
  assert.equal(demoProgressStorage.getItem('progress'), '{"complete":true}');
  demoProgressStorage.clear();
  assert.equal(demoProgressStorage.getItem('progress'), null);
});

test('demo session marker and fake attempt builder use no credentials', () => {
  const values = new Map();
  const storage = {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
  storeDemoSession(true, storage);
  assert.equal(values.get(DEMO_SESSION_KEY), 'active');
  storeDemoSession(false, storage);
  assert.equal(values.has(DEMO_SESSION_KEY), false);

  const attempts = buildDemoAttempts({
    id: 'exam-1',
    questions: [{ id: 'q1', correctAnswers: [0] }]
  });
  assert.equal(attempts.length, 1);
  assert.equal(attempts[0].demo, true);
  assert.deepEqual(attempts[0].answers, { q1: [0] });
});

test('the app enforces demo isolation and Admin-only content controls', () => {
  const app = read('src/App.jsx');
  const context = read('src/context/ExamContext.jsx');
  const landing = read('src/components/Landing/AppLandingPage.jsx');
  const checklist = read('src/components/StudyChecklist/ChecklistView.jsx');
  const topic = read('src/components/StudyChecklist/TopicCard.jsx');
  const navbar = read('src/components/Navbar.jsx');

  assert.match(app, /if \(!isDemoAccount\)[\s\S]*saveAttemptToSupabase/);
  assert.doesNotMatch(app, /AwsConnectionProvider|AwsSetupGuide|useAwsConnection/);
  assert.match(context, /if \(!canManageContent\) return \{ success: false/);
  assert.match(context, /isDemoAccount[\s\S]*buildDemoAttempts/);
  assert.match(landing, /canManageContent && <button[\s\S]*Add Custom Exam/);
  assert.match(checklist, /canManageContent && <button[\s\S]*Add New Topic/);
  assert.match(topic, /canManageContent && <div[\s\S]*Delete Topic/);
  assert.match(navbar, /isDemoAccount[\s\S]*Safe Demo/);
});
