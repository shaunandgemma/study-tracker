import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-10',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Resource-Based Policies',
  status: 'ready',
  plainEnglish: 'A Resource-Based Policy is a JSON permissions document attached directly to an AWS resource (such as an Amazon S3 bucket, AWS KMS key, Amazon SQS queue, SNS topic, or Secrets Manager secret). Resource-based policies define who (the `Principal`) is allowed or denied permission to perform specific actions directly on that specific resource.',
  whyItMatters: 'Resource-based policies allow resources to control their own access boundaries and grant cross-account permissions directly without requiring external users to assume an IAM role in your account.',
  workplaceExample: 'A company attaches an S3 Bucket Policy (a resource-based policy) to `s3://secure-finance-data`. The policy explicitly permits an external auditing AWS account (`arn:aws:iam::<AUDIT_ACCOUNT_ID>:root`) to read audit logs directly.',
  examFocus: 'SAA-C03 Resource-Based Policy Rules:\n- Attached to: Resources (S3 buckets, KMS keys, SQS queues, Secrets Manager secrets, Lambda functions).\n- MUST contain a `Principal` element specifying WHO is granted/denied access.\n- Cross-Account Access: Allows granting cross-account access directly without requiring role assumption.\n- Same-Account Evaluation: In the same account, an ALLOW in either identity-based policy OR resource-based policy grants access (unless an explicit DENY exists).',
  keyPoints: [
    'JSON permissions documents attached directly to AWS resources.',
    'MUST include a `Principal` element specifying trusted identities.',
    'Supports granting cross-account access directly to external principals.',
    'Common examples: S3 Bucket Policies, KMS Key Policies, SQS Queue Policies.',
    'Same-account access requires an ALLOW in EITHER identity policy OR resource policy.'
  ],
  commonMistake: 'Forgetting the `Principal` element when writing an S3 Bucket Policy or KMS Key Policy, causing a JSON policy validation error.',
  example: 'Sample Resource-Based Policy JSON (S3 Bucket Policy):\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": { "AWS": "arn:aws:iam::<PARTNER_ACCOUNT_ID>:root" },\n    "Action": "s3:GetObject",\n    "Resource": "arn:aws:s3:::<BUCKET_NAME>/*"\n  }]\n}',
  sources: [
    { title: 'Identity-based policies and resource-based policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html' }
  ]
});
