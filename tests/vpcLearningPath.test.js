import test from 'node:test';
import assert from 'node:assert/strict';

import {
  VPC_PATH_TASKS,
  VPC_LEARNING_PATH_PHASES,
  auditPathCatalogueIntegrity
} from '../src/data/vpcLearningPathData.js';

import {
  validateResourceRecord,
  interpolateResourceVariables,
  calculatePathMetrics,
  mergeGuestStateWithRemote
} from '../src/services/vpcLearningPathService.js';

test('VPC Learning Path - Catalogue Integrity & Sequence Audit', async (t) => {
  await t.test('1. Programme passes 34 canonical + 11 path-only audit with 0 missing and 0 duplicate tasks', () => {
    const audit = auditPathCatalogueIntegrity();
    assert.equal(audit.isIntegral, true, `Catalogue audit failed: ${JSON.stringify(audit)}`);
    assert.equal(audit.canonicalCount, 34, 'Must reference all 34 canonical VPC tasks');
    assert.equal(audit.pathOnlyCount, 11, 'Must have exactly 11 path-only tasks');
    assert.equal(audit.totalTasks, 45, 'Must contain exactly 45 total path tasks');
    assert.equal(audit.missingCanonicalCount, 0, 'Must have 0 missing canonical tasks');
    assert.equal(audit.requiredDependsOnOptionalCount, 0, 'No required task may depend on an optional task');
    assert.equal(audit.subnetCreationDuplication, false, 'Subnets must be created only once');
    assert.equal(audit.routeTableCreationDuplication, false, 'Route tables must be created only once');
  });

  await t.test('2. Phase 1 ordering matches strict networking foundation sequence', () => {
    const phase1 = VPC_LEARNING_PATH_PHASES.find(p => p.id === 'phase-1-vpc-foundation');
    const expectedOrder = [
      'task-saa-vpc-design-a-vpc-cidr-plan-001',
      'task-saa-vpc-create-a-2-az-vpc-002',
      'path-vpc-create-public-subnets',
      'path-vpc-create-private-subnets',
      'task-saa-vpc-attach-an-internet-gateway-003',
      'path-vpc-configure-public-route-table',
      'task-saa-vpc-create-security-groups-for-bastion-ssh-and-app-ports-007',
      'path-vpc-launch-public-bastion-instance',
      'path-vpc-launch-private-test-instance'
    ];

    assert.deepStrictEqual(phase1.taskIds, expectedOrder, 'Phase 1 task ordering must match foundation sequence');
  });

  await t.test('3. NAT Gateway exists before private NAT route table configuration', () => {
    const natGwIdx = VPC_PATH_TASKS.findIndex(t => t.id === 'task-saa-vpc-configure-a-nat-gateway-004');
    const privateRouteIdx = VPC_PATH_TASKS.findIndex(t => t.id === 'path-vpc-configure-private-route-table');

    assert.ok(natGwIdx >= 0, 'NAT Gateway task must exist');
    assert.ok(privateRouteIdx >= 0, 'Private route table task must exist');
    assert.ok(natGwIdx < privateRouteIdx, 'NAT Gateway creation must occur before private route table configuration');
  });

  await t.test('4. Public routing exists before bastion host launch', () => {
    const publicRouteIdx = VPC_PATH_TASKS.findIndex(t => t.id === 'path-vpc-configure-public-route-table');
    const bastionIdx = VPC_PATH_TASKS.findIndex(t => t.id === 'path-vpc-launch-public-bastion-instance');

    assert.ok(publicRouteIdx < bastionIdx, 'Public route table must exist before launching public bastion host');
  });

  await t.test('5. PrivateLink tasks do not block core single-account path', () => {
    const plTask1 = VPC_PATH_TASKS.find(t => t.id === 'task-saa-vpc-use-aws-privatelink-to-expose-a-service-privately-between-accounts-030');
    const plTask2 = VPC_PATH_TASKS.find(t => t.id === 'task-saa-vpc-configure-endpoint-services-and-consumer-endpoints-031');

    assert.equal(plTask1.isOptionalBranch, true, 'PrivateLink cross-account task must be optional');
    assert.equal(plTask2.isOptionalBranch, true, 'Endpoint services task must be optional');
  });

  await t.test('6. Required tasks do not depend on any optional branch tasks', () => {
    const optionalSet = new Set(VPC_PATH_TASKS.filter(t => t.isOptionalBranch).map(t => t.id));

    VPC_PATH_TASKS.forEach(task => {
      if (!task.isOptionalBranch) {
        (task.prerequisites || []).forEach(prereqId => {
          assert.equal(optionalSet.has(prereqId), false, `Required task ${task.id} must not depend on optional task ${prereqId}`);
        });
      }
    });
  });

  await t.test('7. Canonical route-table task is preserved as a review/validation wrapper', () => {
    const canonicalRtbTask = VPC_PATH_TASKS.find(t => t.id === 'task-saa-vpc-configure-route-tables-for-igw-and-nat-006');
    assert.ok(canonicalRtbTask, 'Canonical route table task must exist in catalogue');
    assert.equal(canonicalRtbTask.phaseId, 'phase-2-private-outbound-access', 'Must be positioned in Phase 2 after private route table creation');
    assert.ok(canonicalRtbTask.title.includes('Review') || canonicalRtbTask.title.includes('Configure'), 'Title must reflect path review wrapper');
  });

  await t.test('8. Subnets are created only once across the connected path', () => {
    const subnetTasks = VPC_PATH_TASKS.filter(t =>
      t.id === 'path-vpc-create-public-subnets' || t.id === 'path-vpc-create-private-subnets'
    );
    assert.equal(subnetTasks.length, 2, 'Subnets must be created only by dedicated public and private subnet tasks');

    const vpcTask = VPC_PATH_TASKS.find(t => t.id === 'task-saa-vpc-create-a-2-az-vpc-002');
    assert.deepStrictEqual(vpcTask.createdResourceKeys, ['vpcId'], 'VPC container task must create only vpcId');
  });

  await t.test('9. Elastic IP allocation is reserved for the NAT Gateway', () => {
    const eipTask = VPC_PATH_TASKS.find(t => t.id === 'task-saa-vpc-configure-elastic-ips-and-test-eni-association-022');
    assert.ok(eipTask, 'EIP allocation task must exist');
    assert.deepStrictEqual(eipTask.createdResourceKeys, ['natEipAllocationId'], 'EIP task must allocate natEipAllocationId');
  });

  await t.test('10. ENI task is positioned in Phase 3', () => {
    const eniTask = VPC_PATH_TASKS.find(t => t.id === 'task-saa-vpc-create-multiple-enis-and-bind-services-023');
    assert.ok(eniTask, 'ENI task must exist');
    assert.equal(eniTask.phaseId, 'phase-3-network-security-observability', 'ENI task must be in Phase 3');
  });
});

