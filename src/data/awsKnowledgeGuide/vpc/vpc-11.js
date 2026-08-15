import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-11', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Internet Gateway - IGW', status: 'ready',
  plainEnglish: 'An internet gateway is a horizontally scaled, redundant VPC component that connects a VPC with the internet for routed IPv4 and IPv6 traffic. It must be attached to the VPC and referenced by the subnet route table. For IPv4, a directly connected resource also needs a public IPv4 or Elastic IP address; the internet gateway performs the mapping between that address and the resource private address.',
  whyItMatters: 'An IGW supplies the network edge but does not make every VPC resource public. Addressing, routes, security groups, network ACLs, and application listeners must all permit communication. Understanding these separate requirements prevents both accidental exposure and misleading troubleshooting.',
  workplaceExample: 'A public application load balancer sits in two public subnets whose route tables send 0.0.0.0/0 and, when required, ::/0 to the VPC internet gateway. Backend instances remain in private subnets with no direct IGW route.',
  examFocus: 'SAA-C03: attach one IGW to the VPC, route public-subnet internet traffic to it, give direct IPv4 workloads a public address, and allow traffic in security controls. An IGW is highly available and does not replace NAT for private IPv4 instances.',
  keyPoints: [
    'An internet gateway must be attached to a VPC before route tables can use it effectively.',
    'A subnet route to an IGW makes that subnet public.',
    'Direct IPv4 internet access also requires a public IPv4 address or Elastic IP on the resource.',
    'IPv6 internet access requires an IPv6 address and a separate IPv6 route.',
    'The IGW is not a firewall; security groups and NACLs still control traffic.',
    'An IGW does not give private IPv4 instances outbound access unless their addressing and routing design supports it.'
  ],
  commonMistake: 'Adding an IGW route for a private IPv4 instance and expecting internet access even though the instance has no public IPv4 address.',
  example: 'A public subnet route table sends 0.0.0.0/0 to igw-example. An internet-facing load balancer in that subnet has public addresses, while private targets receive traffic through the load balancer rather than directly from the IGW.',
  sources: [{ title: 'Enable internet access using an internet gateway', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html' }]
});
