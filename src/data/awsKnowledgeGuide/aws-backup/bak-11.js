import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-11",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Schedule-Based Backups",
  "status": "ready",
  "plainEnglish": "Schedule-Based Backups allow you to configure automated, recurring backup jobs using predefined frequencies (such as hourly, daily, weekly, or monthly) or custom cron/rate expressions in AWS Backup. When a scheduled time arrives, AWS Backup automatically initiates a backup job, captures a snapshot or point-in-time recovery point, and places it in the designated backup vault.",
  "whyItMatters": "Business Continuity and Disaster Recovery (BCDR) frameworks require strict Recovery Point Objectives (RPO). Schedule-based backups guarantee that data is captured at consistent, predictable intervals without depending on manual human intervention.",
  "workplaceExample": "A retail bank configures two schedules in AWS Backup: an hourly snapshot schedule for high-transaction Aurora databases during business hours (yielding an RPO of 1 hour), and a daily snapshot schedule for EBS root volumes at 03:00 UTC.",
  "examFocus": "For SAA-C03, know how schedules are configured in AWS Backup: via standard frequencies (Every 12 hours, Daily, Weekly, Monthly) or customized Cron expressions (e.g., `cron(0 5 ? * * *)`). Understand the relationship between backup schedules and Recovery Point Objective (RPO): shorter schedule intervals reduce potential data loss.",
  "keyPoints": [
    "Triggers automated backup creation on fixed recurring schedules.",
    "Supports predefined intervals (Daily, Weekly, Monthly) and custom Cron / Rate syntax.",
    "Controls Recovery Point Objective (RPO) by determining the maximum timeframe of potential data loss.",
    "Works in combination with Start Windows to ensure backups initiate during off-peak hours.",
    "Integrates with Amazon EventBridge for alerts on scheduled backup start, completion, or failure."
  ],
  "commonMistake": "Scheduling all enterprise database and volume backups to trigger at the exact same minute (e.g., midnight), causing massive concurrent I/O spikes and API rate limiting. Stagger backup schedule start times across different resource tiers.",
  "example": "ScheduleExpression: 'cron(0 1 * * ? *)' # Runs daily at 01:00 UTC\nStartWindowMinutes: 120 # Job must start within 2 hours of schedule trigger\nCompletionWindowMinutes: 480 # Job must finish within 8 hours",
  "sources": [
    {
      "title": "Schedule Expressions in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-backup-plan.html#backup-plan-schedule"
    },
    {
      "title": "Monitoring Backup Jobs with EventBridge",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/monitoring.html"
    }
  ]
});
