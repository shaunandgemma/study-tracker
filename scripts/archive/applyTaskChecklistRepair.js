import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_SEED_TASKS } from '../src/data/tasksData.js';

// Specific inspection tasks where no resources are created
const INSPECTION_TASK_IDS = new Set([
  'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001',
  'task-saa-vpc-design-a-vpc-cidr-plan-001',
  'task-saa-s3-open-s3-storage-lens-and-review-the-storage-dashboard-028',
  'task-saa-s3-open-the-final-s3-guide-and-complete-the-last-review-task-033'
]);

function generateVerificationText(task, item, index, total) {
  const service = task.service || 'AWS Service';
  const feature = task.feature || '';
  const title = task.title || '';
  const region = task.region || 'us-east-1';

  if (service.includes('S3') || task.id.includes('-s3-')) {
    if (index === 0) return `Confirm the S3 bucket is listed and accessible in the S3 console.`;
    if (index === 1) return `Verify that GetBucketLocation or bucket properties confirm the Region is '${region}'.`;
    if (index === 2) return `Verify that ${feature || 'bucket configuration'} settings match the expected requirements.`;
    if (index === 3) return `Confirm object operations and versioning rules execute without permission errors.`;
    if (index === 4) return `Verify that server-side encryption and access logging are enabled as specified.`;
    if (index === 5) return `Confirm bucket policy, public access block, and CORS configuration match lab settings.`;
    if (index === 6) return `Verify lifecycle configuration rules and object transition rules in the S3 console.`;
    if (index === 7) return `Confirm EventBridge or SNS/SQS event notifications are triggered on S3 object uploads.`;
    if (index === 8) return `Verify S3 Storage Lens dashboard or CloudWatch metrics reflect storage usage data.`;
    return `Confirm all S3 verification checks pass for ${title}.`;
  }

  if (service.includes('EC2') || task.id.includes('-ec2-')) {
    if (index === 0) return `Confirm the EC2 instance status shows 'Running' in the EC2 Management Console.`;
    if (index === 1) return `Verify system status checks and instance status checks report 2/2 checks passed.`;
    if (index === 2) return `Confirm security group inbound rules permit required ports for ${feature || title}.`;
    if (index === 3) return `Verify key pair association, Elastic IP, or attached EBS volumes are active.`;
    if (index === 4) return `Confirm User Data bootstrap script executed successfully and web server is reachable.`;
    if (index === 5) return `Verify instance profile IAM role permissions allow expected AWS API calls.`;
    return `Confirm EC2 instance configuration matches lab specifications.`;
  }

  if (service.includes('VPC') || task.id.includes('-vpc-')) {
    if (index === 0) return `Confirm the VPC state is 'available' in the Amazon VPC console.`;
    if (index === 1) return `Verify subnets, route tables, and Internet/NAT Gateways are associated correctly.`;
    if (index === 2) return `Confirm Network ACL and security group rules allow expected traffic flow.`;
    if (index === 3) return `Verify VPC Peering, Transit Gateway, or VPC Endpoint connectivity.`;
    if (index === 4) return `Confirm VPC Flow Logs are enabled and publishing traffic logs.`;
    return `Verify VPC networking configuration for ${title}.`;
  }

  if (service.includes('RDS') || service.includes('Aurora') || task.id.includes('-rds-') || task.id.includes('-aurora-')) {
    if (index === 0) return `Confirm the RDS database instance status displays 'Available' in the console.`;
    if (index === 1) return `Verify DB subnet group, security group, and storage encryption settings match specifications.`;
    if (index === 2) return `Confirm database endpoint connectivity and multi-AZ failover options.`;
    return `Verify RDS database configuration for ${title}.`;
  }

  if (service.includes('DynamoDB') || task.id.includes('-dynamodb-')) {
    if (index === 0) return `Confirm the DynamoDB table status displays 'Active' in the DynamoDB console.`;
    if (index === 1) return `Verify primary key schema, GSI/LSI indexes, and throughput capacity settings.`;
    if (index === 2) return `Confirm item CRUD operations succeed without throughput exceeded errors.`;
    return `Verify DynamoDB table settings for ${title}.`;
  }

  if (service.includes('IAM') || task.id.includes('-iam-')) {
    if (index === 0) return `Confirm the IAM role/policy is created and visible in the IAM Management Console.`;
    if (index === 1) return `Verify policy JSON permissions and trust relationship policy statements.`;
    if (index === 2) return `Confirm IAM permissions allow expected service actions without access denied errors.`;
    return `Verify IAM identity and access configuration for ${title}.`;
  }

  // Fallback tailored per index
  if (index === 0) return `Confirm ${service} resource for '${title}' is active in the AWS Management Console.`;
  if (index === 1) return `Verify configuration parameters and feature settings for ${feature || title}.`;
  if (index === 2) return `Confirm operational status and connectivity for ${service} deployment.`;
  return `Verify task requirements for ${title} are satisfied.`;
}

