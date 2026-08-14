import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-27',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch vs CloudTrail',
  status: 'ready',
  plainEnglish: 'CloudWatch is primarily an observability service: it works with metrics, logs, traces, alarms, and dashboards to show resource utilization, application performance, and operational health. CloudTrail records AWS activity, especially actions made through the console, CLI, SDKs, and APIs, so you can investigate who or what made a change. They answer different questions and are commonly used together.',
  whyItMatters: 'During an incident, CloudWatch can show when performance degraded and which telemetry changed, while CloudTrail can identify a preceding control-plane action and the identity that requested it. Combining them shortens root-cause analysis and supports operational and security investigations.',
  workplaceExample: 'A database starts rejecting connections at 14:05. CloudWatch graphs and logs show the timing and customer impact. CloudTrail events reveal that an administrator changed a security group shortly before the failure. The team restores the rule and adds monitoring around future changes.',
  examFocus: 'Choose CloudWatch for performance monitoring, numerical thresholds, log analysis, dashboards, and automated alarm actions. Choose CloudTrail when the clue asks who called an AWS API, which source IP or role made a change, or for an activity record. CloudTrail event history provides a Regional record of recent management events, while trails or event data stores support longer-term and broader recording needs. CloudTrail events can be delivered to CloudWatch Logs when log-based monitoring is required.',
  keyPoints: [
    'CloudWatch focuses on operational telemetry and resource or application health.',
    'CloudTrail focuses on AWS account activity and API actions.',
    'CloudWatch answers what is unhealthy; CloudTrail often helps answer who changed what.',
    'The services complement rather than replace each other.',
    'CloudTrail delivery to CloudWatch Logs enables log queries, metric filters, and alarms on recorded activity.'
  ],
  commonMistake: 'Searching CPU metrics to identify who modified a security group will not provide the actor, while searching CloudTrail alone may not show application latency impact. Start with the question being asked, then correlate timestamps and resource identifiers across both services.',
  example: 'If a CloudWatch alarm shows an error spike at 14:05, search CloudTrail around that time for management events affecting the resource. Verify the event name, resource, Region, caller identity, and request details without copying sensitive event content into tickets unnecessarily.',
  sources: [
    { title: 'AWS CloudTrail or Amazon CloudWatch? decision guide', url: 'https://docs.aws.amazon.com/decision-guides/latest/cloudtrail-or-cloudwatch/cloudtrail-or-cloudwatch.html' },
    { title: 'Working with CloudTrail event history', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html' },
    { title: 'What is Amazon CloudWatch?', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html' }
  ]
});
