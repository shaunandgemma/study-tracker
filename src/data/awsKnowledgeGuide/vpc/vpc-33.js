import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-33', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Public IP Address Requirements', status: 'ready',
  plainEnglish: 'For direct IPv4 internet communication through an internet gateway, an EC2 network interface needs a public IPv4 address or Elastic IP in addition to subnet routing and security permission. A public subnet does not automatically make every instance public. Public IPv4 auto-assignment is controlled by subnet and launch settings, while managed public services allocate addresses according to their own design.',
  whyItMatters: 'Separating route and address requirements prevents accidental exposure and failed connectivity. Public IPv4 addresses also have scarcity and cost implications. Most backend workloads should remain privately addressed and use load balancers, NAT, endpoints, or private administration paths instead of direct public addresses.',
  workplaceExample: 'Only the internet-facing load balancer receives public addressing. Application instances have private addresses and use NAT for approved outbound calls. Administrators connect through Session Manager rather than assigning temporary public IPs to backend servers.',
  examFocus: 'SAA-C03: direct IPv4 internet access needs public-subnet IGW routing, a public IPv4 or EIP, and allowed controls. A public DNS name resolves to public addressing but does not replace these requirements. IPv6 follows different addressing and egress rules.',
  keyPoints: [
    'A public subnet is defined by its route table, not by whether every resource has a public address.',
    'Direct IPv4 internet communication through an IGW requires a public IPv4 address or Elastic IP.',
    'Auto-assign public IPv4 can be configured at subnet level and overridden by supported launch settings.',
    'An Elastic IP is persistent until released; an automatically assigned public IPv4 can change after lifecycle events.',
    'Public addressing does not bypass security groups, NACLs, or host firewalls.',
    'Private workloads can use NAT for outbound IPv4 or endpoints for supported private service connectivity.'
  ],
  commonMistake: 'Moving an instance into a public subnet and expecting internet access while it still has only a private IPv4 address.',
  example: 'A test instance in a public subnet receives a public IPv4 address at launch, has a route to the IGW, and permits only required traffic. A production backend instance omits public addressing and remains behind the load balancer.',
  sources: [
    { title: 'Internet gateway IP address requirements', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html' },
    { title: 'Manage IP addresses for an EC2 instance', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/managing-network-interface-ip-addresses.html' }
  ]
});
