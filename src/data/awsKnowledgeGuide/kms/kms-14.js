import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-14',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Key Policies',
  status: 'ready',
  plainEnglish: 'A KMS Key Policy is a resource-based JSON policy attached directly to a Customer Managed KMS key that serves as the PRIMARY access control mechanism for that key. Unlike other AWS resources where IAM policies alone can grant access, every Customer Managed KMS key MUST have a Key Policy. Without an explicit Key Policy statement delegating authority to IAM, IAM policies attached to users or roles have no effect.',
  whyItMatters: 'Key Policies establish absolute ownership and separation of duties. They allow key administrators to delegate key usage permissions to specific IAM roles or external AWS accounts while preventing unauthorized IAM administrators from accessing sensitive cryptographic keys.',
  workplaceExample: 'A security team creates a KMS Key Policy. Statement 1 grants Key Administrators permission to manage the key (`kms:*`). Statement 2 delegates access to the account root principal (`"AWS": "arn:aws:iam::<ACCOUNT_ID>:root"`), enabling IAM policies attached to application roles to grant `kms:Decrypt` access.',
  examFocus: 'SAA-C03 Key Policy Rules:\n- Primary Access Control: Every Customer Managed KMS key MUST have a Key Policy.\n- Enabling IAM Policies: To allow IAM policies to control access to a KMS key, the Key Policy MUST contain a statement trusting the account root principal (`arn:aws:iam::<ACCOUNT_ID>:root`).\n- Default Key Policy: Created automatically via AWS Console; delegates control to the account root principal.',
  keyPoints: [
    'Primary access control mechanism attached directly to a KMS key.',
    'Every Customer Managed KMS key must have a Key Policy.',
    'Must trust account root principal (`arn:aws:iam::<ACCOUNT_ID>:root`) to enable IAM policy evaluation.',
    'Defines distinct statements for Key Administrators and Key Users.',
    'Essential for cross-account KMS key sharing and least-privilege key governance.'
  ],
  commonMistake: 'Deleting or omitting the root delegation statement (`"Principal": {"AWS": "arn:aws:iam::<ACCOUNT_ID>:root"}`) from a Key Policy, rendering IAM policies unable to grant access to the key.',
  example: 'Sample Default KMS Key Policy JSON:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Sid": "EnableIAMUserPermissions",\n    "Effect": "Allow",\n    "Principal": { "AWS": "arn:aws:iam::<ACCOUNT_ID>:root" },\n    "Action": "kms:*",\n    "Resource": "*"\n  }]\n}',
  sources: [
    { title: 'Key policies in AWS KMS', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html' }
  ]
});
