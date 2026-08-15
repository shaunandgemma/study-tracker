import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-16',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Spectrum',
  status: 'ready',
  plainEnglish: 'Amazon Redshift Spectrum is a feature of Redshift that enables you to execute ANSI SQL queries directly against exabytes of data stored in Amazon S3 data lakes without needing to load or transform the data into local Redshift cluster tables. Spectrum registers external schemas using an AWS Glue Data Catalog and scales compute workers dynamically to scan S3 files.',
  whyItMatters: 'Loading petabytes of historical data into Redshift clusters is expensive and time-consuming. Redshift Spectrum lets you keep historical log archives in cheap S3 storage while joining them seamlessly with hot local Redshift tables in a single SQL query.',
  workplaceExample: 'An enterprise keeps 30 days of active order data in local Redshift tables, while 5 years of historical web click logs stay in S3 as Parquet files. A single SQL query joins the local `orders` table with the external S3 `clicks` table via Redshift Spectrum.',
  examFocus: 'SAA-C03 Spectrum Architecture & Pricing:\n- Architecture: Redshift cluster Leader Node compiles the query and delegates S3 scanning to independent Redshift Spectrum worker fleets.\n- Data Catalog: Uses AWS Glue Data Catalog or Apache Hive metastore to define External Schemas and External Tables.\n- Billing Model: You pay per terabyte of data scanned by Spectrum (min 10 MB per query); optimize by using columnar formats (Parquet/ORC) and S3 partitioning.\n- Zero ETL Loading: Queries S3 data in-place without executing `COPY` data ingestion.',
  keyPoints: [
    'Queries data directly in Amazon S3 without loading it into Redshift cluster storage.',
    'Scales thousands of independent Spectrum compute workers to scan S3 data lakes.',
    'Uses AWS Glue Data Catalog to define External Schemas and External Tables.',
    'Allows joining local Redshift tables directly with external S3 tables in one SQL statement.',
    'Billed per terabyte of data scanned from S3 (reduced via Parquet/ORC compression).'
  ],
  commonMistake: 'Storing external S3 Spectrum files as uncompressed CSVs instead of partitioned Parquet files, resulting in 10x higher Spectrum query scanning costs.',
  example: 'Creating a Redshift Spectrum External Schema in SQL:\nCREATE EXTERNAL SCHEMA s3_datalake FROM DATA CATALOG DATABASE "analytics_catalog" IAM_ROLE "arn:aws:iam::123456789012:role/RedshiftSpectrumRole";\nSELECT COUNT(*) FROM s3_datalake.web_logs WHERE log_date = "2026-08-15";',
  sources: [
    { title: 'Getting started with Amazon Redshift Spectrum', url: 'https://docs.aws.amazon.com/redshift/latest/dg/c-getting-started-using-spectrum.html' }
  ]
});
