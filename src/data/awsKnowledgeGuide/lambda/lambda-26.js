import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-26",
  "title": "Lambda with Amazon SQS",
  "plainEnglish": "Integrating AWS Lambda with Amazon Simple Queue Service (Amazon SQS) uses an Event Source Mapping where Lambda continuously polls the SQS queue using long polling, retrieves messages up to the configured batch size, and invokes your function synchronously. If the function executes successfully, Lambda automatically deletes the processed messages from the queue.",
  "whyItMatters": "Combining SQS with Lambda creates a resilient, decoupled buffer between asynchronous producers and compute processing. If message traffic surges faster than your backend systems can handle, messages safely queue up in SQS while Lambda scales smoothly up to its concurrency limit without dropping transactions.",
  "workplaceExample": "A payroll processing engine queues 50,000 direct-deposit requests into an Amazon SQS FIFO queue. An Event Source Mapping triggers a Lambda function in batches of 10 messages. When one message in a batch fails due to an invalid bank routing number, the function returns `ReportBatchItemFailures` with that specific message ID, allowing the 9 successful messages to be deleted from SQS while the single failed message is returned to the queue for retry and eventual DLQ routing.",
  "examFocus": "Understand Lambda-SQS integration best practices: (1) SQS Visibility Timeout: Must be configured to at least 6 times the Lambda function timeout to avoid messages becoming visible while still being processed. (2) Partial Batch Response: Use `ReportBatchItemFailures` so that only failed message IDs are retried, preventing successful messages from being re-processed. (3) SQS scaling: Lambda starts with 5 concurrent pollers and scales up by 60 concurrent executions per minute up to 1,000.",
  "keyPoints": [
    "Uses Event Source Mapping to poll standard or FIFO SQS queues using long polling.",
    "Lambda automatically deletes successfully processed messages from SQS after the function returns.",
    "The SQS Queue Visibility Timeout MUST be set to at least 6 times the Lambda function's timeout.",
    "Supports 'ReportBatchItemFailures' (Partial Batch Responses) to retry only specific failed message IDs in a batch.",
    "Scaling: Automatically scales concurrent function instances based on the number of messages in the queue backlog.",
    "Poison messages that repeatedly fail are moved to an SQS Dead-Letter Queue (DLQ) after `maxReceiveCount` is exceeded."
  ],
  "commonMistake": "Failing to set the SQS Visibility Timeout to at least 6x the Lambda function timeout. If the visibility timeout is shorter, messages become visible to other Lambda pollers before the first function finishes processing, resulting in duplicate processing loops.",
  "example": "Configure partial batch failure reporting in an SQS event source mapping: aws lambda create-event-source-mapping --function-name process-sqs --event-source-arn arn:aws:sqs:us-east-1:123456789012:job-queue --batch-size 10 --function-response-types ReportBatchItemFailures.",
  "sources": [
    {
      "title": "Using AWS Lambda with Amazon SQS",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html"
    },
    {
      "title": "Implementing Partial Batch Response for Amazon SQS",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#services-sqs-batchfailurereporting"
    }
  ]
});
