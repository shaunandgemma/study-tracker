import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-15",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena Encryption",
  "status": "ready",
  "plainEnglish": "Athena Encryption encompasses security controls that protect your data both at rest and in transit. Athena supports querying encrypted data stored in Amazon S3 (using SSE-S3, SSE-KMS, or CSE-KMS) and can automatically encrypt all query output result files written to S3. In transit, all communication between clients, the Athena service, and S3 is encrypted using Transport Layer Security (TLS 1.2+).",
  "whyItMatters": "Enterprise compliance standards (such as HIPAA, PCI-DSS, and GDPR) mandate encryption of all sensitive data and analytical outputs. Athena ensures that confidential customer records, financial figures, and healthcare data remain encrypted throughout the entire query lifecycle—from raw S3 storage to final CSV output.",
  "workplaceExample": "A financial institution enforces AWS KMS customer managed key (CMK) encryption across all S3 data lakes. Athena is configured at the workgroup level to query KMS-encrypted S3 datasets and automatically encrypt all generated query result CSVs with the company's dedicated KMS key arn:aws:kms:us-east-1:123456789012:key/analytics-key.",
  "examFocus": "For SAA-C03, know that Athena can query datasets encrypted with SSE-S3 (Amazon S3-managed keys), SSE-KMS (AWS KMS keys), and CSE-KMS (client-side KMS encryption). To query KMS-encrypted data or write encrypted query results, the IAM principal executing the query must have both S3 permissions and KMS permissions (kms:Decrypt, kms:GenerateDataKey). Workgroups can enforce encryption on all query results.",
  "keyPoints": [
    "Supports querying S3 data encrypted with SSE-S3, SSE-KMS, and client-side KMS (CSE-KMS).",
    "Can automatically encrypt query result files saved to Amazon S3 using SSE-S3, SSE-KMS, or CSE-KMS.",
    "Athena Workgroups can enforce mandatory encryption configurations across all team queries.",
    "The querying IAM role must have explicit kms:Decrypt permissions on the S3 bucket's KMS key.",
    "All network traffic to and from Athena is encrypted in transit using TLS."
  ],
  "commonMistake": "Granting an IAM user access to Athena and S3 but forgetting to grant kms:Decrypt on the KMS key protecting the raw S3 bucket, causing Athena queries to fail with Access Denied: KMS.DisabledException or AccessDeniedException. Always grant KMS permissions for encrypted S3 buckets.",
  "example": "SELECT patient_id, diagnosis_code, admission_date FROM medical_records_encrypted WHERE admission_date >= '2026-01-01';\n-- Athena automatically decrypts S3 source objects using AWS KMS and writes encrypted outputs.",
  "sources": [
    {
      "title": "Encrypting Amazon Athena Query Results in Amazon S3",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/encryption.html"
    },
    {
      "title": "Configuring Workgroup Encryption Settings",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html"
    }
  ]
});
