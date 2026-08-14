import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-6",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Backup Rules",
  "status": "ready",
  "plainEnglish": "A Backup Rule is a specific instruction set defined inside a Backup Plan. It determines the operational mechanics of the backup, including the backup frequency and schedule (using cron or rate expressions), the backup window (start time and completion timeframe), the target Backup Vault, the retention period (how long backups are kept before deletion), lifecycle transitions (when backups move to cold storage), and automated copy actions to other AWS Regions or accounts.",
  "whyItMatters": "Backup rules give you granular control over backup execution windows to avoid impacting database performance during peak business hours. Setting start windows and completion windows ensures heavy backup processes run only during off-peak maintenance windows.",
  "workplaceExample": "A database administrator configures a backup rule named 'Nightly-EBS-Rule' that starts at 02:00 UTC (during low traffic), must start within 1 hour, must complete within 4 hours, stores snapshots in 'ProductionVault', and retains them for 14 days before automatic deletion.",
  "examFocus": "For SAA-C03, know what settings live within a Backup Rule: Schedule expression (cron/rate), Start Window (timeframe within which backup job must begin), Completion Window (maximum allowed duration), Target Vault, Lifecycle (Cold Storage transition and Expiration/Delete), and Copy Actions (target vault in another Region/Account).",
  "keyPoints": [
    "Defines the schedule, start window, completion window, and target vault for backups.",
    "Schedule expressions use standard AWS cron or rate syntax (e.g., cron(0 12 * * ? *)).",
    "Backup windows prevent jobs from starting or continuing into high-traffic business hours.",
    "Configures lifecycle rules to move recovery points to cold storage and set deletion dates.",
    "Can include automated copy actions to duplicate recovery points to secondary Regions or accounts."
  ],
  "commonMistake": "Setting a backup start time during peak business hours without a backup window, causing I/O-intensive backup jobs to compete with live user traffic. Always schedule backup rules during off-peak maintenance windows with appropriate start and completion bounds.",
  "example": "BackupPlanRule:\n  - RuleName: OffPeakWeeklyRule\n    TargetBackupVault: WeeklyVault\n    ScheduleExpression: 'cron(0 2 ? * SUN *)'\n    StartWindowMinutes: 60\n    CompletionWindowMinutes: 360\n    Lifecycle:\n      MoveToColdStorageAfterDays: 30\n      DeleteAfterDays: 365",
  "sources": [
    {
      "title": "Creating a Backup Plan and Rules",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-backup-plan.html"
    },
    {
      "title": "Backup Plan Options and Configuration",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/backup-plan-options.html"
    }
  ]
});
