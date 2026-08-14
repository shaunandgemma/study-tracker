import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-17',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Authenticated and Unauthenticated Identities',
  status: 'ready',
  plainEnglish: 'Cognito Identity Pools categorize application users into two distinct identity types:\n- Authenticated Identities: Users who have verified their identity by logging in through a supported identity provider (Cognito User Pool, Google, Facebook, Apple, SAML, or OIDC). They receive temporary credentials bound to the Authenticated IAM Role.\n- Unauthenticated (Guest) Identities: Anonymous users who have not logged in. Cognito generates a temporary unique Identity ID for the guest device and assigns temporary credentials bound to the Unauthenticated IAM Role.',
  whyItMatters: 'Unauthenticated identities allow mobile apps to provide seamless guest onboarding (such as browsing products or storing local preferences in DynamoDB) before prompting the user to sign up, without sacrificing AWS security controls.',
  workplaceExample: 'A news mobile app allows anonymous guest users (Unauthenticated Identities) to read articles stored in S3. When a guest subscribes, they sign in via Google (Authenticated Identity), and Cognito automatically transitions their Identity ID and grants access to premium subscriber content.',
  examFocus: 'SAA-C03 Guest Access rules:\n- Enable "Enable access to unauthenticated identities" in Identity Pool settings to support guest access.\n- Ensure the Unauthenticated IAM Role follows strict least-privilege (e.g. read-only access to specific public S3 buckets).\n- Guest identities can be merged into authenticated identities when a user eventually signs in.',
  keyPoints: [
    'Authenticated Identities: Signed-in users assigned the Authenticated IAM Role.',
    'Unauthenticated Identities: Guest users assigned the Unauthenticated IAM Role.',
    'Guest access enabled via Identity Pool setting ("Enable unauthenticated identities").',
    'Provides unique Identity IDs for guest devices before sign-up.',
    'Supports seamless identity migration when a guest user registers an account.'
  ],
  commonMistake: 'Enabling unauthenticated identities with an IAM role that grants full `s3:*` or `dynamodb:*` access, allowing anonymous internet users to read or delete private database records.',
  example: 'Unauthenticated IAM Role Policy:\n`"Action": ["s3:GetObject"], "Resource": "arn:aws:s3:::news-app-public-articles/*"`',
  sources: [
    { title: 'Identity pools (federated identities) overview', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html' }
  ]
});
