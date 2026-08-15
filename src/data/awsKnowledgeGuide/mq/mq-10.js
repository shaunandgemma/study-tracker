import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mq-10',
  topicId: 'topic-mq',
  topicTitle: 'Amazon MQ',
  objectiveCode: 'Integration',
  title: 'Broker Storage',
  status: 'ready',
  plainEnglish: 'Amazon MQ Broker Storage options define the underlying storage mechanisms used to persist message queues, topics, and broker configurations:\n- ActiveMQ Storage: Uses Amazon EFS (Elastic File System) for shared multi-AZ Active/Standby brokers, or Amazon EBS for single-instance brokers.\n- RabbitMQ Storage: Uses high-performance Amazon EBS (Elastic Block Store) attached per cluster node, utilizing Quorum Queues to replicate messages across nodes.',
  whyItMatters: 'Message storage selection directly impacts message throughput, latency, durability, and storage costs. EFS provides multi-AZ shared lock durability for ActiveMQ, while EBS provides high IOPS for RabbitMQ clusters.',
  workplaceExample: 'An analytics system processes high-volume log streams using Amazon MQ RabbitMQ. They select EBS storage for low-latency IOPS, configuring Quorum Queues so that message writes are confirmed across 2 out of 3 node EBS volumes before acknowledging producers.',
  examFocus: 'SAA-C03 Engine Storage Differences:\n- ActiveMQ Storage: Amazon EFS (Multi-AZ Active/Standby) or Amazon EBS (Single-instance).\n- RabbitMQ Storage: Amazon EBS (`gp2`/`gp3`) attached to each cluster node.\n- Durability: Messages persisted to disk survive broker reboots.\n- Capacity Management: Monitor CloudWatch `MessageStorePercentUsage` metric to avoid filling broker disk space.',
  keyPoints: [
    'Defines the persistence layer for message queues, topics, and broker state.',
    'ActiveMQ Multi-AZ uses shared Amazon EFS spanning multiple AZs.',
    'RabbitMQ Clusters use Amazon EBS volumes attached to individual broker nodes.',
    'Message persistence ensures messages survive broker reboots and failovers.',
    'CloudWatch metric `MessageStorePercentUsage` alerts on storage saturation.'
  ],
  commonMistake: 'Allowing broker storage usage to reach 100%, causing the broker engine to stop accepting new published messages.',
  example: 'CloudWatch Metric Alarm JSON for Broker Storage Saturation:\n{\n  "AlarmName": "AmazonMQ-StorageHigh",\n  "MetricName": "MessageStorePercentUsage",\n  "Namespace": "AWS/AmazonMQ",\n  "Statistic": "Average",\n  "Period": 300,\n  "EvaluationPeriods": 1,\n  "Threshold": 80.0,\n  "ComparisonOperator": "GreaterThanOrEqualToThreshold"\n}',
  sources: [
    { title: 'Amazon MQ broker storage options', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-architecture.html#broker-storage' }
  ]
});
