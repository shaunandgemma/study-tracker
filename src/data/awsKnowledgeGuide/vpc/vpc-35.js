import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-35', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'NAT Gateway vs Internet Gateway', status: 'ready',
  plainEnglish: 'An internet gateway connects a VPC to the internet and supports direct routed communication for correctly addressed public resources. A NAT gateway translates source addresses for connections initiated by private resources, preventing unsolicited inbound connections from using that established NAT path. Public zonal NAT ultimately uses an internet gateway for internet egress.',
  whyItMatters: 'The two components are complementary, not alternatives in every design. Public entry points use an IGW path; private IPv4 workloads commonly use NAT for outbound-only access. Confusing them leads to private instances with no egress or backend instances exposed with public addresses.',
  workplaceExample: 'A public load balancer uses subnets routed directly to the IGW. Private application instances send update and API traffic through NAT and accept application connections only from the load balancer security group.',
  examFocus: 'SAA-C03: IGW supports direct public IPv4/IPv6 routing; NAT provides translated initiated egress, usually for private IPv4 resources. Public zonal NAT needs a public subnet, EIP, and IGW. Neither component replaces security rules.',
  keyPoints: [
    'An IGW attaches to a VPC and is a route target for internet-routable traffic.',
    'A NAT gateway is a route target that translates supported initiated traffic.',
    'Direct public IPv4 access through an IGW requires a public IPv4 address on the resource.',
    'Private IPv4 instances can use public NAT without receiving public addresses themselves.',
    'A public zonal NAT depends on an IGW path from its public subnet.',
    'An egress-only internet gateway, not IPv4 NAT, is the common outbound-only IPv6 component.'
  ],
  commonMistake: 'Sending a private subnet default route directly to the IGW and expecting the IGW to translate instances that have no public IPv4 addresses.',
  example: 'Public-rt points to the IGW. Private-rt points to NAT. The NAT public subnet uses public-rt, creating private instance → NAT → IGW → internet for IPv4 egress.',
  sources: [
    { title: 'Internet gateway basics', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html' },
    { title: 'NAT gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html' }
  ]
});
