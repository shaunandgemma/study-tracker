import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-9",
  "title": "External Identity Provider Federation",
  "plainEnglish": "External Identity Provider (IdP) Federation in AWS IAM Identity Center allows organizations to connect their third-party identity system (such as Okta, Microsoft Entra ID, PingFederate, Google Workspace, or CyberArk) as the authoritative identity source for all AWS access. Users authenticate against their familiar corporate login page and are seamlessly federated into AWS via SAML 2.0.",
  "whyItMatters": "Federating an external IdP provides a unified identity lifecycle across all corporate systems. When an employee signs into their workstation, Single Sign-On allows them to access AWS without managing a separate AWS password. Furthermore, corporate security controls (such as conditional access policies, risk-based step-up authentication, and corporate MFA) are enforced automatically before the user reaches AWS.",
  "workplaceExample": "A global company connects Okta to IAM Identity Center. When an employee logs in via Okta, Okta enforces FIDO2 hardware token authentication and checks device compliance before generating a signed SAML assertion. IAM Identity Center verifies the assertion and grants the employee access to their assigned AWS accounts based on their Okta group memberships.",
  "examFocus": "Understand the setup flow for external IdP federation: (1) In IAM Identity Center, change the identity source to External Identity Provider. (2) Download the IAM Identity Center SAML metadata file (containing ACS URL and Issuer URL). (3) Upload AWS metadata to the IdP. (4) Download the IdP SAML metadata file and upload it to IAM Identity Center. (5) Configure SCIM provisioning for automated user/group sync.",
  "keyPoints": [
    "Establishes a SAML 2.0 trust relationship between an external identity provider and AWS IAM Identity Center.",
    "Users authenticate against the external IdP, inheriting enterprise password policies, conditional access, and corporate MFA.",
    "IAM Identity Center maps the incoming SAML NameID (usually email or username) to the internal user directory.",
    "Only one identity source can be active at a time; switching from the built-in directory to an external IdP requires re-mapping assignments.",
    "Pairs with SCIM automatic provisioning to keep user accounts, display names, and group memberships synchronized.",
    "Supports session attribute mapping for Attribute-Based Access Control (ABAC) across AWS accounts."
  ],
  "commonMistake": "Attempting to create and manage local IAM Identity Center users manually after enabling an external IdP with SCIM. When an external IdP with SCIM is active, user and group creation is managed exclusively by the external IdP.",
  "example": "Download the IAM Identity Center SAML metadata, import it into the Okta Admin Console, configure SAML attributes (email, firstName, lastName), and upload Okta's IdP metadata XML back to IAM Identity Center.",
  "sources": [
    {
      "title": "Connect to an External Identity Provider in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html"
    },
    {
      "title": "Identity Source Options in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/understanding-identity-sources.html"
    }
  ]
});
