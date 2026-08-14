import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-16",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena Pay Per Data Scanned",
  "status": "ready",
  "plainEnglish": "Amazon Athena operates on a simple, serverless pricing model where you pay only for the volume of data scanned by your SQL queries. The standard pricing is 5.00 USD per terabyte (TB) of data scanned (with a 10 MB minimum per query). There are no hourly server charges, no setup fees, and no ongoing idle costs. If a query scans 10 gigabytes of data, it costs only 5 cents; if no queries are executed, your Athena cost is exactly zero.",
  "whyItMatters": "Pay-per-scan pricing makes Athena exceptionally cost-effective for ad-hoc and intermittent analytical workloads. Because costs are directly proportional to data scanned, architects can dramatically lower their bills by optimizing data storage formats (using Parquet, compression, and partitioning) to minimize the exact bytes read by each query.",
  "workplaceExample": "An analytics team runs 200 queries per day on an uncompressed 2 TB CSV dataset, scanning 400 TB monthly and costing 2,000 USD. By converting the dataset to partitioned Snappy-compressed Parquet files, daily queries scan only 4 TB monthly, slashing the bill from 2,000 USD down to 20 USD per month.",
  "examFocus": "For SAA-C03, remember the Athena pricing formula: 5 USD per TB of data scanned. To reduce Athena costs in exam scenarios, the correct answers are: (1) Convert data to columnar formats (Parquet/ORC), (2) Compress files (Snappy/GZIP), (3) Partition data by date/region, and (4) Avoid SELECT * in favor of selecting only required columns.",
  "keyPoints": [
    "Standard pricing is 5.00 USD per terabyte (TB) of data scanned by queries.",
    "Queries are rounded up to the nearest 10 MB per query.",
    "Failed queries or canceled queries that do not read data incur no charge.",
    "Zero upfront commitments, zero hourly cluster fees, and zero idle charges.",
    "Combining Parquet, compression, and partitioning reduces data scanned by up to 90%+."
  ],
  "commonMistake": "Running SELECT * on large, unpartitioned CSV tables during routine development. In CSV, SELECT * forces Athena to scan every single byte of every file in the S3 bucket. Limit queries with partitions, columnar formats, and specific column lists.",
  "example": "-- Poor query (scans entire table):\n-- SELECT * FROM access_logs;\n\n-- Cost-optimized query (scans only specific columns in a specific date partition):\nSELECT status_code, count(*) FROM access_logs_parquet WHERE year = '2026' AND month = '08' AND day = '14' GROUP BY status_code;",
  "sources": [
    {
      "title": "Amazon Athena Pricing",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html"
    },
    {
      "title": "Top 10 Performance Tuning Tips for Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/top-10-performance-tuning-tips.html"
    }
  ]
});
