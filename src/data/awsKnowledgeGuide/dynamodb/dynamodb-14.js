import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-14', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Eventually Consistent Reads', status: 'ready',
  plainEnglish: 'An eventually consistent read can temporarily return an older value immediately after a successful write, but repeating the read after propagation normally returns the latest value. It is the default read behaviour for DynamoDB operations.',
  whyItMatters: 'Eventual reads provide lower read-capacity consumption and suit workloads where brief staleness is acceptable.',
  workplaceExample: 'A product catalogue uses eventual reads because a price-description update appearing moments later is acceptable and the workload benefits from lower read cost.',
  examFocus: 'For items up to 4 KB, two eventual reads per second use one RCU. GSIs support eventual consistency only. Do not use eventual reads when the business action requires immediate confirmation of the latest write.',
  keyPoints: ['Eventual consistency is the default.', 'A recent write may not appear immediately.', 'Eventual reads consume half the capacity of strong reads.', 'GSIs provide eventually consistent reads.', 'Retrying after propagation can return the latest value.'],
  commonMistake: 'Treating eventual consistency as data loss rather than a temporary possibility of reading an older replica value.',
  example: 'Use eventual reads for a high-volume public catalogue and strong reads for a critical same-Region state check that requires the newest committed value.',
  sources: [{ title: 'DynamoDB read consistency', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html' }, { title: 'Read and write operations', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html' }]
});
