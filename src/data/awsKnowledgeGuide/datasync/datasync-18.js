import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-18",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "Data Integrity Verification",
  "status": "ready",
  "plainEnglish": "Data Integrity Verification in AWS DataSync is an automated validation process that ensures every transferred file and object is copied accurately without corruption, truncation, or bit rot. DataSync performs in-line checksumming during transit and performs a post-transfer verification phase where it compares cryptographically secure checksums of the data in the source against the data stored in the destination.",
  "whyItMatters": "In regulated industries (healthcare, finance, government), data loss or corruption during migration can violate compliance mandates and invalidate backups. Manual verification across millions of files requires writing custom hashing scripts that can take days to run. DataSync provides built-in, audit-ready verification out of the box.",
  "workplaceExample": "A medical records provider migrates 50 TB of patient scans to Amazon S3. They set DataSync's verification mode to `POINT_IN_TIME_CONSISTENT`. Upon task completion, DataSync confirms 100% byte-for-byte checksum parity across all 15 million objects and publishes the verification results to CloudWatch Logs for compliance auditors.",
  "examFocus": "For SAA-C03, know that DataSync provides built-in data integrity verification: (1) Point-in-time consistent (verifies all transferred data and metadata at end of task), (2) Only transferred data (faster verification limited to newly copied files), and (3) None (disables post-transfer verification for speed). Checksums are computed in transit and at rest.",
  "keyPoints": [
    "Performs automatic cryptographic checksum comparisons between source and destination.",
    "Modes: POINT_IN_TIME_CONSISTENT (verifies entire dataset), ONLY_FILES_TRANSFERRED, or NONE.",
    "In-line verification detects network bit-flips or transmission errors in real time.",
    "Logs failed file verifications to Amazon CloudWatch Logs for auditing and re-tries.",
    "Ensures compliance with strict data governance and regulatory retention standards."
  ],
  "commonMistake": "Setting VerifyMode to NONE in production migration cutovers to save a few minutes, risking undetected data corruption or missing files in your primary cloud storage.",
  "example": "# Create a task with strict point-in-time data verification:\naws datasync create-task \\\n  --source-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-0123456789abcdef0 \\\n  --destination-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-0fedcba9876543210 \\\n  --options '{\"VerifyMode\":\"POINT_IN_TIME_CONSISTENT\"}' \\\n  --name VerifiedProductionMigration",
  "sources": [
    {
      "title": "Verifying the Integrity of Your Data in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/data-integrity.html"
    },
    {
      "title": "Understanding DataSync Verification Modes",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/data-integrity.html#verification-options"
    }
  ]
});
