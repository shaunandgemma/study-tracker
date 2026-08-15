import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-5",
  "title": "Database Credentials and API Keys",
  "plainEnglish": "Database logins and third-party API keys are long-lived credentials that applications may need but must not hard-code. Secrets Manager can protect these values and return them through an AWS Software Development Kit (SDK) call. Database rotation integrations often require a documented, case-sensitive JSON structure; an arbitrary API key can use a simpler text or JSON layout.",
  "whyItMatters": "Central retrieval makes it possible to remove credentials from source code, limit which workload can read each value, audit access, and rotate supported credentials. A predictable JSON contract also prevents an application or rotation function from reading the wrong field.",
  "workplaceExample": "An order-processing task uses its task role to fetch a database credential secret and a separate shipping-provider token. It parses only the required fields, keeps the values in memory, never writes them to diagnostics, and refreshes its cache after rotation.",
  "examFocus": "Choose Secrets Manager for protected application secrets and supported rotation. Do not store AWS access keys merely because Secrets Manager can hold text; use an IAM role and temporary credentials for AWS service authentication whenever practical.",
  "keyPoints": [
    "Database secrets commonly contain structured connection fields such as engine, host, username, and password.",
    "AWS-provided rotation templates require the exact JSON keys documented for the database type.",
    "API keys and OAuth tokens can be stored as text or as intentionally designed JSON.",
    "The workload needs secretsmanager:GetSecretValue for the specific secret it reads.",
    "A customer-managed KMS key can require separate decrypt authorization.",
    "Client-side caching can reduce retrieval latency and API cost, but cache refresh must account for rotation."
  ],
  "commonMistake": "Never copy a retrieved credential into an environment dump, exception message, test fixture, or command history. Redaction after logging is too late because the sensitive value has already left its intended boundary.",
  "example": "Define an agreed JSON schema for a test database secret, grant one workload role GetSecretValue on only that ARN, retrieve it through the SDK, validate expected field names without printing values, test a denied role, and inspect CloudTrail for the supported API activity.",
  "sources": [
    {
      "title": "JSON structure of AWS Secrets Manager secrets",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_secret_json_structure.html"
    },
    {
      "title": "AWS Secrets Manager best practices",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html"
    }
  ]
});
