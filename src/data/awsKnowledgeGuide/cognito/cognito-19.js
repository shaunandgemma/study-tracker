import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-19',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Cognito User Pools vs Identity Pools',
  status: 'ready',
  plainEnglish: 'Amazon Cognito User Pools and Identity Pools serve two distinct but complementary purposes in cloud application security:\n- Cognito User Pools (Authentication - "Who are you?"): User directory service handling sign-up, sign-in, MFA, password reset, and social/SAML federation. Returns JSON Web Tokens (JWTs: ID Token, Access Token, Refresh Token).\n- Cognito Identity Pools (Authorization - "What can you do in AWS?"): Federated credential exchange service that accepts tokens (from User Pools, Google, Facebook, SAML/OIDC) and exchanges them for temporary AWS IAM security credentials (Access Key, Secret Key, Session Token) to access AWS services directly.',
  whyItMatters: 'Confusing User Pools and Identity Pools is one of the most common mistakes in AWS architecture. Understanding when to use one or both is critical for designing secure web and mobile applications.',
  workplaceExample: 'A mobile app uses BOTH services together: The app first authenticates the user against a Cognito User Pool to receive an ID Token. Next, it passes the ID Token to a Cognito Identity Pool, which returns temporary AWS IAM credentials allowing the mobile app to upload files directly to an S3 bucket.',
  examFocus: 'SAA-C03 Architectural Decision Matrix:\n- Need user registration, login, email verification, MFA, social sign-in, or JWT tokens? -> Cognito User Pools.\n- Need temporary AWS IAM credentials for direct client access to S3, DynamoDB, or SQS? -> Cognito Identity Pools.\n- Best Practice Pattern: User Pool (Authentication) -> Passes JWT to Identity Pool (Authorization) -> Receives IAM Credentials -> Accesses S3/DynamoDB.',
  keyPoints: [
    'User Pools = Authentication (User Directory, Sign-In, MFA, JWT Tokens).',
    'Identity Pools = Authorization (Temporary AWS IAM Credentials via STS).',
    'User Pools return JWTs; Identity Pools return AWS Access Keys & Session Tokens.',
    'Identity Pools support guest access (Unauthenticated Identities); User Pools require registration.',
    'User Pools and Identity Pools are frequently paired together for end-to-end security.'
  ],
  commonMistake: 'Attempting to use Cognito User Pools alone to authorize direct client S3 file uploads without using an Identity Pool or a backend API Gateway proxy.',
  example: 'Complete Cognito Architecture Pattern:\nUser signs in -> User Pool returns ID Token -> Client passes ID Token to Identity Pool -> Identity Pool assumes IAM Role -> Returns STS Credentials -> App uploads photo directly to S3.',
  sources: [
    { title: 'Amazon Cognito User Pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html' },
    { title: 'Amazon Cognito Identity Pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity-pools.html' }
  ]
});
