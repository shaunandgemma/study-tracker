import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-17",
  "title": "Amazon S3 Glacier Deep Archive",
  "plainEnglish": "Amazon S3 Glacier Deep Archive is Amazon S3's lowest-cost object storage class, designed for long-term data retention and digital preservation of data that is accessed only once or twice every few years. Costing a fraction of a cent per gigabyte per month (significantly cheaper than on-premises magnetic tape libraries), S3 Glacier Deep Archive stores data across three or more Availability Zones, supporting retrieval times of 12 to 48 hours.",
  "whyItMatters": "Organizations in regulated industries (financial services, healthcare, defense, government) must retain petabytes of records for 7 to 10+ years to satisfy legal compliance requirements. Glacier Deep Archive provides a cloud-native replacement for physical magnetic tape vaults, eliminating offsite courier fees, physical tape degradation risks, and manual library maintenance while offering 11 9s durability.",
  "workplaceExample": "A commercial bank is mandated by banking regulators to store all electronic transaction ledgers and customer signature cards for 10 years. The bank sets up an S3 Lifecycle Rule to transition all ledger exports to S3 Glacier Deep Archive after 180 days. The bank stores 100 petabytes of compliance ledgers for under $100,000 per year, knowing any historical file can be restored within 12 hours if required by an official regulatory subpoena.",
  "examFocus": "Understand Glacier Deep Archive retrieval tiers and constraints: (1) Lowest Cost Storage: Lowest per-GB storage pricing in the entire AWS cloud. (2) Retrieval Tiers: Standard Retrieval (within 12 hours) and Bulk Retrieval (within 48 hours). Expedited retrieval is NOT supported. (3) Minimum Storage Duration: 180 days (deleting earlier incurs prorated 180-day storage fee). (4) Minimum Billable Size: 40 KB.",
  "keyPoints": [
    "The lowest-cost object storage class in AWS, designed for long-term multi-year archival.",
    "Delivers significant cost savings compared to physical tape backup infrastructure.",
    "Offers two retrieval tiers: Standard (within 12 hours) and Bulk (within 48 hours).",
    "Expedited retrieval (minutes) is NOT supported on Glacier Deep Archive.",
    "Enforces a minimum storage duration of 180 days and a 40 KB minimum billable object size.",
    "Provides 11 9s (99.999999999%) data durability across at least 3 Availability Zones."
  ],
  "commonMistake": "Attempting to retrieve an object from S3 Glacier Deep Archive within a few minutes using Expedited retrieval. Glacier Deep Archive does not support Expedited retrieval; the fastest possible restore time is Standard retrieval (within 12 hours).",
  "example": "Configure a lifecycle rule in JSON to transition noncurrent object versions to Glacier Deep Archive after 90 days: {\"Rules\": [{\"ID\": \"DeepArchiveOldVersions\", \"Status\": \"Enabled\", \"Filter\": {\"Prefix\": \"\"}, \"NoncurrentVersionTransitions\": [{\"NoncurrentDays\": 90, \"StorageClass\": \"DEEP_ARCHIVE\"}]}]}.",
  "sources": [
    {
      "title": "Amazon S3 Glacier Deep Archive Storage Class",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html#sc-glacier-deep-archive"
    },
    {
      "title": "Restoring Archived Objects in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html"
    }
  ]
});
