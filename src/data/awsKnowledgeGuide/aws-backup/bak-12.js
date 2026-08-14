import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-12",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Backup Retention",
  "status": "ready",
  "plainEnglish": "Backup Retention defines how long recovery points (backups) are kept in an AWS Backup vault before they are automatically expired and deleted. You specify retention periods in days, weeks, months, or years within a Backup Rule (using the `DeleteAfterDays` lifecycle parameter). Once a recovery point reaches its retention expiration date, AWS Backup automatically deletes it, freeing up storage and stopping ongoing storage costs.",
  "whyItMatters": "Without automated retention policies, recovery points accumulate indefinitely, leading to massive unnecessary storage bills and potential regulatory compliance violations (such as retaining sensitive personal data longer than legally permitted).",
  "workplaceExample": "A fintech company creates a daily backup rule with `DeleteAfterDays: 90` for standard operational recovery, and an annual backup rule with `DeleteAfterDays: 2555` (7 years) to satisfy federal financial record-keeping laws.",
  "examFocus": "For SAA-C03, know that backup retention is configured using the Lifecycle settings in a Backup Rule (`DeleteAfterDays`). Understand how retention interacts with AWS Backup Vault Lock: when Vault Lock is active in Compliance mode, backups cannot be deleted by any user (even root) before their retention period expires.",
  "keyPoints": [
    "Controls the lifespan of recovery points in an AWS Backup vault.",
    "Configured via the `DeleteAfterDays` parameter in a backup rule's lifecycle settings.",
    "Automatically deletes expired recovery points without manual cleanup scripts.",
    "Prevents runaway cloud storage costs caused by unbounded backup accumulation.",
    "Works alongside Backup Vault Lock to enforce minimum and maximum retention compliance."
  ],
  "commonMistake": "Creating backup plans without setting an expiration/retention period, causing snapshots to persist permanently and continuously increasing AWS storage costs month after month. Always define an explicit `DeleteAfterDays` retention limit.",
  "example": "Lifecycle:\n  DeleteAfterDays: 90 # Recovery points automatically deleted after 90 days",
  "sources": [
    {
      "title": "Managing Backup Retention and Lifecycle",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/cleanup-backups.html"
    },
    {
      "title": "Deleting Expired Backups in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/deleting-backups.html"
    }
  ]
});
