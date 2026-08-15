import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-11",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream Encryption at Rest",
  "plainEnglish": "All data stored in Amazon Timestream for LiveAnalytics is encrypted at rest by default. Encryption applies to data in both the memory store and the magnetic store, to all query result caches and to all metadata associated with your databases and tables. Timestream uses AWS Key Management Service (AWS KMS) to manage the encryption keys. By default, Timestream uses an AWS-managed key that is created and maintained by AWS. If your organisation requires direct control over key rotation, key policies and auditing, you can configure a customer-managed key (CMK) in AWS KMS instead.",
  "whyItMatters": "Time-series data from industrial sensors, medical devices or financial systems can contain sensitive operational information. Encryption at rest ensures that physical access to the underlying storage infrastructure would not expose meaningful data to an unauthorised party. Customer-managed keys give compliance-driven organisations explicit control over who can access the cryptographic material, enable automatic key rotation, and produce a complete audit trail in AWS CloudTrail showing every key use event.",
  "workplaceExample": "A pharmaceutical company stores bioreactor temperature, pH and dissolved oxygen readings in Timestream to monitor drug manufacturing batches. FDA 21 CFR Part 11 regulations require demonstrable control over access to electronic records. The company creates a customer-managed KMS key with a resource policy that permits only specific Timestream service principals and a named IAM role for their data engineering team. All reads and writes to the KMS key are logged to AWS CloudTrail, providing an auditable chain of custody for every data access event.",
  "examFocus": "Understand Timestream encryption at rest for the SAA-C03 exam: (1) Always On: Encryption at rest is applied by default and cannot be disabled. (2) Both Stores: Encryption applies to both the memory store and the magnetic store. (3) AWS-Managed Key: The default option; AWS creates and manages the KMS key on your behalf. (4) Customer-Managed Key (CMK): You create and control the KMS key in AWS KMS; grants additional control over key policies, rotation scheduling and access auditing via CloudTrail. (5) Key Change: You can switch from the AWS-managed key to a customer-managed key on an existing database.",
  "keyPoints": [
    "Amazon Timestream for LiveAnalytics encrypts all data at rest by default in both storage tiers.",
    "Encryption uses AWS Key Management Service (AWS KMS) for key management.",
    "The default encryption option uses an AWS-managed KMS key maintained by AWS.",
    "Customer-managed keys (CMKs) give organisations control over key policies, rotation and access auditing.",
    "All KMS key usage events appear in AWS CloudTrail, supporting compliance audit requirements.",
    "Encryption at rest cannot be disabled; it is always applied to memory store, magnetic store and metadata."
  ],
  "commonMistake": "Assuming that switching from an AWS-managed key to a customer-managed key in KMS is instantaneous. After updating the database encryption configuration, Timestream re-encrypts data using the new key, which can take time depending on the volume of stored data. Applications continue to function during this process, but plan for the re-encryption period in operational change windows.",
  "example": "Update a Timestream database to use a customer-managed KMS key: aws timestream-write update-database --database-name ManufacturingData --kms-key-id arn:aws:kms:us-east-1:123456789012:key/mrk-00000000000000000000000000000001.",
  "sources": [
    {
      "title": "Security and Encryption at Rest in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/EncryptionAtRest.html"
    },
    {
      "title": "AWS KMS Integration with Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/security-kms.html"
    }
  ]
});
