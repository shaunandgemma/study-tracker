import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-16",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "SNS Server-Side Encryption",
  "status": "ready",
  "plainEnglish": "Amazon SNS server-side encryption (SSE) protects a topic's stored message bodies with a symmetric encryption key from AWS Key Management Service (AWS KMS). SNS encrypts a message when it receives it, stores it encrypted, and decrypts it when delivering it to a subscriber. This at-rest protection is transparent to the subscriber.",
  "whyItMatters": "Encryption reduces the risk of stored message content being exposed and can support security or compliance requirements. The key choice and key policy are operational dependencies: an incorrect or disabled key can prevent authorized publishers or integrated AWS services from using the encrypted topic.",
  "workplaceExample": "A security-events topic uses a customer managed KMS key so the organization controls key policy and auditing. The application role and approved service publishers receive only the required KMS and SNS permissions, CloudTrail records key use, and HTTPS protects message delivery to a webhook subscriber.",
  "examFocus": "SSE protects SNS message bodies at rest, not topic metadata, message attributes, subject, message ID, or timestamp. SNS supports symmetric KMS keys. Requests to an encrypted topic must use HTTPS and Signature Version 4, and transport protection to each subscriber is a separate design concern.",
  "keyPoints": [
    "Configure topic encryption with a KMS key identifier, including the AWS managed key alias/aws/sns or an appropriate customer managed key.",
    "SNS supports symmetric encryption KMS keys for SSE, not asymmetric KMS keys.",
    "SSE covers the message body stored by SNS but does not encrypt topic metadata or message metadata such as attributes.",
    "Messages published after encryption is enabled are encrypted; changing the setting does not retroactively encrypt earlier backlogged messages.",
    "A customer managed key policy must allow the necessary principals and SNS integration to use required KMS operations such as GenerateDataKey and Decrypt.",
    "Encrypted-topic requests must use HTTPS and Signature Version 4.",
    "SNS decrypts the message before delivery, so protect the subscriber path separately, for example with HTTPS for a web endpoint.",
    "Monitor key state, policy changes, KMS errors, audit events, and KMS cost when operating encrypted topics."
  ],
  "commonMistake": "Do not describe SSE as end-to-end encryption or place sensitive values in topic names and message attributes assuming SSE protects them. Check the documented encryption scope, secure transport, and all required KMS permissions.",
  "example": "In a test environment, create a topic with an approved symmetric customer managed KMS key. Grant a test publisher only sns:Publish plus the required KMS use, publish a non-sensitive message over HTTPS with Signature Version 4, verify subscriber delivery and audit records, then remove one test permission to observe and document the expected failure before restoring it.",
  "sources": [
    {
      "title": "Securing Amazon SNS data with server-side encryption",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html"
    },
    {
      "title": "Managing Amazon SNS encryption keys and costs",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-key-management.html"
    },
    {
      "title": "Setting up Amazon SNS topic encryption with server-side encryption",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-enable-encryption-for-topic.html"
    }
  ]
});
