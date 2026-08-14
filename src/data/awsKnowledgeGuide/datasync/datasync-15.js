import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-15",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "Scheduled Transfers",
  "status": "ready",
  "plainEnglish": "Scheduled Transfers in AWS DataSync allow you to automate the periodic execution of your data synchronization tasks using standard cron expressions or predefined intervals (such as hourly, daily, or weekly). Once a schedule is attached to a task, AWS DataSync automatically launches task executions at the specified times, scanning for incremental changes and transferring newly created or modified files without requiring human intervention.",
  "whyItMatters": "Many organizations require recurring daily or hourly data syncs for disaster recovery, data distribution, or analytics ingestion. Built-in task scheduling eliminates the need to build external cron infrastructure, AWS Lambda triggers, or Amazon EventBridge rules to orchestrate recurring transfers.",
  "workplaceExample": "A retail bank schedules a DataSync task to run every night at 01:00 UTC (`cron(0 1 * * ? *)`) to replicate transaction log files from on-premises Linux branch servers to an Amazon S3 compliance bucket, ensuring that offsite disaster recovery copies are never more than 24 hours old.",
  "examFocus": "For SAA-C03, know that AWS DataSync has native built-in task scheduling using cron expressions or frequency presets. A scheduled task copies only changed/modified files (incremental sync) during each run, optimizing bandwidth and transfer duration. Tasks can also be triggered programmatically using Amazon EventBridge and the AWS SDK.",
  "keyPoints": [
    "Native built-in scheduling using cron expressions or predefined frequency intervals.",
    "Eliminates the need for external crontabs, Lambda functions, or custom orchestrators.",
    "Executes incremental transfers on every scheduled run to minimize network transfer time.",
    "Integrates with Amazon EventBridge for event-driven or rule-based execution.",
    "Can be paired with bandwidth throttling schedules to protect daytime business network traffic."
  ],
  "commonMistake": "Scheduling tasks to run every 15 minutes when the dataset is so large that scanning and transfer take 30 minutes. If a scheduled run starts while a previous run is still active, the new execution will be queued or fail; adjust schedule frequencies to allow previous runs to complete.",
  "example": "# Create a task with a daily schedule at midnight UTC:\naws datasync create-task \\\n  --source-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-0123456789abcdef0 \\\n  --destination-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-0fedcba9876543210 \\\n  --schedule '{\"ScheduleExpression\":\"cron(0 0 * * ? *)\"}' \\\n  --name DailyMidnightBackup",
  "sources": [
    {
      "title": "Scheduling AWS DataSync Tasks",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/task-scheduling.html"
    },
    {
      "title": "Automating DataSync with Amazon EventBridge",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/automating-datasync-eventbridge.html"
    }
  ]
});
