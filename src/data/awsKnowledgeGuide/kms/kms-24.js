import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-24',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Integration with AWS Services',
  status: 'ready',
  plainEnglish: 'AWS KMS integrates natively with over 100+ AWS services (including Amazon S3, EBS, RDS, DynamoDB, Secrets Manager, CloudWatch Logs, Lambda, and SQS) to provide transparent server-side encryption. When you enable KMS encryption on an AWS service, the service uses envelope encryption behind the scenes to generate Data Encryption Keys, encrypt your data at rest, and manage decryption seamlessly.',
  whyItMatters: 'Native AWS service integration eliminates the need for developers to write custom encryption code. Selecting a KMS key in the console or CLI automatically secures disk volumes, database tables, object storage, and log streams.',
  workplaceExample: 'A financial institution mandates encryption across all AWS storage tiers. They configure S3 default bucket encryption with KMS (SSE-KMS), enable EBS volume encryption, enable RDS PostgreSQL storage encryption, and encrypt CloudWatch Log groups—all using Customer Managed KMS Keys.',
  examFocus: 'SAA-C03 AWS Service Integration Patterns:\n- Amazon S3: SSE-KMS (uses KMS key; generates audit logs in CloudTrail) vs SSE-S3 (uses AWS Owned Key).\n- Amazon EBS: Encrypts boot and data volumes, snapshots, and I/O traffic between host and volume.\n- Amazon RDS & DynamoDB: Encrypts underlying storage, automated backups, read replicas, and snapshots.\n- Amazon Secrets Manager: Encrypts stored secret values using a KMS key.',
  keyPoints: [
    'Integrates natively with 100+ AWS services for seamless server-side encryption.',
    'Uses envelope encryption transparently behind the scenes.',
    'Provides audited CloudTrail event logs for every service encryption/decryption request.',
    'Supports AWS Managed Keys (`aws/service`) and Customer Managed Keys.',
    'Secures data across storage (S3, EBS), databases (RDS, DynamoDB), logs, and secrets.'
  ],
  commonMistake: 'Expecting RDS storage encryption to be enabled on an existing unencrypted RDS database instance without snapshotting, copying with encryption, and restoring a new instance.',
  example: 'Enabling KMS Encryption on CloudWatch Log Group via AWS CLI:\naws logs create-log-group --log-group-name /aws/lambda/my-function --kms-key-id arn:aws:kms:us-east-1:<ACCOUNT_ID>:key/<KEY_ID>',
  sources: [
    { title: 'How AWS services use AWS KMS', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/service-integration.html' }
  ]
});
