import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-9",
  "title": "Fargate Task Execution Role",
  "plainEnglish": "The Task Execution Role is an IAM role that grants permissions to the Amazon ECS and AWS Fargate infrastructure agents to perform lifecycle management tasks on your behalf. Before your container starts, the Fargate agent assumes this role to pull private container images from Amazon ECR, stream container logs to Amazon CloudWatch Logs, and retrieve sensitive environment variables from AWS Secrets Manager or AWS Systems Manager Parameter Store.",
  "whyItMatters": "Because Fargate runs containers on serverless infrastructure where you do not manage EC2 host instances (which would otherwise hold EC2 instance profile roles), the Fargate agent needs an explicit IAM role to authenticate against AWS services during task initialization and bootstrapping.",
  "workplaceExample": "A DevOps engineer configures a Fargate task that pulls a proprietary container image from a private Amazon ECR repository and needs to inject a database password from AWS Secrets Manager into the container's environment variables. They attach an execution role containing the AmazonECSTaskExecutionRolePolicy managed policy along with a custom secretsmanager:GetSecretValue policy.",
  "examFocus": "Remember that the Task Execution Role (`executionRoleArn`) is used by the ECS container agent for infrastructure tasks: (1) ecr:GetAuthorizationToken, ecr:BatchCheckLayerAvailability, ecr:GetDownloadUrlForLayer, ecr:BatchGetImage for image pulls, (2) logs:CreateLogStream and logs:PutLogEvents for CloudWatch logging, and (3) secretsmanager:GetSecretValue or ssm:GetParameters for sensitive environment variables.",
  "keyPoints": [
    "The Task Execution Role is used by the Fargate agent to manage container startup and logging tasks.",
    "Required for pulling container images from private Amazon Elastic Container Registry (ECR) repositories.",
    "Required for streaming container stdout/stderr logs to Amazon CloudWatch Logs via the awslogs log driver.",
    "Required when using the 'secrets' parameter in task definitions to inject secrets from AWS Secrets Manager or SSM Parameter Store.",
    "AWS provides the AWS-managed policy 'AmazonECSTaskExecutionRolePolicy' as a baseline for standard ECR pulls and CloudWatch logging.",
    "Must include a trust relationship policy that allows 'ecs-tasks.amazonaws.com' to assume the role."
  ],
  "commonMistake": "Forgetting to grant secretsmanager:GetSecretValue or ssm:GetParameters permissions to the Task Execution Role when referencing secrets in task definitions. If missing, the Fargate task will fail to transition to the RUNNING state and exit with a 'Fetching secret data failed' error.",
  "example": "Attach the executionRoleArn in an ECS task definition JSON: {\"family\": \"payment-service\", \"executionRoleArn\": \"arn:aws:iam::123456789012:role/ecsTaskExecutionRole\", \"containerDefinitions\": [{\"name\": \"app\", \"image\": \"123456789012.dkr.ecr.us-east-1.amazonaws.com/payment:v2\", \"secrets\": [{\"name\": \"DB_PASSWORD\", \"valueFrom\": \"arn:aws:secretsmanager:us-east-1:123456789012:secret:db_pass\"}]}]}.",
  "sources": [
    {
      "title": "Amazon ECS Task Execution IAM Role",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html"
    },
    {
      "title": "Specifying Sensitive Data Using Secrets in Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html"
    }
  ]
});
