import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-2",
  "title": "Fargate with Amazon ECS",
  "plainEnglish": "Amazon Elastic Container Service (ECS) with AWS Fargate combines Amazon's native container orchestration service with serverless compute. In this architecture, Amazon ECS manages the overall application lifecycle—such as task scheduling, service discovery, rolling deployments, and health checks—while AWS Fargate runs the container tasks on serverless infrastructure without needing EC2 container instances.",
  "whyItMatters": "Running ECS on EC2 requires managing both the container orchestration layer and an Auto Scaling group of EC2 worker nodes. Pairing ECS with Fargate streamlines the architecture into a fully managed container service where developers define task definitions and services, and AWS provisions the exact compute resources on demand.",
  "workplaceExample": "An enterprise e-commerce platform migrates its containerized product catalog API to Amazon ECS with Fargate. The ECS service manages 20 running tasks distributed across three Availability Zones. During flash sales, ECS scales the task count to 80, and Fargate instantly spins up the extra container tasks without requiring any pre-warmed EC2 instances in the cluster.",
  "examFocus": "Understand how ECS and Fargate interact: The ECS task definition must specify 'requiresCompatibilities: [\"FARGATE\"]' and 'networkMode: \"awsvpc\"'. When creating an ECS service or running a standalone task, select the FARGATE or FARGATE_SPOT capacity provider or launch type.",
  "keyPoints": [
    "Amazon ECS acts as the orchestrator, while AWS Fargate provides the serverless compute execution environment.",
    "Eliminates the need to create, configure, patch, or scale Amazon ECS EC2 container instances or capacity provider Auto Scaling groups.",
    "All ECS tasks running on Fargate must use the 'awsvpc' network mode, giving every task its own Elastic Network Interface (ENI).",
    "Supports both long-running ECS Services (with Application Load Balancer integration and Service Auto Scaling) and one-off standalone ECS Tasks (for batch processing).",
    "Allows configuring Fargate Platform Versions (e.g., LATEST, 1.4.0) to control the underlying runtime environment and Linux kernel features.",
    "Enables interactive troubleshooting and debugging into running containers using Amazon ECS Exec without opening SSH ports."
  ],
  "commonMistake": "Attempting to use the 'bridge', 'host', or 'none' network modes with ECS on Fargate. Fargate strictly requires the 'awsvpc' network mode, meaning each container task obtains an IP address directly from the VPC subnet.",
  "example": "Create an ECS service using the AWS CLI: aws ecs create-service --cluster production-cluster --service-name web-api --task-definition web-api:3 --desired-count 4 --launch-type FARGATE --network-configuration 'awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-abcdef],assignPublicIp=ENABLED}'.",
  "sources": [
    {
      "title": "Amazon ECS on AWS Fargate",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"
    },
    {
      "title": "Creating an Amazon ECS Service Using Fargate",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-fargate.html"
    }
  ]
});
