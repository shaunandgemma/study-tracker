import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-10',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'FIFO Message Group IDs',
  status: 'ready',
  plainEnglish: 'The `MessageGroupId` is a mandatory attribute tag attached to every message sent to an SQS FIFO Queue. It acts as an ordering partition key: all messages sharing the same `MessageGroupId` are processed in strict sequential order. Different Message Group IDs within the same FIFO queue can be processed concurrently by parallel consumer threads.',
  whyItMatters: 'Using a single `MessageGroupId` for all messages limits queue throughput to a single consumer thread. Using granular Message Group IDs (e.g., `user_id` or `account_id`) enables high-throughput parallel processing across multiple worker threads while maintaining order per user.',
  workplaceExample: 'A multi-tenant SaaS application sets `MessageGroupId = customer_account_id`. SQS FIFO processes customer A\'s messages in order on Worker-1 while simultaneously processing customer B\'s messages in order on Worker-2.',
  examFocus: 'SAA-C03 Message Group ID Design & Parallelism:\n- Mandatory Parameter: Every `SendMessage` call to a `.fifo` queue MUST specify a `MessageGroupId`.\n- Partitioning Key: Messages within `Group-A` are strictly ordered relative to `Group-A`; `Group-B` messages are ordered relative to `Group-B`.\n- Parallel Scaling: Maximizing unique `MessageGroupId` values enables horizontal consumer scaling across workers.',
  keyPoints: [
    'Mandatory parameter for all messages published to SQS FIFO Queues.',
    'Defines the ordering boundary/partition for First-In-First-Out processing.',
    'Messages in the same group are processed in strict sequential order.',
    'Different Message Group IDs can be consumed in parallel by multiple worker threads.',
    'Designing granular Message Group IDs maximizes parallel throughput.'
  ],
  commonMistake: 'Setting a static hardcoded `MessageGroupId` (e.g. `"global-group"`) for all messages, bottlenecking all FIFO queue consumption to a single thread.',
  example: 'Specifying MessageGroupId in AWS SDK SendMessage Request:\nconst params = {\n  QueueUrl: "https://sqs.us-east-1.amazonaws.com/123456789012/orders.fifo",\n  MessageBody: JSON.stringify({ orderId: 5001, status: "PAID" }),\n  MessageGroupId: "customer-account-5001",\n  MessageDeduplicationId: "evt-5001-paid"\n};',
  sources: [
    { title: 'Using MessageGroupId in SQS FIFO queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html' }
  ]
});
