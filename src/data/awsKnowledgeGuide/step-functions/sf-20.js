import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-20",
  "title": "Step Functions vs SQS and EventBridge",
  "plainEnglish": "AWS Step Functions, Amazon Simple Queue Service (SQS), and Amazon EventBridge are three fundamental application integration services in AWS that serve different architectural purposes in modern cloud designs. AWS Step Functions is a stateful workflow orchestration engine that coordinates multi-step processes and manages state transitions. Amazon SQS is a point-to-point message queuing service designed for asynchronous decoupling and load leveling between producer and consumer systems. Amazon EventBridge is a serverless event bus that routes events between microservices, SaaS applications, and AWS services using rule-based filtering.",
  "whyItMatters": "Designing resilient serverless systems requires choosing the right integration pattern for each workload. Misusing a queue for complex state machines leads to brittle custom state tracking, while using Step Functions for simple point-to-point buffering adds unnecessary cost. Knowing when to orchestrate (Step Functions), queue (SQS), or route events (EventBridge) produces optimal, decoupled architectures.",
  "workplaceExample": "A retail application uses all three services in harmony: (1) Amazon EventBridge receives customer events from Stripe and Shopify webhooks and routes `CheckoutCompleted` events to an order processing pipeline, (2) Amazon SQS buffers incoming orders to protect backend fulfillment workers from database connection exhaustion during flash sales, and (3) AWS Step Functions orchestrates the multi-step order fulfillment workflow (charging card, checking fraud, booking courier, sending confirmation).",
  "examFocus": "Compare Step Functions, SQS, and EventBridge on certification exams: (1) AWS Step Functions: Choose when you need stateful multi-step workflow orchestration, conditional branching (`Choice`), parallel task execution (`Parallel`/`Map`), human approvals (`.waitForTaskToken`), and automated retries/rollbacks. (2) Amazon SQS: Choose when you need point-to-point asynchronous message queuing, buffering traffic spikes, decoupling monolithic components, and FIFO message ordering. (3) Amazon EventBridge: Choose when you need publish/subscribe (pub/sub) event routing, schema discovery, SaaS partner integrations (Datadog, Zendesk), and content-based event filtering across multiple subscribers.",
  "keyPoints": [
    "Step Functions: Stateful workflow orchestration coordinating sequential and parallel multi-step tasks.",
    "Amazon SQS: Point-to-point message queuing for asynchronous buffering, decoupling, and load leveling.",
    "Amazon EventBridge: Serverless event bus for pub/sub event choreography and SaaS integrations.",
    "Step Functions provides visual state history, conditional logic, and distributed compensation flows.",
    "SQS absorbs sudden traffic spikes with horizontal consumer auto-scaling and dead-letter queues.",
    "EventBridge filters and fans out events to multiple downstream AWS targets based on JSON schemas."
  ],
  "commonMistake": "Using Amazon SQS queues to coordinate a 5-step stateful business process with rollback requirements. Managing state, timeouts, retries, and rollback logic across 5 separate SQS queues requires extensive custom code; use AWS Step Functions to orchestrate stateful workflows natively.",
  "example": "Architecture pattern: An Amazon EventBridge rule matches an event `source: my.ecommerce, detail-type: OrderPlaced` and targets an AWS Step Functions state machine ARN to initiate the order fulfillment process.",
  "sources": [
    {
      "title": "AWS Step Functions Product Overview and Architecture",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html"
    },
    {
      "title": "What is Amazon EventBridge?",
      "url": "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is-how-it-works-concepts.html"
    }
  ]
});
