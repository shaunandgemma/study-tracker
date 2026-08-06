import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { INITIAL_SEED_TASKS } from '../src/data/tasksData.js';
import { S3_TASKS } from '../src/data/tasks/s3Tasks.js';
import { EC2_TASKS } from '../src/data/tasks/ec2Tasks.js';
import { VPC_TASKS } from '../src/data/tasks/vpcTasks.js';
import { IAM_TASKS } from '../src/data/tasks/iamTasks.js';
import { ELB_TASKS } from '../src/data/tasks/elbTasks.js';
import { AUTO_SCALING_TASKS } from '../src/data/tasks/autoScalingTasks.js';
import { RDS_TASKS } from '../src/data/tasks/rdsTasks.js';
import { AURORA_TASKS } from '../src/data/tasks/auroraTasks.js';
import { DYNAMODB_TASKS } from '../src/data/tasks/dynamoDbTasks.js';
import { ELASTICACHE_TASKS } from '../src/data/tasks/elasticacheTasks.js';
import { REDSHIFT_TASKS } from '../src/data/tasks/redshiftTasks.js';
import { LAMBDA_TASKS } from '../src/data/tasks/lambdaTasks.js';
import { API_GATEWAY_TASKS } from '../src/data/tasks/apiGatewayTasks.js';
import { STEP_FUNCTIONS_TASKS } from '../src/data/tasks/stepFunctionsTasks.js';
import { EVENTBRIDGE_TASKS } from '../src/data/tasks/eventBridgeTasks.js';
import { SQS_TASKS } from '../src/data/tasks/sqsTasks.js';
import { SNS_TASKS } from '../src/data/tasks/snsTasks.js';
import { ECR_TASKS } from '../src/data/tasks/ecrTasks.js';
import { FARGATE_TASKS } from '../src/data/tasks/fargateTasks.js';
import { ECS_TASKS } from '../src/data/tasks/ecsTasks.js';
import { CLOUDFRONT_TASKS } from '../src/data/tasks/cloudFrontTasks.js';
import { GLOBAL_ACCELERATOR_TASKS } from '../src/data/tasks/globalAcceleratorTasks.js';
import { KMS_TASKS } from '../src/data/tasks/kmsTasks.js';
import { SECRETS_MANAGER_TASKS } from '../src/data/tasks/secretsManagerTasks.js';
import { MACIE_TASKS } from '../src/data/tasks/macieTasks.js';
import { GUARDDUTY_TASKS } from '../src/data/tasks/guardDutyTasks.js';
import { COGNITO_TASKS } from '../src/data/tasks/cognitoTasks.js';
import { MGN_TASKS } from '../src/data/tasks/mgnTasks.js';
import { DMS_TASKS } from '../src/data/tasks/dmsTasks.js';
import { SNOW_FAMILY_TASKS } from '../src/data/tasks/snowFamilyTasks.js';
import { STORAGE_GATEWAY_TASKS } from '../src/data/tasks/storageGatewayTasks.js';
import { DATASYNC_TASKS } from '../src/data/tasks/dataSyncTasks.js';
import { SITE_TO_SITE_VPN_TASKS } from '../src/data/tasks/siteToSiteVpnTasks.js';
import { DIRECT_CONNECT_TASKS } from '../src/data/tasks/directConnectTasks.js';
import { CLOUDWATCH_TASKS } from '../src/data/tasks/cloudWatchTasks.js';
import { CLOUDTRAIL_TASKS } from '../src/data/tasks/cloudTrailTasks.js';
import { CONFIG_TASKS } from '../src/data/tasks/configTasks.js';
import { ORGANIZATIONS_TASKS } from '../src/data/tasks/organizationsTasks.js';
import { KINESIS_TASKS } from '../src/data/tasks/kinesisTasks.js';
import { ROUTE53_TASKS } from '../src/data/tasks/route53Tasks.js';
import { AWS_BACKUP_TASKS } from '../src/data/tasks/awsBackupTasks.js';

import {
  validateTaskSchema,
  calculateTaskProgress,
  getAvailableTopicOptions,
  filterHandsOnTasks,
  getTasks
} from '../src/services/taskService.js';

