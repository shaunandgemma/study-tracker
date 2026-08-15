import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-17',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Dead-Letter Queues',
  status: 'ready',
  plainEnglish: 'An EventBridge Dead-Letter Queue (DLQ) is an Amazon SQS queue configured on an EventBridge target to capture events that could not be successfully delivered after exhausting all retry attempts or exceeding maximum event age limits.',
  whyItMatters: 'If a target service (like a Lambda function or API Destination) is down, throttled, or throwing errors, undelivered events would be discarded forever once retries expire. Configuring a Dead-Letter Queue preserves failed events for inspection and manual re-processing.',
  workplaceExample: 'An EventBridge rule routes events to a 3rd-party HTTP API Destination. The 3rd-party API goes down for 4 hours. Once EventBridge exhausts its retries, it writes the failed events into an SQS Dead-Letter Queue (`eventbridge-dlq`), preventing permanent data loss.',
  examFocus: 'SAA-C03 DLQ configuration details:\n- DLQs are attached to individual TARGETS within an EventBridge rule.\n- Target DLQ MUST be an Amazon SQS Queue.\n- SQS Queue Policy MUST allow EventBridge service (`events.amazonaws.com`) permission to call `sqs:SendMessage`.\n- Captures error metadata (error code, message, attempt count) along with original event payload.',
  keyPoints: [
    'Captures undelivered events after retries expire or max event age is reached.',
    'Attached directly to individual targets on an EventBridge rule.',
    'Target DLQ must be an Amazon SQS queue.',
    'Requires SQS Queue Policy permitting `events.amazonaws.com` to send messages.',
    'Prevents data loss during downstream target outages.'
  ],
  commonMistake: 'Attaching an SQS Dead-Letter Queue to an EventBridge target without updating the SQS Queue Access Policy to grant `events.amazonaws.com` permission to send messages. Undelivered events will be dropped.',
  example: 'SQS Queue Policy Statement for EventBridge DLQ:\n{\n  "Sid": "AllowEventBridgeDLQ",\n  "Effect": "Allow",\n  "Principal": { "Service": "events.amazonaws.com" },\n  "Action": "sqs:SendMessage",\n  "Resource": "arn:aws:sqs:us-east-1:123456789012:MyEventDLQ"\n}',
  sources: [
    { title: 'Using Dead-Letter Queues in Amazon EventBridge', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html' }
  ]
});
