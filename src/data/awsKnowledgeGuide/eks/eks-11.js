import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-11",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Fargate Profiles",
  "status": "ready",
  "plainEnglish": "An Amazon EKS Fargate Profile is a configuration rule that tells your Amazon EKS cluster which Kubernetes Pods should be scheduled on AWS Fargate instead of EC2 worker nodes. A Fargate profile specifies: (1) Selectors (matching specific Kubernetes namespaces and optional label key-value pairs), (2) Private VPC subnets where the Fargate micro-VMs should launch, and (3) A Pod Execution IAM Role that grants Fargate permissions to pull container images from Amazon ECR and write logs to CloudWatch.",
  "whyItMatters": "Fargate Profiles allow a single EKS cluster to run a hybrid compute fleet: steady-state workloads can run on EC2 Managed Node Groups while security-sensitive, developer sandbox, or batch workloads are automatically routed to serverless Fargate based on namespace or label selectors.",
  "workplaceExample": "A company creates an EKS Fargate Profile targeting the namespace `analytics-jobs`. Whenever a data engineer deploys a job manifest into `analytics-jobs`, the EKS mutating webhook matches the Fargate Profile and automatically schedules the pod onto Fargate serverless infrastructure without needing to modify the deployment YAML.",
  "examFocus": "For SAA-C03, understand Fargate Profile routing logic: (1) Selectors match on Namespace and optional Labels. (2) Subnet requirement: Fargate pods MUST be placed in PRIVATE subnets (subnets without a direct 0.0.0.0/0 route to an Internet Gateway). (3) Pod Execution Role: Grants Fargate runtime permissions to pull images and stream logs.",
  "keyPoints": [
    "Defines criteria for routing specific Kubernetes pods to AWS Fargate.",
    "Selectors match on Kubernetes namespace and optional pod labels.",
    "Must specify private subnets for launching Fargate micro-VMs.",
    "Requires a Fargate Pod Execution IAM Role (with `AmazonEKSFargatePodExecutionRolePolicy`).",
    "Enables hybrid clusters running both EC2 node groups and serverless Fargate pods."
  ],
  "commonMistake": "Specifying public subnets in an EKS Fargate Profile. AWS Fargate does not support assigning public IP addresses to pods; Fargate profiles must use private subnets with a NAT Gateway or VPC Endpoints for egress.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: EKS Fargate Profile.\nResources:\n  AppFargateProfile:\n    Type: AWS::EKS::FargateProfile\n    Properties:\n      ClusterName: production-cluster\n      FargateProfileName: ServerlessProfile\n      PodExecutionRoleArn: !GetAtt FargatePodExecutionRole.Arn\n      Subnets:\n        - subnet-priv1\n        - subnet-priv2\n      Selectors:\n        - Namespace: serverless-apps",
  "sources": [
    {
      "title": "AWS Fargate Profiles in Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html"
    },
    {
      "title": "Amazon EKS Pod Execution IAM Role",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html"
    }
  ]
});
