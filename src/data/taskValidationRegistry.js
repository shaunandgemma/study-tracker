/**
 * Declarative contracts supported by the live aws-validate-task Edge Function.
 * Task resolution is intentionally explicit: unknown tasks receive no contract.
 */
export const TASK_VALIDATION_REGISTRY = {
  's3.bucket-exists': {
    type: 's3.bucket-exists',
    service: 'Amazon S3',
    requiredPermissions: ['s3:ListBucket', 's3:GetBucketLocation'],
    resourceInput: 'bucketName',
    description: 'Verify target S3 bucket exists in your AWS account'
  },
  's3.bucket-region': {
    type: 's3.bucket-region',
    service: 'Amazon S3',
    requiredPermissions: ['s3:ListBucket', 's3:GetBucketLocation'],
    resourceInput: 'bucketName',
    description: 'Verify target S3 bucket exists and retrieve its AWS Region'
  },
  's3.versioning-enabled': {
    type: 's3.versioning-enabled',
    service: 'Amazon S3',
    requiredPermissions: ['s3:GetBucketVersioning'],
    resourceInput: 'bucketName',
    description: 'Verify S3 bucket versioning status is Enabled'
  },
  's3.default-encryption-enabled': {
    type: 's3.default-encryption-enabled',
    service: 'Amazon S3',
    requiredPermissions: ['s3:GetEncryptionConfiguration'],
    resourceInput: 'bucketName',
    description: 'Verify default server-side encryption (SSE-S3 or SSE-KMS) is configured'
  },
  'ec2.instance-exists': {
    type: 'ec2.instance-exists',
    service: 'Amazon EC2',
    requiredPermissions: ['ec2:DescribeInstances'],
    resourceInput: 'instanceId',
    description: 'Verify target EC2 instance exists'
  },
  'ec2.instance-running': {
    type: 'ec2.instance-running',
    service: 'Amazon EC2',
    requiredPermissions: ['ec2:DescribeInstances'],
    resourceInput: 'instanceId',
    description: 'Verify EC2 instance state is running'
  },
  'ec2.vpc-exists': {
    type: 'ec2.vpc-exists',
    service: 'Amazon VPC',
    requiredPermissions: ['ec2:DescribeVpcs'],
    resourceInput: 'vpcId',
    description: 'Verify target Amazon VPC is available'
  },
  'ec2.subnet-exists': {
    type: 'ec2.subnet-exists',
    service: 'Amazon VPC',
    requiredPermissions: ['ec2:DescribeSubnets'],
    resourceInput: 'vpcId',
    description: 'Verify the target VPC contains at least one subnet'
  },
  'ec2.security-group-rule-exists': {
    type: 'ec2.security-group-rule-exists',
    service: 'Amazon EC2',
    requiredPermissions: ['ec2:DescribeSecurityGroups'],
    resourceInput: 'groupId',
    description: 'Verify target security group exists'
  },
  'iam.role-exists': {
    type: 'iam.role-exists',
    service: 'AWS IAM',
    requiredPermissions: ['iam:GetRole'],
    resourceInput: 'roleName',
    description: 'Verify target IAM role exists in your account'
  },
  'rds.instance-available': {
    type: 'rds.instance-available',
    service: 'Amazon RDS',
    requiredPermissions: ['rds:DescribeDBInstances'],
    resourceInput: 'dbInstanceIdentifier',
    description: 'Verify RDS DB instance status is available'
  },
  'rds.encryption-enabled': {
    type: 'rds.encryption-enabled',
    service: 'Amazon RDS',
    requiredPermissions: ['rds:DescribeDBInstances'],
    resourceInput: 'dbInstanceIdentifier',
    description: 'Verify RDS storage encryption is enabled'
  },
  'dynamodb.table-active': {
    type: 'dynamodb.table-active',
    service: 'Amazon DynamoDB',
    requiredPermissions: ['dynamodb:DescribeTable'],
    resourceInput: 'tableName',
    description: 'Verify DynamoDB table status is ACTIVE'
  },
  'cloudwatch.alarm-exists': {
    type: 'cloudwatch.alarm-exists',
    service: 'Amazon CloudWatch',
    requiredPermissions: ['cloudwatch:DescribeAlarms'],
    resourceInput: 'alarmName',
    description: 'Verify CloudWatch metric alarm exists'
  }
};

