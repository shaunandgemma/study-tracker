import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-21",
  "title": "S3 Access Control Lists - ACLs",
  "plainEnglish": "Amazon S3 Access Control Lists (ACLs) are a legacy access management mechanism in Amazon S3 that predates modern AWS Identity and Access Management (IAM). An ACL is a simple list attached to a bucket or an individual object that grants basic read/write permissions to specific AWS account canonical IDs or predefined AWS groups (like the Log Delivery group). AWS now recommends disabling ACLs entirely on all buckets in favor of modern S3 Bucket Policies and IAM policies.",
  "whyItMatters": "ACLs caused severe access control confusion in multi-account environments: when an external account uploaded an object into your bucket using ACLs, the external account owned the object, preventing the bucket owner from reading or modifying the file. By enforcing S3 Object Ownership (Bucket Owner Enforced), ACLs are disabled completely, ensuring the bucket owner automatically owns all objects and centralizing security within IAM.",
  "workplaceExample": "A company audits legacy AWS infrastructure created in 2017. They find older buckets using object-level ACLs where uploaded objects were inaccessible to backup scripts. The security team updates the S3 Object Ownership setting on all buckets to 'Bucket Owner Enforced'. This setting disables ACLs across the board, restores 100% bucket owner ownership over all objects, and replaces confusing ACL permissions with standardized S3 Bucket Policies.",
  "examFocus": "Understand S3 ACL legacy status and AWS best practices: (1) S3 Object Ownership: 'Bucket owner enforced' is the default and recommended setting for all new buckets; it DISABLES all ACLs and makes the bucket owner own all uploaded objects. (2) Predefined Groups: Authenticated Users (any AWS account, NOT just yours), All Users (public internet), Log Delivery group. (3) Modern Best Practice: Use IAM Identity Policies and S3 Bucket Policies instead of ACLs.",
  "keyPoints": [
    "Legacy access control mechanism attached to individual S3 buckets and objects.",
    "Disabled by default on all newly created Amazon S3 general-purpose buckets.",
    "Modern best practice is S3 Object Ownership 'Bucket Owner Enforced' (disables ACLs).",
    "Historically caused object ownership conflicts in cross-account upload workflows.",
    "Predefined ACL groups include AllUsers (public) and AuthenticatedUsers (any valid AWS account).",
    "Superseded by centralized IAM Identity Policies, S3 Bucket Policies, and S3 Access Points."
  ],
  "commonMistake": "Granting read access to the 'Authenticated Users' group in an ACL thinking it refers only to logged-in users within your own AWS account. The 'Authenticated Users' group grants access to ANY person with ANY valid AWS account in the world.",
  "example": "Disable ACLs and enforce bucket owner ownership on an existing bucket using the AWS CLI: aws s3api put-bucket-ownership-controls --bucket my-corporate-bucket --ownership-controls 'Rules=[{ObjectOwnership=BucketOwnerEnforced}]'.",
  "sources": [
    {
      "title": "Access Control List (ACL) Overview in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html"
    },
    {
      "title": "Controlling Ownership of Objects in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html"
    }
  ]
});
