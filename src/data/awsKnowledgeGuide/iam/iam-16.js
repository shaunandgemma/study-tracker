import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-16',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Permissions Boundaries',
  status: 'ready',
  plainEnglish: 'An IAM Permissions Boundary is an advanced security feature used to set the MAXIMUM permissions that an identity-based policy can grant to an IAM User or IAM Role. A permissions boundary does NOT grant any permissions by itself; instead, it acts as an outer limit boundary. An action is allowed ONLY if it is allowed by BOTH the Identity Policy AND the Permissions Boundary.',
  whyItMatters: 'Permissions boundaries allow administrators to safely delegate role creation to developers. Developers can create new IAM roles for their applications, but the Permissions Boundary prevents them from creating roles with administrator privileges or escalating their own permissions.',
  workplaceExample: 'A company allows developers to create IAM roles for Lambda functions. To prevent privilege escalation, administrators enforce a Permissions Boundary on all new roles that explicitly restricts actions to DynamoDB and CloudWatch, blocking `iam:*` and `s3:*` actions.',
  examFocus: 'SAA-C03 Permissions Boundary Mechanics:\n- Set maximum allowed permissions for IAM Users and Roles.\n- Does NOT grant permissions by itself (requires an identity policy ALLOW as well).\n- Formula: Effective Permissions = Identity Policy ALLOW AND Permissions Boundary ALLOW.\n- Common Use Case: Delegating role creation to developers without risking privilege escalation.',
  keyPoints: [
    'Sets the maximum permissions boundary for an IAM User or Role.',
    'Does NOT grant any permissions on its own.',
    'Effective permissions require an ALLOW in both the identity policy and the boundary.',
    'Enables safe delegation of IAM creation tasks to non-admin developers.',
    'Prevents developers from escalating privileges by creating admin roles.'
  ],
  commonMistake: 'Expecting a Permissions Boundary to grant access to an S3 bucket without attaching an Identity-Based Policy that explicitly allows S3 access.',
  example: 'Attaching a Permissions Boundary via AWS CLI:\naws iam put-user-permissions-boundary --user-name dev-user --permissions-boundary "arn:aws:iam::<ACCOUNT_ID>:policy/DeveloperBoundaryPolicy"',
  sources: [
    { title: 'Permissions boundaries for IAM entities', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html' }
  ]
});
