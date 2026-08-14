import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-6', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Tables, Items and Attributes', status: 'ready',
  plainEnglish: 'DynamoDB is a serverless NoSQL key-value and document database. A table holds items, and each item is a collection of attributes. Items in one table can have different non-key attributes, but every item must contain the attributes that form the table primary key.',
  whyItMatters: 'Flexible items let applications evolve without a traditional fixed relational schema, while the primary key provides predictable low-latency access at scale.',
  workplaceExample: 'A customer table stores profile items and preference items with different attributes, but every item includes the required customer key.',
  examFocus: 'A table is not a relational table with joins and foreign keys. DynamoDB access patterns and keys are designed before storing data. Each item has a 400 KB maximum size and primary-key attributes must be string, number, or binary scalar values.',
  keyPoints: ['Tables contain items.', 'Items contain attributes.', 'Non-key attributes can vary between items.', 'Primary keys uniquely identify items.', 'DynamoDB manages partitions and replication within a Region.'],
  commonMistake: 'Designing DynamoDB exactly like a normalized relational database and relying on joins that DynamoDB does not perform.',
  example: 'Store PK=CUSTOMER#42 and SK=PROFILE for the profile, then PK=CUSTOMER#42 and SK=ORDER#2026-001 for an order in a single-table design.',
  sources: [{ title: 'Core components of DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html' }, { title: 'DynamoDB constraints', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Constraints.html' }]
});
