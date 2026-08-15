import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-16",
  "title": "Fargate with Secrets Manager and Parameter Store",
  "plainEnglish": "Amazon ECS on AWS Fargate allows you to securely inject sensitive credentials—such as database passwords, API authentication tokens, and private encryption keys—directly into container environment variables using AWS Secrets Manager or AWS Systems Manager (SSM) Parameter Store. Instead of storing plaintext secrets in task definitions or container images, you specify secret ARNs, and Fargate retrieves and decrypts the values at container startup.",
  "whyItMatters": "Storing plaintext credentials inside source code repositories, Dockerfiles, or task definition parameters creates major compliance and security violations. Secret injection ensures credentials are encrypted at rest with AWS KMS, centrally rotated, and only exposed in memory to the authorized container instance at runtime.",
  "workplaceExample": "A payment gateway microservice runs on Fargate. Its database password is stored in AWS Secrets Manager with 30-day automated rotation. In the ECS task definition, the team references the secret ARN under the container's secrets array as DB_PASSWORD. When Fargate launches the container, the Fargate agent retrieves the decrypted password and exposes it as the environment variable $DB_PASSWORD.",
  "examFocus": "Understand the requirements for secret injection on Fargate: (1) In the task definition container definition, use the 'secrets' array (not 'environment'), with 'name' (environment variable name) and 'valueFrom' (the secret or SSM parameter ARN). (2) The Task Execution Role (`executionRoleArn`) MUST have permissions for 'secretsmanager:GetSecretValue' or 'ssm:GetParameters', plus 'kms:Decrypt' if using a customer-managed KMS key.",
  "keyPoints": [
    "Injects sensitive data as container environment variables or log configuration parameters at runtime.",
    "Supports both AWS Secrets Manager secrets and AWS Systems Manager Parameter Store SecureString parameters.",
    "Eliminates hardcoded credentials and plaintext secrets from task definition files, Dockerfiles, and source control.",
    "The Task Execution Role (`executionRoleArn`) performs the secret retrieval during container bootstrapping.",
    "Requires 'kms:Decrypt' permission on the Task Execution Role if the secret is encrypted with a customer-managed AWS KMS key.",
    "Supports referencing specific JSON keys within a secret string using the format 'arn:aws:secretsmanager:...:secret:mysecret:json-key::'."
  ],
  "commonMistake": "Putting sensitive tokens in the 'environment' block instead of the 'secrets' block in the task definition. Values in the 'environment' block are stored in unencrypted plaintext and are visible to anyone with ecs:DescribeTaskDefinition permissions.",
  "example": "Inject a database password and API key into an ECS container via task definition JSON: \"secrets\": [{\"name\": \"DATABASE_PASS\", \"valueFrom\": \"arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/db-pass\"}, {\"name\": \"API_KEY\", \"valueFrom\": \"arn:aws:ssm:us-east-1:123456789012:parameter/prod/stripe_key\"}].",
  "sources": [
    {
      "title": "Specifying Sensitive Data Using Secrets in Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html"
    },
    {
      "title": "Pass Parameters to Amazon ECS Tasks Using Secrets Manager and Parameter Store",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html"
    }
  ]
});
