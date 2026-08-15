import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-12',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Data Catalog with Athena',
  status: 'ready',
  plainEnglish: 'Amazon Athena uses the AWS Glue Data Catalog as its central, out-of-the-box metadata store for running serverless SQL queries directly against data files in Amazon S3. When an AWS Glue Crawler populates tables in the Glue Data Catalog, those tables instantly become queryable in Amazon Athena using standard ANSI SQL without moving or copying data.',
  whyItMatters: 'Using the Glue Data Catalog with Athena decouples storage from query compute. Millions of raw files sitting in S3 can be queried on demand with SQL, eliminating the cost and complexity of loading data into an operational relational database.',
  workplaceExample: 'A security team streams CloudTrail log files into an S3 bucket. A Glue Crawler catalogs the log schema in the Glue Data Catalog. Security analysts open Amazon Athena and immediately execute SQL queries (`SELECT * FROM cloudtrail_logs WHERE eventName = "ConsoleLogin"`) to investigate security incidents.',
  examFocus: 'SAA-C03 Athena and Glue Data Catalog Integration:\n- Athena automatically uses the AWS Glue Data Catalog as its primary metastore in supported regions.\n- Query execution is serverless; you pay only for bytes scanned by Athena SQL queries.\n- Cost Optimization: Partitioning S3 data (e.g. `/year=2026/month=08/`) and creating Partition Indexes in the Glue Data Catalog reduces S3 bytes scanned by Athena by up to 99%.',
  keyPoints: [
    'Athena uses the AWS Glue Data Catalog as its default SQL metadata metastore.',
    'Allows running ANSI SQL queries directly against Amazon S3 objects.',
    'Decouples serverless SQL query execution from S3 data storage.',
    'Partitioning tables in Glue Data Catalog reduces Athena data scan costs.',
    'Supports open data formats like Parquet, ORC, JSON, CSV, and Avro.'
  ],
  commonMistake: 'Running un-partitioned Athena SQL queries over petabytes of raw S3 JSON files without converting data to Parquet or filtering by Glue Data Catalog partition keys, leading to massive query scan charges.',
  example: 'Executing an Athena Query against a Glue Data Catalog Table:\nSELECT user_id, COUNT(*) FROM analytics_db.clickstream_logs WHERE year = "2026" GROUP BY user_id;',
  sources: [
    { title: 'Using Amazon Athena with the AWS Glue Data Catalog', url: 'https://docs.aws.amazon.com/athena/latest/ug/glue-athena.html' }
  ]
});
