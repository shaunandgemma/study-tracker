import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-13",
  "title": "Amazon S3 Standard-Infrequent Access - Standard-IA",
  "plainEnglish": "Amazon S3 Standard-Infrequent Access (Standard-IA) is an object storage class designed for data that is accessed less frequently (e.g., once or twice a month) but requires rapid, millisecond access whenever requested. Standard-IA stores data redundantly across a minimum of three Availability Zones with 99.999999999% (11 9s) durability, offering a significantly lower per-gigabyte monthly storage price than S3 Standard in exchange for a per-gigabyte data retrieval fee.",
  "whyItMatters": "Storing long-term operational backups, historical telemetry logs, and disaster recovery assets in S3 Standard leads to high cloud storage bills. Standard-IA reduces monthly gigabyte storage costs by approximately 40% to 50% compared to S3 Standard, while still ensuring that data is immediately accessible with low-millisecond latency when needed.",
  "workplaceExample": "A SaaS enterprise generates monthly customer billing statements as PDF documents. Customers access their current month's statement frequently, but rarely download statements older than 60 days. The infrastructure team creates an S3 Lifecycle Rule that transitions all PDF statements older than 60 days to S3 Standard-IA, slashing storage costs by 45% while allowing customers to download old statements instantly whenever needed.",
  "examFocus": "Understand S3 Standard-IA constraints and pricing rules: (1) Durability: 11 9s across >= 3 Availability Zones. (2) Availability SLA: 99.9% (designed for 99.9%). (3) Minimum Storage Duration: 30 days (deleting an object before 30 days incurs a prorated 30-day storage charge). (4) Minimum Object Size: 128 KB (objects smaller than 128 KB are billed as 128 KB of storage). (5) Retrieval Fee: Charges a per-GB data retrieval fee for GET requests.",
  "keyPoints": [
    "High-durability storage class for infrequently accessed data requiring millisecond access.",
    "Redundantly stored across at least 3 Availability Zones with 11 9s durability.",
    "Offers ~40-50% lower monthly storage cost per GB than S3 Standard.",
    "Charges a per-gigabyte data retrieval fee when objects are accessed.",
    "Enforces a minimum storage duration of 30 days.",
    "Enforces a minimum billable object size of 128 KB."
  ],
  "commonMistake": "Storing thousands of tiny files (e.g., 5 KB JSON logs) or frequently accessed files in S3 Standard-IA. Small files incur the 128 KB minimum storage charge, and frequent reads incur data retrieval fees that outweigh the lower monthly storage savings.",
  "example": "Configure an S3 Lifecycle transition rule in JSON to move objects with prefix `backups/` to Standard-IA after 30 days: {\"Rules\": [{\"ID\": \"MoveBackupsToIA\", \"Status\": \"Enabled\", \"Filter\": {\"Prefix\": \"backups/\"}, \"Transitions\": [{\"Days\": 30, \"StorageClass\": \"STANDARD_IA\"}]}]}.",
  "sources": [
    {
      "title": "Amazon S3 Standard-IA Storage Class",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html#sc-ia"
    },
    {
      "title": "General Considerations for Lifecycle Transitions in S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html"
    }
  ]
});
