import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-12",
  "title": "SCIM User and Group Provisioning",
  "plainEnglish": "System for Cross-domain Identity Management (SCIM) v2.0 is an open standard REST API protocol used by AWS IAM Identity Center to automatically synchronize user accounts, profile attributes, and group memberships from an external identity provider (such as Okta, Microsoft Entra ID, PingFederate, or OneLogin) into IAM Identity Center.",
  "whyItMatters": "Without automated provisioning, cloud administrators must manually recreate every user and group in AWS and manually adjust memberships whenever someone joins, changes roles, or leaves the company. SCIM automates this lifecycle entirely: when HR updates an employee record in Entra ID or Okta, the IdP sends REST calls to IAM Identity Center's SCIM endpoint, instantly creating, updating, or deactivating users in AWS.",
  "workplaceExample": "An employee in the Data Analytics team resigns. The IT administrator disables their account in Okta. Okta's SCIM client immediately sends a PATCH request to IAM Identity Center's SCIM endpoint setting 'active: false'. The user's account in IAM Identity Center is instantly deactivated, terminating all current access portal sessions and preventing access across all 40 AWS production and development accounts.",
  "examFocus": "Know that SCIM is the standard for AUTOMATIC PROVISIONING in IAM Identity Center. Understand the distinction: SAML 2.0 = Authentication (sign-in verification), SCIM 2.0 = Provisioning (creating, updating, and syncing users and groups). To configure SCIM, IAM Identity Center generates a unique SCIM endpoint URL and an OAuth bearer access token (valid for 1 year) that must be entered into the external IdP.",
  "keyPoints": [
    "SCIM (System for Cross-domain Identity Management) v2.0 is the RESTful API protocol for automated identity provisioning.",
    "Synchronizes users, user attributes (email, name, department), groups, and group memberships from external IdPs into IAM Identity Center.",
    "Provides near-instant automated de-provisioning; disabling a user in the IdP revokes AWS access across all member accounts.",
    "Requires enabling 'Automatic provisioning' in IAM Identity Center to generate the SCIM Endpoint URL and SCIM Bearer Access Token.",
    "SCIM access tokens are valid for up to 1 year and must be rotated before expiration to prevent synchronization interruption.",
    "Eliminates manual user management and eliminates configuration drift between corporate HR systems and AWS permissions."
  ],
  "commonMistake": "Configuring SAML federation and assuming users and groups will automatically appear in IAM Identity Center without enabling SCIM. SAML only authenticates users upon sign-in; SCIM must be explicitly enabled and configured in the IdP to populate users and groups in advance.",
  "example": "Enable automatic provisioning in the IAM Identity Center console, copy the SCIM endpoint URL (https://scim.us-east-1.amazonaws.com/...) and generated bearer token, and paste them into the Provisioning tab of the AWS application in Okta.",
  "sources": [
    {
      "title": "Automatic Provisioning (SCIM) in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/scim-profile.html"
    },
    {
      "title": "Provisioning Users and Groups Automatically with SCIM",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/provision-automatically.html"
    }
  ]
});
