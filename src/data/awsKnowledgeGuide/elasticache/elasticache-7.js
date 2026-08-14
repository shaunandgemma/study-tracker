import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-7',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache for Memcached',
  status: 'ready',
  plainEnglish: 'Amazon ElastiCache for Memcached is a fully managed, pure memory object caching service compatible with Memcached protocol. It uses a multi-threaded architecture designed for simple key-value caching where data durability, replication, and failover are not required. Memcached scales horizontally by adding or removing cache nodes across multiple Availability Zones in a cluster.',
  whyItMatters: 'For large web applications requiring a high-throughput, multi-core key-value cache (e.g. caching HTML web page fragments or database query results), Memcached offers simpler horizontal node scaling and multi-threaded CPU efficiency.',
  workplaceExample: 'A publisher hosts a high-traffic news website. They use ElastiCache for Memcached with a cluster of 10 nodes to cache rendered HTML page fragments. Memcached auto-discovery spreads key-value reads across all 10 nodes effortlessly.',
  examFocus: 'SAA-C03 Memcached Architecture rules:\n- Pure in-memory key-value cache (strings and objects).\n- Multi-threaded CPU model (utilizes multiple vCPU cores per node).\n- No data persistence, no snapshots, no replication, no failover.\n- Scales horizontally by partitioning keys across multiple cache nodes (up to 20 nodes per cluster).\n- Ideal for simple key-value caching where cache loss does not impact application integrity.',
  keyPoints: [
    'Pure in-memory key-value caching engine.',
    'Multi-threaded architecture for high vCPU core utilization.',
    'No data persistence or snapshot capability (ephemeral in-memory only).',
    'No replication or automatic failover (node failure results in cache miss).',
    'Horizontal scaling via node partitioning and client auto-discovery.'
  ],
  commonMistake: 'Selecting Memcached for session state storage without an underlying database backup. If a Memcached node fails, all session data stored on that node is lost permanently.',
  example: 'Memcached Key-Value Operations:\n`set user_1001 0 3600 45` -> `JOHN` (Stores value with 3600 second expiration).\n`get user_1001` -> Returns `JOHN`.',
  sources: [
    { title: 'Amazon ElastiCache for Memcached', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/WhatIs.html' }
  ]
});
