import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-10',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Dynamic Routing with BGP',
  status: 'ready',
  plainEnglish: 'Dynamic Routing with BGP (Border Gateway Protocol) is an industry-standard routing protocol where the on-premises router and AWS automatically exchange routing information, network prefixes, and health metrics over the IPsec VPN tunnels. Instead of human administrators manually entering IP subnets, BGP peering sessions continually advertise available routes and detect broken links in real time, automatically rerouting traffic over healthy backup paths.',
  whyItMatters: 'Enterprise networks are dynamic: new subnets are added, maintenance occurs, and internet links occasionally fail. BGP eliminates human error in route management, provides sub-minute automatic failover when a tunnel drops, and enables advanced path selection and Equal-Cost Multi-Path (ECMP) traffic distribution.',
  workplaceExample: 'A global logistics company connects its primary data centre to AWS using BGP dynamic routing. When network engineers add three new internal application subnets on-premises, BGP automatically advertises the new CIDRs to AWS across the VPN tunnels. VPC route tables update automatically without requiring any manual route entries in the AWS console.',
  examFocus: 'SAA-C03 BGP dynamic routing concepts:\n- Autonomous System Numbers (ASN): Customer specifies their on-premises ASN (2-byte or 4-byte private ASN, e.g. 64512–65534) and AWS side ASN (defaults to 64512 on VGW, or configurable on Transit Gateway / VGW).\n- Inside IP Peering: AWS assigns link-local IPv4 addresses (from the 169.254.0.0/16 range, /30 prefixes) to each tunnel for BGP peering sessions.\n- Path Selection & Failover: BGP AS path prepending and Multi-Exit Discriminator (MED) values control which tunnel is preferred for outbound and inbound traffic.\n- Recommended Best Practice: AWS strongly recommends dynamic BGP routing over static routing for all production Site-to-Site VPNs because it enables automatic failover and automatic route discovery.',
  keyPoints: [
    'Uses Border Gateway Protocol (BGP) to automatically advertise and update reachable network prefixes.',
    'Establishes BGP peering sessions over link-local addresses (169.254.x.x/30) inside the IPsec tunnels.',
    'Provides automated fault detection and seamless sub-minute failover between redundant tunnels.',
    'Allows controlling traffic direction using BGP attributes like AS Path prepending and MED metrics.',
    'Recommended by AWS as the standard routing method for production enterprise hybrid deployments.'
  ],
  commonMistake: 'Using the same public ASN as a major ISP on your private customer gateway without owning it, or forgetting to open TCP port 179 (BGP protocol port) on the on-premises firewall across the inside tunnel interfaces.',
  example: 'BGP Peering Session Configuration:\n- Customer ASN: 65001 | AWS ASN: 64512\n- Tunnel 1 AWS inside IP: 169.254.12.1/30 (BGP Neighbor IP: 169.254.12.1)\n- Tunnel 1 Customer inside IP: 169.254.12.2/30\n- BGP advertised prefix from Customer: 10.50.0.0/16\n- BGP advertised prefix from AWS: 10.0.0.0/16',
  sources: [
    { title: 'Site-to-Site VPN routing options and BGP', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPN_Routing_Types.html' },
    { title: 'Customer gateway device BGP requirements', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/cgw-device-requirements.html' }
  ]
});
