import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-8",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "NFS Transfers",
  "status": "ready",
  "plainEnglish": "NFS Transfers in AWS DataSync enable high-performance data movement to and from Network File System (NFS) exports. DataSync supports NFS versions 3 (NFSv3), 4.0 (NFSv4.0), and 4.1 (NFSv4.1). When transferring data from an on-premises Linux or Unix file server, the DataSync agent connects as an NFS client, discovers directories and files, and copies them to AWS storage destinations (such as Amazon EFS, Amazon S3, or Amazon FSx) while preserving essential POSIX file system metadata.",
  "whyItMatters": "Migrating legacy Linux and Unix file systems manually often results in lost POSIX file permissions, broken symbolic links, or altered file ownership (UID/GID). DataSync natively understands NFS protocol semantics, ensuring that file ownership, access permissions, timestamps, and hard/symbolic links are faithfully preserved.",
  "workplaceExample": "A genomics lab transfers 120 million research files from an on-premises NetApp NFSv3 storage array to Amazon EFS. DataSync mounts the NFS export, preserves user/group IDs and file creation timestamps, and completes the initial baseline copy in 48 hours without dropping a single symlink.",
  "examFocus": "For SAA-C03, know that DataSync can transfer data directly from NFS shares (v3, v4.0, v4.1) using an on-premises DataSync Agent. It can preserve POSIX file permissions (owner UID, group GID, mode), timestamps (mtime, atime), and symlinks when moving data to Amazon EFS, Amazon S3, or Amazon FSx.",
  "keyPoints": [
    "Supports NFS versions 3, 4.0, and 4.1 exports from on-premises or cloud file servers.",
    "Preserves POSIX metadata: UID, GID, file permissions mode, and timestamps (mtime/atime).",
    "Handles symbolic links and hard links according to configurable task options.",
    "Connects securely via local network to the deployed on-premises DataSync Agent.",
    "Common target destinations include Amazon EFS, Amazon S3, and Amazon FSx."
  ],
  "commonMistake": "Forgetting to configure NFS export permissions on the on-premises storage server to allow the DataSync Agent's IP address root or administrative read access, resulting in 'Permission Denied' errors during the discovery phase.",
  "example": "# Create an NFS source location:\naws datasync create-location-nfs \\\n  --server-hostname nfs-server.corp.example.com \\\n  --subdirectory /exports/genomics-data \\\n  --on-prem-config '{\"AgentArns\":[\"arn:aws:datasync:us-east-1:123456789012:agent/agent-0123456789abcdef0\"]}' \\\n  --mount-options '{\"Version\":\"AUTOMATIC\"}'",
  "sources": [
    {
      "title": "Creating an NFS Location in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/create-nfs-location.html"
    },
    {
      "title": "Configuring Metadata Preservation for NFS Transfers",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/configure-metadata.html#metadata-nfs"
    }
  ]
});
