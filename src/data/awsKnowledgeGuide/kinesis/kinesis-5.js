import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-5",
  "title": "Kinesis Data Firehose",
  "plainEnglish": "Amazon Data Firehose (formerly Amazon Kinesis Data Firehose) is the simplest way to capture, transform, and automatically deliver streaming data into AWS data stores and analytical tools. As a fully managed serverless service, Firehose handles all underlying capacity scaling, buffering, format conversion, and retries, delivering incoming streaming data directly to destinations without requiring custom consumer code.",
  "whyItMatters": "Ingesting continuous streaming records into storage repositories like Amazon S3, Amazon Redshift, or Amazon OpenSearch requires complex buffering, batching, and error-handling logic. Firehose replaces this custom infrastructure with an automated, serverless pipeline that manages data ingestion, converts formats to Parquet/ORC, and delivers records in near-real time.",
  "workplaceExample": "A digital advertising network emits billions of ad-impression events. They configure an Amazon Data Firehose delivery stream that ingests raw JSON impressions, batches them into 128 MB or 5-minute files, invokes a Lambda transformation to mask user IP addresses, converts the records to Apache Parquet format, and writes them into an Amazon S3 analytics bucket partitioned by year/month/day.",
  "examFocus": "Know the core features of Amazon Data Firehose: (1) Rebranded from Kinesis Data Firehose to Amazon Data Firehose. (2) Fully serverless with zero shard management or provisioning required. (3) Near-real-time delivery based on buffer size (1–128 MB) and buffer interval (60–900 seconds). (4) Direct integration with destinations: S3, Redshift (via S3 COPY), OpenSearch, Snowflake, Splunk, Datadog, and custom HTTP endpoints.",
  "keyPoints": [
    "Fully managed, serverless delivery service for loading streaming data into analytics destinations.",
    "Formerly known as Kinesis Data Firehose; rebranded as Amazon Data Firehose.",
    "Buffers incoming records based on time (60–900 seconds) and data volume (1–128 MB) before delivery.",
    "Supports inline serverless data transformation using AWS Lambda before data reaches destinations.",
    "Provides automated format conversion to Apache Parquet and Apache ORC using AWS Glue Data Catalog schemas.",
    "Direct destination support includes Amazon S3, Amazon Redshift, Amazon OpenSearch, Snowflake, Splunk, Datadog, and HTTP endpoints."
  ],
  "commonMistake": "Expecting Amazon Data Firehose to deliver data with sub-second latency. Firehose is an asynchronous buffered delivery service with a minimum buffer interval of 60 seconds (or 1 second for specific specialized destinations); for sub-second real-time processing, use Kinesis Data Streams.",
  "example": "Send records to Firehose via the AWS CLI PutRecord API: aws firehose put-record --delivery-stream-name ad-impressions --record '{\"Data\":\"eyJpbXByZXNzaW9uX2lkIjogIjEyMzQ1In0=\"}'.",
  "sources": [
    {
      "title": "Amazon Data Firehose Developer Guide",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"
    },
    {
      "title": "Amazon Data Firehose Destination Options",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html"
    }
  ]
});
