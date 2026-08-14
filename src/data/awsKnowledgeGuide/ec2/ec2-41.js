import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-41',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Detailed Monitoring',
  status: 'ready',
  plainEnglish: 'EC2 Monitoring delivers performance metrics (such as CPU utilization, disk reads/writes, and network traffic) to Amazon CloudWatch. By default, EC2 provides Basic Monitoring for free, emitting metric data points every 5 minutes. Enabling Detailed Monitoring increases the frequency of metric data delivery to 1-minute intervals for an additional charge.',
  whyItMatters: 'For fast-scaling web applications or Auto Scaling groups that need to react quickly to traffic spikes, 5-minute metric updates are too slow. 1-minute Detailed Monitoring allows CloudWatch Alarms and Auto Scaling to trigger scale-out actions 5 times faster.',
  workplaceExample: 'A flash-sale retail site enables Detailed Monitoring on its Auto Scaling group. When a flash sale begins, CPU utilization spikes. CloudWatch detects the 1-minute metric spike and triggers Auto Scaling to add 20 servers within 2 minutes instead of waiting 5-10 minutes.',
  examFocus: 'SAA-C03 Monitoring rules:\n- Basic Monitoring: 5-minute intervals (Free, enabled by default).\n- Detailed Monitoring: 1-minute intervals (Paid, enabled per instance or Auto Scaling group).\n- Note: EC2 default metrics track hypervisor-level stats (CPU utilization, Disk I/O, Network I/O). RAM/Memory utilization and disk space usage require installing the CloudWatch Agent inside the OS.',
  keyPoints: [
    'Basic Monitoring: 5-minute metric frequency (Default, Free).',
    'Detailed Monitoring: 1-minute metric frequency (Paid add-on).',
    'Speeds up Auto Scaling reaction time during sudden traffic spikes.',
    'Hypervisor metrics: CPU, Disk I/O, Network I/O, Status Checks.',
    'OS Memory (RAM) and Disk Space usage require CloudWatch Unified Agent.'
  ],
  commonMistake: 'Assuming CloudWatch monitors EC2 Memory (RAM) utilization out of the box. EC2 hypervisor metrics do NOT include RAM utilization; you MUST install the CloudWatch Agent to collect memory stats.',
  example: 'Enabling Detailed Monitoring on an Instance:\n`aws ec2 monitor-instances --instance-ids i-0123456789abcdef0`',
  sources: [
    { title: 'Monitor your instances using CloudWatch', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-instances-cloudwatch.html' }
  ]
});
