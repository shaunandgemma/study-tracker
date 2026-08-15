import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-15',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Message Retention Period',
  status: 'ready',
  plainEnglish: 'The Message Retention Period defines the length of time (default 4 days, configurable from 60 seconds up to 14 days) that an unconsumed message remains in an SQS queue before SQS automatically expires and deletes it. Message retention provides a buffer during consumer outages, preserving messages until consumers recover.',
  whyItMatters: 'If consumer microservices crash over a weekend, a 14-day retention period ensures that pending messages accumulate safely in SQS without being lost, allowing workers to process the backlog once restarted.',
  workplaceExample: 'An analytics queue receives daily log events. The engineering team sets `MessageRetentionPeriod = 1209600` (14 days). During an unannounced 3-day database maintenance window, zero log messages are lost.',
  examFocus: 'SAA-C03 Message Retention Limits:\n- Range: 60 seconds to 14 days (1,209,600 seconds).\n- Default Value: 4 days (345,600 seconds).\n- Automatic Expiration: Messages exceeding the retention threshold are deleted automatically by SQS without triggering events.\n- DLQ Retention Rule: Dead-Letter Queue retention should be configured long enough (e.g. 14 days) to allow manual investigation of failed messages.',
  keyPoints: [
    'Configures how long unconsumed messages remain in an SQS queue.',
    'Default retention is 4 days; configurable from 60 seconds up to 14 days.',
    'Protects against data loss during extended downstream consumer worker outages.',
    'SQS automatically purges and deletes messages that exceed the retention period.',
    'DLQ retention should be set to 14 days to provide ample time for debugging.'
  ],
  commonMistake: 'Configuring a 1-day retention period on a DLQ, resulting in failed poison messages being automatically deleted before developers can inspect them on Monday.',
  example: 'Setting Message Retention to 14 Days via AWS CLI:\naws sqs set-queue-attributes --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/my-queue" --attributes MessageRetentionPeriod=1209600',
  sources: [
    { title: 'Amazon SQS Message Retention Period', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-basic-architecture.html' }
  ]
});
