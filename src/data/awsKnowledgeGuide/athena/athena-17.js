import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-17",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena Query Optimization",
  "status": "ready",
  "plainEnglish": "Athena Query Optimization refers to the architectural and SQL best practices used to maximize query speed and minimize data scanned. Because Athena reads directly from Amazon S3, query performance depends heavily on how data is stored, structured, and queried. Key optimization strategies include converting data to columnar formats (Parquet/ORC), partitioning data into directory hierarchies, compressing files with Snappy/GZIP, avoiding tiny files (aiming for file sizes between 128 MB and 512 MB), and writing efficient SQL (avoiding SELECT * and using partition filters in WHERE clauses).",
  "whyItMatters": "Unoptimized queries on petabyte-scale data lakes can take minutes or fail due to timeouts, while costing hundreds of dollars. Applying optimization best practices reduces query execution times from minutes to seconds and slashes cloud spend by over 90%.",
  "workplaceExample": "An IoT platform generating 50,000 tiny 1 KB files per hour experiences slow Athena queries. Engineers implement an AWS Glue ETL compaction job that merges the small files into optimal 256 MB Parquet files and adds date partitions. Query latency drops from 45 seconds to 2 seconds.",
  "examFocus": "For SAA-C03, know the top Athena optimization techniques: (1) Partition data (date, region) to enable partition pruning, (2) Use columnar formats (Apache Parquet or ORC) to read only needed columns, (3) Compress files (Snappy, GZIP), (4) Avoid small files (< 128 MB); compact small files into larger files (128 MB – 512 MB), (5) Select only required columns instead of SELECT *, and (6) Use Partition Projection for highly partitioned datasets.",
  "keyPoints": [
    "Partitioning prunes unneeded S3 directories to reduce data scanned.",
    "Columnar storage (Parquet/ORC) reads only the specific columns requested.",
    "File sizing matters: optimal S3 file sizes for Athena are between 128 MB and 512 MB.",
    "Avoid thousands of tiny S3 files (< 10 MB), which create excessive S3 GET request overhead.",
    "Use specific column names and restrictive WHERE clauses rather than generic SELECT *."
  ],
  "commonMistake": "Allowing streaming ingest pipelines (like Kinesis Firehose) to write millions of tiny 5 KB files to S3 without buffer interval tuning or periodic compaction, creating severe S3 metadata bottlenecks in Athena. Buffer Firehose to 128 MB or run periodic compaction jobs.",
  "example": "SELECT request_method, response_code, count(*) AS total_hits\nFROM cdn_access_logs_parquet\nWHERE year = '2026' AND month = '08' AND day = '14'\nGROUP BY request_method, response_code\nORDER BY total_hits DESC;",
  "sources": [
    {
      "title": "Top 10 Performance Tuning Tips for Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/top-10-performance-tuning-tips.html"
    },
    {
      "title": "Tuning Query Performance in Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html"
    }
  ]
});
