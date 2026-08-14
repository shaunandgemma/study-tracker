import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-22",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "DataSync Monitoring with CloudWatch",
  "status": "ready",
  "plainEnglish": "DataSync Monitoring with CloudWatch provides real-time visibility into the health, progress, and performance of your data synchronization tasks. DataSync automatically publishes operational metrics to Amazon CloudWatch (such as BytesTransferred, FilesTransferred, BytesPrepared, and ExecutionTime) and streams detailed event logs to Amazon CloudWatch Logs (logging every transferred, skipped, verified, or failed file at granular log levels).",
  "whyItMatters": "During large-scale data migrations transferring millions of files, operations teams need to track transfer throughput, estimate completion times, and immediately identify specific individual files that failed verification or experienced access denial errors without parsing massive raw console logs.",
  "workplaceExample": "A cloud migration team creates a CloudWatch Dashboard displaying real-time `BytesTransferred` and `FilesTransferred` for their active petabyte migration. They set up a CloudWatch Alarm that triggers an Amazon SNS notification to the DevOps on-call team if task status transitions to `ERROR` or if transfer throughput drops to zero.",
  "examFocus": "For SAA-C03, know how DataSync integrates with CloudWatch: (1) CloudWatch Metrics tracks numerical performance (BytesTransferred, FilesTransferred, ExecutionTime). (2) CloudWatch Logs captures detailed per-file logging (Basic, Transfer, or All). (3) Amazon EventBridge captures state-change events (Task execution SUCCESS/ERROR) to trigger automated serverless alerts.",
  "keyPoints": [
    "Publishes performance metrics (BytesTransferred, FilesTransferred) to Amazon CloudWatch.",
    "Streams granular per-file transfer and verification logs to Amazon CloudWatch Logs.",
    "LogLevel options: OFF, BASIC (errors only), or TRANSFER (logs all transferred files).",
    "Emits state-change events to Amazon EventBridge upon task completion, failure, or cancellation.",
    "Supports CloudWatch Alarms and SNS topics for automated operational alerting."
  ],
  "commonMistake": "Setting CloudWatch Logs logging level to TRANSFER on a dataset containing 500 million files without considering CloudWatch ingestion costs. Use BASIC (errors only) logging for massive file counts unless troubleshooting specific file transfer failures.",
  "example": "# Configure CloudWatch Logs logging on a DataSync task:\naws datasync update-task \\\n  --task-arn arn:aws:datasync:us-east-1:123456789012:task/task-0123456789abcdef0 \\\n  --cloud-watch-log-group-arn arn:aws:logs:us-east-1:123456789012:log-group:/aws/datasync/tasks:* \\\n  --options '{\"LogLevel\":\"BASIC\"}'",
  "sources": [
    {
      "title": "Monitoring AWS DataSync with Amazon CloudWatch",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/monitoring-datasync.html"
    },
    {
      "title": "Logging DataSync Task Executions to CloudWatch Logs",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/monitor-datasync.html#cloudwatch-logs"
    }
  ]
});
