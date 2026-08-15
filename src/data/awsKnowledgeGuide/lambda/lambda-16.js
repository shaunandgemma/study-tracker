import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-16",
  "title": "Lambda Timeout",
  "plainEnglish": "A Lambda Timeout is the maximum amount of time (in seconds) that AWS Lambda allows your function handler to execute before forcefully terminating the execution. The timeout is configurable from 1 second up to a hard ceiling of 15 minutes (900 seconds), with a default setting of 3 seconds for newly created functions.",
  "whyItMatters": "Setting an appropriate timeout protects your cloud budget from runaway code (such as infinite loops, stalled database connections, or unresponsive external third-party HTTP calls). Conversely, setting a timeout too low will cause legitimate long-running requests or cold-start initializations to be abruptly killed before completing their work.",
  "workplaceExample": "A developer writes an order-sync function that makes an outbound HTTP call to an external supplier API. The supplier's server hangs during an outage. Because the Lambda function's timeout was left at 15 minutes, hundreds of concurrent invocations run for the full 15 minutes waiting for socket responses, exhausting the account's concurrency pool and generating thousands of dollars in wasted compute charges. Adjusting the timeout to 15 seconds with a socket timeout of 5 seconds prevents connection exhaustion.",
  "examFocus": "Understand timeout limits and integration mismatches: (1) Lambda maximum timeout is 15 minutes (900 seconds). (2) Default timeout is 3 seconds. (3) When integrating Lambda with Amazon API Gateway (REST or HTTP APIs), API Gateway enforces an integration timeout limit (default 29 seconds); if Lambda runs longer, API Gateway returns an HTTP 504 Gateway Timeout error even if Lambda continues running.",
  "keyPoints": [
    "Configurable execution duration limit ranging from 1 second to 15 minutes (900 seconds).",
    "Default timeout for newly created Lambda functions is 3 seconds.",
    "When a timeout occurs, Lambda immediately halts code execution and logs a 'Task timed out after X.XX seconds' error in CloudWatch.",
    "Amazon API Gateway has a 29-second maximum integration timeout, which caps synchronous API request durations.",
    "Timeouts should be set slightly higher than the expected p99 execution duration, paired with strict network socket timeouts.",
    "In asynchronous invocations, a function that times out is retried automatically up to twice by the Lambda service."
  ],
  "commonMistake": "Relying on the default 3-second timeout for functions that make external network calls or database queries. Cold starts combined with database connection establishment can easily exceed 3 seconds, causing mysterious invocation failures.",
  "example": "Update a Lambda function timeout to 30 seconds using the AWS CLI: aws lambda update-function-configuration --function-name process-order --timeout 30.",
  "sources": [
    {
      "title": "Configuring Function Timeout in AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-common.html#configuration-timeout-console"
    },
    {
      "title": "AWS Lambda Function Configuration Best Practices",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html"
    }
  ]
});