// ─── S3 Contract Shorthands ──────────────────────────────────────────────────

const S3_BUCKET_REGION_CONTRACTS = ['s3.bucket-exists', 's3.bucket-region'];
const S3_VERSIONING_CONTRACTS = ['s3.bucket-exists', 's3.versioning-enabled', 's3.default-encryption-enabled'];
const S3_VERSIONING_ONLY_CONTRACTS = ['s3.bucket-exists', 's3.versioning-enabled'];
const S3_ENCRYPTION_CONTRACTS = ['s3.bucket-exists', 's3.default-encryption-enabled'];
const S3_EXISTS_CONTRACTS = ['s3.bucket-exists'];

// ─── EC2 Contract Shorthands ─────────────────────────────────────────────────

const EC2_INSTANCE_CONTRACTS = ['ec2.instance-exists', 'ec2.instance-running'];
const EC2_SG_CONTRACTS = ['ec2.security-group-rule-exists'];

// ─── VPC Contract Shorthands ─────────────────────────────────────────────────

const VPC_CONTRACTS = ['ec2.vpc-exists', 'ec2.subnet-exists'];

// ─── RDS Contract Shorthands ─────────────────────────────────────────────────

const RDS_AVAILABLE_CONTRACTS = ['rds.instance-available'];
const RDS_ENCRYPTION_CONTRACTS = ['rds.instance-available', 'rds.encryption-enabled'];

/**
 * Exact task-ID to validation contract mappings.
 *
 * Each task maps to only the checks directly required by that task's instructions.
 * Never assign one task's complete checklist to every task in the same service.
 *
 * Categories:
 *   1. Exact validator available (mapped here)
 *   2. Validator possible using existing backend handler (mapped here)
 *   3. New backend validator required (not yet mapped)
 *   4. No sensible live AWS validation (not mapped)
 */
