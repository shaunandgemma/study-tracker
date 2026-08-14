import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-8",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "ECS on Fargate Recommendations",
  "status": "ready",
  "plainEnglish": "ECS on Fargate Recommendations in AWS Compute Optimizer analyze the historical CPU and memory utilization of your Amazon Elastic Container Service (Amazon ECS) services running on the AWS Fargate serverless launch type. Compute Optimizer evaluates task-level CPU and RAM allocations, identifying services where container definitions are over-provisioned (wasting money on idle capacity) or under-provisioned (risking container out-of-memory crashes or CPU throttling).",
  "whyItMatters": "Fargate pricing is strictly based on the vCPU and memory allocated to the task definition from the moment the task starts to when it stops. If a developer assigns 4 vCPUs and 8 GB RAM to a container task that only consumes 0.5 vCPU and 1 GB RAM, the company is overpaying by 400%. Compute Optimizer automates right-sizing container task definitions.",
  "workplaceExample": "A microservices application runs 100 ECS Fargate tasks with task definition `2 vCPU / 4 GB RAM`. Compute Optimizer monitors CloudWatch container metrics, discovers average utilization is 0.2 vCPU and 0.8 GB RAM, and recommends updating task definitions to `0.5 vCPU / 1 GB RAM`, reducing monthly Fargate hosting costs by 65%.",
  "examFocus": "For SAA-C03, know that Compute Optimizer evaluates ECS services running on AWS Fargate. It evaluates container CPU and memory utilization at the task level and recommends optimal task CPU and memory combinations supported by AWS Fargate specifications. It categorizes services as Under-provisioned, Over-provisioned, or Optimized.",
  "keyPoints": [
    "Analyzes CPU and memory utilization for Amazon ECS tasks running on AWS Fargate.",
    "Recommends valid Fargate task-level CPU and memory configuration pairings.",
    "Prevents Out-Of-Memory (OOM) task kills on under-provisioned container workloads.",
    "Eliminates wasted spend on oversized serverless container task definitions.",
    "Categorizes ECS services as Over-provisioned, Under-provisioned, or Optimized."
  ],
  "commonMistake": "Attempting to rightsize container CPU and memory directly on running ECS tasks. In ECS, task CPU and RAM are defined inside the ECS Task Definition; to apply recommendations, register a new task definition revision and update the ECS service.",
  "example": "# Get recommendations for ECS services on Fargate:\naws compute-optimizer get-ecs-service-recommendations \\\n  --service-arns arn:aws:ecs:us-east-1:123456789012:service/MyCluster/MyFargateService \\\n  --query 'ecsServiceRecommendations[0].recommendationOptions[*].[cpu,memory]'",
  "sources": [
    {
      "title": "Viewing ECS on Fargate Recommendations in AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ecs-fargate-recommendations.html"
    },
    {
      "title": "ECS Service Metrics Analyzed by AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/metrics-analyzed.html#ecs-metrics-analyzed"
    }
  ]
});
