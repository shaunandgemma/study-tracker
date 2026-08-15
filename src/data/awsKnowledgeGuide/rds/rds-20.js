import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-20',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS IAM Database Authentication',
  status: 'ready',
  plainEnglish: 'RDS IAM Database Authentication allows application workloads (EC2 instances, Lambda functions, ECS tasks) to authenticate to Amazon RDS MySQL or PostgreSQL databases using IAM Roles and short-lived (15-minute) IAM authentication tokens instead of hardcoded database passwords.',
  whyItMatters: 'Embedding database passwords in application configuration files or environment variables creates credential leak risks. IAM DB Auth eliminates static database passwords, centralizing authentication control via AWS IAM policies.',
  workplaceExample: 'An AWS Lambda function accesses an RDS MySQL database. The Lambda function generates a temporary IAM authentication token using `aws rds generate-db-auth-token` and connects securely without needing a hardcoded DB password.',
  examFocus: 'SAA-C03 IAM Database Authentication Rules:\n- Authentication Token Lifetime: IAM auth tokens expire automatically after 15 minutes.\n- Supported Engines: RDS PostgreSQL, RDS MySQL, Amazon Aurora PostgreSQL, Amazon Aurora MySQL.\n- IAM vs SQL Permissions: IAM authentication handles database LOGIN authentication only; internal database authorization (SQL `GRANT SELECT`, table permissions) must still be configured inside the database engine.',
  keyPoints: [
    'Authenticates database connections using IAM roles and temporary 15-minute tokens.',
    'Eliminates hardcoded database passwords in application code and configuration files.',
    'Supported for RDS MySQL, RDS PostgreSQL, Aurora MySQL, and Aurora PostgreSQL.',
    'Handles authentication only; SQL authorization/permissions must still be configured in the database.',
    'Requires mapping IAM user/role principals to specific database account names.'
  ],
  commonMistake: 'Assuming IAM Database Authentication replaces database SQL permissions. An IAM token lets the user log in, but SQL `GRANT` statements must still dictate table access.',
  example: 'Generating a Temporary RDS IAM Auth Token via AWS CLI:\naws rds generate-db-auth-token --hostname prod-db.c123.us-east-1.rds.amazonaws.com --port 3306 --region us-east-1 --username app_user',
  sources: [
    { title: 'IAM database authentication for MariaDB, MySQL, and PostgreSQL', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html' }
  ]
});
