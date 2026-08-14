import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-9",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Resource Assignments",
  "status": "ready",
  "plainEnglish": "Resource Assignments link your AWS resources to a Backup Plan. Instead of manually configuring backup tasks on every individual EC2 instance, DynamoDB table, or S3 bucket, you define Resource Assignments within your backup plan. You can assign resources explicitly by listing their Amazon Resource Names (ARNs), or assign them dynamically using AWS resource tags (e.g., any resource tagged with 'Backup=Daily').",
  "whyItMatters": "In dynamic cloud environments where auto scaling and continuous deployment launch new servers and databases daily, manually assigning each new resource to a backup plan is impractical. Tag-based resource assignments guarantee that any newly launched resource with the appropriate tag is automatically protected from day one.",
  "workplaceExample": "A devops engineer configures a Resource Assignment on a backup plan with the condition `BackupPlan == Production`. Whenever a developer launches a new Amazon RDS PostgreSQL instance or EBS volume with the tag `BackupPlan: Production`, AWS Backup automatically includes it in the nightly backup schedule without administrative intervention.",
  "examFocus": "For SAA-C03, know the two methods for assigning resources to backup plans: (1) Explicit Resource Selection (by resource ID or ARN) and (2) Tag-Based Condition Selection (assigning resources based on tag keys and values). Tag-based selection is the AWS best practice for scalable multi-resource management and compliance.",
  "keyPoints": [
    "Connects specific AWS resources or resource groups to an AWS Backup Plan.",
    "Supports explicit assignment via resource ARNs or resource IDs.",
    "Supports dynamic, automatic assignment using resource tags (key-value pairs).",
    "Supports exclusion rules to omit specific resources or tags from the backup plan.",
    "Uses an IAM service role (AWSBackupDefaultServiceRole) to perform backup operations."
  ],
  "commonMistake": "Relying solely on explicit ARN assignments in fast-moving cloud environments. When new EC2 instances or RDS clusters are launched, they are left unprotected until someone manually updates the backup plan. Use tag-based assignments to automate data protection.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Tag-based AWS Backup Selection resource assignment.\nResources:\n  ProductionTagSelection:\n    Type: AWS::Backup::BackupSelection\n    Properties:\n      BackupPlanId: !Ref ProductionBackupPlan\n      BackupSelection:\n        SelectionName: ProductionResources\n        IamRoleArn: !Sub 'arn:aws:iam::${AWS::AccountId}:role/service-role/AWSBackupDefaultServiceRole'\n        ListOfTags:\n          - ConditionType: STRINGEQUALS\n            ConditionKey: Environment\n            ConditionValue: Production",
  "sources": [
    {
      "title": "Assigning Resources to a Backup Plan",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html"
    },
    {
      "title": "AWS::Backup::BackupSelection CloudFormation Reference",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backup-backupselection.html"
    }
  ]
});
