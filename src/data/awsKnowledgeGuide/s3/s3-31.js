import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-31",
  "title": "S3 Cross-Region Replication - CRR",
  "plainEnglish": "S3 Cross-Region Replication (CRR) is an automated, asynchronous replication mechanism that continuously copies S3 objects across buckets located in different geographic AWS Regions (e.g., from `us-east-1` in Virginia to `us-west-2` in Oregon or `eu-west-1` in Ireland). CRR is primarily used for multi-region disaster recovery, reducing data access latency for global users, and meeting institutional compliance mandates for geographic data redundancy.",
  "whyItMatters": "Relying on a single AWS Region leaves business operations vulnerable to catastrophic regional outages, fiber cuts, or regulatory non-compliance. S3 Cross-Region Replication ensures that identical copies of your business-critical data are stored hundreds or thousands of miles away in a completely independent cloud region.",
  "workplaceExample": "A global media streaming provider hosts master video files in an S3 bucket in Virginia (`us-east-1`). To minimize latency for European viewers and ensure enterprise disaster recovery, they configure S3 Cross-Region Replication targeting a destination bucket in Frankfurt (`eu-central-1`). When a new movie file is uploaded in Virginia, S3 automatically replicates the file and its metadata to Frankfurt within minutes over the secure AWS network backbone.",
  "examFocus": "Understand S3 Cross-Region Replication rules and prerequisites: (1) Versioning Requirement: S3 Versioning MUST be enabled on BOTH source and destination buckets. (2) Cross-Account CRR: Source account IAM role must have read permissions on source and write permissions on destination; destination bucket policy must allow replication role. (3) KMS Encryption: Replicating SSE-KMS encrypted objects requires explicit KMS permissions and configuring destination KMS key ARNs. (4) Replication Scope: By default replicates new objects, tags, and metadata (can optionally replicate delete markers and KMS objects).",
  "keyPoints": [
    "Automatically replicates objects asynchronously between S3 buckets in different AWS Regions.",
    "Requires S3 Versioning enabled on both source and destination buckets.",
    "Provides geographic disaster recovery and reduces latency for globally distributed users.",
    "Can replicate to a different AWS account with automatic replica ownership transfer.",
    "Supports replicating SSE-S3 and SSE-KMS encrypted objects with destination key translation.",
    "Does not replicate existing objects by default; requires S3 Batch Replication for pre-existing data."
  ],
  "commonMistake": "Believing that deleting an object in the source bucket automatically deletes the object in the destination bucket during CRR. By default, delete markers are not replicated unless explicitly enabled in the replication configuration, preventing accidental mass deletions from wiping out disaster recovery backups.",
  "example": "Configure a Cross-Region Replication rule replicating all objects to a secondary disaster recovery region: {\"Role\": \"arn:aws:iam::123456789012:role/s3-crr-role\", \"Rules\": [{\"Status\": \"Enabled\", \"Priority\": 1, \"Destination\": {\"Bucket\": \"arn:aws:s3:::company-dr-oregon\", \"StorageClass\": \"STANDARD_IA\"}}]}",
  "sources": [
    {
      "title": "Replicating Objects Across AWS Regions (CRR)",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html"
    },
    {
      "title": "Configuring S3 Cross-Region Replication Step-by-Step",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-walkthrough-1.html"
    }
  ]
});
