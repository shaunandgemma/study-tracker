import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-14",
  "title": "Catch Error Handling",
  "plainEnglish": "Catch Error Handling in AWS Step Functions is a fallback mechanism configured inside Task, Parallel, or Map states using the `Catch` field. When a state encounters an error that is either not configured for retries or has exhausted all available `Retry` attempts, the `Catch` block intercepts the failure, captures the error details (error code and cause message), and transitions the workflow to a designated recovery or compensation state instead of crashing the entire execution.",
  "whyItMatters": "Uncontrolled errors in distributed architectures leave transactions in partial or corrupted states (e.g., inventory is reserved but payment fails, leaving items locked). Catch blocks enable resilient error recovery patterns (such as the Saga Pattern), allowing the workflow to execute compensating undo actions (like refunding credit or releasing reserved inventory) and notifying operations teams gracefully.",
  "workplaceExample": "An e-commerce order workflow reserves warehouse stock and attempts to charge the customer's credit card. The payment task has a `Retry` block that tries 3 times. If the card is declined permanently or all retries fail, a `Catch` block catches `States.ALL`, extracts the error details into `$.errorInfo`, and transitions directly to a `ReleaseInventory` compensating state, which releases the reserved stock and notifies the user to update their payment method.",
  "examFocus": "Understand the interplay between Retry and Catch blocks: (1) Execution Order: Step Functions ALWAYS evaluates `Retry` rules first. A `Catch` block is ONLY evaluated if there are no matching retriers OR all retry attempts have been exhausted. (2) `ErrorEquals`: Matches specific error names or wildcards (`States.ALL`, `States.TaskFailed`, `States.Timeout`, `States.Permissions`). (3) `ResultPath`: Injects the error output (containing `Error` and `Cause` strings) into the state input JSON without overwriting existing data. (4) Fallback Transition: Transitions execution to the state defined in the `Next` field.",
  "keyPoints": [
    "Gracefully intercepts unhandled errors and transitions to fallback/recovery states.",
    "Evaluated only after all matching `Retry` attempts have been completely exhausted.",
    "Matches specific error codes (e.g., `CustomAppError`) or built-in errors (`States.ALL`).",
    "Uses `ResultPath` to append error details (`Error` and `Cause`) into the workflow payload.",
    "Enables implementation of the Saga Pattern for distributed transaction rollback.",
    "Prevents unhandled state crashes, ensuring deterministic error management and alerting."
  ],
  "commonMistake": "Believing that defining a `Catch` block skips the `Retry` block. Step Functions will execute all configured `Retry` attempts first; the `Catch` transition is only triggered if the operation still fails after all retries are exhausted.",
  "example": "Configure a Task state with a Catch block that routes failures to an alert state in Amazon States Language: {\"Type\": \"Task\", \"Resource\": \"arn:aws:lambda:us-east-1:123456789012:function:ChargeCustomer\", \"Catch\": [{\"ErrorEquals\": [\"States.ALL\"], \"Next\": \"HandlePaymentFailure\", \"ResultPath\": \"$.errorDetails\"}], \"Next\": \"ShipOrder\"}.",
  "sources": [
    {
      "title": "Fallback States Using Catch in AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html#error-handling-fallback-states"
    },
    {
      "title": "Error Handling and ResultPath in Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-errors.html"
    }
  ]
});
