import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-27',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift vs Amazon RDS',
  status: 'ready',
  plainEnglish: 'Amazon Redshift and Amazon RDS serve fundamentally different database workloads on AWS:\n- Amazon Redshift: Fully managed OLAP (Online Analytical Processing) data warehouse built for complex aggregations, columnar storage, and analytical scanning across petabytes of historical data.\n- Amazon RDS / Aurora: Fully managed OLTP (Online Transactional Processing) relational databases built for high-frequency single-row reads/writes, transactional ACID compliance, and web application backends.',
  whyItMatters: 'Using RDS for complex analytical reporting causes severe locks and CPU spikes on web application databases. Using Redshift for single-row web app transactions results in high query latency and poor throughput.',
  workplaceExample: 'An e-commerce platform processes live customer orders on Amazon Aurora PostgreSQL (OLTP). Order records are periodically ingested into Amazon Redshift (OLAP), where business analysts run multi-year sales trends reports.',
  examFocus: 'SAA-C03 Architectural Decision Matrix (Redshift vs RDS):\n- OLAP Data Warehouse -> Amazon Redshift (Columnar storage, MPP, complex SQL aggregations).\n- OLTP Web Application DB -> Amazon RDS / Aurora (Row-based storage, high-volume single-row transactions).\n- Primary Keys: RDS strictly enforces primary key uniqueness constraints; Redshift primary keys are informational only (NOT enforced).',
  keyPoints: [
    'Amazon Redshift is an OLAP data warehouse for complex analytical aggregation queries.',
    'Amazon RDS / Aurora are OLTP relational engines for high-frequency single-row transactions.',
    'Redshift uses columnar storage and MPP; RDS uses row-based storage engines.',
    'RDS enforces primary key uniqueness; Redshift primary keys are informational only.',
    'Use RDS for web app backends; use Redshift for business intelligence and data warehousing.'
  ],
  commonMistake: 'Relying on Amazon Redshift to enforce unique primary key constraints, leading to duplicate records if ETL pipelines do not deduplicate data.',
  example: 'Use Case Selection Summary:\n- "High-frequency web app shopping cart inserts" -> Amazon Aurora / RDS\n- "5-year trend analysis across 500 million sales records" -> Amazon Redshift',
  sources: [
    { title: 'Amazon Redshift vs Amazon RDS', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html' }
  ]
});
