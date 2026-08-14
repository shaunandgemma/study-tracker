import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-18', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Streams', status: 'ready',
  plainEnglish: 'DynamoDB Streams captures a time-ordered sequence of item-level changes in a table. Each record can include key information and optional old and new item images according to the selected stream view type, and records are retained for 24 hours.',
  whyItMatters: 'Streams let applications react asynchronously to database changes without placing notification logic in every writer.',
  workplaceExample: 'A Lambda function consumes order changes from a stream and maintains a separate analytics summary, while failed batches are retried according to the event-source mapping configuration.',
  examFocus: 'Streams record inserts, updates, and deletes and preserve order for modifications to a given item. Lambda integration is common. Design consumers for retries and duplicate processing; stream processing is not a synchronous transaction with the original write.',
  keyPoints: ['Streams capture item modification records.', 'Records are retained for 24 hours.', 'View type controls included old and new images.', 'Lambda can poll streams through an event-source mapping.', 'Consumers should be idempotent.'],
  commonMistake: 'Assuming one failed consumer means the original DynamoDB write is rolled back.',
  example: 'Enable NEW_AND_OLD_IMAGES, trigger Lambda, use the event ID for idempotency, and configure retry and failure handling for poison records.',
  sources: [{ title: 'Change data capture for DynamoDB Streams', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html' }, { title: 'Core components of DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html' }]
});
