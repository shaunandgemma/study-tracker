import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-12',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'JWT ID, Access and Refresh Tokens',
  status: 'ready',
  plainEnglish: 'Upon successful authentication, Amazon Cognito User Pools issue three cryptographic JSON Web Tokens (JWTs):\n1. ID Token: Contains claims about the identity of the authenticated user (e.g. `sub`, `email`, `name`, `given_name`). Valid for 1 hour by default.\n2. Access Token: Contains granted OAuth 2.0 scopes and groups; used to authorize access to backend APIs and resources. Valid for 1 hour by default.\n3. Refresh Token: A long-lived token (valid for 30 days by default) used to request fresh ID and Access Tokens without forcing the user to re-enter their password.',
  whyItMatters: 'JWT tokens enable stateless, scalable authentication across microservices. Backend services verify token signatures locally using Cognito\'s public JWKS (JSON Web Key Set) without making database calls for every API request.',
  workplaceExample: 'A single-page web app authenticates with Cognito. It stores the Refresh Token securely and uses the Access Token in the `Authorization: Bearer <Access-Token>` header to call microservices behind API Gateway.',
  examFocus: 'SAA-C03 Token Roles to memorize:\n- ID Token: Proves WHO the user is (contains user profile claims).\n- Access Token: Proves WHAT the user can do (contains OAuth scopes and Cognito groups).\n- Refresh Token: Obtains new ID/Access tokens when they expire.\n- API Gateway Cognito Authorizers validate Access Tokens or ID Tokens automatically.',
  keyPoints: [
    'Cognito issues 3 tokens: ID Token, Access Token, and Refresh Token.',
    'ID Token contains user profile attributes (claims).',
    'Access Token contains OAuth 2.0 scopes and Cognito user group memberships.',
    'Refresh Token requests new ID/Access tokens without requiring re-authentication.',
    'Tokens are cryptographically signed using RSA-256 and verified via JWKS URL.'
  ],
  commonMistake: 'Using the ID Token to authorize API Gateway scope endpoints. Access Tokens should be used for API authorization; ID Tokens are used for client-side user profile display.',
  example: 'Verifying a Cognito JWT Token Signature:\nJWKS URL: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_abc123/.well-known/jwks.json`',
  sources: [
    { title: 'Using tokens with user pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html' }
  ]
});
