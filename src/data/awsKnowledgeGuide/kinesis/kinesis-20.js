import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-20",
  "title": "Data Firehose Delivery to S3, Redshift and OpenSearch",
  "plainEnglish": "Amazon Data Firehose provides native, automated loading into three primary AWS analytics destinations: Amazon S3 (for serverless data lakes), Amazon Redshift (for cloud data warehousing), and Amazon OpenSearch Service (for search indexing and log analytics). Firehose handles all connection management, batching, format conversion, and intermediate staging automatically.",
  "whyItMatters": "Each analytics destination has distinct ingestion mechanics. Amazon S3 needs partitioned object keys; Amazon Redshift requires staging files in S3 before running high-speed COPY commands; Amazon OpenSearch requires bulk REST indexing. Firehose abstracts these differences behind a single streaming endpoint, managing retries and error routing without custom pipeline code.",
  "workplaceExample": "A cyber-defense team configures two Firehose delivery streams: Stream A writes firewall logs directly to Amazon S3 in Apache Parquet format for deep historical Athena analysis, while Stream B sends security alerts directly to Amazon OpenSearch Service for immediate indexing and visualization on OpenSearch Dashboards, with failed documents automatically backed up to S3.",
  "examFocus": "Understand destination-specific loading mechanisms: (1) Amazon S3: Direct write with custom prefix partitioning and dynamic partitioning. (2) Amazon Redshift: Firehose writes data to an intermediate Amazon S3 bucket first, then issues a COPY command to load data into the Redshift cluster/Serverless workgroup. (3) Amazon OpenSearch: Direct bulk indexing, requires an S3 backup bucket for failed indexing records or all incoming records.",
  "keyPoints": [
    "Amazon S3: Direct buffered delivery with custom S3 prefix partitioning (e.g., year/month/day/hour) and dynamic partitioning.",
    "Amazon Redshift: Two-step loading process where data is staged in an intermediate Amazon S3 bucket, followed by an automated SQL COPY command.",
    "Amazon OpenSearch Service: Ingests and indexes JSON records directly into OpenSearch domains or OpenSearch Serverless collections.",
    "All non-S3 destinations (Redshift, OpenSearch, Splunk) require an Amazon S3 backup bucket configuration to capture failed records.",
    "Supports Dynamic Partitioning on S3 to partition incoming streaming data by payload keys (e.g., customer_id or event_type).",
    "Integrates with AWS Secrets Manager to store Redshift database credentials securely."
  ],
  "commonMistake": "Believing Firehose writes directly to Amazon Redshift tables without Amazon S3. Firehose always uses an intermediate Amazon S3 staging bucket to execute the Redshift COPY command; you cannot configure a Redshift destination without an S3 bucket.",
  "example": "Configure a Redshift delivery stream via AWS CLI specifying the intermediate S3 bucket and cluster details: aws firehose create-delivery-stream --delivery-stream-name telemetry-to-redshift --redshift-destination-configuration file://redshift-config.json.",
  "sources": [
    {
      "title": "Amazon Data Firehose Delivery Destinations",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html"
    },
    {
      "title": "Creating an Amazon Data Firehose Delivery Stream for Amazon Redshift",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html#create-destination-redshift"
    }
  ]
});
