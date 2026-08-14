import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-11",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "Amazon EFS Transfers",
  "status": "ready",
  "plainEnglish": "Amazon EFS Transfers in AWS DataSync allow you to transfer data between on-premises storage systems and Amazon Elastic File System (Amazon EFS), or between two Amazon EFS file systems across different AWS Regions or AWS accounts. DataSync connects directly to Amazon EFS mount targets via your VPC subnets and security groups, fully preserving POSIX file system permissions (UID, GID, mode), directory structures, and file modification timestamps.",
  "whyItMatters": "Amazon EFS is a fully managed, elastic NFS file system. Migrating millions of small files to EFS using standard file utilities can be painfully slow due to network latency and single-threaded execution. DataSync uses highly parallelized, multi-threaded transfer streams designed specifically to maximize Amazon EFS throughput and IOPS.",
  "workplaceExample": "A software company migrates its Linux developer home directories (consisting of 50 million small source code files and Git repositories) from an on-premises NFS server to Amazon EFS. DataSync executes the migration in parallel batches, preserving all Linux permissions and completing the sync overnight.",
  "examFocus": "For SAA-C03, know that AWS DataSync connects to Amazon EFS using mount targets inside your VPC. When transferring from EFS to EFS (e.g. cross-region disaster recovery or cross-account replication), no DataSync Agent is required. DataSync preserves POSIX ownership and permissions by default.",
  "keyPoints": [
    "Transfers files to and from Amazon EFS with full POSIX permissions preservation.",
    "Maximizes EFS throughput and IOPS using multi-threaded parallel data streams.",
    "Connects securely to EFS via VPC subnets, mount targets, and security groups.",
    "Supports EFS-to-EFS replication across AWS Regions and accounts without deploying an agent.",
    "Preserves Linux file ownership (UID/GID), file modes, timestamps, and symlinks."
  ],
  "commonMistake": "Blocking NFS port 2049 in the Amazon EFS Mount Target Security Group. The security group attached to the EFS mount target must allow inbound NFS traffic on port 2049 from the DataSync security group.",
  "example": "# Create an Amazon EFS location in DataSync:\naws datasync create-location-efs \\\n  --efs-filesystem-arn arn:aws:elasticfilesystem:us-east-1:123456789012:file-system/fs-0123456789abcdef0 \\\n  --subdirectory /developer-shares \\\n  --ec2-config '{\"SubnetArn\":\"arn:aws:ec2:us-east-1:123456789012:subnet/subnet-0123456789abcdef0\",\"SecurityGroupArns\":[\"arn:aws:ec2:us-east-1:123456789012:security-group/sg-0123456789abcdef0\"]}'",
  "sources": [
    {
      "title": "Creating an Amazon EFS Location in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/create-efs-location.html"
    },
    {
      "title": "Migrating to Amazon EFS with AWS DataSync",
      "url": "https://docs.aws.amazon.com/efs/latest/ug/export-and-import.html"
    }
  ]
});
