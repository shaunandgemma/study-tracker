import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-1",
  "title": "Fully Managed Apache Kafka Clusters (Provisioned vs Serverless)",
  "plainEnglish": "Amazon Managed Streaming for Apache Kafka (Amazon MSK) is a fully managed service that simplifies building and running applications that use open-source Apache Kafka to process streaming data. Amazon MSK offers two cluster deployment options: MSK Provisioned (where you select broker instance sizes, storage capacity, and Availability Zones for predictable workloads) and MSK Serverless (which automatically provisions, scales, and manages streaming capacity on demand without configuring brokers or storage).",
  "whyItMatters": "Running self-managed Apache Kafka requires significant operational overhead, including provisioning EC2 instances, configuring ZooKeeper or KRaft metadata nodes, managing disk volume expansions, replacing failed brokers, and executing complex partition rebalances. Amazon MSK automates cluster creation, patching, broker replacement, and high availability, letting development teams use native Kafka client code and ecosystem tools without infrastructure burdens.",
  "workplaceExample": "A retail bank migrates its on-premises Apache Kafka cluster to Amazon MSK Provisioned clusters across three Availability Zones to support high-volume transaction processing. For a separate, newly launched mobile loyalty rewards application with unpredictable traffic spikes, the team deploys Amazon MSK Serverless, allowing the loyalty microservice to stream points and rewards without capacity planning or paying for idle brokers.",
  "examFocus": "Compare MSK Provisioned vs MSK Serverless for AWS certification exams: (1) MSK Provisioned: Select broker instance types (e.g., kafka.m5.large), customize EBS storage (with Auto Scaling), manage Kafka configuration parameters, supports tiered storage and multiple authentication methods (mTLS, SASL/SCRAM, IAM). (2) MSK Serverless: Automatic scaling of partition throughput and storage, no broker management, charges based on cluster hours, partition hours, and data in/out; authenticates exclusively via AWS IAM (SASL/IAM).",
  "keyPoints": [
    "Fully managed Apache Kafka service compatible with native open-source Kafka APIs and client libraries.",
    "MSK Provisioned: Dedicated broker instances (kafka.t3/m5/m7g), customizable EBS storage, and custom Kafka configuration parameters.",
    "MSK Serverless: Fully automated scaling of compute and storage without broker provisioning or sizing.",
    "Native Kafka compatibility allows seamless migration of existing producer/consumer code without rewriting client applications.",
    "MSK Provisioned supports multi-AZ architectures across 2 or 3 Availability Zones with automated broker recovery.",
    "MSK Serverless uses AWS IAM access control (SASL/IAM) exclusively for client authentication and authorization."
  ],
  "commonMistake": "Assuming MSK Serverless supports all third-party Kafka plugins and authentication mechanisms (like mutual TLS or SASL/SCRAM). MSK Serverless currently requires AWS IAM authentication; for mTLS, SASL/SCRAM, or custom broker configuration overrides, choose MSK Provisioned.",
  "example": "Create an MSK Provisioned cluster with 3 brokers across 3 subnets using the AWS CLI: aws kafka create-cluster --cluster-name telemetry-cluster --broker-node-group-info InstanceType=kafka.m5.large,ClientSubnets=subnet-111,subnet-222,subnet-333,SecurityGroups=sg-12345,StorageInfo='{EbsStorageInfo:{VolumeSize:100}}' --kafka-version 3.5.1 --number-of-broker-nodes 3.",
  "sources": [
    {
      "title": "What is Amazon MSK?",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html"
    },
    {
      "title": "Amazon MSK Serverless Overview",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/serverless.html"
    }
  ]
});
