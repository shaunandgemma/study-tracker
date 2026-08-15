import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-7",
  "title": "Presto and Trino Workloads",
  "plainEnglish": "Presto and Trino are fast, open-source distributed SQL query engines designed for running interactive, ad-hoc analytical queries at massive scale. Unlike batch engines that write intermediate results to disk, Presto and Trino execute queries entirely in memory across a cluster, allowing data analysts to query petabytes of data in Amazon S3, relational databases, and NoSQL stores with sub-second to minute response times.",
  "whyItMatters": "While frameworks like MapReduce and Hive are built for batch ETL workloads where fault tolerance and checkpointing to disk are critical, business intelligence analysts require fast, interactive response times. Presto and Trino on Amazon EMR provide an MPP (massively parallel processing) query layer that connects to disparate data sources without needing to migrate or transform the underlying data first.",
  "workplaceExample": "A marketing analytics team needs to join real-time user clickstream data stored in Amazon S3 (Parquet format) with customer demographic records stored in an Amazon Aurora PostgreSQL database. They deploy a long-running EMR cluster with Trino installed, allowing BI dashboards in Tableau to execute federated SQL joins across both sources in real time.",
  "examFocus": "Know that Presto/Trino is designed for interactive and ad-hoc SQL querying over large datasets (especially S3 data lakes and federated data sources), not for long-running batch ETL jobs that require mid-query fault tolerance. Amazon Athena is actually powered by Presto/Trino under the hood as a serverless service, whereas EMR gives you dedicated Presto/Trino clusters with full configuration control.",
  "keyPoints": [
    "Presto and Trino are distributed MPP query engines optimized for low-latency, interactive SQL analytics over large datasets.",
    "Execute queries in memory with pipelined execution across worker nodes rather than writing intermediate state to disk.",
    "Support data federation via connectors, enabling single queries to join data across Amazon S3, Hive metastores, PostgreSQL, MySQL, Cassandra, and MongoDB.",
    "Integrated with the AWS Glue Data Catalog on Amazon EMR, enabling seamless schema discovery and table metadata resolution.",
    "Best suited for BI queries, dashboarding, exploratory data analysis, and ad-hoc joins across heterogeneous data stores.",
    "Unlike batch engines (like MapReduce or Spark with checkpointing), a failure of a single worker node during a standard Presto query typically requires re-running the query."
  ],
  "commonMistake": "Choosing Presto or Trino for multi-hour, heavy data-transformation ETL pipelines. Because Presto/Trino holds intermediate state in memory without writing checkpoint stages to disk, very long batch jobs can run out of memory or fail if a worker restarts; use Apache Spark or Hive for heavy batch ETL instead.",
  "example": "Launch an EMR cluster with the Trino application installed, configure the Hive connector to use the AWS Glue Data Catalog as metastore, and run an interactive SQL query via the Trino CLI: SELECT c.name, count(o.id) FROM hive.sales.orders o JOIN postgres.crm.customers c ON o.customer_id = c.id GROUP BY c.name;.",
  "sources": [
    {
      "title": "Presto on Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-presto.html"
    },
    {
      "title": "Trino on Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-trino.html"
    }
  ]
});
