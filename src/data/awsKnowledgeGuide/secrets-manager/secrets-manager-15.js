import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-15",
  "title": "Secrets Manager Integration with RDS",
  "plainEnglish": "Amazon Relational Database Service (Amazon RDS) can manage a supported database's master user password in Secrets Manager. RDS generates the password, stores it in a managed secret, and keeps the database credential synchronized when the managed secret rotates, so operators do not manually copy the password between services.",
  "whyItMatters": "Service-managed credentials reduce manual handling of a powerful database password and avoid a custom Lambda rotation function for supported master-user configurations. Applications still need a safe runtime retrieval design and should normally use a less-privileged database user rather than the master user.",
  "workplaceExample": "A team enables RDS management for a non-production database master credential and grants only a controlled administration workflow access to that secret. The application uses its own restricted database account stored separately, while the team monitors RDS-managed rotation and database availability.",
  "examFocus": "For supported RDS master credentials, choose service-managed Secrets Manager integration when the requirement is managed password generation and rotation without a Lambda function. For other database users or unsupported cases, Lambda rotation strategies and the documented JSON structure may apply.",
  "keyPoints": [
    "RDS can create and manage a Secrets Manager secret for supported master user credentials.",
    "Managed rotation updates both the secret version and the RDS database password.",
    "This managed rotation path does not require a customer-authored Lambda rotation function.",
    "The managed secret has an ARN that authorized workloads or administration tools can reference.",
    "Retrieval still requires Secrets Manager permission and applicable KMS authorization.",
    "Application database privileges should be least privilege even when the stored credential is well protected."
  ],
  "commonMistake": "Do not make every application retrieve the RDS master credential merely because RDS can manage it. Reserve master access for controlled administration and give normal workloads purpose-built database users with only the SQL privileges they require.",
  "example": "On an approved test RDS instance, enable RDS management of the master password, locate the resulting secret ARN without viewing or logging the value, validate the intended administrative role's retrieval permission, trigger rotation only through the documented RDS workflow, and confirm the database and current secret remain synchronized.",
  "sources": [
    {
      "title": "Password management with Amazon RDS and AWS Secrets Manager",
      "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html"
    },
    {
      "title": "Managed rotation for AWS Secrets Manager secrets",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_managed.html"
    }
  ]
});
