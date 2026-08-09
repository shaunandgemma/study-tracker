import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  IAM_PATH_ID,
  IAM_RESOURCE_TAGS,
  IAM_PATH_ONLY_TASKS,
  IAM_LEARNING_PATH_PHASES,
  IAM_OPTIONAL_TASK_IDS,
  IAM_REVIEW_ONLY_TASK_IDS,
  IAM_PROTECTED_RESOURCE_KEYS,
  getIamPathTasks,
  IAM_LEARNING_PATH_DATA
} from '../src/data/iamLearningPathData.js';
import {
  GUEST_IAM_PROGRESS_KEY,
  GUEST_IAM_RESOURCES_KEY,
  getIamProgrammeProgressSummary,
  validateIamResourceRecord,
  mergeGuestIamStateWithRemote
} from '../src/services/iamLearningPathService.js';
import { IAM_TASKS } from '../src/features/followAlongs/catalogues/iamFollowAlongTasks.js';

describe('IAM Learning Path Comprehensive Permanent Test Suite', () => {

  test('1. Programme ID is iam-learning-path', () => {
    assert.equal(IAM_PATH_ID, 'iam-learning-path');
    assert.equal(IAM_LEARNING_PATH_DATA.programmeId, 'iam-learning-path');
  });

  test('2. Path ID is iam-learning-path', () => {
    assert.equal(IAM_RESOURCE_TAGS.StudyTrackerFollowAlong, 'iam-learning-path');
  });

  test('3. Exactly 22 canonical IAM tasks exist in IAM_TASKS', () => {
    assert.equal(IAM_TASKS.length, 22);
  });

  test('4. All 22 canonical IAM task IDs are unique', () => {
    const ids = IAM_TASKS.map(t => t.id);
    const uniqueIds = new Set(ids);
    assert.equal(uniqueIds.size, 22);
  });

  test('5. Zero omissions: All 22 canonical task IDs are present in data layer', () => {
    const pathTasks = getIamPathTasks().filter(t => !t.isPathOnly);
    assert.equal(pathTasks.length, 22);
    const canonicalIds = new Set(IAM_TASKS.map(t => t.id));
    pathTasks.forEach(t => {
      assert.ok(canonicalIds.has(t.id), `Missing task ${t.id}`);
    });
  });

  test('6. Zero unknown canonical IDs in data layer', () => {
    const canonicalIds = new Set(IAM_TASKS.map(t => t.id));
    const pathTasks = getIamPathTasks().filter(t => !t.isPathOnly);
    pathTasks.forEach(t => {
      assert.ok(canonicalIds.has(t.id), `Unknown task ${t.id}`);
    });
  });

  test('7. Exactly six approved phases exist', () => {
    assert.equal(IAM_LEARNING_PATH_PHASES.length, 6);
  });

  test('8. All canonical tasks belong to a valid approved phase (1..6)', () => {
    const pathTasks = getIamPathTasks().filter(t => !t.isPathOnly);
    pathTasks.forEach(t => {
      assert.ok(t.phaseId >= 1 && t.phaseId <= 6, `Task ${t.id} has invalid phase ${t.phaseId}`);
    });
  });

  test('9. Exactly seven optional task IDs exist', () => {
    assert.equal(IAM_OPTIONAL_TASK_IDS.length, 7);
    assert.deepEqual(IAM_OPTIONAL_TASK_IDS, [
      'task-saa-iam-use-aws-principalorgid-to-block-cross-account-access-012',
      'task-saa-iam-configure-mfa-and-enforce-mfa-for-sensitive-api-actions-013',
      'task-saa-iam-create-a-role-with-external-id-and-test-assumerole-014',
      'task-saa-iam-set-up-saml-federation-and-sign-in-to-aws-016',
      'task-saa-iam-cross-account-s3-bucket-policy-read-access-020',
      'task-saa-iam-iam-access-key-lifecycle-023',
      'task-saa-iam-lambda-stops-only-tagged-ec2-instances-025'
    ]);
  });

  test('10. Task 022 is review-only mandatory', () => {
    assert.deepEqual(IAM_REVIEW_ONLY_TASK_IDS, [
      'task-saa-iam-iam-password-policy-best-practices-022'
    ]);
    const task22 = getIamPathTasks().find(t => t.id === 'task-saa-iam-iam-password-policy-best-practices-022');
    assert.ok(task22);
    assert.equal(task22.isReviewOnly, true);
    assert.equal(task22.isOptional, false);
  });

  test('11. Exactly one path-only cleanup task exists', () => {
    assert.equal(IAM_PATH_ONLY_TASKS.length, 1);
    assert.equal(IAM_PATH_ONLY_TASKS[0].id, 'path-iam-project-final-cleanup');
  });

  test('12. Path-only task ID does not collide with canonical IDs', () => {
    const canonicalIds = new Set(IAM_TASKS.map(t => t.id));
    assert.equal(canonicalIds.has('path-iam-project-final-cleanup'), false);
  });

  test('13. Hard prerequisites reference valid canonical tasks', () => {
    const allTaskIds = new Set(getIamPathTasks().map(t => t.id));
    getIamPathTasks().forEach(task => {
      (task.prerequisites || []).forEach(preId => {
        assert.ok(allTaskIds.has(preId), `Task ${task.id} references non-existent prereq ${preId}`);
      });
    });
  });

  test('14. No required task depends on any optional task', () => {
    const optionalSet = new Set(IAM_OPTIONAL_TASK_IDS);
    getIamPathTasks().forEach(task => {
      if (!task.isOptional) {
        (task.prerequisites || []).forEach(preId => {
          assert.equal(optionalSet.has(preId), false, `Required task ${task.id} depends on optional task ${preId}`);
        });
      }
    });
  });

  test('15. Approved resource keys exist in resource bindings', () => {
    const resourceKeys = [
      'iamUserName', 'testBucketName', 'customPolicyArn', 'denyPolicyArn',
      'ec2RoleArn', 'instanceProfileArn', 'primaryInstanceId', 'boundaryPolicyArn',
      'inlinePolicyName', 'accessAnalyzerArn', 'mfaDeviceArn', 'externalIdRoleArn',
      'abacPolicyArn', 'samlProviderArn', 'samlRoleArn', 'accountPasswordPolicy',
      'accessKeyId', 'targetRoleArn', 'lambdaRoleArn', 'lambdaFunctionName', 'taggedInstanceId'
    ];
    assert.equal(resourceKeys.length, 21);
  });

  test('16. Protected resource keys are correct', () => {
    assert.deepEqual(IAM_PROTECTED_RESOURCE_KEYS, [
      'testBucketName', 'accessAnalyzerArn', 'samlProviderArn', 'principalOrgId', 'accountPasswordPolicy'
    ]);
  });

  test('17. IAM guest progress key is correct', () => {
    assert.equal(GUEST_IAM_PROGRESS_KEY, 'study_tracker_guest_iam_path_progress');
  });

  test('18. IAM guest resource key is correct', () => {
    assert.equal(GUEST_IAM_RESOURCES_KEY, 'study_tracker_guest_iam_path_resources');
  });

  test('19. No VPC guest state reuse in IAM keys', () => {
    assert.equal(GUEST_IAM_PROGRESS_KEY.includes('vpc'), false);
    assert.equal(GUEST_IAM_RESOURCES_KEY.includes('vpc'), false);
  });

  test('20. No EC2 guest state reuse in IAM keys', () => {
    assert.equal(GUEST_IAM_PROGRESS_KEY.includes('ec2'), false);
    assert.equal(GUEST_IAM_RESOURCES_KEY.includes('ec2'), false);
  });

  test('21. No S3 guest state reuse in IAM keys', () => {
    assert.equal(GUEST_IAM_PROGRESS_KEY.includes('s3'), false);
    assert.equal(GUEST_IAM_RESOURCES_KEY.includes('s3'), false);
  });

  test('22. No VPC programme ID reuse', () => {
    assert.notEqual(IAM_PATH_ID, 'vpc-learning-path');
  });

  test('23. No EC2 programme ID reuse', () => {
    assert.notEqual(IAM_PATH_ID, 'ec2-learning-path');
  });

  test('24. No S3 programme ID reuse', () => {
    assert.notEqual(IAM_PATH_ID, 's3-learning-path');
  });

  test('25. Optional branches do not block core required tasks', () => {
    const summary = getIamProgrammeProgressSummary([]);
    assert.equal(summary.status, 'Not Started');
    assert.equal(summary.total, 23);
  });

  test('26. Total Follow Along task count is 23 (22 canonical + 1 cleanup)', () => {
    const tasks = getIamPathTasks();
    assert.equal(tasks.length, 23);
  });

  test('27. Teardown wizard is final task', () => {
    const tasks = getIamPathTasks();
    const lastTask = tasks[tasks.length - 1];
    assert.equal(lastTask.id, 'path-iam-project-final-cleanup');
    assert.equal(lastTask.isPathOnly, true);
  });

  test('28. No automatic destructive cleanup API behaviour', () => {
    const cleanupTask = IAM_PATH_ONLY_TASKS[0];
    cleanupTask.cliSteps[0].commands.forEach(cmd => {
      assert.ok(cmd.text.startsWith('aws '), `Command ${cmd.text} must be manual CLI syntax`);
    });
  });

  test('29. Canonical task references remain authoritative', () => {
    const tasks = getIamPathTasks();
    const task1 = tasks.find(t => t.id === 'task-saa-iam-create-an-iam-user-with-no-permissions-and-test-listing-s3-001');
    assert.ok(task1.consoleSteps);
    assert.ok(task1.cliSteps);
  });

  test('30. Service persistence remains programme-scoped', () => {
    const validRecord = {
      resourceKey: 'iamUserName',
      resourceType: 'iam_user',
      lifecycleStatus: 'created'
    };
    assert.equal(validateIamResourceRecord(validRecord), true);

    const merged = mergeGuestIamStateWithRemote(
      { progress: { completed_task_ids: ['t1'], updated_at: '2026-08-07T10:00:00Z' } },
      { progress: { completed_task_ids: ['t2'], updated_at: '2026-08-07T09:00:00Z' } }
    );
    assert.deepEqual(merged.progress.completed_task_ids.sort(), ['t1', 't2']);
  });

});
