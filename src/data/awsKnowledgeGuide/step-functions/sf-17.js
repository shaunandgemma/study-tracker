import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-17",
  "title": "Human Approval and Callback Patterns",
  "plainEnglish": "Human Approval and Callback Patterns in AWS Step Functions allow a state machine to pause execution indefinitely and wait for an external signal, human decision, or third-party background process before resuming. By configuring a Task state with the `.waitForTaskToken` suffix, Step Functions generates a unique cryptographic 'Task Token', passes it to an external destination (such as publishing an Amazon SQS message, sending an Amazon SNS email, or calling a webhook), and pauses the workflow until an external application calls the `SendTaskSuccess` or `SendTaskFailure` API with that exact token.",
  "whyItMatters": "Many real-world business workflows cannot be automated 100% end-to-end; they require human validation (such as a manager approving a large expense, a compliance officer signing off on a document, or waiting days for physical delivery). Step Functions callback tokens pause the workflow for minutes, days, or months at zero compute cost, automatically resuming the exact state when approval is granted.",
  "workplaceExample": "A corporate expense reimbursement system uses a Step Functions Standard Workflow. For expense claims over $5,000, a Task state uses `.waitForTaskToken` to publish a message containing the token to an Amazon SQS queue. A serverless email service sends an email to the department VP with 'Approve' and 'Reject' links containing the token. Three days later, the VP clicks 'Approve', which triggers an API Gateway endpoint that calls `SendTaskSuccess(taskToken, output)`. Step Functions immediately unpauses and disburses the payment.",
  "examFocus": "Understand Task Token mechanics for the AWS certification exams: (1) Resource Suffix: Configured by appending `.waitForTaskToken` to the service resource ARN (e.g., `arn:aws:states:::sqs:sendMessage.waitForTaskToken`). (2) Context Object: Retrieve the generated token from the Step Functions Context Object using `TaskToken: \"States.JsonToString($$.Task.Token)\"`. (3) Resuming APIs: External systems resume the workflow by calling `SendTaskSuccess` (to advance with data) or `SendTaskFailure` (to trigger an error/Catch block). (4) Standard Workflows Only: Callback task tokens are supported on Standard Workflows (up to 1 year duration); Express Workflows do not support long-lived task tokens.",
  "keyPoints": [
    "Pauses state machine execution to wait for external processes or human decisions.",
    "Configured using the `.waitForTaskToken` service integration pattern.",
    "Generates a unique Task Token passed to the external service via context object `$$.Task.Token`.",
    "External applications resume execution via `SendTaskSuccess` or `SendTaskFailure` API calls.",
    "Standard Workflows can pause for up to 1 year while waiting for callbacks at zero compute charge.",
    "Ideal for human approval gates, legacy mainframe batch integrations, and third-party SaaS webhooks."
  ],
  "commonMistake": "Attempting to implement a multi-day human approval callback on an Express Workflow. Express Workflows have a hard 5-minute timeout limit and do not support long-lived task tokens; use Standard Workflows for human approval and long-running callback patterns.",
  "example": "Configure a Task state that sends a message to SQS and waits for a callback task token in Amazon States Language: {\"Type\": \"Task\", \"Resource\": \"arn:aws:states:::sqs:sendMessage.waitForTaskToken\", \"Parameters\": {\"QueueUrl\": \"https://sqs.us-east-1.amazonaws.com/123456789012/ApprovalQueue\", \"MessageBody\": {\"ClaimId.$\": \"$.claimId\", \"TaskToken\": \"States.JsonToString($$.Task.Token)\"}}, \"Next\": \"DisburseFunds\"}.",
  "sources": [
    {
      "title": "Callback Pattern with Task Token in AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token"
    },
    {
      "title": "Implementing Human Approvals and Callbacks with Step Functions and SQS",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/callback-task-sample-sqs.html"
    }
  ]
});