function generateCleanupText(task, item, index, total) {
  const service = task.service || 'AWS Service';
  const feature = task.feature || '';

  if (INSPECTION_TASK_IDS.has(task.id)) {
    return `No AWS resources were created during this lab, so no cleanup is required.`;
  }

  if (service.includes('S3') || task.id.includes('-s3-')) {
    if (total === 1) return `Empty all objects, object versions, and delete markers, then delete the S3 bucket created during this lab.`;
    if (index === 0) return `Empty all object versions, delete markers, and objects stored in the lab S3 bucket.`;
    if (index === 1) return `Delete the S3 bucket created during this lab to prevent storage charges.`;
    if (index === 2) return `Remove any custom bucket policies, access points, or logging rules created for this lab.`;
    if (index === 3) return `Delete CloudFront distributions, KMS keys, or replication rules created during the lab.`;
    if (index === 4) return `Clean up all remaining S3 artifacts and storage configurations created during this lab.`;
    return `Clean up S3 lab resources.`;
  }

  if (service.includes('EC2') || task.id.includes('-ec2-')) {
    if (total === 1) return `Terminate the EC2 instance created during this lab and disassociate any Elastic IPs.`;
    if (index === 0) return `Terminate the EC2 instance created during this lab and wait for state to show Terminated.`;
    if (index === 1) return `Release any Elastic IP addresses allocated during this lab.`;
    if (index === 2) return `Delete custom security groups, key pairs, and EBS volumes created for this lab.`;
    if (index === 3) return `Delete AMI images, launch templates, or placement groups created during the lab.`;
    return `Clean up EC2 compute and storage resources.`;
  }

  if (service.includes('VPC') || task.id.includes('-vpc-')) {
    if (total === 1) return `Delete subnets, route tables, gateways, and the custom VPC created during this lab.`;
    if (index === 0) return `Delete NAT Gateways created during the lab and wait for state to show Deleted before releasing Elastic IPs.`;
    if (index === 1) return `Detach and delete Internet Gateways, custom route tables, and subnets created for this VPC.`;
    if (index === 2) return `Delete custom VPC endpoints, peering connections, and network ACLs.`;
    if (index === 3) return `Delete the custom VPC created during this lab.`;
    return `Clean up remaining VPC networking resources.`;
  }

  if (service.includes('RDS') || service.includes('Aurora') || task.id.includes('-rds-') || task.id.includes('-aurora-')) {
    if (index === 0) return `Delete DB instances or clusters created during the lab (disabling final snapshot if temporary test).`;
    if (index === 1) return `Delete custom DB subnet groups, parameter groups, and security groups created for this lab.`;
    if (index === 2) return `Delete read replicas, RDS Proxy, or automated snapshot backups created for this lab.`;
    return `Clean up all database resources created during this lab.`;
  }

  if (service.includes('DynamoDB') || task.id.includes('-dynamodb-')) {
    if (index === 0) return `Delete the DynamoDB table created during this lab to avoid ongoing storage charges.`;
    return `Delete global tables or DAX clusters created during this lab.`;
  }

  if (service.includes('IAM') || task.id.includes('-iam-')) {
    if (index === 0) return `Delete the custom IAM role, inline policies, or managed policies created specifically for this lab.`;
    return `Remove IAM instance profiles or identity provider configurations created during this lab.`;
  }

  if (total === 1) return `Delete all ${service} resources created during this lab to avoid unwanted charges.`;
  if (index === 0) return `Delete main ${service} resources created during this lab.`;
  if (index === 1) return `Delete associated supporting resources and configurations created during this lab.`;
  return `Delete remaining log groups or security rules created for this lab.`;
}

