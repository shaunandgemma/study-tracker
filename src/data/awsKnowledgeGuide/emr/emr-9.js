import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-9",
  "title": "EMR Serverless",
  "plainEnglish": "Amazon EMR Serverless is a serverless deployment option for running big-data analytics applications using open-source frameworks like Apache Spark and Apache Hive. With EMR Serverless, you do not need to configure, manage, optimize, or scale EC2 clusters; AWS automatically provisions, tunes, and scales compute and memory resources to match your application demand.",
  "whyItMatters": "Managing dedicated EC2 clusters introduces operational overhead, idle capacity costs, and capacity planning challenges. EMR Serverless eliminates infrastructure management, starts jobs quickly, scales dynamically from zero to thousands of vCPUs, and charges strictly for the aggregate vCPU, memory, and storage resources consumed per second.",
  "workplaceExample": "A data analytics team runs sporadic ETL jobs triggered by event-driven AWS Step Functions when new partner files land in S3. Instead of keeping a dedicated EMR cluster running 24/7 or waiting several minutes to provision an EC2 cluster, they submit Spark jobs directly to an EMR Serverless application, paying only for the 4 minutes each job executes.",
  "examFocus": "Understand the three EMR deployment models: EMR on EC2 (maximum control over instances and OS), EMR on EKS (shared container infrastructure on Kubernetes), and EMR Serverless (fully managed, no cluster provisioning, pay-per-second compute). Choose EMR Serverless when you want to run Spark/Hive without cluster management and avoid paying for idle infrastructure.",
  "keyPoints": [
    "EMR Serverless enables running Apache Spark and Apache Hive applications without provisioning or managing cluster infrastructure.",
    "Automatically scales compute and memory resources up and down based on real-time job workload requirements.",
    "Billing is granular and based on the exact vCPU, memory (GB), and storage (GB) resources consumed per second during job execution.",
    "Supports 'Pre-initialized Capacity' (warm pools of workers) to eliminate cold starts and achieve sub-second job start times.",
    "Supports custom Docker container images, allowing teams to package custom dependencies and proprietary libraries.",
    "Integrates securely with Amazon VPC for private subnet access, AWS Glue Data Catalog for metadata, and IAM execution roles for fine-grained permissions."
  ],
  "commonMistake": "Assuming EMR Serverless supports all Hadoop ecosystem tools like Presto, Trino, Flink, or HBase. EMR Serverless specifically targets Apache Spark and Apache Hive workloads; for frameworks like Trino or HBase, use EMR on EC2.",
  "example": "Create an EMR Serverless Spark application using the AWS CLI: aws emr-serverless create-application --type 'SPARK' --name 'daily-etl-app' --release-label 'emr-6.15.0' --initial-capacity '{\"DRIVER\":{\"workerCount\":1,\"workerConfiguration\":{\"cpu\":\"2vCPU\",\"memory\":\"4GB\"}}}'.",
  "sources": [
    {
      "title": "What is Amazon EMR Serverless?",
      "url": "https://docs.aws.amazon.com/emr/latest/EMR-Serverless-UserGuide/what-is-emr-serverless.html"
    },
    {
      "title": "Key Concepts in Amazon EMR Serverless",
      "url": "https://docs.aws.amazon.com/emr/latest/EMR-Serverless-UserGuide/emr-serverless-concepts.html"
    }
  ]
});
