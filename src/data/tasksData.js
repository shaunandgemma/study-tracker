/**
 * Central seed task repository for Hands-On Tasks & Guided AWS Labs.
 *
 * Note: Supabase is the primary production source of truth for task definitions.
 * This file serves as local seed data and fallback in development or offline mode.
 *
 * Strict Schema Rules:
 * - All IDs must be stable strings (e.g. 'task-saa-s3-versioning-001').
 * - No raw HTML strings inside task content fields.
 * - Structured arrays for concepts, steps, commands, verification, cleanup, etc.
 */

import { S3_TASKS } from './tasks/s3Tasks.js';
import { EC2_TASKS } from './tasks/ec2Tasks.js';
import { VPC_TASKS } from './tasks/vpcTasks.js';
import { IAM_TASKS } from './tasks/iamTasks.js';
import { ELB_TASKS } from './tasks/elbTasks.js';
import { AUTO_SCALING_TASKS } from './tasks/autoScalingTasks.js';
import { RDS_TASKS } from './tasks/rdsTasks.js';
import { AURORA_TASKS } from './tasks/auroraTasks.js';
import { DYNAMODB_TASKS } from './tasks/dynamoDbTasks.js';
import { ELASTICACHE_TASKS } from './tasks/elasticacheTasks.js';
import { REDSHIFT_TASKS } from './tasks/redshiftTasks.js';
import { LAMBDA_TASKS } from './tasks/lambdaTasks.js';
import { API_GATEWAY_TASKS } from './tasks/apiGatewayTasks.js';
import { STEP_FUNCTIONS_TASKS } from './tasks/stepFunctionsTasks.js';
import { EVENTBRIDGE_TASKS } from './tasks/eventBridgeTasks.js';
import { SQS_TASKS } from './tasks/sqsTasks.js';
import { SNS_TASKS } from './tasks/snsTasks.js';
import { ECR_TASKS } from './tasks/ecrTasks.js';
import { FARGATE_TASKS } from './tasks/fargateTasks.js';
import { ECS_TASKS } from './tasks/ecsTasks.js';
import { CLOUDFRONT_TASKS } from './tasks/cloudFrontTasks.js';
import { GLOBAL_ACCELERATOR_TASKS } from './tasks/globalAcceleratorTasks.js';
import { KMS_TASKS } from './tasks/kmsTasks.js';
import { SECRETS_MANAGER_TASKS } from './tasks/secretsManagerTasks.js';
import { MACIE_TASKS } from './tasks/macieTasks.js';
import { GUARDDUTY_TASKS } from './tasks/guardDutyTasks.js';
import { COGNITO_TASKS } from './tasks/cognitoTasks.js';
import { MGN_TASKS } from './tasks/mgnTasks.js';
import { DMS_TASKS } from './tasks/dmsTasks.js';
import { SNOW_FAMILY_TASKS } from './tasks/snowFamilyTasks.js';
import { STORAGE_GATEWAY_TASKS } from './tasks/storageGatewayTasks.js';
import { DATASYNC_TASKS } from './tasks/dataSyncTasks.js';
import { SITE_TO_SITE_VPN_TASKS } from './tasks/siteToSiteVpnTasks.js';
import { DIRECT_CONNECT_TASKS } from './tasks/directConnectTasks.js';
import { CLOUDWATCH_TASKS } from './tasks/cloudWatchTasks.js';
import { CLOUDTRAIL_TASKS } from './tasks/cloudTrailTasks.js';
import { CONFIG_TASKS } from './tasks/configTasks.js';
import { ORGANIZATIONS_TASKS } from './tasks/organizationsTasks.js';
import { KINESIS_TASKS } from './tasks/kinesisTasks.js';
import { ROUTE53_TASKS } from './tasks/route53Tasks.js';
import { AWS_BACKUP_TASKS } from './tasks/awsBackupTasks.js';

export const INITIAL_SEED_TASKS = [
  ...S3_TASKS,
  ...EC2_TASKS,
  ...VPC_TASKS,
  ...IAM_TASKS,
  ...ELB_TASKS,
  ...AUTO_SCALING_TASKS,
  ...RDS_TASKS,
  ...AURORA_TASKS,
  ...DYNAMODB_TASKS,
  ...ELASTICACHE_TASKS,
  ...REDSHIFT_TASKS,
  ...LAMBDA_TASKS,
  ...API_GATEWAY_TASKS,
  ...STEP_FUNCTIONS_TASKS,
  ...EVENTBRIDGE_TASKS,
  ...SQS_TASKS,
  ...SNS_TASKS,
  ...ECR_TASKS,
  ...FARGATE_TASKS,
  ...ECS_TASKS,
  ...CLOUDFRONT_TASKS,
  ...GLOBAL_ACCELERATOR_TASKS,
  ...KMS_TASKS,
  ...SECRETS_MANAGER_TASKS,
  ...MACIE_TASKS,
  ...GUARDDUTY_TASKS,
  ...COGNITO_TASKS,
  ...MGN_TASKS,
  ...DMS_TASKS,
  ...SNOW_FAMILY_TASKS,
  ...STORAGE_GATEWAY_TASKS,
  ...DATASYNC_TASKS,
  ...SITE_TO_SITE_VPN_TASKS,
  ...DIRECT_CONNECT_TASKS,
  ...CLOUDWATCH_TASKS,
  ...CLOUDTRAIL_TASKS,
  ...CONFIG_TASKS,
  ...ORGANIZATIONS_TASKS,
  ...KINESIS_TASKS,
  ...ROUTE53_TASKS,
  ...AWS_BACKUP_TASKS
];
