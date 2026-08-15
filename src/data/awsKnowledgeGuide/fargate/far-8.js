import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-8",
  "title": "Fargate IAM Task Role",
  "plainEnglish": "The IAM Task Role is an AWS Identity and Access Management (IAM) role that provides permissions directly to the application code executing inside your Fargate containers. When your application code calls AWS services (such as reading an Amazon S3 bucket, querying an Amazon DynamoDB table, or publishing to Amazon SQS), the AWS SDK inside the container automatically fetches temporary security credentials from this role.",
  "whyItMatters": "Hardcoding AWS access keys or secrets into Docker images or passing credentials via environment variables creates severe security vulnerabilities. The IAM Task Role allows developers to follow the principle of least privilege, assigning specific, scoped AWS permissions to individual microservices with automatic credential rotation.",
  "workplaceExample": "An order-processing container running on Fargate needs to put messages onto an Amazon SQS queue and write order records into an Amazon DynamoDB table. The team attaches a task role granting only sqs:SendMessage and dynamodb:PutItem permissions to the task definition, ensuring the application cannot access unauthorized resources like S3 or RDS.",
  "examFocus": "Critically distinguish the Task Role from the Task Execution Role: The Task Role (`taskRoleArn`) is used by your application code INSIDE the container to make AWS API calls. The Task Execution Role (`executionRoleArn`) is used by the ECS/Fargate agent to launch and configure the container (pulling images, shipping logs, fetching secrets).",
  "keyPoints": [
    "The Task Role provides AWS credentials directly to application code running inside the container via the container credential provider.",
    "Eliminates the need to store long-term AWS access keys or API tokens inside Docker container images or environment variables.",
    "Configured in the ECS task definition using the 'taskRoleArn' top-level parameter.",
    "Must include a trust policy allowing the 'ecs-tasks.amazonaws.com' service principal to assume the role.",
    "Allows fine-grained, per-microservice least privilege access; different tasks in the same ECS cluster can assume different task roles.",
    "Temporary credentials are automatically provided to the AWS SDK via the local link-local metadata endpoint (169.254.170.2)."
  ],
  "commonMistake": "Attaching data access permissions (such as Amazon S3 or DynamoDB read/write policies) to the Task Execution Role instead of the Task Role. The application container cannot use the Task Execution Role to call AWS APIs.",
  "example": "Configure taskRoleArn in an ECS task definition JSON: {\"family\": \"order-service\", \"taskRoleArn\": \"arn:aws:iam::123456789012:role/OrderServiceAppRole\", \"requiresCompatibilities\": [\"FARGATE\"], \"containerDefinitions\": [...]}.",
  "sources": [
    {
      "title": "Amazon ECS Task IAM Role",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html"
    },
    {
      "title": "IAM Policies for Amazon ECS Tasks",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html"
    }
  ]
});
