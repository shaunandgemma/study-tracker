import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-36",
  "title": "Lambda with Secrets Manager and Parameter Store",
  "plainEnglish": "Integrating AWS Lambda with AWS Secrets Manager and AWS Systems Manager Parameter Store allows serverless functions to retrieve database passwords, API tokens, encryption keys, and application configurations securely at runtime without hardcoding sensitive values in code or environment variables. Using the AWS Parameters and Secrets Lambda Extension caches retrieved values locally in memory, dramatically reducing latency and API costs.",
  "whyItMatters": "Hardcoding credentials or exposing sensitive secrets in plaintext environment variables poses severe security and compliance risks. Secrets Manager provides automatic password rotation, granular IAM access policies, and encrypted storage. Parameter Store provides cost-effective hierarchical configuration management for non-secret operational parameters and secure strings.",
  "workplaceExample": "A database-writer Lambda function retrieves credentials for an Amazon Aurora MySQL database. Instead of making an HTTPS API call to Secrets Manager on every single invocation, the function uses the AWS Parameters and Secrets Lambda Extension with a 300-second cache TTL. When Aurora credentials are automatically rotated by Secrets Manager, the extension seamlessly retrieves the new password on the next cache expiration without redeploying code.",
  "examFocus": "Compare Secrets Manager vs Parameter Store for certification exams: (1) AWS Secrets Manager: Built specifically for confidential secrets (database credentials, API keys), supports automatic credential rotation with Lambda, costs $0.40/secret/month. (2) SSM Parameter Store: Built for general configuration and secrets (SecureString with KMS), hierarchical paths (/app/prod/db_url), free standard tier, does not natively rotate database credentials. (3) Use the AWS Parameters and Secrets Extension for in-memory caching.",
  "keyPoints": [
    "Stores sensitive credentials outside function code and environment variables to enforce security compliance.",
    "Secrets Manager supports automatic key/password rotation for Amazon RDS, Redshift, and DocumentDB.",
    "SSM Parameter Store provides hierarchical configuration management (Standard and Advanced parameter tiers).",
    "The AWS Parameters and Secrets Lambda Extension caches secrets in local execution environment memory, reducing API overhead.",
    "The Lambda execution role must be granted permissions: `secretsmanager:GetSecretValue` or `ssm:GetParameter`.",
    "Parameters and secrets encrypted with Customer Managed Keys require `kms:Decrypt` permissions on the associated KMS key."
  ],
  "commonMistake": "Calling the Secrets Manager API inside the function handler on every invocation without caching. This creates high API latency on every request and runs into Secrets Manager API rate throttling limits under heavy concurrency.",
  "example": "Fetch a cached secret via HTTP GET to the local Lambda Extension port inside function code: const response = await fetch('http://localhost:2773/secretsmanager/get?secretId=prod/aurora/credentials', { headers: { 'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN } }); const secret = await response.json();.",
  "sources": [
    {
      "title": "Retrieving Secrets in AWS Lambda Using the Extension",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets_lambda.html"
    },
    {
      "title": "Using the AWS Parameter and Secrets Lambda Extension",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/ps-integration-lambda-extensions.html"
    }
  ]
});
