import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-22', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Peering', status: 'ready',
  plainEnglish: 'A VPC peering connection provides private, one-to-one routing between two VPCs. The VPCs can be in the same or different accounts and supported Regions, but their CIDR blocks cannot overlap. The requester creates the connection, the accepter accepts it, and both sides add the required routes and security permissions.',
  whyItMatters: 'Peering is simple for a small number of direct relationships and keeps traffic on the AWS network. It does not provide a central router, transitive routing, or edge-to-edge access through the peer, so a mesh becomes difficult to operate as the number of VPCs grows.',
  workplaceExample: 'A reporting VPC peers directly with one application VPC. Each side adds only the required CIDR routes, security groups allow the reporting port, DNS options are reviewed, and Flow Logs confirm the traffic path.',
  examFocus: 'SAA-C03: no overlapping CIDRs, no transitive routing, routes required in both directions, security controls still apply, and peer VPCs cannot use one another’s IGW, NAT, VPN, Direct Connect, or gateway endpoint as edge-to-edge transit.',
  keyPoints: [
    'VPC peering is a direct relationship between exactly two VPCs.',
    'Overlapping IPv4 or IPv6 CIDRs prevent the peering connection.',
    'The accepter must accept the request before the connection becomes active.',
    'Both VPCs need route-table entries for the peer prefixes.',
    'Security groups and NACLs must allow the intended peer traffic.',
    'Peering is non-transitive and does not provide central hub routing.'
  ],
  commonMistake: 'Creating and accepting the peering connection but adding a route on only one side, producing an incomplete return path.',
  example: 'VPC A routes 10.20.0.0/16 to pcx-example, and VPC B routes 10.10.0.0/16 to the same connection. Application security rules permit only the required service port.',
  sources: [{ title: 'How VPC peering connections work', url: 'https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html' }]
});
