import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-42',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Status Checks',
  status: 'ready',
  plainEnglish: 'EC2 Status Checks run automated tests every minute to monitor the health of your EC2 instances. There are two types of status checks:\n1. System Status Check: Monitors the underlying AWS physical hardware, power, network, and hypervisor infrastructure (`StatusCheckFailed_System`).\n2. Instance Status Check: Monitors the software and virtual machine health, OS boot process, and network configuration of your specific instance (`StatusCheckFailed_Instance`).',
  whyItMatters: 'Status checks help engineers distinguish hardware infrastructure outages from guest OS crashes. Understanding which check failed dictates whether AWS hardware recovery or OS troubleshooting is needed.',
  workplaceExample: 'An operations dashboard alerts on `StatusCheckFailed_System`. Because the failure is at the AWS physical host layer, the ops team stops and starts the instance, causing AWS to migrate the instance automatically to a healthy physical host.',
  examFocus: 'SAA-C03 Status Check Troubleshooting:\n- `StatusCheckFailed_System`: Issue with AWS physical host/hardware. Fix: Stop and Start instance (moves to new host), or configure EC2 Auto Recovery.\n- `StatusCheckFailed_Instance`: Issue with guest OS, kernel crash, corrupted file system, or misconfigured network interface. Fix: Reboot instance, inspect system logs, or rebuild OS.',
  keyPoints: [
    'System Status Check: Evaluates AWS physical hardware, power, and hypervisor health.',
    'Instance Status Check: Evaluates guest operating system, network configuration, and kernel health.',
    'System failures are resolved by Stop/Start (migrating host) or EC2 Auto Recovery.',
    'Instance failures are resolved by OS reboot, log inspection, or configuration fix.',
    'Status check metrics feed directly into CloudWatch Alarms.'
  ],
  commonMistake: 'Attempting to reboot an instance to fix a `StatusCheckFailed_System` error. Reboot keeps the instance on the SAME physical host. You must Stop and Start (or use Auto Recovery) to move to a healthy host.',
  example: 'CloudWatch Alarm for System Status Check Failure:\nMetric: `StatusCheckFailed_System`\nThreshold: `>= 1 for 2 periods (300 seconds)`\nAction: EC2 Auto Recovery (`arn:aws:automate:us-east-1:ec2:recover`).',
  sources: [
    { title: 'Types of status checks', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html' }
  ]
});
