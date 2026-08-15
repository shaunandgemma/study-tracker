import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-23', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Peering Non-Transitive Routing', status: 'ready',
  plainEnglish: 'VPC peering is non-transitive. If VPC A peers with B and A also peers with C, B cannot send traffic through A to reach C. B and C need their own direct peering connection or a different routing architecture such as Transit Gateway where appropriate.',
  whyItMatters: 'Assuming transitivity creates missing routes and unsafe attempts to use a peer as a hidden gateway. The same edge-to-edge restriction means a peer cannot borrow another VPC’s internet gateway, NAT device, VPN, Direct Connect connection, or gateway endpoint.',
  workplaceExample: 'A hub VPC has separate peering connections to ten application VPCs. The applications later need controlled communication with each other. Instead of building and maintaining a large full mesh, the network team evaluates Transit Gateway with segmented route tables.',
  examFocus: 'SAA-C03: A-B plus A-C does not equal B-C. Peering supports only direct peer routes and no edge-to-edge gateway transit. Use direct peerings for a small mesh or Transit Gateway for scalable transitive routing and segmentation.',
  keyPoints: [
    'Traffic cannot traverse one VPC peering connection and then another.',
    'A peer VPC cannot act as transit to an internet gateway or NAT device.',
    'A peer cannot provide edge-to-edge access to the other VPC’s VPN or Direct Connect connection.',
    'Gateway endpoints are not exported for use by resources in a peer VPC.',
    'A full peering mesh requires a separate connection and routes for each communicating VPC pair.',
    'Transit Gateway is commonly considered when many VPCs require controlled transitive routing.'
  ],
  commonMistake: 'Adding broad routes in B and C pointing toward A and expecting A to forward between its two peering connections. VPC peering does not provide that transit behaviour.',
  example: 'B reaches A through pcx-ba and C reaches A through pcx-ca, but B cannot reach C through A. A direct pcx-bc or a correctly designed transit service is required.',
  sources: [{ title: 'VPC peering limitations and transitive peering', url: 'https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html' }]
});
