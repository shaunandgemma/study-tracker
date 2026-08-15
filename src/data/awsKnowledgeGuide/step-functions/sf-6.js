import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-6",
  "title": "Express Workflows",
  "plainEnglish": "An Express Workflow is a cost-effective, high-throughput workflow type in AWS Step Functions designed specifically for fast, high-volume event-processing workloads that execute in under five minutes. Express Workflows can process over 100,000 events per second and support two invocation models: Asynchronous Express Workflows (at-least-once execution for fire-and-forget event processing) and Synchronous Express Workflows (at-most-once execution that immediately returns the workflow result to the calling client, ideal for microservice and web API backends).",
  "whyItMatters": "Modern serverless architectures frequently process millions of IoT sensor streams, clickstream events, or real-time web API requests. Running these short-lived, high-frequency tasks on Standard Workflows would be cost-prohibitive due to per-transition billing. Express Workflows bill based on execution count, execution duration (measured in 100ms increments), and memory consumption, delivering massive cost savings for high-volume pipelines.",
  "workplaceExample": "A ride-sharing mobile application handles driver GPS location pings. An Amazon API Gateway endpoint invokes a Synchronous Express Workflow for each ping: (1) The workflow validates the driver's JWT token via Lambda, (2) Checks geofencing boundaries against Amazon Location Service, and (3) Updates the driver's live coordinate record in Amazon DynamoDB, returning an HTTP 200 response with nearby available ride requests to the driver's app in under 120 milliseconds.",
  "examFocus": "Understand Express Workflow execution modes and constraints: (1) Maximum Duration: 5 minutes (300 seconds). (2) High Throughput: Supports >100,000 executions per second. (3) Two Invocation Modes: Synchronous (caller waits for workflow result via `StartSyncExecution` API; at-most-once execution) and Asynchronous (fire-and-forget via `StartExecution`; at-least-once execution). (4) Pricing Model: Billed by number of executions + execution duration + memory allocated (similar to AWS Lambda). (5) Execution History: Emits execution telemetry exclusively to Amazon CloudWatch Logs (does NOT maintain console visual history).",
  "keyPoints": [
    "High-throughput, cost-effective workflow type designed for short-duration event processing.",
    "Maximum execution duration is 5 minutes (300 seconds).",
    "Handles massive scale exceeding 100,000 execution starts per second.",
    "Synchronous Express Workflows return results immediately to the calling client (via `StartSyncExecution`).",
    "Asynchronous Express Workflows operate fire-and-forget with at-least-once execution guarantees.",
    "Execution history and detailed audit logs are streamed directly to Amazon CloudWatch Logs."
  ],
  "commonMistake": "Attempting to use an Express Workflow for a multi-day human approval process. Express Workflows have a hard 5-minute timeout limit and do not support long-lived task tokens; long-running business processes must use Standard Workflows.",
  "example": "Execute a Synchronous Express Workflow from a backend API client and wait for the immediate JSON result: aws stepfunctions start-sync-execution --state-machine-arn arn:aws:states:us-east-1:123456789012:stateMachine:DriverLocationSyncWorkflow --input '{\"driverId\":\"D-8821\",\"lat\":37.7749,\"lon\":-122.4194}'.",
  "sources": [
    {
      "title": "Express Workflows in AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html"
    },
    {
      "title": "Synchronous and Asynchronous Express Workflows",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/express-sync-async.html"
    }
  ]
});
