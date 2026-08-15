import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-12',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Visibility Timeout',
  status: 'ready',
  plainEnglish: 'The Visibility Timeout is the period of time (default 30 seconds, range 0 seconds to 12 hours) during which SQS prevents other consumers from receiving and processing a message that has just been fetched by an active consumer. Receiving a message does NOT delete it; the consumer must process the message and explicitly call `DeleteMessage` using its `ReceiptHandle` before the visibility timeout expires.',
  whyItMatters: 'If a consumer takes 45 seconds to process a job but the visibility timeout is set to 30 seconds, SQS will make the message visible again at second 30. A second consumer will pull and process the same message, causing duplicate processing.',
  workplaceExample: 'A video transcoding worker receives an SQS message for a 10-minute encoding task. The worker calls `ChangeMessageVisibility` every 2 minutes to extend the visibility timeout until encoding finishes, preventing other workers from picking up the active task.',
  examFocus: 'SAA-C03 Visibility Timeout Rules:\n- Default Value: 30 seconds (configurable per queue from 0 seconds to 12 hours).\n- Expiration Impact: If not deleted before timeout expires, message becomes visible again to other consumers.\n- Dynamic Extension: Use `ChangeMessageVisibility` API to extend timeout for long-running jobs.\n- SQS + Lambda ESM Rule: Set SQS Visibility Timeout to at least 6 TIMES the Lambda function timeout.',
  keyPoints: [
    'Temporary period preventing other consumers from receiving an in-flight message.',
    'Default duration is 30 seconds; configurable from 0 seconds to 12 hours.',
    'Consumers must delete messages explicitly using their Receipt Handle after processing.',
    'Can be extended dynamically using `ChangeMessageVisibility` for long tasks.',
    'For Lambda integrations, set SQS visibility timeout to 6x the Lambda function timeout.'
  ],
  commonMistake: 'Setting the visibility timeout shorter than the actual processing time of your worker, causing multiple workers to process the same message simultaneously.',
  example: 'Extending Visibility Timeout for a Long Job via AWS CLI:\naws sqs change-message-visibility --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/jobs-queue" --receipt-handle "MbXD...==" --visibility-timeout 300',
  sources: [
    { title: 'Amazon SQS Visibility Timeout', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html' }
  ]
});
