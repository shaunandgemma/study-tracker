import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-18", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Encryption with AWS KMS", "status": "ready",
  "plainEnglish": "AWS Transfer Family writes transferred data into the configured storage service, so encryption at rest is controlled by Amazon S3 or Amazon EFS. For S3, bucket default encryption can use an AWS Key Management Service (AWS KMS) key. The Transfer Family user's role, any session policy, and the KMS key policy must together allow the cryptographic operations required for that user's upload or download.",
  "whyItMatters": "A customer-managed KMS key gives an organization control over key policy, auditing, lifecycle, and separation of duties. That control also creates a dependency: a disabled key or missing permission can make a correctly authenticated transfer fail even when S3 permissions appear correct.",
  "workplaceExample": "A regulated SFTP landing bucket uses default server-side encryption with a customer-managed KMS key. A partner role can generate data keys and encrypt new uploads but has only the additional decrypt access required for approved downloads. The bucket policy, session policy, and key policy name the intended path and role, and CloudTrail supports key-use investigation.",
  "examFocus": "Separate encryption in transit from encryption at rest. SFTP uses SSH and FTPS uses TLS in transit; plain FTP does not. S3 or EFS protects stored data. Transfer Family does not automatically grant storage or KMS permissions, and its own service configuration data uses service-managed at-rest encryption.",
  "keyPoints": [
    "S3 applies its configured server-side encryption when Transfer Family stores an uploaded object.",
    "A user role needs only the KMS actions required by its upload and download operations on the selected key.",
    "If an S3 session policy is used, it must also allow the necessary KMS operations because it limits the role session.",
    "The KMS key policy must permit the relevant principal; an IAM Allow alone cannot overcome a restrictive key policy design.",
    "EFS encryption at rest is selected and managed on the EFS filesystem, while Transfer Family access still needs EFS IAM and POSIX authorization.",
    "Changing DNS or using a VPC endpoint does not encrypt plain FTP and does not configure storage encryption.",
    "Monitor KMS authorization failures, key state, rotation policy, CloudTrail records, and the storage service's encryption configuration."
  ],
  "commonMistake": "Do not respond to an encrypted-bucket upload failure by broadly granting kms:* on every key. Determine the exact role session and operation, then align its role, optional session policy, bucket configuration, and one key policy with least privilege.",
  "example": "Review a fictional upload and download against an isolated test bucket with customer-managed encryption. List which principal calls S3, which KMS operations each direction needs, how the session policy narrows access, and how the key policy authorizes it. Test permitted and denied paths only with harmless data and never paste real key material or account identifiers.",
  "sources": [
    {"title": "Data protection and encryption in AWS Transfer Family", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/encryption-at-rest.html"},
    {"title": "Managing access controls", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/users-policies.html"}
  ]
});
