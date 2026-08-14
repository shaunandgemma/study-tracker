import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-14",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Volume Attachment to EC2",
  "status": "ready",
  "plainEnglish": "EBS Volume Attachment is the process of connecting an Amazon EBS storage volume to an Amazon EC2 instance as a block storage device (such as `/dev/xvdf` or `/dev/nvme1n1`). Once attached, the operating system detects the raw block device, allowing administrators to partition the disk, create a file system, and mount it to a directory path. You can attach multiple EBS volumes to a single EC2 instance to separate operating system files, logs, and database tables.",
  "whyItMatters": "Separating storage into multiple distinct attached volumes improves system stability and administrative flexibility. If a secondary data volume runs out of disk space, you can detach it, enlarge it, or attach it to a larger instance without rebuilding or reinstalling the base operating system root disk.",
  "workplaceExample": "A database administrator attaches three separate EBS volumes to a single PostgreSQL EC2 instance: `/dev/xvda` (root OS), `/dev/xvdf` (database data directory), and `/dev/xvdg` (Write-Ahead Logging / WAL logs) to prevent write logs from exhausting OS disk space.",
  "examFocus": "For SAA-C03, know that you can attach multiple EBS volumes to a single EC2 instance in the same AZ. Standard EBS volumes (gp2, gp3, st1, sc1) can only be attached to ONE EC2 instance at a time (single-attach). Only Provisioned IOPS volumes (io1/io2) with Multi-Attach enabled can be attached to multiple Nitro instances simultaneously.",
  "keyPoints": [
    "Connects raw block storage to an Amazon EC2 instance within the same Availability Zone.",
    "A single EC2 instance can have multiple EBS volumes attached simultaneously.",
    "Standard EBS volumes (gp2, gp3, st1, sc1) support only single-instance attachment.",
    "Device names in Linux typically follow `/dev/sd[f-p]` or `/dev/xvd[f-p]` (exposed as NVMe devices on Nitro).",
    "Volumes can be detached and attached to different EC2 instances in the same AZ."
  ],
  "commonMistake": "Detaching an active data volume from an EC2 instance without first unmounting the file system inside the operating system (`umount /data`), which can cause file system corruption or data loss.",
  "example": "# Attach an EBS volume to an EC2 instance:\naws ec2 attach-volume \\\n  --volume-id vol-0123456789abcdef0 \\\n  --instance-id i-0123456789abcdef0 \\\n  --device /dev/sdf",
  "sources": [
    {
      "title": "Attaching an Amazon EBS Volume to an EC2 Instance",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-attaching-volume.html"
    },
    {
      "title": "Making an Amazon EBS Volume Available for Use on Linux",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html"
    }
  ]
});
