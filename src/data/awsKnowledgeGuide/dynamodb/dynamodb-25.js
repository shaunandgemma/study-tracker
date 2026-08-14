import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-25', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Encryption at Rest', status: 'ready',
  plainEnglish: 'DynamoDB encrypts table data at rest, including the base table, indexes, Streams, global-table replicas, and backups. Tables can use an AWS owned key, the AWS managed key for DynamoDB, or a customer-managed symmetric KMS key.',
  whyItMatters: 'Encryption protects stored data while key choice determines how much control, auditing, policy management, rotation ownership, and KMS cost the customer accepts.',
  workplaceExample: 'A regulated workload uses a customer-managed KMS key with tightly controlled key administrators and monitored decrypt usage.',
  examFocus: 'Encryption at rest is always available and does not replace TLS in transit or client-side field encryption. Customer-managed keys require correct key policy and availability; disabling or deleting a key can make table data inaccessible.',
  keyPoints: ['DynamoDB data is encrypted at rest.', 'Multiple KMS key ownership options exist.', 'Customer-managed keys provide policy and audit control.', 'TLS protects data in transit.', 'Client-side encryption can protect selected attributes before transmission.'],
  commonMistake: 'Scheduling deletion of a customer-managed key still used by a table and overlooking the resulting data-access risk.',
  example: 'Use the AWS owned key for simplicity or a customer-managed key when policy, separation and audit requirements justify the added management.',
  sources: [{ title: 'DynamoDB encryption at rest', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html' }, { title: 'DynamoDB data protection', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/data-protection.html' }]
});
