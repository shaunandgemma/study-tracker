import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-8',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Best-Effort Ordering in Standard Queues',
  status: 'ready',
  plainEnglish: 'Best-Effort Ordering is the message sequencing behavior of SQS Standard Queues. SQS attempts to preserve the order in which messages are sent, but because messages are distributed across thousands of independent queue servers for high throughput, messages may occasionally be delivered out of sequence.',
  whyItMatters: 'If your application requires strict message order (e.g., `Create Account` must run before `Update Address`), relying on Standard Queue best-effort ordering will cause application errors. Use SQS FIFO Queues when strict order is mandatory.',
  workplaceExample: 'An image thumbnail service receives image processing jobs in a Standard Queue. Since thumbnails for Image A and Image B can be generated in any order, best-effort ordering is perfectly acceptable and maximizes throughput.',
  examFocus: 'SAA-C03 Ordering Comparison:\n- Standard Queues: Best-Effort Ordering (high throughput, non-strict sequence).\n- FIFO Queues: Strict Ordering (messages delivered in exact order sent within a Message Group).\n- Use Case Matching: If order does NOT matter, use Standard Queues for maximum scaling and lower cost.',
  keyPoints: [
    'Message sequencing model used by SQS Standard Queues.',
    'Attempts to deliver messages in order sent, but strict sequence is not guaranteed.',
    'Trades strict ordering for nearly unlimited message scaling and throughput.',
    'Ideal for independent processing tasks (e.g. image encoding, email dispatches).',
    'Requires SQS FIFO Queues if strict chronological sequence is required.'
  ],
  commonMistake: 'Using SQS Standard Queues for financial account balance updates expecting strict chronological delivery order.',
  example: 'Standard Queue Send Order vs Receive Order Example:\n- Sent Order: Msg-1, Msg-2, Msg-3\n- Received Order: Msg-2, Msg-1, Msg-3 (Best-effort sequence due to distributed server polling)',
  sources: [
    { title: 'Message ordering in Amazon SQS', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' }
  ]
});
