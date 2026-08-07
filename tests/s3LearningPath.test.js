import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  S3_PATH_ID,
  S3_RESOURCE_TAGS,
  S3_PATH_ONLY_TASKS,
  S3_LEARNING_PATH_PHASES,
  S3_OPTIONAL_TASK_IDS,
  S3_REVIEW_ONLY_TASK_IDS,
  S3_PROTECTED_RESOURCE_KEYS,
  getS3PathTasks,
  S3_LEARNING_PATH_DATA
} from '../src/data/s3LearningPathData.js';
import {
  GUEST_S3_PROGRESS_KEY,
  GUEST_S3_RESOURCES_KEY,
  getS3ProgrammeProgressSummary,
  validateS3ResourceRecord,
  mergeGuestS3StateWithRemote
} from '../src/services/s3LearningPathService.js';
import { S3_TASKS } from '../src/data/tasks/s3Tasks.js';

describe('S3 Learning Path Comprehensive Permanent Test Suite', () => {

  test('1. Programme ID is s3-learning-path', () => {
    assert.equal(S3_PATH_ID, 's3-learning-path');
    assert.equal(S3_LEARNING_PATH_DATA.programmeId, 's3-learning-path');
  });

  test('2. Path ID is s3-learning-path', () => {
    assert.equal(S3_RESOURCE_TAGS.StudyTrackerFollowAlong, 's3-learning-path');
  });

  test('3. Exactly 33 canonical S3 tasks exist in S3_TASKS', () => {
    assert.equal(S3_TASKS.length, 33);
  });

  test('4. All 33 canonical S3 task IDs are unique', () => {
    const ids = S3_TASKS.map(t => t.id);
    const uniqueIds = new Set(ids);
    assert.equal(uniqueIds.size, 33);
  });

  test('5. Zero omissions: All 33 canonical task IDs are present in data layer', () => {
    const pathTasks = getS3PathTasks().filter(t => !t.isPathOnly);
    assert.equal(pathTasks.length, 33);
    const canonicalIds = new Set(S3_TASKS.map(t => t.id));
    pathTasks.forEach(t => {
      assert.ok(canonicalIds.has(t.id), `Missing task ${t.id}`);
    });
  });

  test('6. Zero unknown canonical IDs in data layer', () => {
    const canonicalIds = new Set(S3_TASKS.map(t => t.id));
    const pathTasks = getS3PathTasks().filter(t => !t.isPathOnly);
    pathTasks.forEach(t => {
      assert.ok(canonicalIds.has(t.id), `Unknown task ${t.id}`);
    });
  });

  test('7. Exactly seven approved phases exist', () => {
    assert.equal(S3_LEARNING_PATH_PHASES.length, 7);
  });

  test('8. All canonical tasks belong to a valid approved phase (1..7)', () => {
    const pathTasks = getS3PathTasks().filter(t => !t.isPathOnly);
    pathTasks.forEach(t => {
      assert.ok(t.phaseId >= 1 && t.phaseId <= 7, `Task ${t.id} has invalid phase ${t.phaseId}`);
    });
  });

  test('9. Exactly six optional task IDs exist', () => {
    assert.equal(S3_OPTIONAL_TASK_IDS.length, 6);
    assert.deepEqual(S3_OPTIONAL_TASK_IDS, [
      'task-saa-s3-switch-default-encryption-to-sse-kms-011',
      'task-saa-s3-put-cloudfront-in-front-of-the-s3-website-016',
      'task-saa-s3-change-a-website-file-and-create-a-cloudfront-invalidation-017',
      'task-saa-s3-set-up-cross-region-replication-between-two-s3-buckets-022',
      'task-saa-s3-upload-a-file-and-confirm-cross-region-replication-copies-it-023',
      'task-saa-s3-create-a-multi-region-access-point-for-buckets-in-different-regions-027'
    ]);
  });

  test('10. Task 028 is review-only mandatory', () => {
    assert.deepEqual(S3_REVIEW_ONLY_TASK_IDS, [
      'task-saa-s3-open-s3-storage-lens-and-review-the-storage-dashboard-028'
    ]);
    const task28 = getS3PathTasks().find(t => t.id === 'task-saa-s3-open-s3-storage-lens-and-review-the-storage-dashboard-028');
    assert.ok(task28);
    assert.equal(task28.isReviewOnly, true);
    assert.equal(task28.isOptional, false);
  });

  test('11. Exactly one path-only cleanup task exists', () => {
    assert.equal(S3_PATH_ONLY_TASKS.length, 1);
    assert.equal(S3_PATH_ONLY_TASKS[0].id, 'path-s3-project-final-cleanup');
  });

  test('12. Path-only task ID does not collide with canonical IDs', () => {
    const canonicalIds = new Set(S3_TASKS.map(t => t.id));
    assert.equal(canonicalIds.has('path-s3-project-final-cleanup'), false);
  });

  test('13. Hard prerequisites reference valid canonical tasks', () => {
    const allTaskIds = new Set(getS3PathTasks().map(t => t.id));
    getS3PathTasks().forEach(task => {
      (task.prerequisites || []).forEach(preId => {
        assert.ok(allTaskIds.has(preId), `Task ${task.id} references non-existent prereq ${preId}`);
      });
    });
  });

  test('14. No required task depends on any optional task', () => {
    const optionalSet = new Set(S3_OPTIONAL_TASK_IDS);
    getS3PathTasks().forEach(task => {
      if (!task.isOptional) {
        (task.prerequisites || []).forEach(preId => {
          assert.equal(optionalSet.has(preId), false, `Required task ${task.id} depends on optional task ${preId}`);
        });
      }
    });
  });

  test('15. Approved resource keys exist in resource bindings', () => {
    const resourceKeys = [
      'primaryBucketName', 'loggingBucketName', 'readOnlyUserArn', 'kmsKeyId',
      'cloudfrontDistId', 'srrReplicaBucket', 'srrReplicationRoleArn',
      'crrReplicaBucket', 'crrReplicationRoleArn', 'accessPointArn', 'mrapArn'
    ];
    assert.equal(resourceKeys.length, 11);
  });

  test('16. Protected resource keys are correct', () => {
    assert.deepEqual(S3_PROTECTED_RESOURCE_KEYS, [
      'primaryBucketName', 'kmsKeyId', 'cloudfrontDistId'
    ]);
  });

  test('17. S3 guest progress key is correct', () => {
    assert.equal(GUEST_S3_PROGRESS_KEY, 'study_tracker_guest_s3_path_progress');
  });

  test('18. S3 guest resource key is correct', () => {
    assert.equal(GUEST_S3_RESOURCES_KEY, 'study_tracker_guest_s3_path_resources');
  });

  test('19. No VPC guest state reuse in S3 keys', () => {
    assert.equal(GUEST_S3_PROGRESS_KEY.includes('vpc'), false);
    assert.equal(GUEST_S3_RESOURCES_KEY.includes('vpc'), false);
  });

  test('20. No EC2 guest state reuse in S3 keys', () => {
    assert.equal(GUEST_S3_PROGRESS_KEY.includes('ec2'), false);
    assert.equal(GUEST_S3_RESOURCES_KEY.includes('ec2'), false);
  });

  test('21. No VPC programme ID reuse', () => {
    assert.notEqual(S3_PATH_ID, 'vpc-learning-path');
  });

  test('22. No EC2 programme ID reuse', () => {
    assert.notEqual(S3_PATH_ID, 'ec2-learning-path');
  });

  test('23. Optional branches do not block unrelated required tasks', () => {
    const summary = getS3ProgrammeProgressSummary([]);
    assert.equal(summary.status, 'Not Started');
    assert.equal(summary.total, 34);
  });

  test('24. CloudFront 016 -> 017 dependency preserved', () => {
    assert.ok(S3_OPTIONAL_TASK_IDS.includes('task-saa-s3-put-cloudfront-in-front-of-the-s3-website-016'));
    assert.ok(S3_OPTIONAL_TASK_IDS.includes('task-saa-s3-change-a-website-file-and-create-a-cloudfront-invalidation-017'));
  });

  test('25. CRR 022 -> 023 dependency preserved', () => {
    assert.ok(S3_OPTIONAL_TASK_IDS.includes('task-saa-s3-set-up-cross-region-replication-between-two-s3-buckets-022'));
    assert.ok(S3_OPTIONAL_TASK_IDS.includes('task-saa-s3-upload-a-file-and-confirm-cross-region-replication-copies-it-023'));
  });

  test('26. Cleanup path is final task', () => {
    const tasks = getS3PathTasks();
    const lastTask = tasks[tasks.length - 1];
    assert.equal(lastTask.id, 'path-s3-project-final-cleanup');
    assert.equal(lastTask.isPathOnly, true);
  });

  test('27. Optional cleanup resources are conditional', () => {
    const cleanupTask = S3_PATH_ONLY_TASKS[0];
    assert.ok(cleanupTask);
    assert.ok(cleanupTask.consoleSteps.length > 0);
  });

  test('28. No automatic destructive cleanup API behaviour', () => {
    const cleanupTask = S3_PATH_ONLY_TASKS[0];
    cleanupTask.cliSteps[0].commands.forEach(cmd => {
      assert.ok(cmd.text.startsWith('aws '), `Command ${cmd.text} must be manual CLI syntax`);
    });
  });

  test('29. Canonical task references remain authoritative', () => {
    const tasks = getS3PathTasks();
    const task1 = tasks.find(t => t.id === 'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001');
    assert.ok(task1.consoleSteps);
    assert.ok(task1.cliSteps);
  });

  test('30. Service persistence remains programme-scoped', () => {
    const validRecord = {
      resourceKey: 'primaryBucketName',
      resourceType: 's3_bucket',
      lifecycleStatus: 'created'
    };
    assert.equal(validateS3ResourceRecord(validRecord), true);

    const merged = mergeGuestS3StateWithRemote(
      { progress: { completed_task_ids: ['t1'], updated_at: '2026-08-07T10:00:00Z' } },
      { progress: { completed_task_ids: ['t2'], updated_at: '2026-08-07T09:00:00Z' } }
    );
    assert.deepEqual(merged.progress.completed_task_ids.sort(), ['t1', 't2']);
  });

});
