import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-11', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail Log Delivery to Amazon S3', status: 'ready',
  plainEnglish: 'A trail groups JSON event records into compressed log files and delivers them to a configured S3 bucket and prefix. The bucket policy must allow the CloudTrail service to check the bucket ACL and write objects with the required ownership control.',
  whyItMatters: 'S3 provides durable central retention that can be protected with versioning, Object Lock, lifecycle rules, restrictive access policies, and separate security ownership.',
  workplaceExample: 'Audit logs from every account are delivered to a dedicated log-archive bucket, transitioned to lower-cost storage after 90 days, and retained according to compliance rules.',
  examFocus: 'CloudTrail delivery is not instantaneous. Protect the bucket against public access and unauthorized deletion, and remember that S3 storage, requests, encryption, and lifecycle transitions can incur charges.',
  keyPoints: ['Trail files are delivered to an S3 bucket.', 'The bucket policy must authorize CloudTrail delivery.', 'Prefixes separate accounts, Regions, and log types.', 'Lifecycle rules manage long-term storage cost.', 'Versioning, Object Lock, and restrictive policies strengthen retention.'],
  commonMistake: 'Replacing the generated bucket policy without preserving the CloudTrail service statements and source conditions, causing delivery failures.',
  example: 'Verify the trail status and inspect AWSLogs/account-id/CloudTrail/Region/date paths after generating a known management event.',
  sources: [{ title: 'Create a trail with the CloudTrail console', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-create-and-update-a-trail-by-using-the-console.html' }, { title: 'Amazon S3 bucket policy for CloudTrail', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/create-s3-bucket-policy-for-cloudtrail.html' }, { title: 'Working with CloudTrail log files', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html' }]
});
