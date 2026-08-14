import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-5",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Backup Plans",
  "status": "ready",
  "plainEnglish": "A Backup Plan is a policy document in AWS Backup that defines when and how your AWS resources are protected. It acts as the master container that holds one or more Backup Rules (which specify schedules, frequency, target vaults, retention periods, and lifecycle transitions) along with Resource Assignments (which specify which AWS resources or tags the plan applies to).",
  "whyItMatters": "Backup Plans turn complex data retention policies into automated declarative configurations. Once a backup plan is created and assigned, AWS Backup automatically runs backup jobs according to schedule without any manual intervention, ensuring continuous compliance with regulatory standards.",
  "workplaceExample": "A cloud platform team defines a 'Standard-Production-Plan' that contains two rules: a daily backup rule retaining snapshots for 35 days, and a monthly backup rule copying snapshots to cold storage and retaining them for 7 years. The plan is assigned to all resources tagged with 'BackupTier=Gold'.",
  "examFocus": "For SAA-C03, understand the anatomy of a Backup Plan: it contains Backup Rules (schedule, window, lifecycle, target vault, copy actions) and Resource Assignments (explicit resource ARNs or tag-based selectors). Know that a single backup plan can protect heterogeneous resources across different services simultaneously.",
  "keyPoints": [
    "A Backup Plan is the top-level policy defining backup frequency, retention, and targets.",
    "Contains one or more Backup Rules that configure the operational parameters.",
    "Binds to AWS resources through explicit ARNs or dynamic tag-based selections.",
    "Can define cross-Region and cross-account backup copy actions within rules.",
    "Can be authored via AWS Console, AWS CLI, CloudFormation, or AWS Organizations policies."
  ],
  "commonMistake": "Creating separate backup plans for every individual AWS resource. Instead, create a few standard tiered backup plans (e.g., Bronze, Silver, Gold) and use resource tags to assign resources to the appropriate plan automatically.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: AWS Backup Plan with daily schedule rule.\nResources:\n  DailyBackupPlan:\n    Type: AWS::Backup::BackupPlan\n    Properties:\n      BackupPlan:\n        PlanName: DailyProductionPlan\n        BackupPlanRule:\n          - RuleName: DailyRule\n            TargetBackupVault: Default\n            ScheduleExpression: 'cron(0 5 ? * * *)'\n            Lifecycle:\n              DeleteAfterDays: 30",
  "sources": [
    {
      "title": "Creating a Backup Plan",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-backup-plan.html"
    },
    {
      "title": "How AWS Backup Works",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/how-backup-works.html"
    }
  ]
});
