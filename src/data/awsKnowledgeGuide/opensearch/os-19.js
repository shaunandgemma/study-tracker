import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-19',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'OpenSearch Serverless',
  status: 'ready',
  plainEnglish: 'OpenSearch Serverless is an on-demand, auto-scaling serverless configuration option for Amazon OpenSearch Service. It decouples compute (indexing and search engines) from storage (Amazon S3), automatically scaling OpenSearch Compute Units (OCUs) up or down based on workload traffic without requiring customer instance sizing or domain cluster management.',
  whyItMatters: 'Managing traditional OpenSearch domains requires estimating data node instance counts, monitoring JVM memory pressure, and configuring EBS storage sizes. OpenSearch Serverless eliminates all cluster management, auto-scaling seamlessly with zero idle instance costs.',
  workplaceExample: 'An event ticketing platform experiences unpredictable search spikes during flash sales. They create an OpenSearch Serverless Search Collection. OCUs scale automatically from 2 to 32 OCUs during sales and scale back down when traffic subsides.',
  examFocus: 'SAA-C03 Serverless Collection Types & Policies:\n- Collection Types: Search Collections, Time-Series Collections (Logs), and Vector Search Collections.\n- Decoupled Architecture: Decouples indexing compute, search compute, and S3-backed storage.\n- OpenSearch Compute Units (OCUs): Billing and capacity unit (1 OCU = 6 GB RAM + compute).\n- Policy Architecture: Security defined via Encryption Policies, Network Policies (VPC/Public), and Data Access Policies.',
  keyPoints: [
    'Serverless, auto-scaling deployment option for Amazon OpenSearch Service.',
    'Decouples compute (indexing/search OCUs) from durable Amazon S3 storage.',
    'Supports Collection Types: Search, Time-Series (Logs), and Vector Search.',
    'Scales OpenSearch Compute Units (OCUs) automatically based on query demand.',
    'Secured using separate Encryption, Network, and Data Access policies.'
  ],
  commonMistake: 'Expecting OpenSearch Serverless to use traditional provisioned domain cluster management APIs. Serverless uses collection endpoints governed by security policies.',
  example: 'Creating an OpenSearch Serverless Collection via AWS CLI:\naws opensearchserverless create-collection --name app-logs-collection --type TIMESERIES',
  sources: [
    { title: 'Amazon OpenSearch Serverless', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless.html' }
  ]
});
