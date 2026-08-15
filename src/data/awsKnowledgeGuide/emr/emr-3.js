import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-3",
  "title": "EMR Managed Big Data Platform",
  "plainEnglish": "Amazon EMR (formerly Elastic MapReduce) is a managed cloud platform that makes it simple and cost-effective to run big-data frameworks such as Apache Spark, Apache Hadoop, Apache Hive, Presto, and Trino. AWS handles cluster provisioning, node configuration, application tuning, and cluster maintenance, allowing data engineers to focus on analytics and processing petabyte-scale datasets.",
  "whyItMatters": "Building and maintaining on-premises Hadoop or Spark clusters requires extensive hardware procurement, manual node patching, high operational overhead, and complex capacity planning. Amazon EMR simplifies this by decoupling compute from storage, provisioning elastic clusters in minutes, and integrating natively with Amazon S3, AWS Glue, and AWS KMS.",
  "workplaceExample": "A retail company ingests terabytes of clickstream logs daily into Amazon S3. Instead of maintaining an expensive 24/7 on-premises cluster, they launch an automated, transient Amazon EMR cluster every midnight to process and aggregate the data into Amazon Redshift, terminating the cluster as soon as processing finishes to minimize costs.",
  "examFocus": "Understand that Amazon EMR is the primary AWS service for running open-source big-data processing frameworks (Spark, Hadoop, Hive, Presto, HBase, Flink). Recognize when to use transient clusters (spun up for a specific job and terminated immediately) versus long-running clusters (kept active for continuous processing or interactive queries).",
  "keyPoints": [
    "Amazon EMR provisions, configures, and manages open-source big-data analytics frameworks at scale.",
    "Supports leading open-source frameworks including Apache Spark, Apache Hadoop (YARN, MapReduce, HDFS), Apache Hive, Presto, Trino, Apache Flink, and Apache HBase.",
    "Decouples compute from storage by leveraging Amazon S3 via the EMR File System (EMRFS) as the persistent data lake.",
    "Supports both transient clusters (ephemeral clusters that terminate after completing steps) and long-running clusters for multi-tenant analytics.",
    "Integrates natively with AWS Glue Data Catalog for metadata, AWS IAM for access control, AWS KMS for encryption, and Amazon CloudWatch for monitoring.",
    "Provides significant performance improvements over standard open-source releases through AWS-optimized runtimes for Spark, Hive, and Presto."
  ],
  "commonMistake": "Confusing Amazon EMR with Amazon Athena or AWS Glue ETL. Amazon EMR provides full control over underlying distributed cluster frameworks and runtime configurations, whereas Athena is a serverless interactive SQL query tool and Glue ETL is a fully serverless data integration engine.",
  "example": "Launch an EMR cluster via the AWS CLI or SDK specifying release label emr-6.15.0, applications Spark and Hive, an S3 bucket for log delivery, and an auto-terminating step that runs a PySpark transformation script.",
  "sources": [
    {
      "title": "What is Amazon EMR?",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html"
    },
    {
      "title": "Amazon EMR Architecture Overview",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-overview.html"
    }
  ]
});
