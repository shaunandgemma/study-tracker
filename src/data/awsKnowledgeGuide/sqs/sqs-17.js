import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-17',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Dead-Letter Queues - DLQs',
  status: 'ready',
  plainEnglish: 'A Dead-Letter Queue (DLQ) is a designated target SQS queue used to isolate unprocessable "poison pill" messages. When a consumer receives a message from a source queue multiple times without successfully deleting it (exceeding the configured `maxReceiveCount`), SQS automatically moves the problematic message to the DLQ for developer inspection.',
  whyItMatters: 'Malformed message payloads or unhandled software bugs cause consumers to crash repeatedly. Without a DLQ, a poison-pill message will loop infinitely, wasting worker CPU, blocking queues, and generating high billing costs.',
  workplaceExample: 'An e-commerce order consumer encounters a corrupted JSON payload. The message fails processing 5 times (`maxReceiveCount = 5`). SQS automatically routes the corrupted message to `orders-dlq`, allowing main workers to process remaining valid orders uninterrupted.',
  examFocus: 'SAA-C03 DLQ Architecture & Matching Rules:\n- Queue Type Matching: SQS FIFO source queues MUST use a FIFO Dead-Letter Queue (ending in `.fifo`); Standard queues MUST use a Standard DLQ.\n- `maxReceiveCount`: Threshold of receive attempts (1 to 1000) before SQS moves message to DLQ.\n- Redrive Tasks: SQS Console supports Start Message Movement Tasks to redrive messages from DLQ back to the source queue after fixing consumer bugs.',
  keyPoints: [
    'Isolates malformed or unprocessable "poison pill" messages from main queues.',
    'Triggers when a message receive count exceeds the source queue `maxReceiveCount`.',
    'Standard source queues require Standard DLQs; FIFO source queues require FIFO DLQs.',
    'Prevents infinite processing loops and resource exhaustion in worker pools.',
    'Supports Redrive tasks to move investigated messages back to source queues.'
  ],
  commonMistake: 'Failing to set a Redrive Allow Policy on a DLQ, allowing unauthorized queues across the account to route junk messages into your DLQ.',
  example: 'Creating a DLQ and Setting Redrive Policy via AWS CLI:\naws sqs create-queue --queue-name orders-dlq\naws sqs set-queue-attributes --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/orders-queue" --attributes \'{"RedrivePolicy": "{\\"deadLetterTargetArn\\":\\"arn:aws:sqs:us-east-1:123456789012:orders-dlq\\",\\"maxReceiveCount\\":\\"5\\"}"}\'',
  sources: [
    { title: 'Amazon SQS Dead-Letter Queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html' }
  ]
});
