import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-17",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Backup Policies with AWS Organizations",
  "status": "ready",
  "plainEnglish": "Backup Policies in AWS Organizations are policy documents created in the organization management account (or delegated admin account) and attached to the organization Root, Organizational Units (OUs), or specific member accounts. When a Backup Policy is attached to an OU, it automatically creates immutable AWS Backup plans inside every account within that OU, standardizing backup schedules, vaults, and retention across the entire organization.",
  "whyItMatters": "Member account owners and developers cannot edit, override, or delete backup plans that are created and enforced by AWS Organizations Backup Policies. This prevents accidental deletion of backup schedules and ensures strict compliance across distributed enterprise teams.",
  "workplaceExample": "A cloud compliance lead writes a single JSON Backup Policy requiring daily backups with 90-day retention and attaches it to the 'Workloads-Prod' Organizational Unit. All 40 existing production member accounts—and any new account created in that OU in the future—instantly deploy this backup plan automatically.",
  "examFocus": "For SAA-C03, compare local Backup Plans with Organizations Backup Policies. Local backup plans are created within a single account and can be modified by account administrators. Organizations Backup Policies are defined centrally in the management/delegated admin account, inherited hierarchically down OUs, and cannot be deleted or altered by local member account admins.",
  "keyPoints": [
    "Centrally defines and enforces immutable backup plans across AWS Organizations OUs.",
    "Inherited automatically by all existing and future member accounts within target OUs.",
    "Cannot be modified or deleted by member account administrators, preventing tampering.",
    "Eliminates manual per-account configuration and enforces strict regulatory compliance.",
    "Can be combined with local tag-based resource selections within member accounts."
  ],
  "commonMistake": "Creating identical backup plans manually in dozens of AWS accounts. When policies change, you must update every account individually. Use an AWS Organizations Backup Policy to maintain a single central policy that applies everywhere automatically.",
  "example": "{\n  \"plans\": {\n    \"EnterpriseProductionPolicy\": {\n      \"regions\": { \"@@assign\": [ \"us-east-1\", \"us-west-2\" ] },\n      \"rules\": {\n        \"DailyBackup\": {\n          \"schedule_expression\": { \"@@assign\": \"cron(0 5 ? * * *)\" },\n          \"lifecycle\": { \"delete_after_days\": { \"@@assign\": \"90\" } },\n          \"target_backup_vault_name\": { \"@@assign\": \"Default\" }\n        }\n      }\n    }\n  }\n}",
  "sources": [
    {
      "title": "Backup Policies in AWS Organizations",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/backup-policies.html"
    },
    {
      "title": "Creating and Managing Backup Policies",
      "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_backup.html"
    }
  ]
});
