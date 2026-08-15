import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-22",
  "title": "EMR vs AWS Glue",
  "plainEnglish": "Amazon EMR and AWS Glue are both AWS data integration and processing services, but they differ fundamentally in operational abstraction and ecosystem breadth. Amazon EMR is a comprehensive big-data platform that provides managed clusters and serverless options for open-source frameworks (Spark, Hadoop, Hive, Presto, HBase, Flink), whereas AWS Glue is a fully serverless, event-driven data integration service centered on automated ETL, schema discovery (Glue Crawlers), and metadata management (Glue Data Catalog).",
  "whyItMatters": "Selecting between EMR and AWS Glue determines the operational overhead, flexibility, and cost structure of your data architecture. AWS Glue eliminates cluster operations and infrastructure management for standard ETL jobs billed per Data Processing Unit (DPU) hour. Amazon EMR gives deeper control over compute hardware (such as GPUs and Graviton instances), custom software installations, and complex distributed engines beyond standard Spark ETL.",
  "workplaceExample": "An enterprise uses AWS Glue ETL jobs with automated crawlers to ingest, catalog, and clean structured CSV and JSON data from operational RDS databases into S3 Parquet tables. For their complex graph analytics and large-scale petabyte deep learning transformations requiring specialized GPU clusters and custom C++ packages, they run Amazon EMR clusters.",
  "examFocus": "Compare EMR vs. Glue for data engineering questions: Choose AWS Glue for serverless ETL pipelines, automated schema discovery with Crawlers, centralized metadata (Glue Data Catalog), and out-of-the-box data transformations with minimal maintenance. Choose Amazon EMR when you require non-Spark frameworks (HBase, Presto, Trino, Flink), custom cluster configurations, SSH access, specialized instance hardware (GPUs/Graviton), or fine-grained control over Spark/Hadoop internals.",
  "keyPoints": [
    "AWS Glue is a serverless data integration service offering ETL jobs, Glue Data Catalog, automated Crawlers, and Glue DataBrew.",
    "Glue ETL jobs are serverless and billed per DPU (Data Processing Unit) consumed per second, with no cluster management required.",
    "Amazon EMR is a broader big-data platform supporting diverse open-source engines (Spark, Hadoop, Hive, Trino, Presto, Flink, HBase).",
    "EMR provides complete control over the underlying compute environment (EC2 instance types, EBS volumes, custom AMIs, bootstrap actions, OS tuning).",
    "Glue and EMR work synergistically: EMR clusters routinely use the AWS Glue Data Catalog as their central, persistent Hive metastore.",
    "Choose Glue for standard serverless ETL workflows; choose EMR for specialized big data processing, non-standard frameworks, or massive long-running cluster workloads."
  ],
  "commonMistake": "Viewing AWS Glue and Amazon EMR as mutually exclusive competitors. In enterprise architectures, AWS Glue Data Catalog serves as the shared metadata store for Amazon EMR, Amazon Athena, and Amazon Redshift, while Glue ETL and EMR handle different classes of data transformation jobs.",
  "example": "Use AWS Glue ETL to automatically crawl an S3 landing zone, infer schemas, and transform JSON records to Parquet; use Amazon EMR with Trino or Spark for large-scale interactive querying and complex distributed machine learning model training.",
  "sources": [
    {
      "title": "AWS Glue Overview and Comparison",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/big-data-analytics-options/aws-glue.html"
    },
    {
      "title": "Amazon EMR Overview and Analytics Options",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html"
    }
  ]
});
