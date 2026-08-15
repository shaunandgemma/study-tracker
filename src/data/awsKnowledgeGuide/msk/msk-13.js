import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-13",
  "title": "Encryption at Rest",
  "plainEnglish": "Encryption at Rest in Amazon MSK automatically encrypts all streaming data stored on broker Amazon EBS storage volumes, partition commit logs, index files, and data offloaded to MSK Tiered Storage using AWS Key Management Service (AWS KMS). Encryption at rest is mandatory for all Amazon MSK clusters and cannot be disabled.",
  "whyItMatters": "Protecting persistent data blocks stored on physical disks is mandatory under security compliance standards like GDPR, HIPAA, and SOC 2. Transparent KMS encryption at rest ensures that even if underlying physical storage hardware were compromised, streaming records remain unreadable ciphertext without authorization from AWS KMS.",
  "workplaceExample": "A banking institution deploys an Amazon MSK cluster to handle customer credit card authorizations. To adhere to internal cryptographic security policies, the security architect configures the MSK cluster to use a Customer Managed Key (CMK) in AWS KMS with annual automatic key rotation enabled. All EBS volumes attached to the brokers are encrypted with this CMK, and every key access request is logged to AWS CloudTrail for compliance auditing.",
  "examFocus": "Understand MSK encryption at rest rules: (1) Mandatory: All MSK clusters are encrypted at rest automatically. (2) Key Options: AWS owned KMS key (default, `aws/kafka`, no extra charge) or Customer Managed Key (CMK) in AWS KMS. (3) CMKs provide control over key policies, grants, automatic key rotation, and CloudTrail auditing. (4) The KMS key selection is configured at cluster creation time and cannot be modified after the cluster is created.",
  "keyPoints": [
    "All data on broker EBS volumes, metadata, and MSK Tiered Storage is encrypted at rest using AES-256.",
    "Encryption at rest is enabled by default on all Amazon MSK clusters and cannot be turned off.",
    "Supports AWS owned KMS keys (default) and Customer Managed Keys (CMKs) in AWS KMS.",
    "Customer Managed Keys allow automated annual key rotation and detailed AWS CloudTrail audit logging.",
    "The KMS encryption key must be chosen during cluster creation and cannot be changed on an existing cluster.",
    "The IAM principal creating the cluster must have `kms:CreateGrant` and `kms:DescribeKey` permissions on the KMS CMK."
  ],
  "commonMistake": "Attempting to change the KMS encryption key on an active MSK cluster. In Amazon MSK, the encryption at rest KMS key is specified during cluster creation and cannot be updated afterwards; changing the key requires creating a new cluster and migrating data.",
  "example": "Create an MSK cluster with a Customer Managed KMS Key in the AWS CLI: aws kafka create-cluster --cluster-name banking-stream --encryption-info '{\"EncryptionAtRest\":{\"DataVolumeKMSKeyId\":\"arn:aws:kms:us-east-1:123456789012:key/abcd-1234\"}}' ...",
  "sources": [
    {
      "title": "Amazon MSK Encryption at Rest",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-encryption.html#encryption-at-rest"
    },
    {
      "title": "Using Customer Managed Keys with Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-kms-keys.html"
    }
  ]
});
