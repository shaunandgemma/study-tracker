import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-7',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Identity Pools for Temporary AWS Credentials',
  status: 'ready',
  plainEnglish: 'Amazon Cognito Identity Pools authorize users by exchanging authentication tokens (from User Pools, Google, Facebook, Apple, or SAML/OIDC) for temporary AWS security credentials. The credentials (an Access Key ID, Secret Access Key, and Session Token) are issued by AWS Security Token Service (STS) and governed by the IAM Role assigned to the identity.',
  whyItMatters: 'Temporary credentials eliminate long-term secret exposure and enable mobile and web applications to make direct, secure calls to AWS services (such as S3 file uploads or DynamoDB queries) without routing traffic through a backend server.',
  workplaceExample: 'A mobile gaming app exchanges a Cognito User Pool ID token with an Identity Pool. The Identity Pool assumes an IAM role (`Cognito_GameApp_Auth_Role`) and returns temporary credentials that permit writing game state files to `s3://game-saves-bucket/user-123/`.',
  examFocus: 'SAA-C03 Identity Pool Credentials:\n- Identity Pool exchanges an authentication token for temporary AWS credentials via AWS STS.\n- IAM Roles define the permissions granted to authenticated and guest users.\n- Credentials expire automatically (typically after 1 hour) and are refreshed by the AWS SDK.',
  keyPoints: [
    'Issues temporary, limited-privilege AWS credentials via AWS STS.',
    'Exchanges federated identity tokens for AWS IAM credentials.',
    'Assigned IAM Roles dictate allowed AWS actions and resources.',
    'Credentials expire automatically and are managed by the AWS SDK.',
    'Eliminates storing permanent AWS access keys in client software.'
  ],
  commonMistake: 'Confusing an ID token with AWS credentials. An ID token proves user authentication; an Identity Pool exchanges that token for AWS IAM credentials to authorize AWS API calls.',
  example: 'AWS SDK Credential Provider setup:\n`const credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: "us-east-1:12345678-1234-1234-1234-123456789012", Logins: { "cognito-idp.us-east-1.amazonaws.com/us-east-1_abc123": idToken } });`',
  sources: [
    { title: 'Getting credentials from Amazon Cognito Identity Pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/getting-credentials.html' }
  ]
});
