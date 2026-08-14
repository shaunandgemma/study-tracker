import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-19",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena vs Amazon EMR",
  "status": "ready",
  "plainEnglish": "Amazon Athena and Amazon EMR (Elastic MapReduce) are both big data processing tools on AWS, but they target different complexity levels. Athena is a serverless, managed SQL query engine optimized for quick, interactive SQL queries directly against Amazon S3 data. Amazon EMR is an enterprise big data platform that lets you run customized distributed computing frameworks—such as Apache Spark, Hadoop, Hive, Presto, Flink, and HBase—giving you full control over cluster instance types, memory tuning, custom machine learning algorithms, and heavy ETL batch pipelines.",
  "whyItMatters": "For standard SQL reporting on S3 data, Athena is instant and requires zero operational effort. However, if your data pipeline requires complex graph processing, custom Python/Scala Spark code, non-SQL machine learning pipelines, or deep cluster memory tuning, Amazon EMR provides the specialized distributed computing power needed.",
  "workplaceExample": "A media company uses Athena for marketing analysts running ad-hoc SQL queries on clickstream data in S3. Meanwhile, the data engineering team uses Amazon EMR with Apache Spark to process terabytes of raw video telemetry, run distributed machine learning algorithms, and transform data for recommendation engines.",
  "examFocus": "For SAA-C03, compare Athena and Amazon EMR: Athena is the choice when you need simple, serverless, interactive SQL queries on S3 data with zero cluster management and minimal operational overhead. Amazon EMR is the choice when you need distributed big data frameworks (Apache Spark, Hadoop, Presto, HBase), complex non-SQL transformations, machine learning pipelines, or custom deep cluster tuning. EMR Serverless runs Spark/Hive applications without managing cluster instances.",
  "keyPoints": [
    "Athena provides serverless ANSI SQL querying on S3 with zero cluster administration.",
    "Amazon EMR runs distributed big data frameworks like Apache Spark, Hadoop, and Hive.",
    "Athena is best for ad-hoc interactive SQL and log investigations.",
    "Amazon EMR is best for complex ETL batch processing, machine learning, and custom code (Scala, Python, Java).",
    "Athena pricing is pay-per-scan; EMR pricing is based on EC2 instance hours or EMR Serverless capacity units."
  ],
  "commonMistake": "Setting up and managing a 20-node Amazon EMR cluster when the team only needs to run standard SQL queries on S3 files once a day. Athena delivers identical SQL results without the cost, complexity, and operational overhead of maintaining an EMR cluster.",
  "example": "-- Athena executes pure serverless SQL on S3:\nSELECT country, count(distinct user_id) as active_users FROM user_activity_parquet WHERE activity_date >= '2026-08-01' GROUP BY country;",
  "sources": [
    {
      "title": "Analytics Options on AWS - Amazon Athena vs Amazon EMR",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/analytics-options-on-aws/amazon-athena.html"
    },
    {
      "title": "What is Amazon EMR?",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html"
    }
  ]
});
