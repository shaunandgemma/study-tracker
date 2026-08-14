import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-7',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Public Repositories',
  status: 'ready',
  plainEnglish: 'An ECR Public Repository is a container repository hosted on the Amazon ECR Public Gallery (`gallery.ecr.aws`). Anyone worldwide can search, view, and pull container images from a public repository without needing an AWS account or signing in. However, pushing images to a public repository still requires AWS IAM authentication.',
  whyItMatters: 'ECR Public Repositories provide a reliable, high-speed alternative to Docker Hub for distributing open-source software, public base images, or developer tools globally over the AWS CloudFront CDN network.',
  workplaceExample: 'An open-source software vendor publishes their official database container image to ECR Public Gallery (`public.ecr.aws/mycompany/database:v1`). Developers around the world pull the image for local testing without authentication.',
  examFocus: 'SAA-C03 Public vs Private Repository distinction:\n- Public Repositories: Global URL format `public.ecr.aws/registry-alias/repo-name`. Anonymous pulls permitted.\n- Private Repositories: Account URL format `account-id.dkr.ecr.region.amazonaws.com/repo-name`. IAM authentication mandatory.',
  keyPoints: [
    'Hosted on ECR Public Gallery (`gallery.ecr.aws`).',
    'Allows anonymous global image pulls without an AWS account.',
    'Pushing images requires AWS IAM credentials.',
    'Uses AWS CloudFront CDN for global distribution acceleration.',
    'Provides catalog information (description, usage docs, verified publisher badge).'
  ],
  commonMistake: 'Using an ECR Public Repository for internal corporate microservices, exposing private business logic and application dependencies to the public internet.',
  example: 'Pulling from ECR Public Gallery:\n`docker pull public.ecr.aws/amazonlinux/amazonlinux:latest`',
  sources: [
    { title: 'Amazon ECR Public Repositories', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html' }
  ]
});
