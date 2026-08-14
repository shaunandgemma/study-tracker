import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-13', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Strongly Consistent Reads', status: 'ready',
  plainEnglish: 'A strongly consistent read returns a response reflecting every successful write completed before that read. The client requests this behaviour with ConsistentRead where supported.',
  whyItMatters: 'Applications sometimes must read the latest committed value immediately, such as checking a lock or displaying a just-updated setting.',
  workplaceExample: 'After changing a critical account status, the application performs a strong read from the base table before allowing the next protected action.',
  examFocus: 'Strong reads cost twice the capacity of eventual reads and are supported on tables and local secondary indexes, but not global secondary indexes. Global-table consistency depends on the configured global table consistency model and Region behaviour.',
  keyPoints: ['Strong reads return the latest successful write.', 'They consume more read capacity than eventual reads.', 'GetItem, Query, and Scan can request consistency where supported.', 'GSIs do not support strongly consistent reads.', 'Strong consistency does not make multiple separate writes atomic.'],
  commonMistake: 'Requesting ConsistentRead from a global secondary index and expecting it to work.',
  example: 'Read the base-table item strongly when immediate confirmation is essential; use eventual consistency for ordinary high-volume catalogue browsing.',
  sources: [{ title: 'DynamoDB read consistency', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html' }, { title: 'Read and write operations', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html' }]
});
