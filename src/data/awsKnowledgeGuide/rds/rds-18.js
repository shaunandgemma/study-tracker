import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-18',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Encryption with AWS KMS',
  status: 'ready',
  plainEnglish: 'Amazon RDS Encryption at Rest secures database storage using industry-standard AES-256 keys managed by AWS Key Management Service (KMS). When enabled, RDS encrypts underlying DB storage volumes, automated backups, manual snapshots, Read Replicas, and temporary swap files seamlessly with zero performance overhead.',
  whyItMatters: 'Unencrypted database storage risks data exposure if physical disks or snapshots are compromised. KMS encryption satisfies strict regulatory frameworks (HIPAA, PCI-DSS, SOC 2, GDPR) by protecting database data at rest.',
  workplaceExample: 'An enterprise deploys a PostgreSQL RDS instance with KMS encryption using a Customer Managed Key (`alias/rds-financial-key`). All automated daily snapshots and cross-region copies inherit KMS encryption automatically.',
  examFocus: 'SAA-C03 Encryption at Rest Rules:\n- Initial Creation Rule: Encryption MUST be enabled during DB instance creation; you CANNOT convert an unencrypted running instance to encrypted directly.\n- Workaround for Unencrypted Instances: Take a manual snapshot -> Copy snapshot & select KMS Key -> Restore new DB instance from encrypted snapshot copy.\n- Replicas & Snapshots: Read Replicas and snapshots created from an encrypted instance inherit encryption using the same KMS key.',
  keyPoints: [
    'Encrypts database storage, automated backups, manual snapshots, and temporary files using KMS (AES-256).',
    'Must be selected during initial DB instance creation.',
    'Cannot enable encryption on an existing unencrypted DB instance directly.',
    'Workaround requires taking a snapshot, copying it with KMS encryption, and restoring a new instance.',
    'Integrated with AWS KMS for key rotation and CloudTrail audit logging.'
  ],
  commonMistake: 'Attempting to check a checkbox to enable KMS encryption on an existing unencrypted production database. You must use the snapshot copy/restore workflow.',
  example: 'Encrypting an Unencrypted Database Snapshot via AWS CLI:\naws rds copy-db-snapshot --source-db-snapshot-identifier unencrypted-snap --target-db-snapshot-identifier encrypted-snap-copy --kms-key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
  sources: [
    { title: 'Encrypting Amazon RDS resources', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html' }
  ]
});
