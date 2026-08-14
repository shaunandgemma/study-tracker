import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-21",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "EC2 Backup",
  "status": "ready",
  "plainEnglish": "EC2 Backup in AWS Backup captures a comprehensive, consistent machine-level backup of an entire Amazon Elastic Compute Cloud (EC2) instance. Instead of just snapshotting attached EBS disks, AWS Backup saves the entire instance configuration—including AMI metadata, instance type, VPC subnets, security groups, IAM role associations, elastic network interfaces (ENIs), and user data scripts—along with crash-consistent or application-consistent snapshots of all attached EBS volumes.",
  "whyItMatters": "Restoring an EC2 instance from bare EBS snapshots requires manually launching a new instance, re-attaching multiple volumes, re-configuring network interfaces, and reapplying security groups. AWS Backup EC2 backups allow one-click instance restoration with all original settings intact.",
  "workplaceExample": "A core business application runs on an EC2 instance with 1 root volume and 3 attached data volumes. AWS Backup captures a daily EC2 recovery point. When a hardware failure occurs, an engineer restores the entire instance to another Availability Zone in a single operation without manually reconnecting disks.",
  "examFocus": "For SAA-C03, understand that AWS Backup for EC2 protects the complete instance configuration (AMI, instance type, networking, tags) and all attached EBS volumes in a single recovery point. It supports application-consistent Windows backups using VSS (Volume Shadow Copy Service) without taking instances offline.",
  "keyPoints": [
    "Protects entire EC2 instance configuration (AMI, instance type, security groups, VPC) and all attached EBS volumes.",
    "Enables simple, one-click restoration of complete EC2 instances.",
    "Supports application-consistent backups on Windows Server using AWS Systems Manager and VSS.",
    "Supports cross-Region and cross-account backup copies of entire EC2 instances.",
    "Does not require stopping or detaching instances during standard crash-consistent backups."
  ],
  "commonMistake": "Taking manual EBS snapshots of only the root volume, leaving auxiliary attached data volumes unprotected and losing critical EC2 configuration metadata like security group associations and IAM roles. Use AWS Backup EC2 backup to protect the complete instance state.",
  "example": "ListOfTags:\n  - ConditionType: STRINGEQUALS\n    ConditionKey: BackupType\n    ConditionValue: FullEC2Instance",
  "sources": [
    {
      "title": "Backing Up Amazon EC2 Instances with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/ec2-backups.html"
    },
    {
      "title": "Creating Application-Consistent EC2 Backups using VSS",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/vss-backups.html"
    }
  ]
});
