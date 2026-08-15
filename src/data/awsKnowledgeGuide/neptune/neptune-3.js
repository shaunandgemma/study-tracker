import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-3',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Managed Graph Database',
  status: 'ready',
  plainEnglish: 'Amazon Neptune is a fully managed, high-performance graph database service optimized for storing and querying highly connected datasets. AWS manages cluster provisioning, storage scaling (up to 128 TiB per cluster), software patching, automated multi-AZ backups, and fault-tolerant storage replication across 3 Availability Zones.',
  whyItMatters: 'Self-hosting graph engines (like Neo4j or JanusGraph) requires complex cluster management, manual index tuning, and custom replication setups. Neptune offloads operational management while delivering ACID-compliant graph database performance.',
  workplaceExample: 'A enterprise media company deploys an Amazon Neptune database cluster. AWS manages storage auto-scaling as recommendation data grows from 500 GB to 10 TB, maintaining sub-second query performance without manual database tuning.',
  examFocus: 'SAA-C03 Core Neptune Capabilities:\n- Managed Graph Service: Fully managed graph database supporting Gremlin, openCypher, and SPARQL.\n- Cloud-Native Storage: Shared storage volume auto-scaling up to 128 TiB with 6-way replication across 3 AZs.\n- High Availability: 1 Primary Writer instance + up to 15 Low-Latency Read Replicas.\n- Security: VPC isolated, KMS encryption at rest, TLS in transit, IAM DB authentication.',
  keyPoints: [
    'Fully managed graph database engine supporting Property Graphs and RDF.',
    'Storage automatically scales up to 128 TiB per cluster in 10 GB increments.',
    'Supports 1 Primary Writer instance and up to 15 Low-Latency Read Replicas.',
    'Provides ACID compliance for graph read and write transactions.',
    'Native security with Amazon VPC isolation, KMS encryption, and IAM DB Auth.'
  ],
  commonMistake: 'Selecting Amazon RDS or DynamoDB for highly connected graph data models that require 4+ hop relationship traversals, resulting in complex, slow SQL joins.',
  example: 'Creating a Neptune Database Cluster via AWS CLI:\naws neptune create-db-cluster --db-cluster-identifier prod-neptune-cluster --engine neptune --engine-version 1.3.0.0 --storage-encrypted --kms-key-id arn:aws:kms:us-east-1:<ACCOUNT_ID>:key/<KEY_ID>',
  sources: [
    { title: 'What is Amazon Neptune?', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/intro.html' }
  ]
});
