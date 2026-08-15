import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-6',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Crawlers',
  status: 'ready',
  plainEnglish: 'An AWS Glue Crawler is an automated program that connects to data stores (such as Amazon S3, JDBC databases, or DynamoDB), inspects the raw data structure using built-in or custom Classifiers, infers the schema (field names, column data types, partitions), and automatically creates or updates table metadata in the AWS Glue Data Catalog.',
  whyItMatters: 'Manually defining SQL table schemas and updating partition definitions for thousands of daily S3 log files is error-prone. Glue Crawlers automatically discover schema changes and new data partitions, keeping the Data Catalog up-to-date without human effort.',
  workplaceExample: 'An application team drops daily CSV reports into `s3://company-data-lake/sales/year=2026/month=08/`. A scheduled AWS Glue Crawler runs nightly at 01:00 AM, inspects the new S3 folder, discovers the new date partitions, and updates the `sales` table in the Glue Data Catalog.',
  examFocus: 'SAA-C03 Glue Crawler Behaviour:\n- Crawlers inspect data stores and populate/update the Glue Data Catalog.\n- Crawlers inspect data schemas; they DO NOT modify, transform, or rewrite underlying data files.\n- Classifiers: Evaluates data formats (JSON, CSV, Parquet, Avro, ORC, JDBC).\n- Schema Change Policy: Configured to update table definitions, add new partitions, or ignore schema drift.',
  keyPoints: [
    'Automates schema discovery and partition detection across S3, JDBC, and DynamoDB.',
    'Creates and updates database table metadata in the AWS Glue Data Catalog.',
    'Uses built-in or custom Classifiers to parse complex file formats (JSON, Parquet, CSV, Avro).',
    'Does NOT transform or rewrite the underlying raw data files.',
    'Schema Change Policies govern how crawlers handle new, modified, or deleted columns.'
  ],
  commonMistake: 'Expecting an AWS Glue Crawler to clean, format, or convert CSV data into Parquet. Crawlers only catalog schema metadata; Glue ETL Jobs perform data transformation.',
  example: 'Starting a Glue Crawler via AWS CLI:\n`aws glue start-crawler --name s3-sales-data-crawler`',
  sources: [
    { title: 'Defining Crawlers in AWS Glue', url: 'https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html' }
  ]
});
