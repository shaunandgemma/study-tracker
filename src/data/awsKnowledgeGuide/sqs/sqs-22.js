import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-22',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'SQS Lambda Event Source Mapping',
  status: 'ready',
  plainEnglish: 'An SQS Lambda Event Source Mapping is a managed integration where AWS Lambda automatically polls an Amazon SQS queue on your behalf, retrieves batches of messages, invokes your Lambda function asynchronously, and automatically deletes successfully processed messages from the queue upon completion.',
  whyItMatters: 'Writing custom polling code in EC2 instances requires managing infrastructure, polling threads, and manual deletion APIs. SQS Lambda Event Source Mapping handles all polling, scaling, and message deletion automatically.',
  workplaceExample: 'An image processing pipeline pushes upload events to SQS. An SQS Lambda Event Source Mapping automatically scales Lambda concurrency from 1 to 500 instances to consume the queue batch by batch, deleting processed messages seamlessly.',
  examFocus: 'SAA-C03 SQS + Lambda ESM Rules:\n- Managed Polling: Lambda polls SQS using internal poller threads (you pay for Lambda execution time, not poller overhead).\n- Batching Parameters: `BatchSize` (1 to 10,000) and `MaximumBatchingWindowInSeconds` (0 to 300s).\n- Visibility Timeout Rule: Set SQS Queue Visibility Timeout to at least 6 TIMES the Lambda function timeout.\n- Partial Batch Failure: Use `ReportBatchItemFailures` in Lambda response to return failed message IDs without reprocessing successful batch items.',
  keyPoints: [
    'Managed AWS integration where Lambda polls SQS and invokes your function automatically.',
    'Lambda automatically deletes messages from SQS after successful function execution.',
    'Requires setting SQS Visibility Timeout to at least 6x the Lambda function timeout.',
    'Supports `ReportBatchItemFailures` to prevent reprocessing valid messages in a batch.',
    'Scales Lambda concurrency automatically based on queue backlog depth.'
  ],
  commonMistake: 'Setting the SQS Visibility Timeout equal to the Lambda Function Timeout (e.g. both 30s), causing in-flight messages to become visible to other pollers while Lambda is still executing.',
  example: 'Creating an SQS Lambda Event Source Mapping via AWS CLI:\naws lambda create-event-source-mapping --function-name ProcessOrderFunction --batch-size 10 --event-source-arn "arn:aws:sqs:us-east-1:123456789012:orders-queue" --function-response-types "ReportBatchItemFailures"',
  sources: [
    { title: 'Using AWS Lambda with Amazon SQS', url: 'https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html' }
  ]
});
