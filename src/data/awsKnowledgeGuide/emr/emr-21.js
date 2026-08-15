import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-21",
  "title": "EMR vs Athena",
  "plainEnglish": "Amazon EMR and Amazon Athena are both AWS analytics services capable of querying data in Amazon S3, but they target different use cases and operational models. Amazon EMR is a managed big-data cluster platform giving full control over open-source frameworks (Spark, Hadoop, Hive, Trino, HBase), while Amazon Athena is a serverless, interactive query service that lets you analyze data in S3 using standard SQL with zero infrastructure management.",
  "whyItMatters": "Choosing the right service between EMR and Athena optimizes both engineering productivity and cost. Athena requires zero cluster setup and charges solely per byte of data scanned by SQL queries, making it ideal for ad-hoc analysis. EMR requires cluster management (or serverless configuration) but provides massive scalability, custom programming APIs (Python, Scala, Java), and continuous batch/streaming transformation capabilities.",
  "workplaceExample": "A data team uses Amazon Athena for business analysts to execute quick, ad-hoc SQL queries and generate Tableau dashboards directly from S3 Parquet tables without provisioning servers. Meanwhile, their data engineers use Amazon EMR to execute multi-stage PySpark machine learning workflows and complex iterative graph processing pipelines that require custom hardware instances and deep framework tuning.",
  "examFocus": "Know when to choose Athena vs. EMR: Choose Athena for quick, interactive, ad-hoc SQL queries on S3 data lakes, log analysis (VPC Flow Logs, CloudTrail), and serverless pay-per-query pricing. Choose EMR for complex ETL pipelines, non-SQL languages (Scala, Python, Java), custom open-source frameworks (Spark, Flink, HBase), machine learning (MLlib), and long-running streaming jobs.",
  "keyPoints": [
    "Amazon Athena is completely serverless; queries run instantly without provisioning, configuring, or managing clusters.",
    "Athena pricing is based on data scanned per query ($5.00 per TB scanned), whereas EMR pricing is based on EC2/Serverless compute resources used over time.",
    "Athena is specialized for standard SQL queries and data exploration over S3, Iceberg, and federated data sources.",
    "Amazon EMR provides full access to distributed frameworks (Spark, Hadoop, Hive, Presto, Trino, HBase, Flink) and programming APIs (Scala, Python, R, Java).",
    "EMR is the superior choice for heavy multi-step batch ETL, iterative machine learning algorithms, graph processing, and real-time streaming pipelines.",
    "Both services integrate natively with the AWS Glue Data Catalog for shared database, table, and partition schema definitions."
  ],
  "commonMistake": "Provisioning a full EMR cluster just to run a few sporadic SQL queries against S3 log files. That introduces unnecessary cluster management overhead and idle instance costs; use serverless Amazon Athena for ad-hoc SQL queries instead.",
  "example": "Use Athena to query Amazon S3 access logs using standard SQL: SELECT request_uri, status_code, count(*) FROM s3_logs WHERE status_code = '500' GROUP BY request_uri, status_code; vs using EMR to run a distributed Spark ML pipeline training recommendation models across terabytes of data.",
  "sources": [
    {
      "title": "Amazon EMR Big Data Analytics Options",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/big-data-analytics-options/amazon-emr.html"
    },
    {
      "title": "What is Amazon Athena?",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"
    }
  ]
});
