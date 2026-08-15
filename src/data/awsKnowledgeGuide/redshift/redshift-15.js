import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-15',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift UNLOAD to Amazon S3',
  status: 'ready',
  plainEnglish: 'The `UNLOAD` SQL command exports the query results of a Redshift SELECT statement directly to text, CSV, JSON, or column-optimized Apache Parquet files stored in an Amazon S3 bucket. Like `COPY`, `UNLOAD` executes in parallel, with each compute node slice writing its partition of the query results concurrently to S3.',
  whyItMatters: 'Exporting large analytical query outputs (gigabytes or terabytes) to client applications over JDBC/ODBC connections causes network timeouts. `UNLOAD` writes query results in parallel directly to S3 at ultra-high speed.',
  workplaceExample: 'An enterprise exports a monthly 50 GB aggregated dataset to share with an external machine learning team. Running `UNLOAD` writes Parquet files to an S3 bucket in 20 seconds, encrypted with AWS KMS.',
  examFocus: 'SAA-C03 UNLOAD Command Features:\n- Parallel Export: Each compute slice writes separate output files (e.g. `result_part_00`, `result_part_01`) to S3 in parallel.\n- Single File Option: Setting `PARALLEL OFF` forces writing a single contiguous output file (slower export speed).\n- Output Formats: CSV, TSV, JSON, Parquet (recommended for S3 data lake sharing).\n- Encryption: Encrypts exported S3 files using KMS keys (`KMS_KEY_ID`).',
  keyPoints: [
    'Exports Redshift SQL query results directly to Amazon S3 in parallel.',
    'Slices write output partitions concurrently (e.g. `output_part_0000_part_00`).',
    'Supports CSV, JSON, TSV, and Apache Parquet file formats.',
    'Encrypts exported S3 files using server-side KMS encryption.',
    'Optionally creates a manifest file (`MANIFEST`) listing generated S3 files.'
  ],
  commonMistake: 'Running `UNLOAD` with `PARALLEL OFF` on massive datasets, creating a single bottleneck file write that slows down the export.',
  example: 'Executing UNLOAD SQL Command to S3 in Parquet Format:\nUNLOAD (\'SELECT customer_id, SUM(amount) AS total FROM sales GROUP BY 1\') TO \'s3://analytics-exports-bucket/monthly_summary_\' IAM_ROLE \'arn:aws:iam::123456789012:role/RedshiftS3WriteRole\' FORMAT AS PARQUET KMS_KEY_ID \'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012\';',
  sources: [
    { title: 'Unloading data from Amazon Redshift to S3', url: 'https://docs.aws.amazon.com/redshift/latest/dg/r_UNLOAD.html' }
  ]
});
