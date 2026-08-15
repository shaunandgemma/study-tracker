import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-6",
  "title": "Encryption with AWS KMS",
  "plainEnglish": "Secrets Manager uses envelope encryption with AWS Key Management Service (AWS KMS). KMS generates and encrypts a data key; Secrets Manager uses the plaintext data key briefly to encrypt the secret value, discards that plaintext key from memory, and stores the encrypted data key with the secret metadata. The KMS key does not act as the secret-value database.",
  "whyItMatters": "The encryption-key choice adds an authorization layer to secret-value operations. The AWS managed key is suitable for many same-account cases, while a customer-managed key is needed for controls such as a custom key policy and normal cross-account access.",
  "workplaceExample": "A regulated service stores a database secret under a customer-managed KMS key. Its workload role can retrieve only that secret and use the key only through Secrets Manager, while a separate administrator manages key policy changes and monitors KMS activity.",
  "examFocus": "Distinguish Secrets Manager from KMS: Secrets Manager manages the value and versions; KMS protects the data key and performs cryptographic operations. With a customer-managed key, evaluate both Secrets Manager permission and applicable KMS key or IAM permission.",
  "keyPoints": [
    "Secrets Manager encrypts secret values at rest by using envelope encryption.",
    "A symmetric KMS key protects the data key rather than directly storing the secret value.",
    "The aws/secretsmanager AWS managed key is the default choice for many same-account secrets.",
    "A customer-managed key supports a custom key policy and is required for normal cross-account secret access.",
    "KMS encryption context identifies the secret and version and can help constrain or audit key use.",
    "Disabling or deleting a required KMS key can prevent Secrets Manager from decrypting protected values."
  ],
  "commonMistake": "Granting GetSecretValue alone is insufficient when the caller lacks required access to a customer-managed KMS key. Diagnose the secret policy, identity policy, and KMS policy as separate authorization layers.",
  "example": "For a test secret that requires additional key control, create a narrowly governed symmetric customer-managed key, permit the workload's required use through Secrets Manager for that secret context, store only harmless test data, verify allowed and denied retrieval, and never expose the returned value in the test output.",
  "sources": [
    {
      "title": "Secret encryption and decryption in AWS Secrets Manager",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/security-encryption.html"
    },
    {
      "title": "Choose an encryption key for your secret",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html#bp-encryption-key"
    }
  ]
});
