import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_SEED_TASKS } from '../src/data/tasksData.js';

// Helper to determine if a task is inspection / calculation only without resource creation
function isInspectionOnlyTask(task) {
  const textToScan = [
    task.title,
    task.goal || '',
    task.expectedResult || '',
    ...(task.concepts || []),
    ...(task.consoleSteps || []).flatMap(s => [s.title, ...(s.items || [])]),
    ...(task.cliSteps || []).flatMap(s => [s.title, ...(s.commands || [])])
  ].join(' ').toLowerCase();

  // If the title or goal specifically talks about calculating, listing, searching, finding, designing on paper, or explaining without creation steps
  const inspectionKeywords = [
    'list s3 buckets and find each bucket region',
    'design a vpc cidr plan',
    'calculate subnet sizes',
    'estimate cost',
    'find the region',
    'inspect existing',
    'view CloudTrail logs',
    'search documentation'
  ];

  const creationKeywords = [
    'create', 'launch', 'deploy', 'build', 'provision', 'enable', 'configure', 'attach', 'add', 'put-', 'set up'
  ];

  // If title matches specific inspection tasks that create nothing
  if (task.id === 'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001' ||
      task.id === 'task-saa-vpc-design-a-vpc-cidr-plan-001') {
    return true;
  }

  return false;
}

function generateVerificationText(task, item, index, total) {
  const service = task.service || 'AWS Service';
  const feature = task.feature || '';
  const title = task.title || '';
  const region = task.region || 'us-east-1';

  if (service.includes('S3') || task.id.includes('-s3-')) {
    if (index === 0) return `Confirm the S3 bucket '${task.title.toLowerCase().includes('bucket') ? 'created in this lab' : 'target bucket'}' is listed and accessible in the S3 console.`;
    if (index === 1) return `Verify that GetBucketLocation or bucket settings confirm the Region is '${region}'.`;
    if (index === 2) return `Verify that ${feature || 'bucket configuration'} settings match the expected security and access parameters.`;
    if (index === 3) return `Confirm object uploading, versioning, or lifecycle rules execute without permission errors.`;
    if (index === 4) return `Verify that server-side encryption and access logging are configured as specified.`;
    return `Confirm all S3 verification steps completed successfully for ${title}.`;
  }

  if (service.includes('EC2') || task.id.includes('-ec2-')) {
    if (index === 0) return `Confirm the EC2 instance status shows 'Running' in the EC2 Management Console.`;
    if (index === 1) return `Verify system status checks and instance status checks report 2/2 checks passed.`;
    if (index === 2) return `Confirm security group inbound rules permit required traffic for ${feature || title}.`;
    if (index === 3) return `Verify key pair association, Elastic IP, or EBS volume attachments are active.`;
    return `Confirm EC2 instance configuration matches expected lab specifications.`;
  }

  if (service.includes('VPC') || task.id.includes('-vpc-')) {
    if (index === 0) return `Confirm the VPC state is 'available' in the Amazon VPC console.`;
    if (index === 1) return `Verify subnets, route tables, and Internet/NAT Gateways are associated correctly.`;
    if (index === 2) return `Confirm Network ACL and security group rules allow expected traffic flow.`;
    return `Verify VPC routing and network configuration for ${title}.`;
  }

  if (service.includes('RDS') || service.includes('Aurora') || task.id.includes('-rds-') || task.id.includes('-aurora-')) {
    if (index === 0) return `Confirm the RDS/Aurora database instance status displays 'Available'.`;
    if (index === 1) return `Verify DB subnet group, security group, and encryption settings match specifications.`;
    return `Confirm database endpoint connectivity and parameter group configurations.`;
  }

  if (service.includes('DynamoDB') || task.id.includes('-dynamodb-')) {
    if (index === 0) return `Confirm the DynamoDB table status displays 'Active' in the DynamoDB console.`;
    if (index === 1) return `Verify primary key schema, indexes, and throughput settings for ${title}.`;
    return `Confirm items and read/write capacity settings match lab requirements.`;
  }

  if (service.includes('IAM') || task.id.includes('-iam-')) {
    if (index === 0) return `Confirm the IAM role/policy is created and visible in the IAM Management Console.`;
    if (index === 1) return `Verify policy JSON permissions and trust relationship policy statements.`;
    return `Confirm IAM permissions permit required service actions without access denied errors.`;
  }

  // General fallback tailored to task
  if (index === 0) return `Confirm ${service} resource '${title}' is active and visible in AWS Console.`;
  if (index === 1) return `Verify configuration parameters and feature settings for ${feature || title}.`;
  if (index === 2) return `Confirm operational status and connectivity for ${service} deployment.`;
  return `Verify task requirements for ${title} are fully satisfied.`;
}

