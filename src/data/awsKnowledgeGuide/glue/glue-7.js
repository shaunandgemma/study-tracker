import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-7',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue ETL Jobs',
  status: 'ready',
  plainEnglish: 'An AWS Glue ETL Job is the business logic component of AWS Glue that performs actual data processing work. Glue ETL Jobs extract data from source stores (like S3 or JDBC databases), transform the data (filtering, joining, cleaning, converting file formats), and load the processed results into target stores (like S3 data lakes, Redshift, or Snowflake). Jobs can be written in PySpark, Scala, or Python shell.',
  whyItMatters: 'Raw data in operational databases is unoptimized, uncompressed, and dirty. Glue ETL Jobs clean and transform raw records into compressed columnar Parquet files, making analytical queries 100x faster and dramatically reducing S3 query costs.',
  workplaceExample: 'A data pipeline runs an AWS Glue PySpark job every hour. The job extracts 10 GB of raw nested JSON clickstream logs from S3, flattens the schema, filters out bot traffic, converts data to Snappy-compressed Parquet, and writes the output back to S3.',
  examFocus: 'SAA-C03 Glue Job Execution details:\n- Execution Engines: Apache Spark (PySpark/Scala), Python Shell, or Ray.\n- Job Bookmarks: Tracks previously processed S3 data to prevent re-processing state during incremental runs.\n- Worker Types: G.1X, G.2X, G.4X, G.8X, or Flex workers for cost-optimized non-urgent jobs.\n- Glue DynamicFrames: Specialized Spark DataFrames designed for flexible, un-enforced schemas.',
  keyPoints: [
    'Executes serverless data transformation scripts in PySpark, Scala, or Python.',
    'Performs Extract, Transform, and Load (ETL) or Extract, Load, and Transform (ELT) pipelines.',
    'Job Bookmarks maintain state to process incremental data loads without duplicate processing.',
    'Uses Glue DynamicFrames to handle semi-structured data with schema drift.',
    'Supports Flex execution workers for up to 35% cost savings on non-urgent batch jobs.'
  ],
  commonMistake: 'Failing to enable Job Bookmarks on an incremental daily Glue S3 ETL job, causing the job to re-process historical files from beginning to end on every run.',
  example: 'Starting a Glue ETL Job with Job Bookmarks Enabled:\n`aws glue start-job-run --job-name process-clickstream --arguments \'{"--job-bookmark-option":"job-bookmark-enable"}\'`',
  sources: [
    { title: 'Authoring Jobs in AWS Glue', url: 'https://docs.aws.amazon.com/glue/latest/dg/author-job.html' }
  ]
});
