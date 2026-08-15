import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-11',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'FIFO Message Deduplication',
  status: 'ready',
  plainEnglish: 'FIFO Message Deduplication is a feature of SQS FIFO Queues that prevents duplicate messages from being published or stored. Within a 5-minute deduplication window, if a producer sends a message with a `MessageDeduplicationId` that matches a previously accepted message, SQS accepts the request but ignores the duplicate message payload.',
  whyItMatters: 'Network timeouts between a producer and SQS can cause the producer to retry sending an already-accepted message. FIFO Deduplication guarantees that retried message sends do not create duplicate records in the queue.',
  workplaceExample: 'A payment gateway sends a charge transaction to `payments.fifo`. A network hiccup occurs before SQS returns HTTP 200. The producer retries sending the message with the same `MessageDeduplicationId`. SQS detects the duplicate within 5 minutes and discards it.',
  examFocus: 'SAA-C03 Deduplication Modes & Scope:\n- Deduplication Window: 5 minutes from initial message submission.\n- Explicit Deduplication: Producer supplies a explicit `MessageDeduplicationId` (e.g., hash of order ID).\n- Content-Based Deduplication: SQS automatically generates a SHA-256 hash of the `MessageBody` as the deduplication ID when enabled on the queue.\n- Deduplication Scope: Configurable per queue or per message group.',
  keyPoints: [
    'Prevents duplicate message insertion into SQS FIFO Queues within a 5-minute window.',
    'Protects against duplicate messages caused by producer API retry attempts.',
    'Explicit mode uses developer-provided `MessageDeduplicationId`.',
    'Content-based mode automatically generates a SHA-256 hash from the `MessageBody`.',
    'Accepted duplicate sends return a valid success response with the original Message ID.'
  ],
  commonMistake: 'Enabling Content-Based Deduplication on a FIFO queue where message bodies contain non-unique timestamps, resulting in legitimate messages being discarded as duplicates.',
  example: 'Enabling Content-Based Deduplication via AWS CLI:\naws sqs set-queue-attributes --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/orders.fifo" --attributes ContentBasedDeduplication=true',
  sources: [
    { title: 'SQS FIFO message deduplication', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-deduplication.html' }
  ]
});
