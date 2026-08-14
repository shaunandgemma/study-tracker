import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-6',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Primary and Replica Instances',
  status: 'ready',
  plainEnglish: 'A DocumentDB cluster has two types of compute instances:\n- Primary Instance: Exactly one instance that supports both read and write operations (`read-write`). It writes transaction logs directly to the shared cluster storage volume.\n- Replica Instances: Up to 15 instances dedicated exclusively to read operations (`read-only`). They read from the same shared cluster storage volume and serve as failover targets if the Primary fails.',
  whyItMatters: 'Separating read and write responsibilities allows heavy analytics or user search queries to execute on Read Replicas without impacting primary write throughput.',
  workplaceExample: 'An IoT fleet platform runs 1 Primary DocumentDB instance to ingest telemetry writes from thousands of devices. They provision 4 Read Replicas to power customer analytics dashboards, eliminating read contention on the primary.',
  examFocus: 'SAA-C03 Primary vs Replica instance roles:\n- Primary Instance: Only 1 per cluster; supports read and write operations.\n- Replica Instances: Up to 15 per cluster; supports read-only operations.\n- Both Primary and Replicas connect to the same shared cluster storage volume.',
  keyPoints: [
    'Cluster consists of 1 Primary (read-write) and up to 15 Replicas (read-only).',
    'Primary receives all write requests and logs them to shared storage.',
    'Replicas serve read-only traffic and act as automatic failover candidates.',
    'Replicas can be placed across multiple Availability Zones for Multi-AZ resilience.',
    'All instances share the underlying distributed 6-way storage volume.'
  ],
  commonMistake: 'Attempting to execute an `insert` or `update` write query while connected to a Read Replica instance endpoint. Write operations are allowed strictly on the Primary instance.',
  example: 'Querying Instance Roles in Cluster:\n`aws docdb describe-db-clusters --db-cluster-identifier prod-cluster` -> Lists `IsClusterWriter: true` for Primary and `IsClusterWriter: false` for Replicas.',
  sources: [
    { title: 'Amazon DocumentDB Concepts', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/how-it-works.html' }
  ]
});
