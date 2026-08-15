import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-9',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'FIFO Ordering',
  status: 'ready',
  plainEnglish: 'FIFO Ordering in Amazon SQS guarantees that messages are received by consumers in the exact same order that they were published by producers. SQS FIFO Queues enforce strict sequence per `MessageGroupId`, ensuring that no message in a group is delivered until all preceding messages in that group have been successfully processed or deleted.',
  whyItMatters: 'System operations like database change data capture (CDC) or stock trading order execution fail if state changes arrive out of sequence. FIFO Ordering preserves state integrity across distributed message producers and consumers.',
  workplaceExample: 'An inventory system publishes events `Item Added (Qty: 10)` followed by `Item Sold (Qty: 2)` to `inventory.fifo`. SQS FIFO Ordering ensures the consumer processes `Item Added` first, preventing negative inventory calculations.',
  examFocus: 'SAA-C03 FIFO Ordering Mechanics:\n- Scope: Ordering is guaranteed WITHIN a `MessageGroupId`, not globally across unrelated groups.\n- Blocking Behavior: If a consumer fails to process a message in a `MessageGroupId`, subsequent messages in that same group are blocked until the first message is processed/deleted or moves to a DLQ.\n- Multiple Groups: Different `MessageGroupId` values can be processed in parallel by multiple workers.',
  keyPoints: [
    'Guarantees strict First-In-First-Out message delivery order.',
    'Ordering is enforced within each distinct `MessageGroupId`.',
    'Unprocessed messages block subsequent messages in the same Message Group ID.',
    'Multiple Message Group IDs can be processed concurrently by separate consumers.',
    'Eliminates message sequence scrambling in critical business workflows.'
  ],
  commonMistake: 'Expecting global FIFO ordering across all messages when using different `MessageGroupId` values. Ordering is scoped to individual Message Group IDs.',
  example: 'Sending an Ordered Message to a FIFO Queue via AWS CLI:\naws sqs send-message --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/orders.fifo" --message-body "{\\"action\\": \\"create_account\\"}" --message-group-id "user-1001" --message-deduplication-id "dedup-001"',
  sources: [
    { title: 'FIFO queue message ordering', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html' }
  ]
});
