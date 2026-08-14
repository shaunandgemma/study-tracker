import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-26',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR VPC Interface Endpoints',
  status: 'ready',
  plainEnglish: 'ECR VPC Interface Endpoints (powered by AWS PrivateLink) allow EC2 instances, ECS tasks, or EKS nodes located in private subnets without internet access (no Internet Gateway or NAT Gateway) to pull container images from Amazon ECR privately. To pull images over PrivateLink, you configure TWO interface endpoints in your VPC: `com.amazonaws.region.ecr.api` (for ECR API calls) and `com.amazonaws.region.ecr.dkr` (for Docker image layer downloads), plus a Gateway Endpoint for Amazon S3 (where image layers are stored).',
  whyItMatters: 'High-security environments mandate that private subnets have zero outbound internet connectivity. VPC Endpoints for ECR enable pulling container images entirely over the internal AWS network backbone.',
  workplaceExample: 'A financial institution deploys ECS Fargate tasks inside an isolated VPC subnet without NAT Gateways to satisfy regulatory compliance. They create the `ecr.api`, `ecr.dkr`, and `s3` VPC Endpoints, allowing Fargate tasks to pull container images securely over internal AWS network paths.',
  examFocus: 'SAA-C03 VPC Endpoints for ECR requirements:\n- Must create BOTH `com.amazonaws.region.ecr.api` AND `com.amazonaws.region.ecr.dkr` Interface Endpoints.\n- Must ALSO configure an Amazon S3 Gateway Endpoint (or S3 Interface Endpoint) because ECR stores image layers in S3.\n- Private DNS must be enabled on the interface endpoints.',
  keyPoints: [
    'Enables private container image pulls from ECR without internet gateways or NAT gateways.',
    'Powered by AWS PrivateLink (VPC Interface Endpoints).',
    'Requires TWO ECR interface endpoints: `ecr.api` (API calls) and `ecr.dkr` (image layers).',
    'Requires an Amazon S3 Gateway Endpoint for image layer retrieval.',
    'Essential for highly secure, isolated private subnet architectures.'
  ],
  commonMistake: 'Creating the `ecr.api` and `ecr.dkr` VPC Interface Endpoints but forgetting the S3 Gateway Endpoint. Container image pulls will hang or fail because ECR image layers are stored in Amazon S3.',
  example: 'VPC Endpoints required for ECR:\n1. `com.amazonaws.us-east-1.ecr.api` (Interface Endpoint)\n2. `com.amazonaws.us-east-1.ecr.dkr` (Interface Endpoint)\n3. `com.amazonaws.us-east-1.s3` (Gateway Endpoint).',
  sources: [
    { title: 'Amazon ECR VPC Interface Endpoints', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html' }
  ]
});
