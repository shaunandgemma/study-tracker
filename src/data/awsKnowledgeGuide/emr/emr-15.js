import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-15",
  "title": "EMRFS with Amazon S3",
  "plainEnglish": "EMRFS (EMR File System) is an implementation of the Hadoop Distributed File System (HDFS) that allows Amazon EMR clusters to read and write data directly to and from Amazon Simple Storage Service (Amazon S3). By using EMRFS, big-data applications treat Amazon S3 objects exactly like native files in a distributed file system.",
  "whyItMatters": "Coupling compute and storage inside local HDFS requires keeping expensive clusters running 24/7 just to preserve data. EMRFS decouples compute from storage, enabling data to persist in highly durable (11 9s) Amazon S3 at low cost while compute clusters can be launched, scaled, resized, and terminated on demand without moving data.",
  "workplaceExample": "An e-commerce company maintains an enterprise data lake on Amazon S3 holding 5 PB of clickstream and order history. Rather than maintaining a 200-node persistent HDFS cluster, multiple departments launch independent, short-lived EMR clusters that read the shared S3 dataset via EMRFS (s3://company-datalake/) and write analytical outputs back to S3.",
  "examFocus": "Understand that EMRFS enables EMR clusters to use Amazon S3 as the primary persistent object store. Know that modern Amazon S3 offers strong read-after-write consistency automatically across all AWS regions (rendering the legacy EMRFS Consistent View feature obsolete and deprecated). Recognize EMRFS encryption options (SSE-S3, SSE-KMS, CSE-KMS, CSE-C).",
  "keyPoints": [
    "EMRFS provides a Hadoop-compatible connector allowing Spark, Hive, Hadoop, and Presto to interact directly with Amazon S3 using s3:// URIs.",
    "Decouples compute from storage, allowing independent scaling of compute clusters and persistent data lakes.",
    "Amazon S3 provides 99.999999999% (11 9s) data durability and strong read-after-write consistency for all PUT and DELETE requests.",
    "Supports transparent data encryption at rest using AWS KMS (server-side SSE-KMS or client-side CSE-KMS) and S3-managed keys (SSE-S3).",
    "Supports EMRFS S3 authorization and role mapping, allowing IAM roles to be scoped down to specific S3 bucket prefixes per EMR step or user.",
    "Eliminates the cost and operational overhead of maintaining large, permanent HDFS storage clusters."
  ],
  "commonMistake": "Believing that EMRFS Consistent View is still required for EMR clusters. Amazon S3 now natively provides strong read-after-write consistency for all metadata and object operations out of the box, making legacy EMRFS Consistent View metadata tables unnecessary.",
  "example": "Configure an EMR cluster step to read input datasets and write partitioned results directly to S3 via EMRFS: spark.read.parquet('s3://analytics-lake/raw/').groupBy('region').count().write.parquet('s3://analytics-lake/summary/').",
  "sources": [
    {
      "title": "Amazon EMR File System (EMRFS)",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-file-systems.html"
    },
    {
      "title": "Configuring S3 Encryption with EMRFS",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-emrfs-encryption.html"
    }
  ]
});
