import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-17',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Key Rotation',
  status: 'ready',
  plainEnglish: 'KMS Key Rotation is the security process of generating new cryptographic backing key material for an existing logical KMS key. When automatic key rotation is enabled on a Customer Managed Key, AWS KMS automatically generates new backing key material every year (365 days) while retaining all older backing key material indefinitely so previously encrypted data can still be decrypted transparently.',
  whyItMatters: 'Cryptographic compliance standards mandate rotating encryption keys periodically to limit the amount of data protected under a single key version. Automatic KMS key rotation changes the backing key without breaking application code or requiring re-encryption of existing stored data.',
  workplaceExample: 'A bank enables automatic key rotation on `alias/banking-db-key`. On day 366, KMS generates a new 256-bit backing key. New database records are encrypted with the new key version, while 1-year-old records continue to decrypt seamlessly using the retained older key version.',
  examFocus: 'SAA-C03 Automatic vs Manual Key Rotation:\n- Automatic Rotation: Available for Symmetric Encryption Customer Managed Keys. Automatically generates new backing key material every year (365 days). Does NOT change the KMS Key ID, ARN, or Key Policy.\n- Transparent Decryption: KMS retains all previous backing key versions so older data decrypts without manual intervention.\n- AWS Managed Keys: Automatically rotated by AWS every 3 years (1,095 days).\n- Asymmetric & Imported Keys: Automatic rotation is NOT supported (requires manual rotation).',
  keyPoints: [
    'Generates new backing key material for a logical KMS key while keeping Key ID/ARN unchanged.',
    'Automatic rotation occurs every 1 year (365 days) for Customer Managed Symmetric keys.',
    'AWS Managed Keys are rotated automatically every 3 years (1,095 days).',
    'Retains old backing key material so previously encrypted data decrypts automatically.',
    'Does NOT require re-encrypting existing data upon rotation.'
  ],
  commonMistake: 'Believing automatic key rotation re-encrypts all historical S3 or EBS data on day 365. Rotation generates a new backing key for new encryption; older data decrypts using older backing key versions.',
  example: 'Enabling Automatic Key Rotation via AWS CLI:\naws kms enable-key-rotation --key-id <KEY_ID>',
  sources: [
    { title: 'Rotating AWS KMS keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html' }
  ]
});
