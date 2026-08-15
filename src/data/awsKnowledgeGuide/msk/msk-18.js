import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-18",
  "title": "MSK Monitoring with CloudWatch",
  "plainEnglish": "Amazon MSK Monitoring with CloudWatch provides deep visibility into the performance, health, and throughput of your Apache Kafka clusters. Amazon MSK automatically publishes broker-level, topic-level, and partition-level metrics to Amazon CloudWatch, and supports delivering raw Kafka broker log streams to Amazon CloudWatch Logs, Amazon S3, or Amazon Data Firehose for compliance and deep diagnostics.",
  "whyItMatters": "Operating high-throughput Kafka streaming pipelines requires proactive tracking of consumer lag, broker CPU load, and under-replicated partitions. Without continuous monitoring, slow consumers fall behind and risk message expiration, broker disks can run out of space, and network bottlenecks can cause producer write timeouts.",
  "workplaceExample": "A data platform team configures CloudWatch monitoring for their 9-broker MSK cluster. They create a CloudWatch Alarm on `UnderReplicatedPartitions > 0` (indicating replica lag or broker distress) and another alarm on `EstimatedMaxTimeLag > 300000` (indicating consumer group processing is lagging by more than 5 minutes), automatically triggering alerts to Slack and PagerDuty.",
  "examFocus": "Understand MSK monitoring levels and metrics: (1) CloudWatch Monitoring Levels: `DEFAULT` (basic cluster metrics), `PER_BROKER` (metrics per broker node), `PER_TOPIC_PER_BROKER` (metrics per topic per broker), `PER_TOPIC_PER_PARTITION` (detailed partition metrics). (2) Key Metrics: `BytesInPerSec`, `BytesOutPerSec`, `CpuUser`, `KafkaDataLogsDiskUsed`, `UnderReplicatedPartitions`, `OfflinePartitionsCount`, `EstimatedMaxTimeLag`. (3) Open Monitoring: Exposes Prometheus metrics via JMX Exporter and Node Exporter.",
  "keyPoints": [
    "Publishes operational telemetry automatically under the 'AWS/Kafka' CloudWatch namespace.",
    "Supports four configurable monitoring levels: DEFAULT, PER_BROKER, PER_TOPIC_PER_BROKER, PER_TOPIC_PER_PARTITION.",
    "Critical health metrics: `UnderReplicatedPartitions` and `OfflinePartitionsCount` detect cluster replication issues.",
    "Consumer lag metric: `EstimatedMaxTimeLag` monitors the time lag between the latest offset and consumer group offset.",
    "Supports Open Monitoring with Prometheus via JMX Exporter (port 11001) and Node Exporter (port 11002).",
    "Delivers raw Kafka broker logs directly to Amazon CloudWatch Logs, Amazon S3, or Amazon Data Firehose."
  ],
  "commonMistake": "Leaving monitoring at the DEFAULT level when debugging slow consumer performance or partition imbalance. The DEFAULT level only provides basic cluster metrics; upgrading to PER_TOPIC_PER_BROKER is necessary to isolate hot topics and specific broker bottlenecks.",
  "example": "Update the enhanced monitoring level of an MSK cluster to PER_TOPIC_PER_BROKER using the AWS CLI: aws kafka update-monitoring --cluster-arn arn:aws:kafka:us-east-1:123456789012:cluster/prod-cluster/abcd --current-version K13V1IB3VIYZZH --enhanced-monitoring PER_TOPIC_PER_BROKER.",
  "sources": [
    {
      "title": "Monitoring an Amazon MSK Cluster with Amazon CloudWatch",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/monitoring.html"
    },
    {
      "title": "Open Monitoring with Prometheus in Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/open-monitoring.html"
    }
  ]
});
