import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-24',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'SQS Buffering and Load Leveling',
  status: 'ready',
  plainEnglish: 'SQS Buffering and Load Leveling is a resilience pattern where an SQS queue acts as a shock absorber between high-volume, unpredictable traffic spikes (from web producers) and rate-limited backend resources (such as relational databases or legacy APIs). SQS buffers incoming traffic spikes, allowing workers to drain messages at a steady, manageable rate.',
  whyItMatters: 'Sudden traffic surges (like Flash Sales or breaking news events) can overwhelm relational database connection pools. SQS Load Leveling absorbs traffic bursts, preventing database crashes while preserving all incoming requests in the queue.',
  workplaceExample: 'A ticketing system experiences a burst of 100,000 order requests in 60 seconds. SQS buffers all 100,000 order messages. A pool of 20 worker instances drains and processes orders at a safe, steady rate of 500 orders per second.',
  examFocus: 'SAA-C03 Load Leveling & Auto Scaling:\n- Traffic Smoothing: Smooths out wild traffic spikes to protect downstream databases.\n- Backlog-Based Scaling: Configure EC2 Auto Scaling policy based on SQS queue depth (`ApproximateNumberOfMessagesVisible`) divided by worker count (Backlog per Instance metric).\n- Cost Savings: Avoids over-provisioning massive database fleets just to handle rare 5-minute traffic spikes.',
  keyPoints: [
    'Acts as a shock absorber between unpredictable web traffic and backend services.',
    'Buffers traffic spikes to prevent relational database and legacy API crashes.',
    'Allows backend workers to process messages at a steady, controlled processing rate.',
    'Enables Auto Scaling worker fleets based on SQS `BacklogPerInstance` metrics.',
    'Reduces infrastructure costs by eliminating the need to over-provision peak compute fleets.'
  ],
  commonMistake: 'Configuring EC2 Auto Scaling policies on raw CPU utilization instead of SQS queue backlog depth (`ApproximateNumberOfMessagesVisible`), causing slow scaling during queue spikes.',
  example: 'Calculating Backlog per Instance for Auto Scaling:\nBacklog Per Instance = ApproximateNumberOfMessagesVisible / Number of Running EC2 Workers',
  sources: [
    { title: 'SQS buffering and load leveling architecture', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' }
  ]
});
