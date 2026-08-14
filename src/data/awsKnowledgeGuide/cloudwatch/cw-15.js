import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-15',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'Log Groups and Log Streams',
  status: 'ready',
  plainEnglish: 'A log event is one timestamped message. A log stream is an ordered sequence of events from a common source, such as one application instance. A log group contains related streams and is the management boundary for settings including retention, access control, metric filters, and subscriptions. Each stream belongs to one group, and a group can contain many streams.',
  whyItMatters: 'A sensible grouping design lets engineers apply the right retention and permissions to related data and search an application as a whole while still identifying the source stream. It also makes routing and metric extraction manageable.',
  workplaceExample: 'An autoscaled web tier writes all production access logs to /company/prod/web-access. Each changing EC2 instance uses its own stream. Responders query the group across the fleet, while the stream name helps isolate one unhealthy host.',
  examFocus: 'Recognize the hierarchy: event inside stream inside group. Retention, subscriptions, and metric filters are configured at the log-group level and apply to its streams. Separate groups when workloads need different retention, access, or routing—not merely because a new instance starts.',
  keyPoints: [
    'Log events are timestamped activity records.',
    'A log stream normally represents one source of related events.',
    'A log group contains streams with shared management settings.',
    'Retention is configured on the log group and expired events are deleted automatically.',
    'Metric and subscription filters attached to a group process its streams.'
  ],
  commonMistake: 'Creating a new log group per ephemeral container or instance makes permissions, retention, and queries difficult to manage. Group sources with the same purpose and controls, then distinguish each source with its stream.',
  example: 'Use /orders/prod/application as the group and instance-or-task-specific values as stream names. Verify that new events arrive in the correct stream, the group retention is intentional, and access permissions are scoped to the group’s sensitivity.',
  sources: [
    { title: 'Amazon CloudWatch Logs concepts', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html' },
    { title: 'Working with log groups and log streams', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html' }
  ]
});
