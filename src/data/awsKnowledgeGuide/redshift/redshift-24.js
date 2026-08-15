import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-24',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Encryption with AWS KMS',
  status: 'ready',
  plainEnglish: 'Amazon Redshift provides end-to-end data security using Encryption at Rest and Encryption in Transit:\n- Encryption at Rest: Uses AWS Key Management Service (KMS) to encrypt all underlying storage blocks, managed storage volumes, automated snapshots, and query temp blocks.\n- Encryption in Transit: Enforces TLS/SSL encryption for client JDBC/ODBC connections and inter-node cluster communications.',
  whyItMatters: 'Enterprise compliance frameworks (HIPAA, PCI-DSS, SOC 2) require data to be encrypted on disk and over the wire. Redshift KMS encryption protects sensitive corporate analytical data without degrading query performance.',
  workplaceExample: 'A healthcare analytics provider launches an encrypted Redshift cluster using a Customer Managed KMS Key (`alias/redshift-phi-key`). Automatic yearly KMS key rotation ensures HIPAA compliance for patient analytical data.',
  examFocus: 'SAA-C03 Redshift Security & KMS Rules:\n- Enabling Encryption: Can be enabled during cluster creation or added to an unencrypted cluster via a cluster modify operation (or snapshot copy).\n- Key Options: AWS Managed KMS Keys (`aws/redshift`) or Customer Managed KMS Keys (CMKs).\n- Hardware Security Modules: Supports AWS CloudHSM for direct key management.\n- JDBC/ODBC Enforcing: Enforce SSL in cluster parameter groups by setting `require_ssl = true`.',
  keyPoints: [
    'Encrypts cluster storage, managed storage, snapshots, and query temp data.',
    'Integrates natively with AWS Key Management Service (KMS) or AWS CloudHSM.',
    'Supports AWS Managed Keys (`aws/redshift`) or Customer Managed Keys (CMKs).',
    'Enforces TLS/SSL encryption in transit for client JDBC/ODBC database connections.',
    'Can be enabled on existing clusters via seamless automated cluster re-encryption.'
  ],
  commonMistake: 'Failing to set `require_ssl = true` in the cluster parameter group, allowing unencrypted client JDBC connections over public or private networks.',
  example: 'Modifying a Redshift Cluster to Enable KMS Encryption via AWS CLI:\naws redshift modify-cluster-iam-roles --cluster-identifier prod-cluster --encrypted --kms-key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
  sources: [
    { title: 'Amazon Redshift database encryption', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-db-encryption.html' }
  ]
});
