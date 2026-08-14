import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-20",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Point-in-Time Recovery for Supported Services",
  "status": "ready",
  "plainEnglish": "Point-in-Time Recovery (PITR), also known as continuous backup, allows you to restore your AWS resources to any precise second within a configured retention window (typically up to 35 days). Instead of only restoring to snapshot checkpoints (like 02:00 UTC or 06:00 UTC), continuous backup constantly logs transaction change events. If accidental data corruption occurs at 14:23:45, you can restore the resource to exactly 14:23:44.",
  "whyItMatters": "Periodic snapshots leave a gap in data protection between snapshot windows. If a snapshot runs once daily at midnight and a database is dropped at 23:00, standard snapshot recovery loses 23 hours of business data. Point-in-Time Recovery reduces data loss to near zero (RPO of seconds).",
  "workplaceExample": "An engineer accidentally executes an unconstrained `DELETE FROM accounts;` statement on an Amazon RDS database at 10:14:15 AM. Because AWS Backup continuous backup is enabled, the DBA initiates a point-in-time restore to 10:14:14 AM, recovering all customer account balances with zero data loss.",
  "examFocus": "For SAA-C03, know that AWS Backup supports continuous backups and Point-in-Time Recovery (PITR) for supported services including Amazon RDS, Amazon Aurora, Amazon S3, and Amazon DynamoDB. Continuous backups provide granular restoration to any timestamp within the retention window (up to 35 days).",
  "keyPoints": [
    "Enables restoration to any specific second within the continuous retention window.",
    "Provides near-zero Recovery Point Objective (RPO) for mission-critical databases and storage.",
    "Supported for services including Amazon RDS, Aurora, DynamoDB, and Amazon S3.",
    "Continuous retention window can be configured up to a maximum of 35 days.",
    "Combines periodic baseline snapshots with continuous transaction change logs."
  ],
  "commonMistake": "Relying solely on daily snapshot backups for high-transaction production databases. If data corruption happens mid-day, snapshot restoration results in hours of lost transactions. Enable continuous backup / PITR for critical workloads.",
  "example": "# Restore an RDS instance to a specific timestamp using AWS Backup CLI:\naws backup start-restore-job \\\n  --recovery-point-arn arn:aws:backup:us-east-1:123456789012:recovery-point:abc-123 \\\n  --metadata '{\"targetDatabaseName\":\"restored-db\",\"restoreToTime\":\"2026-08-14T10:14:14Z\"}' \\\n  --iam-role-arn arn:aws:iam::123456789012:role/service-role/AWSBackupDefaultServiceRole",
  "sources": [
    {
      "title": "Point-in-Time Recovery (Continuous Backup) in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/point-in-time-recovery.html"
    },
    {
      "title": "Continuous Backups and PITR Supported Resources",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html#continuous-backup"
    }
  ]
});
