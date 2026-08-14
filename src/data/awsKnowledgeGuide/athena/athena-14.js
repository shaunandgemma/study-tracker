import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-14",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena Federated Query",
  "status": "ready",
  "plainEnglish": "Athena Federated Query extends Athena's SQL engine to query relational, non-relational, object, and custom data sources running on AWS or on-premises. By utilizing pre-packaged or custom AWS Lambda connectors, Athena executes standard SQL queries against data stored in databases like Amazon RDS MySQL, PostgreSQL, Amazon Aurora, Amazon DynamoDB, Amazon DocumentDB, Amazon Redshift, and even external third-party systems like Snowflake or Google BigQuery.",
  "whyItMatters": "Modern enterprise architectures store operational, transactional, and streaming data across multiple distinct database engines. Athena Federated Query allows developers and analysts to write a single SQL query that joins live operational data from DynamoDB with historical data lake files in S3, eliminating the need to build and operate complex ETL data pipelines.",
  "workplaceExample": "An incident investigation requires correlating live session records in Amazon DynamoDB with historical security audit logs stored in Amazon S3. Using Athena Federated Query, an engineer writes one SQL query that joins the DynamoDB connector table with the S3 audit table, completing the investigation in minutes.",
  "examFocus": "For SAA-C03, recognize Athena Federated Query when a scenario requires running SQL queries across multiple heterogeneous data stores (e.g., S3 + DynamoDB + RDS) without performing ETL. Know that it uses AWS Lambda data source connectors and that Spill S3 buckets are used when query result subsets exceed Lambda memory limits.",
  "keyPoints": [
    "Executes SQL queries across diverse data engines outside Amazon S3 without data migration.",
    "Powered by AWS Lambda data source connectors available via the Serverless Application Repository.",
    "Supports data sources including DynamoDB, Aurora/RDS, DocumentDB, CloudWatch Logs, and JDBC.",
    "Supports cross-source SQL JOIN operations in a single query execution.",
    "Requires an S3 spill bucket to store intermediate query data that exceeds Lambda memory limits."
  ],
  "commonMistake": "Running massive full-table scan federated queries against production transactional databases during peak business hours. Because Lambda queries the target database directly, heavy analytical queries can consume database CPU and I/O; use read replicas or appropriate query filters.",
  "example": "SELECT ord.order_id, ord.order_date, usr.email\nFROM \"s3_datalake\".\"orders\" ord\nJOIN \"lambda:aurora-mysql-connector\".\"sales_db\".\"users\" usr\n  ON ord.user_id = usr.id\nWHERE ord.order_date >= '2026-08-01';",
  "sources": [
    {
      "title": "Using Amazon Athena Federated Query",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/connect-to-a-data-source.html"
    },
    {
      "title": "Deploying a Data Source Connector in Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/connectors-deploying.html"
    }
  ]
});
