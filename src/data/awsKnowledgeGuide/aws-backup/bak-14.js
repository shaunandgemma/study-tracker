import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-14",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Cross-Region Backup Copy",
  "status": "ready",
  "plainEnglish": "Cross-Region Backup Copy is a feature in AWS Backup that automatically copies recovery points from a backup vault in your primary AWS Region to a target backup vault in a secondary AWS Region. You configure this directly inside a Backup Rule by adding a Copy Action. Once configured, whenever a local backup completes, AWS Backup automatically transfers and re-encrypts a copy of the recovery point in the destination Region.",
  "whyItMatters": "Cross-Region copies form the backbone of Disaster Recovery (DR) architectures. If an entire AWS geographic Region experiences a catastrophic outage or localized disaster, your business can quickly restore critical workloads, databases, and file systems from the secondary Region, meeting strict business continuity requirements.",
  "workplaceExample": "A global media company operates its primary workloads in `us-east-1` (N. Virginia). Inside their daily AWS Backup plan, they configure a copy action targeting a backup vault in `us-west-2` (Oregon). If `us-east-1` goes offline, engineers can restore the entire production environment in Oregon within hours.",
  "examFocus": "For SAA-C03, Cross-Region Backup Copy is the standard pattern for multi-region disaster recovery and high availability. Understand that cross-region copies require specifying a target vault ARN in the destination Region, can define independent retention periods in the target Region, and are re-encrypted with the target vault's KMS key.",
  "keyPoints": [
    "Automatically replicates recovery points to a target vault in a different AWS Region.",
    "Essential component for building multi-region Disaster Recovery (DR) solutions.",
    "Destination recovery points can have independent lifecycle and retention schedules.",
    "Backups are automatically re-encrypted using the destination vault's KMS encryption key.",
    "Supports cross-region replication across all major AWS Backup supported services."
  ],
  "commonMistake": "Attempting to copy backups across regions using custom scripts, EC2 AMI copy jobs, and RDS manual snapshot copies separately. AWS Backup consolidates all cross-region copy operations into a single automated rule action.",
  "example": "BackupPlanRule:\n  - RuleName: DailyBackupWithCrossRegionCopy\n    TargetBackupVault: PrimaryVault\n    ScheduleExpression: 'cron(0 3 ? * * *)'\n    CopyActions:\n      - DestinationBackupVaultArn: 'arn:aws:backup:us-west-2:123456789012:backup-vault:DrVault'\n        Lifecycle:\n          DeleteAfterDays: 14",
  "sources": [
    {
      "title": "Creating Cross-Region Backups in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/cross-region-backup.html"
    },
    {
      "title": "Disaster Recovery with Cross-Region Copies",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/disaster-recovery.html"
    }
  ]
});
