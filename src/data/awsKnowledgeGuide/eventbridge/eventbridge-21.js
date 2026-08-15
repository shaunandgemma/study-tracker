import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-21',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'EventBridge vs CloudWatch Events',
  status: 'ready',
  plainEnglish: 'Amazon EventBridge is the evolution of CloudWatch Events. EventBridge uses the exact same underlying service engine and API as CloudWatch Events, but expands upon it by introducing advanced features such as SaaS Partner Event Buses (Salesforce, Zendesk), Schema Registry, Event Archive & Replay, EventBridge Pipes, and EventBridge Scheduler.',
  whyItMatters: 'Existing CloudWatch Events rules and APIs automatically work in EventBridge without modification. However, AWS recommends using EventBridge for all new event-driven applications.',
  workplaceExample: 'A company with existing CloudWatch Events rules migrates to EventBridge. All existing rules appear automatically in EventBridge under the `default` event bus, allowing the team to add Event Archive and SaaS Partner integrations seamlessly.',
  examFocus: 'SAA-C03 Architectural Relationship:\n- EventBridge IS CloudWatch Events (built on top of the same underlying API).\n- All CloudWatch Events rules run automatically on the EventBridge `default` event bus.\n- EventBridge adds: Custom Event Buses, Partner Event Buses, Schema Registry, Archive & Replay, EventBridge Pipes, and API Destinations.\n- AWS recommendation: Use Amazon EventBridge for all new implementations.',
  keyPoints: [
    'Amazon EventBridge is the upgraded successor to CloudWatch Events.',
    'Built on the same underlying infrastructure engine and API model.',
    'All CloudWatch Events rules appear on the EventBridge `default` event bus.',
    'EventBridge adds SaaS Partner integrations, Schema Registry, Archive & Replay, and Pipes.',
    'Recommended by AWS as the standard event bus for all new solutions.'
  ],
  commonMistake: 'Thinking CloudWatch Events and EventBridge are completely separate competing services. EventBridge is the modern, feature-expanded version of CloudWatch Events.',
  example: 'API Equivalency:\nCloudWatch Events API: `PutRule`, `PutTargets` -> Native EventBridge API: `PutRule`, `PutTargets` (Identical API commands).',
  sources: [
    { title: 'What is Amazon EventBridge?', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html' }
  ]
});
