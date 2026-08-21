import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  buildApplicationAccessPolicy,
  getExamAccessDetails
} from '../src/features/access/applicationAccessPolicy.js';
import { evaluateFollowAlongRouteAccess } from '../src/features/access/followAlongAccessPolicy.js';
import { buildPublishedProgrammeCard } from '../src/features/followAlongs/published/publishedFollowAlongService.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const now = Date.parse('2026-08-20T12:00:00.000Z');

function publishedRow(programmeId, examId) {
  return {
    candidate_id: `candidate-${programmeId}`,
    source_revision: 1,
    content_hash: 'a'.repeat(64),
    published_at: '2026-08-20T10:00:00.000Z',
    runtime_content: {
      programme: {
        programmeId,
        pathId: programmeId,
        examId,
        displayName: 'Exact exam Follow Along',
        serviceName: 'Training service',
        serviceSlug: 'training',
        shortName: 'Training'
      },
      phases: [],
      tasks: []
    }
  };
}

test('Step 005C exact-exam learner route enforcement', async t => {
  await t.test('paid access exposes only the selected exam and safe expiry summary', () => {
    const policy = buildApplicationAccessPolicy(
      { id: 'paid-user', app_metadata: {} },
      {
        verifiedEntitlements: [{
          user_id: 'paid-user',
          exam_id: 'terraform-associate-004',
          status: 'active',
          starts_at: '2026-08-01T00:00:00.000Z',
          expires_at: '2027-08-01T00:00:00.000Z'
        }],
        now
      }
    );

    assert.deepEqual(getExamAccessDetails(policy, 'terraform-associate-004'), {
      examId: 'terraform-associate-004',
      kind: 'paid',
      complete: true,
      expiresAt: '2027-08-01T00:00:00.000Z'
    });
    assert.deepEqual(getExamAccessDetails(policy, 'aws-saa-c03'), {
      examId: 'aws-saa-c03',
      kind: 'preview',
      complete: false,
      expiresAt: null
    });
    assert.equal(JSON.stringify(policy.activeExamEntitlements).includes('paid-user'), false);
  });

  await t.test('staff access remains complete without inventing an entitlement expiry', () => {
    const policy = buildApplicationAccessPolicy({ id: 'author-user', app_metadata: { role: 'author' } });
    assert.deepEqual(getExamAccessDetails(policy, 'aws-saa-c03'), {
      examId: 'aws-saa-c03', kind: 'staff', complete: true, expiresAt: null
    });
  });

  await t.test('a Follow Along opens only from the current exact-exam catalogue', () => {
    const terraformProgramme = buildPublishedProgrammeCard(
      publishedRow('terraform-state-learning-path', 'terraform-associate-004')
    );

    assert.equal(evaluateFollowAlongRouteAccess({
      programmeId: terraformProgramme.id,
      programme: terraformProgramme,
      selectedExamId: 'terraform-associate-004',
      selectedFromExamCatalogue: true
    }).allowed, true);

    assert.equal(evaluateFollowAlongRouteAccess({
      programmeId: terraformProgramme.id,
      programme: terraformProgramme,
      selectedExamId: 'aws-saa-c03',
      selectedFromExamCatalogue: true
    }).allowed, false);

    assert.equal(evaluateFollowAlongRouteAccess({
      programmeId: terraformProgramme.id,
      programme: terraformProgramme,
      selectedExamId: 'terraform-associate-004',
      selectedFromExamCatalogue: false
    }).allowed, false);
  });

  await t.test('stale exam and programme IDs are normalised or rejected before content opens', () => {
    const context = read('src/context/ExamContext.jsx');
    const catalogue = read('src/components/FollowAlongs/FollowAlongsView.jsx');
    const publishedView = read('src/components/FollowAlongs/PublishedFollowAlongView.jsx');

    assert.match(context, /exams\.find\(e => e\.id === requestedActiveExamId\) \|\| exams\[0\]/);
    assert.match(context, /if \(!exams\.some\(exam => exam\.id === id\)\) return false/);
    assert.match(catalogue, /setSelection\(null\)[\s\S]*\[examId, previewOnly\]/);
    assert.doesNotMatch(catalogue, /initialProgrammeId|vpc-learning-path/);
    assert.match(catalogue, /selectedFromExamCatalogue=\{selection\?\.examId === examId\}/);
    assert.match(publishedView, /evaluateFollowAlongRouteAccess/);
    assert.match(publishedView, /selectedExamId: expectedExamId/);
  });

  await t.test('the selected exam landing page shows only safe access status fields', () => {
    const landing = read('src/components/Landing/ExamLandingPage.jsx');
    const status = read('src/features/access/ExamAccessStatus.jsx');

    assert.match(landing, /<ExamAccessStatus accessPolicy=\{accessPolicy\} examId=\{exam\.id\}/);
    assert.match(status, /Verified exam access/);
    assert.match(status, /dateTime=\{details\.expiresAt\}/);
    assert.doesNotMatch(status, /user_id|userId|email|payment|checkout/i);
  });

  await t.test('Step 005C contains no entitlement write, payment or infrastructure change', () => {
    const files = [
      'src/features/access/applicationAccessPolicy.js',
      'src/features/access/followAlongAccessPolicy.js',
      'src/features/access/ExamAccessStatus.jsx',
      'src/components/FollowAlongs/FollowAlongsView.jsx',
      'src/components/FollowAlongs/PublishedFollowAlongView.jsx'
    ].map(read).join('\n');

    assert.doesNotMatch(files, /exam_entitlements[\s\S]*\.(?:insert|upsert|update|delete)\s*\(/i);
    assert.doesNotMatch(files, /stripe|checkout|webhook|service_role/i);
  });
});
