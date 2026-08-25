import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  APPLICATION_CONTENT_SCOPES,
  buildApplicationAccessPolicy,
  getNextExamEntitlementBoundary,
  isExamPreviewOnly
} from '../src/features/access/applicationAccessPolicy.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Step 005B signed-out and time-sensitive entitlement hardening', async t => {
  await t.test('signed-out access remains none and is never interpreted as complete exam access', () => {
    const policy = buildApplicationAccessPolicy(null);

    assert.equal(policy.contentScope, APPLICATION_CONTENT_SCOPES.NONE);
    assert.equal(isExamPreviewOnly(policy, 'aws-saa-c03'), true);
    assert.equal(isExamPreviewOnly(null, 'terraform-associate-004'), true);
  });

  await t.test('the next active entitlement boundary is selected across all supported exams', () => {
    const now = Date.parse('2026-08-20T12:00:00.000Z');
    const rows = [
      {
        exam_id: 'aws-saa-c03',
        status: 'active',
        starts_at: '2026-08-01T00:00:00.000Z',
        expires_at: '2026-08-20T13:00:00.000Z'
      },
      {
        exam_id: 'terraform-associate-004',
        status: 'active',
        starts_at: '2026-08-20T12:10:00.000Z',
        expires_at: '2026-08-20T14:00:00.000Z'
      },
      {
        exam_id: 'comptia-sec-plus',
        status: 'revoked',
        starts_at: '2026-08-01T00:00:00.000Z',
        expires_at: '2026-08-20T12:05:00.000Z'
      }
    ];

    assert.equal(
      getNextExamEntitlementBoundary(rows, now),
      Date.parse('2026-08-20T12:10:00.000Z')
    );
  });

  await t.test('expired, revoked, malformed and unsupported rows schedule no refresh boundary', () => {
    const now = Date.parse('2026-08-20T12:00:00.000Z');
    const rows = [
      {
        exam_id: 'aws-saa-c03',
        status: 'active',
        starts_at: '2026-08-01T00:00:00.000Z',
        expires_at: '2026-08-20T12:00:00.000Z'
      },
      {
        exam_id: 'terraform-associate-004',
        status: 'revoked',
        starts_at: '2026-08-01T00:00:00.000Z',
        expires_at: '2027-08-01T00:00:00.000Z'
      },
      {
        exam_id: 'unsupported-exam',
        status: 'active',
        starts_at: '2026-08-01T00:00:00.000Z',
        expires_at: '2027-08-01T00:00:00.000Z'
      },
      { exam_id: 'comptia-sec-plus', status: 'active', starts_at: 'invalid', expires_at: 'invalid' }
    ];

    assert.equal(getNextExamEntitlementBoundary(rows, now), null);
  });

  await t.test('AuthContext refreshes safely on focus and at the next boundary', () => {
    const context = read('src/features/auth/AuthContext.jsx');

    assert.match(context, /getNextExamEntitlementBoundary/);
    assert.match(context, /addEventListener\?\.\('focus', refreshOnFocus\)/);
    assert.match(context, /removeEventListener\?\.\('focus', refreshOnFocus\)/);
    assert.match(context, /setTimeout\?\.\(\(\) =>/);
    assert.match(context, /clearTimeout\?\.\(timer\)/);
    assert.match(context, /refreshEntitlements\(\{ blocking: false \}\)/);
    assert.match(context, /buildApplicationAccessPolicy\(currentUser, \{[\s\S]*now: accessEvaluationTime/);
    assert.match(context, /entitlementRequestIdRef/);
    assert.match(context, /setVerifiedEntitlements\(\[\]\)[\s\S]*Unable to verify exam access/);
  });

  await t.test('same-learner session refreshes preserve the mounted workspace', () => {
    const context = read('src/features/auth/AuthContext.jsx');

    assert.match(context, /const currentUserId = currentUser\?\.id \|\| null/);
    assert.match(context, /const currentUserIsDemo = isDemoUser\(currentUser\)/);
    assert.match(
      context,
      /const refreshEntitlements = useCallback[\s\S]*\}, \[currentUserId, currentUserIsDemo, entitlementService\]\)/
    );
    assert.doesNotMatch(context, /\}, \[currentUser, entitlementService\]\)/);
    assert.match(context, /refreshEntitlements\(\{ blocking: false \}\)/);
  });

  await t.test('the application always gates a signed-out visitor and hides Demo entry when disabled', () => {
    const app = read('src/App.jsx');
    const gate = read('src/features/demo/DemoAccessGate.jsx');

    assert.match(app, /if \(!currentUser\) \{[\s\S]*<DemoAccessGate[\s\S]*demoEnabled=\{demoModeEnabled\}/);
    assert.doesNotMatch(app, /if \(demoModeEnabled && !currentUser\)/);
    assert.match(gate, /demoEnabled && <button[\s\S]*Enter Demo Account/);
    assert.match(gate, /Signed-out visitors cannot open an exam workspace or inherit paid access/);
  });

  await t.test('the entitlement refresh remains read-only and contains no payment implementation', () => {
    const context = read('src/features/auth/AuthContext.jsx');
    const policy = read('src/features/access/applicationAccessPolicy.js');

    assert.doesNotMatch(context, /\.(?:insert|upsert|update|delete)\s*\(/);
    assert.doesNotMatch(policy, /checkout|webhook|service[_-]?role|payment/i);
  });
});
