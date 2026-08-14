import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-12',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR IAM Permissions',
  status: 'ready',
  plainEnglish: 'ECR IAM Permissions are identity-based policies attached to IAM Users, Groups, or Roles that define what ECR API actions a principal can perform. Key permissions include `ecr:GetAuthorizationToken` (needed for authentication), `ecr:BatchGetImage` & `ecr:GetDownloadUrlForLayer` (needed to pull images), and `ecr:PutImage` & `ecr:InitiateLayerUpload` (needed to push images).',
  whyItMatters: 'Applying least-privilege IAM policies ensures that CI/CD build servers can push images, production ECS/EKS clusters can only pull images, and developers cannot delete production image repositories.',
  workplaceExample: 'An enterprise configures an IAM Role for its ECS Task Execution Role containing the managed policy `AmazonEC2ContainerRegistryReadOnly`. This role grants permissions to pull images from ECR without allowing any push or delete operations.',
  examFocus: 'SAA-C03 AWS Managed Policies for ECR:\n- `AmazonEC2ContainerRegistryReadOnly`: Allows pulling container images.\n- `AmazonEC2ContainerRegistryPowerUser`: Allows pushing/pulling images, but prevents repository deletion.\n- `AmazonEC2ContainerRegistryFullAccess`: Grants full administrative control over all ECR resources.',
  keyPoints: [
    'Identity-based policies attached to IAM Users, Roles, or Groups.',
    '`ecr:GetAuthorizationToken` is required to authenticate with ECR.',
    'ReadOnly policy allows image pulls for container execution.',
    'PowerUser policy allows image pushes/pulls without repository deletion rights.',
    'FullAccess policy grants administrative control over all ECR resources.'
  ],
  commonMistake: 'Attaching `AmazonEC2ContainerRegistryFullAccess` to an ECS worker node IAM role, giving compute instances permission to delete production container repositories.',
  example: 'IAM Policy Action for ECR Image Pull:\n`"Action": ["ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage", "ecr:GetAuthorizationToken"]`',
  sources: [
    { title: 'AWS managed policies for Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/security-iam.html' }
  ]
});
