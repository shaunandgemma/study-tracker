import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'health-2',
  topicId: 'topic-aws-health',
  topicTitle: 'AWS Health Dashboard',
  objectiveCode: 'Operations',
  title: 'AWS Health EventBridge Integration & Notifications',
  status: 'ready',
  plainEnglish: 'AWS Health sends events to Amazon EventBridge with the source aws.health. An EventBridge rule filters the events you care about, such as scheduled changes for EC2, and routes matching events to a target such as an SNS topic, Lambda function, or incident workflow. AWS User Notifications is the managed option for configuring human notifications and delivery channels without building the same routing workflow yourself.',
  whyItMatters: 'Engineers should not have to keep a dashboard open to discover maintenance or resource-impacting events. Automated routing can notify the right team, create an operational ticket, or start a controlled response as soon as a relevant AWS Health event arrives.',
  workplaceExample: 'A platform team creates an EventBridge rule for account-specific issue and scheduled-change events from aws.health. The target is an SNS topic subscribed by the operations team. The notification includes the affected service, event category, status, impacted Region, and resource details so the team can assess the event quickly.',
  examFocus: 'Choose EventBridge when AWS Health events must trigger automation or route to another AWS service. Match the exact source aws.health, then narrow the event pattern using detail fields such as service, eventTypeCategory, eventScopeCode, or statusCode. Do not confuse the top-level EventBridge region, where the notification was delivered, with detail.eventRegion, which identifies the Region affected by the Health event.',
  keyPoints: [
    'AWS Health events use the EventBridge source aws.health.',
    'A rule can match public events, account-specific events, or selected services and event categories.',
    'Useful detail fields include service, eventTypeCode, eventTypeCategory, eventScopeCode, statusCode, and eventRegion.',
    'The top-level region is the delivery Region; detail.eventRegion is the impacted Region.',
    'Use communicationId with the account ID when a consumer needs to de-duplicate related messages.',
    'EventBridge supports automated targets, while AWS User Notifications provides managed user-facing notifications.'
  ],
  commonMistake: 'Using a wildcard such as aws.health* for the source or filtering on the top-level region as though it were the affected Region. Use the exact aws.health source and inspect detail.eventRegion when the impacted Region matters.',
  example: 'To notify operations about planned EC2 work, create a rule whose event pattern uses source aws.health and filters detail.service to EC2 and detail.eventTypeCategory to scheduledChange. Send matches to an approved notification target, test the target permissions, and verify that the message exposes the event status and affected resources.',
  sources: [
    { title: 'Configuring an EventBridge rule for AWS Health events', url: 'https://docs.aws.amazon.com/health/latest/ug/creating-event-bridge-events-rule-for-aws-health.html' },
    { title: 'AWS Health events EventBridge schema', url: 'https://docs.aws.amazon.com/health/latest/ug/aws-health-events-eventbridge-schema.html' },
    { title: 'Monitoring account-specific and public AWS Health events', url: 'https://docs.aws.amazon.com/health/latest/ug/about-public-events.html' },
    { title: 'Concepts for AWS Health', url: 'https://docs.aws.amazon.com/health/latest/ug/aws-health-concepts-and-terms.html' }
  ]
});
