import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-6",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Block Storage for EC2",
  "status": "ready",
  "plainEnglish": "Amazon Elastic Block Store (EBS) is high-performance, raw block-level storage designed specifically for use with Amazon Elastic Compute Cloud (EC2) instances. An EBS volume behaves just like a physical hard drive or SSD plugged into a physical computer: you can format it with any file system (such as ext4, XFS, NTFS), install operating systems and applications on it, and run relational databases that require sub-millisecond block-level access.",
  "whyItMatters": "Unlike ephemeral Instance Store disks that lose all data when an EC2 instance stops, EBS volumes are independent, persistent network-attached storage devices. Data on an EBS volume persists independently of the EC2 instance lifecycle, automatically replicating within its Availability Zone to protect against component failure.",
  "workplaceExample": "A company runs an enterprise SAP ERP application on Amazon EC2. They attach two EBS gp3 volumes to the instance: a 100 GB root volume for the Linux OS and a 2 TB data volume formatted with XFS for database files. When the instance is stopped for a scheduled CPU upgrade, all EBS data remains intact.",
  "examFocus": "For SAA-C03, know that Amazon EBS is block storage (unlike S3 which is object storage and EFS which is file storage). An EBS volume is an Availability Zone-scoped resource and can only be attached to EC2 instances in the SAME Availability Zone. It automatically replicates within its AZ for 99.8%–99.999% availability.",
  "keyPoints": [
    "High-performance, persistent block storage designed for Amazon EC2 instances.",
    "Data persists independently of instance stops, starts, or terminations (if DeleteOnTermination is false).",
    "Availability Zone-scoped: a volume can only be attached to EC2 instances in the same AZ.",
    "Automatically replicates within its Availability Zone to prevent data loss from single component failures.",
    "Supports formatting with any standard file system (ext4, XFS, NTFS, Btrfs)."
  ],
  "commonMistake": "Attempting to attach an EBS volume created in `us-east-1a` directly to an EC2 instance running in `us-east-1b`. EBS volumes are strictly AZ-locked; to move data between AZs, take an EBS snapshot and restore a new volume in the target AZ.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Persistent EBS gp3 Block Storage Volume.\nResources:\n  AppEbsVolume:\n    Type: AWS::EC2::Volume\n    Properties:\n      AvailabilityZone: !GetAtt EC2Instance.AvailabilityZone\n      VolumeType: gp3\n      Size: 100\n      Encrypted: true",
  "sources": [
    {
      "title": "What is Amazon Elastic Block Store (Amazon EBS)?",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html"
    },
    {
      "title": "Amazon EBS Features and Architecture",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-features.html"
    }
  ]
});
