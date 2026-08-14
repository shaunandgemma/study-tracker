import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-4',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Cognito User Pools',
  status: 'ready',
  plainEnglish: 'Amazon Cognito User Pools is a fully managed user directory service that handles user registration, authentication, sign-in, multi-factor authentication (MFA), account recovery, and user attribute management for web and mobile applications. When users sign in through a User Pool, Cognito authenticates them and issues standard JSON Web Tokens (JWTs: ID Token, Access Token, Refresh Token).',
  whyItMatters: 'Building user authentication systems from scratch requires securely hashing passwords, managing OAuth flows, building password reset pages, and maintaining user databases. User Pools handle user directory management and token issuance completely out of the box.',
  workplaceExample: 'A mobile banking application uses Cognito User Pools as its user directory. Customers register with email and password, receive a 6-digit confirmation SMS code, and sign in. User Pools handle password hashing and issue JWT tokens for the mobile app.',
  examFocus: 'SAA-C03 Core Concept:\n- User Pools = AUTHENTICATION (Who are you?).\n- Identity Pools = AUTHORIZATION (What AWS resources can you access?).\n- User Pools provide user directories, sign-up, sign-in, MFA, and return JWT tokens.\n- Supports social identity federation (Google, Facebook, Apple) and enterprise SAML/OIDC.',
  keyPoints: [
    'User directory providing sign-up, sign-in, MFA, and account recovery.',
    'Handles user authentication and returns JWT tokens (ID, Access, Refresh tokens).',
    'Supports custom user attributes and password security policies.',
    'Integrates with external identity providers (Google, Apple, SAML 2.0, OIDC).',
    'Provides built-in hosted UI for seamless browser sign-in.'
  ],
  commonMistake: 'Expecting Cognito User Pools to directly grant temporary AWS IAM credentials for S3 or DynamoDB access. User Pools only handle user authentication (JWTs). You must pair User Pools with Cognito Identity Pools to get AWS IAM credentials.',
  example: 'User Pool Sign-In Response:\n`{`\n`  "IdToken": "eyJraWQiOiJ...",`\n`  "AccessToken": "eyJraWQiOiJ...",`\n`  "RefreshToken": "eyJjdHkiOiJ..."`\n`}`',
  sources: [
    { title: 'Amazon Cognito User Pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html' }
  ]
});