export const TASK_VALIDATION_CONTRACT_TYPES = {
  // ── S3: Category 1 (originally mapped) ─────────────────────────────────────
  'task-saa-s3-versioning-001': S3_VERSIONING_CONTRACTS,
  'task-saa-s3-upload-the-same-file-twice-and-view-both-saved-versions-003': S3_VERSIONING_ONLY_CONTRACTS,
  'task-saa-s3-delete-a-file-then-restore-it-using-s3-versioning-004': S3_VERSIONING_ONLY_CONTRACTS,
  'task-saa-s3-turn-on-default-sse-s3-encryption-010': S3_ENCRYPTION_CONTRACTS,
  'task-saa-s3-switch-default-encryption-to-sse-kms-011': S3_ENCRYPTION_CONTRACTS,

  // ── S3: Category 2 restored ─────────────────────────────────────────────────
  'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001': S3_BUCKET_REGION_CONTRACTS,
  'task-saa-s3-upload-a-file-and-share-it-with-a-presigned-url-006': S3_EXISTS_CONTRACTS,
  'task-saa-s3-add-a-bucket-policy-that-blocks-public-access-007': S3_EXISTS_CONTRACTS,
  'task-saa-s3-turn-on-block-public-access-for-an-s3-bucket-008': S3_EXISTS_CONTRACTS,
  'task-saa-s3-set-s3-static-website-index-and-error-pages-013': S3_EXISTS_CONTRACTS,
  'task-saa-s3-test-the-custom-s3-website-404-page-014': S3_EXISTS_CONTRACTS,
  'task-saa-s3-turn-on-access-logging-for-the-s3-website-bucket-015': S3_EXISTS_CONTRACTS,
  'task-saa-s3-put-cloudfront-in-front-of-the-s3-website-016': S3_EXISTS_CONTRACTS,
  'task-saa-s3-change-a-website-file-and-create-a-cloudfront-invalidation-017': S3_EXISTS_CONTRACTS,
  'task-saa-s3-create-a-lifecycle-rule-that-moves-objects-to-standard-ia-018': S3_EXISTS_CONTRACTS,
  'task-saa-s3-add-a-lifecycle-rule-that-deletes-old-noncurrent-versions-019': S3_VERSIONING_ONLY_CONTRACTS,
  'task-saa-s3-upload-a-large-file-and-notice-how-s3-uses-multipart-upload-024': S3_EXISTS_CONTRACTS,
  'task-saa-s3-turn-on-s3-transfer-acceleration-and-compare-the-upload-endpoint-025': S3_EXISTS_CONTRACTS,
  'task-saa-s3-create-an-s3-access-point-and-use-it-to-list-bucket-objects-026': S3_EXISTS_CONTRACTS,
  'task-saa-s3-try-to-make-a-bucket-public-while-block-public-access-is-still-on-029': S3_EXISTS_CONTRACTS,
  'task-saa-s3-try-uploading-to-a-kms-encrypted-bucket-without-kms-encrypt-permission-030': S3_ENCRYPTION_CONTRACTS,
  'task-saa-s3-upload-with-aws-s3-cp-and-compare-with-s3api-put-object-032': S3_EXISTS_CONTRACTS,

  // ── EC2: Category 1 (originally mapped) ────────────────────────────────────
  'task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-launch-an-ec2-instance-using-the-aws-cli-002': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-configure-a-security-group-for-http-and-ssh-006': EC2_SG_CONTRACTS,

  // ── EC2: Category 2 restored ────────────────────────────────────────────────
  'task-saa-ec2-connect-to-an-ec2-instance-using-ssh-or-rdp-003': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-create-and-attach-an-ebs-volume-to-an-ec2-instance-004': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-create-an-ami-from-an-ec2-instance-and-launch-a-new-instance-from-the-ami-005': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-attach-an-iam-role-to-ec2-for-secure-s3-access-010': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-configure-ec2-instance-metadata-options-011': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-set-up-a-placement-group-012': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-launch-a-spot-instance-013': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-use-ec2-instance-connect-014': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-monitor-ec2-instance-metrics-with-cloudwatch-015': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-configure-and-use-enis-and-elastic-ips-with-ec2-017': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-compare-security-groups-and-nacls-for-ec2-networking-018': EC2_SG_CONTRACTS,
  'task-saa-ec2-recover-an-ec2-instance-and-troubleshoot-common-issues-021': EC2_INSTANCE_CONTRACTS,
  'task-saa-ec2-use-ssm-session-manager-and-patch-manager-with-ec2-027': EC2_INSTANCE_CONTRACTS,

  // ── VPC: Category 1 (originally mapped) ────────────────────────────────────
  'task-saa-vpc-create-a-2-az-vpc-002': VPC_CONTRACTS,

  // ── VPC: Category 2 restored ────────────────────────────────────────────────
  'task-saa-vpc-attach-an-internet-gateway-003': ['ec2.vpc-exists'],
  'task-saa-vpc-configure-a-nat-gateway-004': ['ec2.vpc-exists'],
  'task-saa-vpc-create-a-nat-instance-alternative-005': ['ec2.vpc-exists'],
  'task-saa-vpc-configure-route-tables-for-igw-and-nat-006': ['ec2.vpc-exists'],
  'task-saa-vpc-create-security-groups-for-bastion-ssh-and-app-ports-007': EC2_SG_CONTRACTS,
  'task-saa-vpc-implement-a-network-acl-rule-to-block-an-ip-range-008': VPC_CONTRACTS,
  'task-saa-vpc-create-an-s3-gateway-vpc-endpoint-013': VPC_CONTRACTS,
  'task-saa-vpc-create-an-interface-vpc-endpoint-for-secrets-manager-014': VPC_CONTRACTS,
  'task-saa-vpc-restrict-access-with-a-vpc-endpoint-policy-015': VPC_CONTRACTS,
  'task-saa-vpc-configure-vpc-dns-options-and-test-private-dns-for-endpoints-016': VPC_CONTRACTS,
  'task-saa-vpc-configure-customer-gateway-and-virtual-private-gateway-018': ['ec2.vpc-exists'],
  'task-saa-vpc-configure-vpc-sharing-with-aws-ram-020': VPC_CONTRACTS,
  'task-saa-vpc-implement-an-asymmetric-routing-scenario-021': ['ec2.vpc-exists'],
  'task-saa-vpc-create-a-dynamodb-gateway-endpoint-with-policy-restrictions-025': VPC_CONTRACTS,
  'task-saa-vpc-enable-ipv6-in-a-vpc-and-test-ipv6-routing-026': VPC_CONTRACTS,
  'task-saa-vpc-configure-dhcp-options-set-for-custom-dns-and-domain-resolution-027': ['ec2.vpc-exists'],
  'task-saa-vpc-set-up-aws-network-firewall-and-block-outbound-traffic-028': ['ec2.vpc-exists'],
  'task-saa-vpc-compare-security-groups-and-nacls-using-ephemeral-return-traffic-029': VPC_CONTRACTS,
  'task-saa-vpc-troubleshoot-connectivity-with-reachability-analyzer-and-traceroute-032': ['ec2.vpc-exists'],
  'task-saa-vpc-review-and-implement-vpc-security-best-practices-036': VPC_CONTRACTS,

  // ── IAM: Category 1 (originally mapped) ────────────────────────────────────
  'task-saa-iam-create-an-ec2-role-to-read-one-s3-bucket-005': ['iam.role-exists'],
  'task-saa-iam-create-a-role-with-external-id-and-test-assumerole-014': ['iam.role-exists'],

  // ── IAM: Category 2 restored ────────────────────────────────────────────────
  'task-saa-iam-launch-ec2-with-an-instance-profile-and-verify-imds-credentials-006': ['iam.role-exists'],
  'task-saa-iam-update-an-ec2-role-policy-and-verify-permissions-change-without-reboot-007': ['iam.role-exists'],
  'task-saa-iam-set-up-saml-federation-and-sign-in-to-aws-016': ['iam.role-exists'],
  'task-saa-iam-assumerole-with-sts-from-the-cli-024': ['iam.role-exists'],
  'task-saa-iam-lambda-stops-only-tagged-ec2-instances-025': ['iam.role-exists'],

  // ── RDS: Category 1 (originally mapped) ─────────────────────────────────────
  'task-saa-rds-create-rds-and-connect-from-ec2-001': RDS_ENCRYPTION_CONTRACTS,
  'task-saa-rds-enable-rds-encryption-with-kms-005': RDS_ENCRYPTION_CONTRACTS,

  // ── RDS: Category 2 restored ─────────────────────────────────────────────────
  'task-saa-rds-create-a-multi-az-rds-database-002': RDS_AVAILABLE_CONTRACTS,
  'task-saa-rds-create-an-rds-read-replica-and-explain-read-scaling-003': RDS_AVAILABLE_CONTRACTS,
  'task-saa-rds-take-an-rds-snapshot-and-restore-a-new-database-004': RDS_AVAILABLE_CONTRACTS,
  'task-saa-rds-compare-rds-backup-snapshot-and-pitr-006': RDS_AVAILABLE_CONTRACTS,

  // ── Aurora: Category 2 restored ──────────────────────────────────────────────

  // ── DynamoDB: Category 1 (originally mapped) ─────────────────────────────────
  'task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010': ['dynamodb.table-active'],

  // ── DynamoDB: Category 2 restored ────────────────────────────────────────────
  'task-saa-dynamodb-add-a-sort-key-query-dynamodb-data-011': ['dynamodb.table-active'],
  'task-saa-dynamodb-configure-dynamodb-on-demand-vs-provisioned-capacity-012': ['dynamodb.table-active'],
  'task-saa-dynamodb-create-a-dynamodb-global-secondary-index-gsi-013': ['dynamodb.table-active'],
  'task-saa-dynamodb-enable-dynamodb-streams-014': ['dynamodb.table-active'],
  'task-saa-dynamodb-enable-dynamodb-time-to-live-ttl-015': ['dynamodb.table-active'],
  'task-saa-dynamodb-enable-dynamodb-global-tables-016': ['dynamodb.table-active'],
  'task-saa-dynamodb-configure-dynamodb-backup-restore-017': ['dynamodb.table-active'],

  // ── CloudWatch: Category 1 (originally mapped) ───────────────────────────────
  'task-saa-cloudwatch-real-time-metric-filters-alarms-sns-notifications-002': ['cloudwatch.alarm-exists'],

  // ── CloudWatch: Category 2 restored ─────────────────────────────────────────
};

