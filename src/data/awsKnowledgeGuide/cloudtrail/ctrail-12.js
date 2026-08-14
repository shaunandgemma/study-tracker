import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-12', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail Integration with CloudWatch Logs', status: 'ready',
  plainEnglish: 'A trail can also send events to a CloudWatch Logs log group. CloudWatch can search recent records, apply metric filters to matching JSON fields, create metrics, and alarm through services such as SNS when sensitive API activity occurs.',
  whyItMatters: 'S3 is suited to durable audit retention, while CloudWatch Logs supports operational searching and near-real-time alerting on selected activity.',
  workplaceExample: 'A metric filter matches root-user activity or unauthorized API calls. A CloudWatch alarm notifies the security team when the metric is greater than zero.',
  examFocus: 'CloudTrail records the API activity; CloudWatch Logs stores and analyses delivered events; metric filters turn matching records into metrics; alarms evaluate those metrics. A CloudTrail-to-Logs role must permit delivery to the chosen log group.',
  keyPoints: ['CloudWatch Logs delivery is optional.', 'The integration requires an IAM role for CloudTrail.', 'Metric filters can identify security-sensitive patterns.', 'Alarms act on metrics rather than raw log text.', 'Log retention should be configured to control cost.'],
  commonMistake: 'Creating a metric filter but no alarm or notification target, then expecting the operations team to be alerted.',
  example: 'Deliver the trail to a log group, create a filter for ConsoleLogin failures, publish a metric, and alarm when failures cross the chosen threshold.',
  sources: [{ title: 'Sending events to CloudWatch Logs', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html' }, { title: 'Monitoring CloudTrail log files with CloudWatch Logs', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/monitor-cloudtrail-log-files-with-cloudwatch-logs.html' }]
});
