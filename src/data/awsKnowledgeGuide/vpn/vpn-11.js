import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-11',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'VPN Route Propagation',
  status: 'ready',
  plainEnglish: 'Route Propagation is an Amazon VPC route table feature that automatically injects network routes learned from a Virtual Private Gateway (VGW) directly into your VPC route tables. When route propagation is enabled on a route table, any on-premises network ranges received via BGP advertisements or configured as static VPN routes appear immediately in the route table with the Virtual Private Gateway as the target.',
  whyItMatters: 'Without route propagation, a cloud engineer would have to manually add and maintain individual static route entries pointing to `vgw-xxxx` in every single VPC subnet route table. In dynamic hybrid environments, route propagation eliminates manual route entry errors and automatically keeps routing tables synchronized as on-premises subnets change.',
  workplaceExample: 'A database engineering team maintains 12 private database subnets in a production VPC. When setting up a Site-to-Site VPN connection to their on-premises analytics cluster, the engineer simply clicks "Enable route propagation" on the private route tables. The BGP routes (`172.16.0.0/16`) instantly populate the route tables with status "Propagated: Yes".',
  examFocus: 'SAA-C03 Route Propagation Details:\n- Configuration Location: Enabled per VPC route table in the Amazon VPC console (under the "Route propagation" tab) or via the API (`EnableVgwRoutePropagation`).\n- Precedence / Route Priority: Static routes manually added to a route table always take precedence over propagated routes if the destination CIDRs have identical prefix lengths.\n- Longest Prefix Match Rule: Standard longest prefix match always applies first (e.g., a propagated `10.0.0.0/24` route is preferred over a static `10.0.0.0/16` route).\n- Dynamic & Static Support: Route propagation works for both BGP-advertised dynamic routes and static VPN routes associated with the VGW.',
  keyPoints: [
    'Automatically populates VPC route tables with routes received from a Virtual Private Gateway.',
    'Works with both dynamic BGP route advertisements and static VPN routes.',
    'Enabled on a per-route-table basis within the VPC management console or API.',
    'Eliminates the need for manual static route maintenance across multiple subnet route tables.',
    'Manually entered static routes take priority over propagated routes of identical CIDR length.'
  ],
  commonMistake: 'Creating a Site-to-Site VPN connection and expecting instances in private subnets to communicate with on-premises immediately without enabling route propagation (or manually adding routes to the VGW) in the subnet route tables.',
  example: 'Enabling Route Propagation via AWS CLI:\naws ec2 enable-vgw-route-propagation \\\n  --route-table-id rtb-0123456789abcdef0 \\\n  --gateway-id vgw-0fedcba9876543210\n\nResult in Route Table:\nDestination: 172.16.0.0/16 | Target: vgw-0fedcba9876543210 | Status: Active | Propagated: Yes',
  sources: [
    { title: 'Enable route propagation in your VPC route table', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-route-propagation.html' },
    { title: 'VPC routing and route tables', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html' }
  ]
});
