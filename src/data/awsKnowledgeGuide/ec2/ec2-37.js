import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-37',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Stop, Start, Reboot and Terminate',
  status: 'ready',
  plainEnglish: 'These four actions govern the EC2 instance lifecycle:\n- Stop: Shuts down the virtual machine (equivalent to powering off). Compute billing stops, but EBS volume data and private IP are retained. When restarted, it may move to a new physical host and receives a NEW public IP.\n- Start: Powers on a stopped instance, assigning a new public IP (unless an Elastic IP is used).\n- Reboot: Flushes memory and restarts the OS (equivalent to an OS reboot). The instance stays on the SAME physical host, retaining its public and private IPs, and compute billing continues.\n- Terminate: Permanently deletes the instance and deletes any attached EBS volumes configured with `DeleteOnTermination=true`.',
  whyItMatters: 'Understanding instance state transitions prevents accidental data loss and unexpected billing. Knowing that stopping an instance releases its public IP address prevents broken external dependencies.',
  workplaceExample: 'An engineering team configures an Auto Scaling schedule to STOP development EC2 instances every evening at 7:00 PM and START them at 7:00 AM on weekdays. This eliminates 65% of dev instance compute costs over the weekend.',
  examFocus: 'SAA-C03 Instance Lifecycle rules:\n- Stop/Start: Compute billing stops. EBS data preserved. Public IP changes (unless Elastic IP). Instance Store data LOST.\n- Reboot: Compute billing continues. IPs preserved. Instance Store data PRESERVED.\n- Terminate: Instance permanently deleted. EBS root volume deleted by default (unless `DeleteOnTermination=false`).',
  keyPoints: [
    'Stop: Shuts down instance, pauses compute billing, changes public IP, clears Instance Store.',
    'Start: Boots stopped instance, acquires new public IP (unless EIP used).',
    'Reboot: OS restart on same host, maintains public/private IPs, billing continues.',
    'Terminate: Deletes instance permanently and purges `DeleteOnTermination=true` volumes.',
    'Compute billing pauses during Stop state; EBS storage charges continue.'
  ],
  commonMistake: 'Confusing Reboot with Stop/Start. Reboot keeps the instance running on the same host with the same public IP, while Stop/Start moves the instance and changes its public IP.',
  example: 'Terminating an EC2 Instance:\n`aws ec2 terminate-instances --instance-ids i-0123456789abcdef0`',
  sources: [
    { title: 'Instance lifecycle', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html' }
  ]
});
