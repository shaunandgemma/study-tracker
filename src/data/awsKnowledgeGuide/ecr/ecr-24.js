import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-24',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR with Amazon EKS',
  status: 'ready',
  plainEnglish: 'Amazon ECR integrates with Amazon EKS (Elastic Kubernetes Service) to store and serve container images deployed to Kubernetes Pods. When a Kubernetes Deployment manifests an image URI pointing to ECR (e.g. `123456789012.dkr.ecr.us-east-1.amazonaws.com/my-pod:v1`), the kubelet daemon on the EKS worker node authenticates with ECR using IAM Service Accounts (IRSA) or Node IAM Roles to pull the container image.',
  whyItMatters: 'Running Kubernetes in enterprise AWS environments requires secure, high-throughput container image delivery. ECR provides native IAM authentication for EKS worker nodes without storing Kubernetes `imagePullSecrets` in plain-text secrets.',
  workplaceExample: 'A Kubernetes platform team deploys a microservice to EKS using Helm. The deployment manifest specifies `image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/auth-service:v3.2`. EKS node IAM roles authenticate seamlessly with ECR to pull the image layers.',
  examFocus: 'SAA-C03 EKS + ECR integration details:\n- EKS Worker Node IAM Role must include `AmazonEC2ContainerRegistryReadOnly` policy to pull images.\n- For cross-account ECR pulls in EKS, attach an ECR Repository Policy granting access to the EKS worker node IAM role ARN or account ID.\n- Can use AWS PrivateLink (VPC Interface Endpoints) so EKS nodes in private subnets pull ECR images without NAT Gateways or internet gateways.',
  keyPoints: [
    'Default managed container image repository for Amazon EKS Kubernetes clusters.',
    'Authenticated via EKS Node IAM Role or IAM Roles for Service Accounts (IRSA).',
    'Eliminates managing manual Kubernetes `imagePullSecrets` for private registries.',
    'Supports multi-architecture container images (ARM64 for Graviton EKS nodes).',
    'Supports PrivateLink for zero-internet private image pulling in EKS.'
  ],
  commonMistake: 'Forgetting to attach `AmazonEC2ContainerRegistryReadOnly` to the EKS Managed Node Group IAM Role, causing Kubernetes Pods to fail with `ErrImagePull` or `ImagePullBackOff`.',
  example: 'Kubernetes Deployment Pod Spec snippet:\n`spec:`\n`  containers:`\n`  - name: payment-api`\n`    image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/payment-api:v1.4.0`',
  sources: [
    { title: 'Using Amazon ECR with Amazon EKS', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html' }
  ]
});