test('VPC Learning Path - Step Content Integrity & Render Audit', async (t) => {
  await t.test('1. All 45 VPC Path tasks are audited for non-empty visible instructions', () => {
    let emptyInstructionCount = 0;
    const emptyTaskInstructionIds = [];

    VPC_PATH_TASKS.forEach(task => {
      const consoleSteps = task.consoleSteps || [];
      consoleSteps.forEach(step => {
        const instructions = step.instructions || [];
        instructions.forEach(ins => {
          const mainText = ins.text || ins.label || '';
          const detailText = ins.detail || '';
          if (!mainText.trim() && !detailText.trim()) {
            emptyInstructionCount++;
            emptyTaskInstructionIds.push(`${task.id} -> ${ins.id}`);
          }
        });
      });
    });

    assert.equal(emptyInstructionCount, 0, `Found empty instructions: ${emptyTaskInstructionIds.join(', ')}`);
  });

  await t.test('2. Path-only tasks use canonical step schema', () => {
    const pathOnlyTasks = VPC_PATH_TASKS.filter(t => !t.isCanonical);
    assert.equal(pathOnlyTasks.length, 11, 'Must have exactly 11 path-only tasks');

    pathOnlyTasks.forEach(task => {
      (task.consoleSteps || []).forEach(step => {
        assert.ok(step.id && step.title, `Path-only task ${task.id} console step missing id/title`);
        (step.instructions || []).forEach(ins => {
          assert.ok(ins.id, `Path-only task ${task.id} instruction missing id`);
          const labelText = ins.text || ins.label || '';
          assert.ok(labelText.length > 0, `Path-only task ${task.id} instruction ${ins.id} missing label/text`);
        });
      });

      (task.cliSteps || []).forEach(step => {
        assert.ok(step.id && step.title, `Path-only task ${task.id} cli step missing id/title`);
        (step.commands || []).forEach(cmd => {
          assert.ok(cmd.id && cmd.text, `Path-only task ${task.id} command missing id/text`);
        });
      });
    });
  });
});

