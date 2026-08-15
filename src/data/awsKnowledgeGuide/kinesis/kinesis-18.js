import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-18",
  "title": "Data Firehose Near Real-Time Delivery",
  "plainEnglish": "Amazon Data Firehose provides near-real-time streaming delivery by capturing streaming records, accumulating them inside an in-memory buffer, and flushing them as consolidated batch files to destinations (such as Amazon S3, Redshift, OpenSearch, and Snowflake). Unlike sub-second streaming engines, Firehose introduces a slight buffering latency (typically 60 to 300 seconds) to optimize file sizes and network throughput.",
  "whyItMatters": "Writing millions of individual tiny files directly to Amazon S3 or Amazon Redshift in real time causes severe file fragmentation (the 'small files problem'), degrading query performance in Amazon Athena and overwhelming storage transaction limits. Near-real-time buffering groups thousands of events into single, compressed, high-performance files.",
  "workplaceExample": "A mobile application analytics backend ingests 50,000 user event pings per second. Instead of writing 50,000 tiny individual objects per second to Amazon S3, they configure Amazon Data Firehose with a 300-second buffer interval. Firehose accumulates the pings and writes one clean, compressed 100 MB Parquet file to S3 every 5 minutes.",
  "examFocus": "Understand why Firehose is categorized as 'near-real-time' rather than 'real-time': Firehose holds data in buffers until either the Buffer Size (1 to 128 MB) or Buffer Interval (60 to 900 seconds) condition is satisfied. Firehose does not support custom application consumers pulling records individually; it strictly delivers batch files to configured target destinations.",
  "keyPoints": [
    "Delivers streaming data in near-real-time (60–900 second buffer delay) rather than sub-second real-time.",
    "Buffers incoming records in memory by size (1–128 MB) or time (60–900 seconds), flushing whenever the first threshold is reached.",
    "Eliminates the 'small files problem' in data lakes by creating properly sized, compressed batch files in Amazon S3.",
    "Automatically scales delivery capacity to handle incoming throughput with zero manual shard management.",
    "Manages destination connection retries, backpressure, and automatic backup of un-deliverable records to an S3 error bucket.",
    "Integrates with Amazon CloudWatch Metrics to monitor DeliveryToS3.Success, IncomingRecords, and ThrottledRecords."
  ],
  "commonMistake": "Designing architectures that expect immediate sub-second file creation in Amazon S3 via Firehose. Firehose is designed for near-real-time buffered loading; if sub-second latency is required, use Kinesis Data Streams with an AWS Lambda consumer.",
  "example": "Configure an Amazon Data Firehose delivery stream with a 60-second buffer interval and 5 MB buffer size for near-real-time S3 delivery: aws firehose create-delivery-stream --delivery-stream-name quick-s3-stream --extended-s3-destination-configuration '{\"BucketARN\":\"arn:aws:s3:::analytics-lake\",\"BufferingHints\":{\"IntervalInSeconds\":60,\"SizeInMBs\":5},\"RoleARN\":\"arn:aws:iam::123456789012:role/firehose-role\"}'.",
  "sources": [
    {
      "title": "What is Amazon Data Firehose?",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"
    },
    {
      "title": "Amazon Data Firehose Delivery Process and Buffering",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html"
    }
  ]
});
