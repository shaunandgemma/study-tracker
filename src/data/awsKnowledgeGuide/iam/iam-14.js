import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-14',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'Explicit Deny Overrides Allow',
  status: 'ready',
  plainEnglish: 'In AWS IAM policy evaluation, an Explicit Deny statement ALWAYS takes absolute precedence over any Explicit Allow statement, regardless of where or how the policies are attached. If a request matches an `"Effect": "Deny"` statement in an Identity Policy, Resource Policy, Permissions Boundary, or Service Control Policy (SCP), access is immediately denied.',
  whyItMatters: 'Explicit Deny allows administrators to enforce absolute guardrails (such as restricting sensitive actions or enforcing MFA) that cannot be bypassed by any user-attached ALLOW permissions.',
  workplaceExample: 'A developer has the `AdministratorAccess` managed policy attached to their IAM user, granting `"Effect": "Allow", "Action": "*"`. However, an explicit Deny policy statement is attached blocking all non-MFA requests (`"Effect": "Deny", "Condition": {"Bool": {"aws:MultiFactorAuthPresent": "false"}}`). Until the developer logs in with MFA, all actions are blocked.',
  examFocus: 'SAA-C03 Absolute Precedence Rule:\n- Explicit Deny > Explicit Allow > Implicit Deny.\n- No matter how many ALLOW statements exist across managed policies or inline policies, a single matching `"Effect": "Deny"` blocks the request.\n- Frequently used in SCPs to enforce compliance guardrails (e.g. denying EC2 creation in unauthorized AWS regions).',
  keyPoints: [
    'An Explicit Deny statement always overrides any Explicit Allow statement.',
    'Applies across all policy types (Identity, Resource, SCPs, Boundaries, Session Policies).',
    'Used to enforce non-negotiable security guardrails (e.g. MFA enforcement, region restrictions).',
    'Implicit Deny occurs when no Allow exists; Explicit Deny actively blocks matching requests.',
    'Enables top-down organization-wide compliance enforcement in AWS Organizations.'
  ],
  commonMistake: 'Attempting to grant a developer permission to delete S3 buckets by attaching an ALLOW policy, without realizing an explicit DENY in an SCP or Permissions Boundary is blocking the action.',
  example: 'Explicit Deny Statement JSON:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Sid": "DenyUnencryptedS3Uploads",\n    "Effect": "Deny",\n    "Principal": "*",\n    "Action": "s3:PutObject",\n    "Resource": "arn:aws:s3:::<BUCKET_NAME>/*",\n    "Condition": {\n      "StringNotEquals": { "s3:x-amz-server-side-encryption": "AES256" }\n    }\n  }]\n}',
  sources: [
    { title: 'Policy evaluation logic', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' }
  ]
});
