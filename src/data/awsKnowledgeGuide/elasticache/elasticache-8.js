import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-8',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Redis or Valkey Replication',
  status: 'ready',
  plainEnglish: 'ElastiCache for Redis / Valkey Replication organizes cache nodes into a Replication Group consisting of one Primary (read-write) node and up to 5 Read Replica (read-only) nodes. Writes made to the primary node are asynchronously replicated to all read replicas in near-real-time.',
  whyItMatters: 'Replication accomplishes two major goals: it allows offloading read-heavy application traffic to read replicas, and it provides high availability failover targets if the primary node experiences hardware failure.',
  workplaceExample: 'An analytics dashboard uses an ElastiCache Redis replication group with 1 Primary node and 3 Read Replicas across 3 AZs. Write operations update user sessions on the Primary node, while 3 Read Replicas handle concurrent dashboard visualization reads.',
  examFocus: 'SAA-C03 Replication Group rules:\n- 1 Primary (read-write) node per shard.\n- Up to 5 Read Replicas (read-only) per shard.\n- Asynchronous replication from Primary to Replicas.\n- Replicas should be placed in different Availability Zones for Multi-AZ fault tolerance.',
  keyPoints: [
    'Replication group consists of 1 Primary and up to 5 Read Replicas per shard.',
    'Asynchronous data replication from primary to replicas.',
    'Replicas handle read-only query workloads.',
    'Cross-AZ replica placement ensures Multi-AZ high availability.',
    'Supports automatic promotion of a replica to primary during failover.'
  ],
  commonMistake: 'Attempting to configure multi-node replication in ElastiCache for Memcached. Memcached does NOT support replication; replication is exclusive to Redis and Valkey engines.',
  example: 'Replication Group Topology:\nPrimary Node: `cache-001` (AZ: `us-east-1a`, Read-Write)\nReplica Node 1: `cache-002` (AZ: `us-east-1b`, Read-Only)\nReplica Node 2: `cache-003` (AZ: `us-east-1c`, Read-Only).',
  sources: [
    { title: 'High Availability with Replication Groups', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Replication.html' }
  ]
});
