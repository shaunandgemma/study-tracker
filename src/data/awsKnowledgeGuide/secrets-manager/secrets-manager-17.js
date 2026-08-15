import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-17",
  "title": "Secrets Manager vs Systems Manager Parameter Store",
  "plainEnglish": "Secrets Manager is purpose-built for secret values such as database credentials and API keys, including supported automatic rotation. AWS Systems Manager Parameter Store organizes configuration values in hierarchies and can encrypt sensitive SecureString parameters, but it does not provide the same automatic secret-rotation service.",
  "whyItMatters": "Choosing by lifecycle needs avoids building custom rotation around a configuration store or paying for secret-management features a simple setting does not need. Security, integration, scale, audit, sharing, and current pricing requirements should all be checked rather than relying on one rule for every value.",
  "workplaceExample": "A web platform keeps its log level and service endpoint in Parameter Store because they are configuration. It stores the payment database credential in Secrets Manager because the credential needs protected retrieval, audited lifecycle management, and supported rotation.",
  "examFocus": "Choose Secrets Manager for protected credentials and automatic rotation requirements; choose Parameter Store for hierarchical configuration and SecureString values when its capabilities meet the design. Choose IAM roles—not either value store—for temporary AWS service credentials, and choose KMS for cryptographic key management.",
  "keyPoints": [
    "Secrets Manager is purpose-built for managing secret values throughout their lifecycle.",
    "Parameter Store supports String, StringList, and encrypted SecureString parameters.",
    "Parameter Store provides hierarchical names that are useful for organized application configuration.",
    "Parameter Store does not provide the Secrets Manager automatic rotation service for stored values.",
    "Parameter Store can reference a Secrets Manager secret for integrations that use the Parameter Store interface.",
    "Neither service replaces IAM roles for workloads that need temporary AWS credentials."
  ],
  "commonMistake": "Do not select a service only because one storage option appears cheaper. Define whether the value is configuration or a credential, then evaluate rotation, access patterns, audit, quotas, integration, cross-account, and current cost requirements.",
  "example": "Classify a harmless test set into an endpoint URL, feature-independent runtime setting, and database credential; place configuration in appropriately protected Parameter Store parameters, place the rotatable credential in Secrets Manager, grant separate least-privilege read roles, and verify neither value is written to deployment logs.",
  "sources": [
    {
      "title": "Use Secrets Manager secrets in Parameter Store",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_parameterstore.html"
    },
    {
      "title": "Parameter Store reference",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-a-parameter.html"
    }
  ]
});
