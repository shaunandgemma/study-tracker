import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-16",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "AWS Organizations Integration",
  "status": "ready",
  "plainEnglish": "AWS Organizations Integration enables you to centrally manage, govern, and monitor data protection across all member AWS accounts in your multi-account organization. From the organization management account (or a delegated administrator account), administrators can enable cross-account management, author Organization-wide Backup Policies, perform cross-account backup copies, and aggregate backup monitoring into a single unified view.",
  "whyItMatters": "In large enterprises with hundreds of accounts, configuring backup rules in each account individually creates severe compliance risks. Organizations integration enforces immutable backup rules across all accounts automatically, ensuring that newly created accounts are instantly compliant.",
  "workplaceExample": "A global conglomerate enables AWS Organizations integration for AWS Backup and delegates administration to the InfoSec account. The InfoSec team applies a policy to the 'Production-OU' that mandates daily backups and automatically disallows member account root users from disabling backups.",
  "examFocus": "For SAA-C03, know that AWS Organizations integration enables: (1) Delegated administration for AWS Backup, (2) Cross-account backup copying, and (3) Backup Policies applied across Organization Roots, OUs, or member accounts. All features must be enabled in AWS Organizations.",
  "keyPoints": [
    "Centrally manages and enforces backup compliance across all AWS accounts in an organization.",
    "Supports Delegated Administrator accounts to separate backup management from the organization root.",
    "Enables Cross-Account backup copies between member accounts within the organization.",
    "Requires AWS Organizations with 'All Features' enabled.",
    "Provides aggregated compliance reporting across all member accounts."
  ],
  "commonMistake": "Attempting to enable cross-account backup copies or organization backup policies when AWS Organizations is in 'Consolidated Billing Only' mode. You must enable 'All Features' in AWS Organizations first.",
  "example": "# Enable cross-account management via AWS Backup CLI:\naws backup update-global-settings --global-settings isCrossAccountBackupEnabled=true",
  "sources": [
    {
      "title": "Managing AWS Backup Across Multiple Accounts with AWS Organizations",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/organizations.html"
    },
    {
      "title": "Delegated Administrator in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/delegated-administrator.html"
    }
  ]
});
