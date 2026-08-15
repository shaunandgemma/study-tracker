import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-16',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Encryption at Rest',
  status: 'ready',
  plainEnglish: 'Encryption at Rest in Amazon OpenSearch Service automatically encrypts underlying index data files, primary and replica shards, automated snapshots, swap files, and UltraWarm storage using AWS Key Management Service (KMS). You can choose AWS Managed Keys (`aws/es`) or Customer Managed Keys (CMKs).',
  whyItMatters: 'Industry security standards (HIPAA, PCI-DSS, SOC 2) require data to be encrypted when written to physical disk storage. OpenSearch Encryption at Rest prevents unauthorized physical disk extraction without impacting query latency.',
  workplaceExample: 'A bank configures an OpenSearch domain for customer transactions with Encryption at Rest using a Customer Managed KMS Key (`alias/opensearch-key`). Automated daily key rotation ensures enterprise KMS compliance.',
  examFocus: 'SAA-C03 Encryption Specifications:\n- Mandatory Enablement: Encryption at Rest MUST be enabled when the domain is created; it CANNOT be enabled on an existing unencrypted domain.\n- Covered Components: EBS volumes, UltraWarm storage, automated snapshots, swap files.\n- Migration Strategy: To encrypt an unencrypted domain, take a snapshot, create a new domain with encryption enabled, and restore the snapshot.',
  keyPoints: [
    'Encrypts index files, shards, snapshots, and UltraWarm storage on physical disk.',
    'Uses AWS Key Management Service (KMS) with AWS Managed or Customer Managed Keys.',
    'Must be specified during domain creation (cannot enable retroactively).',
    'Unencrypted domains require snapshot migration to enable encryption at rest.',
    'Essential for meeting enterprise security and compliance mandates (HIPAA, PCI).'
  ],
  commonMistake: 'Attempting to enable KMS Encryption at Rest on an existing running unencrypted OpenSearch domain via domain configuration update without snapshot migration.',
  example: 'Creating an Encrypted OpenSearch Domain via AWS CLI:\naws opensearch create-domain --domain-name secure-logs --engine-version OpenSearch_2.11 --encryption-at-rest-options Enabled=true,KmsKeyId=arn:aws:kms:us-east-1:<ACCOUNT_ID>:key/<KEY_ID>',
  sources: [
    { title: 'Encryption at rest for Amazon OpenSearch Service', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/encryption-at-rest.html' }
  ]
});
