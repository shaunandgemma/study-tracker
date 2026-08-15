import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-11',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Scheduled Events',
  status: 'ready',
  plainEnglish: 'Scheduled Events in Amazon EventBridge (also managed via EventBridge Scheduler) allow you to trigger automated actions on a recurring schedule or at a specific point in time. Schedules can be defined using Rate Expressions (e.g. `rate(5 minutes)`) or Cron Expressions (e.g. `cron(0 12 * * ? *)`).',
  whyItMatters: 'Scheduled Events serve as a modern, cloud-native replacement for legacy OS crontabs or cron servers. They run serverlessly without maintaining dedicated EC2 scheduler instances.',
  workplaceExample: 'A financial system triggers a night-end settlement Lambda function every weeknight at 11:00 PM UTC using an EventBridge Cron rule: `cron(0 23 ? * MON-FRI *)`.',
  examFocus: 'SAA-C03 Scheduling Syntax:\n- Rate Expressions: `rate(value unit)` (e.g., `rate(1 hour)`, `rate(1 day)`).\n- Cron Expressions: 6 fields: `cron(Minutes Hours Day-of-month Month Day-of-week Year)`.\n- EventBridge Scheduler: Supports one-time point-in-time schedules and recurring schedules across time zones with flexible maintenance windows.',
  keyPoints: [
    'Triggers automated AWS target actions on recurring or one-time schedules.',
    'Replaces legacy OS cron jobs with serverless cloud scheduling.',
    'Supports Rate Expressions (`rate(10 minutes)`) and Cron Expressions.',
    'EventBridge Scheduler supports timezone-aware schedules and one-time execution.',
    'Integrates with Lambda, Systems Manager, Step Functions, and SQS targets.'
  ],
  commonMistake: 'Specifying both Day-of-month and Day-of-week in a Cron expression without using `?` for one of them, causing a Cron syntax error.',
  example: 'Scheduled Cron Rule Example:\n`cron(0 8 ? * MON *)` -> Triggers every Monday morning at 08:00 AM UTC.',
  sources: [
    { title: 'Schedule Expressions in Amazon EventBridge', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-patterns.html' }
  ]
});
