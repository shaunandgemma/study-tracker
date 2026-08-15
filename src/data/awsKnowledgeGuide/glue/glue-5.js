import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-5',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Data Catalog',
  status: 'ready',
  plainEnglish: 'The AWS Glue Data Catalog is a centralized metadata repository that stores structural table definitions, column data types, schema definitions, and partition information about your datasets stored across AWS (such as Amazon S3 buckets, RDS databases, Redshift tables, or DynamoDB). Crucially, the Data Catalog stores metadata about your data, not the actual data files themselves.',
  whyItMatters: 'Without a central metadata catalog, analytics tools like Amazon Athena, Amazon Redshift Spectrum, and EMR would require re-parsing and hardcoding raw file schemas for every single query. The Glue Data Catalog provides a single Apache Hive-compatible metastore shared seamlessly across all AWS analytics services.',
  workplaceExample: 'A data engineering team stores terabytes of JSON log files in S3. They populate the Glue Data Catalog with a table metadata entry named `web_logs`. Analytics users run SQL queries against `web_logs` in Amazon Athena without needing to understand underlying S3 file paths or JSON schemas.',
  examFocus: 'SAA-C03 Core Concept for Glue Data Catalog:\n- Centralized, Apache Hive-metastore-compatible metadata repository.\n- Stores table definitions, column types, and partition locations (does NOT store actual payload data).\n- Used as the shared metadata index by Amazon Athena, Amazon Redshift Spectrum, EMR, and AWS Lake Formation.\n- Includes Partition Indexes to optimize query scanning speed.',
  keyPoints: [
    'Centralized metadata index storing database, table, and partition schema definitions.',
    'Apache Hive metastore compatible for seamless integration with AWS analytics engines.',
    'Stores metadata descriptions, not the underlying raw data payload files.',
    'Enables unified SQL querying across Amazon S3 data lakes via Athena and Redshift Spectrum.',
    'Integrates with AWS Lake Formation for column- and row-level access control.'
  ],
  commonMistake: 'Believing the Glue Data Catalog copies or ingests the actual raw data files. The Data Catalog stores pointers and structural schema definitions; raw files remain in S3, RDS, or Redshift.',
  example: 'Querying Data Catalog Table Metadata via AWS CLI:\n`aws glue get-table --database-name analytics_db --name web_logs`',
  sources: [
    { title: 'Populating the AWS Glue Data Catalog', url: 'https://docs.aws.amazon.com/glue/latest/dg/populate-data-catalog.html' }
  ]
});
