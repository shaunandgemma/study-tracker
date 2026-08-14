import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-30",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "AWS Backup vs Native Service Backups",
  "status": "ready",
  "plainEnglish": "While many AWS services offer built-in native snapshot tools (such as Amazon RDS automated snapshots, EBS Lifecycle Manager, or DynamoDB on-demand backups), AWS Backup is a centralized management plane that orchestrates, standardizes, and extends data protection across all of those services. Rather than managing separate backup schedules, retention scripts, and access permissions in every individual AWS service console, AWS Backup provides a single pane of glass, centralized IAM policies, immutable Backup Vault Locks, cross-account disaster recovery, and unified compliance reporting.",
  "whyItMatters": "Native backups are service-siloed and lack organization-wide governance. Using native service snapshots in an enterprise creates fragmented policies, makes cross-service disaster recovery complex, and exposes backups to deletion if an individual service role is compromised.",
  "workplaceExample": "An enterprise migrates from fragmented native snapshot configurations (EBS Data Lifecycle Manager policies, independent RDS snapshot schedules, and manual S3 version replication) to AWS Backup. The migration reduces administrative overhead by 75% and ensures all resources adhere to a unified 30-day retention and KMS encryption policy.",
  "examFocus": "For SAA-C03, compare AWS Backup with native service backups: Native backups (like EBS DLM or RDS automated snapshots) operate only within a single service and single account. AWS Backup provides cross-service policy automation, organization-wide governance, cross-account copies, immutable Vault Lock (WORM), restore testing, and compliance audit reporting.",
  "keyPoints": [
    "AWS Backup centralizes policy management across multiple distinct AWS storage and database services.",
    "Native backups operate in isolated service silos without unified organizational visibility.",
    "AWS Backup provides immutable Backup Vault Lock (WORM), which native snapshots do not offer directly.",
    "Supports cross-account and cross-Region copy actions driven by a single policy rule.",
    "Includes built-in automated restore testing and audit compliance tracking."
  ],
  "commonMistake": "Configuring both Amazon EBS Data Lifecycle Manager (DLM) and an AWS Backup plan on the same EBS volumes, causing duplicate snapshots, redundant API calls, and doubled storage costs. Choose AWS Backup as the single centralized backup manager.",
  "example": "# AWS Backup centralizes multi-service tag selection into one declarative resource assignment:\nListOfTags:\n  - ConditionType: STRINGEQUALS\n    ConditionKey: BackupTier\n    ConditionValue: EnterpriseGold",
  "sources": [
    {
      "title": "AWS Backup vs Native Service Data Protection",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html"
    },
    {
      "title": "Data Protection Overview on AWS",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/aws-storage-services-overview/backup-and-recovery.html"
    }
  ]
});
