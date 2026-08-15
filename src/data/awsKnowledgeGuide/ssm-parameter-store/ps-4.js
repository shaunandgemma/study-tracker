import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-4',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'Parameter Store Centralized Configuration Storage',
  status: 'ready',
  plainEnglish: 'AWS Systems Manager Parameter Store is a serverless, centralized configuration management service that allows engineers to store, organize, and retrieve operational configuration data and secrets (such as database connection URLs, feature flags, API keys, and license codes) securely within an AWS account and Region.',
  whyItMatters: 'Hardcoding configuration settings or database URLs inside application source code or deployment scripts creates security vulnerabilities and requires code recompilation every time a config setting changes. Parameter Store decouples application code from configuration settings.',
  workplaceExample: 'An engineering team stores application configuration values in Parameter Store under `/app/dev/db-host` and `/app/prod/db-host`. Microservices retrieve their respective environment database hostnames at runtime without altering code packages.',
  examFocus: 'SAA-C03 Core Parameter Store Features:\n- Centralized Storage: Decouples configuration parameters and secrets from application source code.\n- Supported Parameter Types: `String`, `StringList` (comma-separated strings), and `SecureString` (encrypted using AWS KMS).\n- Serverless Scaling: Fully managed, serverless, and integrates natively with IAM, EC2, Lambda, ECS, and CloudFormation.',
  keyPoints: [
    'Serverless capability of AWS Systems Manager for centralized configuration management.',
    'Decouples application configuration data and secrets from source code.',
    'Supports three data types: `String`, `StringList`, and `SecureString`.',
    'Integrates with IAM for fine-grained resource-level access control.',
    'Eliminates hardcoded configuration values across microservice deployment scripts.'
  ],
  commonMistake: 'Hardcoding database endpoints and environment configuration variables directly in Docker container images or Git repositories instead of referencing Parameter Store.',
  example: 'Creating a Centralized Parameter via AWS CLI:\naws ssm put-parameter --name "/study-tracker/dev/api/base-url" --value "https://dev-api.example.com" --type "String"',
  sources: [
    { title: 'AWS Systems Manager Parameter Store overview', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html' }
  ]
});
