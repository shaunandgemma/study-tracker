import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-23',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR with Amazon ECS',
  status: 'ready',
  plainEnglish: 'Amazon ECR integrates natively with Amazon ECS (Elastic Container Service) to store and supply container images for ECS tasks and services. When an ECS Task launches (on EC2 or AWS Fargate), the ECS agent uses the task\'s ECS Execution Role (`executionRoleArn`) to authenticate with ECR automatically and pull the specified container image URI.',
  whyItMatters: 'Seamless integration between ECR and ECS eliminates the need to manage container registry login scripts or hardcode static passwords on container instances.',
  workplaceExample: 'An e-commerce API is defined in an ECS Task Definition with image `123456789012.dkr.ecr.us-east-1.amazonaws.com/api:v2.0`. When ECS Fargate scales out during high traffic, Fargate authenticates via the task execution role and pulls `api:v2.0` from ECR in seconds.',
  examFocus: 'SAA-C03 ECS + ECR integration requirements:\n- The ECS Task Execution Role (`executionRoleArn`) must include the AWS managed policy `AmazonEC2ContainerRegistryReadOnly` (or equivalent `ecr:BatchGetImage`, `ecr:GetDownloadUrlForLayer`, `ecr:GetAuthorizationToken` permissions).\n- Distinguish Task Execution Role (used by ECS agent to pull ECR image & CloudWatch logs) from Task Role (used by the application code inside the container to access AWS services).',
  keyPoints: [
    'Native container image registry for Amazon ECS tasks and services.',
    'ECS Task Execution Role provides permissions for pulling images from ECR.',
    'Works seamlessly with both EC2 launch type and AWS Fargate serverless launch type.',
    'Supports pulling images from Private ECR repos across different AWS accounts.',
    'Integrated with PrivateLink (VPC Endpoints) for private image pulls without public IP addresses.'
  ],
  commonMistake: 'Confusing the ECS Task Execution Role with the ECS Task Role. Image pull permissions (`ecr:GetAuthorizationToken`, `ecr:BatchGetImage`) MUST be attached to the Task Execution Role.',
  example: 'ECS Task Definition Container Spec:\n{\n  "name": "web-app",\n  "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/web-app:v1.0.0",\n  "essential": true\n}',
  sources: [
    { title: 'Using Amazon ECR images with Amazon ECS', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html' }
  ]
});
