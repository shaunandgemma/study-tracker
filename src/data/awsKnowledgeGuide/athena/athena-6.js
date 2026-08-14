import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-6",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena Integration with AWS Glue Data Catalog",
  "status": "ready",
  "plainEnglish": "The AWS Glue Data Catalog is a centralized metadata repository that stores database definitions, table schemas, and partition information for your data lake. Amazon Athena integrates natively with the AWS Glue Data Catalog as its central metastore. When you create a table or run an AWS Glue Crawler to automatically discover schemas from S3 files, the Glue Data Catalog stores the column names, data types, and S3 file locations. Athena references this catalog whenever you run SQL queries.",
  "whyItMatters": "A centralized metadata catalog allows different analytics and machine learning services (Athena, Amazon EMR, Amazon Redshift Spectrum, and AWS Glue ETL) to share a single, unified view of your data schemas. You define the table schema once in Glue, and all services can query it immediately without manual re-definition.",
  "workplaceExample": "An automated AWS Glue Crawler scans an S3 bucket every midnight to discover new log files, infer data types, and update partition metadata in the Glue Data Catalog. In the morning, data analysts open Athena and query the latest data immediately without writing DDL schema update scripts.",
  "examFocus": "For SAA-C03, remember that AWS Glue Data Catalog acts as the central metastore for Athena. AWS Glue Crawlers automatically discover schemas and populate the Data Catalog. If an exam question asks how to automatically discover schemas from S3 datasets and make them queryable via Athena with minimal manual effort, the answer is AWS Glue Crawlers + Glue Data Catalog + Athena.",
  "keyPoints": [
    "AWS Glue Data Catalog serves as the persistent metadata metastore for Amazon Athena.",
    "Stores table definitions, column types, data formats, and partition locations.",
    "AWS Glue Crawlers can automatically scan S3 data to discover schemas and create tables.",
    "Shared across services: Glue, Athena, Amazon EMR, and Redshift Spectrum share the same catalog.",
    "Eliminates the need to maintain a separate Apache Hive metastore cluster."
  ],
  "commonMistake": "Manually executing CREATE TABLE and ALTER TABLE ADD PARTITION commands for hundreds of dynamic tables instead of using an automated AWS Glue Crawler. Glue Crawlers automatically detect new partitions, schema changes, and new file formats without manual intervention.",
  "example": "SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'glue_analytics_db';",
  "sources": [
    {
      "title": "Using AWS Glue Data Catalog with Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/data-sources-glue.html"
    },
    {
      "title": "Populating the AWS Glue Data Catalog",
      "url": "https://docs.aws.amazon.com/glue/latest/dg/populate-data-catalog.html"
    }
  ]
});
