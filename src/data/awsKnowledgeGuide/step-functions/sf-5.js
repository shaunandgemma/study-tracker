import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-5",
  "title": "Standard Workflows",
  "plainEnglish": "A Standard Workflow is the default, fully featured workflow type in AWS Step Functions, engineered for long-running, auditable, and business-critical operations. Standard Workflows can run for up to one year per execution, provide an exactly-once execution model for state transitions, preserve a complete visual step-by-step execution history in the AWS Console for 90 days, and support callback patterns with task tokens (`.waitForTaskToken`) to pause workflows indefinitely for human approval or external third-party webhooks.",
  "whyItMatters": "Core business transactions (such as loan underwriting, multi-stage order fulfillment, account migrations, and automated disaster recovery failover) cannot tolerate duplicated execution or lost state information. Standard Workflows guarantee deterministic state progression, complete visual auditability for regulatory compliance, and the ability to pause and wait for external asynchronous events without paying for idle compute time.",
  "workplaceExample": "A home mortgage lender builds a loan approval state machine as a Standard Workflow. The workflow runs automated property title checks via Lambda, calculates debt ratios, and then enters a `.waitForTaskToken` state that pauses the workflow and emails a human underwriter. The underwriter takes 4 days to review the appraisal report before clicking 'Approve'. The webhook sends the task token back to Step Functions, resuming the workflow to disburse funds. The lender retains full execution history for 90 days for financial audits.",
  "examFocus": "Understand Standard Workflow characteristics: (1) Maximum Execution Duration: Up to 1 year (365 days). (2) Execution Model: Exactly-once state execution. (3) Execution Rate: Up to 2,000 execution starts per second (with burst capacity). (4) Pricing: Billed per state transition ($0.025 per 1,000 state transitions); idle time in Wait states or Task Token callbacks is 100% free. (5) Human Approval / Callbacks: Supports `.waitForTaskToken` (cannot be done on Express). (6) Redrive: Supports redriving failed Standard Workflow executions from the failed state without restarting from the beginning.",
  "keyPoints": [
    "Default Step Functions workflow type for long-running, mission-critical business processes.",
    "Supports an execution duration of up to 1 year (365 days).",
    "Provides an exactly-once execution model for state transitions.",
    "Preserves complete step-by-step visual execution history in the AWS Console for 90 days.",
    "Supports human approvals and asynchronous callbacks using `.waitForTaskToken`.",
    "Features execution redrive to resume failed executions directly from the failed state."
  ],
  "commonMistake": "Running a continuously polling EC2 instance or sleeping Lambda function to wait for human approval. Standard Workflows pause execution with `.waitForTaskToken` at zero compute cost while waiting up to 1 year for an approval response.",
  "example": "Start a Standard Workflow execution using the AWS CLI: aws stepfunctions start-execution --state-machine-arn arn:aws:states:us-east-1:123456789012:stateMachine:MortgageApprovalWorkflow --name LoanApp-2026-001 --input '{\"loanId\": \"L-10928\", \"amount\": 450000}'.",
  "sources": [
    {
      "title": "Standard Workflows in AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html"
    },
    {
      "title": "Starting and Managing State Machine Executions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-executions.html"
    }
  ]
});
