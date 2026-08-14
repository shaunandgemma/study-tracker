import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-7",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Tables, Databases and Schemas",
  "status": "ready",
  "plainEnglish": "In Amazon Athena, Databases, Tables, and Schemas are logical metadata structures that describe the shape of your data in Amazon S3. An Athena database is a logical container for tables. An Athena table defines column names, data types (like VARCHAR, BIGINT, TIMESTAMP), serialization/deserialization libraries (SerDe), and the exact S3 URI (LOCATION 's3://...') where the raw data files live. Because Athena tables are EXTERNAL tables, deleting a table drops only the metadata schema, leaving your underlying raw files in S3 completely untouched.",
  "whyItMatters": "Organizing data into databases and tables provides structure to unstructured or semi-structured S3 objects. It allows developers and analysts to write standard SQL queries with strong typing and column validation without altering the raw source files.",
  "workplaceExample": "A healthcare platform creates an Athena database called billing_analytics and defines an external table claims_records pointing to s3://health-corp-data/claims/. The table defines strict column types for patient IDs, claim amounts, and dates, enabling accurate financial reporting.",
  "examFocus": "For SAA-C03, know that Athena uses EXTERNAL tables. When you drop an external table in Athena, the underlying S3 objects are NOT deleted (only the metadata schema in the catalog is removed). Understand Hive DDL commands used by Athena (CREATE EXTERNAL TABLE, ROW FORMAT, LOCATION).",
  "keyPoints": [
    "Databases in Athena are logical namespaces containing collections of tables.",
    "Tables map structured schemas (columns, data types) to raw data files stored in S3.",
    "All Athena tables are EXTERNAL tables; dropping a table does not delete the S3 data files.",
    "SerDe (Serializer/Deserializer) tells Athena how to parse file formats (CSV, JSON, Parquet).",
    "The LOCATION clause specifies the S3 bucket and prefix path containing the data files."
  ],
  "commonMistake": "Believing that dropping an Athena table deletes the S3 raw files. Since Athena tables are external references, dropping a table only removes the metadata definition from the Glue Data Catalog; to delete actual data, you must delete the S3 objects directly.",
  "example": "CREATE DATABASE IF NOT EXISTS app_analytics;\n\nCREATE EXTERNAL TABLE IF NOT EXISTS app_analytics.user_events (\n  user_id STRING,\n  event_name STRING,\n  event_timestamp TIMESTAMP,\n  session_duration INT\n)\nSTORED AS PARQUET\nLOCATION 's3://my-company-analytics-lake/user_events/';",
  "sources": [
    {
      "title": "Creating Databases and Tables in Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/creating-databases-and-tables.html"
    },
    {
      "title": "Understanding Tables, Databases, and the Data Catalog",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/understanding-tables-databases-and-the-data-catalog.html"
    }
  ]
});
