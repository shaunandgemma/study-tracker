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
import {
  DEMO_CONTENT_LIMITS,
  getDemoChecklistTopics,
  getDemoKnowledgeGuideOrder,
  limitDemoExamQuestions,
  limitDemoFollowAlongs,
  limitDemoTroubleshootingChallenges
} from '../src/features/demo/demoContentPolicy.js';
import {
  loadTroubleshootingProgress,
  saveTroubleshootingProgress
} from '../src/features/troubleshooting/troubleshootingProgress.js';

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

test('demo content policy exposes fixed small previews without mutating source arrays', () => {
  const questions = Array.from({ length: 15 }, (_, index) => ({ id: `q${index + 1}` }));
  const followAlongs = Array.from({ length: 4 }, (_, index) => ({ id: `fa${index + 1}` }));
  const challenges = Array.from({ length: 4 }, (_, index) => ({ id: `challenge${index + 1}` }));

  assert.equal(DEMO_CONTENT_LIMITS.examQuestions, 10);
  assert.deepEqual(limitDemoExamQuestions(questions).map(item => item.id), questions.slice(0, 10).map(item => item.id));
  assert.deepEqual(limitDemoFollowAlongs(followAlongs).map(item => item.id), ['fa1', 'fa2']);
  assert.deepEqual(limitDemoTroubleshootingChallenges(challenges).map(item => item.id), ['challenge1', 'challenge2']);
  assert.equal(questions.length, 15);
});

test('demo checklist and Knowledge Guide share the same first ten objective IDs', () => {
  const exam = {
    topics: [
      { id: 'topic-1', items: Array.from({ length: 7 }, (_, index) => ({ id: `item-${index + 1}` })) },
      { id: 'topic-2', items: Array.from({ length: 7 }, (_, index) => ({ id: `item-${index + 8}` })) }
    ]
  };
  const topics = getDemoChecklistTopics(exam);
  const checklistIds = topics.flatMap(topic => topic.items.map(item => item.id));

  assert.deepEqual(checklistIds, Array.from({ length: 10 }, (_, index) => `item-${index + 1}`));
  assert.deepEqual(getDemoKnowledgeGuideOrder(exam), checklistIds);
  assert.equal(exam.topics[1].items.length, 7);
});

test('demo Troubleshooting progress uses temporary memory storage', () => {
  demoProgressStorage.clear();
  saveTroubleshootingProgress({ challenge1: { completed: true } }, demoProgressStorage);
  assert.deepEqual(loadTroubleshootingProgress(demoProgressStorage), {
    challenge1: { completed: true }
  });
  demoProgressStorage.clear();
  assert.deepEqual(loadTroubleshootingProgress(demoProgressStorage), {});
});

test('the app enforces demo isolation and Admin-only content controls', () => {
  const app = read('src/App.jsx');
  const context = read('src/context/ExamContext.jsx');
  const landing = read('src/components/Landing/AppLandingPage.jsx');
  const checklist = read('src/components/StudyChecklist/ChecklistView.jsx');
  const topic = read('src/components/StudyChecklist/TopicCard.jsx');
  const navbar = read('src/components/Navbar.jsx');
  const examSetup = read('src/components/PrepExam/ExamSetup.jsx');
  const followAlongs = read('src/components/FollowAlongs/FollowAlongLandingPage.jsx');
  const troubleshooting = read('src/components/Troubleshooting/TroubleshootingView.jsx');
  const promotion = read('src/features/demo/DemoAnnualAccessPromotion.jsx');
  const accessGate = read('src/features/demo/DemoAccessGate.jsx');

  assert.match(app, /if \(!isDemoAccount\)[\s\S]*saveAttemptToSupabase/);
  assert.doesNotMatch(app, /AwsConnectionProvider|AwsSetupGuide|useAwsConnection/);
  assert.match(context, /if \(!canManageContent\) return \{ success: false/);
  assert.match(context, /isDemoAccount[\s\S]*buildDemoAttempts/);
  assert.match(landing, /canManageContent && <button[\s\S]*Add Custom Exam/);
  assert.match(checklist, /canEditChecklist && <button[\s\S]*Add New Topic/);
  assert.match(checklist, /contentManagementEnabled=\{false\}/);
  assert.match(topic, /canManageContent && contentManagementEnabled/);
  assert.match(navbar, /isDemoAccount[\s\S]*Safe Demo/);
  assert.match(examSetup, /isPreviewAccess \? limitDemoExamQuestions/);
  assert.match(followAlongs, /protectedFollowAlongContentService\.listForExam\(examId\)/);
  assert.match(followAlongs, /applyProtectedFollowAlongVisibility\([\s\S]*previewOnly/);
  assert.doesNotMatch(followAlongs, /FOLLOW_ALONG_LANDING_PROGRAMMES|limitDemoFollowAlongs/);
  assert.match(troubleshooting, /protectedTroubleshootingContentService\.listForExam\(examId\)/);
  assert.match(troubleshooting, /previewOnly: isPreviewAccess/);
  assert.doesNotMatch(troubleshooting, /getTroubleshootingChallengesForExam|limitDemoTroubleshootingChallenges/);
  assert.match(checklist, /applyProtectedChecklistKnowledgeGuideVisibility\([\s\S]*previewOnly: isPreviewAccess/);
  assert.doesNotMatch(checklist, /getDemoChecklistTopics|getDemoKnowledgeGuideOrder/);
  assert.match(app, /isPreviewAccess && viewMode !== 'app-home'[\s\S]*DemoAnnualAccessBanner/);
  assert.match(landing, /isExamPreviewOnly\(accessPolicy, exam\.id\)[\s\S]*DemoAnnualAccessAdvert/);
  assert.match(accessGate, /<DemoAnnualAccessAdvert \/>/);
  assert.match(promotion, /100\+ questions/);
  assert.match(promotion, /twelve months of access/);
  assert.doesNotMatch(promotion, /href=|onClick=|Purchase now|Buy now/);
});
