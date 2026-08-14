import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-10',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Read Replicas',
  status: 'ready',
  plainEnglish: 'ElastiCache Read Replicas are read-only copies of your primary Redis or Valkey cache node. Up to 5 read replicas can be added per shard to scale read query capacity horizontally and improve application throughput. Read operations can be directed specifically to replica endpoints or distributed via a Reader Endpoint CNAME.',
  whyItMatters: 'High-volume web applications often handle 10 to 100 times more read queries than write operations. Read Replicas prevent the primary node CPU from saturating by handling read-heavy query traffic across multiple nodes.',
  workplaceExample: 'A media streaming app uses an ElastiCache cluster with 1 Primary and 4 Read Replicas. User profile updates hit the primary, while millions of home feed recommendation reads are load-balanced across the 4 read replicas.',
  examFocus: 'SAA-C03 Read Replica rules:\n- Maximum of 5 Read Replicas per shard for Redis/Valkey.\n- Asynchronous data replication from Primary to Read Replicas.\n- Replicas serve read queries and act as automatic failover targets.\n- Read queries routed to replicas are eventually consistent.',
  keyPoints: [
    'Up to 5 read-only replica nodes per shard.',
    'Scales read throughput horizontally without scaling up primary node size.',
    'Asynchronous replication from primary node in near-real-time.',
    'Serves as automatic failover candidates in Multi-AZ configurations.',
    'Allows read-heavy workloads to achieve sub-millisecond query response.'
  ],
  commonMistake: 'Expecting write operations to succeed on a Read Replica endpoint. Write commands (like `SET` or `HSET`) sent to a read replica will return a `READONLY` error.',
  example: 'Connecting Redis Client to Read Endpoint:\n`primary_endpoint = "my-cluster.xxxxxx.ng.0001.use1.cache.amazonaws.com:6379"` (Writes)\n`reader_endpoint = "my-cluster-ro.xxxxxx.ng.0001.use1.cache.amazonaws.com:6379"` (Reads)',
  sources: [
    { title: 'High Availability with Replication Groups', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Replication.html' }
  ]
});
