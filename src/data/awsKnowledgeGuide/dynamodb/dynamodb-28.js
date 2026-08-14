import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-28', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Partition Key Design', status: 'ready',
  plainEnglish: 'Partition-key design begins with the application read and write access patterns. A strong key has enough distinct values and spreads activity so no small set of values receives most of the workload, while still allowing efficient Query and GetItem requests.',
  whyItMatters: 'DynamoDB performance depends more on key distribution and access patterns than on traditional server sizing.',
  workplaceExample: 'A high-volume event system uses a device identifier plus a calculated write shard instead of one date key, then queries the known shards in parallel for a time window.',
  examFocus: 'Prefer high-cardinality, evenly accessed keys. Write sharding can distribute a known hot logical key but adds read complexity. Avoid Scan for primary access patterns and design GSIs with the same distribution care as the table.',
  keyPoints: ['Start by listing required access patterns.', 'High-cardinality keys support distribution.', 'Traffic distribution matters as much as data distribution.', 'Write sharding spreads concentrated writes.', 'Each GSI needs its own effective key design.'],
  commonMistake: 'Choosing a key that looks unique in stored data but directs nearly all current traffic to one active value.',
  example: 'For high-rate orders by tenant, consider PK=TENANT#42#SHARD#3 and retain the shard calculation needed to read related records.',
  sources: [{ title: 'Partition key design best practices', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html' }, { title: 'Partitions and data distribution', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html' }, { title: 'Data modeling foundations', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/data-modeling-foundations.html' }]
});