const ORIGINAL_EXACT_TASK_IDS = new Set([
  'task-saa-s3-versioning-001',
  'task-saa-s3-upload-the-same-file-twice-and-view-both-saved-versions-003',
  'task-saa-s3-delete-a-file-then-restore-it-using-s3-versioning-004',
  'task-saa-s3-turn-on-default-sse-s3-encryption-010',
  'task-saa-s3-switch-default-encryption-to-sse-kms-011',
  'task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001',
  'task-saa-ec2-launch-an-ec2-instance-using-the-aws-cli-002',
  'task-saa-ec2-configure-a-security-group-for-http-and-ssh-006',
  'task-saa-vpc-create-a-2-az-vpc-002',
  'task-saa-iam-create-an-ec2-role-to-read-one-s3-bucket-005',
  'task-saa-iam-create-a-role-with-external-id-and-test-assumerole-014',
  'task-saa-rds-create-rds-and-connect-from-ec2-001',
  'task-saa-rds-enable-rds-encryption-with-kms-005',
  'task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010',
  'task-saa-cloudwatch-real-time-metric-filters-alarms-sns-notifications-002'
]);

const NEW_BACKEND_VALIDATOR_TASK_IDS = new Set([
  'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001'
]);

export const RESTORED_EXISTING_HANDLER_TASK_IDS = Object.freeze(
  Object.keys(TASK_VALIDATION_CONTRACT_TYPES).filter(taskId => (
    !ORIGINAL_EXACT_TASK_IDS.has(taskId) && !NEW_BACKEND_VALIDATOR_TASK_IDS.has(taskId)
  ))
);

