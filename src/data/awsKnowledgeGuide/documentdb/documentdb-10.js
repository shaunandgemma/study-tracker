import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-10',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Cluster and Reader Endpoints',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB provides three types of database endpoints to connect applications to the cluster:\n1. Cluster Endpoint: A single CNAME record that always connects to the current Primary DB instance (used for write & read operations).\n2. Reader Endpoint: A CNAME record that load-balances read-only queries across all available Read Replicas.\n3. Instance Endpoints: Direct endpoints that connect to a specific DB instance in the cluster (used for diagnostic queries or debugging).',
  whyItMatters: 'Using Cluster and Reader endpoints abstracts database topology away from application code. When failovers occur or replicas are added/removed, application connection strings remain unchanged.',
  workplaceExample: 'A web app configures two connection pools: Write operations connect to `docdb-prod.cluster-xyz.us-east-1.docdb.amazonaws.com` (Cluster Endpoint), while background report queries connect to `docdb-prod.cluster-ro-xyz.us-east-1.docdb.amazonaws.com` (Reader Endpoint).',
  examFocus: 'SAA-C03 Endpoint rules:\n- Cluster Endpoint (`...cluster-xyz...`): Always points to Primary instance. Handles writes.\n- Reader Endpoint (`...cluster-ro-xyz...`): Load balances across Read Replicas. Read-only.\n- During failover, Cluster Endpoint CNAME updates automatically to point to the new Primary.',
  keyPoints: [
    'Cluster Endpoint routes read/write connections to the active Primary instance.',
    'Reader Endpoint load-balances read-only traffic across all Read Replicas.',
    'Instance Endpoints provide direct connections to specific individual instances.',
    'DNS CNAME records update automatically during failover events.',
    'Decouples application code from underlying database instance identifiers.'
  ],
  commonMistake: 'Hardcoding individual Instance Endpoints in application connection strings, causing write failures when the Primary instance fails and a replica is promoted.',
  example: 'DocumentDB Connection Strings:\n- Primary Write Endpoint: `mongodb://user:pass@docdb-cluster.cluster-xyz.us-east-1.docdb.amazonaws.com:27017/db`\n- Read Replica Endpoint: `mongodb://user:pass@docdb-cluster.cluster-ro-xyz.us-east-1.docdb.amazonaws.com:27017/db`',
  sources: [
    { title: 'Understanding Amazon DocumentDB Endpoints', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/endpoints.html' }
  ]
});
