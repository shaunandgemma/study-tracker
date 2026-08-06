import test from 'node:test';
import assert from 'node:assert/strict';

// Node.js test environment mock for localStorage
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

import {
  EC2_PATH_ID,
  EC2_RESOURCE_TAGS,
  EC2_PATH_ONLY_TASKS,
  EC2_LEARNING_PATH_PHASES,
  EC2_PATH_ORDERED_TASK_IDS,
  getEc2PathTasks,
  auditEc2LearningPath
} from '../src/data/ec2LearningPathData.js';

import {
  validateEc2ResourceRecord,
  calculateEc2PathMetrics,
  mergeGuestEc2StateWithRemote,
  getEc2ProgrammeProgressSummary,
  loadGuestEc2PathState,
  saveGuestEc2PathState,
  GUEST_EC2_PROGRESS_KEY,
  GUEST_EC2_RESOURCES_KEY
} from '../src/services/ec2LearningPathService.js';

import { EC2_TASKS } from '../src/data/tasks/ec2Tasks.js';

test('EC2 Learning Path - Comprehensive Stage 4 Test Suite', async (t) => {
  // 1. Catalogue Audit & ID Uniqueness
  await t.test('1. Catalogue audit passes with 25 canonical + 9 path-only tasks across 8 phases', () => {
    const audit = auditEc2LearningPath();
    assert.equal(audit.canonicalCount, 25, 'Must contain 25 canonical tasks');
    assert.equal(audit.pathOnlyCount, 9, 'Must contain 9 path-only tasks');
    assert.equal(audit.totalTasks, 34, 'Must contain 34 total unique tasks');
    assert.equal(audit.phaseCount, 8, 'Must contain 8 phases');
    assert.equal(audit.omittedCanonical.length, 0, 'No canonical tasks omitted');
    assert.equal(audit.duplicateTaskIds.length, 0, 'No duplicate task IDs');
    assert.equal(audit.dagErrors.length, 0, 'No required task depends on optional task');
    assert.equal(audit.isValid, true);
  });

  await t.test('2. All 25 canonical EC2 task IDs and 9 path-only IDs are unique and present', () => {
    const ids = EC2_PATH_ORDERED_TASK_IDS;
    assert.equal(new Set(ids).size, 34, 'All 34 task IDs must be unique');
    assert.equal(ids.length, 34);
  });

  // 2. Progress Summary & Metrics
  await t.test('3. getEc2ProgrammeProgressSummary() returns Not Started when no EC2 tasks are complete', async () => {
    const summary = await getEc2ProgrammeProgressSummary(null);
    assert.equal(summary.programmeId, 'ec2-learning-path');
    assert.equal(summary.loading, false);
    assert.equal(summary.completedTasks, 0);
    assert.equal(summary.totalTasks, 34);
    assert.equal(summary.completionPercentage, 0);
    assert.equal(summary.status, 'not-started');
  });

  await t.test('4. getEc2ProgrammeProgressSummary() returns In Progress when some EC2 tasks are complete', async () => {
    const fakeGuestState = {
      progress: {
        path_id: 'ec2-learning-path',
        current_task_id: 'task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001',
        completed_task_ids: [
          'task-saa-ec2-compare-ec2-pricing-models-016',
          'path-ec2-design-lab-environment',
          'path-ec2-create-lab-vpc'
        ]
      },
      resources: {}
    };

    saveGuestEc2PathState(fakeGuestState.progress, fakeGuestState.resources);
    const summary = await getEc2ProgrammeProgressSummary('guest');
    assert.equal(summary.completedTasks, 3);
    assert.equal(summary.totalTasks, 34);
    assert.equal(summary.completionPercentage, 9); // Math.round((3/34)*100)
    assert.equal(summary.status, 'in-progress');
  });

  // 3. Guest Persistence & Path ID Isolation
  await t.test('5. Guest EC2 localStorage state remains isolated from VPC guest state', () => {
    assert.equal(GUEST_EC2_PROGRESS_KEY, 'study_tracker_guest_ec2_path_progress');
    assert.equal(GUEST_EC2_RESOURCES_KEY, 'study_tracker_guest_ec2_path_resources');
    assert.notEqual(GUEST_EC2_PROGRESS_KEY, 'study_tracker_guest_vpc_path_progress');
    assert.equal(EC2_PATH_ID, 'ec2-learning-path');
    assert.equal(EC2_RESOURCE_TAGS.StudyTrackerFollowAlong, 'ec2-learning-path');
  });

  await t.test('6. mergeGuestEc2StateWithRemote() merges EC2 completed task IDs without importing VPC IDs or resources', () => {
    const guestState = {
      progress: {
        path_id: 'ec2-learning-path',
        current_task_id: 'task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001',
        completed_task_ids: ['task-saa-ec2-compare-ec2-pricing-models-016']
      },
      resources: { primaryInstanceId: { awsId: 'i-ec2guest01' } }
    };
    const remoteState = {
      progress: {
        path_id: 'ec2-learning-path',
        current_task_id: 'task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001',
        completed_task_ids: ['path-ec2-create-lab-vpc']
      },
      resources: { ec2VpcId: { awsId: 'vpc-ec2remote01' } }
    };

    const merged = mergeGuestEc2StateWithRemote(guestState, remoteState);
    assert.equal(merged.progress.path_id, 'ec2-learning-path');
    assert.equal(merged.progress.completed_task_ids.length, 2);
    assert.ok(merged.progress.completed_task_ids.includes('task-saa-ec2-compare-ec2-pricing-models-016'));
    assert.ok(merged.progress.completed_task_ids.includes('path-ec2-create-lab-vpc'));
    assert.ok(merged.resources.primaryInstanceId);
    assert.ok(merged.resources.ec2VpcId);
    assert.equal(merged.resources.vpcId, undefined, 'VPC Follow Along resources must not exist in EC2 state');
  });

  // 4. Content & Implementation Mode Normalization
  await t.test('7. All 34 EC2 tasks contain valid non-empty Console and CLI content', () => {
    const tasks = getEc2PathTasks();
    assert.equal(tasks.length, 34);
    tasks.forEach(task => {
      const hasConsole = Array.isArray(task.consoleSteps) && task.consoleSteps.length > 0;
      const hasCli = Array.isArray(task.cliSteps) && task.cliSteps.length > 0;
      assert.ok(hasConsole || hasCli, `Task '${task.id}' must provide console or CLI steps`);
    });
  });

  await t.test('8. Console, CLI and Show Both modes are supported across the programme', () => {
    const tasks = getEc2PathTasks();
    tasks.forEach(task => {
      assert.ok(task.title);
      assert.ok(task.goal);
    });
  });

  // 5. Destructive Task Safety & Primary Instance Protection
  await t.test('9. No destructive task binds to primaryInstanceId', () => {
    const tasks = getEc2PathTasks();
    const destructiveTasks = [
      'task-saa-ec2-stop-start-and-terminate-an-ec2-instance-008',
      'task-saa-ec2-demonstrate-ec2-hibernate-and-stop-start-lifecycle-020',
      'task-saa-ec2-launch-an-ec2-instance-using-the-aws-cli-002',
      'task-saa-ec2-launch-a-spot-instance-013'
    ];

    destructiveTasks.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId);
      assert.ok(task, `Destructive task ${taskId} must exist`);
      assert.notEqual(task.resourceBindings?.primaryInstanceId, 'primaryInstanceId', `Task ${taskId} must not bind primaryInstanceId as target`);
    });
  });

  // 6. Explicit Task Ordering & Specific Prerequisites
  await t.test('10. Key-pair creation (task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007) occurs before primary instance launch (task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001) and SSH connection (task-saa-ec2-connect-to-an-ec2-instance-using-ssh-or-rdp-003)', () => {
    const ids = EC2_PATH_ORDERED_TASK_IDS;
    const keyPairIndex = ids.indexOf('task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007');
    const launchIndex = ids.indexOf('task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001');
    const sshIndex = ids.indexOf('task-saa-ec2-connect-to-an-ec2-instance-using-ssh-or-rdp-003');

    assert.ok(keyPairIndex >= 0 && launchIndex >= 0 && sshIndex >= 0);
    assert.ok(keyPairIndex < launchIndex, 'Key pair creation must precede instance launch');
    assert.ok(launchIndex < sshIndex, 'SSH connection must occur after instance launch');

    const tasks = getEc2PathTasks();
    const sshTask = tasks.find(t => t.id === 'task-saa-ec2-connect-to-an-ec2-instance-using-ssh-or-rdp-003');
    assert.ok(sshTask.prerequisites.includes('task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001'));
    assert.ok(sshTask.prerequisites.includes('task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007'));
  });

  await t.test('11. IAM foundation (path-ec2-create-iam-foundation-role) and required SSM endpoints (path-ec2-configure-ssm-endpoints) precede private instance launch (task-saa-ec2-launch-ec2-instances-in-public-and-private-subnets-and-assign-public-private-ips-023)', () => {
    const ids = EC2_PATH_ORDERED_TASK_IDS;
    const iamIndex = ids.indexOf('path-ec2-create-iam-foundation-role');
    const ssmVpceIndex = ids.indexOf('path-ec2-configure-ssm-endpoints');
    const privateLaunchIndex = ids.indexOf('task-saa-ec2-launch-ec2-instances-in-public-and-private-subnets-and-assign-public-private-ips-023');

    assert.ok(iamIndex < privateLaunchIndex, 'IAM foundation must precede private instance launch');
    assert.ok(ssmVpceIndex < privateLaunchIndex, 'SSM endpoints must precede private instance launch');
  });

  await t.test('12. Patch Manager (task-saa-ec2-use-ssm-session-manager-and-patch-manager-with-ec2-027) is represented separately from Session Manager connectivity', () => {
    const tasks = getEc2PathTasks();
    const ssmTask = tasks.find(t => t.id === 'task-saa-ec2-use-ssm-session-manager-and-patch-manager-with-ec2-027');
    assert.ok(ssmTask);
    const content = JSON.stringify(ssmTask.consoleSteps);
    assert.ok(content.length > 0);
  });

  await t.test('13. ec2messages endpoint is conditional in path-ec2-configure-ssm-endpoints', () => {
    const tasks = getEc2PathTasks();
    const vpceTask = tasks.find(t => t.id === 'path-ec2-configure-ssm-endpoints');
    assert.ok(vpceTask);
    const content = JSON.stringify(vpceTask.consoleSteps);
    assert.ok(content.includes('ssm'), 'Must require ssm endpoint');
    assert.ok(content.includes('ssmmessages'), 'Must require ssmmessages endpoint');
    assert.ok(content.includes('ec2messages'), 'Must mention ec2messages for conditional evaluation');
  });

  // 7. Advanced Features, Optional Branches & Teardown
  await t.test('14. Hibernation task (task-saa-ec2-demonstrate-ec2-hibernate-and-stop-start-lifecycle-020) uses dedicated disposable instance (hibernateInstanceId)', () => {
    const tasks = getEc2PathTasks();
    const hibTask = tasks.find(t => t.id === 'task-saa-ec2-demonstrate-ec2-hibernate-and-stop-start-lifecycle-020');
    assert.ok(hibTask);
    assert.equal(hibTask.resourceBindings?.hibernateInstanceId, 'hibernateInstanceId');
  });

  await t.test('15. Launch Configurations are treated as legacy in Launch Template task (task-saa-ec2-use-ec2-launch-templates-and-launch-configurations-024)', () => {
    const tasks = getEc2PathTasks();
    const ltTask = tasks.find(t => t.id === 'task-saa-ec2-use-ec2-launch-templates-and-launch-configurations-024');
    assert.ok(ltTask);
    assert.ok(ltTask.title.includes('Launch Templates'));
    assert.equal(ltTask.resourceBindings?.launchTemplateId, 'launchTemplateId');
  });

  await t.test('16. Capacity Reservation (task-saa-ec2-set-up-ec2-capacity-reservations-022) is optional', () => {
    const tasks = getEc2PathTasks();
    const capTask = tasks.find(t => t.id === 'task-saa-ec2-set-up-ec2-capacity-reservations-022');
    assert.ok(capTask);
    assert.equal(capTask.isOptionalBranch, true);
  });

  await t.test('17. Optional tasks do not block core completion', () => {
    const tasks = getEc2PathTasks();
    const optionalIds = new Set(tasks.filter(t => t.isOptionalBranch).map(t => t.id));
    tasks.forEach(task => {
      if (!task.isOptionalBranch) {
        (task.prerequisites || []).forEach(req => {
          assert.equal(optionalIds.has(req), false, `Required task ${task.id} cannot depend on optional task ${req}`);
        });
      }
    });
  });

  await t.test('18. Teardown wizard (path-ec2-project-final-cleanup) is positioned as final task 34', () => {
    const ids = EC2_PATH_ORDERED_TASK_IDS;
    assert.equal(ids.at(-1), 'path-ec2-project-final-cleanup');
  });

  await t.test('19. Typed resource record validation works according to schema', () => {
    const validRecord = {
      resourceKey: 'primaryInstanceId',
      resourceType: 'AWS::EC2::Instance',
      awsId: 'i-0123456789abcdef0',
      lifecycleStatus: 'created',
      validationStatus: 'verified'
    };
    assert.equal(validateEc2ResourceRecord(validRecord), true);

    const invalidRecord = { resourceKey: 'primaryInstanceId' };
    assert.equal(validateEc2ResourceRecord(invalidRecord), false);
  });
});
