import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-13',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Data Catalog with Redshift Spectrum',
  status: 'ready',
  plainEnglish: 'Amazon Redshift Spectrum allows an Amazon Redshift data warehouse cluster to query data stored directly in Amazon S3 by referencing external tables defined in the AWS Glue Data Catalog. By registering your Glue Data Catalog database as an External Schema in Redshift, SQL queries executed in Redshift can seamlessly JOIN local Redshift data warehouse tables with exabytes of historical data lake files in S3.',
  whyItMatters: 'Keeping years of cold historical data inside local Redshift provisioned cluster SSD storage is expensive. Redshift Spectrum lets you keep hot transactional data in local Redshift storage while offloading historical cold data to S3, using the Glue Data Catalog to query both in a single SQL query.',
  workplaceExample: 'A retail company keeps 3 months of active sales data in Amazon Redshift local storage and 7 years of historical sales data in Amazon S3 as Parquet files. They create an External Schema in Redshift pointing to the Glue Data Catalog, allowing analysts to run a single SQL query joining active sales with 7-year historical S3 trends.',
  examFocus: 'SAA-C03 Redshift Spectrum Architecture:\n- Queries data directly in S3 without loading it into Redshift cluster storage.\n- Uses the AWS Glue Data Catalog to resolve external database schemas and table definitions.\n- Setup: `CREATE EXTERNAL SCHEMA ... FROM DATA CATALOG DATABASE "glue_db" IAM_ROLE "arn:aws:iam::..."`.\n- Enables hybrid data architecture: High-performance local Redshift storage + cost-effective S3 data lake.',
  keyPoints: [
    'Enables Amazon Redshift to query data in Amazon S3 using the Glue Data Catalog.',
    'Allows joining local Redshift warehouse tables with external S3 data lake files in one SQL query.',
    'Eliminates the cost of loading massive historical datasets into local Redshift SSD storage.',
    'Scales query execution across thousands of Redshift Spectrum compute workers in parallel.',
    'Supports columnar formats (Parquet, ORC) and partition pruning for fast performance.'
  ],
  commonMistake: 'Executing ETL scripts to load terabytes of cold historical archive data into Redshift local cluster storage instead of using Redshift Spectrum with the Glue Data Catalog.',
  example: 'Creating a Redshift External Schema using Glue Data Catalog:\nCREATE EXTERNAL SCHEMA s3_analytics FROM DATA CATALOG DATABASE "analytics_db" IAM_ROLE "arn:aws:iam::123456789012:role/RedshiftSpectrumRole" CREATE EXTERNAL DATABASE IF NOT EXISTS;',
  sources: [
    { title: 'Using Amazon Redshift Spectrum with the AWS Glue Data Catalog', url: 'https://docs.aws.amazon.com/redshift/latest/dg/c-using-spectrum.html' }
  ]
});
