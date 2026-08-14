import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-efs",
  "topicTitle": "Amazon EFS (Elastic File System)",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "efs-30",
  "title": "EFS Backup with AWS Backup",
  "plainEnglish": "AWS Backup is a managed, policy-based service for protecting EFS data. A backup plan can schedule backups, set retention and lifecycle rules, and store recovery points in a backup vault. EFS data can be restored to a new or existing file system.",
  "whyItMatters": "Regional EFS availability protects access during infrastructure failures, but it does not undo accidental deletion, corruption, or unwanted changes. Backups provide separate recovery points that match business recovery and retention requirements.",
  "workplaceExample": "A legal team assigns its EFS file system to a daily backup plan with long retention. Operations regularly restores selected files into a test file system to prove that recovery works.",
  "examFocus": "Distinguish availability, replication, and backup. Regional EFS provides multi-zone availability, replication maintains another file-system copy, and AWS Backup provides retained recovery points. Backup plans control frequency, windows, retention, and lifecycle.",
  "keyPoints": [
    "Amazon EFS is natively integrated with AWS Backup.",
    "Backup plans automate scheduling, retention, and backup lifecycle settings.",
    "EFS restores can target a new or existing file system and can be full or item-level.",
    "AWS Backup performs an initial full backup and then incremental backups of changed, added, or removed data.",
    "Applications can keep using EFS during backup, but concurrent changes can make backup contents inconsistent.",
    "Test restores and monitor recovery points against the required recovery objectives."
  ],
  "commonMistake": "Assuming every EFS file system has automatic backups enabled is unsafe. Console-created systems enable them by default, while Command Line Interface (CLI) or API creation enables them by default only for One Zone systems; verify the setting.",
  "example": "Assign production EFS to a daily backup plan with approved retention. Schedule it for a quiet write period, monitor completion, and restore a directory into non-production to test recovery.",
  "sources": [
    {
      "title": "Backing up EFS file systems",
      "url": "https://docs.aws.amazon.com/efs/latest/ug/awsbackup.html"
    }
  ]
});
