import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-38",
  "title": "Lambda Monitoring with CloudWatch",
  "plainEnglish": "AWS Lambda integrates natively with Amazon CloudWatch to automatically publish operational telemetry and performance metrics in real time. Standard metrics include total invocation counts, execution durations, error rates, concurrent executions, throttled requests, and stream iterator age, enabling automated monitoring, alerting, and performance optimization across all serverless workloads.",
  "whyItMatters": "Operating serverless microservices at scale requires proactive visibility into application health and resource consumption. CloudWatch metrics allow operations teams to set up CloudWatch Alarms that automatically trigger notifications via Amazon SNS or execute automated remediation actions whenever error rates rise or concurrency thresholds are approached.",
  "workplaceExample": "A streaming video service configures a CloudWatch Alarm on the metric `Errors` for their authentication Lambda function. If the error rate exceeds 2% over a 5-minute evaluation period, CloudWatch triggers an SNS notification to the on-call engineer's PagerDuty, while AWS X-Ray traces automatically highlight that an upstream authorization service is returning HTTP 503 errors.",
  "examFocus": "Know key Lambda CloudWatch metrics: (1) `Invocations`: Total number of times function code is executed. (2) `Duration`: Time spent executing handler code (and `BilledDuration`). (3) `Errors`: Invocations that resulted in a function error (unhandled exceptions, timeouts, runtime crashes). (4) `Throttles`: Invocations rejected due to exceeding concurrency limits. (5) `ConcurrentExecutions`: In-flight active environments. (6) `IteratorAge`: For Kinesis/DynamoDB Streams, milliseconds behind the stream head. (7) `DeadLetterErrors`: Failures writing to DLQs.",
  "keyPoints": [
    "Automatically emits performance metrics under the 'AWS/Lambda' CloudWatch namespace.",
    "Core metrics include Invocations, Duration, Errors, Throttles, and ConcurrentExecutions.",
    "For stream event sources (Kinesis, DynamoDB Streams), 'IteratorAge' measures consumer latency lag.",
    "Supports CloudWatch Alarms on Error and Throttle metrics to notify on-call engineers automatically.",
    "Lambda Insights provides enhanced CPU, memory, network, and disk I/O telemetry via a lightweight Lambda Extension.",
    "Integrates with AWS X-Ray for end-to-end distributed tracing across microservices and downstream AWS API calls."
  ],
  "commonMistake": "Ignoring the `IteratorAge` metric for stream-based Lambda consumers. A rising IteratorAge indicates that the function is processing records slower than the ingestion rate, risking data loss when records exceed the stream's retention window.",
  "example": "Create a CloudWatch Alarm to trigger on Lambda function throttles using the AWS CLI: aws cloudwatch put-metric-alarm --alarm-name lambda-throttling-alarm --metric-name Throttles --namespace AWS/Lambda --statistic Sum --period 300 --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold --dimensions Name=FunctionName,Value=order-processor --evaluation-periods 1.",
  "sources": [
    {
      "title": "Working with Lambda Function Metrics",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html"
    },
    {
      "title": "Tracing Lambda Applications with AWS X-Ray",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-x-ray.html"
    }
  ]
});
