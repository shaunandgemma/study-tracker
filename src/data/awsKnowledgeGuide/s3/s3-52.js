import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-52",
  "title": "S3 Server Access Logging",
  "plainEnglish": "Amazon S3 Server Access Logging provides detailed records for every request made against an Amazon S3 bucket. When enabled, Amazon S3 collects log records—capturing the requester account/identity, bucket name, request timestamp, action (e.g., `REST.GET.OBJECT`), HTTP response status code, error code, and client User-Agent—and delivers them as compressed log files to a designated target S3 bucket.",
  "whyItMatters": "Server access logs provide an invaluable audit trail for security audits, forensic investigations, and compliance verification (PCI DSS, HIPAA). In the event of an unauthorized data access attempt or unexpected spike in 403 Forbidden errors, server access logs allow security teams to analyze the exact IP addresses, caller identities, and file paths involved.",
  "workplaceExample": "A healthcare provider enables Server Access Logging on its sensitive clinical data bucket, directing logs to a dedicated, restricted `central-audit-logs` bucket with prefix `clinical-access/`. When an internal security review requires auditing who accessed a specific patient's scan 6 months ago, the security analyst runs an Amazon Athena SQL query against the server access log table to identify the requester's IAM ARN, source IP, and timestamp.",
  "examFocus": "Understand Server Access Logging characteristics: (1) Target Bucket Best Practice: ALWAYS deliver logs to a separate, dedicated target bucket (never deliver logs back into the source bucket, which can create an infinite logging loop). (2) Delivery: Best-effort delivery; logs are delivered within a few hours of the request. (3) Free Service: The logging feature itself is completely free; you only pay for storing the log files in the target bucket. (4) Target Bucket Policy: Target bucket must grant the S3 log delivery group permissions.",
  "keyPoints": [
    "Captures detailed connection records for every request made against an S3 bucket.",
    "Logs requester identity, source IP address, request type, HTTP status, and turnaround time.",
    "Delivers periodic compressed log files to a specified target S3 bucket.",
    "Always store logs in a separate target bucket to avoid recursive logging loops.",
    "Feature is free of charge; you only pay for the storage of the resulting log files.",
    "Delivered on a best-effort basis for security auditing, compliance, and traffic analysis."
  ],
  "commonMistake": "Setting the target bucket for server access logs to be the same source bucket without configuring a strict prefix filter. Every log file written by S3 triggers a new write event, resulting in a recursive loop that inflates storage and request fees.",
  "example": "Enable server access logging on a source bucket targeting a centralized logs bucket using the AWS CLI: aws s3api put-bucket-logging --bucket production-assets --bucket-logging-status '{\"LoggingEnabled\": {\"TargetBucket\": \"central-audit-logs\", \"TargetPrefix\": \"production-assets/\"}}'.",
  "sources": [
    {
      "title": "Amazon S3 Server Access Logging Overview",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerLogs.html"
    },
    {
      "title": "Enabling Amazon S3 Server Access Logging",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html"
    }
  ]
});
