import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-32",
  "title": "S3 Replication Time Control - RTC",
  "plainEnglish": "Amazon S3 Replication Time Control (S3 RTC) is an enterprise service level agreement (SLA) feature for S3 replication that guarantees 99.99% of newly uploaded objects are replicated to their destination bucket within 15 minutes. In addition to a financially backed SLA, S3 RTC provides real-time Amazon CloudWatch metrics and Amazon EventBridge notifications to monitor replication latency and track replication compliance.",
  "whyItMatters": "Standard S3 replication is asynchronous with no time guarantee—during peak network events or large batch uploads, replication can take hours. Regulated financial institutions, healthcare providers, and high-availability global services with strict Recovery Point Objectives (RPO <= 15 minutes) require guaranteed replication times and real-time audit telemetry to prove disaster recovery compliance.",
  "workplaceExample": "A digital stock exchange stores trade execution receipts in `us-east-1` and replicates them to `us-west-2` for disaster recovery. Under financial compliance rules, trade data must be present in the secondary region within 15 minutes of execution. The exchange enables S3 RTC on its replication rule, setting a CloudWatch Alarm on `ReplicationLatency > 900 seconds`. RTC guarantees 99.99% of trades replicate within 15 minutes, fulfilling compliance audits.",
  "examFocus": "Understand S3 Replication Time Control (RTC) SLA and telemetry: (1) SLA Guarantee: Replicates 99.99% of new objects within 15 minutes (supported for both CRR and SRR). (2) Detailed CloudWatch Metrics: Publishes `ReplicationLatency` (seconds), `BytesPendingReplication`, and `OperationsPendingReplication`. (3) EventBridge Notifications: Emits events when an object takes longer than 15 minutes to replicate. (4) Pricing: Charged a small fee per GB replicated under RTC plus replication data transfer.",
  "keyPoints": [
    "Provides a 99.99% financially backed SLA to replicate new objects within 15 minutes.",
    "Supported for both Cross-Region Replication (CRR) and Same-Region Replication (SRR).",
    "Publishes real-time CloudWatch metrics: `ReplicationLatency`, `BytesPendingReplication`, `OperationsPendingReplication`.",
    "Emits Amazon EventBridge alerts if an object exceeds the 15-minute replication threshold.",
    "Essential for meeting strict regulatory Recovery Point Objectives (RPO) of 15 minutes or less.",
    "Requires S3 Versioning enabled on participating general-purpose buckets."
  ],
  "commonMistake": "Believing standard S3 replication guarantees immediate or 15-minute replication without RTC. Standard replication is best-effort and can experience variable lag; only S3 Replication Time Control (RTC) provides a 15-minute SLA.",
  "example": "Enable S3 Replication Time Control on a replication rule in JSON: {\"Status\": \"Enabled\", \"Priority\": 1, \"Destination\": {\"Bucket\": \"arn:aws:s3:::dr-target-bucket\", \"ReplicationTime\": {\"Status\": \"Enabled\", \"Time\": {\"Minutes\": 15}}, \"Metrics\": {\"Status\": \"Enabled\", \"EventThreshold\": {\"Minutes\": 15}}}}.",
  "sources": [
    {
      "title": "Meeting Compliance Requirements with S3 Replication Time Control (S3 RTC)",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-time-control.html"
    },
    {
      "title": "Monitoring Replication Progress with S3 RTC Metrics",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-rtc-monitoring.html"
    }
  ]
});