function generateCleanupText(task, item, index, total) {
  const service = task.service || 'AWS Service';
  const feature = task.feature || '';
  const title = task.title || '';

  if (isInspectionOnlyTask(task)) {
    return `No AWS resources were created during this lab, so no cleanup is required.`;
  }

  if (service.includes('S3') || task.id.includes('-s3-')) {
    if (total === 1) return `Empty all objects, object versions, and delete markers, then delete the S3 bucket created during this lab.`;
    if (index === 0) return `Empty all object versions, delete markers, and objects stored in the lab S3 bucket.`;
    if (index === 1) return `Delete the S3 bucket created during this lab to prevent storage charges.`;
    if (index === 2) return `Remove any custom bucket policies, lifecycle rules, or logging configurations created for this lab.`;
    return `Clean up all remaining S3 artifacts created during this lab.`;
  }

  if (service.includes('EC2') || task.id.includes('-ec2-')) {
    if (total === 1) return `Terminate the EC2 instance created during this lab and disassociate any Elastic IPs.`;
    if (index === 0) return `Terminate the EC2 instance created during this lab and wait for state to show Terminated.`;
    if (index === 1) return `Release any Elastic IP addresses allocated during this lab.`;
    if (index === 2) return `Delete custom security groups, key pairs, and EBS volumes created for this lab.`;
    return `Clean up all EC2 compute and storage resources created during this lab.`;
  }

  if (service.includes('VPC') || task.id.includes('-vpc-')) {
    if (total === 1) return `Delete subnets, route tables, gateways, and the custom VPC created during this lab.`;
    if (index === 0) return `Delete NAT Gateways created during the lab and wait for state to show Deleted before releasing Elastic IPs.`;
    if (index === 1) return `Detach and delete Internet Gateways, custom route tables, and subnets created for this VPC.`;
    if (index === 2) return `Delete the custom VPC created during this lab.`;
    return `Clean up remaining VPC networking resources.`;
  }

  if (service.includes('RDS') || service.includes('Aurora') || task.id.includes('-rds-') || task.id.includes('-aurora-')) {
    if (index === 0) return `Delete DB instances or clusters created during the lab (disabling final snapshot if temporary test).`;
    if (index === 1) return `Delete custom DB subnet groups, parameter groups, and security groups created for this lab.`;
    return `Clean up all database resources created during this lab.`;
  }

  if (service.includes('DynamoDB') || task.id.includes('-dynamodb-')) {
    return `Delete the DynamoDB table created during this lab to avoid ongoing storage charges.`;
  }

  if (service.includes('IAM') || task.id.includes('-iam-')) {
    return `Delete the custom IAM role, inline policies, or managed policies created specifically for this lab.`;
  }

  if (total === 1) return `Delete all ${service} resources created during this lab to avoid unwanted charges.`;
  if (index === 0) return `Delete main ${service} resources created during this lab.`;
  return `Delete associated supporting resources and configurations created during this lab.`;
}

