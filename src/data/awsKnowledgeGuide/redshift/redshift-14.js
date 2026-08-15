import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-14',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift COPY from Amazon S3',
  status: 'ready',
  plainEnglish: 'The SQL `COPY` command is the fastest, most efficient method for bulk loading high-volume datasets into Amazon Redshift tables. The `COPY` command reads data files (CSV, JSON, Parquet, ORC, Avro) directly from an Amazon S3 bucket, leveraging Redshift Massively Parallel Processing (MPP) to load data in parallel across all compute node slices simultaneously.',
  whyItMatters: 'Using single-row SQL `INSERT` statements to load millions of records takes hours or days and creates massive Leader Node overhead. The `COPY` command loads millions of rows in seconds by utilizing parallel S3 ingestion.',
  workplaceExample: 'An ETL pipeline outputs 32 GZIP CSV files into an S3 bucket (`s3://my-bucket/logs/`). Executing a single `COPY` SQL command instructs all 32 compute slices to stream and parse their assigned CSV file concurrently, loading 50 million rows in 15 seconds.',
  examFocus: 'SAA-C03 COPY Command Best Practices:\n- File Splitting Rule: Split source data into multiple compressed files (matching a multiple of your total compute slices, e.g. 16, 32, 64 files) to maximize parallel loading.\n- IAM Authorization: Use IAM Roles (`iam_role \'arn:aws:iam::...:role/RedshiftLoadRole\'`) rather than embedding hardcoded AWS credentials in SQL.\n- Format Support: Supports Parquet/ORC (fastest, column-aligned), CSV, TSV, JSON, and Avro.\n- Load Errors: Monitor the `STL_LOAD_ERRORS` system table to inspect failed load rows.',
  keyPoints: [
    'Primary scalable SQL command for high-speed bulk data ingestion into Redshift.',
    'Streams data files from Amazon S3 in parallel across compute node slices.',
    'Requires splitting input files to match the number of compute slices for max parallelism.',
    'Authorized using IAM Roles attached to the Redshift cluster.',
    'Failed rows and parsing errors are logged in the `STL_LOAD_ERRORS` system table.'
  ],
  commonMistake: 'Attempting to load a single massive 100 GB uncompressed CSV file using `COPY`. A single file forces a single compute slice to process the load serially.',
  example: 'Executing a Parallel COPY Command from S3:\nCOPY sales_fact FROM "s3://analytics-bucket/2026/sales_part_" IAM_ROLE "arn:aws:iam::123456789012:role/RedshiftS3ReadRole" FORMAT AS PARQUET;',
  sources: [
    { title: 'Loading data from Amazon S3 using COPY', url: 'https://docs.aws.amazon.com/redshift/latest/dg/t_Loading_data.html' }
  ]
});
