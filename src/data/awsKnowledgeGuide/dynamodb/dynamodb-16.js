import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-16', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Local Secondary Indexes', status: 'ready',
  plainEnglish: 'A local secondary index keeps the same partition key as the base table but uses a different sort key. It provides an alternative ordering and range-query path within the same item collection.',
  whyItMatters: 'An LSI can answer a second sorted access pattern for related items while supporting strongly consistent reads.',
  workplaceExample: 'A forum table groups posts by ForumId. The table sort key orders by PostId, while an LSI sort key orders the same forum posts by LastUpdatedTime.',
  examFocus: 'LSIs must be defined when the table is created, share table throughput, and allow strong or eventual reads. They have the same partition key as the table and impose an item-collection size limit.',
  keyPoints: ['LSI partition key matches the table partition key.', 'Its sort key differs from the table sort key.', 'It must be created with the table.', 'It shares base-table throughput.', 'Strongly consistent LSI reads are supported.'],
  commonMistake: 'Planning to add an LSI to an existing production table later; use a GSI or redesign because an LSI cannot be added afterward.',
  example: 'Query one customer orders by created time through the table and by total value through an LSI using the same CustomerId partition key.',
  sources: [{ title: 'Local secondary indexes', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LSI.html' }, { title: 'Core components of DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html' }]
});
