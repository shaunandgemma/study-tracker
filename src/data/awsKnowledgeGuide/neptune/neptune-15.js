import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-15',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Encryption with AWS KMS',
  status: 'ready',
  plainEnglish: 'Amazon Neptune provides comprehensive data security using Encryption at Rest and Encryption in Transit:\n- Encryption at Rest: All underlying 6-way storage volumes, automated backups, snapshots, and logs are encrypted using AWS Key Management Service (KMS) keys (AWS Managed or Customer Managed Keys).\n- Encryption in Transit: HTTPS and WebSocket connections to Neptune endpoints enforce Transport Layer Security (TLS 1.2+).',
  whyItMatters: 'Enterprise compliance frameworks (HIPAA, PCI-DSS, SOC 2) require data encryption at rest and in transit. Neptune encrypts all data automatically without code modifications or query performance penalty.',
  workplaceExample: 'A healthcare analytics company enables Neptune Encryption at Rest using a Customer Managed KMS Key (`alias/neptune-patient-key`). Automatic key rotation is enabled in KMS, and HTTPS/WSS TLS encryption protects patient graph traversals over the network.',
  examFocus: 'SAA-C03 Encryption Requirements:\n- Encryption at Rest Enablement: Must be enabled during cluster creation; CANNOT be added to an existing unencrypted cluster directly.\n- Migration Path: To encrypt an existing unencrypted cluster, export a snapshot, copy the snapshot with KMS encryption enabled, and restore a new encrypted cluster.\n- Encryption in Transit: Enabled by default; enforces TLS 1.2+ for HTTPS/WSS endpoints.\n- KMS Key Options: Supports AWS Managed Keys (`aws/neptune`) or Customer Managed Keys (CMKs).',
  keyPoints: [
    'Encryption at Rest secures underlying cluster storage, snapshots, and backups.',
    'Uses AWS KMS with AWS Managed Keys or Customer Managed Keys (CMKs).',
    'Encryption at Rest MUST be specified during DB cluster creation.',
    'Encryption in Transit enforces TLS 1.2+ for HTTPS and WebSocket connections.',
    'To encrypt an unencrypted cluster, copy a snapshot with encryption enabled.'
  ],
  commonMistake: 'Attempting to modify an existing unencrypted Neptune cluster to enable KMS Encryption at Rest directly. Encryption at rest must be specified when the cluster is created.',
  example: 'Copying an Unencrypted Neptune Snapshot with KMS Encryption Enabled:\naws neptune copy-db-cluster-snapshot --source-db-cluster-snapshot-identifier unencrypted-snap --target-db-cluster-snapshot-identifier encrypted-snap --kms-key-id arn:aws:kms:us-east-1:<ACCOUNT_ID>:key/<KEY_ID>',
  sources: [
    { title: 'Encrypting Neptune data at rest', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/encrypt-data-at-rest.html' }
  ]
});
