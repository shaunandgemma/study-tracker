import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-13",
  "title": "Keyspaces Encryption at Rest",
  "plainEnglish": "Amazon Keyspaces automatically encrypts all user data, table indexes, commit logs, system metadata, and Point-in-Time Recovery backups at rest using 256-bit Advanced Encryption Standard (AES-256) encryption integrated with AWS Key Management Service (AWS KMS). Encryption at rest is permanently enabled for all tables and cannot be disabled.",
  "whyItMatters": "Strict regulatory compliance standards (such as HIPAA, PCI DSS, GDPR, and SOC 2) mandate robust encryption of sensitive data stored in cloud databases. Amazon Keyspaces provides transparent, hardware-accelerated encryption at rest with zero performance overhead, protecting data from unauthorized access at the storage tier while integrating with AWS CloudTrail for comprehensive key-usage auditing.",
  "workplaceExample": "A healthcare analytics platform stores protected health information (PHI) in Amazon Keyspaces. To maintain HIPAA compliance and meet internal security governance policies, they configure a Customer Managed Key (CMK) in AWS KMS with annual automatic key rotation and strict IAM key policies, applying this KMS key to all Keyspaces patient records tables.",
  "examFocus": "Know the two encryption key options for Keyspaces: (1) AWS Owned Key (default): Managed entirely by AWS at no extra cost, requiring no KMS configuration. (2) Customer Managed Key (CMK): Created and owned by the customer in AWS KMS, providing control over key policies, annual rotation, grants, and CloudTrail auditing. Remember that in-transit encryption (TLS 1.2+) is also mandatory for all client connections on port 9142.",
  "keyPoints": [
    "All table data, primary indexes, commit logs, and backups are encrypted at rest using AES-256.",
    "Encryption at rest is mandatory and always active on all Amazon Keyspaces tables.",
    "Supports AWS owned keys (default, no additional KMS charges) and Customer Managed Keys (CMKs) in AWS KMS.",
    "Customer Managed Keys allow fine-grained access control, automated key rotation, and full CloudTrail audit logging.",
    "Can be configured when creating a table or updated on existing tables using the ALTER TABLE CQL statement.",
    "Pairs with mandatory TLS 1.2+ encryption in transit on TCP port 9142 for end-to-end data security."
  ],
  "commonMistake": "Believing encryption at rest can be disabled to save cost or increase throughput. Encryption at rest is mandatory and built into the storage engine with zero throughput or latency penalty.",
  "example": "Update an existing table to use a customer-managed KMS key in CQL: ALTER TABLE finance.transactions WITH CUSTOM_PROPERTIES = {'encryption_specification': {'encryption_type': 'CUSTOMER_MANAGED_KMS_KEY', 'kms_key_identifier': 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-1234567890ab'}};",
  "sources": [
    {
      "title": "Encryption at Rest in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/encryption-at-rest.html"
    },
    {
      "title": "Using Customer Managed Keys with Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/encryption-at-rest-custom-key.html"
    }
  ]
});
