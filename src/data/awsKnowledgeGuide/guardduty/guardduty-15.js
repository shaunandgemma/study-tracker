import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-15",
  "title": "Multi-Account GuardDuty",
  "plainEnglish": "Multi-Account Amazon GuardDuty allows enterprises with multi-account AWS environments to manage threat detection centrally across all AWS accounts using AWS Organizations. An administrator can enable GuardDuty across hundreds of member accounts, view consolidated security findings from a single dashboard, manage threat lists centrally, and ensure that any newly created AWS account automatically has GuardDuty enabled without manual setup.",
  "whyItMatters": "Enterprises frequently operate dozens or hundreds of AWS accounts across development, staging, and production environments. Configuring GuardDuty individually per account is labor-intensive and creates security visibility gaps if new accounts are provisioned without security tooling. Centralized multi-account management guarantees 100% security coverage across the entire organizational footprint.",
  "workplaceExample": "A multinational enterprise uses AWS Control Tower and AWS Organizations with 150 AWS accounts. The security team designates their Security Tooling account as the GuardDuty Delegated Administrator and turns on 'Auto-enable GuardDuty for new member accounts'. When engineering teams vend a new sandbox account, GuardDuty and all protection plans are automatically activated, and findings flow to the central security dashboard.",
  "examFocus": "Understand multi-account GuardDuty management: AWS Organizations integration is the recommended best practice (over legacy invitation-based pairing). The AWS Organizations management account delegates administration to a designated security member account. The delegated administrator can enable GuardDuty for existing members, auto-enable for future members, and manage centralized S3/EKS/RDS/Lambda protection settings.",
  "keyPoints": [
    "AWS Organizations integration allows centralized enablement and finding aggregation across all organization accounts.",
    "Supports auto-enablement, ensuring newly created or joined AWS accounts immediately have GuardDuty and protection plans activated.",
    "The delegated administrator account can view consolidated findings, manage suppression rules, and deploy threat/trusted IP lists across all members.",
    "Member accounts can view their own local findings in their respective consoles, but cannot disable GuardDuty or modify centrally managed settings.",
    "Delegated administration must be configured in each AWS Region individually where GuardDuty is monitored.",
    "Replaces the legacy invitation-based multi-account model with automated, policy-driven governance."
  ],
  "commonMistake": "Assuming that enabling GuardDuty in the AWS Organizations management account automatically activates it in all member accounts. You must explicitly designate a delegated administrator and enable auto-enablement across all accounts and Regions.",
  "example": "Enable auto-enablement for all new organization accounts in a region using the AWS CLI: aws guardduty update-organization-configuration --detector-id 12abc34d567e8fa9012bc34de5678901 --auto-enable-organization-members ALL.",
  "sources": [
    {
      "title": "Managing Amazon GuardDuty Accounts with AWS Organizations",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_organizations.html"
    },
    {
      "title": "Understanding the Relationship between GuardDuty Administrator and Member Accounts",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_admin_member.html"
    }
  ]
});
