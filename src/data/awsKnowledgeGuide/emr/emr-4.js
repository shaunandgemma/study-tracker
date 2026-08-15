import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-4",
  "title": "Apache Hadoop",
  "plainEnglish": "Apache Hadoop is an open-source framework designed for distributed storage and processing of massive datasets across clusters of computers. Its core architecture consists of Hadoop Distributed File System (HDFS) for data storage, MapReduce for distributed parallel data computation, and YARN (Yet Another Resource Negotiator) for managing cluster resources and scheduling jobs.",
  "whyItMatters": "Hadoop laid the foundational architecture for modern big-data systems. On Amazon EMR, Hadoop components are pre-configured, battle-tested, and optimized to run seamlessly on AWS infrastructure, allowing legacy Hadoop jobs and distributed batch workloads to scale dynamically without managing physical servers.",
  "workplaceExample": "A telecommunications company maintains a legacy Java MapReduce codebase that analyzes billions of call detail records (CDRs). They migrate their on-premises Hadoop workload to an Amazon EMR cluster running Hadoop and YARN, utilizing Amazon S3 for long-term storage and auto-scaling EC2 instances for compute capacity.",
  "examFocus": "Understand the three foundational building blocks of Hadoop: MapReduce (parallel compute engine), YARN (cluster resource manager and job scheduler), and HDFS (distributed file system). Know that EMR integrates Hadoop with AWS services, such as using EMRFS to read and write directly to Amazon S3 instead of relying exclusively on HDFS.",
  "keyPoints": [
    "Hadoop consists of three primary components: MapReduce (distributed processing), YARN (resource management), and HDFS (distributed storage).",
    "YARN acts as the architectural center, managing cluster compute resources (CPU, memory) and scheduling containers for applications like MapReduce, Spark, and Tez.",
    "MapReduce processes massive datasets in two main phases: the 'Map' phase filters and distributes data chunks, and the 'Reduce' phase aggregates intermediate outputs.",
    "Amazon EMR optimizes Hadoop by allowing YARN to schedule tasks across dynamically scalable EC2 instances while persisting source and result data in Amazon S3.",
    "Hadoop on EMR supports standard Hadoop ecosystem tools including Ganglia for metrics, Hue for interactive querying, and Apache Pig for data-flow scripts.",
    "Transient EMR clusters can execute Hadoop MapReduce jar steps and shut down automatically upon step completion."
  ],
  "commonMistake": "Believing that Hadoop requires local HDFS storage for all data on AWS. In Amazon EMR, while HDFS is available for transient shuffle data, best practice is to use Amazon S3 as the primary persistent data store via EMRFS.",
  "example": "Submit a custom Hadoop MapReduce jar job as an EMR cluster step, configuring YARN memory allocation parameters in yarn-site.xml and pointing input/output paths directly to S3 URIs (s3://my-analytics-bucket/input/ and s3://my-analytics-bucket/output/).",
  "sources": [
    {
      "title": "Apache Hadoop on Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-hadoop.html"
    },
    {
      "title": "Hadoop Architecture and Components",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-overview.html"
    }
  ]
});
