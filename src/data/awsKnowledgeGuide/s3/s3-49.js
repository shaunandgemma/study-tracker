import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-49",
  "title": "S3 Inventory",
  "plainEnglish": "Amazon S3 Inventory is an automated reporting feature that provides a scheduled, flat-file report (in CSV, Apache ORC, or Apache Parquet format) listing all the objects and their corresponding metadata stored in an S3 bucket or under a specific prefix. Generated on a daily or weekly basis and delivered directly to a destination S3 bucket, S3 Inventory serves as a high-performance, cost-effective alternative to making synchronous `s3:ListObjectsV2` API calls on massive buckets.",
  "whyItMatters": "Running synchronous `ListObjectsV2` API calls against buckets containing millions or billions of objects is slow, expensive, and risks throttling production application traffic. S3 Inventory generates pre-computed, partitioned metadata files that can be directly queried using SQL via Amazon Athena, Amazon QuickSight, or Apache Spark, accelerating big data audits and compliance scans.",
  "workplaceExample": "A cybersecurity compliance team needs to verify that all 200 million files in a customer documents bucket are properly encrypted with SSE-KMS. Instead of running a 12-hour script making millions of `ListObjectsV2` calls, the team configures a daily S3 Inventory report in Parquet format. Every morning, they run an Amazon Athena SQL query against the inventory table: `SELECT count(*) FROM inventory WHERE encryption_status != 'SSE-KMS'`, auditing compliance across 200 million objects in under 3 seconds.",
  "examFocus": "Understand S3 Inventory capabilities and output options: (1) Output Formats: CSV, Apache ORC, and Apache Parquet (Parquet/ORC are recommended for fast SQL querying via Athena). (2) Schedule Frequency: Daily or Weekly. (3) Available Metadata Fields: Size, Storage Class, Version ID, ETag, Encryption Status, Replication Status, Object Lock Mode, Retention Date, Legal Hold Status, and Checksums. (4) Batch Operations Input: S3 Inventory reports are the standard manifest format used as input for S3 Batch Operations.",
  "keyPoints": [
    "Scheduled reporting tool providing flat-file lists of all objects and metadata in a bucket.",
    "Delivered daily or weekly in CSV, Apache ORC, or Apache Parquet formats.",
    "Cost-effective alternative to synchronous `ListObjectsV2` API calls for massive datasets.",
    "Captures extensive metadata: size, storage class, encryption, replication, and Object Lock status.",
    "Optimized for SQL analysis using Amazon Athena, Amazon Redshift, or Amazon QuickSight.",
    "Serves as the primary input manifest file for running S3 Batch Operations jobs."
  ],
  "commonMistake": "Writing custom application code to loop over `ListObjectsV2` pagination tokens across billions of objects to audit encryption or replication status. `ListObjectsV2` is slow and costly for large buckets; use S3 Inventory with Amazon Athena for instant SQL auditing.",
  "example": "Configure a daily Parquet S3 Inventory report on a bucket using the AWS CLI: aws s3api put-bucket-inventory-configuration --bucket data-lake-bucket --id DailyParquetInventory --inventory-configuration '{\"Destination\": {\"S3BucketDestination\": {\"AccountId\": \"123456789012\", \"Bucket\": \"arn:aws:s3:::inventory-reports\", \"Format\": \"Parquet\"}}, \"IsEnabled\": true, \"Id\": \"DailyParquetInventory\", \"IncludedObjectVersions\": \"Current\", \"Schedule\": {\"Frequency\": \"Daily\"}}'.",
  "sources": [
    {
      "title": "Amazon S3 Inventory Overview",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-inventory.html"
    },
    {
      "title": "Configuring Amazon S3 Inventory Reports",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-inventory-location-and-format.html"
    }
  ]
});
