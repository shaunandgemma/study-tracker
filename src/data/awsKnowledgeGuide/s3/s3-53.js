import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-53",
  "title": "S3 CloudTrail Data Events",
  "plainEnglish": "Amazon S3 CloudTrail Data Events are detailed, object-level audit logs recorded by AWS CloudTrail whenever API operations (such as `s3:GetObject`, `s3:PutObject`, and `s3:DeleteObject`) are performed on individual objects inside your Amazon S3 buckets. While default CloudTrail trails only record bucket-level Management Events (like `CreateBucket` or `PutBucketPolicy`), enabling Data Events captures full identity context, temporary STS role sessions, and IP addresses for every single object-level transaction.",
  "whyItMatters": "Investigating unauthorized data exfiltration or proving chain-of-custody for regulatory audits requires knowing the exact IAM user or assumed role session that downloaded or modified a specific file. S3 CloudTrail Data Events provide forensic-grade auditing with comprehensive IAM principal context, request parameters, and cryptographic verification.",
  "workplaceExample": "A financial auditor requires an audit trail of every employee who downloaded confidential customer credit reports (`reports/*`). The security team creates a CloudTrail trail configured to record S3 Data Events for `arn:aws:s3:::customer-credit-vault/reports/*`. When a rogue employee downloads files, CloudTrail records the exact IAM ARN, federated SSO username, source IP address, and timestamp, providing tamper-proof evidence for legal compliance.",
  "examFocus": "Distinguish CloudTrail Management Events vs Data Events: (1) Management Events: Default & free for 90 days in Event History; logs bucket-level changes (`CreateBucket`, `DeleteBucket`, `PutBucketPolicy`, `PutBucketAcl`). (2) Data Events: NOT enabled by default; paid tier per 100,000 events; logs object-level operations (`GetObject`, `PutObject`, `DeleteObject`). (3) Advanced Event Selectors: Use advanced event selectors to filter logging by bucket name, prefix, or read/write type (`ReadOnly` vs `WriteOnly`) to control logging costs.",
  "keyPoints": [
    "Records object-level API operations (`GetObject`, `PutObject`, `DeleteObject`) in AWS CloudTrail.",
    "Captures complete IAM caller identity, temporary STS session context, and source IP.",
    "Not enabled by default; requires configuring Data Events on a CloudTrail trail.",
    "Charged a fee per 100,000 data events recorded in CloudTrail.",
    "Supports Advanced Event Selectors to filter logging by specific buckets, prefixes, and operations.",
    "Provides forensic-grade, tamper-proof audit trails for strict regulatory compliance."
  ],
  "commonMistake": "Enabling CloudTrail Data Events across high-throughput data lake buckets without prefix filters. Ingesting billions of PUT/GET requests into CloudTrail can generate enormous CloudTrail logging bills; always use Advanced Event Selectors to scope data events strictly to sensitive prefixes.",
  "example": "Configure a CloudTrail trail to log Data Events for a specific sensitive S3 bucket prefix using the AWS CLI: aws cloudtrail put-event-selectors --trail-name SecurityTrail --event-selectors '[{\"ReadWriteType\": \"All\", \"IncludeManagementEvents\": true, \"DataResources\": [{\"Type\": \"AWS::S3::Object\", \"Values\": [\"arn:aws:s3:::sensitive-vault/credit-reports/\"]}]}]'.",
  "sources": [
    {
      "title": "Logging Amazon S3 API Calls with AWS CloudTrail",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging.html"
    },
    {
      "title": "Logging Data Events for Amazon S3 in AWS CloudTrail",
      "url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html#logging-data-events-for-amazon-s3"
    }
  ]
});
