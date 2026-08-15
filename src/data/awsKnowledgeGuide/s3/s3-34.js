import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-34",
  "title": "S3 Server-Side Encryption with AWS KMS Keys - SSE-KMS",
  "plainEnglish": "Server-Side Encryption with AWS Key Management Service Keys (SSE-KMS) is an advanced security encryption option in Amazon S3 that uses AWS KMS keys (either AWS managed `aws/s3` keys or Customer Managed Keys, CMKs) to protect your object data at rest. Unlike SSE-S3, SSE-KMS provides dual-layer authorization (requiring permissions on both the S3 bucket and the KMS key), full control over key rotation and access policies, and an immutable audit log of every encryption and decryption event in AWS CloudTrail.",
  "whyItMatters": "Strict regulatory compliance and enterprise security policies require customer control over encryption key lifecycles, cryptographic separation between administrative roles and data access, and detailed auditing of every file decryption. SSE-KMS guarantees that even if a user has broad S3 bucket permissions, they cannot read encrypted data unless explicitly granted `kms:Decrypt` permissions on the associated KMS key.",
  "workplaceExample": "A healthcare provider stores patient medical records in an S3 bucket encrypted with SSE-KMS using a Customer Managed Key (`arn:aws:kms:us-east-1:123456789012:key/med-records-cmk`). A database administrator with `s3:GetObject` permissions attempts to download a patient record. Because the DBA is not granted `kms:Decrypt` in the KMS key policy, AWS KMS rejects the decryption request and logs an unauthorized access attempt to AWS CloudTrail.",
  "examFocus": "Understand SSE-KMS permission evaluation and headers: (1) Dual Authorization: To download an SSE-KMS object, the IAM principal MUST have BOTH `s3:GetObject` AND `kms:Decrypt` permissions. (2) Header: Represented by `x-amz-server-side-encryption: aws:kms`. (3) Auditability: Every encryption and decryption API call is logged to AWS CloudTrail with caller identity and key ARN. (4) S3 Bucket Keys: Enable S3 Bucket Keys to reduce KMS API request costs by up to 99%.",
  "keyPoints": [
    "Uses AWS Key Management Service (AWS KMS) keys to encrypt S3 objects at rest.",
    "Supports AWS managed keys (`aws/s3`) and Customer Managed Keys (CMKs) in AWS KMS.",
    "Enforces dual-layer authorization: requires both S3 object permissions and KMS key permissions.",
    "Logs every single encrypt and decrypt event to AWS CloudTrail for security auditing.",
    "Supports Customer Managed Key features: annual automatic key rotation, key policies, and grants.",
    "Can be paired with S3 Bucket Keys to dramatically reduce KMS request costs and throttling."
  ],
  "commonMistake": "Granting an IAM user `s3:GetObject` permissions on an S3 bucket encrypted with SSE-KMS but forgetting to grant `kms:Decrypt` permissions on the KMS key. The download will fail with an `AccessDenied` error from AWS KMS.",
  "example": "Set default bucket encryption to SSE-KMS with a Customer Managed Key using the AWS CLI: aws s3api put-bucket-encryption --bucket hr-confidential --server-side-encryption-configuration '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"aws:kms\",\"KMSMasterKeyId\":\"arn:aws:kms:us-east-1:123456789012:key/abcd-1234\"},\"BucketKeyEnabled\":true}]}'.",
  "sources": [
    {
      "title": "Protecting Data with Server-Side Encryption Using AWS KMS (SSE-KMS)",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html"
    },
    {
      "title": "Protecting Data at Rest in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html"
    }
  ]
});
