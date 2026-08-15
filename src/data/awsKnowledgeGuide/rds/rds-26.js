import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-26',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Enhanced Monitoring and CloudWatch Monitoring',
  status: 'ready',
  plainEnglish: 'Amazon RDS provides two distinct monitoring mechanisms to track database instance health:\n- CloudWatch Metrics: Standard hypervisor-level metrics collected every 60 seconds (CPU utilization, freeable memory, storage space, write/read IOPS, latency).\n- Enhanced Monitoring: OS-level metrics collected directly from an agent on the database host instance at high frequency (1 to 60 seconds), showing detailed per-process CPU, memory, and disk thread metrics.',
  whyItMatters: 'Standard CloudWatch metrics show high CPU utilization but cannot identify which specific OS process or query thread is consuming resources. Enhanced Monitoring reveals granular per-process OS metrics to pinpoint database performance bottlenecks.',
  workplaceExample: 'During a database performance drop, standard CloudWatch shows 98% CPU utilization. The DBA opens Enhanced Monitoring with a 1-second granularity, identifying a specific rogue background backup worker thread consuming 85% of host CPU.',
  examFocus: 'SAA-C03 Monitoring Comparison:\n- CloudWatch Metrics: Default hypervisor metrics (60s frequency); tracks CPU, RAM, IOPS, Storage, Read/Write Latency.\n- Enhanced Monitoring: OS-level metrics (1s to 60s frequency); requires an IAM Role (`rds-monitoring-role`) to publish OS process metrics to CloudWatch Logs.\n- Log Export: Engine logs (error log, slow query log, general log) can be exported to CloudWatch Logs for automated alarm monitoring.',
  keyPoints: [
    'CloudWatch provides standard hypervisor-level metrics at 60-second granularity.',
    'Enhanced Monitoring provides OS-level per-process metrics at 1 to 60-second granularity.',
    'Enhanced Monitoring requires configuring an IAM Role (`rds-monitoring-role`).',
    'Delivers visibility into CPU threads, memory swapping, and disk I/O process queues.',
    'Slow query and error logs can be exported directly to CloudWatch Logs.'
  ],
  commonMistake: 'Expecting standard CloudWatch metrics to show individual OS process lists and thread memory usage. Use Enhanced Monitoring for OS-level process breakdown.',
  example: 'Enabling Enhanced Monitoring with 1-Second Granularity via AWS CLI:\naws rds modify-db-instance --db-instance-identifier prod-db --monitoring-interval 1 --monitoring-role-arn arn:aws:iam::123456789012:role/rds-monitoring-role --apply-immediately',
  sources: [
    { title: 'Monitoring metrics in an Amazon RDS instance', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.html' }
  ]
});
