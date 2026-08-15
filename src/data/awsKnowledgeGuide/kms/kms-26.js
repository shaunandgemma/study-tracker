import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-26',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS API Calls and Permissions',
  status: 'ready',
  plainEnglish: 'AWS KMS API Calls and Permissions govern how applications and users interact programmatically with KMS keys. KMS APIs fall into two functional groups:\n- Cryptographic Operations: APIs used to encrypt, decrypt, and generate data keys (e.g. `kms:Encrypt`, `kms:Decrypt`, `kms:GenerateDataKey`, `kms:ReEncrypt`).\n- Management Operations: APIs used to manage keys, policies, and aliases (e.g. `kms:CreateKey`, `kms:PutKeyPolicy`, `kms:EnableKeyRotation`, `kms:ScheduleKeyDeletion`).',
  whyItMatters: 'Enforcing strict separation of duties requires separating key management permissions from cryptographic key usage permissions. Application roles should be granted strictly `kms:Decrypt` or `kms:GenerateDataKey`, while administrative roles are granted `kms:CreateKey` and `kms:PutKeyPolicy`.',
  workplaceExample: 'A security architect grants an EC2 application role strictly `kms:Decrypt` and `kms:GenerateDataKey` permissions. The role is explicitly blocked from management APIs (`kms:ScheduleKeyDeletion`, `kms:PutKeyPolicy`), preventing application code from tampering with key configuration.',
  examFocus: 'SAA-C03 Core KMS API Actions:\n- `kms:Encrypt`: Encrypts up to 4 KB of plaintext data.\n- `kms:Decrypt`: Decrypts ciphertext (automatically determines which backing key version to use).\n- `kms:GenerateDataKey`: Returns plaintext DEK and encrypted DEK for envelope encryption.\n- `kms:ViaService`: Condition key restricting API calls to specific AWS services (e.g. `s3.amazonaws.com`).\n- CloudTrail Logging: Every KMS API call is recorded in AWS CloudTrail for security auditing.',
  keyPoints: [
    'APIs divided into Cryptographic Operations and Key Management Operations.',
    'Separation of Duties: Grant app roles cryptographic actions; grant admin roles management actions.',
    '`kms:Decrypt` automatically selects the correct backing key version to decrypt ciphertext.',
    'Every KMS API invocation is audited in detail in AWS CloudTrail logs.',
    'Supports KMS request throttling limits and request quotas.'
  ],
  commonMistake: 'Granting `kms:*` permissions to application microservices, allowing application code to modify key policies or schedule key deletion.',
  example: 'Calling KMS Decrypt API via AWS CLI:\naws kms decrypt --ciphertext-blob fileb://encrypted-file.bin --output text --query Plaintext',
  sources: [
    { title: 'AWS KMS API Reference', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/kms-api-permissions-reference.html' }
  ]
});
