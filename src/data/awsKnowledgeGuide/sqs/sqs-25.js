import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-25',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'SQS vs SNS',
  status: 'ready',
  plainEnglish: 'Amazon SQS and Amazon SNS serve distinct messaging models in cloud architecture:\n- Amazon SQS: Pull-based message queuing service. Messages are stored durably in a queue until worker consumers poll, receive, and delete them. Used for competing consumer worker pools.\n- Amazon SNS: Push-based pub/sub (publisher/subscriber) notification service. Messages are pushed instantly to multiple subscribed endpoints (SQS queues, Lambda functions, HTTP webhooks, SMS, email).\n- SNS-to-SQS Fan-Out: Publishers send a message once to SNS, which fans out copies instantly to multiple SQS queues for parallel, asynchronous processing.',
  whyItMatters: 'Using SQS alone requires producers to send messages to every worker queue individually. Combining SNS and SQS (Fan-Out) allows publishing once to SNS and fanning out to multiple independent SQS queues automatically.',
  workplaceExample: 'An order service publishes an `OrderPlaced` event to an SNS topic. SNS fans out copies to `Billing-Queue` (SQS), `Shipping-Queue` (SQS), and `Analytics-Queue` (SQS). Each microservice processes its copy independently.',
  examFocus: 'SAA-C03 Architectural Decision Matrix (SQS vs SNS):\n- Messaging Model: SQS = Pull (polling by consumers); SNS = Push (instant notification to subscribers).\n- Retention & Storage: SQS = Durable storage up to 14 days; SNS = No persistent storage (delivers immediately or drops if no subscriber).\n- Fan-Out Pattern: Combine SNS + SQS to deliver identical messages to multiple independent durable queues simultaneously.',
  keyPoints: [
    'Amazon SQS is a pull-based queuing service for competing consumer worker pools.',
    'Amazon SNS is a push-based pub/sub service for broadcasting messages to multiple subscribers.',
    'SQS stores messages durably for up to 14 days; SNS delivers messages immediately without queue storage.',
    'SNS-to-SQS Fan-Out pattern broadcasts messages to multiple independent queues.',
    'Requires SQS Queue Access Policy allowing `sns:SendMessage` for fan-out architectures.'
  ],
  commonMistake: 'Attempting to use Amazon SNS directly to store background processing jobs for worker EC2 instances. SNS does not store messages in queues; use SQS or SNS-to-SQS fan-out.',
  example: 'Selection Decision Matrix:\n- "Multiple microservices need to receive the exact same event notification" -> Amazon SNS (Pub/Sub)\n- "Worker instances need to poll and process background tasks reliably" -> Amazon SQS (Pull Queue)',
  sources: [
    { title: 'Differences between Amazon SQS and Amazon SNS', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-difference-from-amazon-sns.html' }
  ]
});
