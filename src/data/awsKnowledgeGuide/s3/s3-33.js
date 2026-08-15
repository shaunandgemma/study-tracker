import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-33",
  "title": "S3 Server-Side Encryption with Amazon S3 Managed Keys - SSE-S3",
  "plainEnglish": "Server-Side Encryption with Amazon S3 Managed Keys (SSE-S3) is the built-in, default encryption mechanism in Amazon S3 that automatically encrypts your data at rest using strong 256-bit Advanced Encryption Standard (AES-256). With SSE-S3, Amazon S3 handles all cryptographic key generation, secure storage, and regular key rotation entirely behind the scenes at zero additional cost, requiring zero manual key management from customers.",
  "whyItMatters": "Unencrypted data at rest violates virtually all modern security compliance frameworks (PCI DSS, HIPAA, ISO 27001). SSE-S3 provides transparent, out-of-the-box encryption at rest for every single object written to Amazon S3, ensuring data is encrypted on physical storage disks without incurring extra AWS KMS API charges or complex key policy configurations.",
  "workplaceExample": "A company creates an S3 bucket to store website static marketing assets and application logs. S3 applies default encryption using SSE-S3 (`AES256`). When a web server uploads a log file, S3 automatically encrypts the data using an AES-256 key before writing it to disk. When the log file is downloaded, S3 automatically decrypts the data transparently, providing effortless encryption at rest with zero performance overhead and zero extra billing.",
  "examFocus": "Understand SSE-S3 encryption behavior: (1) Default Encryption: Enabled automatically on all new S3 buckets at no extra charge. (2) Encryption Algorithm: 256-bit Advanced Encryption Standard (AES-256). (3) Key Header: Represented in HTTP headers as `x-amz-server-side-encryption: AES256`. (4) Key Management: Fully managed by AWS; customers do NOT have access to view, rotate, or modify the underlying master encryption keys. (5) Auditing: Decrypt operations do NOT generate individual KMS CloudTrail audit records.",
  "keyPoints": [
    "Default server-side encryption applied automatically to all new Amazon S3 objects.",
    "Uses 256-bit Advanced Encryption Standard (AES-256) cryptographic algorithms.",
    "Completely free of charge with zero KMS request or key management fees.",
    "Key management, storage, and annual rotation are handled 100% transparently by AWS.",
    "Configured on the bucket via the `x-amz-server-side-encryption: AES256` header.",
    "Ideal for general-purpose workloads that require encryption at rest without custom key governance."
  ],
  "commonMistake": "Believing that SSE-S3 allows you to control who decrypts objects via IAM KMS key policies or audit every decryption event in CloudTrail. SSE-S3 uses AWS-managed keys without KMS integration; if you need individual key access policies and CloudTrail decryption audit logs, use SSE-KMS.",
  "example": "Verify default SSE-S3 bucket encryption using the AWS CLI: aws s3api get-bucket-encryption --bucket my-general-bucket, which returns `SSEAlgorithm: AES256`.",
  "sources": [
    {
      "title": "Protecting Data Using Server-Side Encryption with Amazon S3 Managed Keys (SSE-S3)",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html"
    },
    {
      "title": "Setting Default Server-Side Encryption Behavior for S3 Buckets",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-bucket-encryption.html"
    }
  ]
});
