import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-13',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Encryption with AWS KMS',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB integrates with AWS Key Management Service (KMS) to encrypt data at rest across your entire cluster. When storage encryption is enabled, DocumentDB automatically encrypts data stored on cluster storage volumes, automated backups, manual snapshots, Read Replica data, and transaction logs using industry-standard AES-256 encryption.',
  whyItMatters: 'Using Customer Managed KMS Keys (CMKs) provides full control over encryption key policies, annual key rotation, and CloudTrail auditing for regulatory compliance (such as HIPAA, PCI-DSS, and SOC 2).',
  workplaceExample: 'A healthcare application creates an encrypted DocumentDB cluster specifying a Customer Managed KMS Key (`arn:aws:kms:us-east-1:123456789012:key/my-docdb-key`). All patient JSON document records and cluster backups are encrypted at rest automatically.',
  examFocus: 'SAA-C03 KMS Encryption rules for DocumentDB:\n- Storage encryption MUST be enabled when creating the cluster (cannot enable encryption on an existing unencrypted cluster).\n- Encrypts cluster storage, automated backups, snapshots, and read replicas.\n- To encrypt an unencrypted cluster: Take an unencrypted snapshot -> Copy snapshot specifying a KMS key -> Restore new cluster from encrypted snapshot.',
  keyPoints: [
    'Encrypts cluster storage, automated backups, snapshots, and logs using AES-256.',
    'Supports AWS-managed keys (`aws/docdb`) and Customer Managed KMS Keys (CMKs).',
    'Must be enabled at cluster creation time (immutable setting).',
    'Unencrypted clusters can be encrypted by snapshot copy and restore.',
    'Provides audit logging of key access via AWS CloudTrail.'
  ],
  commonMistake: 'Attempting to enable KMS encryption on an existing live unencrypted DocumentDB cluster directly. You must snapshot, copy with KMS encryption, and restore a new cluster.',
  example: 'Creating an Encrypted DocumentDB Cluster:\n`aws docdb create-db-cluster --db-cluster-identifier secure-cluster --engine docdb --storage-encrypted --kms-key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012`',
  sources: [
    { title: 'Encrypting Amazon DocumentDB Data at Rest', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/db-cluster-fault-tolerance.html' }
  ]
});
