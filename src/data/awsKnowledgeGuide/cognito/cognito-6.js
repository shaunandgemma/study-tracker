import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-6',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'User Pools for Authentication',
  status: 'ready',
  plainEnglish: 'Using Cognito User Pools for Authentication means leveraging the user pool as the central identity provider for your application. User Pools authenticate user credentials (username/password or social identity), verify MFA challenges, and issue cryptographic JSON Web Tokens (JWTs). The client application includes these tokens in HTTP headers when calling backend services to prove user identity.',
  whyItMatters: 'Centralizing user authentication in Cognito User Pools guarantees consistent security standards, reduces identity management overhead, and ensures that sensitive user passwords are encrypted and managed in a compliant AWS cloud directory.',
  workplaceExample: 'A SaaS platform uses a Cognito User Pool to handle user login. When a user submits their email and password, User Pools verify the credentials and return an ID Token and Access Token. The web app attaches the Access Token to API calls to authenticate requests.',
  examFocus: 'SAA-C03 Authentication flow:\n- User submits credentials -> User Pool validates -> User Pool returns 3 JWT tokens:\n  1. ID Token: Contains user profile attributes (name, email, sub).\n  2. Access Token: Contains granted scopes; used to authorize API calls.\n  3. Refresh Token: Long-lived token used to acquire new ID/Access tokens without forcing re-login.',
  keyPoints: [
    'User Pools serve as the primary user directory and authentication server.',
    'Authenticates user credentials and enforces security policies.',
    'Returns 3 OAuth 2.0 / OIDC tokens: ID Token, Access Token, Refresh Token.',
    'Integrates seamlessly with API Gateway Cognito Authorizers.',
    'Handles password reset, email verification, and MFA challenges automatically.'
  ],
  commonMistake: 'Storing user passwords in a custom EC2 database table instead of using Cognito User Pools, introducing security vulnerabilities and compliance compliance liabilities.',
  example: 'API Request with Cognito Access Token:\n`Authorization: Bearer eyJraWQiOiJ...` (Access Token sent in HTTP Header to API Gateway).',
  sources: [
    { title: 'Authentication with Amazon Cognito user pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/authentication.html' }
  ]
});
