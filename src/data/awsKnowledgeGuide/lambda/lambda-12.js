import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-12",
  "title": "Lambda Environment Variables",
  "plainEnglish": "Lambda Environment Variables are key-value pairs that you define in your function configuration to pass operational settings, feature flags, API endpoints, and database connection URLs dynamically into your code without modifying or re-deploying the function's code package.",
  "whyItMatters": "Hardcoding configuration parameters (such as S3 bucket names, API endpoints, or environment stages) inside code files makes deployments inflexible and creates code duplication across dev, test, and production stages. Environment variables allow the exact same compiled code package to run across multiple environments simply by updating configuration values.",
  "workplaceExample": "A backend team deploys a single microservice ZIP package to three distinct stages: Development, Staging, and Production. Each function defines an environment variable `STAGE_NAME` ('dev', 'stage', 'prod') and `DYNAMODB_TABLE_NAME` ('orders-dev', 'orders-stage', 'orders-prod'), allowing the same code to point to the correct database table automatically.",
  "examFocus": "Understand environment variable limits and encryption: (1) Total size of all environment variables cannot exceed 4 KB per function. (2) Encrypted at rest by default using an AWS-managed KMS key (or a customer-managed KMS key for compliance). (3) Environment variables are accessible in code via standard language runtime APIs (e.g., `process.env.VAR_NAME` in Node.js, `os.environ['VAR_NAME']` in Python).",
  "keyPoints": [
    "Stores dynamic key-value configuration parameters alongside function settings.",
    "Total combined size of all environment variables cannot exceed 4 KB per function.",
    "Encrypted at rest using AWS KMS (AWS-managed default key or Customer Managed Key CMK).",
    "Accessible standardly inside function code through language runtime environment APIs.",
    "Changes to environment variables on `$LATEST` take effect immediately without requiring code re-uploads.",
    "Published versions freeze their environment variable values immutably upon publication."
  ],
  "commonMistake": "Storing sensitive plaintext database passwords or master API keys directly in environment variables. Sensitive secrets should be stored in AWS Secrets Manager or Systems Manager Parameter Store and retrieved securely at runtime.",
  "example": "Configure environment variables using the AWS CLI: aws lambda update-function-configuration --function-name order-service --environment 'Variables={STAGE=production,MAX_RETRIES=3,REGION=us-east-1}'.",
  "sources": [
    {
      "title": "Using AWS Lambda Environment Variables",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html"
    },
    {
      "title": "Securing Lambda Environment Variables with AWS KMS",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars-encryption.html"
    }
  ]
});
