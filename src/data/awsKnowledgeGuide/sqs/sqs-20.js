import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-20',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Server-Side Encryption',
  status: 'ready',
  plainEnglish: 'Server-Side Encryption (SSE) in Amazon SQS secures sensitive message body payloads at rest using 256-bit AES encryption. SQS provides two server-side encryption options: SSE-SQS (using an AWS-managed encryption key with zero additional cost or KMS management) and SSE-KMS (using AWS Key Management Service keys for granular audit logging and customer-managed key rotation).',
  whyItMatters: 'Unencrypted queues storing sensitive data (PII, payment info, health records) risk regulatory compliance violations. Enabling SSE ensures that all message bodies are encrypted prior to being written to disk storage in SQS servers.',
  workplaceExample: 'A healthcare application enables SSE-SQS on its message queues. All patient notification payloads sent to the queue are transparently encrypted at rest using SQS-managed keys without requiring extra KMS configuration.',
  examFocus: 'SAA-C03 SSE Options & Scope:\n- SSE-SQS: Enabled by default on new queues; uses SQS-managed keys (`sqs/alias`); zero extra charge or KMS call limits.\n- SSE-KMS: Uses AWS KMS keys (`aws/sqs` or CMK); provides detailed CloudTrail KMS audit logging.\n- Encrypted Content: Encrypts the `MessageBody` payload; message metadata (Message ID, timestamps) remains unencrypted.\n- Encryption in Transit: Transport layer encryption (HTTPS / TLS 1.2+) is enforced independently of SSE.',
  keyPoints: [
    'Encrypts message body payloads at rest using 256-bit AES encryption.',
    'SSE-SQS uses AWS-managed keys at zero additional cost (enabled by default).',
    'SSE-KMS uses AWS Key Management Service keys for audit control.',
    'Encrypts raw message body content; metadata (IDs, attributes) is not encrypted.',
    'Must be combined with HTTPS for end-to-end transit and rest security.'
  ],
  commonMistake: 'Assuming SSE encrypts message attributes or message IDs. SSE encrypts message body payloads only.',
  example: 'Enabling SSE-SQS Encryption on a Queue via AWS CLI:\naws sqs set-queue-attributes --queue-url "https://sqs.us-east-1.amazonaws.com/123456789012/my-queue" --attributes SqsManagedSseEnabled=true',
  sources: [
    { title: 'Server-side encryption for Amazon SQS', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html' }
  ]
});
