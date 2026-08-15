import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-23',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Decoupling Application Components',
  status: 'ready',
  plainEnglish: 'Decoupling Application Components is a core architectural pattern where microservices communicate asynchronously via message queues (Amazon SQS) rather than synchronous direct HTTP API calls. Producers place messages into SQS and return immediate responses to users, allowing worker instances to consume and process messages independently at their own pace.',
  whyItMatters: 'In tightly coupled architectures, if a backend database or worker service crashes, the entire front-end API crashes. Decoupling with SQS insulates front-end web apps from backend outages and performance bottlenecks.',
  workplaceExample: 'A photo-sharing web app accepts user uploads, writes the raw image to S3, pushes a thumbnail job to SQS, and instantly returns HTTP 200 to the user. Background EC2 workers process SQS jobs asynchronously without blocking the user interface.',
  examFocus: 'SAA-C03 Decoupling Architecture Benefits:\n- Independent Scaling: Web servers scale based on HTTP traffic; worker pools scale based on SQS queue depth.\n- Fault Isolation: Downstream worker outages do not crash upstream web producers.\n- Asynchronous Execution: Offloads long-running heavy tasks (PDF generation, email sending) from user-facing request paths.',
  keyPoints: [
    'Replaces synchronous API calls with asynchronous queue-based messaging.',
    'Prevents downstream worker failures from crashing upstream web frontends.',
    'Enables independent scaling of web producers and background consumers.',
    'Offloads long-running tasks from user-facing API request execution paths.',
    'Improves overall system availability and fault tolerance.'
  ],
  commonMistake: 'Making synchronous HTTP API calls from a web frontend to a slow background processing microservice instead of decoupling with an SQS queue.',
  example: 'Decoupled Microservice Architecture Pattern:\nWeb Frontend -> Push Task to SQS Queue -> HTTP 200 to User -> SQS Queue -> Worker EC2 / Lambda processes task asynchronously',
  sources: [
    { title: 'Decoupling applications with Amazon SQS', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' }
  ]
});