const NO_SENSIBLE_LIVE_VALIDATION_TASK_IDS = new Set([
  'task-saa-s3-open-the-final-s3-guide-and-complete-the-last-review-task-033',
  'task-saa-ec2-compare-ec2-pricing-models-016',
  'task-saa-vpc-design-a-vpc-cidr-plan-001',
  'task-saa-rds-choose-the-best-database-for-exam-scenarios-025',
  'task-saa-aurora-compare-aurora-serverless-vs-provisioned-aurora-009',
  'task-saa-aurora-compare-rds-vs-aurora-vs-dynamodb-018',
  'task-saa-dynamodb-compare-redshift-vs-rds-vs-dynamodb-022',
  'task-saa-elasticache-compare-elasticache-redis-vs-memcached-019',
  'task-saa-dms-conceptual-guide-023'
]);

/** Narrow service/feature mappings used only when there is no exact ID mapping. */
const SERVICE_FEATURE_CONTRACT_TYPES = {
};

function getTaskDescriptor(task) {
  if (!task) return null;
  const content = task.content && typeof task.content === 'object' ? task.content : {};
  return {
    ...content,
    ...task,
    id: task.id || content.id || '',
    slug: task.slug || content.slug || '',
    service: task.service || content.service || '',
    feature: task.feature || content.feature || '',
    topicId: task.topicId || task.topic_id || content.topicId || '',
    validationContracts: task.validationContracts || content.validationContracts,
    validationType: task.validationType || content.validationType
  };
}

