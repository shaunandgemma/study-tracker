import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-28',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch vs AWS Config',
  status: 'ready',
  plainEnglish: 'CloudWatch observes how resources and applications behave through metrics, logs, traces, alarms, and dashboards. AWS Config records configuration items—point-in-time descriptions of supported resources and their relationships—and can evaluate those configurations against Config rules for compliance. CloudWatch asks whether the system is healthy; Config asks what the resource is configured like, how that configuration changed, and whether it meets a rule.',
  whyItMatters: 'Architects need both runtime visibility and configuration governance. CloudWatch detects symptoms such as latency or errors, while Config can identify drift, show configuration history, and flag resources that violate an intended setting.',
  workplaceExample: 'CloudWatch reports a sudden increase in rejected connections. AWS Config’s resource timeline shows that the database security group configuration changed shortly before the spike, and a Config rule now marks the resource noncompliant. The team fixes the configuration and watches CloudWatch confirm recovery.',
  examFocus: 'Choose CloudWatch for utilization, performance, log analysis, telemetry thresholds, and operational actions. Choose AWS Config for resource inventory, supported-resource configuration history and relationships, or compliance evaluation with managed or custom rules. Choose CloudTrail when the question specifically asks which principal made an API call. EventBridge can route Config compliance-change events or CloudWatch alarm events to automation, but it does not replace either service’s evaluation role.',
  keyPoints: [
    'CloudWatch monitors runtime health and application or infrastructure telemetry.',
    'AWS Config records supported resource configurations and relationships.',
    'Config rules evaluate resources as compliant or noncompliant with desired settings.',
    'Configuration history helps identify when resource state changed.',
    'CloudWatch, Config, and CloudTrail provide complementary operational evidence.'
  ],
  commonMistake: 'Creating a CloudWatch metric alarm to prove that every S3 bucket follows a configuration standard confuses runtime telemetry with compliance. Use an appropriate AWS Config rule for the configuration requirement, and use CloudWatch only for operational signals that need monitoring.',
  example: 'For a storage incident, use a Config timeline to inspect whether a supported bucket setting changed, CloudTrail to identify the API caller when needed, and CloudWatch metrics or logs to assess operational impact. Verify that Config recording covers the resource type and Region before relying on its history.',
  sources: [
    { title: 'AWS Config terminology and concepts', url: 'https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html' },
    { title: 'How AWS Config works', url: 'https://docs.aws.amazon.com/config/latest/developerguide/how-does-config-work.html' },
    { title: 'What is Amazon CloudWatch?', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html' }
  ]
});
