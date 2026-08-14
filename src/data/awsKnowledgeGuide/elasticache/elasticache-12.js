import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-12',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Memcached Horizontal Scaling',
  status: 'ready',
  plainEnglish: 'ElastiCache for Memcached achieves horizontal scaling by adding or removing cache nodes (up to 20 nodes per cluster) in a single cluster. Because Memcached does not use master-slave replication, key distribution across nodes is managed on the client side using Consistent Hashing via client auto-discovery.',
  whyItMatters: 'Adding or scaling out Memcached nodes increases overall cluster memory and packet throughput dynamically as application user traffic increases.',
  workplaceExample: 'An online publishing portal adds 5 additional Memcached nodes to its cluster during a global news event. The ElastiCache Auto Discovery library automatically detects the 5 new node endpoints and updates client-side hashing without restarting web servers.',
  examFocus: 'SAA-C03 Memcached Scaling mechanics:\n- Horizontal Scaling: Add or remove nodes (1 to 20 nodes per cluster).\n- Vertical Scaling: Change node instance type (e.g., `cache.m5.large` to `cache.m5.xlarge`).\n- Key Distribution: Managed by client-side consistent hashing (ElastiCache Auto Discovery).\n- Note: Adding/removing nodes causes a partial cache flush for keys mapped to modified nodes.',
  keyPoints: [
    'Scales horizontally by adding or removing nodes (up to 20 nodes per cluster).',
    'ElastiCache Auto Discovery automatically updates client node routing tables.',
    'Consistent hashing minimizes key redistribution when nodes are added or removed.',
    'Multi-threaded architecture utilizes multi-core hardware efficiently.',
    'Ideal for stateless, partitioned, high-throughput key-value caching.'
  ],
  commonMistake: 'Expecting Memcached to replicate data automatically across nodes when scaling out. Memcached partitions keys across nodes; it does not replicate keys.',
  example: 'Memcached Auto-Discovery endpoint URL:\n`my-cluster.xxxxxx.cfg.use1.cache.amazonaws.com:11211` (Discovers all 20 nodes dynamically).',
  sources: [
    { title: 'Managing Memcached Clusters', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/WhatIs.html' }
  ]
});
