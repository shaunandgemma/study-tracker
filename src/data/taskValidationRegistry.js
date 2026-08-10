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
  },
  'ec2.nat-gateway-available': {
    type: 'ec2.nat-gateway-available',
    service: 'Amazon VPC',
    requiredPermissions: ['ec2:DescribeNatGateways'],
    resourceInput: 'natGatewayId',
    description: 'Verify target NAT Gateway exists and status is available'
  },
  'ec2.peering-active': {
    type: 'ec2.peering-active',
    service: 'Amazon VPC',
    requiredPermissions: ['ec2:DescribeVpcPeeringConnections'],
    resourceInput: 'peeringConnectionId',
    description: 'Verify VPC Peering connection status is active'
  },
  'ec2.transit-gateway-available': {
    type: 'ec2.transit-gateway-available',
    service: 'Amazon VPC',
    requiredPermissions: ['ec2:DescribeTransitGateways'],
    resourceInput: 'transitGatewayId',
    description: 'Verify Transit Gateway status is available'
  },
  'vpce.interface-endpoint-available': {
    type: 'vpce.interface-endpoint-available',
    service: 'Amazon VPC',
    requiredPermissions: ['ec2:DescribeVpcEndpoints'],
    resourceInput: 'interfaceEndpointId',
    description: 'Verify Interface VPC Endpoint status is available'
  }
};

// ─── S3 Contract Shorthands ──────────────────────────────────────────────────

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

  // ── S3: Category 2 restored ─────────────────────────────────────────────────

  // ── EC2: Category 1 (originally mapped) ────────────────────────────────────

  // ── EC2: Category 2 restored ────────────────────────────────────────────────

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

  // ── VPC Learning Path Dedicated Tasks ──────────────────────────────────────
  'path-vpc-create-public-subnets': ['ec2.subnet-exists'],
  'path-vpc-create-private-subnets': ['ec2.subnet-exists'],
  'path-vpc-configure-public-route-table': ['ec2.vpc-exists'],
  'path-vpc-launch-public-bastion-instance': EC2_INSTANCE_CONTRACTS,
  'path-vpc-launch-private-test-instance': EC2_INSTANCE_CONTRACTS,
  'path-vpc-configure-private-route-table': ['ec2.vpc-exists'],
  'path-vpc-validate-private-outbound-access': EC2_INSTANCE_CONTRACTS,
  'path-vpc-create-second-vpc': VPC_CONTRACTS,
  'path-vpc-create-third-vpc-tgw': VPC_CONTRACTS,
  'path-vpc-architecture-final-validation': VPC_CONTRACTS,
  'path-vpc-project-final-cleanup': ['ec2.vpc-exists'],

  // ── IAM: Category 1 (originally mapped) ────────────────────────────────────

  // ── IAM: Category 2 restored ────────────────────────────────────────────────

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
  'task-saa-vpc-create-a-2-az-vpc-002',
  'task-saa-rds-create-rds-and-connect-from-ec2-001',
  'task-saa-rds-enable-rds-encryption-with-kms-005',
  'task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010',
  'task-saa-cloudwatch-real-time-metric-filters-alarms-sns-notifications-002'
]);

const NEW_BACKEND_VALIDATOR_TASK_IDS = new Set();

export const RESTORED_EXISTING_HANDLER_TASK_IDS = Object.freeze(
  Object.keys(TASK_VALIDATION_CONTRACT_TYPES).filter(taskId => (
    !taskId.startsWith('path-') && !ORIGINAL_EXACT_TASK_IDS.has(taskId) && !NEW_BACKEND_VALIDATOR_TASK_IDS.has(taskId)
  ))
);

const NO_SENSIBLE_LIVE_VALIDATION_TASK_IDS = new Set([
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
