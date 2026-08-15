import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-9",
  "title": "Snowball Edge Storage Optimized",
  "plainEnglish": "AWS Snowball Edge Storage Optimized is a high-capacity, ruggedized data migration and edge storage appliance specifically engineered for large-scale data transfer workloads and local storage-intensive applications. Featuring up to 80 TB of usable hard disk drive (HDD) storage or 210 TB of all-NVMe solid-state storage, 40 to 104 vCPUs, and up to 100 Gbps network connectivity, this device is the primary choice for enterprise data center migrations and local edge storage pools.",
  "whyItMatters": "Data migrations involving hundreds of terabytes or petabytes need maximum disk density, high network throughput, and low cost per gigabyte. Snowball Edge Storage Optimized provides massive local capacity with multi-gigabit network ports (10G/25G/40G/100G) and the ability to cluster up to 16 devices together to form a highly durable multi-petabyte local S3 storage cluster.",
  "workplaceExample": "A national hospital network shuts down an on-premises enterprise archive containing 400 TB of patient PACS radiology scans. They order five AWS Snowball Edge Storage Optimized (80 TB) appliances. Connecting the devices across five 40 GbE fiber switches, the engineering team parallelizes the copy operations, transferring all 400 TB in 3 days before shipping the devices to AWS for S3 ingestion.",
  "examFocus": "Understand Snowball Edge Storage Optimized specifications: (1) Storage Capacity: 80 TB usable HDD (standard model) or 210 TB usable NVMe (high-density flash model). (2) Compute: 40 to 104 vCPUs, up to 416 GB RAM (runs EC2-compatible `sbe-c` instances). (3) Network Interfaces: 10G/25G SFP28, 40G/100G QSFP28, and 1G RJ45 copper ports. (4) Clustering: Supports local S3 storage clustering across 5 to 16 devices for petabyte-scale high-availability storage pools.",
  "keyPoints": [
    "High-density physical appliance designed for large-scale data migrations and edge storage.",
    "Provides up to 80 TB usable HDD storage or up to 210 TB usable NVMe flash storage.",
    "Equipped with 40 to 104 vCPUs and high-speed network interfaces up to 100 Gbps.",
    "Supports local clustering of 5 to 16 devices to create durable multi-petabyte local S3 storage.",
    "Offers local Amazon S3-compatible object storage and local Amazon EBS-compatible block volumes.",
    "Ruggedized, weather-resistant chassis with automatic E-ink return shipping display."
  ],
  "commonMistake": "Selecting a Snowball Edge Compute Optimized device when the primary goal is bulk storage migration. Compute Optimized has less storage capacity (28–42 TB); always select Storage Optimized (80–210 TB) for maximum storage capacity and lowest migration cost per terabyte.",
  "example": "Order an 80 TB Storage Optimized device for an S3 import job via the AWS CLI: aws snowball create-job --job-type IMPORT --resources '{\"S3Resources\": [{\"BucketArn\": \"arn:aws:s3:::enterprise-data-lake\"}]}' --snowball-type EDGE_STORAGE_OPTIMIZED --role-arn arn:aws:iam::123456789012:role/SnowballImportRole --kms-key-arn arn:aws:kms:us-east-1:123456789012:key/snow-key.",
  "sources": [
    {
      "title": "AWS Snowball Edge Storage Optimized Specifications",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/device-differences.html"
    },
    {
      "title": "Configuring S3 Storage on Snowball Edge Storage Optimized",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/what-is-snowball.html"
    }
  ]
});
