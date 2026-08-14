import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-18', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail vs CloudWatch', status: 'ready',
  plainEnglish: 'CloudTrail records account and API activity: who did what, when, where, and with which request. CloudWatch monitors operational behaviour through metrics, logs, dashboards, alarms, and related observability features. They solve different problems and are commonly integrated.',
  whyItMatters: 'An operator may need CloudWatch to discover that latency increased and CloudTrail to determine which configuration change happened just before it.',
  workplaceExample: 'A CloudWatch alarm detects high application errors. CloudTrail then shows that a deployment role changed a security group at the same time.',
  examFocus: 'Choose CloudTrail for API auditing, governance, identity activity, and change attribution. Choose CloudWatch for performance metrics, application logs, dashboards, alarms, and operational monitoring. Send CloudTrail events to CloudWatch Logs when API patterns must generate metrics and alarms.',
  keyPoints: ['CloudTrail focuses on API and account activity.', 'CloudWatch focuses on resource and application observability.', 'CloudTrail Event history retains recent management events.', 'CloudWatch alarms evaluate metrics.', 'The services complement rather than replace each other.'],
  commonMistake: 'Searching EC2 CPU metrics in CloudTrail or looking in CloudWatch metrics for the identity that terminated an instance.',
  example: 'Use CloudWatch to answer why the service is slow and CloudTrail to answer who changed its AWS configuration.',
  sources: [{ title: 'AWS CloudTrail or Amazon CloudWatch?', url: 'https://docs.aws.amazon.com/decision-guides/latest/cloudtrail-or-cloudwatch/cloudtrail-or-cloudwatch.html' }, { title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }]
});
