import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-18',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Redrive Policies',
  status: 'ready',
  plainEnglish: 'Redrive Policies configure the relationship between a source SQS queue and its Dead-Letter Queue (DLQ). A Redrive Policy specifies the `deadLetterTargetArn` and the `maxReceiveCount` (how many times a message can be received before being moved to the DLQ). A Redrive Allow Policy on the DLQ specifies which source queues are permitted to use the DLQ.',
  whyItMatters: 'Redrive policies automate dead-letter handling. Configuring Redrive Allow Policies prevents unauthorized or accidental source queues from cluttering shared DLQs with unrelated failed messages.',
  workplaceExample: 'A security team configures a Redrive Allow Policy on `security-events-dlq` setting `redrivePermission = "byQueue"` and listing explicit source queue ARNs. Only authorized security ingestion queues are allowed to redrive failed messages to this DLQ.',
  examFocus: 'SAA-C03 Redrive Policy Attributes:\n- Source Queue Redrive Policy: Specifies `deadLetterTargetArn` and `maxReceiveCount` (1 to 1000).\n- DLQ Redrive Allow Policy: Specifies `redrivePermission` (`allowAll`, `denyAll`, or `byQueue` specifying `sourceQueueArns`).\n- Redrive to Source: SQS supports automated redrive tasks to move messages out of the DLQ back to original source queues after consumer bug fixes.',
  keyPoints: [
    'Configures automated message movement from source queue to Dead-Letter Queue.',
    'Specifies `deadLetterTargetArn` and `maxReceiveCount` receive threshold.',
    'Redrive Allow Policies control which source queues can utilize a specific DLQ.',
    'Redrive permissions options include `allowAll`, `denyAll`, or `byQueue`.',
    'Supports automated redrive tasks to replay inspected messages after bug fixes.'
  ],
  commonMistake: 'Setting `maxReceiveCount = 1`, causing transient worker network glitches to instantly move valid messages to the DLQ without giving the worker a chance to retry.',
  example: 'Configuring a Redrive Allow Policy on a DLQ via AWS CLI:\naws sqs set-queue-attributes --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/orders-dlq" --attributes \'{"RedriveAllowPolicy": "{\\"redrivePermission\\":\\"byQueue\\",\\"sourceQueueArns\\":[\\"arn:aws:sqs:us-east-1:123456789012:orders-queue\\"]}"}\'',
  sources: [
    { title: 'SQS Redrive Policies and Redrive Allow Policies', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html' }
  ]
});
