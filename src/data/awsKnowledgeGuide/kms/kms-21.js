import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-21',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Cross-Account Access',
  status: 'ready',
  plainEnglish: 'KMS Cross-Account Access allows an identity (an IAM User or Role) in Account A to use a Customer Managed KMS Key located in Account B. Granting cross-account access requires a dual-authorization configuration: 1) Account B\'s KMS Key Policy MUST explicitly permit Account A (or a specific role in Account A), AND 2) Account A\'s IAM Policy MUST permit the role to call KMS actions on Account B\'s Key ARN.',
  whyItMatters: 'Multi-account AWS architectures require sharing encrypted resources (such as EBS volume snapshots, S3 buckets, or AMI images) securely between development, staging, and central backup accounts.',
  workplaceExample: 'An enterprise shares an encrypted EBS snapshot from Account A (`111111111111`) to Account B (`222222222222`). The Customer Managed Key Policy in Account A grants Account B permission to use `kms:Decrypt` and `kms:CreateGrant`, allowing Account B to restore the encrypted volume.',
  examFocus: 'SAA-C03 Cross-Account KMS Requirements:\n- Must use a Customer Managed Key (AWS Managed Keys `aws/s3` CANNOT be shared across accounts).\n- Dual Authorization: 1) Key Policy in Account B grants permissions to Account A, AND 2) IAM Policy in Account A permits access to Account B Key ARN.\n- Sharing Encrypted Resources: Copying encrypted EBS snapshots or AMIs across accounts requires re-encrypting under a Customer Managed Key trusted by the target account.',
  keyPoints: [
    'Enables identities in one account to use a KMS key located in another account.',
    'Requires a Customer Managed Key (AWS Managed Keys cannot be shared cross-account).',
    'Requires ALLOW permissions in BOTH the Key Policy and the requester\'s IAM Policy.',
    'Essential for cross-account S3 replication, EBS snapshot sharing, and AMI sharing.',
    'Supports KMS Grants for dynamic cross-account AWS service integration.'
  ],
  commonMistake: 'Attempting to share an encrypted EBS snapshot across accounts while encrypted under the default AWS Managed Key `aws/ebs`. Cross-account sharing requires a Customer Managed Key.',
  example: 'Cross-Account Key Policy Statement JSON (in Account B trusting Account A):\n{\n  "Sid": "AllowAccountAAccess",\n  "Effect": "Allow",\n  "Principal": { "AWS": "arn:aws:iam::<ACCOUNT_A_ID>:role/DeploymentRole" },\n  "Action": ["kms:Encrypt", "kms:Decrypt", "kms:GenerateDataKey"],\n  "Resource": "*"\n}',
  sources: [
    { title: 'Allowing users in other accounts to use a KMS key', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying.html#key-policy-modifying-external-accounts' }
  ]
});
