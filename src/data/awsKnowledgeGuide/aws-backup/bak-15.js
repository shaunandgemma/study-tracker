import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-15",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Cross-Account Backup Copy",
  "status": "ready",
  "plainEnglish": "Cross-Account Backup Copy is a security and disaster recovery feature in AWS Backup that automatically copies recovery points from a source AWS account into a secure target backup vault located in an entirely separate AWS account within your AWS Organization. This creates an isolated 'air-gapped' backup copy in a dedicated security or archive account.",
  "whyItMatters": "If an attacker compromises credentials in your production AWS account or if a rogue insider maliciously deletes production infrastructure and local backups, having an isolated copy in an independent, locked security account ensures that business-critical data can always be recovered.",
  "workplaceExample": "A financial enterprise deploys a dedicated 'Backup-Archive-Account'. In the production account, the AWS Backup plan copies all daily database snapshots to a vault in the archive account. The archive account vault is protected by Backup Vault Lock and accessible only to the CISO team, preventing ransomware extortion.",
  "examFocus": "For SAA-C03, know that Cross-Account Backup requires AWS Organizations with all features enabled. The destination vault must have a resource-based Access Policy that allows the source account to copy backups into it. Backups are encrypted with a KMS customer managed key (CMK) in the destination account (AWS managed keys cannot be shared across accounts).",
  "keyPoints": [
    "Copies recovery points across separate AWS accounts within an AWS Organization.",
    "Provides protection against ransomware, account compromise, and accidental deletion.",
    "Requires AWS Organizations with all features enabled.",
    "Destination vault must have an access policy permitting the source account access.",
    "Must use a Customer Managed KMS Key (CMK) because AWS managed default keys cannot be shared cross-account."
  ],
  "commonMistake": "Trying to use the default AWS managed KMS key (`aws/backup`) for cross-account copies. AWS managed keys cannot be shared across accounts; you must create and use a Customer Managed Key (CMK) with cross-account key permissions.",
  "example": "DestinationBackupVaultArn: 'arn:aws:backup:eu-west-1:999888777666:backup-vault:IsolatedArchiveVault'\n# Note: Target vault must be in an account within the same AWS Organization",
  "sources": [
    {
      "title": "Creating Cross-Account Copies in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/cross-account-backup.html"
    },
    {
      "title": "Cross-Account Vault Access Policies",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-access-policies.html#cross-account-backup"
    }
  ]
});
