import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-7',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'SecureString Parameters',
  status: 'ready',
  plainEnglish: 'A `SecureString` parameter is an encrypted parameter type in Parameter Store used to store sensitive data (such as database passwords, API tokens, license keys, or OAuth secrets). Parameter Store automatically encrypts `SecureString` payload values at rest using 256-bit AES encryption backed by AWS Key Management Service (KMS).',
  whyItMatters: 'Storing sensitive credentials in plain text creates critical security risks. `SecureString` ensures sensitive values are encrypted on disk in Parameter Store and decrypted in plaintext only when explicitly authorized clients request them with decryption flags.',
  workplaceExample: 'A developer stores a database master password in Parameter Store as `/study-tracker/dev/database/password` with type `SecureString`. When an EC2 worker fetches the parameter, it passes `--with-decryption` to receive the plaintext password.',
  examFocus: 'SAA-C03 SecureString Mechanics & Decryption:\n- Encryption at Rest: Payload encrypted automatically using AWS KMS (default AWS-managed key `aws/ssm` or a Customer Managed Key).\n- API Retrieval Flag: Callers MUST specify `--with-decryption` in `GetParameter` / `GetParametersByPath` to receive plaintext.\n- Dual Permission Requirement: Caller IAM role requires BOTH `ssm:GetParameter` AND `kms:Decrypt` permissions on the KMS key.',
  keyPoints: [
    'Encrypted parameter type for sensitive data (passwords, tokens, keys).',
    'Payloads are encrypted at rest using 256-bit AES encryption backed by AWS KMS.',
    'Retrieving plaintext requires passing the `--with-decryption` parameter in API requests.',
    'Requires both `ssm:GetParameter` and `kms:Decrypt` IAM permissions.',
    'Uses default AWS-managed KMS key `aws/ssm` or customer-managed KMS CMKs.'
  ],
  commonMistake: 'Executing `aws ssm get-parameter` without the `--with-decryption` flag, receiving an encrypted ciphertext blob instead of plaintext credentials.',
  example: 'Creating a SecureString Parameter via AWS CLI:\naws ssm put-parameter --name "/study-tracker/dev/database/password" --value "example-value-not-a-secret" --type "SecureString"',
  sources: [
    { title: 'Creating Systems Manager SecureString parameters', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-securestring.html' }
  ]
});
