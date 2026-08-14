import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-10",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "Amazon S3 Transfers",
  "status": "ready",
  "plainEnglish": "Amazon S3 Transfers in AWS DataSync allow you to copy files, directories, and datasets directly into and out of Amazon Simple Storage Service (Amazon S3) buckets. When writing to Amazon S3, DataSync translates on-premises file structures and POSIX/SMB metadata into S3 object keys and user-defined object metadata, and allows you to select any supported S3 storage class (such as S3 Standard, S3 Intelligent-Tiering, S3 Glacier Instant Retrieval, or S3 Glacier Flexible Recovery) as the direct transfer destination.",
  "whyItMatters": "Writing directly to target storage classes (like S3 Glacier Instant Retrieval) saves substantial costs compared to uploading to S3 Standard and waiting for S3 Lifecycle rules to transition objects 30 days later. DataSync also preserves POSIX permissions and timestamps as S3 object metadata tags.",
  "workplaceExample": "A legal archive service migrates 200 million scanned PDF files from on-premises NFS storage directly into an Amazon S3 bucket configured with the S3 Glacier Flexible Retrieval storage class. DataSync writes directly into Glacier tier, cutting storage costs by 80% from day one.",
  "examFocus": "For SAA-C03, know that DataSync can write directly to all S3 storage classes (Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant Retrieval, Glacier Flexible Retrieval, Glacier Deep Archive). DataSync uses IAM roles to access S3 buckets and supports S3 cross-region and cross-account transfers.",
  "keyPoints": [
    "Transfers data directly to and from Amazon S3 bucket locations.",
    "Can write directly into specific S3 storage classes (including Glacier tiers) upon initial upload.",
    "Stores POSIX metadata and file timestamps as S3 user-defined object metadata.",
    "Uses IAM roles for secure access to target S3 buckets.",
    "Supports cross-region, cross-account, and S3-to-S3 transfers."
  ],
  "commonMistake": "Uploading petabytes of archive data to S3 Standard with the intention of using S3 Lifecycle policies to move it to Glacier 30 days later. Configure DataSync to write directly to S3 Glacier upon transfer to avoid paying 30 days of S3 Standard pricing.",
  "example": "# Create an S3 location configured for S3 Intelligent-Tiering:\naws datasync create-location-s3 \\\n  --s3-bucket-arn arn:aws:s3:::enterprise-analytics-lake \\\n  --s3-storage-class INTELLIGENT_TIERING \\\n  --s3-config '{\"BucketAccessRoleArn\":\"arn:aws:iam::123456789012:role/DataSyncS3AccessRole\"}' \\\n  --subdirectory /raw-events",
  "sources": [
    {
      "title": "Creating an Amazon S3 Location in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html"
    },
    {
      "title": "Configuring S3 Storage Classes in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html#s3-storage-classes"
    }
  ]
});
