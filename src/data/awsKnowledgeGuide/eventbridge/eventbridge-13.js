import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-13',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Event Bus Resource Policies',
  status: 'ready',
  plainEnglish: 'An Event Bus Resource Policy is a resource-based IAM policy attached directly to an EventBridge event bus. It defines which AWS accounts, IAM roles, or AWS Organizations are permitted to publish events (`events:PutEvents`) to that event bus or manage rules on it.',
  whyItMatters: 'Resource policies establish boundary security for event buses. They grant external AWS accounts permission to publish events into your event bus without sharing long-term IAM user access keys.',
  workplaceExample: 'A central operations team attaches a Resource Policy to their central event bus that allows all accounts within their AWS Organization (`o-a1b2c3d4e5`) to publish custom events using the `aws:PrincipalOrgID` condition.',
  examFocus: 'SAA-C03 Resource Policy permissions:\n- Action: `events:PutEvents`.\n- Principal: AWS Account ID or `*` with condition.\n- Condition: Use `aws:PrincipalOrgID` to grant permissions to all member accounts in an AWS Organization automatically.',
  keyPoints: [
    'Resource-based policy attached directly to an EventBridge event bus.',
    'Grants permissions to external AWS accounts or Organizations to call `PutEvents`.',
    'Supports `aws:PrincipalOrgID` condition for organization-wide trust.',
    'Eliminates managing static cross-account IAM credentials.',
    'Prevents unauthorized external accounts from publishing events into your bus.'
  ],
  commonMistake: 'Wildcarding the Principal in an Event Bus Resource Policy without a Condition block, allowing ANY AWS account on the internet to inject events into your event bus.',
  example: 'Event Bus Resource Policy JSON:\n{\n  "Statement": [{\n    "Sid": "AllowOrganizationPutEvents",\n    "Effect": "Allow",\n    "Principal": "*",\n    "Action": "events:PutEvents",\n    "Resource": "arn:aws:events:us-east-1:111122223333:event-bus/CentralBus",\n    "Condition": { "StringEquals": { "aws:PrincipalOrgID": "o-a1b2c3d4e5" } }\n  }]\n}',
  sources: [
    { title: 'Permissions for Amazon EventBridge Event Buses', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html' }
  ]
});