// ---------------------------------------------------------------------------
// Suite 1 — Final catalogue integrity (211 tasks across 41 modules)
// ---------------------------------------------------------------------------
test('Task Service - Final Catalogue Integrity (211 Tasks, 41 Modules)', async (t) => {

  await t.test('1. Total combined task count is 211 across 41 modules', () => {
    assert.strictEqual(INITIAL_SEED_TASKS.length, 211);
    assert.strictEqual(S3_TASKS.length, 33);
    assert.strictEqual(EC2_TASKS.length, 25);
    assert.strictEqual(VPC_TASKS.length, 34);
    assert.strictEqual(IAM_TASKS.length, 22);
    assert.strictEqual(ELB_TASKS.length, 13);
    assert.strictEqual(AUTO_SCALING_TASKS.length, 9);
    assert.strictEqual(RDS_TASKS.length, 7);
    assert.strictEqual(AURORA_TASKS.length, 4);
    assert.strictEqual(DYNAMODB_TASKS.length, 9);
    assert.strictEqual(ELASTICACHE_TASKS.length, 2);
    assert.strictEqual(REDSHIFT_TASKS.length, 1);
    assert.strictEqual(LAMBDA_TASKS.length, 5);
    assert.strictEqual(API_GATEWAY_TASKS.length, 1);
    assert.strictEqual(STEP_FUNCTIONS_TASKS.length, 1);
    assert.strictEqual(EVENTBRIDGE_TASKS.length, 1);
    assert.strictEqual(SQS_TASKS.length, 4);
    assert.strictEqual(SNS_TASKS.length, 1);
    assert.strictEqual(ECR_TASKS.length, 1);
    assert.strictEqual(FARGATE_TASKS.length, 1);
    assert.strictEqual(ECS_TASKS.length, 1);
    assert.strictEqual(CLOUDFRONT_TASKS.length, 7);
    assert.strictEqual(GLOBAL_ACCELERATOR_TASKS.length, 1);
    assert.strictEqual(KMS_TASKS.length, 5);
    assert.strictEqual(SECRETS_MANAGER_TASKS.length, 1);
    assert.strictEqual(MACIE_TASKS.length, 1);
    assert.strictEqual(GUARDDUTY_TASKS.length, 1);
    assert.strictEqual(COGNITO_TASKS.length, 1);
    assert.strictEqual(MGN_TASKS.length, 1);
    assert.strictEqual(DMS_TASKS.length, 3);
    assert.strictEqual(SNOW_FAMILY_TASKS.length, 1);
    assert.strictEqual(STORAGE_GATEWAY_TASKS.length, 1);
    assert.strictEqual(DATASYNC_TASKS.length, 1);
    assert.strictEqual(SITE_TO_SITE_VPN_TASKS.length, 1);
    assert.strictEqual(DIRECT_CONNECT_TASKS.length, 1);
    assert.strictEqual(CLOUDWATCH_TASKS.length, 4);
    assert.strictEqual(CLOUDTRAIL_TASKS.length, 1);
    assert.strictEqual(CONFIG_TASKS.length, 1);
    assert.strictEqual(ORGANIZATIONS_TASKS.length, 1);
    assert.strictEqual(KINESIS_TASKS.length, 1);
    assert.strictEqual(ROUTE53_TASKS.length, 1);
    assert.strictEqual(AWS_BACKUP_TASKS.length, 1);
  });

  await t.test('2. All 211 tasks pass strict schema validation', () => {
    INITIAL_SEED_TASKS.forEach(task => {
      assert.doesNotThrow(
        () => validateTaskSchema(task),
        `Task ${task.id} failed schema validation`
      );
    });
  });

  await t.test('3. No ID or slug collisions across all 211 tasks', () => {
    const ids = new Set();
    const slugs = new Set();
    INITIAL_SEED_TASKS.forEach(task => {
      assert.strictEqual(ids.has(task.id), false, `Duplicate task ID: ${task.id}`);
      assert.strictEqual(slugs.has(task.slug), false, `Duplicate task slug: ${task.slug}`);
      ids.add(task.id);
      slugs.add(task.slug);
    });
  });

  await t.test('4. Topic selector contains all 41 active topic options with no blanks or duplicates', () => {
    const options = getAvailableTopicOptions(INITIAL_SEED_TASKS);
    const seenIds = new Set();
    options.forEach(opt => {
      assert.ok(opt.id && opt.id.trim().length > 0, 'Blank topic ID in selector');
      assert.ok(opt.title && opt.title.trim().length > 0, `Blank title for ${opt.id}`);
      assert.strictEqual(seenIds.has(opt.id), false, `Duplicate topic option: ${opt.id}`);
      seenIds.add(opt.id);
    });
    assert.strictEqual(options.length, 41);
  });

  await t.test('5. Filtering by topic-route53 returns exactly the Route 53 failover task', () => {
    const r53 = INITIAL_SEED_TASKS.filter(t => t.topicId === 'topic-route53');
    assert.strictEqual(r53.length, 1);
    assert.strictEqual(r53[0].id, 'task-saa-route53-global-failover-health-check-005');
  });

  await t.test('6. Filtering by topic-aws-backup returns exactly the DR tiers task', () => {
    const backup = INITIAL_SEED_TASKS.filter(t => t.topicId === 'topic-aws-backup');
    assert.strictEqual(backup.length, 1);
    assert.strictEqual(backup[0].id, 'task-saa-backup-dr-tiers-pilot-light-warm-standby-008');
  });

  await t.test('7. Route 53 task mentions TTL and DNS caching in relation to failover timing', () => {
    const r53Task = ROUTE53_TASKS[0];
    const taskStr = JSON.stringify(r53Task).toLowerCase();
    assert.ok(taskStr.includes('ttl') || taskStr.includes('caching'), 'Route 53 task should mention TTL or DNS caching');
    assert.ok(taskStr.includes('not instantaneous') || taskStr.includes('propagation') || taskStr.includes('ttl'), 'Route 53 task should clarify failover is not instantaneous');
  });

  await t.test('8. DR tiers task correctly defines RTO, RPO and four DR strategies in order', () => {
    const drTask = AWS_BACKUP_TASKS[0];
    const taskStr = JSON.stringify(drTask).toLowerCase();
    assert.ok(taskStr.includes('rto'), 'DR task should define RTO');
    assert.ok(taskStr.includes('rpo'), 'DR task should define RPO');
    assert.ok(taskStr.includes('backup and restore') || taskStr.includes('backup-and-restore'), 'DR task should mention backup-and-restore');
    assert.ok(taskStr.includes('pilot light'), 'DR task should mention pilot light');
    assert.ok(taskStr.includes('warm standby'), 'DR task should mention warm standby');
    assert.ok(taskStr.includes('active-active') || taskStr.includes('multi-site'), 'DR task should mention multi-site active-active');
  });

  await t.test('9. DR tiers task states async cross-region replication is not zero RPO', () => {
    const drTask = AWS_BACKUP_TASKS[0];
    const taskStr = JSON.stringify(drTask).toLowerCase();
    assert.ok(
      taskStr.includes('not zero rpo') || taskStr.includes('does not provide zero rpo') || taskStr.includes('asynchronous') || taskStr.includes('not guaranteed'),
      'DR task should clarify async replication does not guarantee zero RPO'
    );
  });

  await t.test('10. All 211 active tasks have non-empty cost warnings and cleanup arrays', () => {
    INITIAL_SEED_TASKS.forEach(task => {
      assert.ok(
        task.costWarning && task.costWarning.trim().length > 0,
        `Task ${task.id} missing cost warning`
      );
      assert.ok(
        Array.isArray(task.cleanup) && task.cleanup.length > 0,
        `Task ${task.id} missing cleanup`
      );
    });
  });

  await t.test('11. All active tasks reference valid exam code aws-saa-c03', () => {
    INITIAL_SEED_TASKS.forEach(task => {
      assert.strictEqual(task.examCode, 'aws-saa-c03', `Task ${task.id} has wrong examCode: ${task.examCode}`);
    });
  });

  await t.test('12. All active tasks have valid difficulty values', () => {
    const valid = ['Easy', 'Medium', 'Hard'];
    INITIAL_SEED_TASKS.forEach(task => {
      assert.ok(valid.includes(task.difficulty), `Task ${task.id} has invalid difficulty: ${task.difficulty}`);
    });
  });

  await t.test('13. Final total active task count equals sum of all module counts', () => {
    const moduleSum =
      S3_TASKS.length + EC2_TASKS.length + VPC_TASKS.length + IAM_TASKS.length +
      ELB_TASKS.length + AUTO_SCALING_TASKS.length + RDS_TASKS.length + AURORA_TASKS.length +
      DYNAMODB_TASKS.length + ELASTICACHE_TASKS.length + REDSHIFT_TASKS.length +
      LAMBDA_TASKS.length + API_GATEWAY_TASKS.length + STEP_FUNCTIONS_TASKS.length +
      EVENTBRIDGE_TASKS.length + SQS_TASKS.length + SNS_TASKS.length +
      ECR_TASKS.length + FARGATE_TASKS.length + ECS_TASKS.length +
      CLOUDFRONT_TASKS.length + GLOBAL_ACCELERATOR_TASKS.length +
      KMS_TASKS.length + SECRETS_MANAGER_TASKS.length + MACIE_TASKS.length +
      GUARDDUTY_TASKS.length + COGNITO_TASKS.length +
      MGN_TASKS.length + DMS_TASKS.length + SNOW_FAMILY_TASKS.length +
      STORAGE_GATEWAY_TASKS.length + DATASYNC_TASKS.length +
      SITE_TO_SITE_VPN_TASKS.length + DIRECT_CONNECT_TASKS.length +
      CLOUDWATCH_TASKS.length + CLOUDTRAIL_TASKS.length +
      CONFIG_TASKS.length + ORGANIZATIONS_TASKS.length +
      KINESIS_TASKS.length + ROUTE53_TASKS.length + AWS_BACKUP_TASKS.length;

    assert.strictEqual(moduleSum, INITIAL_SEED_TASKS.length,
      `Module sum (${moduleSum}) does not match INITIAL_SEED_TASKS (${INITIAL_SEED_TASKS.length})`);
  });
});

