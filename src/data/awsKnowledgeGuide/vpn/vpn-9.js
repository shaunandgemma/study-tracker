import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-9',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Static Routing',
  status: 'ready',
  plainEnglish: 'Static Routing for AWS Site-to-Site VPN is a routing method where network engineers manually specify the exact on-premises IP address prefixes (CIDR blocks) that should be reachable through the VPN connection. When traffic in AWS needs to reach an on-premises subnet, AWS looks at manually entered static routes to direct the packets through the IPsec VPN tunnels, without the devices exchanging dynamic routing updates with each other.',
  whyItMatters: 'Some older, entry-level, or branch-office router devices do not support dynamic routing protocols like Border Gateway Protocol (BGP). Static routing allows organizations with simpler network hardware or small, unchanging branch office networks to establish Site-to-Site VPN connectivity to AWS without purchasing new routing hardware.',
  workplaceExample: 'A small regional warehouse uses a basic legacy firewall (which lacks BGP support) with a local subnet of `192.168.50.0/24`. The cloud administrator configures a static Site-to-Site VPN in AWS, enters `192.168.50.0/24` as a static route on the VPN connection, and enables route propagation on the VPC route tables.',
  examFocus: 'SAA-C03 Static Routing Considerations:\n- Use Case: When on-premises customer gateway devices do not support BGP, or for simple, fixed networks with infrequent route changes.\n- Route Specification: Must manually specify every on-premises CIDR block in the VPN connection configuration.\n- Tunnel Selection: With static routing, AWS does not automatically perform load balancing or state-aware automatic failover across tunnels; AWS typically prefers one tunnel and you must configure IPsec dead peer detection (DPD) on the customer gateway.\n- Route Table Integration: Static VPN routes can still be automatically propagated into VPC route tables if Route Propagation is enabled on the route table, or added manually as routes targeting the Virtual Private Gateway.',
  keyPoints: [
    'Routing method where network administrators manually define reachable on-premises CIDR blocks.',
    'Ideal for older or simpler customer gateway appliances that lack BGP support.',
    'Requires manual updates whenever on-premises network address ranges are added, removed, or modified.',
    'Does not support dynamic multi-path routing or dynamic prefix advertisement.',
    'Dead Peer Detection (DPD) must be enabled on the customer gateway device to handle tunnel health checks.'
  ],
  commonMistake: 'Adding a new subnet to an on-premises data centre and forgetting to update the static routes in the AWS Site-to-Site VPN configuration, causing traffic destined for the new subnet to be dropped in AWS.',
  example: 'Creating a Static Site-to-Site VPN Connection via AWS CLI:\naws ec2 create-vpn-connection \\\n  --type ipsec.1 \\\n  --customer-gateway-id cgw-0123456789abcdef0 \\\n  --vpn-gateway-id vgw-0fedcba9876543210 \\\n  --options "StaticRoutesOnly=true" \\\n  --tag-specifications "ResourceType=vpn-connection,Tags=[{Key=Name,Value=Warehouse-Static-VPN}]"\n\naws ec2 create-vpn-connection-route \\\n  --vpn-connection-id vpn-0aabbccddeeff0011 \\\n  --destination-cidr-block 192.168.50.0/24',
  sources: [
    { title: 'Site-to-Site VPN routing options', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPN_Routing_Types.html' },
    { title: 'Working with static routes for Site-to-Site VPN', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-static-routes-working-with.html' }
  ]
});
