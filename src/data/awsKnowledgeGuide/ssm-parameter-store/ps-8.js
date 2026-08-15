import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-8',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'SecureString Encryption with AWS KMS',
  status: 'ready',
  plainEnglish: 'SecureString Encryption with AWS KMS governs how Parameter Store encrypts and decrypts `SecureString` parameter payloads. You can choose between the default AWS-managed KMS key for Systems Manager (`alias/aws/ssm`, automatically created at zero extra key cost) or a Customer Managed Key (CMK) for custom key rotation, cross-account sharing, and CloudTrail audit control.',
  whyItMatters: 'Using Customer Managed KMS Keys (CMKs) allows security administrators to control KMS Key Policies independently from IAM permissions. If an employee leaves, revoking access to the CMK immediately blocks parameter decryption across all accounts.',
  workplaceExample: 'A financial institution encrypts `/app/prod/payment-key` using a Customer Managed KMS Key (`arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012`). The security team uses CloudTrail KMS logs to audit every decryption call.',
  examFocus: 'SAA-C03 KMS Key Choice & Policy Evaluation:\n- Default AWS-Managed Key: `alias/aws/ssm` (free key, used automatically if no `--key-id` specified).\n- Customer Managed Keys (CMK): Required for cross-account parameter sharing or customer-controlled key rotation.\n- Access Evaluation: Decryption fails if the IAM principal has `ssm:GetParameter` but lacks `kms:Decrypt` permission on the KMS key.',
  keyPoints: [
    'Provides cryptographic envelope encryption for SecureString parameters using AWS KMS.',
    'Default AWS-managed key `alias/aws/ssm` is created automatically at zero key cost.',
    'Customer Managed Keys (CMKs) enable cross-account access and custom key policies.',
    'CloudTrail records every KMS `Decrypt` operation performed on SecureString parameters.',
    'Decryption fails if caller IAM policy or KMS Key Policy denies `kms:Decrypt`.'
  ],
  commonMistake: 'Using the default AWS-managed key `alias/aws/ssm` when attempting to share a parameter across AWS accounts. Default managed keys cannot be shared cross-account; a Customer Managed Key is required.',
  example: 'Creating a SecureString Parameter using a Customer Managed KMS Key via AWS CLI:\naws ssm put-parameter --name "/app/prod/db-pass" --value "example-value-not-a-secret" --type "SecureString" --key-id "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"',
  sources: [
    { title: 'AWS KMS encryption in Systems Manager Parameter Store', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-encryption.html' }
  ]
});
