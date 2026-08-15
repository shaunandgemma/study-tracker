import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-15",
  "title": "IAM Identity Center vs IAM Users",
  "plainEnglish": "AWS IAM Identity Center and traditional AWS IAM Users represent two different approaches to identity management in AWS. IAM Identity Center is AWS's modern, recommended service for centralized workforce identity, providing single sign-on (SSO), federation with corporate identity providers, and temporary security credentials across multi-account organizations. IAM Users are legacy, account-specific identities that rely on static credentials (long-term passwords and access keys) managed independently within a single AWS account.",
  "whyItMatters": "Creating individual IAM users in every AWS account leads to credential sprawl, difficult offboarding, unrotated access keys, and high security exposure. IAM Identity Center centralizes identity management, replaces risky permanent access keys with short-lived STS tokens, enforces enterprise MFA in one place, and automates multi-account permissions.",
  "workplaceExample": "A company with 50 AWS accounts migrates away from 200 individual IAM users per account (totaling 10,000 sets of static credentials). They enable IAM Identity Center connected to their corporate Microsoft Entra ID. Employees now sign in once via the access portal, eliminating all 10,000 static IAM user accounts while ensuring that terminating an employee in HR instantly cuts off all AWS access.",
  "examFocus": "Know the official AWS architectural guidance: Use IAM Identity Center as the default solution for all human workforce users accessing AWS accounts and applications. Restrict traditional IAM Users exclusively to emergency break-glass root recovery scenarios or legacy systems that cannot support role assumption or short-term credentials.",
  "keyPoints": [
    "IAM Identity Center is the AWS-recommended solution for human workforce single sign-on and multi-account access.",
    "IAM Users are legacy, single-account constructs that store static, long-term credentials (passwords and access keys).",
    "IAM Identity Center provides short-term, auto-expiring temporary STS credentials for console and CLI sessions.",
    "IAM Identity Center federates seamlessly with enterprise IdPs (Okta, Entra ID, Ping) and Active Directory via SAML and SCIM.",
    "IAM Users require manual account-by-account provisioning, separate password policies, and manual credential rotation.",
    "IAM Identity Center does not eliminate IAM; it uses IAM roles in member accounts under the hood to grant permissions."
  ],
  "commonMistake": "Creating IAM Users with permanent access keys for every developer in each AWS account. This violates AWS Foundational Security Best Practices; workforce users should always be managed centrally via IAM Identity Center.",
  "example": "Audit an AWS environment with IAM Access Analyzer and AWS Config, identifying all static IAM users with active access keys, and migrating developer access to IAM Identity Center permission sets.",
  "sources": [
    {
      "title": "AWS IAM Identity Center Overview",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"
    },
    {
      "title": "Security Best Practices in IAM",
      "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  ]
});
