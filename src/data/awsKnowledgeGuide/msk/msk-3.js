import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-3",
  "title": "MSK Managed Apache Kafka",
  "plainEnglish": "Amazon MSK Managed Apache Kafka provides production-ready, highly available Apache Kafka clusters that run standard open-source Apache Kafka software versions. AWS handles cluster health monitoring, control plane management (ZooKeeper/KRaft), OS maintenance, and automatic broker hardware replacement, while giving you 100% native API compatibility with existing Apache Kafka producers, consumers, Kafka Connect plugins, and schema registries.",
  "whyItMatters": "Organizations with deep investments in Apache Kafka ecosystems (e.g., custom Java Kafka Streams, Spring Cloud Stream, or Confluent Kafka connectors) often want to avoid lock-in while eliminating self-hosted server operations. Amazon MSK allows developers to point their existing Kafka tools and client code to AWS-managed bootstrap brokers with zero application code rewrites.",
  "workplaceExample": "A telecommunications enterprise runs an on-premises 40-broker Kafka cluster for network fault monitoring. Rather than rewriting their ingestion pipelines to AWS proprietary streaming services, they deploy an Amazon MSK cluster running Kafka 3.6, update their producer bootstrap server configuration strings to point to the MSK VPC endpoints, and achieve identical streaming semantics with automated AWS infrastructure management.",
  "examFocus": "Understand the managed responsibility model for MSK: (1) AWS Manages: Broker provisioning, OS patching, underlying EC2 hardware failure recovery, multi-AZ high availability, and metadata management (ZooKeeper / KRaft). (2) Customer Manages: Topic creation, partition counts, replication factor per topic, consumer group lag monitoring, client authentication/authorization, and cluster sizing.",
  "keyPoints": [
    "Runs 100% open-source, upstream Apache Kafka versions with native protocol and API compatibility.",
    "Eliminates operational management of Kafka control planes and broker hardware.",
    "Supports seamless migration from on-premises Kafka with standard Kafka producer and consumer libraries.",
    "Offers rolling software and version upgrades with zero cluster downtime.",
    "Integrates natively with AWS services including AWS KMS, IAM, CloudWatch, and AWS Secrets Manager.",
    "Allows custom Kafka server configurations (server.properties) via MSK Configuration Revisions."
  ],
  "commonMistake": "Expecting AWS to automatically manage topic creation and partition sizing in MSK Provisioned clusters. While AWS manages the underlying broker instances and storage hardware, topic design, partition counts, replication factors, and consumer groups are entirely the customer's responsibility.",
  "example": "List Kafka topics on an MSK cluster using the standard Kafka CLI tool via bootstrap brokers: kafka-topics.sh --bootstrap-server b-1.telemetry.xxxxxx.c3.kafka.us-east-1.amazonaws.com:9092 --list.",
  "sources": [
    {
      "title": "Amazon MSK Developer Guide - What is Amazon MSK?",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html"
    },
    {
      "title": "Supported Apache Kafka Versions in Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/kafka-version.html"
    }
  ]
});
