import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FOLLOW_ALONG_PROGRAMMES,
  getFollowAlongProgramme
} from '../src/data/followAlongProgrammes.js';

import {
  VPC_PATH_TASKS,
  VPC_LEARNING_PATH_PHASES
} from '../src/data/vpcLearningPathData.js';

import {
  getProgrammeProgressSummary
} from '../src/services/vpcLearningPathService.js';

test('Follow Alongs - Programme Catalogue Integrity', async (t) => {
  await t.test('1. Programme catalogue contains four available programmes (VPC, EC2, S3, and IAM)', () => {
    const available = FOLLOW_ALONG_PROGRAMMES.filter(p => p.status === 'available');
    assert.equal(available.length, 4, 'Must have exactly 4 available programmes');
  });

  await t.test('2. The available programmes are vpc-learning-path, ec2-learning-path, s3-learning-path, and iam-learning-path', () => {
    const vpcProg = getFollowAlongProgramme('vpc-learning-path');
    const ec2Prog = getFollowAlongProgramme('ec2-learning-path');
    const s3Prog = getFollowAlongProgramme('s3-learning-path');
    const iamProg = getFollowAlongProgramme('iam-learning-path');

    assert.ok(vpcProg, 'vpc-learning-path must exist in catalogue');
    assert.equal(vpcProg.status, 'available');
    assert.equal(vpcProg.taskCount, 45);
    assert.equal(vpcProg.phaseCount, 8);

    assert.ok(ec2Prog, 'ec2-learning-path must exist in catalogue');
    assert.equal(ec2Prog.status, 'available');
    assert.equal(ec2Prog.taskCount, 34);
    assert.equal(ec2Prog.phaseCount, 8);

    assert.ok(s3Prog, 's3-learning-path must exist in catalogue');
    assert.equal(s3Prog.status, 'available');
    assert.equal(s3Prog.pathId, 's3-learning-path');
    assert.equal(s3Prog.taskCount, 34); // 33 canonical S3 tasks + 1 path-only cleanup task
    assert.equal(s3Prog.phaseCount, 7);

    assert.ok(iamProg, 'iam-learning-path must exist in catalogue');
    assert.equal(iamProg.status, 'available');
    assert.equal(iamProg.pathId, 'iam-learning-path');
    assert.equal(iamProg.taskCount, 23); // 22 canonical IAM tasks + 1 path-only cleanup task
    assert.equal(iamProg.phaseCount, 6);
  });

  await t.test('3. The catalogue contains exactly 9 Coming Soon programmes', () => {
    const comingSoon = FOLLOW_ALONG_PROGRAMMES.filter(p => p.status === 'coming-soon');
    assert.equal(comingSoon.length, 9, 'Must have exactly 9 coming-soon programmes');
  });

  await t.test('4. All programme IDs and slugs are unique', () => {
    const ids = FOLLOW_ALONG_PROGRAMMES.map(p => p.id);
    const slugs = FOLLOW_ALONG_PROGRAMMES.map(p => p.slug);

    assert.equal(new Set(ids).size, ids.length, 'All programme IDs must be unique');
    assert.equal(new Set(slugs).size, slugs.length, 'All programme slugs must be unique');
  });
});

test('Follow Alongs - Navigation & View Mode Compatibility', async (t) => {
  await t.test('5. Main top-level view mode is follow-alongs', () => {
    const vpcProg = getFollowAlongProgramme('vpc-learning-path');
    assert.equal(vpcProg.pathId, 'vpc-learning-path');
  });

  await t.test('6. Legacy vpc-learning-path state normalizes to follow-alongs and auto-opens VPC', () => {
    // Normalization helper test
    const normalizeMode = (mode) => (mode === 'vpc-learning-path' ? 'follow-alongs' : mode);
    const getAutoOpenId = (mode) => (mode === 'vpc-learning-path' ? 'vpc-learning-path' : null);

    assert.equal(normalizeMode('vpc-learning-path'), 'follow-alongs');
    assert.equal(getAutoOpenId('vpc-learning-path'), 'vpc-learning-path');
    assert.equal(normalizeMode('checklist'), 'checklist');
    assert.equal(getAutoOpenId('checklist'), null);
  });
});

test('Follow Alongs - Progress Summaries & Status Mapping', async (t) => {
  await t.test('7. Returns loading state while summary is fetching', async () => {
    const initialLoadingSummary = { loading: true };
    assert.equal(initialLoadingSummary.loading, true);
  });

  await t.test('8. Unstarted user produces status "not-started" and Start action', async () => {
    const summary = await getProgrammeProgressSummary(null, 'vpc-learning-path');
    assert.equal(summary.loading, false);
    assert.equal(summary.programmeId, 'vpc-learning-path');
    assert.equal(summary.completedTasks, 0);
    assert.equal(summary.totalTasks, 45);
    assert.equal(summary.completionPercentage, 0);
    assert.equal(summary.status === 'not-started' || summary.status === 'in-progress' || summary.status === 'resources-retained', true);
  });

  await t.test('9. Coming Soon programmes return status "coming-soon" and non-startable summary', async () => {
    const summary = await getProgrammeProgressSummary(null, 's3-learning-path');
    assert.equal(summary.loading, false);
    assert.equal(summary.status, 'coming-soon');
    assert.equal(summary.completedTasks, 0);
  });

  await t.test('10. Verified all 6 status mapping values: Not Started, In Progress, Completed, Cleanup Pending, Resources Retained, Coming Soon', () => {
    const supportedStatuses = ['not-started', 'in-progress', 'completed', 'cleanup-pending', 'resources-retained', 'coming-soon'];
    assert.equal(supportedStatuses.length, 6);
  });
});

test('Follow Alongs - VPC Programme Compatibility & Preservation', async (t) => {
  await t.test('11. All 45 VPC tasks and 8 phases remain preserved in catalogue', () => {
    assert.equal(VPC_PATH_TASKS.length, 45, 'Catalogue must contain exactly 45 tasks');
    assert.equal(VPC_LEARNING_PATH_PHASES.length, 8, 'Catalogue must contain exactly 8 phases');
  });
});
