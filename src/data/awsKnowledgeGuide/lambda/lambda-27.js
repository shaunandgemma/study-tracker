import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-27",
  "title": "Lambda with Amazon Kinesis",
  "plainEnglish": "Integrating AWS Lambda with Amazon Kinesis Data Streams uses an Event Source Mapping where Lambda continuously polls shards in a Kinesis stream, reads records sequentially, and invokes your function synchronously with batches of events. By default, Lambda processes one batch per shard concurrently to preserve strict record ordering within each shard.",
  "whyItMatters": "Kinesis streams ingest massive real-time event volumes from thousands of devices. Lambda allows you to process, transform, and analyze these records in real time without provisioning or managing EC2 worker clusters. If a shard experiences high volume, features like Parallelization Factor allow concurrent processing of separate partition keys within the same shard.",
  "workplaceExample": "A ride-hailing company streams GPS location telemetry across 50 Kinesis shards. A Lambda function processes vehicle positions to update live driver maps. To handle high vehicle density in urban centers, they set `ParallelizationFactor: 4`, allowing Lambda to run up to 4 concurrent function instances per shard (200 total concurrent executions) while strictly preserving order per vehicle partition key.",
  "examFocus": "Understand Lambda-Kinesis integration controls: (1) Concurrency: 1 Lambda instance per shard by default, scalable up to 10 instances per shard using `ParallelizationFactor` (ordering preserved per partition key). (2) IteratorAge Metric: Measures time lag between record ingestion and function processing; a rising IteratorAge indicates function processing cannot keep pace with incoming shard volume. (3) Error Handling: Use `BisectBatchOnFunctionError` to split failing batches in half, `MaximumRecordAgeInSeconds`, and `DestinationConfig` (On-Failure DLQ).",
  "keyPoints": [
    "Uses an Event Source Mapping to poll Kinesis shards and invoke the function synchronously with record batches.",
    "By default, 1 Lambda execution environment processes records from 1 active shard at a time to maintain strict FIFO order.",
    "Parallelization Factor (1 to 10) allows up to 10 concurrent Lambda invocations per shard, preserving order per partition key.",
    "The CloudWatch metric 'IteratorAge' indicates the age of the last record in the batch; high IteratorAge means the consumer is falling behind.",
    "BisectBatchOnFunctionError automatically divides a failed batch into two smaller batches to isolate poisoned records.",
    "Supports Enhanced Fan-Out (EFO) to provide dedicated 2 MB/sec throughput per shard over HTTP/2 push."
  ],
  "commonMistake": "Failing to enable BisectBatchOnFunctionError or On-Failure Destinations. Without these, a single corrupt record can cause Lambda to retry the entire batch continuously, blocking processing on that shard until the stream retention period expires.",
  "example": "Configure a Kinesis Event Source Mapping with Parallelization Factor and Bisect on Error: aws lambda create-event-source-mapping --function-name process-telemetry --event-source-arn arn:aws:kinesis:us-east-1:123456789012:stream/gps-stream --batch-size 100 --parallelization-factor 2 --bisect-batch-on-function-error.",
  "sources": [
    {
      "title": "Using AWS Lambda with Amazon Kinesis",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html"
    },
    {
      "title": "Error Handling and Bisecting Batches in Kinesis Event Source Mappings",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html#services-kinesis-errors"
    }
  ]
});
