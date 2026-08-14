import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-8', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Composite Primary Keys - Partition Key and Sort Key', status: 'ready',
  plainEnglish: 'A composite primary key contains a partition key and a sort key. Multiple items may share a partition-key value, but each must have a different sort-key value. Items in the same item collection are maintained in sort-key order.',
  whyItMatters: 'Composite keys model one-to-many relationships and let an application query a group of related items with range, prefix, and ordering conditions.',
  workplaceExample: 'A customer partition uses PK=CUSTOMER#42 and sort keys such as ORDER#2026-001 and ORDER#2026-002, allowing one query to return that customer orders in order.',
  examFocus: 'The combination of partition and sort key is unique. Query requires partition-key equality and can optionally filter the sort key with operators such as between or begins_with. Filter expressions occur after reading and do not replace good key design.',
  keyPoints: ['The full primary key is partition key plus sort key.', 'Items may share a partition key but not the same full key.', 'Sort keys order an item collection.', 'Sort-key prefixes can model hierarchical relationships.', 'Query can efficiently select a sort-key range.'],
  commonMistake: 'Expecting to Query using only a sort-key value without a partition-key value or suitable secondary index.',
  example: 'Query PK=DEVICE#7 with SK between READING#2026-08-01 and READING#2026-08-31 to retrieve one device monthly readings.',
  sources: [{ title: 'Core components of DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html' }, { title: 'DynamoDB data modeling building blocks', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/data-modeling-blocks.html' }]
});
