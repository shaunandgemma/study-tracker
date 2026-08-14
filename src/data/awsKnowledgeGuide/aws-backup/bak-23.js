import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-23",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "RDS and Aurora Backup",
  "status": "ready",
  "plainEnglish": "RDS and Aurora Backup in AWS Backup provides centralized snapshot management and continuous backup (Point-in-Time Recovery) for Amazon Relational Database Service (RDS) instances and Amazon Aurora clusters. With AWS Backup, you can enforce centralized backup retention schedules, copy database snapshots across AWS Regions or accounts, and manage database data protection under the same policies as the rest of your cloud infrastructure.",
  "whyItMatters": "While Amazon RDS and Aurora have built-in automated snapshot features, native RDS snapshots cannot be easily governed across multi-account organizations or integrated with unified compliance frameworks. AWS Backup brings RDS and Aurora under a centralized backup pane of glass with cross-account replication and immutable Vault Lock support.",
  "workplaceExample": "A company running 30 Amazon Aurora MySQL clusters configures an AWS Backup plan that creates daily automated snapshots, retains them for 90 days, and automatically copies every snapshot to an isolated DR vault in a secondary AWS account.",
  "examFocus": "For SAA-C03, know that AWS Backup supports both snapshot-based backups and continuous Point-in-Time Recovery (PITR) for RDS and Aurora. Understand that copying RDS snapshots across accounts requires a Customer Managed KMS Key (CMK), as the default `aws/rds` key cannot be shared cross-account.",
  "keyPoints": [
    "Centrally manages snapshots and continuous backups for RDS instances and Aurora clusters.",
    "Supports Point-in-Time Recovery (PITR) with continuous backups retained up to 35 days.",
    "Enables automated cross-Region and cross-account copying of database snapshots.",
    "Cross-account database copies require using a Customer Managed KMS Key (CMK).",
    "Restoring an RDS/Aurora backup creates a brand-new database instance or cluster."
  ],
  "commonMistake": "Attempting to copy an RDS snapshot encrypted with the default `aws/rds` KMS key to another AWS account. Default AWS-managed KMS keys cannot be shared cross-account; re-encrypt the snapshot or database with a Customer Managed Key (CMK) before copying.",
  "example": "ListOfTags:\n  - ConditionType: STRINGEQUALS\n    ConditionKey: DatabaseEngine\n    ConditionValue: AuroraPostgreSQL",
  "sources": [
    {
      "title": "Backing Up Amazon RDS with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/rds-backups.html"
    },
    {
      "title": "Backing Up Amazon Aurora with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/aurora-backups.html"
    }
  ]
});
