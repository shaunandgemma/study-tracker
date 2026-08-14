import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-15',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'AWS Config with Organizations',
  status: 'ready',
  plainEnglish: 'AWS Config integration with AWS Organizations enables centralized governance, multi-account compliance monitoring, and mandatory policy enforcement across all accounts in an enterprise. From the management account (or a delegated administrator account), security administrators can deploy Organization Config Rules and Organization Conformance Packs to all existing and future member accounts automatically.',
  whyItMatters: 'In multi-account environments, member accounts must not be able to disable security rules or bypass compliance checks. AWS Config with Organizations prevents member account root/admin users from deleting or modifying organization-deployed compliance rules.',
  workplaceExample: 'An enterprise uses AWS Organizations with 200 member accounts. The central governance team deploys an Organization Config Rule enforcing S3 encryption. Member account administrators cannot disable or delete this rule in their local accounts, guaranteeing company-wide compliance.',
  examFocus: 'SAA-C03 key detail: Organization Config Rules and Conformance Packs CANNOT be modified or deleted by member accounts. This provides immutable security governance across the organization. Use a Delegated Administrator account to manage AWS Config without logging into the Organizations management account.',
  keyPoints: [
    'Centralized deployment of Config rules across all accounts in an AWS Organization.',
    'Rules deployed by Organizations are read-only and immutable in member accounts.',
    'Supports Delegated Administrator accounts for security team operational independence.',
    'Automatically applies to new member accounts as soon as they join the organization.',
    'Integrates with Multi-Account Aggregators for unified compliance reporting.'
  ],
  commonMistake: 'Using standard IAM policies to try to protect local Config rules in member accounts when deploying Organization Config Rules natively prevents deletion by member account admins.',
  example: 'Organization Rule Command:\n`aws configservice put-organization-config-rule --organization-config-rule-name s3-encryption-org-rule --organization-managed-rule-metadata RuleIdentifier=S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED`',
  sources: [
    { title: 'Enabling AWS Config Across All Accounts in AWS Organizations', url: 'https://docs.aws.amazon.com/config/latest/developerguide/config-overview.html' }
  ]
});
