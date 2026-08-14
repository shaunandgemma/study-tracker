import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-29",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS with Amazon ECR",
  "status": "ready",
  "plainEnglish": "Amazon EKS with Amazon Elastic Container Registry (Amazon ECR) is the integration that allows your Kubernetes cluster to securely store, pull, and deploy private Docker and OCI-compliant container images. By granting worker nodes (or Fargate pod execution roles) IAM permissions to Amazon ECR via the `AmazonEC2ContainerRegistryReadOnly` managed policy, `kubelet` automatically authenticates with your private ECR registries to pull container images without requiring manually configured Kubernetes `imagePullSecrets`.",
  "whyItMatters": "Managing static Docker registry credentials (such as username/password tokens) in Kubernetes secrets is a security hazard because ECR authorization tokens expire every 12 hours. The native EKS-to-ECR IAM integration provides seamless, automated IAM authentication with zero credential management.",
  "workplaceExample": "A CI/CD pipeline builds a new microservice container image, scans it for vulnerabilities in Amazon ECR, and pushes the image tagged `v2.4.0` to `123456789012.dkr.ecr.us-east-1.amazonaws.com/api-service`. The Kubernetes Deployment on EKS updates its image path; worker nodes pull the private image instantly via IAM without manual token refreshes.",
  "examFocus": "For SAA-C03, understand EKS and ECR connectivity: (1) EC2 worker node IAM instance profile requires `AmazonEC2ContainerRegistryReadOnly` (or custom IAM policy granting `ecr:GetDownloadUrlForLayer`, `ecr:BatchGetImage`, and `ecr:GetAuthorizationToken`). (2) For private VPC subnets, create VPC Endpoints for ECR (`com.amazonaws.<region>.ecr.api` and `com.amazonaws.<region>.ecr.dkr` interface endpoints, plus S3 gateway endpoint for layer storage).",
  "keyPoints": [
    "Securely stores and pulls private container images for Amazon EKS clusters.",
    "Eliminates manual `imagePullSecrets` by using IAM roles for ECR authentication.",
    "Requires `AmazonEC2ContainerRegistryReadOnly` policy on worker node IAM roles.",
    "Fargate pods authenticate to ECR using the Fargate Pod Execution IAM Role.",
    "Private clusters pull images without internet access via ECR VPC Endpoints + S3 Gateway Endpoint."
  ],
  "commonMistake": "Creating ECR interface VPC endpoints in a private cluster but forgetting the Amazon S3 Gateway Endpoint. ECR stores its underlying image layers in Amazon S3; without an S3 Gateway Endpoint or internet access, image pulls will time out.",
  "example": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: payment-service\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n        - name: payment-api\n          image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/payment-service:v1.2.0\n          ports:\n            - containerPort: 8080",
  "sources": [
    {
      "title": "Using Amazon ECR Images with Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/private-clusters.html"
    },
    {
      "title": "Amazon ECR Interface VPC Endpoints",
      "url": "https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html"
    }
  ]
});
