import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-9',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Identity-Based Policies',
  status: 'ready',
  plainEnglish: 'An Identity-Based Policy is a JSON permissions document attached directly to an IAM identity (an IAM User, IAM Group, or IAM Role). Identity-based policies define what actions that specific identity can perform, on which AWS resources, and under what specific conditions.',
  whyItMatters: 'Identity-based policies provide centralized control over user and workload capabilities. By attaching scoped identity-based policies to roles and groups, administrators enforce least privilege across all AWS services.',
  workplaceExample: 'A cloud administrator attaches an identity-based policy named `DeveloperS3AccessPolicy` to the `Developers` IAM Group. All members of the group gain permission to list and read objects in `s3://dev-application-data`.',
  examFocus: 'SAA-C03 Identity-Based Policy Rules:\n- Attached to: IAM Users, IAM Groups, and IAM Roles.\n- Element Structure: `Effect` (Allow/Deny), `Action` (e.g. `s3:GetObject`), `Resource` (e.g. `arn:aws:s3:::my-bucket/*`), and optional `Condition`.\n- Principal Element: Identity-based policies NEVER contain a `Principal` element because the principal is implicitly the identity to which the policy is attached.',
  keyPoints: [
    'JSON permissions documents attached to IAM Users, Groups, or Roles.',
    'Specifies allowed or denied actions, target resources, and conditions.',
    'Does NOT contain a `Principal` element (the principal is the attached identity).',
    'Categorized into AWS Managed Policies, Customer Managed Policies, and Inline Policies.',
    'Evaluated along with resource-based policies and permissions boundaries.'
  ],
  commonMistake: 'Including a `Principal` element inside an Identity-Based Policy. The `Principal` element is valid ONLY in Resource-Based Policies and Role Trust Policies.',
  example: 'Sample Identity-Based Policy JSON:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject", "s3:ListBucket"],\n    "Resource": ["arn:aws:s3:::<BUCKET_NAME>", "arn:aws:s3:::<BUCKET_NAME>/*"]\n  }]\n}',
  sources: [
    { title: 'Policies and permissions in AWS Identity and Access Management', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html' }
  ]
});
