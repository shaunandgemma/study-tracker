import test from 'node:test';
import assert from 'node:assert/strict';
import {
  APPLICATION_ACCOUNT_TYPES,
  buildApplicationAccessPolicy
} from '../src/features/access/applicationAccessPolicy.js';
import {
  canAccessFollowAlongApprovals,
  canAccessFollowAlongAuthor,
  isAuthorApprovalEntryRequested,
  isAuthorEntryRequested,
  isUnsupportedAuthorEntryRequested
} from '../src/features/followAlongAuthor/authorAccess.js';
import {
  AUTHOR_APPROVAL_STORAGE_AUTHORITY,
  canApproveAuthorRelease
} from '../src/features/followAlongAuthor/authorApproval.js';

const NOW = Date.parse('2026-08-20T12:00:00.000Z');
const paidEntitlements = [{
  user_id: 'paid-1',
  exam_id: 'aws-saa-c03',
  status: 'active',
  starts_at: '2026-08-01T00:00:00.000Z',
  expires_at: '2027-08-01T00:00:00.000Z'
}];

const cases = [
  { name: 'signed out', user: null, accountType: APPLICATION_ACCOUNT_TYPES.SIGNED_OUT, author: false, approvals: false, manage: false, allExams: false, conflict: false },
  { name: 'Demo', user: { id: 'demo-read-only', is_demo: true, app_metadata: { roles: ['admin'] } }, accountType: APPLICATION_ACCOUNT_TYPES.DEMO, author: false, approvals: false, manage: false, allExams: false, conflict: false },
  { name: 'registered free', user: { id: 'free-1', app_metadata: {} }, accountType: APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE, author: false, approvals: false, manage: false, allExams: false, conflict: false },
  { name: 'paid learner', user: { id: 'paid-1', app_metadata: {} }, options: { verifiedEntitlements: paidEntitlements, now: NOW }, accountType: APPLICATION_ACCOUNT_TYPES.PAID_LEARNER, author: false, approvals: false, manage: false, allExams: false, conflict: false },
  { name: 'Author', user: { id: 'author-1', app_metadata: { role: 'author' } }, accountType: APPLICATION_ACCOUNT_TYPES.AUTHOR, author: true, approvals: false, manage: false, allExams: true, conflict: false },
  { name: 'Approver', user: { id: 'approver-1', app_metadata: { roles: ['approver'] } }, accountType: APPLICATION_ACCOUNT_TYPES.APPROVER, author: false, approvals: true, manage: false, allExams: true, conflict: false },
  { name: 'Admin', user: { id: 'admin-1', app_metadata: { role: 'admin' } }, accountType: APPLICATION_ACCOUNT_TYPES.ADMIN, author: true, approvals: true, manage: true, allExams: true, conflict: false },
  { name: 'non-Admin conflict', user: { id: 'conflict-1', app_metadata: { roles: ['author', 'approver'] } }, accountType: APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE, author: false, approvals: false, manage: false, allExams: false, conflict: true },
  { name: 'Admin with both staff roles', user: { id: 'admin-combined-1', app_metadata: { roles: ['author', 'approver', 'admin'] } }, accountType: APPLICATION_ACCOUNT_TYPES.ADMIN, author: true, approvals: true, manage: true, allExams: true, conflict: false }
];

test('Step 006C complete staff-role and Author-route matrix', async t => {
  for (const entry of cases) {
    await t.test(`${entry.name} receives only its intended access`, () => {
      const policy = buildApplicationAccessPolicy(entry.user, entry.options);
      assert.equal(policy.accountType, entry.accountType);
      assert.equal(policy.canAccessAuthor, entry.author);
      assert.equal(policy.canAccessApprovals, entry.approvals);
      assert.equal(policy.canManageContent, entry.manage);
      assert.equal(policy.hasAllExamAccess, entry.allExams);
      assert.equal(policy.roleConflict, entry.conflict);
      assert.equal(canAccessFollowAlongAuthor(entry.user), entry.author);
      assert.equal(canAccessFollowAlongApprovals(entry.user), entry.approvals);
    });
  }

  await t.test('only Approver and Admin identities pass the independent approval helper', () => {
    const authority = AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER;
    const allowedNames = new Set(['Approver', 'Admin', 'Admin with both staff roles']);

    for (const entry of cases) {
      const result = canApproveAuthorRelease({
        user: entry.user,
        createdBy: 'different-author',
        storageAuthority: authority
      });
      assert.equal(result.allowed, allowedNames.has(entry.name), entry.name);
    }
  });

  await t.test('only the two exact Author hashes are supported', () => {
    const routes = [
      { hash: '#author', entry: true, approval: false, unsupported: false },
      { hash: '#AUTHOR', entry: true, approval: false, unsupported: false },
      { hash: '#author/approvals', entry: true, approval: true, unsupported: false },
      { hash: '#AUTHOR/APPROVALS', entry: true, approval: true, unsupported: false },
      { hash: '#author/', entry: true, approval: false, unsupported: true },
      { hash: '#author/drafts', entry: true, approval: false, unsupported: true },
      { hash: '#author/approvals/', entry: true, approval: false, unsupported: true },
      { hash: '#author/anything', entry: true, approval: false, unsupported: true },
      { hash: '#authorish', entry: false, approval: false, unsupported: false },
      { hash: '#follow-alongs', entry: false, approval: false, unsupported: false },
      { hash: '', entry: false, approval: false, unsupported: false }
    ];

    for (const route of routes) {
      assert.equal(isAuthorEntryRequested(route), route.entry, `${route.hash} entry`);
      assert.equal(isAuthorApprovalEntryRequested(route), route.approval, `${route.hash} approval`);
      assert.equal(isUnsupportedAuthorEntryRequested(route), route.unsupported, `${route.hash} unsupported`);
    }
  });
});
