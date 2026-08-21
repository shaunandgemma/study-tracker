import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  APPLICATION_ACCOUNT_TYPES,
  APPLICATION_EXAM_IDS,
  buildApplicationAccessPolicy,
  getExamAccessDetails,
  getNextExamEntitlementBoundary,
  isExamPreviewOnly
} from '../src/features/access/applicationAccessPolicy.js';
import { resolveEntitlementRefreshResult } from '../src/features/access/entitlementRefreshPolicy.js';

const NOW = Date.parse('2026-08-20T12:00:00.000Z');
const user = (id = 'learner', roles = []) => ({ id, app_metadata: { roles } });
const row = ({
  userId = 'learner',
  examId = 'aws-saa-c03',
  status = 'active',
  startsAt = '2026-08-01T00:00:00.000Z',
  expiresAt = '2027-08-01T00:00:00.000Z'
} = {}) => ({
  user_id: userId,
  exam_id: examId,
  status,
  starts_at: startsAt,
  expires_at: expiresAt
});
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Step 005D complete paid-entitlement enforcement matrix', async t => {
  await t.test('missing, future, expired, revoked and malformed rows all fail closed', () => {
    const scenarios = [
      [],
      [row({ startsAt: '2026-08-21T00:00:00.000Z' })],
      [row({ expiresAt: '2026-08-20T12:00:00.000Z' })],
      [row({ status: 'revoked' })],
      [row({ startsAt: null })],
      [row({ expiresAt: null })],
      [row({ startsAt: 'invalid' })],
      [row({ startsAt: '2027-01-01T00:00:00.000Z', expiresAt: '2026-01-01T00:00:00.000Z' })]
    ];

    for (const verifiedEntitlements of scenarios) {
      const policy = buildApplicationAccessPolicy(user(), { verifiedEntitlements, now: NOW });
      assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.REGISTERED_FREE);
      assert.deepEqual(policy.activeExamIds, []);
      assert.equal(isExamPreviewOnly(policy, 'aws-saa-c03'), true);
    }
  });

  await t.test('each exact active entitlement unlocks only its own exam', () => {
    for (const examId of APPLICATION_EXAM_IDS) {
      const policy = buildApplicationAccessPolicy(user(), {
        verifiedEntitlements: [row({ examId })],
        now: NOW
      });

      assert.equal(policy.accountType, APPLICATION_ACCOUNT_TYPES.PAID_LEARNER);
      for (const candidateExamId of APPLICATION_EXAM_IDS) {
        assert.equal(
          isExamPreviewOnly(policy, candidateExamId),
          candidateExamId !== examId,
          `${examId} must not unlock ${candidateExamId}`
        );
      }
    }
  });

  await t.test('multiple active entitlements stay independent and use the latest exact-exam expiry', () => {
    const policy = buildApplicationAccessPolicy(user(), {
      verifiedEntitlements: [
        row({ examId: 'aws-saa-c03', expiresAt: '2026-12-01T00:00:00.000Z' }),
        row({ examId: 'aws-saa-c03', expiresAt: '2027-08-01T00:00:00.000Z' }),
        row({ examId: 'terraform-associate-004', expiresAt: '2027-02-01T00:00:00.000Z' }),
        row({ examId: 'comptia-sec-plus', status: 'revoked' })
      ],
      now: NOW
    });

    assert.deepEqual(policy.activeExamIds, ['aws-saa-c03', 'terraform-associate-004']);
    assert.equal(getExamAccessDetails(policy, 'aws-saa-c03').expiresAt, '2027-08-01T00:00:00.000Z');
    assert.equal(isExamPreviewOnly(policy, 'comptia-sec-plus'), true);
  });

  await t.test('the exclusive expiry boundary removes access while preserving unrelated learner state', () => {
    const entitlement = row({ expiresAt: '2026-08-20T12:05:00.000Z' });
    const progress = Object.freeze({ checklist: Object.freeze({ task1: true }), attemptCount: 3 });
    const before = buildApplicationAccessPolicy(user(), {
      verifiedEntitlements: [entitlement],
      now: Date.parse('2026-08-20T12:04:59.999Z')
    });
    const after = buildApplicationAccessPolicy(user(), {
      verifiedEntitlements: [entitlement],
      now: Date.parse('2026-08-20T12:05:00.000Z')
    });

    assert.equal(isExamPreviewOnly(before, 'aws-saa-c03'), false);
    assert.equal(isExamPreviewOnly(after, 'aws-saa-c03'), true);
    assert.deepEqual(progress, { checklist: { task1: true }, attemptCount: 3 });
    assert.equal(
      getNextExamEntitlementBoundary([entitlement], Date.parse('2026-08-20T12:04:00.000Z')),
      Date.parse('2026-08-20T12:05:00.000Z')
    );
  });

  await t.test('failed and malformed refresh results clear access instead of retaining rows', () => {
    const failures = [
      null,
      {},
      { success: false, verified: false, rows: [row()] },
      { success: true, verified: false, rows: [row()] },
      { success: true, verified: true, rows: null }
    ];

    for (const result of failures) {
      const decision = resolveEntitlementRefreshResult(result);
      assert.equal(decision.accepted, false);
      assert.deepEqual(decision.rows, []);
      assert.equal(typeof decision.error, 'string');
    }

    const acceptedRows = [row()];
    const accepted = resolveEntitlementRefreshResult({ success: true, verified: true, rows: acceptedRows });
    assert.equal(accepted.accepted, true);
    assert.equal(accepted.rows, acceptedRows);
    assert.equal(accepted.error, null);
  });

  await t.test('focus, boundary and stale-response protections all use the same safe refresh', () => {
    const context = read('src/features/auth/AuthContext.jsx');

    assert.match(context, /const refreshOnFocus = \(\) => \{[\s\S]*refreshEntitlements\(\{ blocking: false \}\)/);
    assert.match(context, /const timer = globalThis\.setTimeout\?\.\(\(\) => \{[\s\S]*refreshEntitlements\(\{ blocking: false \}\)/);
    assert.match(context, /requestId !== entitlementRequestIdRef\.current/);
    assert.match(context, /resolveEntitlementRefreshResult\(result\)/);
    assert.match(context, /setVerifiedEntitlements\(\[\]\)/);
  });

  await t.test('staff roles and role conflicts retain their exact boundaries', () => {
    const author = buildApplicationAccessPolicy(user('author', ['author']));
    const approver = buildApplicationAccessPolicy(user('approver', ['approver']));
    const admin = buildApplicationAccessPolicy(user('admin', ['admin']));
    const conflict = buildApplicationAccessPolicy(user('conflict', ['author', 'approver']));

    assert.deepEqual(
      [author.canAccessAuthor, author.canAccessApprovals, author.hasAllExamAccess],
      [true, false, true]
    );
    assert.deepEqual(
      [approver.canAccessAuthor, approver.canAccessApprovals, approver.hasAllExamAccess],
      [false, true, true]
    );
    assert.deepEqual(
      [admin.canAccessAuthor, admin.canAccessApprovals, admin.hasAllExamAccess],
      [true, true, true]
    );
    assert.deepEqual(
      [conflict.canAccessAuthor, conflict.canAccessApprovals, conflict.hasAllExamAccess],
      [false, false, false]
    );
  });

  await t.test('entitlement transitions contain no learner-progress deletion path', () => {
    const context = read('src/features/auth/AuthContext.jsx');
    const policy = read('src/features/access/applicationAccessPolicy.js');
    const refresh = read('src/features/access/entitlementRefreshPolicy.js');
    const combined = `${context}\n${policy}\n${refresh}`;

    assert.doesNotMatch(combined, /resetExamProgress|deleteLearner|removeItem|\.delete\s*\(/);
    assert.doesNotMatch(combined, /exam_entitlements[\s\S]*\.(?:insert|upsert|update|delete)\s*\(/i);
    assert.doesNotMatch(combined, /stripe|checkout|webhook|service_role/i);
  });
});
