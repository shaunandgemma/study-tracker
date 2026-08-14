import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-18",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Backup Vault Lock",
  "status": "ready",
  "plainEnglish": "AWS Backup Vault Lock is a security feature that enforces a Write-Once-Read-Many (WORM) storage model on your backup vaults. Once applied, Vault Lock prevents anyone—including the AWS account root user, IAM administrators, and AWS Support—from deleting recovery points or shortening retention periods before their expiration date. Vault Lock supports two modes: Governance mode (where authorized users with specific IAM permissions can unlock or modify the vault) and Compliance mode (where the lock is completely irreversible after a mandatory cooling-off grace period).",
  "whyItMatters": "Ransomware attackers who gain administrator access often attempt to delete backups before encrypting production databases. Vault Lock guarantees that backup snapshots cannot be deleted or altered by any compromised credential, providing absolute protection against ransomware extortion and satisfying strict SEC 17a-4 compliance mandates.",
  "workplaceExample": "A banking institution enables AWS Backup Vault Lock in Compliance mode on its main financial archive vault with a minimum retention of 365 days. Even if an attacker steals the root credentials, AWS Backup will reject all API calls attempting to delete or expire the financial snapshots before their 1-year retention expires.",
  "examFocus": "For SAA-C03, Backup Vault Lock is the primary answer for protecting backups against ransomware, malicious deletion, and insider threats (WORM compliance). Understand the two modes: Governance Mode (can be modified by users with `backup:DeleteBackupVaultLockConfiguration` permission) vs Compliance Mode (permanent and irreversible after a cooling-off period of 3 to 365 days; cannot be unlocked even by root).",
  "keyPoints": [
    "Enforces Write-Once-Read-Many (WORM) immutability on backup vaults.",
    "Prevents premature deletion of recovery points and prevents altering retention limits.",
    "Governance Mode allows privileged IAM administrators to modify or delete the lock if needed.",
    "Compliance Mode becomes strictly irreversible after a configurable cooling-off grace period (3 to 365 days).",
    "Under Compliance Mode, not even the AWS root account or AWS Support can delete backups or disable the lock."
  ],
  "commonMistake": "Confusing Governance mode with Compliance mode. If an attacker gains full administrator access in Governance mode, they can remove the lock if they have the delete-lock permission. Use locked Compliance mode for true ransomware-proof and regulatory compliance.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: AWS Backup Vault Lock in Governance mode.\nResources:\n  LockedVault:\n    Type: AWS::Backup::BackupVault\n    Properties:\n      BackupVaultName: WORMCompliantVault\n      LockConfiguration:\n        MinRetentionDays: 7\n        MaxRetentionDays: 365\n        ChangeableForDays: 3 # Grace period before irreversible locking in compliance mode",
  "sources": [
    {
      "title": "AWS Backup Vault Lock",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html"
    },
    {
      "title": "Managing Vault Lock Configurations",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock-console.html"
    }
  ]
});
