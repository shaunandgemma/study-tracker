import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-7', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Partition Keys', status: 'ready',
  plainEnglish: 'A partition key is a primary-key attribute whose value is passed through an internal hash function to decide where an item is stored. In a table with only a partition key, every item must have a unique partition-key value.',
  whyItMatters: 'Partition-key choice controls data distribution and whether traffic spreads across DynamoDB storage partitions or concentrates on a hot key.',
  workplaceExample: 'An orders table uses a high-cardinality OrderId rather than a low-cardinality status such as PENDING, spreading requests across many key values.',
  examFocus: 'Choose high-cardinality keys that distribute both storage and activity. A partition key must be supplied exactly for efficient GetItem and Query access; Scan reads across the table and is less efficient.',
  keyPoints: ['The partition key determines data placement.', 'A simple primary key must be unique.', 'High cardinality generally improves distribution.', 'Low-cardinality or time-concentrated keys can become hot.', 'The application must know the exact partition-key value for Query.'],
  commonMistake: 'Using the current date as the partition key for all writes, sending the entire workload to one active key.',
  example: 'Instead of PK=2026-08-14 for every event, use a distributed value such as tenant plus a calculated shard when the access pattern supports it.',
  sources: [{ title: 'Core components of DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html' }, { title: 'Partition key design best practices', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html' }]
});
