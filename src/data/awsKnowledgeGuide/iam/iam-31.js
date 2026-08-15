import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-31',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'Identity-Based vs Resource-Based Policies',
  status: 'ready',
  plainEnglish: 'AWS IAM policies fall into two primary structural categories:\n- Identity-Based Policies: Attached to an IAM User, Group, or Role. They specify what that identity can do across AWS resources. They NEVER contain a `Principal` element.\n- Resource-Based Policies: Attached directly to an AWS resource (e.g. S3 Bucket, KMS Key, SQS Queue). They specify WHO can access that resource. They MUST contain a `Principal` element.',
  whyItMatters: 'Understanding how Identity-Based and Resource-Based policies interact determines how access is evaluated in single-account and cross-account scenarios.',
  workplaceExample: 'In Account A, an EC2 role has an Identity-Based policy allowing `s3:GetObject`. In Account B, an S3 bucket has a Resource-Based policy allowing Account A\'s role to read objects. Cross-account access succeeds because permissions are granted on both sides.',
  examFocus: 'SAA-C03 Evaluation Rules:\n- Same Account: Access is granted if EITHER an Identity-Based Policy OR a Resource-Based Policy contains an ALLOW (and no explicit DENY exists).\n- Cross Account: Access requires an ALLOW in BOTH the Identity-Based Policy (in source account) AND the Resource-Based Policy (in destination resource account).\n- Exception: KMS Key Policies require explicit ALLOW in Key Policy even within the same account.',
  keyPoints: [
    'Identity-Based Policies attach to users/roles; no `Principal` element.',
    'Resource-Based Policies attach to resources; MUST contain `Principal` element.',
    'Same-Account Evaluation: ALLOW in either policy grants access.',
    'Cross-Account Evaluation: ALLOW required in BOTH identity policy AND resource policy.',
    'Explicit DENY in any applicable policy always overrides all ALLOWs.'
  ],
  commonMistake: 'Expecting cross-account S3 access to work when an S3 Bucket Policy grants access to an external role, but the external role\'s Identity-Based Policy has no permissions to call `s3:GetObject`.',
  example: 'Evaluation Matrix:\n- Same Account: Identity Policy ALLOW (Yes) + Resource Policy ALLOW (No) -> ACCESS GRANTED.\n- Cross Account: Identity Policy ALLOW (Yes) + Resource Policy ALLOW (No) -> ACCESS DENIED.',
  sources: [
    { title: 'Identity-based policies and resource-based policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html' }
  ]
});
