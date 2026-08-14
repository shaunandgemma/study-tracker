import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-28",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "S3 Backup",
  "status": "ready",
  "plainEnglish": "S3 Backup in AWS Backup provides centralized, policy-driven data protection for Amazon Simple Storage Service (Amazon S3) buckets. Unlike standard S3 Versioning or S3 Cross-Region Replication (which mirror object changes in real-time), AWS Backup takes point-in-time and continuous backups of S3 bucket data, object tags, access control lists (ACLs), and user-defined metadata into an encrypted, isolated backup vault.",
  "whyItMatters": "While S3 Versioning protects individual objects from accidental overwrite, it does not provide an isolated, point-in-time snapshot or air-gapped protection against accidental bucket deletion or ransomware attacks. AWS Backup creates an independent, immutable recovery point that can be locked with Vault Lock and stored across separate accounts.",
  "workplaceExample": "A digital media library stores 20 million video assets in an S3 bucket. AWS Backup creates automated continuous backups of the bucket, allowing the team to restore the entire bucket state (or specific object prefixes) to any minute within the last 30 days if a faulty batch processing job accidentally deletes thousands of files.",
  "examFocus": "For SAA-C03, understand how AWS Backup for S3 complements native S3 features (Versioning, S3 Replication, Object Lock). AWS Backup provides centralized management, continuous Point-in-Time Recovery (PITR), cross-account/cross-region copies to an isolated vault, and restore options to either the original bucket or a new target S3 bucket.",
  "keyPoints": [
    "Centrally manages point-in-time and continuous backups for Amazon S3 buckets.",
    "Backs up S3 objects, object metadata, tags, and access control lists (ACLs).",
    "Supports continuous backups with Point-in-Time Recovery (PITR) up to 35 days.",
    "Can restore entire buckets, specific prefixes, or individual objects to original or new buckets.",
    "Protects against ransomware and rogue deletion when combined with Backup Vault Lock."
  ],
  "commonMistake": "Assuming S3 Versioning alone is sufficient for disaster recovery. If an unauthorized user with sufficient permissions deletes the bucket or deletes versioned markers maliciously, versioning is lost. AWS Backup stores backups in an independent, locked vault outside the bucket lifecycle.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: AWS Backup selection for S3 Buckets.\nResources:\n  S3BackupSelection:\n    Type: AWS::Backup::BackupSelection\n    Properties:\n      BackupPlanId: !Ref EnterpriseBackupPlan\n      BackupSelection:\n        SelectionName: ProductionS3Buckets\n        IamRoleArn: !Sub 'arn:aws:iam::${AWS::AccountId}:role/service-role/AWSBackupDefaultServiceRole'\n        ListOfTags:\n          - ConditionType: STRINGEQUALS\n            ConditionKey: BackupTier\n            ConditionValue: S3CriticalData",
  "sources": [
    {
      "title": "Backing Up Amazon S3 with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/s3-backups.html"
    },
    {
      "title": "Restoring Amazon S3 Data with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/restoring-s3.html"
    }
  ]
});
