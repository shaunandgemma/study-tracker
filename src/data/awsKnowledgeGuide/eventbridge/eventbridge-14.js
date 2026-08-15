import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-14',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Event Archive',
  status: 'ready',
  plainEnglish: 'EventBridge Event Archive allows you to record and store JSON events emitted to an event bus into an encrypted immutable archive. You can archive ALL events passing through an event bus or filter specific events using an event pattern filter. You specify an archive retention period ranging from 1 day to indefinitely.',
  whyItMatters: 'Event Archive provides auditing, compliance logging, and historical record-keeping. Storing events permanently in an archive allows developers to inspect past event history or reprocess historical events after fixing bugs.',
  workplaceExample: 'A fintech app enables Event Archive on its `PaymentsBus` with indefinite retention. Every financial transaction event published to the bus is automatically archived for regulatory compliance auditing.',
  examFocus: 'SAA-C03 Event Archive capabilities:\n- Archives events from a default, custom, or partner event bus.\n- Configurable retention period: 1 day to unlimited (0 days = retain indefinitely).\n- Event Pattern Filters: Archive all events or only specific matching event types.\n- Encrypted at rest automatically by AWS.',
  keyPoints: [
    'Stores historical JSON events emitted to an event bus.',
    'Configurable retention window (1 day to indefinite).',
    'Supports Event Pattern filters to archive selective event types.',
    'Enables historical compliance auditing and Event Replay.',
    'Encrypted at rest automatically.'
  ],
  commonMistake: 'Failing to configure an event filter on an Archive for a high-volume event bus, resulting in archiving millions of unneeded debug events and inflating storage costs.',
  example: 'Creating an Archive via AWS CLI:\n`aws events create-archive --archive-name PaymentsArchive --event-source-arn arn:aws:events:us-east-1:123456789012:event-bus/PaymentsBus --retention-days 365`',
  sources: [
    { title: 'Archiving and Replaying Events in Amazon EventBridge', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-archive.html' }
  ]
});
