import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-51",
  "title": "S3 CloudWatch Request Metrics",
  "plainEnglish": "Amazon S3 CloudWatch Request Metrics provides real-time, 1-minute interval monitoring of API operations, error rates, and latency for your S3 storage. By enabling request metrics on a bucket (or scoping them to specific key prefixes or object tags), Amazon S3 publishes detailed operational metrics to Amazon CloudWatch—such as total request counts, 4xx client errors, 5xx server errors, First Byte Latency, and data transfer volumes.",
  "whyItMatters": "While basic daily storage metrics only tell you how much disk space you are consuming, CloudWatch Request Metrics provide real-time operational telemetry. They allow engineering teams to detect application performance degradation, troubleshoot sudden spikes in 403 Forbidden or 404 Not Found errors, and trigger automated alarms when 5xx server error rates spike.",
  "workplaceExample": "A streaming platform configures S3 CloudWatch Request Metrics on the prefix `live-hls/`. They create a CloudWatch Alarm on `5xxErrors > 10` for 2 consecutive minutes and another alarm on `FirstByteLatency > 150ms`. When a transient microservice bug causes excessive read throttling, CloudWatch alarms trigger immediately, paging the on-call engineer and auto-scaling backend API worker instances.",
  "examFocus": "Understand S3 CloudWatch Request Metrics specifics: (1) Resolution: 1-minute interval granularity (unlike daily storage metrics). (2) Key Metrics: `AllRequests`, `GetRequests`, `PutRequests`, `DeleteRequests`, `4xxErrors`, `5xxErrors`, `FirstByteLatency` (time to return first byte), and `TotalRequestLatency`. (3) Filtering: Can monitor the entire bucket or filter by Prefix and Object Tags. (4) Pricing: Charged standard CloudWatch custom metric fees per metric filter.",
  "keyPoints": [
    "Delivers real-time 1-minute operational telemetry to Amazon CloudWatch.",
    "Tracks request counts (GET, PUT, DELETE, LIST) and data transfer volumes.",
    "Monitors error rates: `4xxErrors` (client misconfigurations) and `5xxErrors` (service issues).",
    "Measures performance latency: `FirstByteLatency` and `TotalRequestLatency`.",
    "Can be scoped to specific key prefixes or object tags for granular microservice monitoring.",
    "Enables proactive alerting and automated remediation via Amazon CloudWatch Alarms."
  ],
  "commonMistake": "Assuming that S3 CloudWatch Request Metrics are enabled by default on all buckets. Only basic daily storage metrics (BucketSizeBytes, NumberOfObjects) are enabled by default; detailed 1-minute request metrics must be explicitly enabled per bucket or prefix filter.",
  "example": "Enable CloudWatch Request Metrics on an S3 bucket prefix using the AWS CLI: aws s3api put-bucket-metrics-configuration --bucket video-streaming-bucket --id StreamingPrefixMetrics --metrics-configuration '{\"Id\": \"StreamingPrefixMetrics\", \"Filter\": {\"Prefix\": \"live-hls/\"}}'.",
  "sources": [
    {
      "title": "Monitoring Metrics with Amazon CloudWatch in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudwatch-monitoring.html"
    },
    {
      "title": "Creating CloudWatch Metrics Configurations for Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/metrics-configurations.html"
    }
  ]
});
