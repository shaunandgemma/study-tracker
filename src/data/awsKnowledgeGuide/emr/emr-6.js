import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-6",
  "title": "Apache Hive",
  "plainEnglish": "Apache Hive is an open-source distributed data warehouse software system built on top of Apache Hadoop. It allows analysts and engineers to query and manage massive datasets stored in distributed storage (such as Amazon S3 or HDFS) using an SQL-like declarative language called HiveQL.",
  "whyItMatters": "Before Hive, engineers had to write complex low-level Java MapReduce code to process data on Hadoop. Hive translates familiar SQL queries into distributed jobs executed by execution engines like Apache Tez or MapReduce. On Amazon EMR, Hive can use AWS Glue Data Catalog as its central metastore, enabling shared schema definitions across EMR, Athena, and Redshift.",
  "workplaceExample": "A logistics enterprise receives millions of shipment telemetry records every hour in JSON format on S3. They use Apache Hive on an EMR cluster to create external partitioned tables over S3, run HiveQL queries to clean and convert raw data into columnar ORC format, and store metadata in the AWS Glue Data Catalog.",
  "examFocus": "Remember that Hive provides an SQL abstraction over Hadoop storage. Focus on Hive metastore options on AWS: by default, Hive on EMR uses an ephemeral MySQL database on the primary node (lost upon termination), but for persistence across clusters, you must configure Hive to use the AWS Glue Data Catalog or an external Amazon RDS MySQL/Aurora database.",
  "keyPoints": [
    "Apache Hive provides a SQL-like interface (HiveQL) to query and analyze structured and semi-structured datasets in distributed storage.",
    "Hive translates SQL queries into directed acyclic graphs of execution tasks, typically executed using Apache Tez or MapReduce on EMR.",
    "A Hive metastore holds catalog metadata (table names, column types, partition schemes, and storage locations).",
    "On Amazon EMR, Hive seamlessly integrates with the AWS Glue Data Catalog as a persistent, serverless external metastore.",
    "Supports partitioning and bucketing strategies, as well as optimized columnar storage formats like Apache ORC and Apache Parquet for fast query performance.",
    "Allows users to create external tables pointing directly to S3 (e.g., s3://my-bucket/data/), ensuring data remains intact even if the EMR cluster is terminated."
  ],
  "commonMistake": "Relying on the default local Hive metastore on the EMR primary node for production data pipelines. When the cluster is shut down or terminated, the local metastore database is destroyed; always use AWS Glue Data Catalog or Amazon RDS for persistent metadata.",
  "example": "Configure an EMR cluster with Hive to use AWS Glue as the metastore by enabling the Glue Data Catalog setting in the AWS Management Console or setting hive.metastore.client.factory.class in hive-site configuration.",
  "sources": [
    {
      "title": "Apache Hive on Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-hive.html"
    },
    {
      "title": "Using AWS Glue Data Catalog as the Metastore for Hive",
      "url": "https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-hive-metastore-glue.html"
    }
  ]
});
