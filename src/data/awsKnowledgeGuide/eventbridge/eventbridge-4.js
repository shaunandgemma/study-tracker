import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-4',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'EventBridge Event-Driven Architecture',
  status: 'ready',
  plainEnglish: 'Amazon EventBridge is a serverless event bus service that simplifies building event-driven architectures. In an event-driven architecture, microservices communicate by emitting JSON events when state changes occur (e.g. `OrderCreated`, `PaymentProcessed`), rather than making direct synchronous API calls to each other. EventBridge ingests events from AWS services, custom apps, or SaaS partners, matches them against rules, and routes them to target destinations.',
  whyItMatters: 'Direct point-to-point API connections couple microservices tightly together: if Service A goes down or changes its API, Service B breaks. EventBridge decouples microservices so producers emit events without needing to know which consumers process them.',
  workplaceExample: 'An e-commerce app emits an `OrderPlaced` JSON event to EventBridge. EventBridge evaluates rules and routes the event to 3 targets simultaneously: a Lambda function for email confirmation, an SQS queue for inventory processing, and Kinesis Firehose for analytics.',
  examFocus: 'SAA-C03 Event-Driven Design advantages:\n- Loose Coupling: Publishers do not know or care who consumes events.\n- High Scalability & Resilience: Failure in a consumer service does not block the event producer.\n- Asynchronous Processing: Replaces synchronous HTTP REST API polling with real-time event pushing.',
  keyPoints: [
    'Serverless event bus for building decoupled, event-driven architectures.',
    'Producers emit JSON events; EventBridge evaluates rules and routes to targets.',
    'Eliminates point-to-point microservice coupling and custom polling code.',
    'Supports events from AWS services, custom microservices, and 3rd-party SaaS apps.',
    'Scales automatically to handle millions of events per second.'
  ],
  commonMistake: 'Building synchronous HTTP REST API calls between 10 microservices instead of using EventBridge for asynchronous event fan-out, causing cascading outages when one downstream API fails.',
  example: 'Sample EventBridge JSON Event Payload:\n`{ "source": "com.mycompany.orders", "detail-type": "OrderPlaced", "detail": { "orderId": "ord-1001", "amount": 49.99, "customerId": "c-55" } }`',
  sources: [
    { title: 'What is Amazon EventBridge?', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html' }
  ]
});
