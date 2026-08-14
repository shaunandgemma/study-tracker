import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'health-1',
  topicId: 'topic-aws-health',
  topicTitle: 'AWS Health Dashboard',
  objectiveCode: 'Operations',
  title: 'AWS Health Dashboard & Account-Specific Events',
  status: 'ready',
  plainEnglish: 'AWS Health shows events that can affect AWS services, accounts, and resources. Service health events are public reports about the availability of an AWS service or Region. Account-specific events are personalised to resources or planned changes in your account, such as maintenance for a particular EC2 instance. When signed in, the AWS Health Dashboard separates open and recent issues, scheduled changes, other notifications, and the 90-day event log.',
  whyItMatters: 'A service can appear generally healthy while one of your resources still needs action. AWS Health helps operations teams identify the affected account, Region, service, and resource so they can respond to incidents and planned maintenance before users are affected.',
  workplaceExample: 'AWS schedules maintenance for one production EC2 instance. The public service-health page may show no broad EC2 outage, but the account-specific event identifies the instance, start time, Region, and recommended action. The team checks the affected-resources tab, moves traffic if necessary, and records the event in its change calendar.',
  examFocus: 'Distinguish public service health from personalised account health. Use AWS Health when a question asks which AWS event affects a specific account or resource, or where to find planned lifecycle and maintenance events. The dashboard is the human-readable view; EventBridge and AWS User Notifications provide automated delivery; the AWS Health API provides programmatic access and has support-plan requirements.',
  keyPoints: [
    'Public events describe service availability and are not specific to one AWS account.',
    'Account-specific events can identify affected resources in your account or organization.',
    'Open and recent issues show current events, while Scheduled changes shows upcoming work that may require action.',
    'The Event log provides filterable AWS Health events from the previous 90 days.',
    'Organizational view aggregates Health events across AWS Organizations accounts and can use a delegated administrator.'
  ],
  commonMistake: 'Checking only the public service-health page and concluding that AWS is not involved. Sign in to AWS Health and inspect Your account health, the event details, and affected resources before ruling out an AWS event.',
  example: 'An application is unavailable on one EC2 instance. First check AWS Health for an account-specific EC2 event in the correct Region. Open the event, read its update timeline, inspect Affected resources, and compare the listed instance ID with the application instance before taking action.',
  sources: [
    { title: 'Viewing your account events in the AWS Health Dashboard', url: 'https://docs.aws.amazon.com/health/latest/ug/aws-health-account-views.html' },
    { title: 'Concepts for AWS Health', url: 'https://docs.aws.amazon.com/health/latest/ug/aws-health-concepts-and-terms.html' },
    { title: 'Aggregating AWS Health events across accounts', url: 'https://docs.aws.amazon.com/health/latest/ug/aggregate-events.html' }
  ]
});
