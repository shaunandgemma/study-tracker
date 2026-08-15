import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lam-2",
  "title": "Lambda Event Source Mappings (SQS, Kinesis, DynamoDB Streams) vs Synchronous Invocations (API Gateway, ALB)",
  "plainEnglish": "AWS Lambda executes code through different invocation models. Synchronous invocation occurs when a caller (like Amazon API Gateway or Application Load Balancer) directly invokes Lambda and waits for an immediate return response. Event Source Mappings (ESM) occur when Lambda internally polls poll-based services (like Amazon SQS queues, Amazon Kinesis Data Streams, and Amazon DynamoDB Streams), batches incoming records, and invokes your function synchronously with those batches.",
  "whyItMatters": "Understanding how Lambda is triggered determines your error handling, retry behavior, scaling velocity, and concurrency consumption. In synchronous invocations, client errors are returned directly to the calling client. In Event Source Mappings, Lambda manages polling, batching, shard checkpoints, and retries automatically according to the event source configuration.",
  "workplaceExample": "A retail application uses Amazon API Gateway to synchronously invoke a checkout Lambda function that returns an HTTP 200 order confirmation to the user in 150 milliseconds. Concurrently, the completed order event is sent to Amazon SQS, where a Lambda Event Source Mapping batches 10 messages at a time to process asynchronous inventory adjustments in the background.",
  "examFocus": "Compare invocation models for certification exams: (1) Synchronous (API Gateway, ALB, Cognito, CLI RequestResponse): Caller waits for response, client handles retries on error (429/500). (2) Event Source Mapping (SQS, Kinesis, DynamoDB Streams, MSK): Lambda polls the source, batches records, and handles retries; SQS returns failed messages to the queue after visibility timeout, while stream sources retry until record expiration or bisecting on error.",
  "keyPoints": [
    "Synchronous invocation: Caller opens a connection, triggers Lambda, and waits for the function's execution result in real time.",
    "Event Source Mapping (ESM): An internal Lambda poller reads records from queues/streams and invokes the function with batches.",
    "Queue sources (Amazon SQS): Lambda polls the queue, invokes the function; failed items become visible again after visibility timeout unless using Partial Batch Responses.",
    "Stream sources (Kinesis, DynamoDB Streams): Lambda reads records in strict shard sequence, retrying failed batches to preserve in-order processing.",
    "Synchronous errors (e.g., function crashes) return 502/500 errors immediately to the caller without automatic Lambda service retries.",
    "Event Source Mappings scale automatically: SQS scales based on queue backlog depth, while streams scale based on active shard count and ParallelizationFactor."
  ],
  "commonMistake": "Confusing Event Source Mapping with Asynchronous Invocation. In asynchronous invocation (like S3 or SNS), the calling service pushes an event to Lambda's internal queue and disconnects immediately; in Event Source Mapping, Lambda actively polls the source resource on your behalf.",
  "example": "Create an SQS Event Source Mapping with a batch size of 10 and a batching window of 5 seconds: aws lambda create-event-source-mapping --function-name process-orders --event-source-arn arn:aws:sqs:us-east-1:123456789012:order-queue --batch-size 10 --maximum-batching-window-in-seconds 5.",
  "sources": [
    {
      "title": "Lambda Event Source Mappings",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html"
    },
    {
      "title": "Synchronous Invocation in AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-sync.html"
    }
  ]
});
