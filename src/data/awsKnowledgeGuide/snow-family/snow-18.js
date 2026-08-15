import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-18",
  "title": "Snow Family Jobs",
  "plainEnglish": "A Snow Family Job is an AWS-managed administrative workflow that tracks and coordinates the entire lifecycle of ordering, provisioning, shipping, using, returning, and ingesting data from an AWS Snow Family device. You create a job in the AWS Management Console or via the AWS Snowball API by specifying the job type (Import to S3, Export from S3, or Local Compute/Storage Only), device model, destination S3 buckets, AWS KMS encryption keys, and physical delivery address.",
  "whyItMatters": "Migrating dozens of terabytes or deploying edge compute appliances involves complex logistics, hardware provisioning, courier tracking, and security handoffs. The Snow Family Job framework provides real-time visibility, automated shipping notifications via Amazon SNS or EventBridge, and structured audit logs across every stage of the physical hardware lifecycle.",
  "workplaceExample": "A retail bank creates an AWS Snowball Edge Import job to migrate 70 TB of archival database backups. The infrastructure team monitors the job lifecycle through the AWS Management Console: (1) `Job created`, (2) `Preparing device`, (3) `In transit to you` (with carrier tracking number), (4) `Delivered to you`, (5) `In transit to AWS`, (6) `At AWS`, and (7) `Importing to S3`. S3 emits an Amazon SNS notification when the import finishes successfully.",
  "examFocus": "Understand Snow Family Job types and status progression: (1) Job Types: (a) Import into Amazon S3 (copy on-prem data to S3), (b) Export from Amazon S3 (copy S3 data to on-prem), (c) Local Compute and Storage Only (edge compute without direct S3 import/export). (2) Key Job Statuses: `Pending`, `Preparing`, `In transit to you`, `At customer`, `In transit to AWS`, `At AWS`, `Importing`, `Completed`, `Cancelled`. (3) Cancellation: Jobs can only be cancelled before the device is physically shipped by AWS.",
  "keyPoints": [
    "AWS-managed lifecycle workflow for ordering, tracking, and completing Snow device operations.",
    "Three primary job types: Import to Amazon S3, Export from Amazon S3, and Local Compute/Storage Only.",
    "Tracks device progress from initial hardware preparation to final S3 ingestion and sanitization.",
    "Integrates with Amazon SNS and Amazon EventBridge for real-time shipping and completion notifications.",
    "Enables downloading the job Manifest file and 29-character Unlock Code once the device ships.",
    "Jobs can be cancelled without penalty as long as the status is prior to physical carrier dispatch."
  ],
  "commonMistake": "Attempting to cancel a Snow Family job in the AWS Console after the device has already been dispatched to the courier (`In transit to you`). Once physically shipped, the job cannot be cancelled; the customer must receive the device and ship it back to AWS.",
  "example": "Create a local compute-only Snowball Edge job using the AWS CLI: aws snowball create-job --job-type LOCAL_USE --snowball-type EDGE_COMPUTE_OPTIMIZED --role-arn arn:aws:iam::123456789012:role/SnowballServiceRole --kms-key-arn arn:aws:kms:us-east-1:123456789012:key/snow-key --shipping-option SECOND_DAY.",
  "sources": [
    {
      "title": "AWS Snowball Edge Job Lifecycle and How It Works",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/how-snowball-works.html"
    },
    {
      "title": "Managing Snow Family Jobs and Tracking Status",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/job-status.html"
    }
  ]
});
