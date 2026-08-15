import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-7",
  "title": "Automatic Secret Rotation",
  "plainEnglish": "Automatic rotation periodically replaces a credential in both Secrets Manager and the system that accepts it. Depending on the supported integration, a managing service can provide managed rotation or Secrets Manager can invoke an AWS Lambda rotation function during a scheduled rotation window.",
  "whyItMatters": "Regularly changing credentials limits how long a stolen value may remain useful, but rotation is safe only when the protected service accepts the new credential and applications can retrieve it. Scheduling, monitoring, permissions, and recovery planning turn password generation into a complete operational process.",
  "workplaceExample": "A platform team schedules rotation for an application database credential after confirming the supported strategy. It monitors failed-rotation events, ensures the application requests AWSCURRENT rather than pinning a version ID, and keeps a tested rollback procedure for service incidents.",
  "examFocus": "Rotation is not merely creating a new secret version. The workflow must update the target service, test the pending credential, and promote it only after success. Managed rotation exists only for supported managed-secret integrations; other secrets commonly require Lambda rotation.",
  "keyPoints": [
    "A rotation schedule uses a rate or cron expression and a defined rotation window.",
    "Managed rotation is provided only by supported managing services and configurations.",
    "Lambda rotation must reach Secrets Manager and the protected database or service.",
    "The pending credential must be tested before it becomes AWSCURRENT.",
    "Applications should retrieve the current staged version so they can adopt a successful rotation.",
    "Networking, IAM, KMS, target-system permissions, or an incorrect secret structure can cause rotation failure."
  ],
  "commonMistake": "Generating a replacement password and marking the job successful before updating and testing the target system can lock out applications. Completion must mean the new value works at the protected service and is safely promoted.",
  "example": "Identify the test database, confirm its supported rotation method and JSON shape, grant a least-privilege rotation role, configure network access and a suitable schedule, observe the pending version, verify the target update and test step, then confirm applications retrieve the promoted current version.",
  "sources": [
    {
      "title": "Rotate AWS Secrets Manager secrets",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html"
    },
    {
      "title": "Rotation schedules",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_schedule.html"
    }
  ]
});
