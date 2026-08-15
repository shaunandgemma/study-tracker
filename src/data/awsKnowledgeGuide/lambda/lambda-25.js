import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-25",
  "title": "Lambda Event Source Mappings",
  "plainEnglish": "A Lambda Event Source Mapping is a serverless resource managed by AWS Lambda that continuously polls stream-based or queue-based services (such as Amazon SQS, Amazon Kinesis Data Streams, Amazon DynamoDB Streams, Amazon MSK, and Amazon MQ), reads and batches incoming records, and invokes your Lambda function synchronously with that batch of records.",
  "whyItMatters": "Instead of writing and maintaining dedicated EC2 worker fleets to run continuous polling loops, maintain offsets, handle backpressure, and coordinate shard leases, Event Source Mapping shifts all polling infrastructure, shard tracking, batch accumulation, and error retry management into a fully managed AWS service.",
  "workplaceExample": "An analytics team creates an Event Source Mapping between an Amazon Kinesis data stream with 20 shards and an event-processor Lambda function. The Event Source Mapping reads records across all 20 shards in parallel, bundles records into batches of 100 or 5-second windows, and passes each batch to the function, automatically bisecting batches if a processing error occurs.",
  "examFocus": "Understand Event Source Mapping controls and settings: (1) Batch Size and Maximum Batching Window: Accumulates records before invoking function. (2) Event Filtering: Filters records at the poll source, invoking Lambda only for records matching specific JSON pattern criteria. (3) Error Handling Controls: BisectBatchOnFunctionError (splits failed batch into two halves to isolate bad records), MaximumRecordAgeInSeconds, MaximumRetryAttempts, and On-Failure Destinations.",
  "keyPoints": [
    "Internal AWS Lambda poller reading from stream and queue services (SQS, Kinesis, DynamoDB Streams, MSK, MQ).",
    "Invokes the target Lambda function synchronously with batches of records passed in the event payload.",
    "The Lambda function's Execution Role must grant read permissions to the source stream or queue.",
    "Supports Batch Size (1–10,000) and Maximum Batching Window (0–300s) to optimize batch density.",
    "Provides Event Filtering to drop unwanted records at the poller level without incurring function execution costs.",
    "Includes advanced error-handling controls: BisectBatchOnFunctionError, MaximumRetryAttempts, MaximumRecordAge, and On-Failure Destinations."
  ],
  "commonMistake": "Thinking you need to write long-polling loops inside your Lambda function code. The Event Source Mapping handles all polling, shard lease coordination, and batching outside your code; your function only needs to process the array of records delivered in the event.",
  "example": "Create an Event Source Mapping with error-handling controls for Kinesis: aws lambda create-event-source-mapping --function-name process-kinesis --event-source-arn arn:aws:kinesis:us-east-1:123456789012:stream/events --batch-size 100 --bisect-batch-on-function-error --maximum-retry-attempts 3 --destination-config '{\"OnFailure\":{\"Destination\":\"arn:aws:sqs:us-east-1:123456789012:kinesis-dlq\"}}'.",
  "sources": [
    {
      "title": "Lambda Event Source Mappings",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html"
    },
    {
      "title": "Configuring Event Source Mappings for Streaming Services",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html"
    }
  ]
});
