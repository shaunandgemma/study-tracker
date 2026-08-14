import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-16',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Encryption with AWS KMS',
  status: 'ready',
  plainEnglish: 'ECR Encryption with AWS KMS (Key Management Service) allows you to encrypt container image layers stored in ECR using a Customer Managed Key (CMK). When you push an image to a KMS-encrypted ECR repository, ECR uses your specified KMS key to encrypt the image layers. When an ECS cluster or EKS node pulls the image, the task execution role uses KMS to decrypt the image layers.',
  whyItMatters: 'Using Customer Managed KMS Keys grants full control over key policies, rotation schedules, and usage auditing via AWS CloudTrail logs. You can revoke key permissions at any time to instantly block image pulls globally.',
  workplaceExample: 'A financial institution encrypts all ECR repositories with a Customer Managed KMS Key. If a security incident occurs on a compromised cluster, revoking the KMS key policy immediately prevents compromised nodes from pulling any container images.',
  examFocus: 'SAA-C03 KMS Key Permissions for ECR:\n- The IAM role pulling images (e.g. ECS Task Execution Role or EKS Node Role) MUST have `kms:Decrypt` permissions on the KMS CMK.\n- If using Cross-Account ECR pulls, the KMS Key Policy MUST explicitly trust the external AWS account to use the key.',
  keyPoints: [
    'Uses AWS KMS Customer Managed Keys (CMK) for ECR image encryption.',
    'Provides full CloudTrail audit logging of key usage (encrypt/decrypt calls).',
    'IAM roles pulling images require `kms:Decrypt` permissions on the CMK.',
    'Cross-account ECR access requires sharing both ECR repo permissions and KMS key permissions.',
    'Key rotation can be managed automatically via AWS KMS.'
  ],
  commonMistake: 'Granting cross-account ECR repository access to another account, but forgetting to grant `kms:Decrypt` access on the KMS key. The target account\'s image pull will fail with an Access Denied error.',
  example: 'KMS Key Policy Statement for ECR:\n{\n  "Sid": "AllowECRDecrypt",\n  "Effect": "Allow",\n  "Principal": { "AWS": "arn:aws:iam::222222222222:role/ecsTaskExecutionRole" },\n  "Action": ["kms:Decrypt", "kms:GenerateDataKey"],\n  "Resource": "*"\n}',
  sources: [
    { title: 'Amazon ECR encryption at rest', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_encryption.html' }
  ]
});
