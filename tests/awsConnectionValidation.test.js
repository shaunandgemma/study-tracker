import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateExternalId,
  loadUserAwsConnection,
  testAwsConnection,
  validateAccountIdFormat,
  validateRegionFormat,
  validateResourceInputFormat,
  validateRoleArnFormat,
  validateTaskResource
} from '../src/services/awsConnectionService.js';
import {
  TASK_VALIDATION_REGISTRY,
  getValidationContractsForTask
} from '../src/data/taskValidationRegistry.js';
import { generateCloudFormationTemplate } from '../src/data/cloudFormationTemplate.js';

const s3VersioningTask = Object.freeze({
  id: 'task-saa-s3-versioning-001',
  service: 'Amazon S3',
  feature: 'Versioning',
  topicId: 'topic-s3',
  region: 'eu-west-2'
});

test('AWS connection and validation security safeguards', async (t) => {
  await t.test('1. IAM role ARN, account ID and Region formats are strict', () => {
    assert.equal(validateRoleArnFormat('arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole'), true);
    assert.equal(validateRoleArnFormat('arn:aws:iam::123456789012:user/admin'), false);
    assert.equal(validateRoleArnFormat('invalid-arn-string'), false);
    assert.equal(validateAccountIdFormat('123456789012'), true);
    assert.equal(validateAccountIdFormat('12345'), false);
    assert.equal(validateAccountIdFormat('12345678901a'), false);
    assert.equal(validateRegionFormat('eu-west-2'), true);
    assert.equal(validateRegionFormat('invalid-region'), false);
  });

  await t.test('2. AWS resource input formats remain service-specific', () => {
    assert.equal(validateResourceInputFormat('s3.bucket-exists', 'my-valid-bucket-123'), true);
    assert.equal(validateResourceInputFormat('s3.bucket-exists', 'INVALID_BUCKET_NAME!'), false);
    assert.equal(validateResourceInputFormat('ec2.instance-running', 'i-0123456789abcdef0'), true);
    assert.equal(validateResourceInputFormat('ec2.instance-running', 'invalid-instance-id'), false);
    assert.equal(validateResourceInputFormat('ec2.vpc-exists', 'vpc-0123456789abcdef0'), true);
    assert.equal(validateResourceInputFormat('ec2.vpc-exists', 'not-a-vpc-id'), false);
    assert.equal(validateResourceInputFormat('iam.role-exists', 'StudyTrackerHandsOnRole'), true);
  });

  await t.test('3. generated External IDs are unique UUIDs', () => {
    const first = generateExternalId();
    const second = generateExternalId();
    assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    assert.notEqual(first, second);
  });

  await t.test('4. simulation mode is explicit and never reports a live connection', async () => {
    process.env.VITE_AWS_SIMULATION_MODE = 'true';
    try {
      const result = await testAwsConnection({
        accountId: '123456789012',
        roleArn: 'arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole',
        externalId: generateExternalId()
      });
      assert.equal(result.success, true);
      assert.equal(result.status, 'simulation');
      assert.equal(result.backendVerified, false);
    } finally {
      delete process.env.VITE_AWS_SIMULATION_MODE;
    }
  });

  await t.test('5. unauthenticated live connection checks require sign-in', async () => {
    delete process.env.VITE_AWS_SIMULATION_MODE;
    const result = await testAwsConnection({
      accountId: '123456789012',
      roleArn: 'arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole',
      externalId: generateExternalId()
    });
    assert.equal(result.success, false);
    assert.equal(result.status, 'auth_required');
  });

  await t.test('6. account mismatches are rejected before connection use', async () => {
    const result = await testAwsConnection({
      accountId: '123456789012',
      roleArn: 'arn:aws:iam::999999999999:role/StudyTrackerHandsOnRole',
      externalId: generateExternalId()
    });
    assert.equal(result.success, false);
    assert.equal(result.status, 'account_mismatch');
  });

  await t.test('7. the validation registry retains least-privilege S3 contracts', () => {
    assert.ok(TASK_VALIDATION_REGISTRY['s3.bucket-exists']);
    assert.ok(TASK_VALIDATION_REGISTRY['s3.versioning-enabled']);
    assert.ok(TASK_VALIDATION_REGISTRY['s3.default-encryption-enabled']);
    assert.deepEqual(
      getValidationContractsForTask(s3VersioningTask).map(contract => contract.type),
      ['s3.bucket-exists', 's3.versioning-enabled', 's3.default-encryption-enabled']
    );
    assert.ok(TASK_VALIDATION_REGISTRY['s3.bucket-exists'].requiredPermissions.includes('s3:ListBucket'));
    assert.equal(TASK_VALIDATION_REGISTRY['s3.bucket-exists'].requiredPermissions.includes('s3:ListAllMyBuckets'), false);
  });

  await t.test('8. simulation validation identifies itself and retains resource input', async () => {
    process.env.VITE_AWS_SIMULATION_MODE = 'true';
    try {
      const result = await validateTaskResource(s3VersioningTask, {
        awsAccountId: '123456789012',
        roleArn: 'arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole',
        externalId: generateExternalId(),
        status: 'simulation',
        backendVerified: false
      }, 'my-test-bucket-name');
      assert.equal(result.status, 'simulation_passed');
      assert.equal(result.isSimulation, true);
      assert.ok(result.results.every(check => check.message.includes('my-test-bucket-name')));
    } finally {
      delete process.env.VITE_AWS_SIMULATION_MODE;
    }
  });

  await t.test('9. CloudFormation trust keeps the backend role and External ID condition', () => {
    const template = generateCloudFormationTemplate('test-uuid-1234', '406760143388', 'StudyTrackerAwsValidationBackendRole');
    assert.match(template, /AWS: !Sub 'arn:aws:iam::\$\{BackendAccountId\}:role\/\$\{BackendRoleName\}'/);
    assert.match(template, /sts:ExternalId: !Ref ExternalId/);
    assert.match(template, /Sid: S3ReadOnlyInspection/);
    assert.match(template, /autoscaling:DescribeAutoScalingGroups/);
    assert.doesNotMatch(template, /ec2:DescribeAutoScalingGroups/);
    assert.doesNotMatch(template, /s3:ListAllMyBuckets/);
  });

  await t.test('10. signed-out users receive no stored AWS connection', async () => {
    assert.equal(await loadUserAwsConnection(null), null);
  });
});

