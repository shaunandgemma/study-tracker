import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-10',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'Symmetric Encryption KMS Keys',
  status: 'ready',
  plainEnglish: 'A Symmetric Encryption KMS Key uses the exact same 256-bit secret key (AES-256-GCM) to both encrypt data and decrypt data. Symmetric keys are the default, most widely used KMS key specification because symmetric AES-256 encryption is computationally efficient and integrates natively across almost all AWS services.',
  whyItMatters: 'Symmetric KMS keys power server-side encryption for S3, EBS, RDS, DynamoDB, and Secrets Manager, as well as generating Data Encryption Keys (DEKs) for local application envelope encryption.',
  workplaceExample: 'An enterprise configures an EBS volume with a Symmetric KMS Key (`SYMMETRIC_DEFAULT`). When EC2 writes data blocks to disk, the hypervisor encrypts data with the 256-bit AES key; when reading, it decrypts using the exact same key.',
  examFocus: 'SAA-C03 Symmetric Key Characteristics:\n- Algorithm: AES-256-GCM (Advanced Encryption Standard with 256-bit key length).\n- Key Material: Single secret key used for BOTH encryption and decryption.\n- AWS Service Integration: Supported by default across all AWS service encryption features.\n- Size Limit: Direct `Encrypt` API calls support up to 4 KB of data. For larger data, use Envelope Encryption (`GenerateDataKey`).',
  keyPoints: [
    'Uses the same 256-bit secret key (AES-256-GCM) for encryption and decryption.',
    'Default key spec (`SYMMETRIC_DEFAULT`) for AWS service encryption.',
    'Integrates natively across S3, EBS, RDS, Secrets Manager, and Lambda.',
    'Direct `Encrypt` API payloads are capped at 4 KB (use Envelope Encryption for larger data).',
    'Supports automatic annual key rotation.'
  ],
  commonMistake: 'Attempting to pass a 10 MB file directly to the KMS `Encrypt` API with a symmetric key. KMS `Encrypt` has a 4 KB size limit; larger files require envelope encryption (`GenerateDataKey`).',
  example: 'Encrypting a Small String (<4 KB) via AWS CLI:\naws kms encrypt --key-id <KEY_ID> --plaintext "SensitiveData123" --output text --query CiphertextBlob',
  sources: [
    { title: 'Symmetric encryption KMS keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#symmetric-cmks' }
  ]
});
