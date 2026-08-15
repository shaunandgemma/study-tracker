import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-43",
  "title": "Lambda vs Fargate",
  "plainEnglish": "AWS Lambda and AWS Fargate are both serverless compute engines on AWS, but they target different application workloads. AWS Lambda is an event-driven function-as-a-service (FaaS) platform designed for short-lived, stateless, bursty tasks that complete within 15 minutes. AWS Fargate is a serverless container engine for Amazon ECS and Amazon EKS designed for long-running containerized applications, microservice fleets, and complex multi-container batch jobs with no execution time limits.",
  "whyItMatters": "Understanding the boundary between Lambda and Fargate allows architects to build modern cloud-native architectures that balance deployment speed, runtime flexibility, and cost. Lambda is optimal for lightweight event triggers and REST API endpoints. Fargate is optimal for migrating Docker container applications, running persistent background workers, hosting continuous WebSocket servers, or executing multi-hour computational jobs.",
  "workplaceExample": "An enterprise e-commerce platform uses both services synergistically: AWS Lambda powers the event-driven serverless payment webhook listeners and image thumbnail generators that execute in under 2 seconds. Concurrently, AWS Fargate hosts the core containerized Spring Boot shopping cart service, which maintains long-lived TCP connection pools to relational databases and handles continuous 24/7 web traffic without runtime limits.",
  "examFocus": "Compare Lambda vs Fargate for AWS certification exams: (1) Execution Duration: Lambda = Max 15 minutes (900s); Fargate = Unlimited continuous runtime. (2) Resource Capacity: Lambda = Up to 10 GB RAM and 6 vCPUs; Fargate = Up to 120 GB RAM and 16 vCPUs per task. (3) Trigger Model: Lambda = Event-driven invocations (S3, SQS, API Gateway); Fargate = Managed container tasks/services running on ECS/EKS. (4) Startup Time: Lambda = Sub-second to 2s; Fargate = 30-90s to pull image and launch task.",
  "keyPoints": [
    "AWS Lambda is a serverless Function-as-a-Service (FaaS) engine for short-lived, event-driven tasks.",
    "AWS Fargate is a serverless Container-as-a-Service (CaaS) engine for ECS and EKS container tasks.",
    "Lambda execution timeout is capped at 15 minutes; Fargate tasks can run continuously without time limits.",
    "Lambda scales from zero within milliseconds; Fargate task scaling takes 30 to 90 seconds to pull container images.",
    "Fargate supports higher resource limits (up to 16 vCPUs and 120 GB RAM per task) compared to Lambda (6 vCPUs, 10 GB RAM).",
    "Choose Lambda for event-driven scripts and APIs; choose Fargate for long-running microservices and containerized applications."
  ],
  "commonMistake": "Choosing AWS Lambda for a task that requires 30 minutes to process or runs a continuous WebSocket server. Lambda forcefully terminates at 15 minutes; any task requiring over 15 minutes or persistent socket connections should be deployed on AWS Fargate.",
  "example": "Use AWS Lambda for resizing images uploaded to Amazon S3 within 500 milliseconds; use AWS Fargate to run a 45-minute continuous video transcoding Docker container managed by Amazon ECS.",
  "sources": [
    {
      "title": "AWS Fargate - Serverless Compute for Containers",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"
    },
    {
      "title": "Choosing Between AWS Lambda and AWS Fargate",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/serverless-architectures-lambda/serverless-architectures-lambda.html"
    }
  ]
});
