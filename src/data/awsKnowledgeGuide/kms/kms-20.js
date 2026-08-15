import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-20',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Encryption Context',
  status: 'ready',
  plainEnglish: 'An AWS KMS Encryption Context is an optional set of non-secret key-value pairs of key-value text (additional authenticated data, or AAD) passed to KMS during encryption. The Encryption Context is cryptographically bound to the ciphertext: to decrypt the ciphertext, the exact matching Encryption Context key-value pairs MUST be supplied during the `Decrypt` API call. Furthermore, the Encryption Context is logged in plaintext in AWS CloudTrail.',
  whyItMatters: 'Encryption Context provides two major benefits: 1) Cryptographic integrity (prevents swapping encrypted data between tenants/files), and 2) Audit trail context (logs clear business context like `"Department": "Finance"` in CloudTrail without exposing secret data).',
  workplaceExample: 'A multi-tenant application encrypts data using `EncryptionContext={"TenantId": "Client-A"}`. If an attacker attempts to decrypt Client-A\'s ciphertext using `EncryptionContext={"TenantId": "Client-B"}`, KMS rejects the decryption request.',
  examFocus: 'SAA-C03 Encryption Context Details:\n- Additional Authenticated Data (AAD): Cryptographically binds context to ciphertext.\n- Decryption Rule: Decryption fails if the exact matching context is not supplied.\n- CloudTrail Logging: Logged in plaintext in CloudTrail events.\n- Security Warning: NEVER put passwords, PII, or secret data in an Encryption Context because it appears in plaintext logs.\n- Policy Conditions: Use `kms:EncryptionContext:key` in IAM policies to enforce context values.',
  keyPoints: [
    'Non-secret key-value pairs (additional authenticated data) bound to ciphertext.',
    'Decryption fails unless the exact matching Encryption Context is provided.',
    'Logged in plaintext in AWS CloudTrail for auditability.',
    'Never put passwords or sensitive PII in an Encryption Context.',
    'Can be enforced in IAM/Key policies using `kms:EncryptionContext` condition keys.'
  ],
  commonMistake: 'Placing secret data (like user passwords or credit card numbers) inside an Encryption Context, exposing sensitive plaintext data in AWS CloudTrail logs.',
  example: 'Encrypting with Encryption Context via AWS CLI:\naws kms encrypt --key-id <KEY_ID> --plaintext "Data" --encryption-context Department=Finance,Project=Audit',
  sources: [
    { title: 'Encryption context', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#encrypt_context' }
  ]
});
