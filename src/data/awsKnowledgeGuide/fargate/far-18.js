import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-18",
  "title": "Fargate VPC Endpoints for Private AWS Access",
  "plainEnglish": "AWS PrivateLink VPC Endpoints allow Amazon ECS tasks running on AWS Fargate in private subnets to securely connect to AWS services (such as Amazon ECR, Amazon S3, CloudWatch Logs, and AWS Secrets Manager) entirely within the private AWS network, without requiring an internet gateway or NAT gateway.",
  "whyItMatters": "Deploying NAT Gateways incurs ongoing hourly charges and data processing fees for every gigabyte of container image data pulled or log data transferred. Using VPC Endpoints reduces data transfer costs, significantly improves network transfer speed, and satisfies strict regulatory compliance by keeping all traffic strictly on AWS private infrastructure.",
  "workplaceExample": "An enterprise operating in an isolated, air-gapped private VPC requires Fargate tasks to have zero internet connectivity. They provision Interface VPC Endpoints for ECR (com.amazonaws.region.ecr.api and com.amazonaws.region.ecr.dkr), CloudWatch Logs (logs), Secrets Manager (secretsmanager), and a Gateway VPC Endpoint for Amazon S3 (where ECR stores container image layers). Fargate tasks bootstrap and run perfectly with no NAT Gateway.",
  "examFocus": "Know the exact VPC endpoints required for Fargate tasks to operate in private subnets with NO NAT Gateway: (1) Interface endpoints: `com.amazonaws.region.ecr.dkr`, `com.amazonaws.region.ecr.api`, `com.amazonaws.region.logs`, (2) Gateway endpoint: `com.amazonaws.region.s3` (for pulling actual ECR image layer blobs), and (3) `com.amazonaws.region.secretsmanager` or `ssm` if using secrets.",
  "keyPoints": [
    "Enables Fargate tasks in private subnets to communicate with AWS services without traversing the internet or requiring a NAT Gateway.",
    "Required Interface VPC Endpoints for basic Fargate startup: 'ecr.dkr' (Docker registry API), 'ecr.api' (ECR control API), and 'logs' (CloudWatch Logs).",
    "Requires an Amazon S3 Gateway VPC Endpoint because Amazon ECR hosts actual container image layer blobs in Amazon S3 buckets.",
    "Additional Interface Endpoints may be required for secretsmanager, ssm, kms, or dynamodb depending on task requirements.",
    "Security groups attached to Interface VPC Endpoints must allow inbound HTTPS (port 443) traffic from the Fargate tasks.",
    "Reduces operational costs and eliminates NAT Gateway data processing fees for large container image pulls and continuous log streaming."
  ],
  "commonMistake": "Creating the ECR Interface VPC Endpoints (ecr.api and ecr.dkr) but forgetting the S3 Gateway VPC Endpoint. When Fargate tries to pull the image layers, the pull fails and times out because the actual Docker layer tarballs are hosted in Amazon S3.",
  "example": "Create an Amazon S3 Gateway Endpoint attached to your VPC route table: aws ec2 create-vpc-endpoint --vpc-id vpc-01234567 --service-name com.amazonaws.us-east-1.s3 --route-table-ids rtb-private123.",
  "sources": [
    {
      "title": "Amazon ECS Interface VPC Endpoints (AWS PrivateLink)",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/vpc-endpoints.html"
    },
    {
      "title": "Amazon ECR Interface VPC Endpoints",
      "url": "https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html"
    }
  ]
});
