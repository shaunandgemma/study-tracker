import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-20',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Trusted Access for AWS Services',
  status: 'ready',
  plainEnglish: 'Trusted Access allows an integrated AWS service (such as AWS CloudTrail, AWS Config, or IAM Identity Center) to perform organization-wide actions on your behalf across all member accounts. When Trusted Access is enabled, Organizations automatically provisions a Service-Linked Role in member accounts, allowing the integrated service to query resources and apply settings universally.',
  whyItMatters: 'Manually configuring IAM roles and service settings across dozens of separate member accounts is error-prone. Trusted Access enables seamless, automated multi-account management for supporting AWS services with a single click.',
  workplaceExample: 'An administrator enables Trusted Access for AWS CloudTrail. AWS Organizations automatically creates service-linked roles in all current and future member accounts, creating an Organization Trail that logs API events across all accounts to a central S3 bucket.',
  examFocus: 'SAA-C03 Trusted Access vs Delegated Administration:\n- Trusted Access: Grants an AWS service permission to execute actions across all accounts in the organization.\n- Service-Linked Roles: Automatically provisioned by Organizations in member accounts when Trusted Access is enabled.\n- Delegated Admin Relationship: Enabling Trusted Access is the prerequisite step BEFORE assigning a Delegated Administrator account.\n- Management API: Enabled via `EnableAWSServiceAccess` API specifying the service principal.',
  keyPoints: [
    'Grants an integrated AWS service permission to perform operations across the organization.',
    'Provisions Service-Linked Roles automatically in member accounts.',
    'Required prerequisite before assigning a Delegated Administrator account.',
    'Supported by CloudTrail, Config, GuardDuty, Security Hub, RAM, and Backup.',
    'Enables multi-account centralized logging, monitoring, and compliance.'
  ],
  commonMistake: 'Attempting to configure a Delegated Administrator account for GuardDuty or Security Hub without enabling Trusted Access for that service principal first.',
  example: 'Enabling Trusted Access for AWS CloudTrail via AWS CLI:\naws organizations enable-aws-service-access --service-principal cloudtrail.amazonaws.com',
  sources: [
    { title: 'Using AWS Organizations with other AWS services', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_integrated-services-list.html' }
  ]
});
