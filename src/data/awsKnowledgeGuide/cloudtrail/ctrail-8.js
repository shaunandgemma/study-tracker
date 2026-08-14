import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-8', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail Trails', status: 'ready',
  plainEnglish: 'A trail is a CloudTrail configuration that continuously selects events and delivers log files to an S3 bucket. It can optionally send events to CloudWatch Logs and EventBridge, use KMS encryption, publish SNS delivery notifications, and enable log file integrity validation.',
  whyItMatters: 'Trails provide durable audit records beyond the 90-day Event history window and support central retention, security monitoring, and forensic evidence.',
  workplaceExample: 'A company creates a multi-Region trail that sends management events to a locked logging bucket, CloudWatch Logs for alarms, and EventBridge for automated response.',
  examFocus: 'A trail is for ongoing S3 delivery, while Event history is a built-in recent view and CloudTrail Lake is a queryable event data store. CloudTrail offers one copy of ongoing management events to S3 without CloudTrail delivery charge, though related S3 and optional-service charges remain.',
  keyPoints: ['Trails deliver event log files to S3.', 'Multi-Region trails are the general best practice.', 'Event selectors control recorded event categories.', 'CloudWatch Logs and EventBridge integrations are optional.', 'Integrity validation and KMS encryption protect different security properties.'],
  commonMistake: 'Creating a trail but never verifying its logging status, bucket policy, encryption permissions, or delivered objects.',
  example: 'After creating a trail, verify logging is active, inspect the latest S3 log prefix, and perform a known API action to confirm delivery.',
  sources: [{ title: 'Working with CloudTrail trails', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-trails.html' }, { title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }]
});
