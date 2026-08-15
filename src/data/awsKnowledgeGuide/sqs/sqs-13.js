import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-13',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Long Polling',
  status: 'ready',
  plainEnglish: 'Long Polling is an optimized message retrieval method where SQS waits for up to 20 seconds (`ReceiveMessageWaitTimeSeconds > 0`) for messages to arrive in the queue before returning a response to the consumer. Long polling queries all SQS servers in the cluster, eliminating empty responses when messages exist and significantly reducing SQS API request costs.',
  whyItMatters: 'Short polling repeatedly queries queue servers immediately, returning thousands of empty HTTP 200 responses per hour when queues are empty. Long polling eliminates empty responses, cutting SQS API billing by up to 90% while decreasing message processing latency.',
  workplaceExample: 'A fleet of microservice workers consumes background tasks from SQS. By setting `ReceiveMessageWaitTimeSeconds = 20`, workers wait patiently for new messages to arrive, reducing monthly `ReceiveMessage` API call costs from $500 to $15.',
  examFocus: 'SAA-C03 Long Polling Configuration:\n- Duration Range: 1 to 20 seconds (default is 0 seconds = Short Polling).\n- Configuration Options: Set at the Queue level (`ReceiveMessageWaitTimeSeconds`) or per Receive request.\n- Cost Optimization: Recommended best practice for almost all SQS architectures to minimize empty response costs.\n- Comprehensive Query: Queries all SQS servers, ensuring messages are returned if available.',
  keyPoints: [
    'Waits up to 20 seconds for messages to arrive before returning a ReceiveMessage response.',
    'Eliminates empty response calls when a queue is temporarily empty.',
    'Dramatically reduces SQS API request volume and monthly billing costs.',
    'Queries all distributed SQS storage servers for available messages.',
    'Configured at the queue level or overridden on individual `ReceiveMessage` calls.'
  ],
  commonMistake: 'Leaving SQS queue polling at 0 seconds (Short Polling), generating millions of unnecessary empty API requests and high AWS bills.',
  example: 'Enabling Long Polling at the Queue Level via AWS CLI:\naws sqs set-queue-attributes --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/my-queue" --attributes ReceiveMessageWaitTimeSeconds=20',
  sources: [
    { title: 'Amazon SQS Long Polling', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html#sqs-long-polling' }
  ]
});
