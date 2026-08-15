import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-21',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'SQS with AWS KMS',
  status: 'ready',
  plainEnglish: 'Integrating Amazon SQS with AWS Key Management Service (SSE-KMS) allows encrypting message bodies at rest using Customer Managed Keys (CMKs) or AWS-managed keys (`aws/sqs`). SSE-KMS provides strict key access policy control, key rotation, and CloudTrail audit logging, while utilizing a configurable Data Key Reuse Period (1 minute to 24 hours) to reduce KMS API costs.',
  whyItMatters: 'Regulated enterprises require granular key access policies and CloudTrail audit logs for every cryptographic operation. Using Customer Managed KMS keys for SQS satisfies strict compliance standards.',
  workplaceExample: 'A bank encrypts an SQS queue using a Customer Managed KMS key. The KMS Key Policy permits ONLY the `PaymentProcessor` IAM role to decrypt messages, preventing unauthorized IAM administrators from reading raw payment payload contents.',
  examFocus: 'SAA-C03 SQS + KMS Key Permissions & Caching:\n- IAM & KMS Permissions: Producers need `kms:GenerateDataKey` & `kms:Decrypt`; Consumers need `kms:Decrypt` on the KMS Key Policy.\n- Data Key Reuse Period: Caches data keys in SQS memory (default 5 minutes, range 1 min to 24 hrs) to minimize KMS API costs.\n- Cross-Account KMS Access: Cross-account queue consumers require explicit `kms:Decrypt` access on the destination KMS Key Policy.',
  keyPoints: [
    'Uses AWS KMS Customer Managed Keys (CMKs) to encrypt SQS queue payloads at rest.',
    'Provides detailed CloudTrail audit logs for cryptographic key usage.',
    'Requires producers and consumers to hold appropriate IAM and KMS Key Policy permissions.',
    'Data Key Reuse Period (default 5 mins) caches encryption keys to reduce KMS API costs.',
    'Essential for enterprise HIPAA, PCI-DSS, and SOC 2 compliance requirements.'
  ],
  commonMistake: 'Configuring an SQS queue with an SSE-KMS key without granting `kms:Decrypt` permissions to the worker IAM role, causing worker message retrieval calls to fail with Access Denied.',
  example: 'Enabling SSE-KMS Encryption with a Custom KMS Key via AWS CLI:\naws sqs set-queue-attributes --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/my-queue" --attributes KmsMasterKeyId="arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012",KmsDataKeyReusePeriodSeconds=300',
  sources: [
    { title: 'Encrypting SQS queues using AWS KMS', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html#sqs-sse-key-management-service' }
  ]
});
