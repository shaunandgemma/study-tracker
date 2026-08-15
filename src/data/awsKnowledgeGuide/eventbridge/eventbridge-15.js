import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-15',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Event Replay',
  status: 'ready',
  plainEnglish: 'EventBridge Event Replay allows you to reprocess past events stored in an Event Archive by re-sending them to an event bus or specific rules over a defined time window. When you initiate an Event Replay, EventBridge retrieves the archived events and re-evaluates them against target rules as if they were just emitted in real-time.',
  whyItMatters: 'If a bug in a downstream Lambda function causes 5 hours of order processing failures, fixing the bug code isn\'t enough—you need to re-process the failed orders. Event Replay lets you replay the last 5 hours of archived events to catch up.',
  workplaceExample: 'An order processing Lambda function has a bug that causes failed inventory updates from 2:00 PM to 4:00 PM. Developers deploy a bug fix to Lambda, then start an Event Replay for the `PaymentsArchive` between 14:00 and 16:00 UTC. The fixed Lambda function reprocesses all 1,200 orders successfully.',
  examFocus: 'SAA-C03 Event Replay capabilities:\n- Replays archived events for a specific time range (`StartTime` to `EndTime`).\n- Can replay to all rules on a bus or target specific rule ARNs.\n- Replayed events include an `replay-name` attribute to distinguish replayed events from live real-time events.',
  keyPoints: [
    'Re-evaluates archived events against event rules for a specified time range.',
    'Essential for disaster recovery, bug fix recovery, and dev/test environment seeding.',
    'Replayed events carry unique replay metadata attributes.',
    'Does not disrupt real-time live event streaming on the event bus.',
    'Requires an existing Event Archive with stored events.'
  ],
  commonMistake: 'Replaying events to a production event bus without filtering rules, causing downstream external notification targets (like SMS or email) to send duplicate notifications to customers.',
  example: 'Starting an Event Replay via AWS CLI:\n`aws events start-replay --replay-name FixOrdersReplay --event-source-arn arn:aws:events:us-east-1:123456789012:archive/PaymentsArchive --start-time 2026-08-15T14:00:00Z --end-time 2026-08-15T16:00:00Z --destination arn:aws:events:us-east-1:123456789012:event-bus/PaymentsBus`',
  sources: [
    { title: 'Archiving and Replaying Events in Amazon EventBridge', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-archive.html' }
  ]
});
