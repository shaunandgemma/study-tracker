import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-8',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'EBS Storage',
  status: 'ready',
  plainEnglish: 'EBS Storage in Amazon OpenSearch Service provides persistent Elastic Block Store volumes attached to each Data Node for high-speed indexing and query execution (Hot Data Tier). OpenSearch supports General Purpose SSD (`gp2`/`gp3`) and Provisioned IOPS SSD (`io1`/`io2`) volume types.',
  whyItMatters: 'Hot data storage requires high throughput and low IOPS latency. Configuring `gp3` storage allows independent scaling of IOPS (up to 16,000) and throughput (up to 1,000 MB/s) without over-provisioning storage volume size.',
  workplaceExample: 'A retail search application updates its OpenSearch data node storage from `gp2` to `gp3`, scaling provisioned IOPS to 12,000. This eliminates disk I/O bottlenecks during Black Friday high-volume bulk indexing.',
  examFocus: 'SAA-C03 EBS Storage Principles:\n- Volume Types: `gp3` (recommended for cost & performance flexibility), `gp2`, `io1`.\n- Storage Auto-Scaling: Modify EBS volume size dynamically without cluster downtime.\n- Watermark Thresholds: OpenSearch imposes cluster read-only locks when disk usage exceeds 85% (low watermark) or 90% (high watermark).\n- Free Storage Metric: Monitor CloudWatch `FreeStorageSpace` to trigger storage scaling before disks fill up.',
  keyPoints: [
    'Provides hot data storage attached directly to OpenSearch Data Nodes.',
    'Supports EBS volume types: `gp3`, `gp2`, and `io1`.',
    '`gp3` enables independent scaling of volume size, IOPS, and throughput.',
    'Storage volumes can be dynamically expanded without cluster downtime.',
    'Disks locked into read-only mode if free storage space drops below critical thresholds.'
  ],
  commonMistake: 'Allowing data node EBS disk utilization to exceed 90%, triggering a cluster-wide block on new document indexing operations.',
  example: 'CloudWatch Storage Alarm Threshold Rule:\n{\n  "AlarmName": "OpenSearch-LowDiskSpace",\n  "MetricName": "FreeStorageSpace",\n  "Namespace": "AWS/ES",\n  "Statistic": "Minimum",\n  "Period": 300,\n  "EvaluationPeriods": 1,\n  "Threshold": 20000.0,\n  "ComparisonOperator": "LessThanOrEqualToThreshold"\n}',
  sources: [
    { title: 'EBS volume size limits in Amazon OpenSearch Service', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebs-version-limits' }
  ]
});
