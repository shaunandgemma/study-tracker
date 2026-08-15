import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-31",
  "title": "Lambda Retry Behaviour",
  "plainEnglish": "AWS Lambda's retry behavior varies fundamentally based on the invocation model used to trigger the function. Synchronous invocations perform zero automatic retries (errors are returned directly to the calling client). Asynchronous invocations automatically retry failed executions twice with exponential backoff. Event Source Mappings retry failed batches continuously according to the source service's retention, visibility timeout, or bisecting error configuration.",
  "whyItMatters": "Assuming a single unified retry policy across all Lambda triggers leads to severe bugs, data duplication, or silent data loss. Knowing how each invocation type handles retries allows engineers to implement idempotent handlers, configure appropriate timeouts, and set up proper dead-letter routing to safeguard application reliability.",
  "workplaceExample": "A payment service handles transactions via three entry points: (1) Synchronous API Gateway checkouts (where the mobile client prompts the user to retry on failure), (2) Asynchronous S3 receipt generation (which Lambda retries up to twice before routing failures to an SQS destination), and (3) SQS batch fulfillment (where partial batch failures return failed message IDs to SQS for exponential redelivery up to 5 attempts before hitting an SQS DLQ).",
  "examFocus": "Memorize retry behavior across invocation models: (1) Synchronous (API Gateway, ALB, CLI): 0 automatic retries by Lambda; client receives 429/500/502 and must retry. (2) Asynchronous (S3, SNS, EventBridge): 2 automatic retries (3 attempts total) with exponential backoff (1s, then 2s, etc.) over up to 6 hours. (3) Stream ESM (Kinesis/DynamoDB): Retries entire batch until records expire (up to 365 days) unless BisectBatchOnFunctionError or MaximumRetryAttempts is enabled. (4) Queue ESM (SQS): Messages return to the queue upon failure and become visible after Visibility Timeout expires.",
  "keyPoints": [
    "Retry behavior depends entirely on the invocation model: Synchronous, Asynchronous, or Event Source Mapping.",
    "Synchronous invocations have NO automatic service retries; callers receive the error directly.",
    "Asynchronous invocations retry failed requests up to 2 times automatically with exponential backoff and jitter.",
    "Stream Event Source Mappings (Kinesis/DynamoDB) retry failed batches until record expiration unless bisect/retry limits are configured.",
    "SQS Event Source Mappings return failed messages to the queue; redelivery occurs after the Visibility Timeout.",
    "Because retries can deliver the same payload multiple times, all Lambda handlers should be designed to be idempotent."
  ],
  "commonMistake": "Designing non-idempotent Lambda functions for asynchronous or stream-based event sources. Because retries occur automatically during network timeouts or container crashes, non-idempotent logic can cause double-charging or duplicate database row insertions.",
  "example": "Configure maximum retry attempts for asynchronous invocation using the AWS CLI: aws lambda put-function-event-invoke-config --function-name order-notifier --maximum-retry-attempts 1 --maximum-event-age-in-seconds 3600.",
  "sources": [
    {
      "title": "Error Handling and Automatic Retries in AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html"
    },
    {
      "title": "Managing Event Source Mapping Error Handling",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html"
    }
  ]
});
