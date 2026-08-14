import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-15', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail SNS Notifications', status: 'ready',
  plainEnglish: 'A trail can publish an SNS notification whenever it writes new log files to the S3 destination. The message identifies the bucket and object keys, allowing subscribers or processing systems to retrieve the new files.',
  whyItMatters: 'Delivery notifications can start downstream ingestion, archival, or security processing without repeatedly listing the S3 bucket.',
  workplaceExample: 'CloudTrail sends delivery notifications to SNS, an SQS queue subscribes to the topic, and a log processor consumes the messages reliably before analysing the referenced files.',
  examFocus: 'These SNS messages report log-file delivery, not necessarily one alert per API call. A busy account can generate many messages, so AWS recommends programmatic consumption such as SQS rather than direct email or SMS for volume processing.',
  keyPoints: ['SNS notification delivery is optional.', 'A message lists newly delivered S3 log object keys.', 'SQS can buffer notifications for reliable processing.', 'The topic policy must allow CloudTrail publishing.', 'Source ARN or source account conditions strengthen the topic policy.'],
  commonMistake: 'Expecting an SNS delivery notification to contain a complete real-time security event for each API call.',
  example: 'Subscribe an encrypted SQS queue to the topic, parse each S3 object key, retrieve the compressed log, and make processing idempotent.',
  sources: [{ title: 'Configuring SNS notifications for CloudTrail', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/configure-sns-notifications-for-cloudtrail.html' }, { title: 'CloudTrail security best practices', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/best-practices-security.html' }]
});
