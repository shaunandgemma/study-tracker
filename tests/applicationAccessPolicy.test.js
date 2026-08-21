import assert from 'node:assert/strict';
import test from 'node:test';
import {
  APPLICATION_ACCOUNT_TYPES,
  APPLICATION_CONTENT_SCOPES,
  buildApplicationAccessPolicy,
  canAccessCompleteExam,
  getActiveExamEntitlementIds,
  getApplicationRoles,
  isExamPreviewOnly
} from '../src/features/access/applicationAccessPolicy.js';
import {
  canAccessFollowAlongApprovals,
  canAccessFollowAlongAuthor
} from '../src/features/followAlongAuthor/authorAccess.js';

const user = (id, appMetadata = {}) => ({ id, app_metadata: appMetadata });

test('Step 004G central application access policy', async t => {
  await t.test('signed-out and Demo identities fail closed', () => {
    const signedOut = buildApplicationAccessPolicy(null);
    const demo = buildApplicationAccessPolicy({ id: 'demo-read-only', is_demo: true, app_metadata: { roles: ['admin'] } });

    assert.equal(signedOut.accountType, APPLICATION_ACCOUNT_TYPES.SIGNED_OUT);
    assert.equal(signedOut.contentScope, APPLICATION_CONTENT_SCOPES.NONE);
    assert.equal(signedOut.canUseAccountProgress, false);
    assert.equal(demo.accountType, APPLICATION_ACCOUNT_TYPES.DEMO);
    assert.equal(demo.contentScope, APPLICATION_CONTENT_SCOPES.PREVIEW);
    assert.equal(demo.canManageContent, false);
    assert.equal(demo.canAccessAuthor, false);
    assert.equal(demo.canAccessApprovals, false);
  });

  await t.test('an ordinary authenticated account defaults to registered-free preview access', () => {
    const policy = buildApplicationAccessPolicy(user('free-learner'));

    assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE);
    assert.equal(policy.contentScope, APPLICATION_CONTENT_SCOPES.PREVIEW);
    assert.equal(policy.canUseAccountProgress, true);
    assert.equal(policy.hasAllExamAccess, false);
    assert.equal(canAccessCompleteExam(policy, 'aws-saa-c03'), false);
    assert.equal(isExamPreviewOnly(policy, 'aws-saa-c03'), true);
  });

  await t.test('only active verified exam entitlements create paid learner access', () => {
    const now = Date.parse('2026-08-20T12:00:00.000Z');
    const entitlements = [
      { user_id: 'paid-learner', exam_id: 'aws-saa-c03', status: 'active', starts_at: '2026-08-01T00:00:00.000Z', expires_at: '2027-08-01T00:00:00.000Z' },
      { user_id: 'paid-learner', exam_id: 'expired-exam', status: 'active', expires_at: '2026-08-19T00:00:00.000Z' },
      { user_id: 'paid-learner', exam_id: 'future-exam', status: 'active', starts_at: '2026-09-01T00:00:00.000Z' },
      { user_id: 'paid-learner', exam_id: 'cancelled-exam', status: 'cancelled' }
    ];
    const policy = buildApplicationAccessPolicy(user('paid-learner'), { verifiedEntitlements: entitlements, now });

    assert.deepEqual(getActiveExamEntitlementIds(entitlements, now), ['aws-saa-c03']);
    assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.PAID_LEARNER);
    assert.equal(policy.contentScope, APPLICATION_CONTENT_SCOPES.ENTITLED_EXAMS);
    assert.equal(canAccessCompleteExam(policy, 'aws-saa-c03'), true);
    assert.equal(canAccessCompleteExam(policy, 'terraform-associate-004'), false);
    assert.equal(isExamPreviewOnly(policy, 'aws-saa-c03'), false);
    assert.equal(isExamPreviewOnly(policy, 'terraform-associate-004'), true);
  });

  await t.test('verified rows from a previous account cannot affect the current account', () => {
    const policy = buildApplicationAccessPolicy(user('current-learner'), {
      verifiedEntitlements: [{
        user_id: 'previous-learner',
        exam_id: 'aws-saa-c03',
        status: 'active',
        starts_at: '2026-08-01T00:00:00.000Z',
        expires_at: '2027-08-01T00:00:00.000Z'
      }],
      now: Date.parse('2026-08-20T12:00:00.000Z')
    });

    assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE);
    assert.deepEqual(policy.activeExamIds, []);
  });

  await t.test('roles are accepted only from server-managed app metadata', () => {
    const forged = {
      id: 'forged-user',
      app_metadata: {},
      user_metadata: { role: 'admin', roles: ['author', 'approver'] }
    };

    assert.deepEqual(getApplicationRoles(forged), []);
    assert.equal(buildApplicationAccessPolicy(forged).accountType, APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE);
  });

  await t.test('Author receives full learning and Author access but not Approvals', () => {
    const author = user('author-user', { role: 'author' });
    const policy = buildApplicationAccessPolicy(author);

    assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.AUTHOR);
    assert.equal(policy.hasAllExamAccess, true);
    assert.equal(policy.canAccessAuthor, true);
    assert.equal(policy.canAccessApprovals, false);
    assert.equal(canAccessFollowAlongAuthor(author), true);
    assert.equal(canAccessFollowAlongApprovals(author), false);
  });

  await t.test('Approver receives full learning and Approvals access but not Author', () => {
    const approver = user('approver-user', { roles: ['approver'] });
    const policy = buildApplicationAccessPolicy(approver);

    assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.APPROVER);
    assert.equal(policy.hasAllExamAccess, true);
    assert.equal(policy.canAccessAuthor, false);
    assert.equal(policy.canAccessApprovals, true);
    assert.equal(canAccessFollowAlongAuthor(approver), false);
    assert.equal(canAccessFollowAlongApprovals(approver), true);
  });

  await t.test('Admin receives all learning and management access', () => {
    const admin = user('admin-user', { roles: ['admin'] });
    const policy = buildApplicationAccessPolicy(admin);

    assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.ADMIN);
    assert.equal(policy.contentScope, APPLICATION_CONTENT_SCOPES.ALL_EXAMS);
    assert.equal(policy.canManageContent, true);
    assert.equal(policy.canAccessAuthor, true);
    assert.equal(policy.canAccessApprovals, true);
    assert.equal(canAccessCompleteExam(policy, 'any-exam'), true);
    assert.equal(isExamPreviewOnly(policy, 'any-exam'), false);
  });

  await t.test('a non-Admin Author and Approver role conflict loses both privileged routes', () => {
    const conflicting = user('conflict-user', { roles: ['author', 'approver'] });
    const policy = buildApplicationAccessPolicy(conflicting);

    assert.equal(policy.roleConflict, true);
    assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE);
    assert.equal(policy.canAccessAuthor, false);
    assert.equal(policy.canAccessApprovals, false);
    assert.equal(policy.hasAllExamAccess, false);
  });
});
