import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-20",
  "title": "Fargate vs AWS Lambda",
  "plainEnglish": "AWS Fargate and AWS Lambda are both serverless compute services on AWS, but they target different architectural models. AWS Lambda is an event-driven Function-as-a-Service (FaaS) platform designed for short-lived, stateless executions (up to 15 minutes) triggered by AWS events. AWS Fargate is a serverless container execution engine (CaaS) designed for long-running services, complex multi-container architectures, custom network topologies, and applications packaged into Docker containers.",
  "whyItMatters": "Knowing when to choose Lambda versus Fargate prevents architectural mismatches. Lambda offers sub-second cold starts, automatic scaling down to zero, and zero charge when idle, making it ideal for event handlers and APIs. Fargate is optimal for long-running web servers, background workers running for hours or days, heavy legacy application migrations, and workloads requiring full control over container runtimes and networking.",
  "workplaceExample": "A retail application uses AWS Lambda behind API Gateway for short authentication and order-placement webhooks that execute in under 200 ms. For their backend inventory-sync service—which maintains persistent WebSocket connections and runs complex batch processing jobs lasting 45 minutes—they deploy container tasks on AWS Fargate.",
  "examFocus": "Compare Fargate vs. Lambda: Choose Lambda for event-driven functions, short runtimes (<= 15 minutes), rapid scaling down to zero, and simple triggers (S3, SQS, DynamoDB Streams). Choose Fargate for long-running services (> 15 minutes), persistent connections (WebSockets), complex containerized stacks, large temporary disk needs (up to 200 GiB), or specialized networking and CPU architectures.",
  "keyPoints": [
    "AWS Lambda executes short-lived, event-driven functions with a strict 15-minute maximum execution timeout.",
    "AWS Fargate runs long-running container tasks and services indefinitely with no runtime execution time limits.",
    "Lambda automatically scales to zero and incurs zero cost when not handling requests; Fargate tasks incur charges as long as they are in the RUNNING state.",
    "Lambda scales from 0 to thousands of concurrent executions in milliseconds; Fargate task scaling takes tens of seconds to launch new tasks.",
    "Fargate offers greater control over container runtime configurations, multi-container tasks, persistent EFS storage, and task networking via awsvpc.",
    "Both services are serverless compute models that eliminate host operating system and hardware management."
  ],
  "commonMistake": "Attempting to run long-running batch processes or persistent WebSocket servers on AWS Lambda, which will crash once the 15-minute execution hard limit is reached. Use AWS Fargate for long-running or persistent container processes.",
  "example": "Use Lambda for an S3 image-upload thumbnail generator triggered on s3:ObjectCreated:* (executing in 2 seconds), and use Fargate for an enterprise video-rendering container running for 40 minutes per job.",
  "sources": [
    {
      "title": "Serverless Compute Options on AWS",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/serverless-compute-options.html"
    },
    {
      "title": "AWS Fargate Serverless Containers",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"
    }
  ]
});
