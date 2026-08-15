import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-1',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Real-Time Log Analytics, Application Search, & OpenSearch Dashboards (Kibana)',
  status: 'ready',
  plainEnglish: 'Amazon OpenSearch Service (formerly Amazon Elasticsearch Service) is a fully managed search and analytics engine derived from open-source Elasticsearch and Kibana. It enables real-time full-text search, log analytics, security information management (SIEM), and interactive data visualization using integrated OpenSearch Dashboards.',
  whyItMatters: 'Relational databases cannot perform sub-second full-text fuzzy searches or aggregate millions of log events per second. OpenSearch uses inverted indexes to index JSON documents, delivering lightning-fast search and real-time log monitoring.',
  workplaceExample: 'An e-commerce store streams application logs and catalog items into Amazon OpenSearch Service. Customers perform instant fuzzy searches for product names, while DevOps engineers monitor HTTP error spikes on OpenSearch Dashboards in real time.',
  examFocus: 'SAA-C03 Core OpenSearch Use Cases:\n- Full-Text Search: High-speed relevance search with fuzzy matching, auto-complete, and highlights.\n- Real-Time Log Analytics: Ingesting logs via Firehose or CloudWatch Logs for instant filtering.\n- OpenSearch Dashboards: Built-in visualization tool (formerly Kibana) for creating interactive graphs and dashboards.\n- OpenSearch vs Relational DBs: OpenSearch is an inverted-index search engine, NOT an ACID relational DB.',
  keyPoints: [
    'Fully managed open-source search and analytics suite derived from Elasticsearch and Kibana.',
    'Uses inverted indexes for sub-second full-text search and complex aggregations.',
    'Primary AWS service for real-time log analytics, SIEM, and application search.',
    'Includes OpenSearch Dashboards for interactive visual log analysis and monitoring.',
    'Supports seamless streaming ingestion from CloudWatch Logs and Kinesis Data Firehose.'
  ],
  commonMistake: 'Treating Amazon OpenSearch Service as a primary relational database replacement with ACID transactions and foreign key constraints. OpenSearch is a search and analytics engine.',
  example: 'Ingesting a JSON Document into an OpenSearch Index via REST API:\nPOST /products/_doc/101\n{\n  "title": "Wireless Noise Canceling Headphones",\n  "category": "Electronics",\n  "price": 199.99,\n  "in_stock": true\n}',
  sources: [
    { title: 'What is Amazon OpenSearch Service?', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html' }
  ]
});
