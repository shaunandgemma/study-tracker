import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-14',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch Logs',
  status: 'ready',
  plainEnglish: 'CloudWatch Logs stores timestamped log events: detailed records written by applications, operating systems, and AWS services. Events from one source form a log stream, and related streams belong to a log group that shares retention, monitoring, and access settings. Logs explain individual events; metrics summarize numerical behavior; traces connect the steps of a request across services.',
  whyItMatters: 'Engineers use logs to investigate errors, audit application behavior, search request details, and create derived signals. Retention policies control how long events remain, subscriptions stream matching incoming data to supported destinations, metric filters turn patterns into metrics, and Logs Insights performs interactive analysis.',
  workplaceExample: 'A Lambda function starts returning errors. The team queries its log group for exception messages and request IDs, correlates the time with an error metric alarm, and fixes a failed downstream call. A retention policy removes old operational logs according to the organization’s requirement.',
  examFocus: 'Use Logs Insights for interactive queries across stored log data, metric filters when matching ingested events must become a durable numerical metric for graphs or alarms, and subscription filters for ongoing delivery to a consumer. Retention is set per log group; without a retention policy, log data is kept indefinitely. Export tasks copy a time range to S3, but AWS recommends subscriptions instead of recurring exports for continuous archiving.',
  keyPoints: [
    'A log event contains a timestamp and message.',
    'A log stream groups events from a common source.',
    'A log group applies shared retention, monitoring, and access settings to streams.',
    'Logs Insights queries stored events; metric filters create metrics during ingestion.',
    'Subscription filters continuously deliver matching incoming events to supported services.'
  ],
  commonMistake: 'Leaving every log group at indefinite retention can create avoidable storage cost, while shortening retention without an archive can remove needed evidence. Set retention from operational and compliance requirements, and use an appropriate S3 export or subscription architecture when longer storage is required.',
  example: 'For application instances writing the same kind of access log, use one /app/prod/access log group and a separate stream per source. Set the group retention deliberately, then verify a recent event appears in the expected stream and that the retention column shows the intended policy.',
  sources: [
    { title: 'Amazon CloudWatch Logs concepts', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html' },
    { title: 'Working with log groups and log streams', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html' },
    { title: 'Exporting log data to Amazon S3', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3Export.html' }
  ]
});
