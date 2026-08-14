import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-16',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Identity Pool IAM Roles',
  status: 'ready',
  plainEnglish: 'Identity Pool IAM Roles are AWS Identity and Access Management (IAM) roles attached to a Cognito Identity Pool that define the exact AWS permissions granted to users when they request temporary credentials. Identity Pools configure two default IAM roles:\n1. Authenticated Role: Assumed by users who have successfully authenticated via a User Pool, Google, Facebook, SAML, etc.\n2. Unauthenticated (Guest) Role: Assumed by anonymous guest users who have not logged in.',
  whyItMatters: 'Using fine-grained IAM roles ensures that guest users have strictly limited read permissions (e.g. browsing product catalogs) while signed-in users receive elevated permissions (e.g. uploading personal avatars or placing orders).',
  workplaceExample: 'An e-commerce mobile app configures an Identity Pool with two roles:\n- Guest Role (`Cognito_UnauthRole`): Grants `s3:GetObject` on `s3://shop-public-assets/*`.\n- Auth Role (`Cognito_AuthRole`): Grants `s3:PutObject` on `s3://shop-user-uploads/${cognito-identity.amazonaws.com:sub}/*`.',
  examFocus: 'SAA-C03 IAM Policy Variables for Cognito:\n- `${cognito-identity.amazonaws.com:sub}`: Dynamic policy variable representing the unique Cognito Identity ID of the authenticated user.\n- Use policy variables to isolate user data in S3 buckets or DynamoDB tables without creating separate IAM roles for every user!',
  keyPoints: [
    'Attaches IAM roles to Identity Pools for Authenticated and Guest users.',
    'Authenticated Role grants elevated permissions to signed-in users.',
    'Unauthenticated Role grants limited guest access to public AWS resources.',
    'Supports dynamic IAM policy variables (`${cognito-identity.amazonaws.com:sub}`).',
    'Supports Rules-Based Role Mapping to assign different IAM roles based on user groups or claims.'
  ],
  commonMistake: 'Writing static S3 bucket policies for each user instead of attaching a single IAM policy using the `${cognito-identity.amazonaws.com:sub}` variable to dynamically scope folder access.',
  example: 'S3 Policy using Cognito Identity ID Variable:\n{\n  "Effect": "Allow",\n  "Action": ["s3:PutObject", "s3:GetObject"],\n  "Resource": "arn:aws:s3:::my-user-uploads/${cognito-identity.amazonaws.com:sub}/*"\n}',
  sources: [
    { title: 'Role-based access control for Amazon Cognito Identity Pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/role-based-access-control.html' }
  ]
});
