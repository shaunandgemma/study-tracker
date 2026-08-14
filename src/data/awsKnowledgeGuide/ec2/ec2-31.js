import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-31',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Elastic IP Addresses',
  status: 'ready',
  plainEnglish: 'An Elastic IP Address (EIP) is a static, public IPv4 address designed for dynamic cloud computing. Unlike standard public IP addresses assigned to EC2 instances (which change whenever an instance is stopped and restarted), an Elastic IP remains permanently allocated to your AWS account until you explicitly release it. You can rapidly reassociate an Elastic IP to another instance in the same region during hardware failures.',
  whyItMatters: 'If an EC2 instance hosting an external endpoint crashes, restarting it gives it a new public IP, breaking DNS records. An Elastic IP provides a fixed public IP endpoint that can be pointed to a standby server instantly.',
  workplaceExample: 'An enterprise hosts an SFTP server on an EC2 instance with an Elastic IP (`54.210.20.30`) allowlisted by corporate partners. When the underlying instance undergoes maintenance, the admin launches a new instance and reassociates the Elastic IP in 5 seconds with zero IP change for partners.',
  examFocus: 'SAA-C03 Elastic IP cost & usage rules:\n- 5 Elastic IPs per region per account by default.\n- Hourly charge applies for Elastic IPs allocated to an account but NOT attached to a running instance (to prevent IP address hoarding).\n- In modern architectures, prefer AWS Application Load Balancers, Route 53 DNS routing, or NAT Gateways over managing individual Elastic IPs on instances.',
  keyPoints: [
    'Static public IPv4 address associated with your AWS account.',
    'Remains fixed across instance stop/start cycles.',
    'Can be dynamically reassociated between instances in the same region.',
    'Incurs an hourly fee if allocated but unattached to a running instance.',
    'Default limit of 5 Elastic IPs per region per account.'
  ],
  commonMistake: 'Allocating 10 Elastic IPs and leaving them unattached, leading to unnecessary hourly charges on your AWS bill.',
  example: 'Reassociating an Elastic IP:\n`aws ec2 associate-address --instance-id i-0123456789abcdef0 --allocation-id eipalloc-0123456789abcdef0`',
  sources: [
    { title: 'Elastic IP addresses', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html' }
  ]
});
