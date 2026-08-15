import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-18",
  "title": "Execution History",
  "plainEnglish": "AWS Step Functions Execution History is the built-in observability and audit logging system that records every event, state transition, input payload, output result, and error that occurs during a state machine execution. For Standard Workflows, Step Functions maintains a detailed, chronologically ordered event log in the AWS Management Console and via the `GetExecutionHistory` API for 90 days after an execution completes, providing complete forensic visibility and visual graph debugging.",
  "whyItMatters": "Debugging failures in distributed multi-service architectures is notoriously difficult when logs are scattered across dozens of separate Lambda functions, ECS containers, and API gateways. Step Functions Execution History consolidates all state inputs, outputs, timestamps, and error messages into a single unified event timeline, enabling developers to pinpoint exactly which state failed and why in seconds.",
  "workplaceExample": "A billing operations team investigates a customer complaint regarding a failed subscription renewal. The support engineer opens the Step Functions console, locates the customer's execution by ARN, and inspects the Execution History visual graph. The graph immediately highlights the `ChargeCreditCard` state in red. Expanding the state event details reveals the exact error response from the card issuer: `HTTP 402: Card Expired`, allowing support to resolve the issue with the customer immediately.",
  "examFocus": "Understand Step Functions Execution History storage and monitoring: (1) Standard Workflow Retention: Execution history is retained automatically for 90 days in the AWS Management Console and API at zero extra charge. (2) Express Workflow Logging: Express Workflows do NOT retain visual history in the console; you MUST enable Amazon CloudWatch Logs integration to inspect Express execution events. (3) CloudWatch Logs Export: Standard Workflows can also stream full execution history logs to CloudWatch Logs for long-term archiving and metric filter alarms. (4) AWS X-Ray: Enables distributed tracing across all downstream Lambda functions and AWS services.",
  "keyPoints": [
    "Chronological event log capturing every state entry, transition, input, output, and failure.",
    "Standard Workflows retain visual execution history for 90 days in the AWS Console and API.",
    "Express Workflows stream execution history and event logs directly to Amazon CloudWatch Logs.",
    "Provides visual graph inspection in the console with color-coded success and failure states.",
    "Integrates with AWS X-Ray for end-to-end distributed tracing across microservices.",
    "Integrates with Amazon EventBridge to emit state change events (`RUNNING`, `SUCCEEDED`, `FAILED`)."
  ],
  "commonMistake": "Expecting to find visual execution history in the Step Functions console for Express Workflows. Express Workflows only log execution events to Amazon CloudWatch Logs; ensure CloudWatch logging is enabled on Express state machines for troubleshooting.",
  "example": "Retrieve the chronological execution history events for a Standard Workflow execution using the AWS CLI: aws stepfunctions get-execution-history --execution-arn arn:aws:states:us-east-1:123456789012:execution:OrderWorkflow:Exec-12345 --max-items 50.",
  "sources": [
    {
      "title": "Viewing and Managing State Machine Executions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-executions.html"
    },
    {
      "title": "Logging Execution History with CloudWatch Logs in Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/cw-logs.html"
    }
  ]
});
