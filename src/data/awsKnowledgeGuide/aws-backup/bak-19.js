import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-19",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Backup Restore Testing",
  "status": "ready",
  "plainEnglish": "AWS Backup Restore Testing is an automated feature that regularly tests whether your recovery points can be successfully restored into working AWS resources. You define a Restore Testing Plan that runs on a schedule (e.g., weekly or monthly), automatically selects a recovery point, triggers a test restore job in an isolated sandbox environment, verifies the restoration result, and then automatically cleans up the test resources to prevent ongoing cloud costs.",
  "whyItMatters": "An untested backup is not a guaranteed backup. Corrupted data, missing IAM restore permissions, or configuration drift can cause restore attempts to fail during a real disaster. Automated restore testing gives organizations continuous confidence and auditable proof that their disaster recovery procedures work.",
  "workplaceExample": "A healthcare SaaS provider schedules an AWS Backup Restore Testing Plan every Sunday at 04:00 UTC. The plan picks a random recovery point for their Amazon RDS PostgreSQL database, spins up a temporary test database, verifies successful startup, records the validation timestamp for HIPAA compliance auditors, and deletes the test database 30 minutes later.",
  "examFocus": "For SAA-C03, know that AWS Backup includes native automated Restore Testing Plans. Understand that it helps validate Recovery Time Objective (RTO), satisfies regulatory compliance for disaster recovery drill verification, and automatically tears down test resources after validation to control costs.",
  "keyPoints": [
    "Automates scheduled testing and validation of backup recovery points.",
    "Restores resources into isolated test environments to verify recoverability.",
    "Automatically deletes restored test resources after testing to avoid unnecessary cloud costs.",
    "Provides measurable metrics on restore duration to validate Recovery Time Objectives (RTO).",
    "Generates compliance evidence for auditors showing active disaster recovery validation."
  ],
  "commonMistake": "Never testing backup restores until a real production outage occurs, only to discover that restore IAM permissions are missing or that database configurations fail to initialize. Use AWS Backup Restore Testing to validate recovery points automatically.",
  "example": "RestoreTestingPlan:\n  ScheduleExpression: 'cron(0 6 ? * SUN *)' # Runs restore test every Sunday at 06:00 UTC\n  RecoveryPointSelection:\n    Algorithm: LATEST_WITHIN_WINDOW\n    SelectionWindowDays: 7\n  CleanupHoldTimeHours: 1 # Automatically tear down test resources after 1 hour",
  "sources": [
    {
      "title": "AWS Backup Restore Testing",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/restore-testing.html"
    },
    {
      "title": "Creating a Restore Testing Plan",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/restore-testing-plan.html"
    }
  ]
});
