import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-14",
  "title": "Fargate with Amazon EFS",
  "plainEnglish": "Amazon Elastic File System (Amazon EFS) integration with AWS Fargate enables stateful, serverless container applications. By mounting an Amazon EFS file system directly into Fargate tasks, multiple containers across multiple Availability Zones can concurrently read from and write to a shared, persistent POSIX-compliant file system that persists independently of the task lifecycle.",
  "whyItMatters": "While containers are traditionally stateless, many applications (like WordPress, Drupal, content management systems, ML model weights caching, and developer tools like Jenkins) require persistent, shared multi-AZ file storage. Fargate with EFS provides a fully serverless, auto-scaling persistent storage solution without managing NFS servers or EC2 storage nodes.",
  "workplaceExample": "A publishing company runs a high-traffic WordPress cluster on Fargate. They mount an Amazon EFS file system at /var/www/html/wp-content across 10 Fargate tasks distributed across three Availability Zones. When writers upload images or plugins, all Fargate tasks immediately have access to the shared files, and data remains completely safe when tasks restart or scale.",
  "examFocus": "Understand how EFS mounts to Fargate tasks: Configure a volume in the ECS task definition with an 'efsVolumeConfiguration' pointing to the EFS FileSystemId and optional EFS Access Point. Supports in-transit encryption (TLS) and IAM authorization. Know that Amazon EBS cannot be directly shared across multiple Fargate tasks in different AZs like EFS can.",
  "keyPoints": [
    "Amazon EFS provides persistent, shared, multi-AZ POSIX file storage for Amazon ECS tasks running on AWS Fargate (Platform Version 1.4.0+).",
    "Data stored in EFS persists independently of the container task lifecycle and is never deleted when tasks stop.",
    "Multiple Fargate tasks running in different Availability Zones can read and write to the same EFS file system concurrently.",
    "Supports EFS Access Points to enforce POSIX user identity (UID/GID) and restrict container access to specific directory subpaths.",
    "Supports in-transit encryption (TLS) between Fargate tasks and the EFS mount target.",
    "Network connectivity requires EFS Mount Targets in each task subnet and appropriate security group rules allowing inbound NFS traffic (port 2049)."
  ],
  "commonMistake": "Forgetting to open inbound port 2049 (NFS) on the EFS Mount Target security group from the Fargate task security group, causing the Fargate task launch to hang and time out during volume mount.",
  "example": "Define an EFS volume in an ECS task definition JSON: {\"name\": \"shared-storage\", \"efsVolumeConfiguration\": {\"fileSystemId\": \"fs-01234567\", \"transitEncryption\": \"ENABLED\", \"authorizationConfig\": {\"accessPointId\": \"fsap-01234567\", \"iam\": \"ENABLED\"}}}.",
  "sources": [
    {
      "title": "Amazon ECS Task Storage with Amazon EFS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/efs-volumes.html"
    },
    {
      "title": "Tutorial: Using Amazon EFS File Systems with Amazon ECS on AWS Fargate",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html"
    }
  ]
});
