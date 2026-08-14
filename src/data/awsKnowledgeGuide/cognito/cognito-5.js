import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-5',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Cognito Identity Pools',
  status: 'ready',
  plainEnglish: 'Amazon Cognito Identity Pools (also known as Federated Identities) authorize users by exchanging authentication tokens (from Cognito User Pools, Google, Facebook, Apple, or SAML/OIDC) for temporary, limited-privilege AWS IAM security credentials (Access Key, Secret Key, Session Token). This allows mobile or web apps to access AWS services (like S3 or DynamoDB) directly.',
  whyItMatters: 'Without Identity Pools, client applications would have to proxy every file upload or database read through a backend API, or hardcode master AWS access keys inside client apps (which is an extreme security risk). Identity Pools grant temporary scoped IAM credentials directly to end users.',
  workplaceExample: 'A photo-sharing mobile application uses an Identity Pool. After a user signs in via Google, the mobile app passes the Google ID token to the Identity Pool, which exchanges it for temporary IAM credentials with permissions to upload photos to `s3://my-photo-bucket/user-id/`.',
  examFocus: 'SAA-C03 Core Concept:\n- Identity Pools = AUTHORIZATION & AWS CREDENTIALS.\n- Identity Pools issue temporary AWS IAM credentials (`STS:AssumeRoleWithWebIdentity`).\n- Supports both Authenticated Users (signed in via User Pool, Google, Facebook, SAML) and Unauthenticated Users (guest access).\n- Assigns distinct IAM roles for authenticated and guest users.',
  keyPoints: [
    'Exchanges identity tokens for temporary AWS IAM security credentials.',
    'Provides direct client access to AWS services (S3, DynamoDB, SQS).',
    'Supports federated authentication (Cognito User Pools, Social, SAML, OIDC).',
    'Supports guest access via Unauthenticated Identity IAM Roles.',
    'Uses AWS STS under the hood for short-lived credentials.'
  ],
  commonMistake: 'Hardcoding static IAM Access Keys inside a mobile app to allow photo uploads to S3 instead of using a Cognito Identity Pool to retrieve temporary credentials.',
  example: 'Identity Pool Credential Flow:\nClient App -> Authenticates with Google -> Passes ID Token to Identity Pool -> Receives Temporary AWS Credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN) -> Uploads directly to S3.',
  sources: [
    { title: 'Amazon Cognito Identity Pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity-pools.html' }
  ]
});
