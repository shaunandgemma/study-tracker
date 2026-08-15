import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-12',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Cross-Account Event Buses',
  status: 'ready',
  plainEnglish: 'Cross-Account Event Buses allow an EventBridge event bus in one AWS account (e.g. Account A) to send events directly to an EventBridge event bus in a different AWS account (e.g. Account B). This cross-account event routing relies on combining an EventBus Resource Policy in Account B with an EventBridge Rule targeting Account B\'s event bus ARN in Account A.',
  whyItMatters: 'In multi-account enterprise architectures (AWS Organizations), events originating in regional member accounts (e.g. Security, Dev, Staging) need to be centralized into a Master Governance or Security Monitoring account for auditing and compliance.',
  workplaceExample: 'An enterprise centralizes GuardDuty security findings. GuardDuty events in member account `111111111111` are matched by an EventBridge rule and routed directly to the Central Security Account\'s event bus (`222222222222`).',
  examFocus: 'SAA-C03 Cross-Account Event Setup:\n1. Target Account B: Attach an Event Bus Resource Policy trusting Account A ID or AWS Organization ID.\n2. Source Account A: Create an EventBridge Rule with Target set to Account B\'s Event Bus ARN.\n3. Note: In Account B, a separate rule is needed on Account B\'s event bus to process incoming events and forward them to targets (e.g. Lambda, SQS).',
  keyPoints: [
    'Enables routing events between EventBridge event buses in different AWS accounts.',
    'Requires an Event Bus Resource Policy on the target event bus.',
    'Supports sharing across an entire AWS Organization via `aws:PrincipalOrgID`.',
    'Target in Account A is Account B\'s Event Bus ARN (`arn:aws:events:region:AccountB:event-bus/name`).',
    'Essential for centralizing multi-account logging, security, and enterprise telemetry.'
  ],
  commonMistake: 'Expecting an event sent from Account A directly to Account B\'s event bus to invoke Account B\'s Lambda target automatically. Account B MUST have its own rule on its event bus matching the incoming event.',
  example: 'Cross-Account Rule Target ARN in Account A:\n`Target ARN: arn:aws:events:us-east-1:222222222222:event-bus/CentralSecurityBus`',
  sources: [
    { title: 'Sending and receiving Amazon EventBridge events between AWS accounts', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cross-account.html' }
  ]
});
