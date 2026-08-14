import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ath-3",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena Federated Query (Querying databases outside S3 via Lambda connectors)",
  "status": "ready",
  "plainEnglish": "Athena Federated Query is a capability that allows you to run SQL queries across data stored not just in Amazon S3, but across relational databases, non-relational data stores, and custom external systems. It works by using pre-built or custom AWS Lambda data source connectors. When you submit a SQL query that references an external database—such as Amazon DynamoDB, Amazon RDS PostgreSQL, Apache HBase, or CloudWatch Logs—Athena invokes the Lambda connector to retrieve and filter the external data, combining it with your S3 data in a single SQL result.",
  "whyItMatters": "Enterprise data is rarely stored in only one place. Customer profile data might live in DynamoDB, historical transactions in S3, and billing records in Aurora MySQL. Athena Federated Query eliminates the need for complex, fragile ETL pipelines to copy data into a central warehouse before running cross-system analytics.",
  "workplaceExample": "An analytics team runs a single SQL query in Athena that joins a customers table stored in an active Amazon DynamoDB table with 5 years of historical order archives stored in Amazon S3 Parquet files, generating a comprehensive customer lifetime value report in seconds.",
  "examFocus": "For SAA-C03, Athena Federated Query is the solution when exam questions describe querying disparate data sources (DynamoDB, RDS, CloudWatch Logs, on-premises databases) using SQL without extracting and copying the data to S3 first. Remember that it relies on AWS Lambda data source connectors deployed from the AWS Serverless Application Repository.",
  "keyPoints": [
    "Allows Athena to execute SQL queries across diverse data sources beyond Amazon S3.",
    "Uses AWS Lambda data source connectors to interface with external storage engines.",
    "Supports data stores such as Amazon DynamoDB, RDS, CloudWatch Logs, DocumentDB, and JDBC sources.",
    "Enables single SQL queries that JOIN data across multiple disparate systems.",
    "Lambda execution costs apply in addition to standard Athena query scanning charges."
  ],
  "commonMistake": "Building scheduled glue ETL jobs to export DynamoDB or RDS tables into S3 every hour just to run infrequent cross-table analytical queries. Use Athena Federated Query with standard Lambda connectors to query the live databases directly without pipeline overhead.",
  "example": "SELECT s3_orders.order_id, ddb_cust.customer_name, s3_orders.total_amount FROM \"s3_datalake\".\"orders\" s3_orders JOIN \"lambda:dynamodb-connector\".\"default\".\"customers\" ddb_cust ON s3_orders.customer_id = ddb_cust.id WHERE s3_orders.order_date >= '2026-01-01';",
  "sources": [
    {
      "title": "Using Amazon Athena Federated Query",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/connect-to-a-data-source.html"
    },
    {
      "title": "Athena Data Source Connectors",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/data-sources-available.html"
    }
  ]
});
