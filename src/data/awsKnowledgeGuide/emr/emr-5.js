import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-5",
  "title": "Apache Spark",
  "plainEnglish": "Apache Spark is an open-source, distributed general-purpose cluster-computing framework designed for fast computation. Unlike disk-heavy MapReduce, Spark processes data in-memory using resilient distributed datasets (RDDs) and DataFrames, making it up to 100 times faster for complex iterative algorithms, machine learning pipelines, and stream processing.",
  "whyItMatters": "Apache Spark has become the industry standard for large-scale data engineering and data science. Amazon EMR includes an Amazon EMR runtime for Apache Spark that is optimized for AWS infrastructure, executing queries up to 3 times faster and with 100% API compatibility compared to standard open-source Apache Spark.",
  "workplaceExample": "A fintech data engineering team runs real-time fraud detection and daily financial reconciliations. They write PySpark scripts that read parquet files from Amazon S3, perform complex windowing aggregations in memory across an EMR cluster, and output cleaned summary metrics into an Amazon S3 data lake partitioned by date.",
  "examFocus": "Know that Apache Spark is optimized for in-memory batch processing, streaming (Spark Streaming / Structured Streaming), machine learning (MLlib), and graph analytics (GraphX). Recognize that EMR provides an optimized Spark runtime, supports dynamic allocation on YARN, and integrates with AWS Glue Data Catalog as an external Hive metastore.",
  "keyPoints": [
    "Apache Spark provides in-memory distributed data processing using DataFrames, Datasets, and Resilient Distributed Datasets (RDDs).",
    "Includes rich built-in libraries: Spark SQL for structured querying, Spark Streaming for near-real-time streaming, MLlib for machine learning, and GraphX for graph processing.",
    "The Amazon EMR runtime for Apache Spark is an optimized execution engine that runs workloads up to 3x faster than standard open-source Spark without requiring code modifications.",
    "Spark on EMR uses YARN as the cluster resource manager, dynamically allocating executors across core and task nodes as demand shifts.",
    "Integrates directly with the AWS Glue Data Catalog, allowing Spark SQL applications to share database and table definitions seamlessly with Athena and Redshift Spectrum.",
    "Supports interactive development via EMR Studio, Jupyter notebooks, Zeppelin notebooks, and command-line spark-shell / pyspark."
  ],
  "commonMistake": "Assuming Spark stores persistent data across cluster shutdowns. Spark is a compute framework; all input and output data must be saved to durable storage like Amazon S3 or a managed database to persist after the EMR cluster terminates.",
  "example": "Submit a Spark application to an EMR cluster using the spark-submit command: spark-submit --deploy-mode cluster --master yarn --conf spark.sql.catalogImplementation=hive s3://my-bucket/scripts/etl_job.py.",
  "sources": [
    {
      "title": "Apache Spark on Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-spark.html"
    },
    {
      "title": "Amazon EMR Runtime for Apache Spark",
      "url": "https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-spark-performance.html"
    }
  ]
});
