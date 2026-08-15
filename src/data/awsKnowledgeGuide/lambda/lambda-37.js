import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-37",
  "title": "Lambda CloudWatch Logs",
  "plainEnglish": "AWS Lambda automatically monitors function executions and sends all standard output (stdout), standard error (stderr), runtime system logs, and structured log events directly to Amazon CloudWatch Logs. Each function automatically streams records into a dedicated CloudWatch Log Group named `/aws/lambda/<function-name>`, creating a separate Log Stream for each active execution environment.",
  "whyItMatters": "Because serverless compute environments are stateless and decommissioned automatically when idle, local file logs are lost when containers terminate. Streaming logs in real time to CloudWatch Logs provides centralized audit trails, error diagnostics, and observability across thousands of distributed concurrent execution environments.",
  "workplaceExample": "A developer investigates an intermittent payment bug. By opening CloudWatch Logs Insights and querying the `/aws/lambda/payment-checkout` log group, they run a query: `fields @timestamp, @message | filter @message like /PaymentFailed/ | sort @timestamp desc | limit 20`, immediately isolating the root cause to an external card gateway timeout across 12 concurrent containers.",
  "examFocus": "Understand Lambda CloudWatch Logs architecture: (1) Default Log Group naming pattern: `/aws/lambda/<function-name>`. (2) IAM Permissions: The function's Execution Role requires permissions to write logs, provided by the managed policy `AWSLambdaBasicExecutionRole` (`logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`). (3) Advanced Logging Controls: Supports structured JSON log format, configurable application log level (DEBUG, INFO, WARN, ERROR), and custom log group targets.",
  "keyPoints": [
    "Automatically streams stdout, stderr, and execution metadata (START, END, REPORT) to Amazon CloudWatch Logs.",
    "Log events are organized under the default log group: `/aws/lambda/<function-name>`.",
    "Each distinct Lambda execution environment generates its own unique Log Stream.",
    "Requires the 'AWSLambdaBasicExecutionRole' managed IAM policy attached to the function's execution role.",
    "Advanced logging controls enable structured JSON format and runtime log-level filtering (DEBUG, INFO, WARN, ERROR).",
    "REPORT log lines summarize key execution metrics: Duration, Billed Duration, Memory Size, Max Memory Used, and Init Duration."
  ],
  "commonMistake": "Failing to attach the `AWSLambdaBasicExecutionRole` policy to a custom Lambda execution role. Without `logs:CreateLogStream` and `logs:PutLogEvents` permissions, the function will execute successfully but produce zero logs in CloudWatch.",
  "example": "Configure advanced JSON structured logging and INFO log level using the AWS CLI: aws lambda update-function-configuration --function-name order-api --logging-config LogFormat=JSON,ApplicationLogLevel=INFO,LogGroup=/aws/lambda/order-api.",
  "sources": [
    {
      "title": "Accessing Amazon CloudWatch Logs for AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html"
    },
    {
      "title": "Configuring Advanced Logging Controls for AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-logging.html"
    }
  ]
});
