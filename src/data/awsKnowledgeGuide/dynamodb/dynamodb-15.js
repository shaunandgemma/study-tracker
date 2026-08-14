import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-15', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Global Secondary Indexes', status: 'ready',
  plainEnglish: 'A global secondary index has a partition key and optional sort key that can differ from the base table primary key. DynamoDB stores the projected index data separately and updates it asynchronously when matching table items change.',
  whyItMatters: 'A GSI supports additional Query access patterns without scanning the entire base table.',
  workplaceExample: 'An orders table is keyed by OrderId, while a GSI uses CustomerId and OrderDate so the application can list one customer orders by date.',
  examFocus: 'GSIs can be added after table creation, span all partition-key values, use separate provisioned throughput in provisioned mode, and support eventual reads only. A sparse GSI contains only items that have its key attributes.',
  keyPoints: ['GSI keys can differ completely from the table key.', 'GSI updates are asynchronous.', 'GSI reads are eventually consistent.', 'Projected attributes determine available index data.', 'GSI key and throughput design can create its own hot partitions.'],
  commonMistake: 'Increasing base-table write capacity while an under-provisioned GSI is throttling index updates and table writes.',
  example: 'Use GSI1PK=CUSTOMER#42 and GSI1SK=2026-08-14#ORDER#7 to query customer orders in time order.',
  sources: [{ title: 'Global secondary indexes', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html' }, { title: 'Core components of DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html' }]
});
