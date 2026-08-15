import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-12',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'Envelope Encryption',
  status: 'ready',
  plainEnglish: 'Envelope Encryption is the practice of encrypting application data locally with a unique Data Encryption Key (DEK), and then encrypting that Data Encryption Key under a root KMS key. The data key encrypts the actual data, while the KMS key protects the data key (like enclosing a letter inside an encrypted envelope).',
  whyItMatters: 'Sending megabytes or gigabytes of raw data over the network to KMS for encryption causes network latency and hits KMS API throttling limits. Envelope encryption performs fast local data encryption in memory while keeping key management centralized in KMS.',
  workplaceExample: 'An application needs to store a 500 MB video file in S3. It calls KMS `GenerateDataKey`, receives a plaintext DEK and an encrypted DEK. It encrypts the 500 MB video locally with the plaintext DEK, stores the encrypted video alongside the encrypted DEK in S3, and immediately purges the plaintext DEK from RAM.',
  examFocus: 'SAA-C03 Envelope Encryption 8-Step Sequence:\n1. Call `GenerateDataKey` on KMS key.\n2. Receive plaintext DEK + encrypted DEK.\n3. Encrypt data locally with plaintext DEK.\n4. Store encrypted data + encrypted DEK together.\n5. Purge plaintext DEK from memory.\n6. To decrypt: Send encrypted DEK to KMS `Decrypt` API.\n7. Receive plaintext DEK.\n8. Decrypt local data and purge plaintext DEK from memory again.',
  keyPoints: [
    'Encrypts data locally with a Data Encryption Key (DEK); protects DEK with a KMS key.',
    'Solves performance limits: Local data encryption is fast and avoids KMS network latency.',
    'Bypasses the 4 KB payload limit of direct KMS `Encrypt` API calls.',
    'Plaintext DEK must be purged from application memory immediately after use.',
    'Used under the hood by Amazon S3, EBS, DynamoDB, and the AWS Encryption SDK.'
  ],
  commonMistake: 'Storing the plaintext Data Encryption Key on disk alongside the encrypted data, invalidating all encryption security.',
  example: 'Envelope Encryption Decryption Step via AWS CLI:\naws kms decrypt --ciphertext-blob fileb://encrypted-dek.bin --output text --query Plaintext',
  sources: [
    { title: 'Envelope encryption', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping' }
  ]
});