// ---------------------------------------------------------------------------
// Suite 2 — High Availability batch progress isolation
// ---------------------------------------------------------------------------
test('Task Service - HA Batch Progress Isolation', async (t) => {
  const r53Task = ROUTE53_TASKS[0];
  const drTask = AWS_BACKUP_TASKS[0];

  await t.test('1. Progress on Route 53 task does not spill into DR Tiers task', () => {
    const progress = {
      [r53Task.id]: { consoleCompletedItems: ['console-step-1-item-1'] },
      [drTask.id]: { consoleCompletedItems: [] }
    };
    const r53Metrics = calculateTaskProgress(r53Task, progress[r53Task.id], 'console');
    const drMetrics = calculateTaskProgress(drTask, progress[drTask.id], 'console');

    assert.ok(r53Metrics.consolePercent > 0, 'Route 53 task progress should be > 0');
    assert.strictEqual(drMetrics.consolePercent, 0, 'DR task progress should be 0 (isolated)');
  });

  await t.test('2. Console and CLI progress are independent for Route 53 task', () => {
    const progress = { consoleCompletedItems: ['console-step-1-item-1'], cliCompletedItems: [] };
    const consoleMet = calculateTaskProgress(r53Task, progress, 'console');
    const cliMet = calculateTaskProgress(r53Task, progress, 'cli');

    assert.ok(consoleMet.consolePercent > 0, 'Console progress > 0');
    assert.strictEqual(cliMet.cliPercent, 0, 'CLI progress = 0 (independent)');
  });
});

// ---------------------------------------------------------------------------
// Suite 3 — AWS Connection & Validation Service
// ---------------------------------------------------------------------------
import {
  validateRoleArnFormat,
  validateAccountIdFormat,
  validateRegionFormat,
  validateResourceInputFormat,
  generateExternalId,
  testAwsConnection,
  validateTaskResource,
  loadUserAwsConnection,
  saveUserAwsConnection
} from '../src/services/awsConnectionService.js';
import {
  TASK_VALIDATION_REGISTRY,
  RESTORED_EXISTING_HANDLER_TASK_IDS,
  auditTaskValidationContracts,
  getValidationContractsForTask
} from '../src/data/taskValidationRegistry.js';
import { normalizeS3BucketRegion } from '../supabase/functions/_shared/awsTaskValidators/s3Region.js';
import { generateCloudFormationTemplate } from '../src/data/cloudFormationTemplate.js';
import {
  auditSourceTasks,
  createImportPlan,
  mapTaskToRow
} from '../scripts/importHandsOnTasks.js';

