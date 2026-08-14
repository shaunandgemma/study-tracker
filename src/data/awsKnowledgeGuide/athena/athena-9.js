import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-9",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Columnar Formats - Parquet and ORC",
  "status": "ready",
  "plainEnglish": "Apache Parquet and Apache ORC are open-source columnar storage file formats designed specifically for fast, large-scale data analytics. In row-based formats like CSV and JSON, data is stored row-by-row, meaning a query must read every single column in a row even if it only needs one field. In columnar formats like Parquet and ORC, data is organized by columns, allowing Athena to read only the specific columns requested in your SQL SELECT statement while skipping all irrelevant columns.",
  "whyItMatters": "Columnar storage dramatically reduces both query time and query costs. If a table has 100 columns and your SQL query only selects 2 columns (SELECT customer_id, total_amount), Athena reads only those 2 column blocks from S3, reducing data scanned by up to 90–98% compared to CSV/JSON files.",
  "workplaceExample": "A data engineering pipeline converts 1 TB of daily raw JSON access logs into Apache Parquet format using AWS Glue ETL. As a result, Athena reporting queries that previously scanned 1 TB now scan only 35 GB, cutting query execution time from 4 minutes down to 8 seconds and reducing monthly Athena costs by 95%.",
  "examFocus": "For SAA-C03, converting raw CSV/JSON files to columnar formats (Apache Parquet or ORC) is a primary best practice to improve Athena query performance and minimize data scanned costs. Pair columnar formats with compression (like Snappy or ZSTD) for maximum efficiency.",
  "keyPoints": [
    "Columnar formats store data by column rather than by row.",
    "Athena reads only the specific columns referenced in the query, ignoring unselected columns.",
    "Columnar files include embedded metadata, column statistics, and dictionary encoding for rapid filtering.",
    "Apache Parquet and Apache ORC are the two premier columnar formats supported by Athena.",
    "Reduces S3 storage footprints and reduces Athena scan costs by up to 90% or more."
  ],
  "commonMistake": "Storing terabytes of historical logs in plain text CSV or uncompressed JSON and querying them repeatedly with Athena. Converting data to Parquet or ORC using AWS Glue or Amazon EMR provides massive speedups and cost savings.",
  "example": "CREATE EXTERNAL TABLE customer_transactions_parquet (\n  transaction_id STRING,\n  customer_id STRING,\n  amount DOUBLE,\n  transaction_timestamp TIMESTAMP\n)\nSTORED AS PARQUET\nLOCATION 's3://company-finance-lake/transactions_parquet/';",
  "sources": [
    {
      "title": "Columnar Storage in Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html"
    },
    {
      "title": "Top 10 Performance Tuning Tips for Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/top-10-performance-tuning-tips.html"
    }
  ]
});
