import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-2",
  "title": "External Identity Provider Integration (Okta, Azure AD / Entra ID, SAML 2.0 / SCIM)",
  "plainEnglish": "AWS IAM Identity Center allows organizations to connect their existing external identity provider (such as Okta, Microsoft Entra ID / Azure AD, PingFederate, or OneLogin) as the single source of truth for workforce identities. It pairs SAML 2.0 for federated browser authentication with the SCIM (System for Cross-domain Identity Management) v2.0 protocol for automated user and group synchronization.",
  "whyItMatters": "Enterprises manage employee onboarding, role changes, and offboarding in their primary identity provider (like Microsoft Entra ID or Okta). Connecting your external IdP to IAM Identity Center via SAML and SCIM ensures that when an employee leaves the company or changes departments in Okta, their AWS access across all member accounts is automatically and instantaneously revoked without manual AWS administration.",
  "workplaceExample": "A technology company uses Microsoft Entra ID as its corporate directory. An administrator configures IAM Identity Center to federate with Entra ID using SAML 2.0 and sets up automatic provisioning using a SCIM endpoint and bearer token. When a DevOps engineer is added to the 'AWS-CloudEngineers' group in Entra ID, SCIM creates their user in IAM Identity Center, immediately granting them assigned permissions across 30 AWS accounts.",
  "examFocus": "Know the distinct roles of the two integration protocols: SAML 2.0 handles federated authentication (verifying user identity and passing assertions during sign-in), while SCIM v2.0 handles identity provisioning (automatically syncing user accounts, email addresses, and group memberships from the IdP into IAM Identity Center). IAM Identity Center supports only ONE identity source at a time.",
  "keyPoints": [
    "Connects third-party identity providers (Okta, Microsoft Entra ID, Ping Identity, CyberArk) as the centralized identity source.",
    "Uses SAML 2.0 for single sign-on authentication and trust exchange via metadata XML files and ACS URLs.",
    "Uses SCIM (System for Cross-domain Identity Management) v2.0 for automated, continuous synchronization of users and groups.",
    "IAM Identity Center supports exactly one identity source at a time per organization instance.",
    "Changing the identity source requires planning, as existing account assignments must be re-mapped to the new users/groups.",
    "Enables centralized lifecycle management; deactivating a user in the external IdP instantly prevents access to all AWS accounts."
  ],
  "commonMistake": "Confusing SAML authentication with SCIM provisioning. SAML authenticates the user when they sign in, but SAML alone does not create or update user and group objects in advance. SCIM must be configured to automatically synchronize users and groups so they can receive account assignments.",
  "example": "Configure SCIM provisioning in IAM Identity Center by generating a SCIM endpoint URL (https://scim.us-east-1.amazonaws.com/...) and access token, then paste these credentials into the Okta or Microsoft Entra ID enterprise application provisioning settings.",
  "sources": [
    {
      "title": "Connect IAM Identity Center to an External Identity Provider",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html"
    },
    {
      "title": "Automatic Provisioning (SCIM) in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/scim-profile.html"
    }
  ]
});
