import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-6',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache for Redis OSS',
  status: 'ready',
  plainEnglish: 'Amazon ElastiCache for Redis OSS is a fully managed in-memory data store supporting open-source Redis engines. Unlike basic key-value caches, Redis supports complex data structures (Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, HyperLogLogs, Geospatial indexes, and Streams), data persistence via snapshots, replication, and automatic Multi-AZ failover.',
  whyItMatters: 'Redis is far more than a simple cache; its rich data structures allow engineers to build high-performance features—like real-time gaming leaderboards, Pub/Sub message brokers, rate limiters, and geospatial search—entirely in memory.',
  workplaceExample: 'A financial trading platform uses ElastiCache for Redis OSS. They use Redis Sorted Sets (`ZADD`, `ZRANGE`) to calculate and serve financial market order book rankings in under 0.2 milliseconds.',
  examFocus: 'SAA-C03 Redis vs Memcached distinction:\n- Redis: Supports complex data structures (Lists, Sets, Hashes), Multi-AZ replication, automatic failover, data persistence (snapshots), Cluster Mode sharding, and Pub/Sub.\n- Memcached: Simple pure key-value cache, multi-threaded CPU architecture, no replication, no persistence, no failover (data lost on node restart).',
  keyPoints: [
    'Fully managed Redis engine supporting advanced in-memory data structures.',
    'Supports Multi-AZ deployment with automatic primary node failover.',
    'Supports data persistence and backup snapshots (RDB files).',
    'Supports Read Replicas (up to 5 per shard) and Cluster Mode sharding (up to 500 shards).',
    'Supports Pub/Sub messaging and geospatial indexing.'
  ],
  commonMistake: 'Choosing Memcached for a workload requiring high availability and failover. Memcached does NOT support replication or automatic failover; Redis or Valkey is required for high availability.',
  example: 'Redis CLI Command Example:\n`ZADD leaderboard 1500 "player_user_99"` (Inserts score into in-memory sorted set).\n`ZREVRANGE leaderboard 0 9 WITHSCORES` (Fetches top 10 players instantly).',
  sources: [
    { title: 'Amazon ElastiCache for Redis', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html' }
  ]
});
