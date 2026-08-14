import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-8",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Backup Vault Encryption",
  "status": "ready",
  "plainEnglish": "Backup Vault Encryption ensures that all recovery points (backups) stored within an AWS Backup vault are automatically encrypted at rest. When you create a backup vault, you specify an AWS Key Management Service (AWS KMS) key—either the default AWS managed key (`aws/backup`) or a customer managed key (CMK). For services that support independent encryption (like Amazon EFS, DynamoDB, and S3), AWS Backup re-encrypts the backup data using the vault's KMS key.",
  "whyItMatters": "Encrypting backup vaults prevents unauthorized data access and satisfies regulatory compliance mandates like HIPAA, PCI-DSS, and GDPR. Using customer managed keys (CMKs) allows security administrators to control key rotation, audit key access via CloudTrail, and immediately revoke key access in a security emergency.",
  "workplaceExample": "A healthcare provider creates an AWS Backup vault using a Customer Managed KMS Key (CMK) with annual automatic rotation enabled. All EFS file systems and Aurora databases containing patient records are backed up to this vault, ensuring that backup data remains independently encrypted under strict key governance.",
  "examFocus": "For SAA-C03, understand encryption behavior in AWS Backup: every vault requires a KMS encryption key. Some service backups (like EBS snapshots and RDS snapshots) retain the source volume KMS key or inherit the vault key depending on the service. For cross-account or cross-Region backup copies, backups are re-encrypted using the target vault's KMS key in the destination.",
  "keyPoints": [
    "All recovery points stored in an AWS Backup vault are encrypted at rest using AWS KMS.",
    "Vaults can use the AWS managed key (aws/backup) or a customer managed KMS key (CMK).",
    "Customer managed keys enable key rotation, access policies, and audit logging via CloudTrail.",
    "Cross-Region and cross-account backup copies are re-encrypted with the destination vault's KMS key.",
    "Source KMS key and destination KMS key permissions must allow AWS Backup to perform encrypt/decrypt operations."
  ],
  "commonMistake": "Disabling or deleting the KMS key used by a backup vault, which renders all recovery points inside that vault completely unreadable and impossible to restore. Protect backup KMS keys with deletion termination policies and key access alerts.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Backup Vault with Customer Managed KMS Key.\nResources:\n  EncryptedVault:\n    Type: AWS::Backup::BackupVault\n    Properties:\n      BackupVaultName: HighlyConfidentialVault\n      EncryptionKeyArn: !GetAtt VaultKmsKey.Arn\n  VaultKmsKey:\n    Type: AWS::KMS::Key\n    Properties:\n      Description: KMS Key for AWS Backup Vault\n      EnableKeyRotation: true\n      KeyPolicy:\n        Version: '2012-10-17'\n        Statement:\n          - Effect: Allow\n            Principal:\n              AWS: !Sub 'arn:aws:iam::${AWS::AccountId}:root'\n            Action: 'kms:*'\n            Resource: '*'",
  "sources": [
    {
      "title": "Encryption for Backups in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/encryption.html"
    },
    {
      "title": "KMS Key Permissions for AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/kms-permissions.html"
    }
  ]
});
