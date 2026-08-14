import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-11',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Cluster Mode and Sharding',
  status: 'ready',
  plainEnglish: 'ElastiCache Cluster Mode enables sharding (partitioning) key-value data across multiple shards (up to 500 shards per cluster). In Cluster Mode Enabled, data is partitioned across 16,384 slot hashes across shards, allowing a single Redis/Valkey cluster to scale write throughput and memory capacity up to terabytes of RAM.',
  whyItMatters: 'A single Redis node is limited by the maximum RAM and vCPU of a single EC2 instance (e.g. 500 GB RAM). Cluster Mode Sharding removes single-node hardware limits by partitioning data horizontally across hundreds of nodes.',
  workplaceExample: 'An analytics platform requires 4 TB of in-memory cache capacity. Since a single node cannot hold 4 TB, they enable Cluster Mode Enabled with 10 shards (each containing 400 GB RAM and 2 replicas), achieving 4 TB of aggregate RAM and massive write throughput.',
  examFocus: 'SAA-C03 Cluster Mode Enabled vs Disabled:\n- Cluster Mode Disabled: 1 Shard total (1 Primary + up to 5 Replicas). Max memory limited to single node size (~500 GB).\n- Cluster Mode Enabled: Up to 500 Shards (each shard has 1 Primary + up to 5 Replicas). Aggregate memory scales to Terabytes; write throughput scales horizontally across shards.',
  keyPoints: [
    'Cluster Mode Enabled partitions data across up to 500 shards using 16,384 hash slots.',
    'Scales BOTH write throughput and in-memory storage capacity horizontally.',
    'Each shard contains 1 Primary and up to 5 Read Replicas.',
    'Cluster Mode Disabled is limited to 1 primary node and max ~500 GB RAM.',
    'Requires a cluster-aware Redis/Valkey client library.'
  ],
  commonMistake: 'Selecting Cluster Mode Disabled for a workload that requires 2 TB of in-memory storage. Cluster Mode Disabled cannot scale beyond a single primary node (~500 GB).',
  example: 'Cluster Mode Configuration:\nShards: 4 | Replicas per Shard: 2 | Total Nodes: 12 (4 Primary + 8 Replicas) | Total Storage: 1.6 TB RAM.',
  sources: [
    { title: 'Work with Sharding in ElastiCache', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Sharding.html' }
  ]
});
