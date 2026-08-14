import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-29",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "AWS Backup Audit Manager",
  "status": "ready",
  "plainEnglish": "AWS Backup Audit Manager is a built-in compliance monitoring and reporting tool within AWS Backup. It allows you to continuously evaluate and demonstrate the compliance of your data protection practices against organizational standards and regulatory frameworks (such as HIPAA, GDPR, or PCI-DSS). You create customizable compliance frameworks containing pre-built controls (e.g., verifying that all production resources have backups, or checking that backup recovery points are encrypted).",
  "whyItMatters": "Demonstrating data protection compliance during annual audits traditionally requires days of manual snapshot inventorying and spreadsheet assembly. AWS Backup Audit Manager provides continuous, automated compliance tracking and exports auditor-ready compliance reports with a single click.",
  "workplaceExample": "A chief risk officer sets up an AWS Backup Audit Manager framework with controls requiring all databases to have a daily backup with at least 30-day retention and KMS encryption. Whenever an unbacked-up RDS database is launched, Audit Manager flags it as non-compliant within hours and sends an Amazon SNS alert to the security team.",
  "examFocus": "For SAA-C03, AWS Backup Audit Manager is the designated feature for continuously monitoring, auditing, and proving backup compliance against policies and regulatory frameworks across multiple AWS accounts. It generates automated daily compliance reports and integrates with AWS Config rules under the hood.",
  "keyPoints": [
    "Continuously evaluates backup activity against organizational compliance policies.",
    "Provides customizable compliance frameworks and pre-built controls.",
    "Generates detailed, auditor-ready compliance reports automatically.",
    "Flags non-compliant resources (e.g., missing backup plans, insufficient retention periods).",
    "Integrates with AWS Organizations to track multi-account backup compliance."
  ],
  "commonMistake": "Writing custom Lambda scripts that query the AWS Backup API to generate weekly backup audit spreadsheets. Use AWS Backup Audit Manager to automatically enforce compliance controls and generate daily auditable reports natively.",
  "example": "# Create an Audit Manager framework using AWS Backup CLI:\naws backup create-framework \\\n  --framework-name EnterpriseComplianceFramework \\\n  --framework-description 'Validates production backup retention and encryption' \\\n  --framework-controls '[{\"ControlName\":\"BACKUP_RECOVERY_POINT_ENCRYPTED\",\"ControlInputParameters\":[]}]'",
  "sources": [
    {
      "title": "What is AWS Backup Audit Manager?",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/what-is-backup-audit-manager.html"
    },
    {
      "title": "Creating Frameworks in AWS Backup Audit Manager",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/create-framework.html"
    }
  ]
});
