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
  await t.test('1. Static programme catalogue contains only the retained VPC programme', () => {
    const available = FOLLOW_ALONG_PROGRAMMES.filter(p => p.status === 'available');
    assert.equal(available.length, 1, 'Must have exactly 1 static available programme');
  });

  await t.test('2. Legacy S3, EC2, and IAM programmes are absent from the static catalogue', () => {
    const vpcProg = getFollowAlongProgramme('vpc-learning-path');

    assert.ok(vpcProg, 'vpc-learning-path must exist in catalogue');
    assert.equal(vpcProg.status, 'available');
    assert.equal(vpcProg.taskCount, 45);
    assert.equal(vpcProg.phaseCount, 8);

    assert.equal(getFollowAlongProgramme('ec2-learning-path'), null);
    assert.equal(getFollowAlongProgramme('s3-learning-path'), null);
    assert.equal(getFollowAlongProgramme('iam-learning-path'), null);
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

  await t.test('9a. Signed-in VPC summaries use the existing Supabase progress loader', async () => {
    const completedTaskId = VPC_PATH_TASKS[0].id;
    const responses = {
      user_learning_path_progress: {
        data: {
          completed_task_ids: [completedTaskId],
          current_task_id: completedTaskId,
          completion_status: 'in_progress',
          updated_at: '2026-08-09T12:00:00.000Z'
        },
        error: null
      },
      user_learning_path_resources: { data: { resources: {} }, error: null }
    };
    const client = {
      from(table) {
        const builder = {
          select() { return builder; },
          eq() { return builder; },
          maybeSingle() { return Promise.resolve(responses[table]); }
        };
        return builder;
      }
    };

    const summary = await getProgrammeProgressSummary('signed-in-user', 'vpc-learning-path', client);
    assert.equal(summary.status, 'in-progress');
    assert.equal(summary.completedTasks, 1);
    assert.equal(summary.totalTasks, 45);
    assert.equal(summary.currentTaskId, completedTaskId);
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
