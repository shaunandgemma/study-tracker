import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-30",
  "title": "Lambda Dead-Letter Queues",
  "plainEnglish": "A Lambda Dead-Letter Queue (DLQ) is an Amazon SQS queue or Amazon SNS topic configured on a Lambda function to capture event payloads that fail during Asynchronous Invocation. When an asynchronous event fails all retry attempts (the default is 2 retries) or exceeds the maximum event age limit (up to 6 hours), Lambda routes the original unprocessed event to the DLQ instead of discarding it.",
  "whyItMatters": "In asynchronous systems, functions run in the background without a direct client waiting for an error response. Without a DLQ or on-failure destination, failing events that exhaust retries are permanently lost. DLQs provide a critical safety net for debugging failed transactions, diagnosing data corruption, and reprocessing dropped messages.",
  "workplaceExample": "An invoice-processing Lambda function is triggered asynchronously when PDF receipts are uploaded to S3. If an unreadable or corrupted PDF causes the function to throw unhandled exceptions across all 3 retry attempts, Lambda sends the raw S3 event notification to an Amazon SQS Dead-Letter Queue. An automated alert notifies the support team, who inspect the corrupted file without halting the processing pipeline.",
  "examFocus": "Understand DLQs vs Lambda Asynchronous Destinations: (1) DLQs: Legacy feature supported ONLY for Asynchronous Invocations; destination can only be an SQS queue or SNS topic; contains ONLY the raw event payload. (2) Lambda Asynchronous Destinations: Modern, recommended feature for Asynchronous Invocations; supports SQS, SNS, EventBridge, and Lambda; provides rich JSON metadata including execution stack trace, error message, request context, and function response.",
  "keyPoints": [
    "Captures failed events from Asynchronous Invocations after all retry attempts (default 2) are exhausted.",
    "Target destination must be either an Amazon SQS queue ARN or an Amazon SNS topic ARN.",
    "The Lambda function's Execution Role must have permissions to send messages/publish to the DLQ target (`sqs:SendMessage` or `sns:Publish`).",
    "Only records the raw input event payload; does not include function stack traces or error descriptions.",
    "Modern best practice is to use Lambda Asynchronous Destinations (which include full failure context and metadata).",
    "DLQs do not apply to synchronous invocations (where caller receives the error directly) or SQS Event Source Mappings (which use SQS-native DLQs)."
  ],
  "commonMistake": "Configuring a Lambda DLQ for an SQS-triggered function. For SQS Event Source Mappings, you must configure the Dead-Letter Queue on the source SQS queue itself (via RedrivePolicy), not on the Lambda function's asynchronous DLQ configuration.",
  "example": "Configure a Dead-Letter Queue on a Lambda function using the AWS CLI: aws lambda update-function-configuration --function-name async-processor --dead-letter-config TargetArn=arn:aws:sqs:us-east-1:123456789012:lambda-dlq.",
  "sources": [
    {
      "title": "AWS Lambda Dead-Letter Queues for Asynchronous Invocations",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-dlq"
    },
    {
      "title": "Configuring Destinations for Asynchronous Invocation",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-destinations.html"
    }
  ]
});
