import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-31",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Lifecycle Manager",
  "status": "ready",
  "plainEnglish": "Amazon Data Lifecycle Manager (DLM) for Amazon EBS is an automated policy engine that automates the creation, retention, cross-region copying, and deletion of Amazon EBS snapshots and EBS-backed Amazon Machine Images (AMIs). By defining lifecycle policies based on resource tags (such as `Backup=Daily` or `Department=Finance`), DLM manages your entire backup lifecycle without requiring custom scripts, cron jobs, or Lambda functions.",
  "whyItMatters": "Manual backup scripts frequently fail, get forgotten, or create endless snapshots that never get pruned, resulting in skyrocketing storage bills. DLM provides automated, declarative backup governance that ensures strict compliance with backup schedules and automatically deletes expired snapshots according to retention rules.",
  "workplaceExample": "An enterprise operations team defines a DLM lifecycle policy targeting all EBS volumes tagged `Environment=Production`. The policy automatically takes snapshots every 12 hours, retains them for 14 days, archives snapshots older than 30 days to EBS Snapshot Archive, and replicates them to a disaster recovery region (`us-west-2`).",
  "examFocus": "For SAA-C03, know that Amazon Data Lifecycle Manager (Amazon DLM) is the native automated tool for managing EBS snapshot and AMI lifecycles based on tags. Key capabilities include: schedule intervals (hourly, daily, weekly, monthly, cron), retention rules (by count or age), cross-region snapshot replication, snapshot archiving, and Fast Snapshot Restore (FSR) automation.",
  "keyPoints": [
    "Automates creation, retention, archiving, and deletion of EBS snapshots and AMIs.",
    "Operates declaratively using resource tags (e.g. `BackupSchedule=Daily`).",
    "Eliminates the need for custom backup scripts, cron jobs, and Lambda functions.",
    "Supports cross-region copying and automatic transition to EBS Snapshot Archive tier.",
    "Enables automated Fast Snapshot Restore (FSR) enablement on newly created snapshots."
  ],
  "commonMistake": "Writing complex custom Python AWS Lambda functions on EventBridge cron schedules to snapshot EBS volumes and loop through deletion logic. Use Amazon Data Lifecycle Manager (DLM) for fully managed, built-in, and zero-maintenance backup automation.",
  "example": "# Create a DLM policy for automated daily snapshots with 7-day retention:\naws dlm create-lifecycle-policy \\\n  --description \"Daily Production EBS Snapshot Policy\" \\\n  --state ENABLED \\\n  --execution-role-arn arn:aws:iam::123456789012:role/AWSDataLifecycleManagerDefaultRole \\\n  --policy-details file://dlm-policy.json",
  "sources": [
    {
      "title": "Amazon Data Lifecycle Manager for EBS Snapshots",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-lifecycle.html"
    },
    {
      "title": "Creating an Amazon Data Lifecycle Manager Policy",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/lifecycle-policies.html"
    }
  ]
});
