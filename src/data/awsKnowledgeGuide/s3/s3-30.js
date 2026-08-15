import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-30",
  "title": "S3 Same-Region Replication - SRR",
  "plainEnglish": "S3 Same-Region Replication (SRR) is an automated, asynchronous replication feature that automatically copies new objects between Amazon S3 buckets located within the exact same AWS Region. SRR is used to aggregate logs from multiple source accounts into a single central security bucket, replicate live production datasets to developer/test sandbox buckets, or change object ownership to a central repository account while maintaining strict in-region data sovereignty compliance.",
  "whyItMatters": "Many compliance frameworks (such as financial or healthcare data residency laws in Europe, Canada, or Australia) forbid customer data from leaving a specific physical AWS Region. S3 Same-Region Replication allows organizations to replicate, aggregate, and isolate data across different accounts and environments within the same AWS Region without violating geographic compliance boundaries.",
  "workplaceExample": "A cybersecurity team aggregates CloudTrail and VPC Flow Logs from 40 member AWS accounts in `eu-west-1` (Ireland). Each member account has an S3 bucket configured with an S3 Same-Region Replication rule targeting a centralized Security Account's bucket in `eu-west-1`. SRR automatically replicates new log files, changes object ownership to the central security account, and re-encrypts objects with a central KMS key without data ever leaving Ireland.",
  "examFocus": "Understand S3 Same-Region Replication requirements: (1) Prerequisite: S3 Versioning MUST be enabled on BOTH source and destination buckets. (2) IAM Role: Source bucket requires an IAM replication role with permissions to read from source and replicate to destination. (3) Ownership Overwrite: SRR can automatically change replica ownership to the destination bucket owner. (4) Re-Encryption: Can re-encrypt objects using a different AWS KMS key in the destination bucket.",
  "keyPoints": [
    "Automatically replicates objects asynchronously between buckets in the same AWS Region.",
    "Requires S3 Versioning enabled on both the source bucket and destination bucket.",
    "Satisfies strict regional data residency and sovereignty legal mandates.",
    "Can automatically change object ownership to the destination bucket owner account.",
    "Supports re-encrypting replica objects with a different destination AWS KMS key.",
    "Ideal for log aggregation, cross-account data isolation, and test environment syncing."
  ],
  "commonMistake": "Expecting existing objects in the source bucket to be replicated immediately upon creating a new SRR rule. S3 replication rules only replicate new objects uploaded AFTER the rule is created; to replicate pre-existing objects, use S3 Batch Replication.",
  "example": "Configure a Same-Region Replication rule in JSON targeting a central log bucket: {\"Role\": \"arn:aws:iam::123456789012:role/s3-replication-role\", \"Rules\": [{\"Status\": \"Enabled\", \"Priority\": 1, \"DeleteMarkerReplication\": {\"Status\": \"Disabled\"}, \"Filter\": {\"Prefix\": \"logs/\"}, \"Destination\": {\"Bucket\": \"arn:aws:s3:::central-security-logs-ireland\"}}]}",
  "sources": [
    {
      "title": "Replicating Objects Within the Same AWS Region (SRR)",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html"
    },
    {
      "title": "Configuring S3 Replication for Same-Region and Cross-Account",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-walkthrough-2.html"
    }
  ]
});
