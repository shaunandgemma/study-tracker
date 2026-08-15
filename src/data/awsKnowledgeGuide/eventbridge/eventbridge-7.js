import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-7',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Partner Event Buses',
  status: 'ready',
  plainEnglish: 'A Partner Event Bus is a specialized event bus used to receive real-time events from third-party Software-as-a-Service (SaaS) partner applications (such as Salesforce, Zendesk, Datadog, PagerDuty, Shopify, or Auth0) directly into your AWS account without writing custom polling code or managing API webhooks.',
  whyItMatters: 'Integrating 3rd-party SaaS platforms traditionally required writing custom API webhook receivers, managing SSL endpoints, and building retry queues. Partner Event Buses allow SaaS applications to stream events directly into AWS via secure, managed AWS EventBridge integrations.',
  workplaceExample: 'A customer support team integrates Zendesk with Amazon EventBridge. When a VIP customer creates a high-priority ticket in Zendesk, Zendesk sends an event directly to the Partner Event Bus in AWS. A rule triggers an AWS Step Functions workflow to escalate the issue instantly.',
  examFocus: 'SAA-C03 Partner Integration details:\n- Connects 3rd-party SaaS applications directly to AWS EventBridge.\n- Workflow: SaaS Partner creates an Event Source -> Customer associates Event Source with a Partner Event Bus in their AWS account.\n- Replaces custom webhook infrastructure with native, secure AWS event streaming.',
  keyPoints: [
    'Receives real-time events from supported 3rd-party SaaS partners (Salesforce, Datadog, Zendesk, etc.).',
    'Eliminates the need to build and maintain custom webhook endpoints or polling code.',
    'Provides secure, direct SaaS-to-AWS event integration.',
    'Requires associating the partner event source with a Partner Event Bus in your account.',
    'Events can be filtered using standard EventBridge rules and routed to any AWS target.'
  ],
  commonMistake: 'Building a public API Gateway + Lambda webhook listener to poll third-party SaaS apps when an official EventBridge Partner Integration exists.',
  example: 'Partner Event Source Association:\n`aws events create-event-bus --name aws.partner/zendesk.com/12345/tickets --event-source-name aws.partner/zendesk.com/12345/tickets`',
  sources: [
    { title: 'Amazon EventBridge SaaS Partner Event Buses', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-saas.html' }
  ]
});
