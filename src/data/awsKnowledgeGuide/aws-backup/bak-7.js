import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-7",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Backup Vaults",
  "status": "ready",
  "plainEnglish": "A Backup Vault is a secure, logical container in AWS Backup used to organize and store recovery points (backups). When an AWS Backup job runs, the resulting backup snapshot or data copy is stored inside a designated backup vault. Vaults allow you to isolate backups by department, environment, or compliance tier, and serve as the security boundary where you define access policies, KMS encryption keys, and Vault Lock protection rules.",
  "whyItMatters": "Backup vaults decouple backup storage and permissions from the original source resources. Even if an attacker gains administrator access to an EC2 instance or RDS database, strict vault access policies and encryption prevent the attacker from tampering with or deleting the recovery points stored in the vault.",
  "workplaceExample": "A security architect sets up a dedicated 'Financial-Audit-Vault'. The vault is attached to a resource-based policy that denies all `backup:DeleteRecoveryPoint` actions for non-security principals, ensuring that financial backups cannot be deleted even by account administrators.",
  "examFocus": "For SAA-C03, know that Backup Vaults are encrypted containers for recovery points. Each vault has an associated AWS KMS key and an optional resource-based Access Policy. Understand that vaults can be locked using AWS Backup Vault Lock (WORM compliance), making backups immutable against deletion or retention reduction.",
  "keyPoints": [
    "A logical storage container in AWS Backup that organizes and secures recovery points.",
    "Every vault is encrypted at rest using an AWS KMS key (AWS managed or customer managed CMK).",
    "Supports resource-based access policies (Vault Access Policies) to control IAM access.",
    "Supports AWS Backup Vault Lock for immutable, Write-Once-Read-Many (WORM) compliance.",
    "Vaults exist per Region, but cross-Region copy actions can transfer recovery points between vaults."
  ],
  "commonMistake": "Storing production backups in the default unmanaged vault without custom access policies. Use dedicated custom vaults with restrictive resource-based policies and customer-managed KMS keys for production workloads.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Dedicated production backup vault with access policy.\nResources:\n  SecureProductionVault:\n    Type: AWS::Backup::BackupVault\n    Properties:\n      BackupVaultName: SecureProductionVault\n      AccessPolicy:\n        Version: '2012-10-17'\n        Statement:\n          - Effect: Deny\n            Principal: '*'\n            Action: backup:DeleteRecoveryPoint\n            Resource: '*'",
  "sources": [
    {
      "title": "Backup Vaults in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/vaults.html"
    },
    {
      "title": "Managing Backup Vault Access Policies",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-access-policies.html"
    }
  ]
});