// Module map: variable export name -> file path
const modules = [
  { name: 'S3_TASKS', path: 'src/data/tasks/s3Tasks.js' },
  { name: 'EC2_TASKS', path: 'src/data/tasks/ec2Tasks.js' },
  { name: 'VPC_TASKS', path: 'src/data/tasks/vpcTasks.js' },
  { name: 'IAM_TASKS', path: 'src/data/tasks/iamTasks.js' },
  { name: 'ELB_TASKS', path: 'src/data/tasks/elbTasks.js' },
  { name: 'AUTO_SCALING_TASKS', path: 'src/data/tasks/autoScalingTasks.js' },
  { name: 'RDS_TASKS', path: 'src/data/tasks/rdsTasks.js' },
  { name: 'AURORA_TASKS', path: 'src/data/tasks/auroraTasks.js' },
  { name: 'DYNAMODB_TASKS', path: 'src/data/tasks/dynamoDbTasks.js' },
  { name: 'ELASTICACHE_TASKS', path: 'src/data/tasks/elasticacheTasks.js' },
  { name: 'REDSHIFT_TASKS', path: 'src/data/tasks/redshiftTasks.js' },
  { name: 'LAMBDA_TASKS', path: 'src/data/tasks/lambdaTasks.js' },
  { name: 'API_GATEWAY_TASKS', path: 'src/data/tasks/apiGatewayTasks.js' },
  { name: 'STEP_FUNCTIONS_TASKS', path: 'src/data/tasks/stepFunctionsTasks.js' },
  { name: 'EVENTBRIDGE_TASKS', path: 'src/data/tasks/eventBridgeTasks.js' },
  { name: 'SQS_TASKS', path: 'src/data/tasks/sqsTasks.js' },
  { name: 'SNS_TASKS', path: 'src/data/tasks/snsTasks.js' },
  { name: 'ECR_TASKS', path: 'src/data/tasks/ecrTasks.js' },
  { name: 'FARGATE_TASKS', path: 'src/data/tasks/fargateTasks.js' },
  { name: 'ECS_TASKS', path: 'src/data/tasks/ecsTasks.js' },
  { name: 'CLOUDFRONT_TASKS', path: 'src/data/tasks/cloudFrontTasks.js' },
  { name: 'GLOBAL_ACCELERATOR_TASKS', path: 'src/data/tasks/globalAcceleratorTasks.js' },
  { name: 'KMS_TASKS', path: 'src/data/tasks/kmsTasks.js' },
  { name: 'SECRETS_MANAGER_TASKS', path: 'src/data/tasks/secretsManagerTasks.js' },
  { name: 'MACIE_TASKS', path: 'src/data/tasks/macieTasks.js' },
  { name: 'GUARDDUTY_TASKS', path: 'src/data/tasks/guardDutyTasks.js' },
  { name: 'COGNITO_TASKS', path: 'src/data/tasks/cognitoTasks.js' },
  { name: 'MGN_TASKS', path: 'src/data/tasks/mgnTasks.js' },
  { name: 'DMS_TASKS', path: 'src/data/tasks/dmsTasks.js' },
  { name: 'SNOW_FAMILY_TASKS', path: 'src/data/tasks/snowFamilyTasks.js' },
  { name: 'STORAGE_GATEWAY_TASKS', path: 'src/data/tasks/storageGatewayTasks.js' },
  { name: 'DATASYNC_TASKS', path: 'src/data/tasks/dataSyncTasks.js' },
  { name: 'SITE_TO_SITE_VPN_TASKS', path: 'src/data/tasks/siteToSiteVpnTasks.js' },
  { name: 'DIRECT_CONNECT_TASKS', path: 'src/data/tasks/directConnectTasks.js' },
  { name: 'CLOUDWATCH_TASKS', path: 'src/data/tasks/cloudWatchTasks.js' },
  { name: 'CLOUDTRAIL_TASKS', path: 'src/data/tasks/cloudTrailTasks.js' },
  { name: 'CONFIG_TASKS', path: 'src/data/tasks/configTasks.js' },
  { name: 'ORGANIZATIONS_TASKS', path: 'src/data/tasks/organizationsTasks.js' },
  { name: 'KINESIS_TASKS', path: 'src/data/tasks/kinesisTasks.js' },
  { name: 'ROUTE53_TASKS', path: 'src/data/tasks/route53Tasks.js' },
  { name: 'AWS_BACKUP_TASKS', path: 'src/data/tasks/awsBackupTasks.js' }
];

let modulesModifiedCount = 0;
let tasksRepairedCount = 0;
let verificationPopulatedCount = 0;
let cleanupPopulatedCount = 0;

for (const mod of modules) {
  const filePath = path.resolve(mod.path);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Dynamically import module content
  const moduleUrl = `file:///${filePath.replace(/\\/g, '/')}`;
  const imported = await import(moduleUrl);
  const taskArray = imported[mod.name];

  let fileModified = false;

  for (const task of taskArray) {
    let taskModified = false;
    const vList = Array.isArray(task.verification) ? task.verification : [];
    const cList = Array.isArray(task.cleanup) ? task.cleanup : [];

    vList.forEach((item, idx) => {
      if (!item.text || item.text.trim().length === 0) {
        item.text = generateVerificationText(task, item, idx, vList.length);
        verificationPopulatedCount++;
        taskModified = true;
      }
    });

    cList.forEach((item, idx) => {
      if (!item.text || item.text.trim().length === 0) {
        item.text = generateCleanupText(task, item, idx, cList.length);
        cleanupPopulatedCount++;
        taskModified = true;
      }
    });

    if (taskModified) {
      tasksRepairedCount++;
      fileModified = true;
    }
  }

  if (fileModified) {
    modulesModifiedCount++;
    // Extract file header comment if present
    const headerMatch = fileContent.match(/^(\/\*\*[\s\S]*?\*\/)/);
    const header = headerMatch ? `${headerMatch[1]}\n\n` : '';
    const newContent = `${header}export const ${mod.name} = ${JSON.stringify(taskArray, null, 2)};\n`;
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }
}

console.log(`Task Repair Summary:`);
console.log(`- Modules modified: ${modulesModifiedCount}`);
console.log(`- Tasks repaired: ${tasksRepairedCount}`);
console.log(`- Verification entries populated: ${verificationPopulatedCount}`);
console.log(`- Cleanup entries populated: ${cleanupPopulatedCount}`);
