import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-33",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS vs EFS",
  "status": "ready",
  "plainEnglish": "Amazon EBS and Amazon EFS (Elastic File System) represent two distinct storage paradigms in AWS: Block Storage vs. Shared File Storage. Amazon EBS provides raw block-level virtual hard drives attached to a single EC2 instance in a single Availability Zone (unless using io1/io2 Multi-Attach in that same AZ). Amazon EFS is a serverless, elastic Network File System (NFSv4) that can be mounted concurrently by thousands of Amazon EC2 instances, AWS Lambda functions, and ECS/EKS containers across multiple Availability Zones and on-premises networks simultaneously.",
  "whyItMatters": "Using EBS when multiple web servers need simultaneous read/write access to shared media files or WordPress uploads leads to architecture failure because standard EBS volumes cannot attach across instances or across AZs. Choosing EFS provides a multi-AZ shared POSIX file system that grows and shrinks elastically with zero capacity planning.",
  "workplaceExample": "An Auto Scaling fleet of 50 Apache web servers across 3 Availability Zones serves a WordPress content management system. Each EC2 instance uses an EBS gp3 volume for its root operating system, but all 50 instances mount a single shared Amazon EFS file system at `/var/www/html/wp-content/uploads` to share images and plugins across instances.",
  "examFocus": "For SAA-C03, remember the fundamental architectural comparison: (1) Amazon EBS: Block storage, single-AZ scope, attached to one EC2 instance at a time (except io1/io2 Multi-Attach in same AZ), highest IOPS and lowest latency for single databases and OS boot drives. (2) Amazon EFS: File storage (POSIX/NFS), Regional/Multi-AZ scope, mounted simultaneously by thousands of EC2/container instances across AZs, scales automatically.",
  "keyPoints": [
    "EBS is block storage (single-AZ scope, typically 1 instance); EFS is shared file storage (multi-AZ Regional scope).",
    "EFS can be mounted concurrently by thousands of EC2 instances, Lambda functions, and ECS/EKS containers.",
    "EBS delivers sub-millisecond latencies ideal for relational databases (MySQL, Oracle, SQL Server) and OS boot.",
    "EFS automatically grows and shrinks storage capacity on-demand without pre-provisioning.",
    "EFS is Linux-only (POSIX NFSv4); EBS supports any OS formatted with any file system (Linux, Windows)."
  ],
  "commonMistake": "Attempting to use Amazon EBS to share files across a multi-AZ web farm. Standard EBS volumes cannot span Availability Zones or attach to multiple instances. Use Amazon EFS for multi-instance, multi-AZ Linux file sharing.",
  "example": "# Comparison Table:\n# | Feature           | Amazon EBS                     | Amazon EFS                     |\n# | Storage Paradigm  | Block Storage (Raw Disk)       | File Storage (POSIX / NFSv4)   |\n# | Scope             | Availability Zone              | Regional (Multi-AZ)            |\n# | Concurrent Access | Single instance (or 16 on io2) | Thousands of EC2 / Containers  |\n# | OS Compatibility  | Linux, Windows                 | Linux (POSIX compliant)        |\n# | Scaling           | Manual resize (Elastic Volumes)| Fully elastic & automatic      |\n# | Primary Use Case  | Databases, Boot Disks, SAP     | Web CMS, CI/CD, Container Data |",
  "sources": [
    {
      "title": "Amazon EBS Architecture and Workloads",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html"
    },
    {
      "title": "Amazon EFS Architecture and Features",
      "url": "https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html"
    }
  ]
});
