import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-4",
  "title": "IAM Identity Center Workforce Single Sign-On",
  "plainEnglish": "AWS IAM Identity Center is AWS's recommended service for managing workforce single sign-on (SSO) access to multiple AWS accounts and cloud business applications. It provides employees, contractors, and administrators with a single set of login credentials to access all their required AWS accounts, management consoles, command-line interfaces, and third-party SaaS applications.",
  "whyItMatters": "Before IAM Identity Center (formerly AWS SSO), companies created individual IAM users with long-term passwords and static access keys in every single AWS account, leading to massive credential sprawl, security auditing nightmares, and high operational overhead. IAM Identity Center centralizes workforce identity, enforces multi-factor authentication (MFA) at a single sign-in point, and replaces static credentials with short-term tokens.",
  "workplaceExample": "An enterprise employs 500 engineers working across 60 AWS accounts. Instead of managing 30,000 distinct IAM user accounts and static access keys, the IT team enables IAM Identity Center. All 500 engineers sign in once daily through the corporate portal with their corporate email and security key, automatically receiving role-based access to their assigned project accounts.",
  "examFocus": "Understand the intended scope of IAM Identity Center: It is strictly for WORKFORCE users (employees, administrators, developers) accessing AWS accounts and SAML business applications. It is NOT for customer-facing mobile/web application users (which should use Amazon Cognito) or for machine-to-machine service accounts (which should use IAM Roles).",
  "keyPoints": [
    "AWS's primary service for centralized workforce single sign-on across AWS accounts and cloud business applications.",
    "Formerly named AWS Single Sign-On (AWS SSO); rebranded to AWS IAM Identity Center.",
    "Designed specifically for human workforce users (employees, developers, operators, security auditors).",
    "Supports multiple identity sources: built-in IAM Identity Center directory, AWS Managed Microsoft AD, or external IdPs via SAML 2.0 / SCIM.",
    "Enforces strong authentication policies including context-aware Multi-Factor Authentication (MFA), WebAuthn, and FIDO2 security keys.",
    "Integrated with AWS CloudTrail to record all sign-in events, session creations, and administrative permission set changes."
  ],
  "commonMistake": "Confusing AWS IAM Identity Center with Amazon Cognito. IAM Identity Center manages internal corporate workforce access to AWS accounts and enterprise SaaS apps; Amazon Cognito manages authentication and user directories for external customer-facing mobile and web applications.",
  "example": "Navigate to the IAM Identity Center console in the management account, choose Enable, select your preferred identity source, and define global multi-factor authentication requirements for all workforce sign-ins.",
  "sources": [
    {
      "title": "What is AWS IAM Identity Center?",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"
    },
    {
      "title": "Understanding Identity Sources in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/understanding-identity-sources.html"
    }
  ]
});
