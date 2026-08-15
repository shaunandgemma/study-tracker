import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-1",
  "title": "Central Portal for Multi-Account SSO Access via AWS Organizations",
  "plainEnglish": "AWS IAM Identity Center (formerly AWS Single Sign-On) provides a unified, web-based AWS access portal where workforce users log in once and view all AWS accounts, roles, and cloud applications they are authorized to access. Integrated natively with AWS Organizations, the portal eliminates the need to remember separate account numbers, usernames, or complex cross-account role URLs.",
  "whyItMatters": "As enterprises expand into dozens or hundreds of AWS accounts, having employees manage separate IAM user credentials or navigate individual AWS console login links creates security risks, password fatigue, and administrative chaos. The central access portal gives users one entry point with single sign-on (SSO), multi-factor authentication (MFA), and short-term credentials.",
  "workplaceExample": "A cloud engineer logs into their corporate AWS access portal (https://my-company.awsapps.com/start) using their corporate credentials and hardware MFA key. The portal displays three cards: 'Development', 'Staging', and 'Production'. Clicking 'Development' reveals 'ViewOnlyAccess' and 'AdministratorAccess' role tiles, allowing the engineer to open the AWS Management Console in one click.",
  "examFocus": "Understand that the AWS access portal is the primary web landing page for workforce single sign-on. Know that IAM Identity Center must be enabled in the AWS Organizations management account or delegated administrator account, and that access portal sign-ins issue temporary, short-lived STS credentials rather than permanent IAM user credentials.",
  "keyPoints": [
    "Provides a centralized, customizable AWS access portal URL (e.g., https://d-xxxxxx.awsapps.com/start) for workforce single sign-on.",
    "Integrated natively with AWS Organizations to dynamically discover all accounts and organizational units (OUs).",
    "Users authenticate once to access both AWS Management Consoles across accounts and assigned SAML 2.0 business applications.",
    "Eliminates individual IAM users, static access keys, and manual cross-account role switching links.",
    "Issues short-term, temporary AWS credentials to both browser sessions and the AWS CLI v2.",
    "Supports customizable session durations (from 15 minutes up to 12 hours) configured at the permission set level."
  ],
  "commonMistake": "Thinking the access portal URL replaces IAM account login URLs for root or break-glass IAM users. The access portal is strictly for federated workforce users managed through IAM Identity Center; emergency break-glass IAM users still use standard account sign-in URLs.",
  "example": "Customize the AWS access portal sign-in URL to a friendly corporate alias (e.g., https://acme-cloud.awsapps.com/start) in the IAM Identity Center settings console, and configure mandatory WebAuthn/FIDO2 MFA enforcement.",
  "sources": [
    {
      "title": "What is AWS IAM Identity Center?",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"
    },
    {
      "title": "Using the AWS Access Portal",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/using-the-portal.html"
    }
  ]
});
