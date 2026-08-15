import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-8",
  "title": "AWS Organizations Integration",
  "plainEnglish": "AWS IAM Identity Center integrates deeply with AWS Organizations to provide an organization-wide identity and access management fabric. When enabled as an organization instance, IAM Identity Center automatically discovers all AWS accounts, organizational units (OUs), and hierarchical tree structures, enabling centralized permission-set assignments across the entire corporate cloud footprint.",
  "whyItMatters": "Enterprises manage multi-account AWS environments through AWS Organizations. Without native integration, security teams would need to configure identity federation and role trust separately in every single AWS account. Integration with Organizations provides automated account discovery, centralized OU-level assignments, delegated administration to dedicated security accounts, and consolidated auditing.",
  "workplaceExample": "An enterprise runs 120 AWS accounts organized into 'Dev', 'Test', and 'Prod' OUs in AWS Organizations. When the cloud platform team vends a new microservice account in the 'Dev' OU using Account Factory, IAM Identity Center automatically detects the account and applies all permission sets assigned to the 'Dev' OU without manual intervention.",
  "examFocus": "Understand the two instance types: Organization Instance (deployed in the AWS Organizations management account or managed via a Delegated Administrator member account for multi-account access) versus Account Instance (isolated single-account instance for application assignments). Know that Delegated Administration allows a security member account to manage IAM Identity Center without using the Organizations management root account.",
  "keyPoints": [
    "Organization Instances of IAM Identity Center integrate directly with AWS Organizations to manage multi-account access.",
    "Automatically discovers all member accounts and dynamically reflects changes when accounts are added, moved, or deleted.",
    "Supports Account Assignments at the Organizational Unit (OU) level, automatically propagating permissions to all member accounts inside the OU.",
    "Supports Delegated Administration, allowing a designated security member account to perform administrative tasks.",
    "Constrained by Organizational Service Control Policies (SCPs), which establish the maximum allowed permission guardrails across all accounts.",
    "Requires all features to be enabled in AWS Organizations (cannot be used in consolidated billing-only mode)."
  ],
  "commonMistake": "Attempting to enable an organization instance of IAM Identity Center when AWS Organizations is configured with only 'Consolidated Billing'. IAM Identity Center requires 'All Features' enabled in AWS Organizations.",
  "example": "Enable IAM Identity Center in the AWS Organizations management account and delegate administration to the security account: aws sso-admin register-delegated-administrator --instance-arn arn:aws:sso:::instance/ssoins-123456789 --delegated-administrator-account-id 111122223333.",
  "sources": [
    {
      "title": "IAM Identity Center and AWS Organizations",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/aws-org-concepts.html"
    },
    {
      "title": "Delegated Administration in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/delegated-admin.html"
    }
  ]
});
