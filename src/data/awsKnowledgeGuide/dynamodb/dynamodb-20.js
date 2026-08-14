import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-20', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Time to Live - TTL', status: 'ready',
  plainEnglish: 'Time to Live lets a table designate one numeric attribute containing an expiration time in Unix epoch seconds. DynamoDB automatically deletes eligible expired items in the background, typically within a few days, without consuming write throughput for the originating TTL deletion.',
  whyItMatters: 'TTL removes temporary sessions, events, locks, and other ageing data without a custom deletion scheduler.',
  workplaceExample: 'A session item stores expiresAt as an epoch timestamp. The application treats the item as expired immediately at that time, while DynamoDB removes it later.',
  examFocus: 'TTL deletion is asynchronous and expired items can remain visible until removed, so applications must check the expiration attribute. A TTL delete appears in Streams as a service deletion. Replicated TTL deletes in current global tables consume replicated write capacity in replica Regions.',
  keyPoints: ['TTL uses epoch time in seconds.', 'Deletion is asynchronous rather than exact-time.', 'The initial TTL deletion does not consume table write throughput.', 'Applications should ignore logically expired items.', 'Streams can capture TTL deletion records.'],
  commonMistake: 'Using a formatted date string or milliseconds rather than a numeric Unix epoch value in seconds.',
  example: 'Set expiresAt to the required epoch second and filter expired records in application logic until the background deletion occurs.',
  sources: [{ title: 'DynamoDB Time to Live', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html' }, { title: 'DynamoDB data modeling building blocks', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/data-modeling-blocks.html' }]
});
