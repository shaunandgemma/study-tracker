import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-10",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Tag-Based Backup Selection",
  "status": "ready",
  "plainEnglish": "Tag-Based Backup Selection is a feature in AWS Backup that automatically targets resources for backup based on metadata key-value tags assigned to those resources. When you create a backup plan, instead of picking specific volumes or databases by ID, you configure tag conditions (such as 'backup-tier = gold' or 'compliance = pci'). AWS Backup automatically identifies all tagged resources across all supported services and executes backups according to the plan.",
  "whyItMatters": "Tags decouple infrastructure provisioning from backup administration. Developers and infrastructure-as-code templates can simply tag new resources during creation, and AWS Backup immediately brings those resources under automated data protection policies without requiring administrative console updates.",
  "workplaceExample": "An enterprise defines a standardized tagging policy across 50 AWS accounts: any database, storage volume, or file system tagged with `BackupSchedule=Daily-30Day` is automatically backed up every night at 01:00 UTC and retained for 30 days.",
  "examFocus": "For SAA-C03, tag-based backup selection is the standard architectural recommendation for enterprise environments. It enforces automated data protection at scale across EC2, EBS, RDS, Aurora, DynamoDB, EFS, and S3. Tag conditions support multiple criteria, string equality, and exclusion conditions (e.g., exclude resources tagged `Environment=Development`).",
  "keyPoints": [
    "Automatically discovers and protects AWS resources based on key-value metadata tags.",
    "Supports multiple condition rules including StringEquals, StringLike, and StringNotEquals.",
    "Enables seamless backup automation for resources provisioned via CloudFormation, Terraform, or CDK.",
    "Eliminates manual resource enrollment and prevents newly created resources from missing backup windows.",
    "Works across all AWS Backup supported services seamlessly."
  ],
  "commonMistake": "Inconsistent tag naming conventions (e.g., some teams using `Backup=true`, others using `backup=yes`, and others using `DailyBackup=1`). Enforce standardized tag policies using AWS Organizations Tag Policies so AWS Backup selections match reliably.",
  "example": "ListOfTags:\n  - ConditionType: STRINGEQUALS\n    ConditionKey: BackupPlan\n    ConditionValue: GoldTier\n  - ConditionType: STRINGNOTEQUALS\n    ConditionKey: Environment\n    ConditionValue: Sandbox",
  "sources": [
    {
      "title": "Assigning Resources Using Tags in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html#assigning-resources-tags"
    },
    {
      "title": "Tagging Best Practices in AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/tagging-resources.html"
    }
  ]
});
