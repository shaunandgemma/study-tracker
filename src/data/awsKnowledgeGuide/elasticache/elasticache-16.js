import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-16',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Encryption at Rest',
  status: 'ready',
  plainEnglish: 'ElastiCache Encryption at Rest protects cached data stored on physical disks during swap file operations, backup snapshots, and sync operations using AWS Key Management Service (KMS). You can choose default AWS-managed KMS keys or specify your own Customer Managed Keys (CMK) in KMS.',
  whyItMatters: 'Memory swap files and persistent backup snapshots stored in S3 contain copy fragments of in-memory application data. Encrypting data at rest ensures compliance with HIPAA, PCI-DSS, and SOC 2 data protection standards.',
  workplaceExample: 'A healthcare company creates an ElastiCache cluster with Encryption at Rest enabled using a Customer Managed KMS Key (`arn:aws:kms:us-east-1:123456789012:key/my-cache-key`). All snapshots and disk swap files are encrypted automatically.',
  examFocus: 'SAA-C03 Storage Encryption details:\n- Encrypts disk swap files, RDB backup snapshots in S3, and engine sync logs.\n- Configured by setting `AtRestEncryptionEnabled=true` at cluster creation.\n- Supports AWS-managed keys or Customer Managed Keys (CMKs) in AWS KMS.\n- Cannot be enabled on an existing unencrypted cluster.',
  keyPoints: [
    'Encrypts disk swap files, backup snapshots, and sync logs using AWS KMS (AES-256).',
    'Supports AWS-managed keys and Customer Managed Keys (CMKs).',
    'Configured at replication group creation time (immutable setting).',
    'Meets healthcare (HIPAA) and financial (PCI-DSS) security compliance requirements.',
    'Provides full audit logging of KMS key usage in AWS CloudTrail.'
  ],
  commonMistake: 'Expecting to enable Encryption at Rest on a running unencrypted ElastiCache cluster. You must create a new encrypted replication group and migrate data.',
  example: 'Enabling Encryption at Rest via AWS CLI:\n`aws elasticache create-replication-group --replication-group-id secure-redis --at-rest-encryption-enabled --kms-key-id my-kms-key-arn`',
  sources: [
    { title: 'ElastiCache At-Rest Encryption', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/at-rest-encryption.html' }
  ]
});
