import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-22",
  "title": "S3 Object Ownership - Bucket Owner Enforced",
  "plainEnglish": "S3 Object Ownership is an Amazon S3 security feature that controls ownership of objects uploaded to your bucket and disables legacy Access Control Lists (ACLs). When set to 'Bucket Owner Enforced' (the AWS-recommended default setting for all new buckets), ACLs are completely disabled, and the AWS account that owns the S3 bucket automatically becomes the sole owner of all objects uploaded to that bucket—even when objects are uploaded by external cross-account IAM principals.",
  "whyItMatters": "In historical cross-account data architectures, when Account B uploaded a file into Account A's S3 bucket, Account B owned the object by default, leaving Account A completely unable to read, modify, or grant permissions on the file. S3 Object Ownership (Bucket Owner Enforced) permanently eliminates this cross-account ownership dilemma by disabling ACLs and ensuring the bucket owner owns 100% of stored objects.",
  "workplaceExample": "A centralized marketing data lake bucket in Account `111122223333` receives daily sales exports uploaded by 20 regional subsidiary AWS accounts. The data engineering team sets S3 Object Ownership to 'Bucket Owner Enforced'. As subsidiaries upload sales files, the central data lake account immediately and automatically owns all uploaded files, allowing central Glue ETL jobs to read and transform the data without requiring subsidiaries to pass complex ownership ACL headers.",
  "examFocus": "Understand the three S3 Object Ownership settings: (1) BucketOwnerEnforced: (DEFAULT & BEST PRACTICE) Disables ACLs completely; bucket owner owns all objects; access managed exclusively via IAM and bucket policies. (2) BucketOwnerPreferred: ACLs enabled; bucket owner owns objects only if the uploader includes the `bucket-owner-full-control` canned ACL. (3) ObjectWriter: (LEGACY) The AWS account that uploads the object owns it.",
  "keyPoints": [
    "Default and recommended security setting for all newly created Amazon S3 buckets.",
    "Disables Access Control Lists (ACLs) entirely across the bucket and all contained objects.",
    "Bucket owner automatically owns and controls all objects uploaded by any AWS account.",
    "Centralizes access management strictly within IAM Identity Policies and S3 Bucket Policies.",
    "Eliminates the historical issue where cross-account uploaders retained exclusive object ownership.",
    "Does not alter existing object data or encryption configurations."
  ],
  "commonMistake": "Using 'Bucket Owner Preferred' instead of 'Bucket Owner Enforced' for new buckets. 'Bucket Owner Preferred' still leaves ACLs enabled and requires uploaders to explicitly pass `bucket-owner-full-control` headers; use 'Bucket Owner Enforced' to automatically take ownership and disable ACLs completely.",
  "example": "Set Object Ownership to Bucket Owner Enforced using the AWS CLI: aws s3api put-bucket-ownership-controls --bucket my-datalake-bucket --ownership-controls 'Rules=[{ObjectOwnership=BucketOwnerEnforced}]'.",
  "sources": [
    {
      "title": "Controlling Ownership of Objects in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html"
    },
    {
      "title": "Ensuring Object Ownership in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/ensure-object-ownership.html"
    }
  ]
});
