import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-r1',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Static Routing vs Dynamic Routing with BGP - Border Gateway Protocol',
  status: 'ready',
  plainEnglish: 'When establishing an AWS Site-to-Site VPN, you must decide whether to route network traffic between on-premises and AWS using Static Routing or Dynamic Routing with Border Gateway Protocol (BGP). Static routing requires human administrators to manually define every IP address prefix on both sides, and cannot automatically reroute traffic if a tunnel fails. Dynamic routing with BGP automatically discovers network routes, advertises new subnets as they are created, and detects tunnel failures in real time to shift traffic to redundant paths without human intervention.',
  whyItMatters: 'Route configuration determines the operational overhead, fault-tolerance, and scalability of your hybrid cloud network. Static routing introduces risk of human error whenever on-premises networks change and requires manual intervention during failover. Dynamic routing with BGP is the AWS-recommended standard for all production workloads because it provides automated failover, path selection, and multi-path bandwidth aggregation.',
  workplaceExample: 'An enterprise healthcare network connects multiple regional hospital campuses to AWS. The primary hospital uses dual Cisco routers running dynamic BGP peering with AWS (ASN 65100). When a fibre line at one ISP goes down, BGP withdraws the prefix on Tunnel 1 and reroutes all medical imaging uploads over Tunnel 2 in under 30 seconds with zero downtime.',
  examFocus: 'SAA-C03 Architectural Decision: Static vs Dynamic (BGP) Routing:\n- Routing Protocol: Static uses manual CIDR entries; Dynamic uses BGP over link-local peering (/30 inside IP prefixes).\n- Failover Behavior:\n  * Static: Relies on IPsec Dead Peer Detection (DPD); no automatic route failover across multiple tunnels without complex asymmetric routing handling.\n  * Dynamic (BGP): Sub-minute automatic failover when BGP keepalive timers expire; handles multi-tunnel active/active or active/passive failover automatically.\n- Path Selection Control: Dynamic routing supports BGP AS Path prepending and MED (Multi-Exit Discriminator) to specify primary and backup paths.\n- Transit Gateway ECMP: Only dynamic BGP routing supports Equal-Cost Multi-Path (ECMP) aggregation across multiple VPN tunnels on AWS Transit Gateway.\n- Hardware Compatibility: If customer gateway router lacks BGP capability, static routing is the only option.',
  keyPoints: [
    'Static routing requires manual entry of destination CIDR blocks; Dynamic routing uses BGP for automatic prefix discovery.',
    'Dynamic routing with BGP provides automated, sub-minute failover between redundant VPN tunnels.',
    'BGP attributes (AS Path prepending, MED) allow fine-grained inbound and outbound traffic engineering.',
    'Equal-Cost Multi-Path (ECMP) bandwidth scaling on Transit Gateway requires dynamic BGP routing.',
    'Dynamic BGP is strongly recommended by AWS for all production enterprise hybrid connections.'
  ],
  commonMistake: 'Choosing static routing for a complex multi-subnet production environment because "it seems simpler on day one." As new subnets are added or tunnels experience transient drops, static routing causes configuration drift, black-holed traffic, and manual outages.',
  example: 'Static vs Dynamic BGP Comparison Matrix:\n| Feature | Static Routing | Dynamic Routing with BGP |\n| :--- | :--- | :--- |\n| Route Discovery | Manual CIDR entry in AWS console | Automatic BGP advertisement |\n| Failover Time | Manual or slow (depends on DPD) | Fast / Automatic (BGP keepalive expiry) |\n| Route Table Sync | Must update manually on both ends | Automatic route propagation into VPC |\n| Path Control | Fixed static priority | BGP AS Path prepending & MED |\n| ECMP Multi-Path | Not supported | Supported on Transit Gateway (up to 50 Gbps) |\n| Best For | Simple/legacy hardware lacking BGP | All production enterprise hybrid architectures |',
  sources: [
    { title: 'Site-to-Site VPN routing options', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPN_Routing_Types.html' },
    { title: 'Customer gateway device BGP requirements', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/cgw-device-requirements.html' }
  ]
});
