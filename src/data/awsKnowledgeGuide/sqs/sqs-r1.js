import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-r1',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'SQS Standard vs FIFO Queues (Throughput, Ordering, Deduplication, and Use Case Comparison)',
  status: 'ready',
  plainEnglish: 'Amazon SQS provides two queue types optimized for different architectural requirements:\n- Standard Queues: High-throughput, serverless queues providing at-least-once delivery and best-effort ordering. Ideal when order does not matter and maximum throughput is required.\n- FIFO Queues: Ordered queues providing exactly-once processing, strict ordering within Message Group IDs, built-in deduplication within 5 minutes, and `.fifo` naming.',
  whyItMatters: 'Selecting the correct queue type prevents operational failures and extra costs. Using Standard queues when ordering is required leads to data corruption; using FIFO queues when ordering is unneeded unnecessarily caps maximum throughput.',
  workplaceExample: 'An enterprise uses SQS Standard Queues for decoupled email notifications (processing 100,000 emails/min where order does not matter), while using SQS FIFO Queues for their stock trading transaction log (`trading.fifo` where exact order and no duplicates are mandatory).',
  examFocus: 'SAA-C03 Comprehensive Comparison (Standard vs FIFO):\n- Throughput: Standard = Nearly unlimited TPS. FIFO = 300 TPS baseline (up to 3,000 TPS with batching / high-throughput mode).\n- Delivery Model: Standard = At-least-once. FIFO = Exactly-once.\n- Ordering: Standard = Best-effort. FIFO = First-In-First-Out within Message Group ID.\n- Deduplication: Standard = None (consumer handles idempotency). FIFO = Built-in 5-minute deduplication window.\n- Naming: Standard = Any valid name. FIFO = MUST end with `.fifo`.',
  keyPoints: [
    'Standard Queues provide nearly unlimited throughput with at-least-once delivery.',
    'FIFO Queues provide exactly-once processing and strict ordering per Message Group ID.',
    'FIFO Queues require names ending with the mandatory `.fifo` suffix.',
    'FIFO Queues provide a 5-minute automated deduplication window.',
    'Standard Queues require idempotent consumers to handle potential duplicate messages.'
  ],
  commonMistake: 'Selecting FIFO queues for high-volume log ingestion workloads where order does not matter, artificially throttling ingestion throughput.',
  example: 'Decision Matrix Summary:\n- Standard Queue: Unlimited TPS, At-least-once, Best-effort order -> Email notifications, S3 event logs, video encoding.\n- FIFO Queue: 300-3000 TPS, Exactly-once, Strict order -> Financial ledgers, e-commerce checkout, inventory updates.',
  sources: [
    { title: 'Comparing SQS Standard and FIFO Queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-difference-from-amazon-sns.html' }
  ]
});
