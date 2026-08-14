import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-24",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "DynamoDB Backup",
  "status": "ready",
  "plainEnglish": "DynamoDB Backup in AWS Backup provides centralized, automated data protection for Amazon DynamoDB tables. It supports both on-demand/scheduled snapshot backups and continuous backups for Point-in-Time Recovery (PITR). When backing up DynamoDB tables, AWS Backup captures the table schema, primary key structure, local secondary indexes (LSIs), global secondary indexes (GSIs), and all item data without consuming read/write capacity units or impacting application latency.",
  "whyItMatters": "Running backups directly against NoSQL databases traditionally required custom scan jobs that consumed provisioned throughput and risked degrading live application performance. AWS Backup performs zero-impact backups and enables tiering DynamoDB backups into low-cost cold storage for multi-year retention.",
  "workplaceExample": "A gaming company with 100 DynamoDB tables uses AWS Backup to automate continuous backups for 35-day Point-in-Time Recovery and takes monthly snapshots that transition to cold storage after 30 days, retaining them for 3 years at low cost.",
  "examFocus": "For SAA-C03, remember that AWS Backup for DynamoDB has zero impact on table performance or provisioned read/write capacity units (RCUs/WCUs). It supports continuous backup (PITR) up to 35 days and lifecycle transition of backups to cold storage. Restoring creates a new DynamoDB table with all indexes and schema attributes.",
  "keyPoints": [
    "Protects DynamoDB tables without consuming provisioned throughput (RCUs/WCUs).",
    "Backs up table schema, primary keys, local secondary indexes (LSIs), and global secondary indexes (GSIs).",
    "Supports continuous backups for Point-in-Time Recovery (PITR) up to 35 days.",
    "Supports lifecycle transitions of table backups to low-cost cold storage.",
    "Restoring from a recovery point creates a brand-new DynamoDB table."
  ],
  "commonMistake": "Writing custom batch ETL scripts or Lambda scanners to export DynamoDB tables to S3 for backup, which consumes table read capacity and risks throttling live application traffic. Use AWS Backup for zero-impact automated backups.",
  "example": "ListOfTags:\n  - ConditionType: STRINGEQUALS\n    ConditionKey: Service\n    ConditionValue: DynamoDBTable",
  "sources": [
    {
      "title": "Backing Up Amazon DynamoDB with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/dynamodb-backups.html"
    },
    {
      "title": "Point-in-Time Recovery for Amazon DynamoDB",
      "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html"
    }
  ]
});
