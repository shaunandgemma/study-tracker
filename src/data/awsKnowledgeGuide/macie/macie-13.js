import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-13',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'EventBridge Integration',
  status: 'ready',
  plainEnglish: 'Amazon Macie publishes policy and sensitive-data finding events to Amazon EventBridge. An EventBridge rule can filter those events and route matching findings to targets such as AWS Lambda, Amazon Simple Notification Service (Amazon SNS), or a ticketing integration. EventBridge moves the signal; it does not determine whether the data is truly sensitive or make every remediation safe.',
  whyItMatters: 'Automated routing reduces the delay between a finding and human review. Different rules can notify a bucket owner, create a security ticket, or start a tightly controlled response workflow while keeping sensitive values out of broad notification channels.',
  workplaceExample: 'A rule matches new high-severity Macie findings and sends a minimal notification to an SNS topic. A second rule sends selected public-access policy findings to a Lambda workflow that gathers context and opens a ticket, but requires approval before changing a bucket policy.',
  examFocus: 'EventBridge is the native event-routing choice for Macie findings; SNS is a possible notification target and Lambda is a possible processing target. Security Hub aggregates supported findings in AWS Security Finding Format but does not perform discovery. Suppressed Macie findings are archived automatically and are not published to EventBridge or Security Hub CSPM.',
  keyPoints: [
    'Macie automatically publishes new policy and sensitive-data findings to EventBridge as events.',
    'Rules can filter on documented event fields before sending data to a target.',
    'SNS can notify responders, while Lambda can enrich, ticket, or perform narrowly approved actions.',
    'Finding events should avoid spreading sensitive samples into logs, messages, or tickets.',
    'Suppression rules prevent matching future findings from being published to supported destinations.',
    'Automated remediation needs least-privilege permissions, testing, failure handling, and an evidence-preserving sequence.'
  ],
  commonMistake: 'Giving a Lambda target broad permission to delete any object named in a finding risks data loss and ignores false positives, retention, legal holds, and business use. Start with notification and evidence gathering, then allow only narrowly defined, reversible access-control actions under governance.',
  example: 'Create a rule using sample Macie findings or a controlled fictional-data test, route it first to a test target, and verify account, Region, bucket, object, severity, and finding type. Send only non-sensitive metadata to the ticket, require review before access changes, and document the final finding status.',
  sources: [
    { title: 'Processing Macie findings with Amazon EventBridge', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-monitor-events-eventbridge.html' },
    { title: 'Configuring publication settings for Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-publish-frequency.html' },
    { title: 'Evaluating Macie findings with AWS Security Hub CSPM', url: 'https://docs.aws.amazon.com/macie/latest/user/securityhub-integration.html' },
    { title: 'Suppressing Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-suppression.html' }
  ]
});
