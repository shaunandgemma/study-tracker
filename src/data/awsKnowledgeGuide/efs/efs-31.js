import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-efs",
  "topicTitle": "Amazon EFS (Elastic File System)",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "efs-31",
  "title": "EFS vs EBS",
  "plainEnglish": "Amazon EFS is shared file storage that Linux clients access through Network File System (NFS). Amazon Elastic Block Store (EBS) provides block volumes that attach to Amazon Elastic Compute Cloud (EC2) instances and behave like virtual disks. The application access pattern determines which is appropriate.",
  "whyItMatters": "Choosing file storage when an application needs a block device, or choosing an attached block volume when many servers need one shared directory, creates complexity and can fail the workload requirement.",
  "workplaceExample": "A scaled web tier uses EFS for shared uploaded files. Its database instance uses a provisioned EBS volume because the database needs block storage with explicitly selected capacity and performance.",
  "examFocus": "Choose EFS for a managed, elastic NFS namespace shared by multiple Linux clients. Choose EBS for persistent block storage attached to EC2, including boot disks and applications that require a disk-like device.",
  "keyPoints": [
    "EFS presents directories and files over NFS; EBS presents blocks through an attached volume.",
    "EFS is designed for concurrent shared access from supported compute clients.",
    "An EBS volume is created in an Availability Zone and attaches to EC2 as a virtual disk.",
    "EFS capacity grows and shrinks with files; EBS capacity and performance are provisioned by volume type and settings.",
    "Regional EFS stores data across multiple Availability Zones; EBS volume data is replicated within its Availability Zone.",
    "EBS snapshots protect block volumes; AWS Backup can create managed recovery points for EFS."
  ],
  "commonMistake": "Treating EFS as a drop-in replacement for a low-latency local block device is incorrect. Protocol, latency, concurrency, operating-system support, zone placement, and application semantics all matter.",
  "example": "For ten Linux web servers sharing one media directory, mount Regional EFS. For an EC2 database that expects a block device, attach an EBS volume selected for its input/output requirements.",
  "sources": [
    {
      "title": "Features of Amazon EFS",
      "url": "https://docs.aws.amazon.com/efs/latest/ug/features.html"
    },
    {
      "title": "What is Amazon Elastic Block Store?",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html"
    }
  ]
});
