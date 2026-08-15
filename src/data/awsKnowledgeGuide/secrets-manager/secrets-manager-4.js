import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-4",
  "title": "Secrets Manager Secret Storage",
  "plainEnglish": "AWS Secrets Manager stores protected values such as passwords, tokens, and keys as secrets. A secret includes metadata—such as its name, Amazon Resource Name (ARN), tags, encryption key, and rotation settings—and one or more encrypted value versions. The value can be text or binary; related text fields are commonly stored as a JSON object.",
  "whyItMatters": "Separating sensitive values from application code reduces accidental exposure in repositories, images, and configuration files. Stable secret metadata also gives operators one managed resource on which to apply permissions, encryption, auditing, rotation, and lifecycle controls.",
  "workplaceExample": "A payments service stores a vendor token under a descriptive production path and tags the secret with its owning team. The application role retrieves the current version at runtime, while developers can view metadata but cannot read the value.",
  "examFocus": "Know that the secret value is encrypted but metadata such as the name, description, tags, and rotation configuration is not secret-value storage. Secrets Manager manages secrets; IAM roles remain the preferred source of temporary AWS credentials for workloads.",
  "keyPoints": [
    "A secret consists of metadata plus one or more secret-value versions.",
    "A secret value can be a string or binary data.",
    "JSON key-value text is useful when an integration expects related fields such as username and host.",
    "Secret names and tags must not contain sensitive information because they are metadata.",
    "The secret ARN includes a generated suffix that helps distinguish recreated secrets with the same name.",
    "Applications normally retrieve the version carrying the AWSCURRENT staging label."
  ],
  "commonMistake": "Do not put a password into the secret name, description, or tags. Those fields are metadata; keep sensitive material only in the encrypted secret value and ensure logs and documentation never print it.",
  "example": "Create a harmless test secret with non-sensitive placeholder JSON field names, select the required encryption key, tag only ownership metadata, grant a test workload role access to the named ARN, retrieve it without logging the returned value, and use an approved recovery-window cleanup afterward.",
  "sources": [
    {
      "title": "What's in a Secrets Manager secret?",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/whats-in-a-secret.html"
    },
    {
      "title": "Create an AWS Secrets Manager secret",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html"
    }
  ]
});
