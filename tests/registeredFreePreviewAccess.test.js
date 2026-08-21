import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  APPLICATION_ACCOUNT_TYPES,
  buildApplicationAccessPolicy,
  isExamPreviewOnly
} from '../src/features/access/applicationAccessPolicy.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Step 004J applies preview content without Demo progress isolation', async t => {
  await t.test('registered-free is preview-only but retains authenticated progress', () => {
    const policy = buildApplicationAccessPolicy({ id: 'registered-free', app_metadata: {} });

    assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE);
    assert.equal(policy.canUseAccountProgress, true);
    assert.equal(policy.usesTemporaryProgress, false);
    assert.equal(isExamPreviewOnly(policy, 'aws-saa-c03'), true);
  });

  await t.test('paid access is exam-specific and privileged roles remain complete', () => {
    const paid = buildApplicationAccessPolicy(
      { id: 'paid', app_metadata: {} },
      {
        verifiedEntitlements: [{
          user_id: 'paid',
          exam_id: 'terraform-associate-004',
          status: 'active',
          starts_at: '2026-01-01T00:00:00.000Z',
          expires_at: '2027-01-01T00:00:00.000Z'
        }],
        now: Date.parse('2026-08-20T12:00:00.000Z')
      }
    );
    const author = buildApplicationAccessPolicy({ id: 'author', app_metadata: { role: 'author' } });
    const approver = buildApplicationAccessPolicy({ id: 'approver', app_metadata: { role: 'approver' } });
    const admin = buildApplicationAccessPolicy({ id: 'admin', app_metadata: { role: 'admin' } });

    assert.equal(isExamPreviewOnly(paid, 'terraform-associate-004'), false);
    assert.equal(isExamPreviewOnly(paid, 'aws-saa-c03'), true);
    assert.equal(isExamPreviewOnly(author, 'aws-saa-c03'), false);
    assert.equal(isExamPreviewOnly(approver, 'aws-saa-c03'), false);
    assert.equal(isExamPreviewOnly(admin, 'aws-saa-c03'), false);
  });

  await t.test('learner surfaces use preview access while persistence still uses Demo identity only', () => {
    const app = read('src/App.jsx');
    const context = read('src/context/ExamContext.jsx');
    const examSetup = read('src/components/PrepExam/ExamSetup.jsx');
    const checklist = read('src/components/StudyChecklist/ChecklistView.jsx');
    const followAlongs = read('src/components/FollowAlongs/FollowAlongLandingPage.jsx');
    const troubleshooting = read('src/components/Troubleshooting/TroubleshootingView.jsx');

    assert.match(context, /isPreviewAccess: isExamPreviewOnly|const isPreviewAccess = isExamPreviewOnly/);
    assert.match(examSetup, /isPreviewAccess \? limitDemoExamQuestions/);
    assert.match(checklist, /applyProtectedChecklistKnowledgeGuideVisibility\([\s\S]*previewOnly: isPreviewAccess/);
    assert.doesNotMatch(checklist, /getDemoChecklistTopics|getDemoKnowledgeGuideOrder/);
    assert.match(followAlongs, /protectedFollowAlongContentService\.listForExam\(examId\)/);
    assert.match(followAlongs, /applyProtectedFollowAlongVisibility\([\s\S]*previewOnly/);
    assert.doesNotMatch(followAlongs, /FOLLOW_ALONG_LANDING_PROGRAMMES|limitDemoFollowAlongs/);
    assert.match(troubleshooting, /protectedTroubleshootingContentService\.listForExam\(examId\)/);
    assert.match(troubleshooting, /applyProtectedTroubleshootingVisibility\([\s\S]*previewOnly: isPreviewAccess/);
    assert.doesNotMatch(troubleshooting, /getTroubleshootingChallengesForExam|limitDemoTroubleshootingChallenges/);
    assert.match(troubleshooting, /progressStorage = isDemoAccount \? demoProgressStorage : null/);
    assert.match(troubleshooting, /progressUserId = !isDemoAccount && currentUser\?\.id/);
    assert.match(app, /if \(!isDemoAccount\)[\s\S]*saveAttemptToSupabase/);
    assert.match(app, /entitlementsLoading[\s\S]*Checking exam access/);
    assert.doesNotMatch(app, /Purchase now|Buy now|href=.*payment/i);
  });
});
