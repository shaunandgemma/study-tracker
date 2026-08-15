import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-11",
  "title": "SAML 2.0 Federation",
  "plainEnglish": "Security Assertion Markup Language 2.0 (SAML 2.0) is an open-standard XML protocol used by AWS IAM Identity Center for federated single sign-on authentication. In this architecture, an external Identity Provider (IdP, such as Okta or Microsoft Entra ID) authenticates the workforce user and sends a cryptographically signed SAML assertion to IAM Identity Center (the Service Provider), verifying the user's identity without sharing their password with AWS.",
  "whyItMatters": "SAML 2.0 federation allows organizations to maintain centralized security policies (such as password length, rotation, biometric MFA, and location-based IP restrictions) in their primary identity provider. When an employee signs into AWS, IAM Identity Center trusts the identity assertion signed by the IdP's X.509 certificate, creating a secure bridge between corporate directories and AWS accounts.",
  "workplaceExample": "An engineer navigates to the AWS access portal. The browser redirects to their company's Okta login page. The engineer authenticates using their YubiKey. Okta generates an XML SAML assertion containing the engineer's email, signs it with Okta's private certificate, and redirects the browser back to IAM Identity Center's Assertion Consumer Service (ACS) URL. IAM Identity Center validates the signature and opens the portal.",
  "examFocus": "Understand SAML 2.0 roles in IAM Identity Center: External IdP = Identity Provider (IdP); IAM Identity Center = Service Provider (SP). Know that SAML handles user authentication at sign-in, while SCIM handles automated user and group provisioning in advance. Understand that SAML metadata exchange requires configuring the ACS URL, Issuer URL, and X.509 certificates.",
  "keyPoints": [
    "SAML 2.0 is an industry-standard protocol for web-based federated single sign-on authentication.",
    "The external identity provider acts as the SAML IdP; AWS IAM Identity Center acts as the SAML Service Provider (SP).",
    "Authentication trust is established by exchanging XML metadata files containing Assertion Consumer Service (ACS) URLs and X.509 certificates.",
    "The SAML assertion passes user attributes (such as NameID, email, givenName, surname) securely to IAM Identity Center.",
    "Passwords are never transmitted to or stored within AWS; authentication occurs entirely within the external IdP domain.",
    "Supports SAML certificate expiration monitoring and automated rotation alerts to prevent sudden authentication outages."
  ],
  "commonMistake": "Expecting SAML federation alone to automatically create user objects in IAM Identity Center ahead of time. SAML only authenticates a user during an active sign-in attempt; you must configure SCIM (or manual user creation) to pre-provision users and assign permission sets.",
  "example": "Download the IAM Identity Center SAML metadata XML, upload it to Microsoft Entra ID enterprise application settings, map user.userprincipalname to the SAML NameID, and upload Entra ID's FederationMetadata.xml into IAM Identity Center.",
  "sources": [
    {
      "title": "SAML 2.0 Identity Provider Federation in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html"
    },
    {
      "title": "IAM Identity Center SAML 2.0 Profile",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/saml-profile.html"
    }
  ]
});
