import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-1',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Docker Image Repositories (Private vs Public Repositories)',
  status: 'ready',
  plainEnglish: 'Amazon ECR (Elastic Container Registry) provides two types of Docker image repositories:\n- Private Repositories: Require AWS IAM authentication to push or pull container images. They keep corporate application images completely isolated and secure within your AWS account or organization.\n- Public Repositories (ECR Public Gallery): Allow anyone worldwide to pull public container images without needing an AWS account or authentication, while authenticated users receive higher free pull rate limits.',
  whyItMatters: 'Using the right repository type ensures proprietary corporate code remains strictly confidential in Private Repositories, while open-source tools or public software distributions can be shared globally via ECR Public Gallery.',
  workplaceExample: 'A software firm stores its proprietary microservices in ECR Private Repositories restricted to their CI/CD deployment pipeline. For their open-source database connector tool, they publish the image to ECR Public Gallery so developers worldwide can pull it easily.',
  examFocus: 'SAA-C03 distinction:\n- Private Repositories: Access controlled via IAM policies and ECR Repository Policies. Integrated with KMS encryption, VPC Endpoints, and cross-account access.\n- Public Repositories: Discoverable globally on `gallery.ecr.aws`. Public pulls do not require IAM authentication.',
  keyPoints: [
    'Private Repositories require IAM authentication to push and pull images.',
    'Public Repositories are globally accessible on ECR Public Gallery (`gallery.ecr.aws`).',
    'Private Repositories support KMS encryption, Lifecycle Policies, and Repository Policies.',
    'Public Repositories include high availability and global CDN acceleration.',
    'Private Repositories integrate with VPC Interface Endpoints for private traffic.'
  ],
  commonMistake: 'Publishing internal proprietary application images to an ECR Public Repository instead of a Private Repository, exposing corporate source code to the internet.',
  example: 'ECR Image URI Comparison:\n- Private Repository: `123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:v1`\n- Public Repository: `public.ecr.aws/alias/my-open-source-app:v1`',
  sources: [
    { title: 'Amazon ECR Repositories', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html' }
  ]
});