test('multi-contract live AWS validation', async (t) => {
  const bucketName = 's3-task-2-versioning-406760143388';
  const connection = {
    awsAccountId: '406760143388',
    roleArn: 'arn:aws:iam::406760143388:role/StudyTrackerHandsOnRole',
    externalId: 'test-external-id',
    status: 'connected',
    backendVerified: true
  };
  const successfulResponses = {
    's3.bucket-exists': { passed: true, message: `Bucket ${bucketName} exists.` },
    's3.versioning-enabled': { passed: true, message: `Bucket ${bucketName} versioning is enabled.` },
    's3.default-encryption-enabled': { passed: true, message: `Bucket ${bucketName} encryption is enabled.` }
  };

  async function run(responseOverrides = {}) {
    const responses = { ...successfulResponses, ...responseOverrides };
    const calls = [];
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
    return {
      calls,
      result: await validateTaskResource(s3VersioningTask, connection, bucketName, invokeValidation)
    };
  }

  await t.test('1. every contract runs once with the same resource input', async () => {
    const { calls } = await run();
    assert.equal(calls.length, 3);
    assert.deepEqual(
      new Set(calls.map(call => call.body.validationType)),
      new Set(['s3.bucket-exists', 's3.versioning-enabled', 's3.default-encryption-enabled'])
    );
    assert.ok(calls.every(call => call.functionName === 'aws-validate-task'));
    assert.ok(calls.every(call => call.body.resourceInput === bucketName));
  });

  await t.test('2. all successful contracts are required for overall success', async () => {
    const { result } = await run();
    assert.equal(result.status, 'live_passed');
    assert.equal(result.results.every(check => check.passed), true);
    assert.equal(new Set(result.results.map(check => check.message)).size, 3);
  });

  await t.test('3. one failed contract fails the overall result without mismatching messages', async () => {
    const failureMessage = `Bucket ${bucketName} versioning is disabled.`;
    const { result } = await run({
      's3.versioning-enabled': { passed: false, message: failureMessage }
    });
    assert.equal(result.status, 'live_failed');
    const failed = result.results.find(check => check.type === 's3.versioning-enabled');
    assert.equal(failed.passed, false);
    assert.equal(failed.message, failureMessage);
  });
});
