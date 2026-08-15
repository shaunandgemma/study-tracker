import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-5',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Data Warehousing',
  status: 'ready',
  plainEnglish: 'Amazon Redshift is a fully managed, petabyte-scale cloud data warehouse optimized for Online Analytical Processing (OLAP). It enables organizations to execute complex SQL analytical queries, aggregations, and business intelligence (BI) reports across terabytes to petabytes of structured and semi-structured data.',
  whyItMatters: 'Relational databases (like MySQL or PostgreSQL) are designed for single-row transactional processing (OLTP). Running complex analytical aggregation queries across millions of historical rows on OLTP databases causes severe performance degradation. Redshift executes massive analytical scans in seconds.',
  workplaceExample: 'A retail enterprise streams 500 million daily transaction records into Amazon Redshift. Data analysts execute complex SQL queries aggregating sales by region and product category over 5 years, generating BI dashboards in under 3 seconds.',
  examFocus: 'SAA-C03 Core Redshift Architecture:\n- OLAP vs OLTP: Amazon Redshift is an OLAP data warehouse; use RDS/Aurora for OLTP transactional processing.\n- Scalability: Scales from gigabytes to petabytes using provisioned clusters or Redshift Serverless.\n- Storage Architecture: Uses columnar storage, data compression, and Massively Parallel Processing (MPP).\n- Integration: Native integration with S3, Glue Data Catalog, QuickSight, and EMR.',
  keyPoints: [
    'Fully managed cloud data warehouse built for Online Analytical Processing (OLAP).',
    'Handles complex SQL analytical queries across terabytes to petabytes of data.',
    'Uses columnar data storage and Massively Parallel Processing (MPP) architecture.',
    'Complements OLTP databases (RDS/Aurora) by offloading heavy reporting queries.',
    'Integrates natively with AWS QuickSight, S3, Glue, and EMR analytics pipelines.'
  ],
  commonMistake: 'Selecting Amazon Redshift as a primary transactional database for high-frequency web application inserts/updates. Use Amazon Aurora or RDS for OLTP workloads.',
  example: 'Creating a Redshift Cluster via AWS CLI:\naws redshift create-cluster --cluster-identifier prod-analytics-warehouse --node-type ra3.xlplus --master-username adminuser --master-user-password "SecurePass123!" --number-of-nodes 2',
  sources: [
    { title: 'What is Amazon Redshift?', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html' }
  ]
});
