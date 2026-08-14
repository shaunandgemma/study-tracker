import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-32',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Public and Private IP Addresses',
  status: 'ready',
  plainEnglish: 'Every EC2 instance in a VPC is assigned a Private IP Address that remains constant throughout the instance\'s lifecycle and is used for internal communication within the VPC. Instances launched in public subnets can also receive an Auto-Assigned Public IP Address reachable over the internet. However, a standard public IP is released whenever the instance is STOPPED, and a NEW public IP is assigned when restarted. In contrast, the private IP address never changes.',
  whyItMatters: 'Understanding IP behavior is crucial for internal microservice communication and external routing. Applications inside a VPC should ALWAYS communicate using private IP addresses or internal Route 53 DNS names rather than public IPs to save cost and maintain internal routing.',
  workplaceExample: 'An internal web server connects to a backend database instance inside the same VPC. The web server connects using the database\'s private IP (`10.0.2.45`). When the database instance is stopped and started for patching, its private IP remains `10.0.2.45`, ensuring unbroken connectivity.',
  examFocus: 'SAA-C03 IP behavior rules:\n- Private IP: Assigned from subnet CIDR range; never changes when stopped/started; retained until instance termination.\n- Public IP: Assigned from AWS public pool; CHANGES on stop/start; cannot be transferred to another instance (use Elastic IP for static public IP).\n- Traffic between instances using private IPs stays within AWS network (free/lower data transfer cost).',
  keyPoints: [
    'Private IPs are permanent for the life of the instance and used for internal VPC traffic.',
    'Public IPs change when an instance is stopped and restarted.',
    'Elastic IPs provide static public IPv4 addresses that persist across reboots.',
    'Internal communication should always use private IPs or private DNS.',
    'Instances in private subnets have ONLY private IP addresses.'
  ],
  commonMistake: 'Configuring internal application services to connect via public IP addresses instead of private IP addresses. This routes traffic over the internet gateway unnecessarily, adding latency and data transfer charges.',
  example: 'IP Configuration Comparison:\nStop / Start EC2 Instance:\n- Private IP: `10.0.1.150` -> `10.0.1.150` (Unchanged)\n- Public IP: `54.210.12.34` -> `34.200.56.78` (Changed!).',
  sources: [
    { title: 'Amazon EC2 instance IP addressing', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html' }
  ]
});
