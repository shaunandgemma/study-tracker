import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-22',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch with SNS',
  status: 'ready',
  plainEnglish: 'Amazon Simple Notification Service (SNS) is a publish-and-subscribe messaging service. A CloudWatch alarm can publish a state-change notification to an SNS topic, and the topic fans that message out to its configured subscribers, such as email addresses, HTTPS endpoints, SQS queues, Lambda functions, or other supported endpoints. Subscriptions that require confirmation must be confirmed before they receive notifications.',
  whyItMatters: 'SNS separates the alarm from its recipients. Engineers can add or change responders and systems at the topic without rebuilding the metric alarm, and one alarm message can reach several destinations.',
  workplaceExample: 'A production composite alarm publishes to an Operations topic. The topic sends email to the on-call distribution list and a message to an incident-processing SQS queue. A separate non-production topic avoids waking the production team.',
  examFocus: 'Choose SNS when the requirement is alarm notification or fan-out. The alarm evaluates its metric using period, evaluation periods, datapoints to alarm, threshold, comparison operator, and missing-data treatment; SNS only distributes the resulting state-change message. EventBridge is better when routing many event types by event-pattern fields, whereas SNS is direct pub/sub fan-out. The topic and alarm must be in a supported configuration and the topic policy must permit CloudWatch publishing.',
  keyPoints: [
    'A CloudWatch alarm publishes a notification to an SNS topic on configured state transitions.',
    'The SNS topic fans one publication out to its subscriptions.',
    'Some subscription protocols require confirmation before delivery begins.',
    'Topic policies and subscriber permissions must allow the intended delivery path.',
    'Use separate topics or filtering architecture to keep audiences appropriate.'
  ],
  commonMistake: 'Creating an email subscription but never confirming it leaves the alarm apparently configured while no email arrives. Confirm the subscription, verify its status, test the alarm safely, and inspect alarm history and SNS delivery troubleshooting information if needed.',
  example: 'Attach the production alarm’s ALARM action to an SNS topic ARN such as arn:aws:sns:REGION:ACCOUNT_ID:operations. Replace REGION, ACCOUNT_ID, and the topic name with real non-secret identifiers. Expect one notification when the alarm enters ALARM; verify the alarm history, confirmed subscription, and received message.',
  sources: [
    { title: 'Set up Amazon SNS notifications', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/US_SetupSNS.html' },
    { title: 'Amazon SNS event destinations for CloudWatch alarms', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Notify_Users_Alarm_Changes.html' },
    { title: 'Amazon SNS subscriptions', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html' }
  ]
});
