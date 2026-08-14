import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-44',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Auto Recovery',
  status: 'ready',
  plainEnglish: 'EC2 Auto Recovery is an automated recovery feature that automatically migrates an EC2 instance to a new physical AWS hardware host if the underlying physical hardware fails. When a CloudWatch Alarm monitoring `StatusCheckFailed_System` triggers, the Auto Recovery action moves the instance to a healthy physical host in the same Availability Zone. The recovered instance retains its Instance ID, Private IP, Public IP, Elastic IP, attached EBS volumes, and IAM roles.',
  whyItMatters: 'Physical server hardware occasionally experiences memory errors or power supply failures. Auto Recovery repairs underlying hardware outages automatically without manual operator intervention.',
  workplaceExample: 'A single-instance legacy application runs on EC2. During the night, the underlying host hypervisor crashes. CloudWatch detects `StatusCheckFailed_System=1` and triggers EC2 Auto Recovery. Within 4 minutes, the instance reboots on a fresh physical server with all IPs and EBS data intact.',
  examFocus: 'SAA-C03 Auto Recovery rules:\n- Triggers on `StatusCheckFailed_System` (hardware/hypervisor failure).\n- Retains Instance ID, Private IP, Public IP, Elastic IP, and EBS Volume attachments.\n- Supported on standard instance families (C, M, R, T) backed by EBS volumes.\n- NOT supported on instances using local Instance Store drives.',
  keyPoints: [
    'Automated recovery triggered by `StatusCheckFailed_System` CloudWatch alarm.',
    'Migrates instance to a healthy physical host within the same Availability Zone.',
    'Preserves Instance ID, Private IP, Public IP, Elastic IP, and attached EBS volumes.',
    'Does NOT support instances with local Instance Store storage.',
    'Reduces Recovery Time Objective (RTO) for single-instance workloads.'
  ],
  commonMistake: 'Attempting to configure EC2 Auto Recovery for an instance utilizing local Instance Store drives. Auto Recovery is supported exclusively on EBS-backed instances.',
  example: 'CloudWatch Alarm Metric Action for Auto Recovery:\nAlarm Name: `EC2-System-Auto-Recovery`\nMetric: `StatusCheckFailed_System`\nAction: `arn:aws:automate:us-east-1:ec2:recover`',
  sources: [
    { title: 'Amazon EC2 Auto Recovery', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html' }
  ]
});
