import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-14',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Short Polling',
  status: 'ready',
  plainEnglish: 'Short Polling is the legacy default polling behavior in Amazon SQS (`ReceiveMessageWaitTimeSeconds = 0`). When a consumer issues a ReceiveMessage call, SQS samples a random subset of its distributed storage servers and returns available messages immediately. If no messages are found on those sampled servers, SQS returns an empty response immediately, even if messages exist on other unsampled servers.',
  whyItMatters: 'Understanding Short Polling explains why a consumer might receive an empty response even when messages exist in the queue. Short Polling increases API call frequency and cost compared to Long Polling.',
  workplaceExample: 'A legacy application polls an SQS queue using Short Polling. Because SQS only samples a subset of queue servers on each call, the application must issue multiple rapid API calls to retrieve all available messages, generating high request volumes.',
  examFocus: 'SAA-C03 Short Polling Mechanics:\n- Instant Return: Returns immediately with whatever messages are found on sampled servers.\n- Subsampling Limit: Samples only a subset of SQS servers, leading to potential empty receives when queue depth is low.\n- Cost & Latency Impact: Generates significantly more API requests and higher billing charges than Long Polling.\n- Default Value: Occurs when `ReceiveMessageWaitTimeSeconds` is set to 0.',
  keyPoints: [
    'Default polling mode when `ReceiveMessageWaitTimeSeconds` is 0.',
    'Returns immediately after sampling a subset of distributed SQS servers.',
    'May return an empty response even if messages are stored on unsampled servers.',
    'Results in higher SQS API request volumes and higher monthly billing costs.',
    'Should generally be migrated to Long Polling (20 seconds) for cost optimization.'
  ],
  commonMistake: 'Assuming an empty response from a Short Polling request proves the SQS queue contains zero total messages.',
  example: 'Executing a Short Polling Request via AWS CLI:\naws sqs receive-message --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/my-queue" --wait-time-seconds 0',
  sources: [
    { title: 'Amazon SQS Short Polling', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html#sqs-short-polling' }
  ]
});
