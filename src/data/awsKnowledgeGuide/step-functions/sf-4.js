import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-4",
  "title": "Step Functions State Machines",
  "plainEnglish": "An AWS Step Functions State Machine is a cloud workflow defined as a structured sequence of discrete steps called 'states'. Written in declarative JSON using the Amazon States Language (ASL) or designed visually using Workflow Studio, a state machine outlines how data enters the workflow, which tasks are executed (such as calling AWS Lambda functions, submitting AWS Batch jobs, or inserting DynamoDB items), how decisions are branched, how errors are retried, and how final results are returned.",
  "whyItMatters": "Hardcoding multi-step business logic, distributed error retries, and compensation flows inside monolithic application code or nested Lambda callbacks creates fragile, unmaintainable architectures. State machines decouple orchestration logic from business logic, making complex distributed systems easy to visualize, test, modify, and audit.",
  "workplaceExample": "A digital payment gateway builds a merchant onboarding workflow as a Step Functions State Machine: (1) An initial Task state verifies business registration documents via Amazon Textract, (2) A Choice state checks the verification confidence score, (3) A Parallel state concurrently runs a background credit check and sets up a merchant billing profile in Stripe, and (4) A final Task state sends a welcome notification via Amazon SNS.",
  "examFocus": "Understand State Machine structure and execution fundamentals: (1) Amazon States Language (ASL): JSON-based schema containing top-level fields: `StartAt` (the initial state name) and `States` (the object containing all defined state definitions). (2) Transitions: States transition to subsequent states using the `Next` field or terminate using `\"End\": true`. (3) State Machine vs Execution: The State Machine is the static blueprint/definition; an Execution is an individual instance of running that definition with specific input data. (4) Payload Limit: Maximum execution input/output and state-to-state payload size is 256 KB (use Amazon S3 object pointers for larger datasets).",
  "keyPoints": [
    "Declarative workflow definition written in Amazon States Language (ASL) JSON schema.",
    "Composed of individual states linked by transitions (`Next`) or termination (`End: true`).",
    "Separates workflow orchestration logic from backend application compute logic.",
    "Can be authored visually in AWS Step Functions Workflow Studio or programmatically as code.",
    "Enforces a maximum payload size limit of 256 KB between state transitions.",
    "Requires an IAM Execution Role (`states.amazonaws.com`) granting permissions to invoke target services."
  ],
  "commonMistake": "Attempting to pass multi-megabyte payloads (such as large images or video files) directly through state machine transitions. Step Functions enforces a strict 256 KB payload limit; write large payloads to Amazon S3 and pass the S3 bucket and key string through the workflow states.",
  "example": "Basic Amazon States Language (ASL) definition for a two-step state machine: {\"Comment\": \"Simple Order Flow\", \"StartAt\": \"ProcessPayment\", \"States\": {\"ProcessPayment\": {\"Type\": \"Task\", \"Resource\": \"arn:aws:lambda:us-east-1:123456789012:function:ChargeCard\", \"Next\": \"SendReceipt\"}, \"SendReceipt\": {\"Type\": \"Task\", \"Resource\": \"arn:aws:sns:us-east-1:123456789012:OrderReceipts\", \"End\": true}}}.",
  "sources": [
    {
      "title": "State Machine Concepts in AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-state-machine-structure.html"
    },
    {
      "title": "Amazon States Language Specification",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html"
    }
  ]
});
