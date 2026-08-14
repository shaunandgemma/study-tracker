import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-14",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "AWS Storage Service to AWS Storage Service Transfers",
  "status": "ready",
  "plainEnglish": "AWS Storage Service to AWS Storage Service Transfers allow you to move and synchronize data directly between native AWS storage services (such as Amazon S3, Amazon EFS, and Amazon FSx) within the same AWS Region or across different AWS Regions and accounts without deploying any DataSync Agents. The DataSync service runs as a fully managed cloud service, transferring data over AWS internal network backbones.",
  "whyItMatters": "Companies frequently need to replicate datasets between S3 and EFS for container access, migrate between EFS and FSx for performance optimization, or copy data across Regions for disaster recovery. DataSync eliminates the need to spin up and maintain temporary EC2 migration instances running custom sync scripts.",
  "workplaceExample": "A data engineering team copies 50 TB of transformed CSV dataset files from an Amazon EFS file system in `us-east-1` directly into an Amazon S3 data lake bucket in `eu-west-1` for European analytics teams. DataSync handles cross-region transfer and checksum validation serverlessly.",
  "examFocus": "For SAA-C03, remember that in-cloud AWS-to-AWS transfers (e.g. S3 to EFS, EFS to EFS, S3 to FSx, or FSx to FSx) do NOT require any DataSync Agent. DataSync uses AWS managed compute infrastructure and IAM service roles to read and write directly between AWS storage endpoints across regions and accounts.",
  "keyPoints": [
    "Transfers data between Amazon S3, Amazon EFS, and all Amazon FSx file systems.",
    "Does NOT require deploying any DataSync Agent VMs or EC2 instances.",
    "Supports cross-region, cross-account, and same-region data synchronization.",
    "Fully managed, serverless execution running on AWS high-speed internal network backbone.",
    "Uses IAM roles and VPC endpoints for secure service-to-service authentication."
  ],
  "commonMistake": "Launching EC2 instances with cron jobs running `aws s3 sync` or custom rsync scripts to copy files between EFS and S3. Using AWS DataSync is serverless, up to 10x faster, preserves metadata, and requires zero EC2 infrastructure maintenance.",
  "example": "# Create a task transferring data from Amazon EFS to Amazon S3:\naws datasync create-task \\\n  --source-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-efs-source \\\n  --destination-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-s3-destination \\\n  --name EFS-to-S3-BackupTask",
  "sources": [
    {
      "title": "Transferring Data Between AWS Storage Services",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/transfer-aws-to-aws.html"
    },
    {
      "title": "Using AWS DataSync for In-Cloud AWS Storage Migrations",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html#datasync-in-cloud"
    }
  ]
});
