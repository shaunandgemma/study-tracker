import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-15',
  topicId: 'topic-kms',
  topicTitle: 'AWS AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'IAM Policies with KMS',
  status: 'ready',
  plainEnglish: 'IAM Policies with KMS are identity-based JSON policies attached to IAM Users, Groups, or Roles that grant permission to call KMS actions (such as `kms:Encrypt`, `kms:Decrypt`, or `kms:GenerateDataKey`). However, an IAM policy alone cannot grant KMS key access UNLESS the target KMS key\'s Key Policy explicitly permits IAM policy delegation.',
  whyItMatters: 'Combining IAM policies with Key Policies enables flexible role-based access control (RBAC). Security administrators manage Key Policies once, while application teams manage IAM policies attached to EC2 or Lambda roles.',
  workplaceExample: 'An application role needs to decrypt S3 objects protected by a Customer Managed Key. The Key Policy trusts the account root principal. The DevOps engineer attaches an IAM Policy to the application role granting `kms:Decrypt` and `kms:GenerateDataKey` on the key ARN.',
  examFocus: 'SAA-C03 Dual-Authorization Requirement for KMS:\n- Access requires an ALLOW in BOTH the IAM Identity Policy AND the KMS Key Policy (or a Key Policy that explicitly delegates access to the account root principal).\n- IAM Condition Keys: Use `kms:ViaService` (restricts key usage to specific AWS services like S3 or EBS) and `kms:EncryptionContext` (requires matching encryption context key-value pairs).',
  keyPoints: [
    'Identity-based policies attached to IAM Users or Roles to grant KMS actions.',
    'Effective ONLY if the target KMS Key Policy allows IAM policy delegation.',
    'KMS Actions: `kms:Encrypt`, `kms:Decrypt`, `kms:GenerateDataKey`, `kms:DescribeKey`.',
    'Condition Key `kms:ViaService`: Restricts key API calls to specific AWS services (e.g. `s3.us-east-1.amazonaws.com`).',
    'Condition Key `kms:EncryptionContext`: Requires matching encryption context key-value pairs.'
  ],
  commonMistake: 'Attaching an IAM Policy granting `kms:Decrypt` to an IAM role without checking if the KMS Key Policy allows IAM policy delegation, resulting in `AccessDeniedException`.',
  example: 'Sample IAM Policy for KMS Access with `kms:ViaService`:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["kms:Decrypt", "kms:GenerateDataKey"],\n    "Resource": "arn:aws:kms:us-east-1:<ACCOUNT_ID>:key/<KEY_ID>",\n    "Condition": {\n      "StringEquals": { "kms:ViaService": "s3.us-east-1.amazonaws.com" }\n    }\n  }]\n}',
  sources: [
    { title: 'Using IAM policies with AWS KMS', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/iam-policies.html' }
  ]
});