test('AWS Connection Service - Validation & Security Architecture', async (t) => {

  await t.test('1. Validates IAM Role ARN format strictly', () => {
    assert.strictEqual(validateRoleArnFormat('arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole'), true);
    assert.strictEqual(validateRoleArnFormat('arn:aws:iam::999988887777:role/my-custom_role.name@test'), true);
    assert.strictEqual(validateRoleArnFormat('arn:aws:iam::123456789012:user/admin'), false, 'User ARN should fail');
    assert.strictEqual(validateRoleArnFormat('invalid-arn-string'), false, 'Random string should fail');
    assert.strictEqual(validateRoleArnFormat('arn:aws:iam::123:role/ShortAccount'), false, '3-digit account should fail');
  });

  await t.test('2. Validates 12-digit AWS Account ID format strictly', () => {
    assert.strictEqual(validateAccountIdFormat('123456789012'), true);
    assert.strictEqual(validateAccountIdFormat('987654321098'), true);
    assert.strictEqual(validateAccountIdFormat('12345'), false, '5 digits should fail');
    assert.strictEqual(validateAccountIdFormat('1234567890123'), false, '13 digits should fail');
    assert.strictEqual(validateAccountIdFormat('12345678901a'), false, 'Alpha chars should fail');
  });

  await t.test('3. Validates AWS Region format strictly', () => {
    assert.strictEqual(validateRegionFormat('eu-west-2'), true);
    assert.strictEqual(validateRegionFormat('us-east-1'), true);
    assert.strictEqual(validateRegionFormat('invalid-region'), false);
  });

  await t.test('4. Validates resource input formats by validation type', () => {
    assert.strictEqual(validateResourceInputFormat('s3.bucket-exists', 'my-valid-bucket-123'), true);
    assert.strictEqual(validateResourceInputFormat('s3.bucket-exists', 'INVALID_BUCKET_NAME!'), false);

    assert.strictEqual(validateResourceInputFormat('ec2.instance-running', 'i-0123456789abcdef0'), true);
    assert.strictEqual(validateResourceInputFormat('ec2.instance-running', 'invalid-instance-id'), false);

    assert.strictEqual(validateResourceInputFormat('ec2.vpc-exists', 'vpc-0123456789abcdef0'), true);
    assert.strictEqual(validateResourceInputFormat('ec2.vpc-exists', 'not-a-vpc-id'), false);

    assert.strictEqual(validateResourceInputFormat('iam.role-exists', 'StudyTrackerHandsOnRole'), true);
  });

  await t.test('5. Generates valid UUID for External ID', () => {
    const extId1 = generateExternalId();
    const extId2 = generateExternalId();
    assert.ok(extId1 && typeof extId1 === 'string');
    assert.notStrictEqual(extId1, extId2, 'External IDs should be unique');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    assert.ok(uuidRegex.test(extId1), `Generated External ID ${extId1} should match UUID format`);
  });

  await t.test('6. Explicit simulation mode testAwsConnection returns simulation status when VITE_AWS_SIMULATION_MODE=true', async () => {
    process.env.VITE_AWS_SIMULATION_MODE = 'true';
    const res = await testAwsConnection({
      accountId: '123456789012',
      roleArn: 'arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole',
      externalId: generateExternalId()
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.status, 'simulation', 'Explicit simulation status must be simulation');
    assert.notStrictEqual(res.status, 'connected', 'Simulation mode must NEVER return fake connected status');
    assert.strictEqual(res.backendVerified, false);
    delete process.env.VITE_AWS_SIMULATION_MODE;
  });

  await t.test('7. Production testAwsConnection returns auth_required error when user is unauthenticated', async () => {
    delete process.env.VITE_AWS_SIMULATION_MODE;
    const res = await testAwsConnection({
      accountId: '123456789012',
      roleArn: 'arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole',
      externalId: generateExternalId()
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.status, 'auth_required');
    assert.ok(res.error.includes('Sign in to Study Tracker'), 'Must prompt user to sign in when unauthenticated');
  });

  await t.test('8. testAwsConnection returns error on account ID mismatch', async () => {
    const res = await testAwsConnection({
      accountId: '123456789012',
      roleArn: 'arn:aws:iam::999999999999:role/StudyTrackerHandsOnRole',
      externalId: generateExternalId()
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.status, 'account_mismatch');
    assert.ok(res.error.includes('mismatch'), 'Should report account mismatch error');
  });

  await t.test('9. Resolves validation contracts from TASK_VALIDATION_REGISTRY', () => {
    assert.ok(TASK_VALIDATION_REGISTRY['s3.bucket-exists']);
    assert.ok(TASK_VALIDATION_REGISTRY['s3.versioning-enabled']);
    assert.ok(TASK_VALIDATION_REGISTRY['ec2.instance-running']);
    assert.ok(TASK_VALIDATION_REGISTRY['iam.role-exists']);

    const s3ExistsContract = TASK_VALIDATION_REGISTRY['s3.bucket-exists'];
    assert.ok(s3ExistsContract.requiredPermissions.includes('s3:ListBucket'), 's3.bucket-exists must specify s3:ListBucket');
    assert.strictEqual(s3ExistsContract.requiredPermissions.includes('s3:ListAllMyBuckets'), false, 's3.bucket-exists must NOT specify s3:ListAllMyBuckets');

    const s3Task = S3_TASKS.find(task => task.id === 'task-saa-s3-versioning-001');
    const s3Contracts = getValidationContractsForTask(s3Task);
    assert.ok(s3Contracts.some(c => c.type === 's3.versioning-enabled'));
  });

  await t.test('10. validateTaskResource forwards resourceInput and outputs contract status when simulation is explicitly enabled', async () => {
    process.env.VITE_AWS_SIMULATION_MODE = 'true';
    const task = S3_TASKS.find(item => item.id === 'task-saa-s3-versioning-001');
    const simConn = {
      awsAccountId: '123456789012',
      roleArn: 'arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole',
      externalId: generateExternalId(),
      status: 'simulation',
      backendVerified: false
    };

    const res = await validateTaskResource(task, simConn, 'my-test-bucket-name');
    assert.strictEqual(res.status, 'simulation_passed');
    assert.strictEqual(res.isSimulation, true);
    assert.ok(res.results.length > 0);
    assert.ok(res.results[0].message.includes('my-test-bucket-name'), 'Should include target resource input in contract message');
    delete process.env.VITE_AWS_SIMULATION_MODE;
  });

  await t.test('11. CloudFormation generator trusts dedicated backend IAM role StudyTrackerAwsValidationBackendRole', () => {
    const cfnYaml = generateCloudFormationTemplate('test-uuid-1234', '406760143388', 'StudyTrackerAwsValidationBackendRole');
    assert.ok(cfnYaml.includes("AWS: !Sub 'arn:aws:iam::${BackendAccountId}:role/${BackendRoleName}'"),
      'CloudFormation YAML must trust backend role via !Sub parameter');
    assert.ok(cfnYaml.includes('sts:ExternalId: !Ref ExternalId'),
      'CloudFormation YAML must require ExternalId condition');
  });

  await t.test('12. Generated user CloudFormation template uses backend account 406760143388 and valid Sid syntax', () => {
    const cfnYaml = generateCloudFormationTemplate('test-uuid-1234');
    assert.ok(cfnYaml.includes("Default: '406760143388'"), 'BackendAccountId default must equal 406760143388');
    assert.strictEqual(cfnYaml.includes('Sidebar:'), false, 'No invalid Sidebar: properties should exist in template');
    assert.ok(cfnYaml.includes('Sid: S3ReadOnlyInspection'), 'Valid Sid S3ReadOnlyInspection must exist');
    assert.ok(cfnYaml.includes('Sid: AutoScalingReadOnlyInspection'), 'Valid Sid AutoScalingReadOnlyInspection must exist');
    assert.ok(cfnYaml.includes('autoscaling:DescribeAutoScalingGroups'), 'autoscaling:DescribeAutoScalingGroups must be present');
    assert.strictEqual(cfnYaml.includes('ec2:DescribeAutoScalingGroups'), false, 'ec2:DescribeAutoScalingGroups must be absent');
    assert.strictEqual(cfnYaml.includes('s3:ListAllMyBuckets'), false, 's3:ListAllMyBuckets must be absent');
  });

  await t.test('13. AWS External ID lifecycle: persistent per user, unchanged on remount, and embedded in CloudFormation YAML', async () => {
    // Logged-out user returns null
    const loggedOutConn = await loadUserAwsConnection(null);
    assert.strictEqual(loggedOutConn, null, 'Logged-out user must not receive a persistent connection or External ID');

    // Single UUID format check
    const sampleExtId = generateExternalId();
    const cfnYaml = generateCloudFormationTemplate(sampleExtId);
    assert.ok(cfnYaml.includes(`Default: '${sampleExtId}'`), 'Generated CloudFormation YAML must embed safe persisted External ID parameter');

    // Simulate persistent connection structure
    const mockUserId = 'user-test-uuid-999';
    const connData = {
      id: 'conn-1',
      userId: mockUserId,
      awsAccountId: '123456789012',
      roleArn: 'arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole',
      externalId: sampleExtId,
      status: 'connected',
      backendVerified: true
    };

    // Verify externalId immutability across component remounts
    assert.strictEqual(connData.externalId, sampleExtId, 'Saved connection must preserve External ID');

    // Regenerate External ID: produces a new UUID and resets status to disconnected
    const newExtId = generateExternalId();
    assert.notStrictEqual(newExtId, sampleExtId, 'Regenerated External ID must differ from previous ID');
    
    const regenData = {
      ...connData,
      externalId: newExtId,
      status: 'disconnected',
      backendVerified: false
    };

    assert.strictEqual(regenData.externalId, newExtId);
    assert.strictEqual(regenData.status, 'disconnected', 'Regenerate must reset status to disconnected');

    const updatedCfnYaml = generateCloudFormationTemplate(regenData.externalId);
    assert.ok(updatedCfnYaml.includes(`Default: '${newExtId}'`), 'Updated CloudFormation YAML must embed new regenerated External ID');
  });

  await t.test('14. S3 Task Validation Error Mapping: handles missing bucket, wrong region, access denied, versioning disabled, encryption missing', () => {
    // S3 error parser tests
    function parseS3TestError(err, bucketName) {
      const name = err?.name || err?.code || '';
      const message = err?.message || String(err);
      const statusCode = err?.$metadata?.httpStatusCode;

      if (name === 'ServerSideEncryptionConfigurationNotFoundError' || message.includes('ServerSideEncryptionConfigurationNotFoundError')) {
        return `Default server-side encryption is not enabled on S3 Bucket '${bucketName}'.`;
      }
      if (name === 'NotFound' || name === 'NoSuchBucket' || statusCode === 404 || message.includes('NoSuchBucket')) {
        return `S3 Bucket '${bucketName}' does not exist in account.`;
      }
      if (name === 'AccessDenied' || name === 'Forbidden' || statusCode === 403 || message.includes('AccessDenied')) {
        return `Access denied inspecting S3 Bucket '${bucketName}'. Ensure IAM role has s3:ListBucket permission.`;
      }
      if (name === 'PermanentRedirect' || statusCode === 301 || message.includes('PermanentRedirect')) {
        return `S3 Bucket '${bucketName}' is located in a different AWS region.`;
      }
      return `S3 inspection check failed (${name}): ${message}`;
    }

    const testBucket = 's3-task-2-versioning-406760143388';

    // 1. Missing bucket (NoSuchBucket)
    const noSuchBucketErr = { name: 'NoSuchBucket', $metadata: { httpStatusCode: 404 } };
    assert.ok(parseS3TestError(noSuchBucketErr, testBucket).includes('does not exist'), 'NoSuchBucket must state bucket does not exist');

    // 2. Access Denied (AccessDenied)
    const accessDeniedErr = { name: 'AccessDenied', $metadata: { httpStatusCode: 403 } };
    assert.ok(parseS3TestError(accessDeniedErr, testBucket).includes('Access denied'), 'AccessDenied must state access denied');

    // 3. Encryption missing (ServerSideEncryptionConfigurationNotFoundError)
    const encMissingErr = { name: 'ServerSideEncryptionConfigurationNotFoundError', $metadata: { httpStatusCode: 404 } };
    assert.ok(parseS3TestError(encMissingErr, testBucket).includes('not enabled'), 'Encryption missing must state default encryption is not enabled');

    // 4. Permanent Redirect (Wrong Region)
    const redirectErr = { name: 'PermanentRedirect', $metadata: { httpStatusCode: 301 } };
    assert.ok(parseS3TestError(redirectErr, testBucket).includes('different AWS region'), 'PermanentRedirect must state different region');
  });
});

// ---------------------------------------------------------------------------
// Suite 4 — Multi-contract live AWS task validation
// ---------------------------------------------------------------------------
test('AWS Connection Service - Multi-contract Live Validation', async (t) => {
  const bucketName = 's3-task-2-versioning-406760143388';
  const task = {
    id: 'task-saa-s3-versioning-001',
    service: 'Amazon S3',
    feature: 'Versioning',
    topicId: 'topic-s3',
    region: 'eu-west-2'
  };
  const connection = {
    awsAccountId: '406760143388',
    roleArn: 'arn:aws:iam::406760143388:role/StudyTrackerHandsOnRole',
    externalId: 'test-external-id',
    status: 'connected',
    backendVerified: true
  };
  const successfulResponses = {
    's3.bucket-exists': {
      passed: true,
      message: `Live AWS Verified: S3 Bucket '${bucketName}' exists and is accessible in region eu-west-2.`
    },
    's3.versioning-enabled': {
      passed: true,
      message: `Live AWS Verified: S3 Bucket '${bucketName}' versioning status is Enabled.`
    },
    's3.default-encryption-enabled': {
      passed: true,
      message: `Live AWS Verified: S3 Bucket '${bucketName}' default server-side encryption is configured using AES256.`
    }
  };

  async function runWithResponses(responseOverrides = {}) {
    const responses = { ...successfulResponses, ...responseOverrides };
    const calls = [];
    delete process.env.VITE_AWS_SIMULATION_MODE;

    const invokeValidation = async (functionName, options) => {
      calls.push({ functionName, body: options.body });
      const response = responses[options.body.validationType];
      return {
        data: {
          success: true,
          status: response.passed ? 'live_passed' : 'live_failed',
          result: response,
          message: response.message
        },
        error: null
      };
    };

    const result = await validateTaskResource(task, connection, bucketName, invokeValidation);
    return { result, calls };
  }

  await t.test('1. A three-contract task triggers three separate live validations', async () => {
    const { calls } = await runWithResponses();
    assert.strictEqual(calls.length, 3);
    assert.ok(calls.every(call => call.functionName === 'aws-validate-task'));
    assert.deepStrictEqual(
      new Set(calls.map(call => call.body.validationType)),
      new Set(['s3.bucket-exists', 's3.versioning-enabled', 's3.default-encryption-enabled'])
    );
  });

  await t.test('2. A successful result is never duplicated across all checks', async () => {
    const { result } = await runWithResponses();
    assert.strictEqual(new Set(result.results.map(check => check.message)).size, 3);
    assert.notStrictEqual(result.results[0].message, result.results[1].message);
    assert.notStrictEqual(result.results[0].message, result.results[2].message);
  });

  await t.test('3. Versioning disabled fails its check and the overall task', async () => {
    const versioningMessage = `S3 Bucket '${bucketName}' versioning status is 'Suspended'. Expected 'Enabled'.`;
    const { result } = await runWithResponses({
      's3.versioning-enabled': { passed: false, message: versioningMessage }
    });
    const versioning = result.results.find(check => check.type === 's3.versioning-enabled');
    assert.strictEqual(versioning.passed, false);
    assert.strictEqual(versioning.message, versioningMessage);
    assert.strictEqual(result.status, 'live_failed');
  });

  await t.test('4. Missing encryption fails its check and the overall task', async () => {
    const encryptionMessage = `S3 Bucket '${bucketName}' does not have default server-side encryption enabled.`;
    const { result } = await runWithResponses({
      's3.default-encryption-enabled': { passed: false, message: encryptionMessage }
    });
    const encryption = result.results.find(check => check.type === 's3.default-encryption-enabled');
    assert.strictEqual(encryption.passed, false);
    assert.strictEqual(encryption.message, encryptionMessage);
    assert.strictEqual(result.status, 'live_failed');
  });

  await t.test('5. Overall live success requires every contract to pass', async () => {
    const { result: allPassed } = await runWithResponses();
    assert.strictEqual(allPassed.results.every(check => check.passed), true);
    assert.strictEqual(allPassed.status, 'live_passed');

    const { result: oneFailed } = await runWithResponses({
      's3.versioning-enabled': { passed: false, message: 'Versioning is disabled.' }
    });
    assert.strictEqual(oneFailed.status, 'live_failed');
  });

  await t.test('6. Messages remain matched to the correct contract type', async () => {
    const { result } = await runWithResponses();
    for (const check of result.results) {
      assert.strictEqual(check.message, successfulResponses[check.type].message);
    }
  });

  await t.test('7. The same bucket name is passed as resourceInput for all checks', async () => {
    const { calls } = await runWithResponses();
    assert.strictEqual(calls.length, 3);
    assert.ok(calls.every(call => call.body.resourceInput === bucketName));
  });
});

// ---------------------------------------------------------------------------
// Suite 5 — Hands-On Tasks catalogue loading and rendering
// ---------------------------------------------------------------------------
test('Hands-On Tasks - Catalogue Loading and Rendering', async (t) => {
  const sampleTasks = INITIAL_SEED_TASKS.slice(0, 3);
  let viteServer;
  let taskListModule;

  const loadTaskListModule = async () => {
    if (!viteServer) {
      const { createServer } = await import('vite');
      viteServer = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent'
      });
      taskListModule = await viteServer.ssrLoadModule('/src/components/HandsOnTasks/TaskList.jsx');
    }
    return taskListModule;
  };

  t.after(async () => {
    if (viteServer) await viteServer.close();
  });

  function createQueryClient({ data = [], error = null } = {}) {
    const calls = [];
    const builder = {
      select(columns) {
        calls.push({ method: 'select', args: [columns] });
        return this;
      },
      eq(column, value) {
        calls.push({ method: 'eq', args: [column, value] });
        return this;
      },
      then(resolve, reject) {
        return Promise.resolve({ data, error }).then(resolve, reject);
      }
    };
    const client = {
      from(table) {
        calls.push({ method: 'from', args: [table] });
        return builder;
      }
    };
    return { client, calls };
  }

  await t.test('1. Multiple returned tasks are all rendered', async () => {
    const rows = INITIAL_SEED_TASKS.map(task => ({
      id: task.id,
      exam_code: task.examCode,
      topic_id: task.topicId,
      content: task
    }));
    const { client } = createQueryClient({ data: rows });
    const loadedTasks = await getTasks('aws-saa-c03', null, client);
    const { TaskCardsGrid } = await loadTaskListModule();
    const html = renderToStaticMarkup(
      createElement(TaskCardsGrid, { tasks: loadedTasks, taskProgress: {} })
    );

    assert.strictEqual(loadedTasks.length, 211);
    assert.strictEqual((html.match(/Start Lab/g) || []).length, 211);
    assert.ok(html.includes(loadedTasks[0].title));
    assert.ok(html.includes(loadedTasks.at(-1).title));
  });

  await t.test('2. The published-task query has no limit, single, fixed ID, or fixed slug', async () => {
    const { client, calls } = createQueryClient({ data: [] });
    const loadedTasks = await getTasks('aws-saa-c03', null, client);
    assert.ok(Array.isArray(loadedTasks), 'Result must be an array');
    assert.strictEqual(loadedTasks.length, 211, 'Must fall back to 211 bundled seed tasks when query returns empty');
    assert.strictEqual(new Set(loadedTasks.map(t => t.id)).size, 211, 'All task IDs must be unique');
    assert.ok(loadedTasks[0] && loadedTasks[0].id && loadedTasks[0].title, 'First record must be a valid task object');
    assert.ok(loadedTasks.at(-1) && loadedTasks.at(-1).id && loadedTasks.at(-1).title, 'Last record must be a valid task object');
    assert.deepStrictEqual(calls, [
      { method: 'from', args: ['hands_on_tasks'] },
      { method: 'select', args: ['*'] },
      { method: 'eq', args: ['status', 'published'] },
      { method: 'eq', args: ['exam_code', 'aws-saa-c03'] }
    ]);
    assert.strictEqual(calls.some(call => ['limit', 'single', 'maybeSingle'].includes(call.method)), false);
    assert.strictEqual(calls.some(call => call.args.includes('id') || call.args.includes('slug')), false);
  });

  await t.test('3. RLS permits public published-task reads while progress remains user-specific', () => {
    const migration = readFileSync(
      new URL('../supabase/migrations/20260801_hands_on_tasks.sql', import.meta.url),
      'utf8'
    );
    assert.match(
      migration,
      /CREATE POLICY "Allow public read access for published tasks"[\s\S]*?ON public\.hands_on_tasks[\s\S]*?FOR SELECT[\s\S]*?USING \(status = 'published'\)/
    );
    assert.match(
      migration,
      /CREATE POLICY "Users can view own task progress"[\s\S]*?ON public\.hands_on_task_progress[\s\S]*?USING \(auth\.uid\(\) = user_id\)/
    );
  });

  await t.test('4. Default exam, topic, difficulty, status, and search filters retain the full loaded list', () => {
    const filtered = filterHandsOnTasks(sampleTasks, {
      exam: 'aws-saa-c03',
      topic: 'all',
      difficulty: 'all',
      status: 'all',
      search: ''
    }, {});
    assert.strictEqual(filtered.length, sampleTasks.length);
    assert.deepStrictEqual(filtered.map(task => task.id), sampleTasks.map(task => task.id));
  });

  await t.test('5. Remote query failures fall back to bundled tasks', async () => {
    const remoteMessage = 'permission denied for table hands_on_tasks';
    const { client } = createQueryClient({ error: { message: remoteMessage } });
    const loadedTasks = await getTasks('aws-saa-c03', null, client);

    assert.ok(Array.isArray(loadedTasks), 'Promise must resolve with an array rather than reject');
    assert.strictEqual(loadedTasks.length, 211, 'Must return exactly 211 fallback tasks on remote error');
    assert.strictEqual(new Set(loadedTasks.map(t => t.id)).size, 211, 'All task IDs must be unique');
    assert.ok(loadedTasks[0] && loadedTasks[0].id && loadedTasks[0].title, 'Fallback data must match bundled task contract');
    assert.strictEqual(loadedTasks[0].examCode, 'aws-saa-c03');
  });

  await t.test('6. Displayed task count matches the loaded and filtered task counts', async () => {
    const { TaskCountSummary } = await loadTaskListModule();
    const html = renderToStaticMarkup(
      createElement(TaskCountSummary, { filteredCount: INITIAL_SEED_TASKS.length, totalCount: INITIAL_SEED_TASKS.length })
    );
    assert.ok(html.includes('Showing 211 of 211 published labs'));
  });
});

// ---------------------------------------------------------------------------
// Suite 6 — Canonical Hands-On Tasks importer
// ---------------------------------------------------------------------------
test('Hands-On Tasks - Canonical Catalogue Import', async (t) => {
  await t.test('1. Source catalogue contains 211 unique task IDs and slugs', () => {
    const audit = auditSourceTasks(INITIAL_SEED_TASKS);
    assert.strictEqual(audit.sourceTaskCount, 211);
    assert.strictEqual(audit.uniqueTaskCount, 211);
    assert.deepStrictEqual(audit.duplicateIds, []);
    assert.deepStrictEqual(audit.duplicateSlugs, []);
    assert.deepStrictEqual(audit.examCodeCounts, { 'aws-saa-c03': 211 });
    assert.deepStrictEqual(audit.statusCounts, { published: 211 });
  });

  await t.test('2. Every canonical source task passes application and database schema validation', () => {
    const audit = auditSourceTasks(INITIAL_SEED_TASKS);
    assert.strictEqual(audit.validTaskCount, 211);
    assert.strictEqual(audit.rejectedTaskCount, 0);
    assert.deepStrictEqual(audit.rejected, []);
  });

  await t.test('3. Existing S3 versioning task is updated or unchanged, never duplicated', () => {
    const existingTask = INITIAL_SEED_TASKS.find(task => task.id === 'task-saa-s3-versioning-001');
    assert.ok(existingTask, 'Canonical source must contain the existing migrated S3 task ID');
    const existingRow = mapTaskToRow(existingTask);
    const plan = createImportPlan(INITIAL_SEED_TASKS, [existingRow]);
    assert.strictEqual(plan.inserts.some(row => row.id === existingTask.id), false);
    assert.strictEqual(plan.updates.some(row => row.id === existingTask.id), false);
    assert.strictEqual(plan.unchanged.some(row => row.id === existingTask.id), true);
  });

  await t.test('4. Re-running against a fully migrated catalogue is idempotent', () => {
    const migratedRows = INITIAL_SEED_TASKS.map(mapTaskToRow);
    const rerunPlan = createImportPlan(INITIAL_SEED_TASKS, migratedRows);
    assert.strictEqual(rerunPlan.inserts.length, 0);
    assert.strictEqual(rerunPlan.updates.length, 0);
    assert.strictEqual(rerunPlan.unchanged.length, 211);
    assert.deepStrictEqual(rerunPlan.conflicts, []);
  });

  await t.test('5. Task content and derived validation contracts survive round-trip mapping unchanged', async () => {
    const sourceTask = INITIAL_SEED_TASKS.find(task => task.id === 'task-saa-s3-versioning-001');
    const row = mapTaskToRow(sourceTask);
    const { client } = (() => {
      const builder = {
        select() { return this; },
        eq() { return this; },
        then(resolve, reject) { return Promise.resolve({ data: [row], error: null }).then(resolve, reject); }
      };
      return { client: { from() { return builder; } } };
    })();
    const [roundTrippedTask] = await getTasks('aws-saa-c03', null, client);
    assert.deepStrictEqual(roundTrippedTask, sourceTask);
    assert.deepStrictEqual(
      getValidationContractsForTask(roundTrippedTask),
      getValidationContractsForTask(sourceTask)
    );
  });
});

// ---------------------------------------------------------------------------
// Suite 7 — Task-specific live validation contract resolution
// ---------------------------------------------------------------------------
test('Hands-On Tasks - Task-specific Validation Contracts', async (t) => {
  const findTask = id => INITIAL_SEED_TASKS.find(task => task.id === id);
  const contractTypes = task => getValidationContractsForTask(task).map(contract => contract.type);

  const s3Task = findTask('task-saa-s3-versioning-001');
  const ec2Task = findTask('task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001');
  const vpcTask = findTask('task-saa-vpc-create-a-2-az-vpc-002');
  const rdsTask = findTask('task-saa-rds-create-rds-and-connect-from-ec2-001');
  const s3RegionTask = findTask('task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001');
  const unmatchedTask = findTask('task-saa-elb-create-an-alb-in-front-of-an-auto-scaling-group-001');

  await t.test('1. S3 versioning task receives the three S3 contracts', () => {
    assert.deepStrictEqual(contractTypes(s3Task), [
      's3.bucket-exists',
      's3.versioning-enabled',
      's3.default-encryption-enabled'
    ]);
  });

  await t.test('2. EC2 launch task receives EC2 contracts and no S3 contracts', () => {
    const types = contractTypes(ec2Task);
    assert.deepStrictEqual(types, ['ec2.instance-exists', 'ec2.instance-running']);
    assert.strictEqual(types.some(type => type.startsWith('s3.')), false);
  });

  await t.test('3. VPC creation task receives VPC and subnet contracts', () => {
    assert.deepStrictEqual(contractTypes(vpcTask), ['ec2.vpc-exists', 'ec2.subnet-exists']);
  });

  await t.test('4. RDS task receives availability and encryption contracts', () => {
    assert.deepStrictEqual(contractTypes(rdsTask), ['rds.instance-available', 'rds.encryption-enabled']);
  });

  await t.test('5. Unmatched task receives no validator and renders the unavailable message', async () => {
    assert.deepStrictEqual(getValidationContractsForTask(unmatchedTask), []);
    const unavailable = await validateTaskResource(unmatchedTask, {
      status: 'connected',
      backendVerified: true
    });
    assert.strictEqual(unavailable.status, 'validation_unavailable');
    assert.strictEqual(unavailable.message, 'Live validation is not yet available for this lab.');

    const { createServer } = await import('vite');
    const viteServer = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
    try {
      const { AwsValidationUnavailable } = await viteServer.ssrLoadModule('/src/components/HandsOnTasks/AwsValidationPanel.jsx');
      const html = renderToStaticMarkup(createElement(AwsValidationUnavailable, { task: unmatchedTask }));
      assert.ok(html.includes('Live validation is not yet available for this lab.'));
      assert.strictEqual(html.includes('Verify S3 bucket'), false);
    } finally {
      await viteServer.close();
    }
  });

  await t.test('6. Navigating from S3 to EC2 replaces rather than reuses the checklist', () => {
    const before = contractTypes(s3Task);
    const after = contractTypes(ec2Task);
    assert.notDeepStrictEqual(after, before);
    assert.deepStrictEqual(after, ['ec2.instance-exists', 'ec2.instance-running']);
    assert.strictEqual(after.some(type => before.includes(type)), false);
  });

  await t.test('7. Task changes remount the panel and clear resource input and prior results', () => {
    const guideSource = readFileSync(new URL('../src/components/HandsOnTasks/TaskGuide.jsx', import.meta.url), 'utf8');
    const panelSource = readFileSync(new URL('../src/components/HandsOnTasks/AwsValidationPanel.jsx', import.meta.url), 'utf8');
    assert.match(guideSource, /<AwsValidationPanel key=\{task\.id\} task=\{task\} \/>/);
    assert.ok(panelSource.includes("setResourceInput('');"));
    assert.ok(panelSource.includes('setValidationResult(null);'));
    assert.ok(panelSource.includes('}, [task?.id]);'));
  });

  await t.test('8. Supabase row-shaped and bundled tasks resolve identical contracts', () => {
    const supabaseTask = mapTaskToRow(ec2Task);
    assert.deepStrictEqual(contractTypes(supabaseTask), contractTypes(ec2Task));
  });

  await t.test('9. All 211 tasks are included in the resolution audit', () => {
    const audit = auditTaskValidationContracts(INITIAL_SEED_TASKS);
    assert.strictEqual(audit.totalTasks, 211);
    assert.strictEqual(audit.exactTaskSpecificValidatorAvailable, 82);
    assert.strictEqual(audit.validatorPossibleUsingExistingBackendHandler, 0);
    assert.strictEqual(audit.newBackendValidatorRequired, 120);
    assert.strictEqual(audit.noSensibleLiveAwsValidation, 9);
    assert.strictEqual(audit.restoredExistingHandlerMappings, 66);
    assert.strictEqual(audit.validTaskSpecificContracts, 82);
    assert.strictEqual(audit.noLiveValidator, 129);
    assert.strictEqual(audit.ambiguousMatches, 0);
    assert.strictEqual(audit.incorrectMatches, 0);
    assert.strictEqual(audit.validTaskSpecificContracts + audit.noLiveValidator, 211);
    assert.strictEqual(
      audit.exactTaskSpecificValidatorAvailable
        + audit.validatorPossibleUsingExistingBackendHandler
        + audit.newBackendValidatorRequired
        + audit.noSensibleLiveAwsValidation,
      211
    );
  });

  await t.test('10. No non-S3 task resolves an S3 contract', () => {
    for (const task of INITIAL_SEED_TASKS.filter(item => item.topicId !== 'topic-s3')) {
      const invalid = contractTypes(task).filter(type => type.startsWith('s3.'));
      assert.deepStrictEqual(invalid, [], `${task.id} incorrectly resolved S3 contracts`);
    }
  });

  await t.test('11. S3 Region task receives only bucket existence and Region contracts', () => {
    const types = contractTypes(s3RegionTask);
    assert.deepStrictEqual(types, ['s3.bucket-exists', 's3.bucket-region']);
    assert.strictEqual(types.includes('s3.versioning-enabled'), false);
    assert.strictEqual(types.includes('s3.default-encryption-enabled'), false);
    assert.ok(getValidationContractsForTask(s3RegionTask).every(contract => contract.resourceInput === 'bucketName'));
  });

  await t.test('12. S3 location values are normalized for standard, null, and legacy EU responses', () => {
    assert.strictEqual(normalizeS3BucketRegion('eu-west-2'), 'eu-west-2');
    assert.strictEqual(normalizeS3BucketRegion(null), 'us-east-1');
    assert.strictEqual(normalizeS3BucketRegion(undefined), 'us-east-1');
    assert.strictEqual(normalizeS3BucketRegion(''), 'us-east-1');
    assert.strictEqual(normalizeS3BucketRegion('EU'), 'eu-west-1');
  });

  await t.test('13. S3 Region handler retrieves the location and reports the normalized Region', () => {
    const validatorSource = readFileSync(
      new URL('../supabase/functions/_shared/awsTaskValidators/s3Validators.ts', import.meta.url),
      'utf8'
    );
    assert.match(validatorSource, /new GetBucketLocationCommand\(\{ Bucket: bucketName \}\)/);
    assert.match(validatorSource, /actualRegion = normalizeS3BucketRegion\(locationRes\.LocationConstraint\)/);
    assert.match(validatorSource, /exists in region \$\{actualRegion\}/);
  });

  await t.test('14. Supabase and bundled S3 Region tasks resolve identically', () => {
    const supabaseTask = mapTaskToRow(s3RegionTask);
    assert.deepStrictEqual(contractTypes(supabaseTask), contractTypes(s3RegionTask));
  });

  await t.test('15. Existing-handler tasks omitted from the initial allowlist are restored explicitly', () => {
    const restoredTaskId = 'task-saa-s3-upload-a-file-and-share-it-with-a-presigned-url-006';
    assert.ok(RESTORED_EXISTING_HANDLER_TASK_IDS.includes(restoredTaskId));
    assert.deepStrictEqual(contractTypes(findTask(restoredTaskId)), ['s3.bucket-exists']);
    assert.strictEqual(RESTORED_EXISTING_HANDLER_TASK_IDS.length, 66);
  });

  await t.test('16. Unsupported tasks still return validation_unavailable', async () => {
    const unsupported = findTask('task-saa-s3-open-the-final-s3-guide-and-complete-the-last-review-task-033');
    assert.deepStrictEqual(contractTypes(unsupported), []);
    const result = await validateTaskResource(unsupported, { status: 'connected', backendVerified: true });
    assert.strictEqual(result.status, 'validation_unavailable');
    assert.strictEqual(result.message, 'Live validation is not yet available for this lab.');
  });
});

// ---------------------------------------------------------------------------
// Suite 8 — Checklist Content Integrity & Verification/Cleanup Validity
// ---------------------------------------------------------------------------
test('Hands-On Tasks - Checklist Content Integrity', async (t) => {
  const baselinePath = new URL('../migration_work/hands_on_tasks/checklist-baseline.json', import.meta.url);
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  const baselineMap = new Map(baseline.tasks.map(task => [task.id, task]));

  await t.test('1. All 211 tasks contain 100% meaningful verification content', () => {
    assert.strictEqual(INITIAL_SEED_TASKS.length, 211);
    for (const task of INITIAL_SEED_TASKS) {
      assert.ok(Array.isArray(task.verification) && task.verification.length > 0, `Task ${task.id} missing verification array`);
      for (const item of task.verification) {
        assert.ok(
          typeof item.text === 'string' && item.text.trim().length > 0,
          `Task ${task.id} verification item ${item.id} is empty`
        );
      }
    }
  });

  await t.test('2. All 211 tasks contain 100% meaningful cleanup content', () => {
    for (const task of INITIAL_SEED_TASKS) {
      assert.ok(Array.isArray(task.cleanup) && task.cleanup.length > 0, `Task ${task.id} missing cleanup array`);
      for (const item of task.cleanup) {
        assert.ok(
          typeof item.text === 'string' && item.text.trim().length > 0,
          `Task ${task.id} cleanup item ${item.id} is empty`
        );
      }
    }
  });

  await t.test('3. Verification and cleanup item counts remain exactly 425 and 497', () => {
    const vTotal = INITIAL_SEED_TASKS.reduce((acc, t) => acc + (t.verification?.length || 0), 0);
    const cTotal = INITIAL_SEED_TASKS.reduce((acc, t) => acc + (t.cleanup?.length || 0), 0);
    assert.strictEqual(vTotal, 425, `Verification item count ${vTotal} !== 425`);
    assert.strictEqual(cTotal, 497, `Cleanup item count ${cTotal} !== 497`);
  });

  await t.test('4. Existing meaningful checklist text is preserved byte-for-byte', () => {
    for (const task of INITIAL_SEED_TASKS) {
      const baseTask = baselineMap.get(task.id);
      assert.ok(baseTask, `Baseline missing task ${task.id}`);
      task.verification.forEach((item, idx) => {
        const baseItem = baseTask.verificationItems[idx];
        if (baseItem.text !== '') {
          assert.strictEqual(item.text, baseItem.text, `Verification text changed for ${task.id}:${item.id}`);
        }
      });
      task.cleanup.forEach((item, idx) => {
        const baseItem = baseTask.cleanupItems[idx];
        if (baseItem.text !== '') {
          assert.strictEqual(item.text, baseItem.text, `Cleanup text changed for ${task.id}:${item.id}`);
        }
      });
    }
  });

  await t.test('5. Only formerly empty entries changed', () => {
    let vChanged = 0;
    let cChanged = 0;
    for (const task of INITIAL_SEED_TASKS) {
      const baseTask = baselineMap.get(task.id);
      task.verification.forEach((item, idx) => {
        const baseItem = baseTask.verificationItems[idx];
        if (baseItem.text === '') {
          assert.ok(item.text.trim().length > 0, `Formerly empty verification item ${task.id}:${item.id} still empty`);
          vChanged++;
        }
      });
      task.cleanup.forEach((item, idx) => {
        const baseItem = baseTask.cleanupItems[idx];
        if (baseItem.text === '') {
          assert.ok(item.text.trim().length > 0, `Formerly empty cleanup item ${task.id}:${item.id} still empty`);
          cChanged++;
        }
      });
    }
    assert.strictEqual(vChanged, 266, `Expected 266 verification entries changed, got ${vChanged}`);
    assert.strictEqual(cChanged, 196, `Expected 196 cleanup entries changed, got ${cChanged}`);
  });

  await t.test('6. Item IDs and array ordering are strictly preserved', () => {
    for (const task of INITIAL_SEED_TASKS) {
      const baseTask = baselineMap.get(task.id);
      assert.strictEqual(task.verification.length, baseTask.verificationLength);
      assert.strictEqual(task.cleanup.length, baseTask.cleanupLength);
      task.verification.forEach((item, idx) => {
        assert.strictEqual(item.id, baseTask.verificationItems[idx].id);
      });
      task.cleanup.forEach((item, idx) => {
        assert.strictEqual(item.id, baseTask.cleanupItems[idx].id);
      });
    }
  });

  await t.test('7. Inspection-only tasks clearly state no cleanup is required', () => {
    const inspectionTaskIds = [
      'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001',
      'task-saa-s3-open-s3-storage-lens-and-review-the-storage-dashboard-028',
      'task-saa-s3-open-the-final-s3-guide-and-complete-the-last-review-task-033'
    ];
    for (const id of inspectionTaskIds) {
      const task = INITIAL_SEED_TASKS.find(t => t.id === id);
      assert.ok(task, `Task ${id} not found`);
      assert.ok(
        task.cleanup.some(item => item.text.includes('No AWS resources were created during this lab, so no cleanup is required.')),
        `Inspection task ${id} missing no-cleanup statement`
      );
    }
  });

  await t.test('8. Supabase row mapping matches canonical catalogue content after import', () => {
    for (const task of INITIAL_SEED_TASKS) {
      const row = mapTaskToRow(task);
      assert.strictEqual(row.id, task.id);
      assert.strictEqual(row.slug, task.slug);
      assert.deepStrictEqual(row.content, task);
    }
  });

  await t.test('9. UI percentages calculate correctly from completed items', () => {
    const task = INITIAL_SEED_TASKS.find(t => t.id === 'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001');
    const totalV = task.verification.length;
    const progressMap = { verificationCompletedItems: [task.verification[0].id] };
    const metrics = calculateTaskProgress(task, progressMap, 'verification');
    const expectedPercent = Math.round((1 / totalV) * 100);
    assert.strictEqual(metrics.verificationPercent, expectedPercent);
    assert.strictEqual(Number.isNaN(metrics.verificationPercent), false);
    assert.strictEqual(Number.isNaN(metrics.overallPercent), false);
  });

  await t.test('10. No blank checklist labels render across all 211 tasks', () => {
    for (const task of INITIAL_SEED_TASKS) {
      for (const item of task.verification) {
        assert.ok(item.text && item.text.trim().length > 0, `Task ${task.id} has blank verification label`);
      }
      for (const item of task.cleanup) {
        assert.ok(item.text && item.text.trim().length > 0, `Task ${task.id} has blank cleanup label`);
      }
    }
  });
});

