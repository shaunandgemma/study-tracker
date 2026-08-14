import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-43',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Systems Manager Integration',
  status: 'ready',
  plainEnglish: 'AWS Systems Manager (SSM) integration allows you to manage, patch, configure, and access EC2 instances securely without opening inbound SSH (port 22) or RDP (port 3389) ports, and without assigning public IP addresses. By installing the SSM Agent on the instance and attaching an IAM role with the `AmazonSSMManagedInstanceCore` policy, the instance registers as a Managed Instance in Systems Manager.',
  whyItMatters: 'Closing inbound port 22/3389 and removing bastion hosts eliminates direct SSH brute-force attack vectors. SSM Session Manager provides encrypted browser/CLI terminal access logged directly to CloudWatch and S3 for compliance auditing.',
  workplaceExample: 'A bank removes all bastion hosts and closes SSH port 22 on all security groups. Engineers access private EC2 instances securely using SSM Session Manager (`aws ssm start-session --target i-0123456789abcdef0`). Every keystroke is logged to S3 for security auditing.',
  examFocus: 'SAA-C03 Systems Manager Integration rules:\n- Secure shell access without port 22/3389 open -> SSM Session Manager.\n- Requirements: (1) SSM Agent installed, (2) IAM Role with `AmazonSSMManagedInstanceCore`, (3) Outbound internet access or VPC Endpoints for SSM.\n- Eliminates bastion hosts and public IP requirements.',
  keyPoints: [
    'Enables secure management without open SSH/RDP ports or public IPs.',
    'Session Manager provides browser-based and CLI interactive shell access.',
    'Patch Manager automates OS patching across fleets of EC2 instances.',
    'Requires SSM Agent and IAM Policy `AmazonSSMManagedInstanceCore`.',
    'Audits session logs directly to Amazon S3 or CloudWatch Logs.'
  ],
  commonMistake: 'Opening SSH port 22 to `0.0.0.0/0` in a security group for remote access when SSM Session Manager can provide encrypted shell access with port 22 completely closed.',
  example: 'Starting an interactive shell session via SSM CLI:\n`aws ssm start-session --target i-0123456789abcdef0`',
  sources: [
    { title: 'Setting up AWS Systems Manager for EC2 instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html' }
  ]
});
