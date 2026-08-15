import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-18',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Retry Policies',
  status: 'ready',
  plainEnglish: 'EventBridge Retry Policies control how EventBridge handles failed event delivery attempts to a target. By default, EventBridge automatically retries delivering failed events for up to 24 hours with exponential backoff and jitter. You can customize retry behavior by configuring Maximum Age of Event (from 60 seconds up to 24 hours) and Maximum Retry Attempts (from 0 to 185 attempts).',
  whyItMatters: 'Customizing retry policies prevents overwhelming a struggling target service with retries while ensuring sensitive events are retried appropriately before being sent to a Dead-Letter Queue.',
  workplaceExample: 'A real-time telemetry rule routes events to a Lambda function. Since old telemetry is useless after 5 minutes, the engineer sets `Maximum Event Age = 300 seconds` and `Maximum Retry Attempts = 3`. Events older than 5 minutes drop straight to the DLQ.',
  examFocus: 'SAA-C03 Retry Policy parameters:\n- Default Retry Behavior: Retries up to 24 hours or 185 times with exponential backoff.\n- Maximum Age of Event: 60 seconds to 86,400 seconds (24 hours).\n- Maximum Retry Attempts: 0 to 185 retries.\n- Once retry limits are exhausted, the event is routed to the target\'s SQS Dead-Letter Queue (DLQ).',
  keyPoints: [
    'Controls event delivery retry parameters per target.',
    'Default behavior: Retries for 24 hours with exponential backoff.',
    'Configurable parameters: Maximum Age of Event and Maximum Retry Attempts.',
    'Prevents target service exhaustion during downstream outages.',
    'Pairs with SQS Dead-Letter Queues for failed event retention.'
  ],
  commonMistake: 'Setting Maximum Retry Attempts to 0 for a critical target without a DLQ, causing any transient network glitch to immediately discard events permanently.',
  example: 'Target Retry Policy Configuration:\n`RetryPolicy: { MaximumEventAgeInSeconds: 3600, MaximumRetryAttempts: 10 }`',
  sources: [
    { title: 'Amazon EventBridge Retry Policies and Dead-Letter Queues', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html' }
  ]
});
