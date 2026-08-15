import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-9', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Route Tables', status: 'ready',
  plainEnglish: 'A VPC route table is a set of destination-and-target rules used by the VPC router. The destination is the address range or prefix list being reached; the target is the next network component, such as an internet gateway, NAT gateway, peering connection, network interface, or endpoint. AWS selects the most specific matching route.',
  whyItMatters: 'Most VPC connectivity failures are routing problems, security-control problems, or both. Understanding the selected route in each direction makes it possible to design public, private, isolated, hybrid, and inspection paths without accidentally bypassing controls.',
  workplaceExample: 'An engineer troubleshoots a private instance that cannot reach an update repository. They confirm the subnet association, identify the 0.0.0.0/0 route to the correct NAT gateway, check the NAT subnet route to the internet gateway, and then validate return traffic and security controls.',
  examFocus: 'SAA-C03: routes contain destination and target; local routes support VPC-internal traffic; longest-prefix match chooses the route; 0.0.0.0/0 and ::/0 are separate defaults; every subnet uses exactly one route table.',
  keyPoints: [
    'A route destination identifies matching traffic and a target identifies the next hop.',
    'Every VPC route table includes local routing for its associated VPC CIDRs.',
    'The longest matching prefix is selected when several routes match a destination.',
    'IPv4 and IPv6 routes are evaluated separately.',
    'A blackhole route has an unavailable target and cannot deliver traffic.',
    'Working communication normally requires valid forward and return routes plus security permission.'
  ],
  commonMistake: 'Adding a default route and expecting it to override a more-specific incorrect route. Longest-prefix matching sends traffic through the more-specific route.',
  example: 'A table contains 0.0.0.0/0 to a NAT gateway and 10.50.0.0/16 to a peering connection. Traffic for 10.50.2.10 uses the peering route because /16 is more specific than /0.',
  sources: [
    { title: 'Configure route tables', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html' },
    { title: 'Route table concepts', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html' }
  ]
});
