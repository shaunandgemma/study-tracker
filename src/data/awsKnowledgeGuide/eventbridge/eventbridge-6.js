import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-6',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Custom Event Buses',
  status: 'ready',
  plainEnglish: 'A Custom Event Bus is an event bus that you explicitly create to ingest custom JSON events published by your own microservices, web applications, or internal scripts using the EventBridge `PutEvents` API. Custom event buses isolate custom application events from system-level AWS service events.',
  whyItMatters: 'Using Custom Event Buses establishes clean security boundaries and domain isolation. Different business domains (e.g. `OrdersBus`, `PaymentsBus`, `HRBus`) can manage their own event rules, archive settings, and access control policies independently.',
  workplaceExample: 'A logistics firm creates a Custom Event Bus named `ShipmentTrackingBus`. Microservices publish package tracking updates (`PackageDispatched`, `OutForDelivery`) to this custom bus, keeping custom business telemetry completely separate from the account\'s default AWS system events.',
  examFocus: 'SAA-C03 Custom Event Bus design:\n- Created explicitly by users via console/CLI (`aws events create-event-bus --name MyCustomBus`).\n- Ingests custom events published via the `PutEvents` API.\n- Supports Resource Policies for cross-account event publishing.\n- Supports Event Archive, Event Replay, and Dead-Letter Queues (DLQs).',
  keyPoints: [
    'User-created event bus for ingesting custom application events.',
    'Isolates custom application events from native AWS service system events.',
    'Ingests events via the EventBridge `PutEvents` API call.',
    'Supports fine-grained resource-based access policies.',
    'Allows domain-driven architectural segregation (e.g. FinanceBus vs OrdersBus).'
  ],
  commonMistake: 'Publishing millions of custom application business events to the `default` event bus, cluttering AWS service monitoring rules and creating policy maintenance headaches.',
  example: 'Creating a Custom Event Bus via AWS CLI:\n`aws events create-event-bus --name OrdersBus`\nPublishing Event: `aws events put-events --entries file://order-event.json`',
  sources: [
    { title: 'Amazon EventBridge Event Buses', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html' }
  ]
});
