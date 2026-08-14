import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-15',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Encryption at Rest',
  status: 'ready',
  plainEnglish: 'Amazon ECR Encryption at Rest automatically encrypts all stored container image layers and manifests at rest using server-side encryption before writing them to storage. ECR supports two encryption types:\n1. AES-256 (Amazon ECR managed key - `KMS_DS` / `AES256`): Free default server-side encryption managed by AWS.\n2. AWS KMS (Customer Managed Key - `KMS`): Uses an AWS Key Management Service Customer Managed Key (CMK) for customized key management, audit logging, and access control.',
  whyItMatters: 'Encryption at rest protects stored container code against unauthorized physical storage access and complies with strict data protection regulations (PCI-DSS, HIPAA, SOC 2).',
  workplaceExample: 'A healthcare firm mandates that all container repositories holding medical software must be encrypted at rest using a Customer Managed Key (CMK) in AWS KMS to satisfy HIPAA compliance standards.',
  examFocus: 'SAA-C03 Encryption options for ECR:\n- Default Encryption: AES-256 (using AWS-managed keys) applied automatically at no extra charge.\n- KMS Encryption: Select AWS KMS (`kmsKey`) to use a Customer Managed Key (CMK).\n- Note: Encryption configuration is set when creating an ECR repository and CANNOT be altered after creation.',
  keyPoints: [
    'Container images are automatically encrypted at rest before storage.',
    'Supports default Amazon-managed AES-256 server-side encryption.',
    'Supports Customer Managed Keys (CMKs) in AWS KMS for enhanced key governance.',
    'Encryption configuration is immutable after repository creation.',
    'Meets industry security and regulatory compliance mandates.'
  ],
  commonMistake: 'Attempting to change an existing ECR repository\'s encryption type from AES-256 to KMS after creation. Encryption settings can only be chosen during repository creation.',
  example: 'Creating a KMS-Encrypted ECR Repository:\n`aws ecr create-repository --repository-name secure-app --encryption-configuration encryptionType=KMS,kmsKey=arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012`',
  sources: [
    { title: 'Amazon ECR encryption at rest', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_encryption.html' }
  ]
});
