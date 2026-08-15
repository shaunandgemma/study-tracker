import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-8", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Amazon S3 Storage Backend", "status": "ready",
  "plainEnglish": "When Amazon Simple Storage Service (Amazon S3) is a Transfer Family server's storage domain, file operations become S3 object operations. A displayed path is built from a bucket name and object-key prefix; the apparent folders are not POSIX directories. Transfer Family assumes the role mapped to the authenticated user to list, read, write, or delete permitted objects.",
  "whyItMatters": "S3 provides durable object storage and integrates with analytics, lifecycle, event, and security services, but a legacy client can expect filesystem behavior that objects do not provide. Correct bucket, prefix, object, KMS, and listing permissions are essential for predictable sessions and tenant isolation.",
  "workplaceExample": "A business partner lands in a logical root mapped to one inbound prefix. Its Transfer Family role can list that prefix and upload objects but cannot read another partner's keys. An S3 bucket policy and customer-managed KMS key policy recognize the role, while lifecycle rules archive older uploads independently of the SFTP session.",
  "examFocus": "S3 is object storage, not a normal POSIX filesystem. Transfer Family infers directories from slash-delimited object keys. Use a user IAM role, optional S3 session policy, home directory or logical mappings, and any required bucket and KMS policies to enforce least privilege.",
  "keyPoints": [
    "The Transfer Family user role needs S3 actions appropriate to the required bucket, prefix, and object operations.",
    "Listing a directory normally requires bucket-level listing permission constrained to the intended prefixes, while upload and download use object-level permissions.",
    "Logical directory mappings can hide bucket names and expose a friendly virtual tree, but storage permissions should enforce the same boundary.",
    "S3 folders are object-key prefixes; zero-byte objects with trailing slashes can represent empty folders and affect client behavior.",
    "S3 Access Point aliases are supported for granular access, but S3 Multi-Region Access Points are not currently supported by Transfer Family servers.",
    "If objects use a customer-managed AWS KMS key, the user role and key policy need the specific cryptographic permissions required by its operations.",
    "S3 versioning, Object Lock, lifecycle, and event processing continue to apply independently of the file-transfer protocol."
  ],
  "commonMistake": "Do not copy an EFS permission model into an S3 design. S3 has no POSIX UID, GID, chmod, or true directories; diagnose access using IAM, bucket and access-point policies, object ownership, prefixes, and KMS permissions.",
  "example": "Define a fictional user's virtual root as one test bucket prefix. Review the role's list condition and object actions, map the logical root, upload a harmless object, test list and download according to the intended access, confirm a sibling prefix is denied, inspect the resulting object key and encryption, and remove the test objects through an approved cleanup process.",
  "sources": [
    {"title": "Configure storage to use with AWS Transfer Family servers", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/configure-storage.html"},
    {"title": "Managing access controls", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/users-policies.html"},
    {"title": "Using logical directories", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/logical-dir-mappings.html"}
  ]
});
