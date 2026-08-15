import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-57",
  "title": "S3 Object Tagging and Metadata",
  "plainEnglish": "Amazon S3 Object Metadata and Object Tagging are two distinct mechanisms for attaching descriptive key-value information to your stored objects. S3 Metadata includes System Metadata (like `Content-Type`, `Cache-Control`, and `Content-Disposition`) and User-Defined Metadata (prefixed with `x-amz-meta-`), which are set during upload and cannot be modified without overwriting the object. S3 Object Tags are dynamic key-value pairs (up to 10 tags per object) that can be added, updated, or removed at any time without creating a new object version.",
  "whyItMatters": "Categorizing data is essential for security governance, automated lifecycle tiering, and Attribute-Based Access Control (ABAC). S3 Object Tags allow security policies to grant access based on tags (e.g., `Confidential=True`) and allow S3 Lifecycle Rules to transition only objects with specific tags to cold storage, while S3 Metadata controls browser rendering behavior (such as MIME types and cache headers).",
  "workplaceExample": "A medical imaging platform uploads X-ray scans with user-defined metadata `x-amz-meta-patient-hash: 8f9a2b` and `Content-Type: image/dicom`. To govern lifecycle costs, the data pipeline applies an S3 Object Tag `Department=Radiology` and `RetentionTier=Archive`. The team's S3 Lifecycle rule filters specifically on tag `RetentionTier=Archive` to move radiology scans to Glacier after 60 days, while keeping non-tagged scans in S3 Standard.",
  "examFocus": "Compare S3 Metadata vs S3 Object Tagging: (1) S3 Metadata: Set during object creation; cannot be modified independently (editing requires copying/overwriting the object); user-defined metadata keys MUST start with `x-amz-meta-`. (2) S3 Object Tagging: Dynamic key-value pairs (maximum 10 tags per object); can be updated independently without touching object data or creating new versions via `s3:PutObjectTagging`. (3) Tag Use Cases: S3 Lifecycle rule filtering, S3 Replication rule filtering, and IAM Attribute-Based Access Control (ABAC) using `s3:ExistingObjectTag`.",
  "keyPoints": [
    "S3 Metadata includes System Metadata (`Content-Type`, `Cache-Control`) and User Metadata (`x-amz-meta-*`).",
    "Metadata is immutable and set upon upload; modifying metadata requires copying the object.",
    "S3 Object Tags are dynamic key-value pairs (up to 10 tags per object) that can be modified anytime.",
    "Updating object tags does NOT modify object data or create a new object version.",
    "Tags are used to filter S3 Lifecycle rules, S3 Replication rules, and S3 Storage Class Analysis.",
    "Enables Attribute-Based Access Control (ABAC) in IAM policies via `s3:ExistingObjectTag/<key>`."
  ],
  "commonMistake": "Attempting to update an object's user metadata (like `x-amz-meta-department`) using `PutObjectTagging`. Metadata and Tags are separate systems; metadata updates require a `CopyObject` API call overwriting the object metadata.",
  "example": "Add tags to an existing object without altering its data or versioning using the AWS CLI: aws s3api put-object-tagging --bucket medical-scans --key scan-101.dcm --tagging 'TagSet=[{Key=Department,Value=Radiology},{Key=RetentionTier,Value=Archive}]'.",
  "sources": [
    {
      "title": "Categorizing Your Storage Using S3 Object Tags",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-tagging.html"
    },
    {
      "title": "Working with Object Metadata in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html"
    }
  ]
});
