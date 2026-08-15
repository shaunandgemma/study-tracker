import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-13",
  "title": "Retry Logic",
  "plainEnglish": "Retry Logic in AWS Step Functions is an automated error-handling mechanism configured inside Task and Parallel states using the `Retry` field. When a task encounters a transient error (such as a downstream database connection timeout, network glitch, or AWS API throttling exception), Step Functions automatically re-attempts execution according to a defined mathematical schedule (with configurable initial delay, backoff rate multiplier, and maximum attempt limits) before declaring the state a failure.",
  "whyItMatters": "Transient network hiccups and microservice throttling are normal in distributed cloud computing. Without built-in retry logic, applications would fail immediately on minor network blips, requiring developers to write complex, error-prone retry loops inside every Lambda function. Step Functions abstracts retry management into declarative configuration with exponential backoff and jitter.",
  "workplaceExample": "A payment processing task invokes a third-party credit card processor API via Lambda. The team attaches a `Retry` block to the Task state: (1) Match error `States.TaskFailed`, (2) Start with `IntervalSeconds: 2`, (3) Apply `BackoffRate: 2.0` (delays retry by 2s, then 4s, then 8s), and (4) Limit to `MaxAttempts: 3`. If the third-party payment gateway suffers a momentary 3-second network glitch, Step Functions retries automatically and succeeds on the second attempt with zero human intervention.",
  "examFocus": "Understand Step Functions Retry parameters and evaluation rules: (1) `ErrorEquals`: Array of error names to match (e.g., `Lambda.ServiceException`, `Lambda.TooManyRequestsException`, or wildcards like `States.ALL`, `States.TaskFailed`, `States.Timeout`). (2) `IntervalSeconds`: Initial delay before the first retry attempt (default 1). (3) `MaxAttempts`: Maximum number of retry attempts (default 3; set to 0 to disable retries). (4) `BackoffRate`: Multiplier by which the retry interval increases after each attempt (default 2.0). (5) Order of Evaluation: Step Functions evaluates retriers from top to bottom; more specific errors should precede generic wildcards like `States.ALL`.",
  "keyPoints": [
    "Declarative error handling that automatically re-executes failed Task and Parallel states.",
    "Configured using the `Retry` array containing one or more Retrier objects.",
    "Core parameters: `ErrorEquals`, `IntervalSeconds`, `MaxAttempts`, and `BackoffRate`.",
    "Applies exponential backoff to avoid overwhelming struggling downstream dependencies.",
    "Evaluates Retriers in strict top-to-bottom order against the thrown error name.",
    "Warning: Retried operations must be idempotent to prevent duplicate side effects (e.g., double billing)."
  ],
  "commonMistake": "Placing a broad wildcard `\"ErrorEquals\": [\"States.ALL\"]` at the top of the `Retry` array before specific error handlers like `\"ErrorEquals\": [\"Lambda.TooManyRequestsException\"]`. Step Functions matches the first applicable retrier from top to bottom, causing the specific retrier below it to be completely ignored.",
  "example": "Configure a Task state with exponential backoff retry logic in Amazon States Language: {\"Type\": \"Task\", \"Resource\": \"arn:aws:lambda:us-east-1:123456789012:function:QueryDatabase\", \"Retry\": [{\"ErrorEquals\": [\"Lambda.TooManyRequestsException\", \"States.Timeout\"], \"IntervalSeconds\": 2, \"MaxAttempts\": 5, \"BackoffRate\": 2.0}, {\"ErrorEquals\": [\"States.TaskFailed\"], \"IntervalSeconds\": 1, \"MaxAttempts\": 2, \"BackoffRate\": 1.5}], \"Next\": \"ProcessData\"}.",
  "sources": [
    {
      "title": "Retrying After an Error in AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html#error-handling-retrying-after-an-error"
    },
    {
      "title": "Error Handling in Amazon States Language",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-errors.html"
    }
  ]
});
