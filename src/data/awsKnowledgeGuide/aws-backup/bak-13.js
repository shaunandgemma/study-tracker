import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-13",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Lifecycle to Cold Storage",
  "status": "ready",
  "plainEnglish": "Lifecycle to Cold Storage is an automated tiering feature in AWS Backup that moves older recovery points from warm (standard) backup storage to a significantly lower-cost cold storage tier. Cold storage is designed for rarely accessed archival backups that must be preserved for long-term compliance (e.g., 1 to 10 years). While cold storage incurs a small retrieval fee and requires additional time to restore, its storage cost is up to 80–90% cheaper than warm backup storage.",
  "whyItMatters": "Enterprise compliance standards often require keeping backups for 5 to 10 years, even though data is almost never restored after 90 days. Moving backups to cold storage after 30 or 90 days allows organizations to satisfy strict multi-year compliance retention mandates at a fraction of the cost.",
  "workplaceExample": "An insurance enterprise configures an AWS Backup lifecycle rule on its Amazon EFS and DynamoDB backups: snapshots remain in warm storage for 30 days for fast operational restores, transition to cold storage on day 31, and expire permanently after 2,555 days (7 years).",
  "examFocus": "For SAA-C03, know that AWS Backup supports transitioning recovery points to cold storage for long-term cost optimization (supported for services like Amazon EFS, DynamoDB, S3, and VMware). Understand that cold storage recovery points must be stored for at least 90 days, and deletion before 90 days results in early deletion charges.",
  "keyPoints": [
    "Transitions recovery points from warm storage to lower-cost cold archival storage.",
    "Configured via the `MoveToColdStorageAfterDays` parameter in backup rule lifecycle settings.",
    "Delivers substantial cost savings for multi-year regulatory and compliance archives.",
    "Requires a minimum retention of 90 days in cold storage before deletion.",
    "Restoring from cold storage incurs a data retrieval fee and takes longer than warm restores."
  ],
  "commonMistake": "Keeping long-term compliance backups in warm storage for 5 to 7 years without lifecycle rules, resulting in unnecessarily high monthly AWS Backup storage bills. Configure `MoveToColdStorageAfterDays` for any backups retained longer than 30 or 90 days.",
  "example": "Lifecycle:\n  MoveToColdStorageAfterDays: 30 # Moves backup to cold storage after 30 days\n  DeleteAfterDays: 2555          # Deletes backup after 7 years (2555 days)",
  "sources": [
    {
      "title": "Managing Lifecycle to Cold Storage in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/cleanup-backups.html"
    },
    {
      "title": "AWS Backup Pricing and Storage Tiers",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html#pricing"
    }
  ]
});
