import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-18",
  "title": "Lambda Concurrency",
  "plainEnglish": "Lambda Concurrency is the number of execution environments actively handling in-flight requests at any given moment in time. When an event arrives and all existing execution environments are busy, AWS Lambda initializes a new instance of your function to handle the concurrent request. Concurrency is calculated as: Invocations Per Second multiplied by Average Execution Duration (in seconds).",
  "whyItMatters": "Understanding concurrency is essential for preventing application throttling and managing account-level capacity. By default, AWS accounts share a regional pool of 1,000 concurrent executions across all functions. If one function experiences a massive traffic spike and consumes all 1,000 concurrent executions, all other Lambda functions in that AWS Region will be starved and return 429 Too Many Requests errors.",
  "workplaceExample": "An e-commerce website receives 500 orders per second. Each order checkout Lambda function takes an average of 400 milliseconds (0.4 seconds) to execute. The concurrent execution requirement is: 500 * 0.4 = 200 concurrent executions. If execution duration increases to 2 seconds due to slow database queries, concurrency jumps to 1,000 (500 * 2), exhausting the entire regional concurrency quota.",
  "examFocus": "Know the concurrency formula, quotas, and throttling mechanisms: (1) Concurrency = (Invocations / second) * (Average Duration in seconds). (2) Default regional account limit is 1,000 (can be increased via Service Quotas). (3) Unreserved Concurrency Pool: At least 100 concurrency units must remain unreserved in the account. (4) Throttling errors: Synchronous callers receive HTTP 429 Too Many Requests; asynchronous events are queued for up to 6 hours.",
  "keyPoints": [
    "Measures the total number of function instances actively processing requests at any given moment.",
    "Calculated using Little's Law: Concurrency = Invocations per second * Average execution duration in seconds.",
    "Default regional account quota is 1,000 concurrent executions, shared across all functions in that Region.",
    "If concurrency limit is exceeded, synchronous invocations return a 429 (Too Many Requests) throttling error.",
    "Asynchronous invocations that are throttled are retried automatically by Lambda's internal queue for up to 6 hours.",
    "CloudWatch metrics 'ConcurrentExecutions' and 'Throttles' monitor real-time concurrency demand."
  ],
  "commonMistake": "Ignoring execution duration when calculating concurrency needs. Slowing down a function from 100ms to 1,000ms multiplies its concurrency consumption by 10x for the exact same incoming request volume.",
  "example": "Inspect current account concurrency limits using the AWS CLI: aws lambda get-account-settings, which returns the AccountLimit (e.g., TotalConcurrentExecutions: 1000, UnreservedConcurrentExecutions: 1000).",
  "sources": [
    {
      "title": "Managing AWS Lambda Function Concurrency",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"
    },
    {
      "title": "Understanding Lambda Concurrency Scaling",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-scaling.html"
    }
  ]
});
