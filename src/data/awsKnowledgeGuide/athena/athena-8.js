import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-8",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Partitioning",
  "status": "ready",
  "plainEnglish": "Partitioning is a technique for dividing your data into distinct subdirectories (folders) in Amazon S3 based on specific column values, such as date, year, month, or region (e.g., s3://bucket/logs/year=2026/month=08/day=14/). When you run an Athena query with a WHERE filter on a partitioned column (e.g., WHERE year = '2026' AND month = '08'), Athena uses partition pruning to scan only the specific S3 folders that match the filter, completely skipping all other unneeded directories.",
  "whyItMatters": "Athena charges 5 USD per terabyte of data scanned. If you have 10 TB of logs spanning 5 years and only need yesterday's data, querying an unpartitioned dataset scans all 10 TB (costing 50 USD). With date partitioning, Athena scans only yesterday's 5 GB partition (costing a fraction of a cent), while executing the query 100x faster.",
  "workplaceExample": "An e-commerce company partitions order data by year, month, and country. A query analyzing UK sales for August 2026 reads only s3://store-data/orders/year=2026/month=08/country=UK/, reducing data scanned from 50 TB down to 12 GB.",
  "examFocus": "For SAA-C03, partitioning is the single most important technique for optimizing Athena query performance and reducing scan costs. Know how partition metadata is added: using MSCK REPAIR TABLE (for Hive-style partitions), ALTER TABLE ADD PARTITION, Partition Projection, or automated AWS Glue Crawlers.",
  "keyPoints": [
    "Divides S3 data into structured subdirectories based on column values (e.g., year, month, region).",
    "Athena reads only relevant partitions matching WHERE clauses, skipping unneeded files (partition pruning).",
    "Dramatically improves query performance and reduces Athena data scanning costs.",
    "Hive-compatible partitions use the format key=value (e.g., year=2026/month=08/).",
    "Partition metadata can be loaded using MSCK REPAIR TABLE, Glue Crawlers, or Partition Projection."
  ],
  "commonMistake": "Dumping millions of log files into a single flat S3 prefix without partitioning. Every Athena query must scan every single file in the bucket, resulting in slow query execution and high scanning costs. Always partition large time-series and multi-tenant datasets.",
  "example": "CREATE EXTERNAL TABLE order_events (\n  order_id STRING,\n  amount DOUBLE\n)\nPARTITIONED BY (year STRING, month STRING)\nSTORED AS PARQUET\nLOCATION 's3://company-orders-lake/events/';\n\n-- Load new partitions\nMSCK REPAIR TABLE order_events;",
  "sources": [
    {
      "title": "Partitioning Data in Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/partitions.html"
    },
    {
      "title": "Partition Projection with Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/partition-projection.html"
    }
  ]
});
