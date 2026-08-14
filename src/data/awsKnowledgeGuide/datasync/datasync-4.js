import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-4",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "DataSync Online Data Transfer Service",
  "status": "ready",
  "plainEnglish": "AWS DataSync is an automated, online data transfer service that accelerates, automates, and securely moves large amounts of file and object data between on-premises storage systems and AWS cloud storage services, as well as between different AWS storage services and other cloud providers. DataSync utilizes a purpose-built, parallelized transfer protocol that transfers data up to 10 times faster than open-source tools like rsync or scp over the network.",
  "whyItMatters": "Migrating millions of files or petabytes of data using traditional tools requires writing complex custom scripts, handling network retries, verifying data checksums manually, and managing infrastructure. DataSync automates end-to-end transfer scheduling, bandwidth throttling, data compression, encryption in transit, and byte-for-byte data integrity verification.",
  "workplaceExample": "A media production studio needs to migrate 500 TB of video footage from an on-premises network-attached storage (NAS) array to Amazon S3. Using AWS DataSync, they deploy an on-premises agent VM and copy the entire dataset over AWS Direct Connect in 4 days with automated verification and zero scripting.",
  "examFocus": "For SAA-C03, remember that AWS DataSync is an ONLINE data transfer service (over AWS Direct Connect or the public Internet) designed for fast, automated, large-scale migrations and recurring sync jobs. It supports NFS, SMB, HDFS, object storage, Amazon S3, Amazon EFS, Amazon FSx (for Windows, Lustre, NetApp ONTAP, OpenZFS), and Azure Blob / Google Cloud Storage.",
  "keyPoints": [
    "Accelerated online data movement up to 10x faster than open-source tools (rsync/scp).",
    "Transfers between on-premises storage, edge locations, other clouds, and AWS storage services.",
    "Supports Amazon S3, Amazon EFS, and all Amazon FSx file system families.",
    "Performs automatic multi-threaded parallel transfers, compression, and TLS encryption in transit.",
    "Includes automated end-to-end data integrity verification and task scheduling."
  ],
  "commonMistake": "Choosing AWS DataSync for continuous hybrid cached file access. DataSync is a batch and scheduled data migration/sync tool, whereas AWS Storage Gateway (File Gateway) provides low-latency local caching for active end-user file shares.",
  "example": "# Create a DataSync task via AWS CLI:\naws datasync create-task \\\n  --source-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-0123456789abcdef0 \\\n  --destination-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-0fedcba9876543210 \\\n  --name MigrationTask-NAS-to-S3",
  "sources": [
    {
      "title": "What is AWS DataSync?",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"
    },
    {
      "title": "How AWS DataSync Works",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/how-datasync-works.html"
    }
  ]
});
