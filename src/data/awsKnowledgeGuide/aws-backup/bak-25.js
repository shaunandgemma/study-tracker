import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-25",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "EFS Backup",
  "status": "ready",
  "plainEnglish": "EFS Backup in AWS Backup provides native, automated, incremental backups of Amazon Elastic File System (Amazon EFS) file systems. AWS Backup automatically captures changes at the file and directory level, storing incremental recovery points inside your backup vault. You can restore an entire EFS file system, or restore specific individual files and directories to an existing file system or a brand new one.",
  "whyItMatters": "Amazon EFS serves shared file storage across multiple containers, EC2 instances, and on-premises servers. Native EFS integration in AWS Backup eliminates complex rsync or custom file copy scripts and allows moving old EFS backups into cold storage for massive cost savings.",
  "workplaceExample": "A content management system stores 5 TB of user-uploaded images and documents on an Amazon EFS file system mounted by 20 ECS containers. AWS Backup takes daily incremental snapshots and allows the team to restore an accidentally deleted folder without touching the rest of the file system.",
  "examFocus": "For SAA-C03, know that AWS Backup is the native and recommended backup solution for Amazon EFS (Amazon EFS has automatic backup enabled by default via AWS Backup). AWS Backup supports item-level (file/directory level) and full file system restores, as well as transitioning EFS backups to cold storage.",
  "keyPoints": [
    "Native, fully managed incremental backup solution for Amazon EFS.",
    "Automatic backups are enabled by default for new EFS file systems created in the AWS console.",
    "Supports restoring complete file systems or individual files and directories.",
    "Can restore into an existing EFS file system or provision a brand-new file system.",
    "Supports lifecycle transitions of EFS recovery points to cold storage for cost optimization."
  ],
  "commonMistake": "Building custom cron jobs using rsync or AWS DataSync to copy EFS data to S3 just for backup purposes. AWS Backup provides native, incremental EFS backups with granular item-level restore and automated cold tiering.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: EFS File System with automatic AWS Backup enabled.\nResources:\n  SecureEFSFileSystem:\n    Type: AWS::EFS::FileSystem\n    Properties:\n      BackupPolicy:\n        Status: ENABLED\n      Encrypted: true",
  "sources": [
    {
      "title": "Backing Up Amazon EFS with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/efs-backups.html"
    },
    {
      "title": "Restoring Amazon EFS File Systems",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/restoring-efs.html"
    }
  ]
});
