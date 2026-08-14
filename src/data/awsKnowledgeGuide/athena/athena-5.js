import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-5",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Querying Data Directly in Amazon S3",
  "status": "ready",
  "plainEnglish": "Querying data directly in Amazon S3 means Athena reads your files in-place right from your S3 bucket without requiring you to import, copy, or load the data into a database engine first. This is called 'schema-on-read'—your raw files remain in their original S3 storage class (such as S3 Standard or S3 Standard-IA), and Athena applies your table schema structure at the exact moment the query runs.",
  "whyItMatters": "Decoupling compute (Athena) from storage (Amazon S3) gives you virtually unlimited storage capacity at low S3 prices, while allowing multiple compute tools (Athena, Amazon EMR, QuickSight, SageMaker) to access the exact same dataset simultaneously without creating duplicate copies.",
  "workplaceExample": "A telemetry platform ingests 10 terabytes of IoT sensor data into Amazon S3 daily. Business analysts use Athena to query this live S3 data directly, while data science teams run machine learning training jobs against the same raw S3 files in parallel.",
  "examFocus": "For SAA-C03, understand that Athena queries S3 in-place without data movement. Athena uses schema-on-read: data is structured when read, not when written. S3 object storage lifecycle policies (such as transitioning older raw data to S3 Glacier) can be used to manage storage costs independently of Athena.",
  "keyPoints": [
    "Athena reads raw data directly from Amazon S3 buckets without loading or data ingestion steps.",
    "Uses schema-on-read: table schemas are projected onto raw files during query execution.",
    "Storage is completely decoupled from compute, optimizing cost and scalability.",
    "Multiple services can read the same underlying S3 data lake files concurrently.",
    "Works with standard S3 storage tiers and respects S3 bucket policies and IAM permissions."
  ],
  "commonMistake": "Attempting to query objects stored in S3 Glacier Flexible Retrieval or Glacier Deep Archive directly with Athena. Athena cannot read archived objects until they are restored to S3 Standard; keep actively queried Athena datasets in S3 Standard, S3 Intelligent-Tiering, or S3 Standard-IA.",
  "example": "CREATE EXTERNAL TABLE IF NOT EXISTS web_logs (\n  request_ip STRING,\n  request_time STRING,\n  http_method STRING,\n  url STRING,\n  status_code INT\n)\nROW FORMAT DELIMITED\nFIELDS TERMINATED BY ' '\nLOCATION 's3://my-company-web-logs/raw-logs/';",
  "sources": [
    {
      "title": "Querying Amazon S3 Data with Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/querying-data.html"
    },
    {
      "title": "Creating Tables in Amazon Athena from Amazon S3",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/creating-tables.html"
    }
  ]
});
