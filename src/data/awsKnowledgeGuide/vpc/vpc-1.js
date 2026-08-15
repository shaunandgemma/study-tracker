import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-1', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC CIDR Sizing, Public Subnets vs Private Subnets Architecture', status: 'ready',
  plainEnglish: 'A VPC is a logically isolated network with one or more IP address ranges written in CIDR notation. You divide those ranges into non-overlapping subnets, and each subnet exists in one Availability Zone. A public subnet has a route to an internet gateway; a private subnet does not. An IPv4 workload in a public subnet also needs a public IPv4 address and suitable security rules before it can communicate with the internet.',
  whyItMatters: 'The initial address plan affects future growth, hybrid connectivity, peering, routing, and segmentation. Address ranges that are too small run out, while overlapping ranges block or complicate connections to other networks. Separating public entry points from private application and database resources reduces unnecessary exposure.',
  workplaceExample: 'A team allocates a non-overlapping VPC range, creates public load-balancer subnets and private application subnets in two Availability Zones, then places database subnets behind separate route tables. It reserves unused address space for future services instead of consuming the entire VPC immediately.',
  examFocus: 'SAA-C03 design: plan non-overlapping CIDRs; remember that a subnet belongs to one AZ; use multiple AZs for resilience; public means a route to an internet gateway; private IPv4 outbound access normally uses NAT or private endpoints; routing and addressing are separate from security controls.',
  keyPoints: [
    'CIDR prefix length determines the number of addresses in a VPC or subnet range.',
    'Subnet CIDRs must be contained within a VPC CIDR and cannot overlap each other.',
    'Each subnet is tied to exactly one Availability Zone.',
    'A route to an internet gateway classifies a subnet as public, but an IPv4 instance still needs a public address for direct internet communication.',
    'Private subnets omit a direct internet-gateway route and can use NAT or VPC endpoints for selected outbound destinations.',
    'Address plans should avoid overlap with other VPCs, on-premises networks, and anticipated future networks.'
  ],
  commonMistake: 'Calling a subnet public merely because an instance has a public IP address. Without a subnet route to an attached internet gateway, that address alone does not provide internet connectivity.',
  example: 'A VPC uses 10.20.0.0/16. Public subnets 10.20.0.0/24 and 10.20.1.0/24 sit in different AZs, while private application and database subnets use separate non-overlapping ranges and route tables. The design retains unused space for growth.',
  sources: [
    { title: 'How Amazon VPC works', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html' },
    { title: 'Plan your VPC', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-getting-started.html' }
  ]
});
