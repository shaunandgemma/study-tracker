import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-12', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'NAT Gateway', status: 'ready',
  plainEnglish: 'A NAT gateway translates source addresses so resources in private subnets can initiate connections to destinations outside their subnet routing domain without accepting unsolicited return connections. A public zonal NAT gateway normally sits in a public subnet, uses an Elastic IP address, and reaches the internet through an IGW. AWS also documents private NAT and regional NAT modes for their supported use cases.',
  whyItMatters: 'Private workloads often need software updates or external APIs without direct public addressing. NAT supplies IPv4 egress but adds processing cost, routing dependencies, and connection limits. Private endpoints can provide a more direct path for supported AWS services.',
  workplaceExample: 'Application instances in private subnets send general IPv4 internet traffic to a NAT gateway. S3 and DynamoDB traffic uses gateway endpoints instead, reducing NAT processing and keeping supported service traffic on private connectivity.',
  examFocus: 'SAA-C03: public zonal NAT uses a public subnet, EIP, and IGW; private subnet routes point to NAT. It supports initiated outbound flows, not unsolicited inbound access. Consider endpoints for AWS services and high-availability placement for production.',
  keyPoints: [
    'NAT gateway changes source addressing for supported outbound connections.',
    'A public zonal NAT gateway requires public-subnet routing to an internet gateway and an Elastic IP address.',
    'Private subnet route tables direct applicable IPv4 destinations to the NAT gateway.',
    'NAT is stateful for return traffic but is not a general inbound publishing service.',
    'NAT gateway processing and cross-AZ paths can create charges.',
    'Gateway or interface endpoints can avoid NAT for supported AWS service traffic.'
  ],
  commonMistake: 'Creating a public NAT gateway in a subnet that has no route to an internet gateway, leaving the private instances unable to reach the internet.',
  example: 'The private application route table sends 0.0.0.0/0 to a NAT gateway. The NAT gateway’s public subnet sends 0.0.0.0/0 to the IGW, while an S3 prefix-list route uses a gateway endpoint.',
  sources: [
    { title: 'NAT gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html' },
    { title: 'NAT gateway basics', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html' }
  ]
});