// Map task modules
const taskFileMap = {
  S3_TASKS: 'src/data/tasks/s3Tasks.js',
  EC2_TASKS: 'src/data/tasks/ec2Tasks.js',
  VPC_TASKS: 'src/data/tasks/vpcTasks.js',
  IAM_TASKS: 'src/data/tasks/iamTasks.js',
  ELB_TASKS: 'src/data/tasks/elbTasks.js',
  AUTO_SCALING_TASKS: 'src/data/tasks/autoScalingTasks.js',
  RDS_TASKS: 'src/data/tasks/rdsTasks.js',
  AURORA_TASKS: 'src/data/tasks/auroraTasks.js',
  DYNAMODB_TASKS: 'src/data/tasks/dynamoDbTasks.js',
  ELASTICACHE_TASKS: 'src/data/tasks/elasticacheTasks.js',
  REDSHIFT_TASKS: 'src/data/tasks/redshiftTasks.js',
  LAMBDA_TASKS: 'src/data/tasks/lambdaTasks.js',
  API_GATEWAY_TASKS: 'src/data/tasks/apiGatewayTasks.js',
  STEP_FUNCTIONS_TASKS: 'src/data/tasks/stepFunctionsTasks.js',
  EVENTBRIDGE_TASKS: 'src/data/tasks/eventBridgeTasks.js',
  SQS_TASKS: 'src/data/tasks/sqsTasks.js',
  SNS_TASKS: 'src/data/tasks/snsTasks.js',
  ECR_TASKS: 'src/data/tasks/ecrTasks.js',
  FARGATE_TASKS: 'src/data/tasks/fargateTasks.js',
  ECS_TASKS: 'src/data/tasks/ecsTasks.js',
  CLOUDFRONT_TASKS: 'src/data/tasks/cloudFrontTasks.js',
  GLOBAL_ACCELERATOR_TASKS: 'src/data/tasks/globalAcceleratorTasks.js',
  KMS_TASKS: 'src/data/tasks/kmsTasks.js',
  SECRETS_MANAGER_TASKS: 'src/data/tasks/secretsManagerTasks.js',
  MACIE_TASKS: 'src/data/tasks/macieTasks.js',
  GUARDDUTY_TASKS: 'src/data/tasks/guardDutyTasks.js',
  COGNITO_TASKS: 'src/data/tasks/cognitoTasks.js',
  MGN_TASKS: 'src/data/tasks/mgnTasks.js',
  DMS_TASKS: 'src/data/tasks/dmsTasks.js',
  SNOW_FAMILY_TASKS: 'src/data/tasks/snowFamilyTasks.js',
  STORAGE_GATEWAY_TASKS: 'src/data/tasks/storageGatewayTasks.js',
  DATASYNC_TASKS: 'src/data/tasks/dataSyncTasks.js',
  SITE_TO_SITE_VPN_TASKS: 'src/data/tasks/siteToSiteVpnTasks.js',
  DIRECT_CONNECT_TASKS: 'src/data/tasks/directConnectTasks.js',
  CLOUDWATCH_TASKS: 'src/data/tasks/cloudWatchTasks.js',
  CLOUDTRAIL_TASKS: 'src/data/tasks/cloudTrailTasks.js',
  CONFIG_TASKS: 'src/data/tasks/configTasks.js',
  ORGANIZATIONS_TASKS: 'src/data/tasks/organizationsTasks.js',
  KINESIS_TASKS: 'src/data/tasks/kinesisTasks.js',
  ROUTE53_TASKS: 'src/data/tasks/route53Tasks.js',
  AWS_BACKUP_TASKS: 'src/data/tasks/awsBackupTasks.js'
};

// We will inspect each file and update the exact text strings for empty verification and cleanup objects!
const filesToModify = new Set();
let totalRepairedTasks = 0;
let totalPopulatedVerification = 0;
let totalPopulatedCleanup = 0;

for (const task of INITIAL_SEED_TASKS) {
  let taskModified = false;

  const vList = Array.isArray(task.verification) ? task.verification : [];
  const cList = Array.isArray(task.cleanup) ? task.cleanup : [];

  vList.forEach((item, idx) => {
    if (item.text === '' || !item.text) {
      item.text = generateVerificationText(task, item, idx, vList.length);
      totalPopulatedVerification++;
      taskModified = true;
    }
  });

  cList.forEach((item, idx) => {
    if (item.text === '' || !item.text) {
      item.text = generateCleanupText(task, item, idx, cList.length);
      totalPopulatedCleanup++;
      taskModified = true;
    }
  });

  if (taskModified) {
    totalRepairedTasks++;
  }
}

// Now write updated task modules to disk preserving ES module export syntax
// To make sure code formatting, comments, and structure are preserved cleanly, we can find the task module file for each task and replace the empty string fields in that specific file!
// Let's do file regex replacement of exact empty `text: ""` occurrences per task ID in task files!
