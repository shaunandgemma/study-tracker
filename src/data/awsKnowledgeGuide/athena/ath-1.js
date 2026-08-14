import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ath-1",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Serverless Standard SQL Queries on S3 Data (CSV, JSON, Apache Parquet, ORC)",
  "status": "ready",
  "plainEnglish": "Amazon Athena is an interactive, serverless query service that makes it easy to analyze data directly in Amazon S3 using standard ANSI SQL. Serverless means you do not need to set up, manage, scale, or pay for compute servers or database clusters. You simply point Athena at your raw data files stored in Amazon S3—whether formatted as plain text CSV, structured JSON, or high-performance columnar formats like Apache Parquet and ORC—define a table schema, and start executing SQL queries immediately.",
  "whyItMatters": "Organizations store massive volumes of application logs, event streams, and raw exports in Amazon S3 data lakes. Setting up dedicated database servers or ETL pipelines just to run ad-hoc queries is expensive and time-consuming. Athena allows architects and engineers to run SQL queries on petabytes of S3 data on-demand in seconds without maintaining any database infrastructure.",
  "workplaceExample": "A security engineering team stores millions of VPC Flow Logs and AWS CloudTrail audit records in an S3 bucket in JSON format. When investigating a potential unauthorized API call, an engineer opens the Athena query editor and runs a standard SELECT * FROM cloudtrail_logs WHERE eventname = 'ConsoleLogin' query to inspect the incident immediately.",
  "examFocus": "For SAA-C03, Athena is the go-to solution for serverless, ad-hoc SQL querying of raw data residing in Amazon S3 with zero ETL required. Contrast this with Amazon Redshift (data warehouse for complex, high-frequency BI queries) and Amazon EMR (custom big data processing using Spark/Hadoop). Know that Athena supports CSV, TSV, JSON, Parquet, ORC, and Avro formats.",
  "keyPoints": [
    "Athena allows running standard ANSI SQL queries directly against data stored in Amazon S3.",
    "It is completely serverless: no infrastructure to manage, provision, patch, or scale.",
    "Supports multiple data formats including CSV, JSON, Apache Parquet, ORC, and Avro.",
    "Requires zero ETL (Extract, Transform, Load) upfront to query raw S3 data.",
    "Pricing is based strictly on the amount of data scanned per query (5 USD per TB scanned)."
  ],
  "commonMistake": "Attempting to load S3 files into an RDS or Aurora database just to run occasional monthly reporting queries. This adds unnecessary database hosting costs and complex ETL pipelines when Athena can query the S3 files directly at a fraction of the cost.",
  "example": "SELECT useridentity.arn, eventtime, eventsource, eventname FROM cloudtrail_logs WHERE eventname = 'ConsoleLogin' AND errorcode IS NOT NULL LIMIT 10;",
  "sources": [
    {
      "title": "What is Amazon Athena?",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"
    },
    {
      "title": "Querying Amazon S3 Data with Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/querying-data.html"
    }
  ]
});
