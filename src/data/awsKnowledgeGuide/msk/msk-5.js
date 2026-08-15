import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-5",
  "title": "MSK Serverless",
  "plainEnglish": "Amazon MSK Serverless is a cluster type for Amazon MSK that makes it easy for you to run Apache Kafka without having to manage and scale cluster capacity. MSK Serverless automatically provisions and scales compute and storage resources in response to application streaming demand, allowing you to pay only for the exact streaming throughput and partition storage you consume.",
  "whyItMatters": "New streaming applications, microservices with intermittent or spiky workloads, and development/testing environments often suffer from over-provisioning (paying for idle brokers) or under-provisioning (throttling during traffic surges). MSK Serverless eliminates broker sizing, storage capacity planning, and manual partition rebalancing.",
  "workplaceExample": "A fintech startup launches an unpredictable real-time fraud alert microservice. Instead of guessing how many `kafka.m5.large` brokers to provision and paying for 24/7 idle servers, they create an Amazon MSK Serverless cluster. The cluster automatically scales throughput up to absorb unexpected transaction spikes and scales back down when traffic subsides, billing strictly for data ingested and partition storage.",
  "examFocus": "Understand MSK Serverless characteristics and limitations: (1) Scaling: Automatically scales throughput up to 200 MB/s write and 400 MB/s read per cluster (up to 5 MB/s ingress and 10 MB/s egress per partition). (2) Storage: Up to 250 GiB per partition, scaling automatically. (3) Authentication: Requires AWS IAM authentication (SASL/IAM) exclusively (no mTLS or SASL/SCRAM). (4) Retention: Maximum retention is 1 day (24 hours) by default, configurable up to 8 hours to 7 days.",
  "keyPoints": [
    "Fully serverless Apache Kafka cluster type with automatic capacity scaling and no broker management.",
    "Billed based on cluster hours, partition hours, and data throughput (ingress/egress GBs).",
    "Requires AWS IAM access control (SASL/IAM) for client authentication and authorization.",
    "Storage per partition scales automatically up to 250 GiB per partition.",
    "Enforces high availability by automatically replicating data across multiple Availability Zones in the Region.",
    "Ideal for spiky or unpredictable workloads, development/staging environments, and applications requiring minimal operational overhead."
  ],
  "commonMistake": "Attempting to use mutual TLS (mTLS) or username/password (SASL/SCRAM) authentication with MSK Serverless. MSK Serverless exclusively supports AWS IAM authentication; for mTLS or SASL/SCRAM, use MSK Provisioned.",
  "example": "Create an MSK Serverless cluster in a VPC using the AWS CLI: aws kafka create-cluster-v2 --cluster-name serverless-telemetry --cluster-type SERVERLESS --serverless '{\"VpcConfigs\": [{\"SubnetIds\": [\"subnet-111\", \"subnet-222\", \"subnet-333\"], \"SecurityGroupIds\": [\"sg-12345\"]}]}'.",
  "sources": [
    {
      "title": "Amazon MSK Serverless Overview and Getting Started",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/serverless.html"
    },
    {
      "title": "Amazon MSK Serverless Quotas and Limitations",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/serverless-limitations.html"
    }
  ]
});
