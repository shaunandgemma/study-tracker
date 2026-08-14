import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-4',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Clusters',
  status: 'ready',
  plainEnglish: 'An Amazon DocumentDB Cluster consists of a shared cluster storage volume and zero to 16 DB instances (one Primary DB instance and up to 15 Read Replica DB instances). The cluster acts as a unified database deployment that exposes a Cluster Endpoint (for writes and reads) and a Reader Endpoint (for load-balancing read queries across replicas).',
  whyItMatters: 'Managing database instances as a cluster rather than isolated standalone servers simplifies endpoint management, automated failover, parameter groups, and backup management.',
  workplaceExample: 'An application connects to a DocumentDB cluster endpoint `docdb-cluster.cluster-xyz.us-east-1.docdb.amazonaws.com:27017`. If the primary database instance fails, DocumentDB promotes a replica to primary and updates the Cluster Endpoint DNS entry automatically.',
  examFocus: 'SAA-C03 Cluster components:\n- Cluster Storage Volume: Shared 6-way replicated storage across 3 AZs.\n- Primary DB Instance: Handles read/write operations (1 per cluster).\n- Read Replica DB Instances: Handles read-only queries (0 to 15 per cluster).\n- Cluster Endpoint: Always points to the current Primary instance.',
  keyPoints: [
    'Unified database container holding 1 Primary and up to 15 Read Replicas.',
    'Shares a single, fault-tolerant cluster storage volume across 3 AZs.',
    'Cluster Endpoint routes write/read traffic to the active Primary instance.',
    'Reader Endpoint load-balances read traffic across active Read Replicas.',
    'Automated cluster-wide parameter groups and security group controls.'
  ],
  commonMistake: 'Configuring application write queries to connect to an individual instance endpoint instead of the Cluster Endpoint. If that specific instance fails or undergoes failover, write operations will fail.',
  example: 'Creating a DocumentDB Cluster via AWS CLI:\n`aws docdb create-db-cluster --db-cluster-identifier prod-docdb-cluster --engine docdb --master-username adminuser --master-user-password MasterPassword123!`',
  sources: [
    { title: 'Amazon DocumentDB Clusters', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/how-it-works.html' }
  ]
});
