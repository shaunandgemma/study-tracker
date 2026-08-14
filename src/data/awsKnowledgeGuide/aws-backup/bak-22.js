import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-22",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "EBS Backup",
  "status": "ready",
  "plainEnglish": "EBS Backup in AWS Backup creates automated point-in-time snapshots of Amazon Elastic Block Store (EBS) volumes. Amazon EBS snapshots are incremental, meaning that only the blocks of data that have changed since the previous snapshot are saved, saving storage space while still allowing complete volume restoration. AWS Backup manages snapshot lifecycles, cross-region replication, and encryption centrally.",
  "whyItMatters": "Amazon EBS volumes store persistent data for mission-critical databases, operating systems, and file repositories. Automating EBS snapshots through AWS Backup ensures consistent data protection, eliminates custom snapshot management scripts, and provides fast recovery in the event of disk failure or accidental volume deletion.",
  "workplaceExample": "A company attaches a 2 TB io2 Block Express EBS volume to an EC2 instance running a MySQL database. AWS Backup takes automated daily snapshots at 01:00 UTC, retains them for 30 days, and replicates copies to a disaster recovery region every weekend.",
  "examFocus": "For SAA-C03, know that EBS snapshots taken by AWS Backup are incremental (first snapshot is full, subsequent snapshots store changed blocks only) and are stored durably in Amazon S3 behind the scenes. Restoring creates a brand-new EBS volume from any snapshot. EBS backups can be copied cross-Region and cross-account.",
  "keyPoints": [
    "Captures point-in-time, crash-consistent incremental snapshots of EBS block volumes.",
    "First snapshot captures full volume data; subsequent snapshots only store changed blocks.",
    "Underlying snapshot blocks are stored durably in Amazon S3.",
    "Restoration creates a new EBS volume with configurable volume type, IOPS, and size.",
    "Supports cross-region and cross-account copies with automatic re-encryption."
  ],
  "commonMistake": "Believing that deleting an older incremental EBS snapshot corrupts subsequent snapshots. AWS EBS snapshots independently track all needed data blocks; deleting an older snapshot only removes blocks not referenced by newer snapshots.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: AWS Backup selection for EBS volumes.\nResources:\n  EbsBackupSelection:\n    Type: AWS::Backup::BackupSelection\n    Properties:\n      BackupPlanId: !Ref ProductionBackupPlan\n      BackupSelection:\n        SelectionName: ProductionEbsVolumes\n        IamRoleArn: !Sub 'arn:aws:iam::${AWS::AccountId}:role/service-role/AWSBackupDefaultServiceRole'\n        ListOfTags:\n          - ConditionType: STRINGEQUALS\n            ConditionKey: VolumeType\n            ConditionValue: ProductionData",
  "sources": [
    {
      "title": "Backing Up Amazon EBS Volumes with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/ebs-backups.html"
    },
    {
      "title": "Amazon EBS Snapshots Overview",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSSnapshots.html"
    }
  ]
});
