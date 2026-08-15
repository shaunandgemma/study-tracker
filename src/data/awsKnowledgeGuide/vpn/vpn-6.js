import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-6',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Virtual Private Gateway',
  status: 'ready',
  plainEnglish: 'A Virtual Private Gateway (VGW) is the logical VPN concentrator attached to the edge of a single Amazon VPC. It serves as the AWS-side target for Site-to-Site VPN connections and AWS Direct Connect private virtual interfaces (VIFs). When an on-premises network establishes an IPsec VPN tunnel directly to a specific VPC, the tunnel terminates at that VPC\'s Virtual Private Gateway.',
  whyItMatters: 'A Virtual Private Gateway provides a fully managed, highly available gateway component on the AWS side without requiring you to launch and maintain software VPN instances in your VPC. It manages IPsec encryption, tunnel endpoints across multiple Availability Zones, and route propagation into VPC route tables.',
  workplaceExample: 'An accounting firm operates a dedicated production VPC (`10.30.0.0/16`) in the us-east-1 Region. The cloud architect creates a Virtual Private Gateway, attaches it to the production VPC, enables route propagation on private database subnet route tables, and attaches a Site-to-Site VPN to connect the firm\'s central office router.',
  examFocus: 'SAA-C03 Virtual Private Gateway Limitations & Behavior:\n- 1:1 VPC Attachment: A Virtual Private Gateway can be attached to exactly ONE VPC at a time (it cannot be shared across multiple VPCs).\n- Contrast with Transit Gateway: If you need to connect on-premises to dozens or hundreds of VPCs, use AWS Transit Gateway instead of managing separate VGWs and VPN connections for every VPC.\n- Amazon Side ASN: You can specify a custom private Autonomous System Number (ASN) for the VGW or use the AWS default ASN (64512).\n- Route Propagation: Enabling route propagation on a subnet route table automatically injects on-premises routes advertised via BGP or static VPN routes into the VPC route table without manual route entry.',
  keyPoints: [
    'Managed VPN concentrator and termination point on the AWS side for a single VPC.',
    'Can be attached to only one Amazon VPC at any given time (1:1 relationship).',
    'Terminates Site-to-Site VPN connections and AWS Direct Connect private virtual interfaces.',
    'Supports custom private BGP Autonomous System Numbers (ASN) or the AWS default 64512.',
    'Integrates with VPC route tables via automatic Route Propagation for both static and dynamic routes.'
  ],
  commonMistake: 'Attempting to attach a single Virtual Private Gateway to multiple VPCs to achieve inter-VPC or multi-VPC VPN connectivity. A VGW attaches strictly to one VPC; for multi-VPC hub-and-spoke topologies, use AWS Transit Gateway.',
  example: 'Creating and Attaching a Virtual Private Gateway:\n1. Open Amazon VPC console → Virtual private gateways → Create virtual private gateway.\n2. Set Name tag to `vgw-production-app` and configure private ASN 64512.\n3. Select the new VGW → Actions → Attach to VPC → Choose `vpc-prod-10-30-0-0`.\n4. Navigate to Route Tables → Subnet route table → Route propagation tab → Enable propagation.',
  sources: [
    { title: 'Virtual private gateways for Site-to-Site VPN', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-vpg-working-with.html' },
    { title: 'Site-to-Site VPN architecture', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-architectures.html' }
  ]
});
