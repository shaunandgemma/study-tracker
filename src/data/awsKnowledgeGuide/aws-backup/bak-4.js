import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-4",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "AWS Backup Centralized Backup Management",
  "status": "ready",
  "plainEnglish": "AWS Backup is a fully managed, policy-based service that centralizes and automates data protection across multiple AWS services in the cloud and on premises. Instead of writing custom scripts, configuring separate snapshots in Amazon EC2, managing isolated backups in Amazon RDS, and setting up independent lifecycle policies in Amazon EFS, AWS Backup provides a single dashboard and unified API to schedule, monitor, encrypt, retain, and restore backups across your entire AWS footprint.",
  "whyItMatters": "Managing backups across dozens of individual AWS services with custom cron jobs and Lambda scripts is error-prone, difficult to audit, and creates compliance gaps. Centralized backup management ensures that all critical workloads meet business Recovery Point Objectives (RPO) and Recovery Time Objectives (RTO) under consistent governance.",
  "workplaceExample": "An enterprise operating hundreds of microservices uses AWS Backup to enforce a company-wide policy: all databases (RDS, Aurora, DynamoDB) and storage volumes (EBS, EFS) tagged with 'Environment=Production' are backed up daily at midnight, retained for 30 days, and encrypted with a corporate KMS key without manual intervention from application teams.",
  "examFocus": "For SAA-C03, AWS Backup is the recommended solution whenever a scenario requires centralizing, automating, or consolidating backup schedules, retention policies, cross-region disaster recovery, or cross-account copies across multiple AWS storage and compute services. Contrast this with individual native service snapshots (which lack centralized scheduling and unified compliance reporting).",
  "keyPoints": [
    "Provides a single centralized console and policy engine for backing up multiple AWS services.",
    "Eliminates the need for custom snapshot scripts, Lambda functions, and manual cron triggers.",
    "Supports compute, block storage, file systems, databases, object storage, and hybrid gateways.",
    "Automates backup scheduling, retention policies, lifecycle transitions, and deletion protection.",
    "Integrates with AWS Organizations to enforce backup policies across hundreds of accounts."
  ],
  "commonMistake": "Building and maintaining custom Lambda scripts or EventBridge rules to take daily EBS snapshots and RDS snapshots independently, which leads to maintenance overhead and lacks unified audit tracking. Use AWS Backup plans to automate data protection natively.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Centralized AWS Backup Vault configuration.\nResources:\n  EnterpriseBackupVault:\n    Type: AWS::Backup::BackupVault\n    Properties:\n      BackupVaultName: EnterpriseProductionVault\n      EncryptionKeyArn: !Sub 'arn:aws:kms:${AWS::Region}:${AWS::AccountId}:alias/aws/backup'",
  "sources": [
    {
      "title": "What is AWS Backup?",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html"
    },
    {
      "title": "Getting Started with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/getting-started.html"
    }
  ]
});
