import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-15',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'SAML and OIDC Federation',
  status: 'ready',
  plainEnglish: 'SAML 2.0 and OIDC (OpenID Connect) Federation allows enterprise employees to sign in to your AWS applications using their corporate Single Sign-On (SSO) identity provider (such as Microsoft Entra ID / Azure AD, Okta, Ping Identity, or Active Directory Federation Services). Cognito User Pools integrate with enterprise IdPs via SAML 2.0 or OIDC protocols to validate enterprise assertions and map employee attributes into Cognito JWT tokens.',
  whyItMatters: 'Enterprise customers require Single Sign-On (SSO) integration. SAML/OIDC federation enables employees to log into cloud apps using their corporate credentials while IT administrators maintain central control over account provisioning and de-provisioning.',
  workplaceExample: 'A B2B enterprise software provider integrates its Cognito User Pool with Okta via SAML 2.0. Corporate clients log into the application using their Okta corporate credentials without creating separate passwords in the SaaS app.',
  examFocus: 'SAA-C03 Enterprise Federation comparison:\n- SAML 2.0: XML-based enterprise federation (Azure AD, Okta, ADFS). Requires uploading SAML Metadata XML document or URL to Cognito.\n- OIDC (OpenID Connect): JSON/OAuth 2.0-based federation (Auth0, custom OIDC providers). Requires Issuer URL, Client ID, and Client Secret.\n- Cognito maps enterprise SAML/OIDC attributes to user pool attributes automatically.',
  keyPoints: [
    'Enables Single Sign-On (SSO) for enterprise users via SAML 2.0 or OIDC.',
    'Integrates with Azure AD, Okta, ADFS, Ping Identity, and Auth0.',
    'Maps enterprise SAML assertions / OIDC claims to Cognito user attributes.',
    'Centralizes enterprise identity governance and automated access revocation.',
    'Returns standard Cognito JWT tokens to the client application.'
  ],
  commonMistake: 'Forgetting to map SAML assertion attributes (such as `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`) to Cognito user pool attributes, causing sign-in attempts to fail with missing required attribute errors.',
  example: 'SAML Provider Setup in Cognito:\nMetadata Source: `https://login.microsoftonline.com/tenant-id/federationmetadata/2007-06/federationmetadata.xml`\nAttribute Mapping: SAML `mail` -> Cognito `email`.',
  sources: [
    { title: 'Adding SAML identity providers to a user pool', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-saml-idp.html' }
  ]
});
