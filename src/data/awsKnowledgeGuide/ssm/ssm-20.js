import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-20",
  "title": "Systems Manager Parameter Store Integration",
  "plainEnglish": "AWS Systems Manager Parameter Store is a secure, scalable, centralized configuration management and secrets storage service that allows you to store, manage, and retrieve application configuration data, database connection strings, API URLs, license codes, and passwords. Parameter Store supports three data types: plain text `String`, comma-separated `StringList`, and cryptographically encrypted `SecureString` (which automatically encrypts sensitive payloads using AWS Key Management Service keys).",
  "whyItMatters": "Hardcoding configuration parameters and passwords into source code, container images, or application files leads to security leaks, credential exposure, and painful redeployments whenever a setting changes. Parameter Store decouples configuration and secrets from application code, allowing microservices, Lambda functions, ECS tasks, and CI/CD pipelines to fetch the latest values dynamically at runtime.",
  "workplaceExample": "A microservices application running on Amazon ECS needs to connect to an Amazon Aurora database. Instead of storing the database password in the Dockerfile or environment variables, the DevOps team stores the password in Parameter Store as a `SecureString` under the hierarchical path `/prod/ecommerce/db/password` encrypted with an AWS KMS Customer Managed Key. The ECS task definition references the parameter ARN, allowing ECS to inject the decrypted password into the container securely at launch.",
  "examFocus": "Understand Parameter Store types, hierarchies, and integrations: (1) Parameter Types: `String` (plain text), `StringList` (comma-separated list), and `SecureString` (encrypted with AWS KMS at rest). (2) Hierarchical Namespaces: Organize parameters using path hierarchies (e.g., `/app/environment/service/key`) and fetch all parameters under a prefix using `GetParametersByPath`. (3) Tiers: Standard Tier (free of charge, max 10,000 parameters per region, 4 KB size limit) vs Advanced Tier (supports up to 100,000 parameters, 8 KB size limit, parameter policies, small monthly cost). (4) Secrets Manager vs Parameter Store: Parameter Store is lower cost and handles general config + basic secrets; Secrets Manager is dedicated to secrets with automated rotation and cross-account replica features.",
  "keyPoints": [
    "Centralized configuration and secret management service integrated across AWS.",
    "Supports three parameter types: `String`, `StringList`, and KMS-encrypted `SecureString`.",
    "Uses hierarchical tree-structured namespaces (e.g., `/dev/payments/api_url`).",
    "Standard Tier provides free storage for up to 10,000 parameters (4 KB max size).",
    "Advanced Tier supports up to 100,000 parameters (8 KB max size) and parameter policies.",
    "Integrates natively with AWS CloudFormation, AWS Lambda, Amazon ECS, and EC2 user data."
  ],
  "commonMistake": "Attempting to retrieve a `SecureString` parameter using the AWS CLI or SDK without passing the `--with-decryption` flag. Without `--with-decryption`, Parameter Store returns the encrypted ciphertext string rather than the decrypted plaintext secret.",
  "example": "Create a SecureString parameter encrypted with AWS KMS using the AWS CLI: aws ssm put-parameter --name '/production/ecommerce/stripe-api-key' --value 'sk_live_1234567890abcdef' --type SecureString --key-id 'arn:aws:kms:us-east-1:123456789012:key/my-app-key' --overwrite.",
  "sources": [
    {
      "title": "AWS Systems Manager Parameter Store User Guide",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html"
    },
    {
      "title": "Working with Standard and Advanced Parameters in Parameter Store",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html"
    }
  ]
});
