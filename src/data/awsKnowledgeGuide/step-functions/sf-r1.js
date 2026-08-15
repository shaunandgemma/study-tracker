import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-r1",
  "title": "Standard Workflows vs Express Workflows - Duration, Exactly-Once vs At-Least-Once, and Use Case Selection",
  "plainEnglish": "AWS Step Functions offers two distinct workflow types: Standard Workflows and Express Workflows. Standard Workflows are designed for long-running (up to 1 year), auditable, mission-critical business processes that require an exactly-once execution model, visual step-by-step debugging in the AWS Console, and support for human approval callback tokens. Express Workflows are designed for high-volume, short-duration (up to 5 minutes) event-processing workloads (such as IoT telemetry ingestion, streaming data transformations, or high-throughput API backends) that process over 100,000 events per second at a fraction of the cost.",
  "whyItMatters": "Selecting the wrong workflow type can lead to either budget-breaking costs on high-frequency streaming events or failed business transactions if a long-running workflow times out after 5 minutes. Choosing Standard vs Express aligns your architecture with the proper execution duration, transaction guarantees, and cost structure.",
  "workplaceExample": "An e-commerce platform uses both workflow types: (1) An Express Workflow ingests and filters 20,000 clickstream events per second from Amazon Kinesis into Amazon Timestream in under 2 seconds per execution at low cost. (2) When a user places an order, a Standard Workflow orchestrates payment capture, fraud analysis, warehouse packaging, and pauses for up to 3 days waiting for a carrier tracking callback token, recording the complete step history for customer support auditing.",
  "examFocus": "Know the key differences between Standard and Express Workflows: (1) Maximum Duration: Standard = 1 Year; Express = 5 Minutes. (2) Execution Model: Standard = Exactly-once execution; Express = At-least-once (Asynchronous) or At-most-once (Synchronous). (3) Pricing: Standard = Billed per state transition ($0.025 per 1,000 transitions); Express = Billed per execution count, execution duration (billed in 100ms increments), and memory consumption. (4) Execution History: Standard = Full visual step history retained for 90 days in console/API; Express = Execution logs streamed to Amazon CloudWatch Logs (no visual console history). (5) Task Tokens: Standard supports `.waitForTaskToken` (callbacks); Express does not support long-polling task tokens.",
  "keyPoints": [
    "Standard Workflows: Long-running (up to 1 year), exactly-once execution, billed per state transition.",
    "Express Workflows: Short-duration (up to 5 minutes), high-throughput (>100,000/sec), billed per execution and duration.",
    "Standard retains 90-day visual step-by-step execution history in the AWS Console and API.",
    "Express logs execution history exclusively to Amazon CloudWatch Logs.",
    "Standard supports human approval and long-running callback patterns using `.waitForTaskToken`.",
    "Workflow type is defined at creation time and cannot be converted dynamically on an existing state machine."
  ],
  "commonMistake": "Using a Standard Workflow to process millions of IoT sensor events per hour. At $0.025 per 1,000 state transitions, processing millions of continuous events in Standard Workflows generates excessive bills; use Express Workflows for high-throughput event processing.",
  "example": "Create an Express Workflow state machine via the AWS CLI by specifying the `EXPRESS` type: aws stepfunctions create-state-machine --name 'HighThroughputLogProcessor' --definition file://statemachine.json --role-arn arn:aws:iam::123456789012:role/StepFunctionsExecutionRole --type EXPRESS.",
  "sources": [
    {
      "title": "Standard vs. Express Workflows in AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html"
    },
    {
      "title": "AWS Step Functions Pricing and Execution Models",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/workflow-types.html"
    }
  ]
});
