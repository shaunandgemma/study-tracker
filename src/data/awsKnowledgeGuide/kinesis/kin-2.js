import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kin-2",
  "title": "Kinesis Data Firehose (Near-real-time streaming delivery to S3, Redshift, OpenSearch without code)",
  "plainEnglish": "Amazon Data Firehose (formerly Amazon Kinesis Data Firehose) is a fully managed, serverless delivery service that reliably loads streaming data into data lakes, data warehouses, and analytics destinations without writing custom ingestion code or managing consumer applications. It automatically buffers, transforms, compresses, and delivers data directly into Amazon S3, Amazon Redshift, Amazon OpenSearch Service, Snowflake, Splunk, Datadog, or custom HTTP endpoints.",
  "whyItMatters": "Building custom consumer software to ingest high-volume streaming records, batch them into optimized file sizes (like Apache Parquet), compress them with Gzip or Snappy, and load them into downstream data stores requires extensive engineering effort. Firehose automates the entire ingestion pipeline serverlessly with zero code and near-real-time delivery latency.",
  "workplaceExample": "An e-commerce platform sends billions of web application access logs to Amazon Data Firehose. Firehose buffers incoming records for 300 seconds (or 128 MB), invokes an AWS Lambda function to convert JSON payloads into Apache Parquet format using the AWS Glue Data Catalog schema, and delivers the compressed columnar files directly to an Amazon S3 analytics data lake for Athena querying.",
  "examFocus": "Understand Amazon Data Firehose characteristics: (1) It is near-real-time (NOT sub-second real-time), buffering data by time (60 to 900 seconds) and size (1 to 128 MB) before delivery. (2) Directly supports Amazon S3, Amazon Redshift (via S3 intermediate copy), Amazon OpenSearch, Snowflake, Splunk, Datadog, and HTTP endpoints. (3) Supports serverless inline transformation using AWS Lambda and automated format conversion to Apache Parquet/ORC.",
  "keyPoints": [
    "Delivers streaming data serverlessly to destinations including S3, Redshift, OpenSearch, HTTP endpoints, Snowflake, and Splunk.",
    "Near-real-time delivery with configurable buffer hints: Buffer Interval (60–900 seconds) and Buffer Size (1–128 MB).",
    "Automates data transformation at ingestion via inline AWS Lambda function invocations.",
    "Converts incoming raw JSON data into optimized columnar formats (Apache Parquet and Apache ORC) using AWS Glue schema definitions.",
    "Supports data compression (GZIP, Snappy, Zip) and server-side encryption via AWS KMS before writing to Amazon S3.",
    "Automatically backs up raw or failed transformation records to a dedicated S3 backup prefix to prevent data loss."
  ],
  "commonMistake": "Choosing Amazon Data Firehose when an application requires sub-second, real-time custom processing or consumer-controlled stream replay. Firehose is a buffered delivery service, not an interactive stream; use Kinesis Data Streams for sub-second streaming and replayable shards.",
  "example": "Create a delivery stream loading data into Amazon S3 with 300-second buffer interval: aws firehose create-delivery-stream --delivery-stream-name web-logs-to-s3 --extended-s3-destination-configuration file://s3-dest-config.json.",
  "sources": [
    {
      "title": "What is Amazon Data Firehose?",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"
    },
    {
      "title": "Amazon Data Firehose Delivery Destinations",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html"
    }
  ]
});
