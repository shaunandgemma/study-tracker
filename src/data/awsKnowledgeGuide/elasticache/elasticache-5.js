import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-5',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache for Valkey',
  status: 'ready',
  plainEnglish: 'Amazon ElastiCache for Valkey is an open-source, fully managed in-memory datastore built as an open alternative to Redis. Valkey is fully drop-in compatible with Redis APIs and data structures (strings, hashes, lists, sets, sorted sets, streams, Pub/Sub), but offers significantly lower cost (at least 20% cheaper than Redis OSS) and higher price-performance.',
  whyItMatters: 'With recent licensing changes in open-source Redis, Valkey emerged as the Linux Foundation open-source continuation. AWS provides ElastiCache for Valkey with lower pricing, making it the recommended default choice for new Redis-style workloads.',
  workplaceExample: 'A gaming startup launches a new real-time leaderboard. Instead of choosing Redis OSS, they select ElastiCache for Valkey. They use standard Redis client libraries in Node.js while saving 20% on hourly cache node costs.',
  examFocus: 'SAA-C03 Valkey highlights:\n- Drop-in replacement for Redis OSS APIs and data structures.\n- Supported in ElastiCache Serverless and Provisioned node clusters.\n- 20%+ cheaper pricing compared to ElastiCache for Redis OSS.\n- Fully managed: automated patching, Multi-AZ failover, snapshots, and KMS encryption.',
  keyPoints: [
    'Fully managed in-memory data store powered by open-source Valkey.',
    '100% drop-in compatible with Redis OSS APIs, data structures, and client SDKs.',
    'At least 20% lower pricing than ElastiCache for Redis OSS.',
    'Supports complex data types (Hashes, Sorted Sets, Bitmaps, Geospatial, Pub/Sub).',
    'Recommended default engine by AWS for Redis-compatible caching.'
  ],
  commonMistake: 'Assuming migrating from Redis OSS to Valkey requires updating application code or SDK drivers. Valkey uses identical Redis protocol and client commands.',
  example: 'Creating a Valkey Cluster via AWS CLI:\n`aws elasticache create-replication-group --replication-group-id valkey-cluster --engine valkey --cache-node-type cache.m7g.xlarge`',
  sources: [
    { title: 'Amazon ElastiCache for Valkey', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html' }
  ]
});
