import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-28',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift vs Amazon Athena',
  status: 'ready',
  plainEnglish: 'Amazon Redshift and Amazon Athena are both analytical query solutions on AWS, but they target different architectural operational models:\n- Amazon Redshift: Dedicated petabyte-scale data warehouse (provisioned or Serverless) designed for complex BI queries, high concurrency, sub-second query performance, and enterprise data marts.\n- Amazon Athena: Serverless, pay-per-query interactive query engine that executes ANSI SQL directly against S3 data files (CSV, Parquet, JSON) with zero setup or infrastructure management.',
  whyItMatters: 'Choosing Athena avoids cluster costs for infrequent, ad-hoc queries over S3 data lakes. Choosing Redshift is required when you need high-speed BI reporting, strict workload management (WLM), materialised views, and complex enterprise data warehousing.',
  workplaceExample: 'A data science team uses Amazon Athena to run occasional ad-hoc exploratory queries over S3 log buckets. Meanwhile, the executive team uses Amazon Redshift for sub-second, daily QuickSight dashboard reporting.',
  examFocus: 'SAA-C03 Decision Matrix (Redshift vs Athena):\n- Infrastructure Setup: Redshift requires provisioned clusters or Serverless workgroups; Athena is 100% serverless with zero cluster setup.\n- Pricing Model: Redshift charges for provisioned instance/RPU hours; Athena charges $5 per TB of data scanned from S3.\n- Query Latency: Redshift provides sub-second execution via local caching and sort keys; Athena query latency varies by S3 file count.\n- Hybrid Queries: Redshift Spectrum allows querying S3 like Athena while keeping hot data local.',
  keyPoints: [
    'Amazon Redshift is a dedicated enterprise data warehouse for sub-second BI reporting.',
    'Amazon Athena is a serverless, pay-per-query SQL engine for ad-hoc S3 data lake queries.',
    'Use Athena for ad-hoc exploration over S3 without managing database infrastructure.',
    'Use Redshift for continuous BI dashboards, complex joins, WLM queues, and materialised views.',
    'Athena charges per TB scanned; Redshift charges per provisioned node or RPU hour.'
  ],
  commonMistake: 'Provisioning a 24/7 Redshift cluster for running rare weekly ad-hoc queries over S3 logs that could be queried for pennies using Athena.',
  example: 'Selection Guide Summary:\n- "Ad-hoc SQL query over S3 log bucket once a week" -> Amazon Athena\n- "24/7 enterprise BI dashboards with 500 concurrent analysts" -> Amazon Redshift (RA3 / Serverless)',
  sources: [
    { title: 'Comparing Amazon Redshift and Amazon Athena', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html' }
  ]
});
