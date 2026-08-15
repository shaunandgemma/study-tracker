import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-36', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Peering vs Transit Gateway', status: 'ready',
  plainEnglish: 'VPC peering creates a direct, non-transitive connection between two non-overlapping VPCs. Transit Gateway is a regional routing hub that connects multiple supported attachments and provides controlled transitive routing through Transit Gateway route tables. Peering is often simpler for a few direct relationships; Transit Gateway is easier to scale and segment across many networks.',
  whyItMatters: 'A growing peering mesh requires many connections and repeated routes, while a central transit design introduces attachment and data-processing cost plus a larger routing blast radius. The correct choice depends on network count, transitivity, segmentation, inspection, hybrid connectivity, performance, ownership, and cost.',
  workplaceExample: 'Two isolated application VPCs use one peering connection. As the organisation grows to dozens of VPCs requiring shared inspection and on-premises access, it adopts Transit Gateway with separate production, development, and shared-service route tables.',
  examFocus: 'SAA-C03: peering = one-to-one and non-transitive. Transit Gateway = hub-and-spoke with transitive routing and route-table segmentation. Both require non-overlapping routing plans and security controls; neither automatically grants access.',
  keyPoints: [
    'VPC peering connects two VPCs directly and does not route through another peer.',
    'Transit Gateway connects many supported attachments through a central hub.',
    'Transit Gateway route-table associations and propagations control segmentation and reachability.',
    'Peering can be cost-effective and simple for a small number of direct connections.',
    'Transit Gateway adds attachment and data-processing considerations but reduces full-mesh complexity.',
    'CIDR planning, DNS, routes, security controls, availability, and return paths remain necessary in both designs.'
  ],
  commonMistake: 'Choosing peering for a large hub-and-spoke design and then expecting spoke VPCs to communicate transitively through the hub VPC.',
  example: 'Three VPCs needing only A-to-B and A-to-C can use two peerings if B-to-C is prohibited. Twenty VPCs needing shared routing and inspection are evaluated for Transit Gateway segmentation.',
  sources: [
    { title: 'VPC peering basics', url: 'https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html' },
    { title: 'How Transit Gateway works', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html' }
  ]
});
