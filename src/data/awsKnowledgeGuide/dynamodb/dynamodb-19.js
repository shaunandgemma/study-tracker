import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-19', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Accelerator - DAX', status: 'ready',
  plainEnglish: 'DynamoDB Accelerator is a managed, in-memory, DynamoDB-compatible cache deployed in a VPC. Applications use the DAX client and cluster endpoint to obtain microsecond response times for suitable cached read workloads.',
  whyItMatters: 'Read-heavy applications can reduce repeated table access and latency without maintaining a separate cache-aside implementation.',
  workplaceExample: 'A product service repeatedly reads popular catalogue items. DAX serves cached GetItem and Query results while writes pass through the cluster to DynamoDB.',
  examFocus: 'DAX is designed for DynamoDB read acceleration, not arbitrary Redis features. It supports eventual consistency for cached reads; strongly consistent reads pass through to DynamoDB and are not served from the cache. It does not improve write-heavy or unique-read workloads.',
  keyPoints: ['DAX is an in-memory DynamoDB cache.', 'It requires DAX-compatible application clients.', 'Clusters run within a VPC.', 'Cached reads are eventually consistent.', 'Multi-node clusters improve availability.'],
  commonMistake: 'Adding DAX when every request reads a different item once, providing little cache reuse and adding unnecessary cost.',
  example: 'Use DAX for a read-heavy catalogue with repeated keys; keep direct DynamoDB access where immediate strong consistency is required.',
  sources: [{ title: 'DynamoDB Accelerator', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html' }, { title: 'DAX consistency', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.consistency.html' }]
});
