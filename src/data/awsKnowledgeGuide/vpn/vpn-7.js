import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-7',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Transit Gateway VPN Attachments',
  status: 'ready',
  plainEnglish: 'An AWS Transit Gateway VPN Attachment is a connection that terminates an AWS Site-to-Site VPN directly on an AWS Transit Gateway instead of a single Virtual Private Gateway. Because AWS Transit Gateway acts as a central cloud router interconnecting hundreds of VPCs and on-premises networks in a hub-and-spoke model, terminating your VPN on a Transit Gateway allows your on-premises network to communicate with all attached VPCs through a single VPN connection.',
  whyItMatters: 'As an organization scales to dozens or hundreds of AWS accounts and VPCs, creating and maintaining separate Virtual Private Gateways and individual VPN connections for each VPC becomes unmanageable, expensive, and error-prone. Transit Gateway VPN attachments centralize hybrid connectivity, simplify routing, and enable bandwidth aggregation with ECMP.',
  workplaceExample: 'A multinational financial enterprise operates 45 VPCs across development, staging, shared services, and production accounts. Instead of managing 45 separate VPN connections to their on-premises data centre, the networking team establishes a single Site-to-Site VPN attached directly to their central AWS Transit Gateway, routing on-premises corporate traffic to all 45 VPCs seamlessly.',
  examFocus: 'SAA-C03 Transit Gateway VPN Features:\n- Hub-and-Spoke Scalability: A single Site-to-Site VPN attached to a Transit Gateway provides connectivity to all VPCs, Direct Connect gateways, and other attachments linked to the Transit Gateway.\n- Equal-Cost Multi-Path (ECMP) Routing: You can aggregate up to 50 active VPN tunnels dynamically to scale total VPN bandwidth beyond the single-tunnel 1.25 Gbps limit (e.g., 4 tunnels = up to 5 Gbps aggregated throughput).\n- Dynamic Routing Requirement: ECMP with Transit Gateway requires dynamic routing with Border Gateway Protocol (BGP).\n- Simplified Routing: Inter-VPC and hybrid routes are managed in Transit Gateway route tables instead of individual VPC route tables.',
  keyPoints: [
    'Attaches a Site-to-Site VPN directly to AWS Transit Gateway as a central network hub.',
    'Enables on-premises connectivity to thousands of VPCs through a single VPN relationship.',
    'Supports Equal-Cost Multi-Path (ECMP) routing to scale VPN bandwidth beyond 1.25 Gbps.',
    'Requires dynamic Border Gateway Protocol (BGP) routing to leverage ECMP aggregation.',
    'Replaces complex mesh topologies and individual Virtual Private Gateways with centralized route management.'
  ],
  commonMistake: 'Expecting ECMP bandwidth scaling to work with static VPN routing. ECMP on AWS Transit Gateway requires dynamic routing via BGP where equal-cost routes are advertised across multiple VPN tunnels.',
  example: 'Transit Gateway VPN Hub Architecture:\nOn-Premises Core Router (BGP ASN 65000)\n  ↓ (4 IPsec Tunnels via ECMP, ~5 Gbps aggregate capacity)\nAWS Transit Gateway (Amazon Side ASN 64512)\n  ├── Attachment 1: Shared Services VPC (10.10.0.0/16)\n  ├── Attachment 2: Production E-Commerce VPC (10.20.0.0/16)\n  └── Attachment 3: Data Analytics VPC (10.30.0.0/16)',
  sources: [
    { title: 'Transit Gateway VPN attachments', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpn-attachments.html' },
    { title: 'AWS Site-to-Site VPN with AWS Transit Gateway', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/tgw-vpn-connect.html' }
  ]
});
