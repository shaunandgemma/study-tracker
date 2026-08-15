import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-10",
  "title": "Stream Producers",
  "plainEnglish": "A Stream Producer in Amazon Kinesis Data Streams is any application, device, service, or client library that formats and puts data records into a Kinesis data stream. Producers write data using AWS SDKs, the high-performance Kinesis Producer Library (KPL), the standalone Amazon Kinesis Agent, or direct integrations from AWS services like Amazon CloudWatch Logs and AWS IoT Core.",
  "whyItMatters": "Choosing the appropriate producer architecture determines ingestion throughput, application latency, CPU efficiency, and cost. While basic AWS SDKs send records one at a time or in simple batches, the Kinesis Producer Library (KPL) aggregates multiple small user records into larger Kinesis records, dramatically increasing throughput per shard and cutting cost.",
  "workplaceExample": "A fleet of 1,000 Linux web servers produces Apache access log lines. The DevOps team installs the Amazon Kinesis Agent on each server to tail /var/log/httpd/access_log and continuously stream log lines into Kinesis Data Streams. For high-volume transaction microservices, backend developers use the Java Kinesis Producer Library (KPL) with record aggregation to maximize shard utilization.",
  "examFocus": "Understand the producer options: (1) AWS SDK: Standard PutRecord (single record) and PutRecords (batch up to 500 records / 5 MB). (2) Kinesis Producer Library (KPL): High-throughput Java/C++ library supporting automatic batching, asynchronous retries, and record aggregation (packing multiple user records into one Kinesis record). (3) Amazon Kinesis Agent: Standalone Linux daemon for tailing and streaming log files directly.",
  "keyPoints": [
    "Producers emit records into Kinesis Data Streams containing a partition key and payload data blob (up to 1 MB).",
    "AWS SDK supports PutRecord (synchronous single record) and PutRecords (batch of up to 500 records or 5 MB per call).",
    "The Kinesis Producer Library (KPL) provides automated record aggregation, batching, asynchronous publishing, and metrics.",
    "The Amazon Kinesis Agent is a pre-built Java daemon for Linux instances that monitors log files and streams records continuously.",
    "Integrated AWS service producers include CloudWatch Logs Subscription Filters, AWS IoT Core Rules, and Amazon EventBridge Pipes.",
    "Producers must implement retry logic with exponential backoff to handle ProvisionedThroughputExceededException throttling gracefully."
  ],
  "commonMistake": "Calling PutRecord in a tight loop across thousands of threads instead of using PutRecords (batch API) or the Kinesis Producer Library (KPL). Individual PutRecord calls suffer network overhead and quickly hit the 1,000 records/sec per shard limit.",
  "example": "Batch write up to 500 records using the AWS SDK PutRecords API: aws kinesis put-records --stream-name order-stream --records file://batch-records.json.",
  "sources": [
    {
      "title": "Developing Producers Using the Amazon Kinesis Data Streams API",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/building-producers.html"
    },
    {
      "title": "Developing Producers with the Amazon Kinesis Producer Library (KPL)",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/developing-producers-with-kpl.html"
    }
  ]
});
