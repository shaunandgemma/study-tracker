import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-12",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "Amazon FSx Transfers",
  "status": "ready",
  "plainEnglish": "Amazon FSx Transfers in AWS DataSync allow you to transfer files and datasets to and from all Amazon FSx file system families: Amazon FSx for Windows File Server, Amazon FSx for Lustre, Amazon FSx for NetApp ONTAP, and Amazon FSx for OpenZFS. DataSync natively integrates with each file system protocol, preserving Windows NTFS ACLs, UNIX permissions, user quotas, hard links, and extended attributes.",
  "whyItMatters": "Specialized file systems like FSx for Windows File Server or FSx for Lustre require specific metadata handling (such as Active Directory security descriptors or Lustre striping configurations). DataSync provides purpose-built connectors for each FSx file system, automating high-throughput migrations and scheduled synchronization without custom scripting.",
  "workplaceExample": "A high-performance computing (HPC) research team copies 2 PB of simulation models from on-premises Lustre storage to Amazon FSx for Lustre in AWS. DataSync transfers the files at multi-gigabit speeds over AWS Direct Connect with data verification enabled.",
  "examFocus": "For SAA-C03, know that DataSync can transfer data directly to and from all four Amazon FSx flavors: FSx for Windows File Server, FSx for Lustre, FSx for NetApp ONTAP, and FSx for OpenZFS. When migrating Windows file shares to FSx for Windows, DataSync preserves Windows NTFS ACLs, ownership, and attributes.",
  "keyPoints": [
    "Supports FSx for Windows File Server, FSx for Lustre, FSx for NetApp ONTAP, and FSx for OpenZFS.",
    "Preserves Windows NTFS ACLs, ownership, and attributes for FSx for Windows File Server.",
    "Enables high-throughput data loading for HPC workloads using FSx for Lustre.",
    "Transfers between on-premises storage and FSx, or between FSx and S3/EFS.",
    "Requires no agent when transferring between FSx and other AWS in-cloud storage services."
  ],
  "commonMistake": "Attempting to migrate on-premises NetApp ONTAP volumes to FSx for NetApp ONTAP using slow generic file copy tools. DataSync natively optimizes transfers directly to FSx for NetApp ONTAP endpoints.",
  "example": "# Create an FSx for Windows File Server location in DataSync:\naws datasync create-location-fsx-windows \\\n  --fsx-filesystem-arn arn:aws:fsx:us-east-1:123456789012:file-system/fs-0123456789abcdef0 \\\n  --subdirectory /CorporateShare \\\n  --user 'CORP\\AdminUser' \\\n  --password 'AdminSecretPassword!' \\\n  --domain 'corp.example.com' \\\n  --security-group-arns arn:aws:ec2:us-east-1:123456789012:security-group/sg-0123456789abcdef0",
  "sources": [
    {
      "title": "Creating an Amazon FSx Location in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/create-fsx-location.html"
    },
    {
      "title": "Migrating to Amazon FSx with AWS DataSync",
      "url": "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/migrate-datasync.html"
    }
  ]
});
