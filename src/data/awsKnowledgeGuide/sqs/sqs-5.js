import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-5',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'SQS Standard Queues',
  status: 'ready',
  plainEnglish: 'Amazon SQS Standard Queues are fully managed, distributed message queues offering nearly unlimited throughput (nearly unlimited transactions per second). Standard queues provide at-least-once message delivery (a message is delivered at least once, but occasional duplicate copies can occur) and best-effort message ordering.',
  whyItMatters: 'Decoupling application components with Standard Queues ensures microservices scale independently and absorb high-volume traffic spikes without losing messages or slowing down API end users.',
  workplaceExample: 'An e-commerce order processing platform pushes 50,000 order creation events per minute into an SQS Standard Queue. Background worker EC2 instances pull orders from the queue and process payments in parallel.',
  examFocus: 'SAA-C03 Standard Queue Mechanics:\n- Throughput: Nearly unlimited TPS scaling.\n- Delivery Model: At-Least-Once Delivery (messages may occasionally be delivered more than once).\n- Ordering: Best-Effort Ordering (messages are generally delivered in order sent, but order is not strictly guaranteed).\n- Idempotency Requirement: Consumer applications MUST be designed idempotently to handle duplicate message deliveries safely.',
  keyPoints: [
    'Default queue type offering nearly unlimited message throughput (TPS).',
    'Provides At-Least-Once delivery (occasional duplicate messages can be delivered).',
    'Provides Best-Effort message ordering (strict sequence is not guaranteed).',
    'Requires consumer applications to implement idempotent processing.',
    'Decouples application producers from asynchronous consumer workers.'
  ],
  commonMistake: 'Assuming SQS Standard Queues deliver messages exactly once in strict chronological sequence. Standard queues require idempotent consumers.',
  example: 'Creating a Standard SQS Queue via AWS CLI:\naws sqs create-queue --queue-name order-processing-queue',
  sources: [
    { title: 'Amazon SQS Standard Queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' }
  ]
});
