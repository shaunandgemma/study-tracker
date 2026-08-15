import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-22',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Backup Policies',
  status: 'ready',
  plainEnglish: 'Backup Policies in AWS Organizations allow security administrators to define organization-wide backup plans and governance rules for AWS Backup. Attaching a Backup Policy to an OU or member account automatically deploys immutable backup schedules, retention periods, and backup vault rules across all accounts in that container.',
  whyItMatters: 'Ensuring that databases and storage volumes across 100 member accounts are regularly backed up requires centralized automation. Backup Policies prevent member account administrators from disabling or tampering with automated backups.',
  workplaceExample: 'An enterprise attaches a Backup Policy to `Production OU`. The policy mandates daily snapshots of all EBS volumes and RDS databases, enforcing a 365-day retention policy and copying backups to a central `Log-Archive` backup vault.',
  examFocus: 'SAA-C03 Backup Policy Capabilities:\n- AWS Backup Integration: Works natively with AWS Backup to enforce backup plans across member accounts.\n- Centralized Rules: Specifies backup frequency, retention windows, copy actions (cross-region/cross-account), and lifecycle rules.\n- Immutable Protection: Prevents local member account administrators from deleting required enterprise backup plans.\n- Policy Attachment: Attached at Root, OU, or individual account levels.',
  keyPoints: [
    'Enforces organization-wide backup plans using AWS Backup integration.',
    'Defines backup schedules, retention rules, and lifecycle transitions across member accounts.',
    'Supports cross-region and cross-account backup copies for disaster recovery.',
    'Prevents member account users from modifying or disabling enterprise backups.',
    'Cascades down the organization hierarchy via standard policy inheritance.'
  ],
  commonMistake: 'Assuming a Backup Policy replaces AWS Backup vault permissions. A Backup Policy defines backup plans; AWS Backup roles must still be authorized.',
  example: 'Backup Policy JSON Enforcing Daily EBS Snapshots:\n{\n  "plans": {\n    "DailyProductionBackup": {\n      "regions": {\n        "@@assign": ["us-east-1", "us-west-2"]\n      },\n      "rules": {\n        "DailyRetention": {\n          "schedule_expression": {\n            "@@assign": "cron(0 12 * * ? *)"\n          },\n          "target_backup_vault_name": {\n            "@@assign": "CentralProductionVault"\n          },\n          "lifecycle": {\n            "delete_after_days": {\n              "@@assign": "365"\n            }\n          }\n        }\n      }\n    }\n  }\n}',
  sources: [
    { title: 'Backup policies in AWS Organizations', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_backup.html' }
  ]
});
