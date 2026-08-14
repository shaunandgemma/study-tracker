import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'doc-2',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Read Replicas (Up to 15 read replicas) & KMS Storage Encryption',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB supports scaling read-heavy JSON workloads by deploying up to 15 Read Replicas across multiple Availability Zones. Because all compute instances share the underlying distributed storage volume, replicas do not require separate storage replication, keeping replication lag extremely low (typically under 10 milliseconds). Furthermore, DocumentDB supports mandatory encryption at rest using AWS KMS Customer Managed Keys (CMKs) or AWS-managed keys.',
  whyItMatters: 'Scaling reads across 15 read replicas allows an application to handle millions of read requests per second. Using shared storage eliminates disk replication bottlenecks, while KMS encryption at rest satisfies enterprise compliance mandates.',
  workplaceExample: 'A gaming company runs a leaderboard database on DocumentDB. They launch 6 Read Replicas across 3 AZs. The single Primary instance handles player score updates, while read queries from millions of active mobile players are load-balanced across the 6 Read Replicas.',
  examFocus: 'SAA-C03 Read Replica & Encryption rules:\n- Up to 15 Read Replicas per DocumentDB cluster.\n- Replicas share the same underlying storage volume with the Primary (near-zero replication lag).\n- Read Replicas serve as failover targets for high availability.\n- Storage encryption is enabled at cluster creation using AWS KMS and CANNOT be disabled once created.',
  keyPoints: [
    'Supports up to 15 Read Replicas per cluster for massive read scaling.',
    'Replicas share the cluster storage volume, achieving sub-10ms replication lag.',
    'Replicas double as automatic failover targets in Multi-AZ setups.',
    'Encryption at rest uses AWS KMS (AES-256) and encrypts storage, snapshots, and logs.',
    'Encryption at rest must be enabled when creating the cluster.'
  ],
  commonMistake: 'Believing each DocumentDB Read Replica maintains its own separate copy of data disks. All instances in a DocumentDB cluster share the exact same underlying distributed storage volume.',
  example: 'DocumentDB Cluster Configuration:\nPrimary Instance: `docdb-master` (Write/Read)\nRead Replicas: `docdb-replica-1`, `docdb-replica-2`, ..., `docdb-replica-15` (Read-only, sub-10ms lag).',
  sources: [
    { title: 'Amazon DocumentDB High Availability and Replication', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/replication.html' }
  ]
});
