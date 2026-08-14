import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-5',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'Amazon ECR Managed Container Registry',
  status: 'ready',
  plainEnglish: 'Amazon ECR (Elastic Container Registry) is a fully managed AWS container image registry service that makes it easy for developers to store, manage, share, and deploy Docker container images, OCI (Open Container Initiative) artifacts, and Helm charts. ECR is highly available, scalable, and redundant, backing image layers in Amazon S3 for 99.999999999% (11 9s) durability.',
  whyItMatters: 'Managing self-hosted container registries (like self-hosted Docker Registry or Harbor on EC2) requires managing storage disks, patching web servers, configuring SSL certificates, and scaling infrastructure. ECR is completely serverless and managed by AWS.',
  workplaceExample: 'A software company migrates from a self-hosted Nexus server to Amazon ECR. They eliminate all registry maintenance tasks and seamlessly integrate ECR with their ECS clusters and IAM policies.',
  examFocus: 'SAA-C03 core features of ECR:\n- Fully managed, highly available, and durable (image layers stored in Amazon S3).\n- Supports Docker images, OCI artifacts, and Helm charts.\n- Native integration with IAM, ECS, EKS, AWS Lambda, App Runner, and CodeBuild.\n- Integrated vulnerability scanning and lifecycle management policies.',
  keyPoints: [
    'Fully managed container image registry supporting Docker and OCI artifacts.',
    'High durability (image layers backed by Amazon S3).',
    'Eliminates operational overhead of running self-hosted container registries.',
    'Native IAM authentication and fine-grained access control.',
    'Supports Helm chart repositories for Kubernetes deployments.'
  ],
  commonMistake: 'Hosting a custom Docker Registry on an EC2 instance with attached EBS storage instead of using Amazon ECR, introducing unnecessary management overhead and single-point-of-failure risks.',
  example: 'Standard ECR Workflow:\n`aws ecr get-login-password | docker login` -> `docker build` -> `docker tag` -> `docker push` -> `ECS / EKS deploy`.',
  sources: [
    { title: 'What is Amazon ECR?', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html' }
  ]
});
