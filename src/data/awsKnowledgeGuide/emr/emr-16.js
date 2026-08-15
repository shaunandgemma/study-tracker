import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-16",
  "title": "HDFS Storage",
  "plainEnglish": "Hadoop Distributed File System (HDFS) is the native distributed, scalable, and portable file system used by Apache Hadoop and Spark across the Core nodes of an Amazon EMR cluster. It distributes file blocks across attached Amazon EBS volumes or instance store disks on Core nodes, providing high-throughput sequential data access.",
  "whyItMatters": "While Amazon S3 via EMRFS is the recommended choice for persistent long-term storage, HDFS provides low-latency local disk I/O for heavy intermediate computation, map-side caching, shuffle files, and iterative algorithmic workloads that require intense read/write operations during cluster execution.",
  "workplaceExample": "A data science team trains deep neural networks and complex graph algorithms on an EMR cluster using Apache Spark GraphX. Because the iterative algorithm reads and rewrites state thousands of times across hundreds of iterations, they use local HDFS mounted on NVMe instance store SSDs on Core nodes for high-throughput intermediate caching before writing final models to S3.",
  "examFocus": "Know that HDFS exists strictly across the Primary and Core nodes of an EMR cluster, and data in HDFS is ephemeral—it is permanently lost when the cluster terminates. Understand that HDFS replication factor defaults to 3 (or 1 for 1-node clusters, 2 for 2-node clusters) and that Core nodes cannot be terminated arbitrarily without proper decommissioning to avoid HDFS block corruption.",
  "keyPoints": [
    "HDFS is distributed across the Core nodes of an EMR cluster, managed by the NameNode daemon on the Primary node and DataNode daemons on Core nodes.",
    "Data stored in HDFS is ephemeral and is tied to the cluster lifecycle; terminating the EMR cluster destroys all data in HDFS.",
    "Provides extremely high sequential I/O throughput, making it optimal for intermediate shuffle data, temporary scratch files, and iterative ML algorithms.",
    "HDFS replication factor on EMR defaults to 3 for clusters with 3 or more Core nodes, ensuring block availability if a single Core node fails.",
    "Core nodes must undergo graceful decommissioning when downsizing an EMR cluster to allow HDFS to replicate remaining blocks to healthy nodes.",
    "Best practice in AWS architecture is to use HDFS for temporary processing files while storing master source and output datasets in Amazon S3 via EMRFS."
  ],
  "commonMistake": "Storing production source data or final analytics outputs in HDFS without copying them to Amazon S3. If the EMR cluster is accidentally shut down, fails health checks, or auto-terminates after a step completes, all HDFS data is permanently destroyed.",
  "example": "Inspect HDFS disk usage on an active EMR cluster via SSH using standard Hadoop commands: hdfs dfs -df -h or copy intermediate files from HDFS to Amazon S3 using s3-dist-cp: s3-dist-cp --src hdfs:///tmp/processed_data/ --dest s3://my-lake-bucket/output/.",
  "sources": [
    {
      "title": "Hadoop Distributed File System (HDFS) on Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-file-systems.html"
    },
    {
      "title": "Configuring HDFS Storage on Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-storage.html"
    }
  ]
});
