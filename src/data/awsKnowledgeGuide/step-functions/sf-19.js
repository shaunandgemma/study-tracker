import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-19",
  "title": "Step Functions for Workflow Orchestration",
  "plainEnglish": "AWS Step Functions for Workflow Orchestration is an enterprise architectural pattern where Step Functions acts as the centralized 'orchestrator' (conductor) that coordinates distributed microservices, serverless functions, container workloads, and third-party APIs into a cohesive business process. Unlike event choreography (where services emit and react to messages independently), orchestration centralizes state management, error handling, retries, and compensation logic in a single visual state machine.",
  "whyItMatters": "In large enterprise microservice architectures, choreography via event buses can quickly become chaotic and difficult to trace (often called 'pinball architecture'), with no single service knowing the overall status of an end-to-end customer order. Step Functions orchestration provides a single source of truth for workflow state, coordinates multi-step business transactions, and natively implements the Saga Pattern for distributed rollbacks.",
  "workplaceExample": "A global airline builds a flight booking system. When a passenger books a flight, Step Functions orchestrates four independent microservices: (1) Payment Service charges the credit card, (2) Seat Allocation Service assigns the seat on the aircraft, (3) Frequent Flyer Service credits reward points, and (4) Notification Service emails the boarding pass. If the Seat Allocation Service fails because the last seat was taken, Step Functions catches the error and executes compensating rollback tasks—refunding the credit card and alerting the customer.",
  "examFocus": "Understand Orchestration vs Choreography and Step Functions use cases: (1) Orchestration (Step Functions): Centralized coordinator; explicit state machine definition; manages timeouts, parallel branches, and rollbacks (Saga pattern); easy to visualize and debug. (2) Choreography (EventBridge / SQS / SNS): Decentralized; services react to events independently without a central coordinator; highly decoupled but harder to track end-to-end status. (3) Hybrid Approach: Best practice is often hybrid—use EventBridge to choreograph events between major business domains, and use Step Functions to orchestrate workflows within a domain.",
  "keyPoints": [
    "Centralized orchestration service coordinating microservices, containers, and serverless functions.",
    "Provides a single source of truth for end-to-end distributed business process state.",
    "Natively implements the Saga Pattern to coordinate distributed transaction rollbacks.",
    "Contrasts with event choreography by providing explicit state management and visual tracking.",
    "Eliminates complex custom coordination code and nested callback dependencies.",
    "Best practice for payment processing, order fulfillment, data pipelines, and IT automation."
  ],
  "commonMistake": "Attempting to manage complex 10-step transactional business processes purely using asynchronous Amazon EventBridge events without a central coordinator. When an error occurs at step 7, coordinating compensating rollbacks across steps 1 through 6 without Step Functions requires writing complex custom state-tracking code.",
  "example": "Architecture pattern: Use an Amazon EventBridge rule to match an `OrderPlaced` event and trigger an AWS Step Functions state machine that orchestrates payment, inventory reservation, and shipping dispatch.",
  "sources": [
    {
      "title": "What is AWS Step Functions?",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html"
    },
    {
      "title": "Common Use Cases for AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/use-cases.html"
    }
  ]
});
