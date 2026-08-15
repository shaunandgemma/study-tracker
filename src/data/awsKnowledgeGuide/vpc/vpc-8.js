import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-8', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Public and Private Subnets', status: 'ready',
  plainEnglish: 'A subnet is public when its associated route table sends internet-bound traffic to an internet gateway. A subnet without that route is private. Public IPv4 instances also need public IPv4 addresses and permissive-enough security controls for direct internet communication. Private subnets can still initiate outbound connections through NAT or reach AWS services through VPC endpoints.',
  whyItMatters: 'Subnet placement limits exposure and controls traffic paths. Load balancers and other intentional entry points can use public subnets, while application servers and databases normally stay private. This reduces direct attack surface and makes outbound connectivity, inspection, and logging deliberate.',
  workplaceExample: 'An application spans two AZs. Internet-facing load balancers use public subnets; application instances use private subnets with controlled outbound access; database instances use isolated subnets with no internet route. Each tier has explicit route tables and security groups.',
  examFocus: 'SAA-C03: public/private is determined by routing, not by a label. A public IPv4 resource needs a public address plus IGW route. A private subnet can use NAT for IPv4 egress, an egress-only IGW for IPv6 egress, or endpoints for private service access.',
  keyPoints: [
    'Every subnet is associated with one subnet route table at a time.',
    'A route to an attached internet gateway makes the subnet public.',
    'A public subnet does not automatically assign public IPv4 addresses unless that attribute or launch setting is enabled.',
    'Private subnets can have outbound access without accepting unsolicited inbound internet connections.',
    'Isolated subnets omit direct internet and NAT routes when the workload does not require them.',
    'Security groups and NACLs still control traffic regardless of subnet classification.'
  ],
  commonMistake: 'Putting a database in a subnet named private while its route table is actually shared with public subnets and contains an internet-gateway route.',
  example: 'The public route table sends 0.0.0.0/0 to an IGW. The application-private route table sends it to a NAT gateway. The database route table contains only local and required private-network routes.',
  sources: [
    { title: 'VPCs and subnets', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html' },
    { title: 'Internet gateway basics', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html' }
  ]
});
