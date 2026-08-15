import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-6', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC CIDR Blocks', status: 'ready',
  plainEnglish: 'A CIDR block defines an address range available to a VPC. A VPC begins with a primary IPv4 CIDR and can use supported secondary IPv4 CIDRs; it can also have supported IPv6 CIDRs. Subnets take smaller ranges from the VPC. AWS reserves addresses inside every subnet, so the mathematical size is not the same as the number of addresses available to workloads.',
  whyItMatters: 'CIDR choices affect capacity and connectivity for the lifetime of the network. Overlapping ranges prevent VPC peering and complicate VPN, Direct Connect, Transit Gateway, and acquired-network integration. Secondary CIDRs can add capacity, but they do not repair a poorly planned overlap with an external network.',
  workplaceExample: 'Before connecting a new business unit, the network team compares its on-premises ranges with every existing VPC CIDR. It assigns a unique range, records it in IP address management, and leaves adjacent capacity available for later subnet expansion.',
  examFocus: 'SAA-C03 CIDR rules: plan for growth; avoid overlaps; distinguish primary and secondary IPv4 CIDRs; divide VPC ranges into non-overlapping subnets; remember AWS-reserved subnet addresses; treat IPv4 and IPv6 as separate address families.',
  keyPoints: [
    'CIDR combines a network address with a prefix length, such as 10.0.0.0/16.',
    'A subnet CIDR must fit inside an associated VPC CIDR.',
    'Primary and secondary VPC IPv4 CIDRs contribute address space but remain subject to AWS association rules.',
    'AWS reserves several addresses in each subnet rather than assigning the entire mathematical range to workloads.',
    'Overlapping CIDRs prevent supported direct routing designs such as VPC peering.',
    'IPv6 CIDRs and routes must be planned separately from IPv4 CIDRs and routes.'
  ],
  commonMistake: 'Choosing the same convenient private range for every VPC, then discovering that the networks cannot be peered or cleanly routed through a central network.',
  example: 'A /16 VPC is divided into /24 subnets assigned to specific tiers and Availability Zones. The team records every allocation and checks future on-premises and multi-account connectivity before adding secondary ranges.',
  sources: [
    { title: 'VPC CIDR blocks', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html' },
    { title: 'Subnet CIDR blocks', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html' }
  ]
});
