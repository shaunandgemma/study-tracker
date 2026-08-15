import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-19",
  "title": "MSK vs Kinesis Data Streams",
  "plainEnglish": "Amazon MSK and Amazon Kinesis Data Streams are two core streaming data services on AWS built for real-time streaming ingestion and processing, but they differ in software ecosystems, management overhead, and architectural control. Amazon MSK provides managed Apache Kafka clusters with 100% open-source Kafka API compatibility, custom configurations, and Kafka Connect integration. Amazon Kinesis Data Streams is an AWS-native, fully serverless streaming service designed for seamless integration with AWS services like Lambda and Firehose.",
  "whyItMatters": "Choosing between MSK and Kinesis determines application portability, developer velocity, and long-term maintenance. Organizations migrating existing on-premises Kafka applications or requiring multi-cloud Kafka compatibility choose Amazon MSK. Organizations building greenfield AWS-native serverless architectures with minimal operational management choose Kinesis Data Streams.",
  "workplaceExample": "An enterprise digital banking platform uses both services across different domains: They deploy Amazon MSK for their core transactional ledger to maintain compatibility with an existing Java Kafka Streams microservices framework and Confluent schema registries. Concurrently, they use Amazon Kinesis Data Streams for their mobile marketing clickstream analytics due to its zero-maintenance On-Demand capacity scaling and native direct delivery into Amazon Data Firehose.",
  "examFocus": "Compare MSK vs Kinesis Data Streams for AWS certification exams: (1) Ecosystem: MSK = Open-source Apache Kafka APIs, Kafka Connect, Schema Registry, Kafka Streams; Kinesis = AWS SDK, KPL, KCL, Lambda ESM. (2) Capacity/Scaling: Kinesis = Shard-based (Provisioned or On-Demand); MSK = Broker instances (Provisioned) or MSK Serverless. (3) Retention: Kinesis = 24 hours to 365 days; MSK = Configurable indefinitely on brokers or via MSK Tiered Storage. (4) Pricing: Kinesis = Shard-hours/payload GBs; MSK = Broker instance-hours + EBS storage.",
  "keyPoints": [
    "Amazon MSK delivers managed open-source Apache Kafka with 100% Kafka API and ecosystem compatibility.",
    "Amazon Kinesis Data Streams is a proprietary, AWS-native, fully serverless streaming data service.",
    "MSK is ideal for migrating existing Kafka applications, custom Kafka Connect plugins, and Kafka Streams libraries.",
    "Kinesis Data Streams is ideal for rapid AWS-native development with built-in integrations for Lambda and Firehose.",
    "MSK supports virtually unlimited data retention via Tiered Storage; Kinesis retains data up to 365 days.",
    "Kinesis offers instant On-Demand scaling; MSK offers dedicated broker customization or MSK Serverless."
  ],
  "commonMistake": "Choosing Amazon MSK for a simple, greenfield AWS-native serverless application that only needs to trigger AWS Lambda. Unless you specifically require Apache Kafka APIs, Kafka connectors, or open-source compatibility, Kinesis Data Streams provides a simpler, more tightly integrated serverless experience.",
  "example": "Choose Amazon MSK when migrating an enterprise application that relies on the Kafka Producer/Consumer Java API and Kafka Connect JDBC sinks; choose Amazon Kinesis Data Streams when building a new serverless mobile event ingestion pipeline triggering AWS Lambda and delivering to Amazon S3 via Firehose.",
  "sources": [
    {
      "title": "Real-Time Analytics on AWS - Amazon Kinesis vs Amazon MSK",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/real-time-analytics-on-aws/amazon-kinesis-vs-amazon-msk.html"
    },
    {
      "title": "Amazon MSK Getting Started and Use Cases",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html"
    }
  ]
});
