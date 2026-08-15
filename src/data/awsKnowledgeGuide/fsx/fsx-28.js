import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-28',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx Encryption at Rest',
  status: 'ready',
  plainEnglish: 'Amazon FSx automatically encrypts data at rest across all file system storage volumes, SSD/HDD drives, caches, and backups using industry-standard XTS-AES-256 encryption. Encryption at rest is integrated with AWS Key Management Service (KMS), allowing you to use AWS-managed KMS keys or your own Customer Managed Keys (CMKs).',
  whyItMatters: 'Data security regulations (such as HIPAA, PCI-DSS, SOC 2, and GDPR) mandate that sensitive data stored on physical disks must be encrypted. FSx Encryption at Rest enforces hardware-level disk encryption without impacting application performance.',
  workplaceExample: 'A healthcare organization provisions an FSx for Windows file system specifying a Customer Managed KMS Key (`arn:aws:kms:us-east-1:123456789012:key/health-data-key`). All patient documents and backup snapshots are encrypted at rest with full CloudTrail audit logging.',
  examFocus: 'SAA-C03 Encryption at Rest Rules:\n- Encryption at rest is ALWAYS enabled on all Amazon FSx file systems.\n- Keys: Choice of AWS-managed key (`aws/fsx`) or Customer Managed Key (CMK) in AWS KMS.\n- Immutable: Key selection is specified at creation time and cannot be modified afterwards.\n- Encrypts file volumes, RAM caches, and all automated/manual backups in S3.',
  keyPoints: [
    'Automatically encrypts all data at rest using XTS-AES-256 encryption.',
    'Integrated with AWS KMS using AWS-managed keys or Customer Managed Keys (CMKs).',
    'Encryption is enabled automatically for all Amazon FSx file systems.',
    'Encrypts underlying storage disks, in-memory caches, and all S3 backups.',
    'Provides complete key usage auditing in AWS CloudTrail.'
  ],
  commonMistake: 'Attempting to change the KMS key of an existing Amazon FSx file system. Encryption key selection is immutable after file system creation.',
  example: 'Specifying KMS CMK at Creation via AWS CLI:\n`aws fsx create-file-system --file-system-type WINDOWS --storage-capacity 500 --kms-key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012`',
  sources: [
    { title: 'Data Encryption in Amazon FSx', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