test('VPC Learning Path - Resource Record Schema Validation', async (t) => {
  await t.test('1. Valid resource record passes schema validation', () => {
    const valid = {
      resourceKey: 'mainVpc',
      resourceType: 'AWS::EC2::VPC',
      awsId: 'vpc-0123456789abcdef0',
      arn: 'arn:aws:ec2:eu-west-2:123456789012:vpc/vpc-0123456789abcdef0',
      name: 'saa-vpc-main',
      accountId: '123456789012',
      region: 'eu-west-2',
      parentResourceIds: [],
      createdByTaskId: 'task-saa-vpc-create-a-2-az-vpc-002',
      modifiedByTaskIds: [],
      lifecycleStatus: 'created',
      validationStatus: 'verified',
      metadata: { cidrBlock: '10.20.0.0/16' }
    };
    const res = validateResourceRecord(valid);
    assert.equal(res.valid, true);
  });

  await t.test('2. Draft resource record with awsId null passes schema validation', () => {
    const draft = {
      resourceKey: 'secondVpc',
      resourceType: 'AWS::EC2::VPC',
      awsId: null,
      lifecycleStatus: 'draft',
      validationStatus: 'draft'
    };
    const res = validateResourceRecord(draft);
    assert.equal(res.valid, true);
  });

  await t.test('3. Missing resourceKey or invalid lifecycleStatus fails schema validation', () => {
    const invalidKey = { resourceType: 'AWS::EC2::VPC', lifecycleStatus: 'created', validationStatus: 'verified' };
    assert.equal(validateResourceRecord(invalidKey).valid, false);

    const invalidStatus = { resourceKey: 'k1', resourceType: 'AWS::EC2::VPC', lifecycleStatus: 'invalid_status', validationStatus: 'verified' };
    assert.equal(validateResourceRecord(invalidStatus).valid, false);
  });
});

test('VPC Learning Path - CLI Template Variable Interpolation', async (t) => {
  await t.test('1. Replaces {{vpcId}}, {{publicSubnetAz1}}, and {{region}} correctly', () => {
    const template = 'aws ec2 create-subnet --vpc-id {{vpcId}} --subnet-id {{publicSubnetAz1}} --region {{region}}';
    const resources = {
      mainVpc: { awsId: 'vpc-01234' },
      publicSubnetAz1: { awsId: 'subnet-56789' }
    };

    const output = interpolateResourceVariables(template, resources, 'eu-west-2');
    assert.equal(output, 'aws ec2 create-subnet --vpc-id vpc-01234 --subnet-id subnet-56789 --region eu-west-2');
  });

  await t.test('2. Leaves un-bound variables intact if resource not yet created', () => {
    const template = 'aws ec2 create-nat-gateway --subnet-id {{publicSubnetAz1}} --allocation-id {{natEipAllocationId}}';
    const resources = {
      publicSubnetAz1: { awsId: 'subnet-111' }
    };

    const output = interpolateResourceVariables(template, resources, 'eu-west-2');
    assert.equal(output, 'aws ec2 create-nat-gateway --subnet-id subnet-111 --allocation-id {{natEipAllocationId}}');
  });
});

test('VPC Learning Path - Progress Metrics & Guest State Merge', async (t) => {
  await t.test('1. Calculates overall path percentage and phase completion metrics', () => {
    const completedIds = ['task-saa-vpc-design-a-vpc-cidr-plan-001', 'task-saa-vpc-create-a-2-az-vpc-002'];
    const metrics = calculatePathMetrics(completedIds);

    assert.ok(metrics.percentComplete > 0);
    assert.equal(metrics.completedCount, 2);
    assert.equal(metrics.phaseMetrics.length, 8);
  });

  await t.test('2. Merges guest state with remote state using latest timestamp and set union', () => {
    const guestState = {
      progress: {
        current_task_id: 'path-vpc-create-public-subnets',
        completed_task_ids: ['task-1', 'task-2'],
        updated_at: '2026-08-06T10:00:00Z',
        nat_branch_state: { activeBranch: 'nat-instance' }
      },
      resources: { res1: { awsId: 'id-1' } }
    };

    const remoteState = {
      progress: {
        current_task_id: 'task-1',
        completed_task_ids: ['task-2', 'task-3'],
        updated_at: '2026-08-05T10:00:00Z',
        nat_branch_state: { activeBranch: 'nat-gateway' }
      },
      resources: { res2: { awsId: 'id-2' } }
    };

    const merged = mergeGuestStateWithRemote(guestState, remoteState);

    // Guest has newer timestamp (Aug 6 vs Aug 5) -> current_task_id comes from guest
    assert.equal(merged.progress.current_task_id, 'path-vpc-create-public-subnets');
    // Set union of completed tasks: ['task-2', 'task-3', 'task-1']
    assert.ok(merged.progress.completed_task_ids.includes('task-1'));
    assert.ok(merged.progress.completed_task_ids.includes('task-2'));
    assert.ok(merged.progress.completed_task_ids.includes('task-3'));
    // NAT branch state comes from guest (newer timestamp)
    assert.equal(merged.progress.nat_branch_state.activeBranch, 'nat-instance');
  });
});