function resolveTypes(types) {
  return (types || []).map(type => TASK_VALIDATION_REGISTRY[type]).filter(Boolean);
}

function explicitContractTypes(task) {
  if (Array.isArray(task.validationContracts)) {
    return task.validationContracts.map(contract => typeof contract === 'string' ? contract : contract?.type).filter(Boolean);
  }
  return task.validationType ? [task.validationType] : [];
}

export function resolveValidationContractsForTask(task) {
  const descriptor = getTaskDescriptor(task);
  if (!descriptor) {
    return { contracts: [], source: 'none', ambiguous: false, incorrect: false, unknownTypes: [] };
  }

  const exactTypes = TASK_VALIDATION_CONTRACT_TYPES[descriptor.id] || [];
  const explicitTypes = explicitContractTypes(descriptor);
  const serviceFeatureTypes = SERVICE_FEATURE_CONTRACT_TYPES[`${descriptor.service}|${descriptor.feature}`] || [];

  let types = [];
  let source = 'none';
  if (exactTypes.length) {
    types = exactTypes;
    source = 'task-id';
  } else if (explicitTypes.length) {
    types = explicitTypes;
    source = 'task-metadata';
  } else if (serviceFeatureTypes.length) {
    types = serviceFeatureTypes;
    source = 'service-feature';
  }

  const contracts = resolveTypes(types);
  const unknownTypes = types.filter(type => !TASK_VALIDATION_REGISTRY[type]);
  const candidates = [exactTypes, explicitTypes, serviceFeatureTypes].filter(candidate => candidate.length);
  const distinctCandidates = new Set(candidates.map(candidate => JSON.stringify(candidate)));

  return {
    contracts,
    source,
    ambiguous: distinctCandidates.size > 1,
    incorrect: unknownTypes.length > 0 || contracts.length !== types.length,
    unknownTypes
  };
}

export function getValidationContractsForTask(task) {
  return resolveValidationContractsForTask(task).contracts;
}

export function auditTaskValidationContracts(tasks = []) {
  const details = tasks.map(task => {
    const resolution = resolveValidationContractsForTask(task);
    let category = 'new_backend_validator_required';
    if (resolution.contracts.length > 0 && !resolution.ambiguous && !resolution.incorrect) {
      category = 'exact_task_specific_validator_available';
    } else if (NO_SENSIBLE_LIVE_VALIDATION_TASK_IDS.has(task.id)) {
      category = 'no_sensible_live_aws_validation';
    }
    return { taskId: task.id, category, ...resolution };
  });
  const exactTaskSpecificValidatorAvailable = details.filter(item => (
    item.category === 'exact_task_specific_validator_available'
  )).length;
  const newBackendValidatorRequired = details.filter(item => (
    item.category === 'new_backend_validator_required'
  )).length;
  const noSensibleLiveAwsValidation = details.filter(item => (
    item.category === 'no_sensible_live_aws_validation'
  )).length;

  return {
    totalTasks: tasks.length,
    exactTaskSpecificValidatorAvailable,
    validatorPossibleUsingExistingBackendHandler: 0,
    newBackendValidatorRequired,
    noSensibleLiveAwsValidation,
    restoredExistingHandlerMappings: RESTORED_EXISTING_HANDLER_TASK_IDS.length,
    restoredExistingHandlerTaskIds: [...RESTORED_EXISTING_HANDLER_TASK_IDS],
    validTaskSpecificContracts: exactTaskSpecificValidatorAvailable,
    noLiveValidator: details.filter(item => item.contracts.length === 0 && !item.incorrect).length,
    ambiguousMatches: details.filter(item => item.ambiguous).length,
    incorrectMatches: details.filter(item => item.incorrect).length,
    contractTypeCounts: details.reduce((counts, item) => {
      for (const contract of item.contracts) counts[contract.type] = (counts[contract.type] || 0) + 1;
      return counts;
    }, {}),
    details
  };
}
