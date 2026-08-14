import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-21', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Encryption', status: 'ready',
  plainEnglish: 'DMS uses AWS KMS keys to encrypt replication-instance storage and endpoint connection information. Supported target data, including S3 and Redshift scenarios, can use KMS-backed encryption, while SSL/TLS endpoint modes protect database connections in transit.',
  whyItMatters: 'A migration temporarily handles complete datasets and privileged connection information, so both stored migration state and network traffic need protection.',
  workplaceExample: 'A private migration uses a customer-managed symmetric KMS key, TLS verification for both database endpoints, Secrets Manager credentials, and VPC routing that avoids public exposure.',
  examFocus: 'At-rest encryption and in-transit encryption are separate. KMS key policies and grants must authorize DMS and approved readers. SSL modes and certificate behaviour vary by database engine; use verification modes rather than trusting any certificate when supported.',
  keyPoints: ['Replication storage and connection information are encrypted.', 'Custom KMS keys must be symmetric.', 'TLS protects endpoint connections.', 'S3 and Redshift targets have endpoint-specific encryption settings.', 'Network isolation complements encryption.'],
  commonMistake: 'Selecting an SSL mode that encrypts traffic but does not verify the server certificate, then assuming full identity validation is occurring.',
  example: 'Use a customer-managed key, grant only required DMS operations, import trusted certificates, test endpoint verification, and record key recovery ownership.',
  sources: [{ title: 'Security in AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html' }, { title: 'Data protection in AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.DataProtection.html' }, { title: 'Using SSL with AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.SSL.html' }]
});
