import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-4',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Site-to-Site VPN IPsec Connectivity',
  status: 'ready',
  plainEnglish: 'AWS Site-to-Site VPN creates an encrypted connection between your on-premises network (such as a corporate data centre or branch office) and your AWS cloud network over the public internet. It uses Internet Protocol Security (IPsec), a suite of standard security protocols that authenticate communicating devices and encrypt all data packets flowing across the network tunnel, ensuring confidentiality and integrity.',
  whyItMatters: 'Organizations need a fast, secure, and cost-effective way to link on-premises servers to cloud workloads without leasing expensive private circuits. IPsec VPN tunnels can be established in minutes over standard internet connections, enabling seamless hybrid cloud communication while protecting sensitive business data from eavesdropping or tampering.',
  workplaceExample: 'An enterprise healthcare provider needs their on-premises electronic medical record (EMR) server to securely replicate anonymised patient analytics data to an Amazon Aurora database in their AWS VPC. The network engineer establishes an AWS Site-to-Site VPN connection using AES-256 IPsec encryption over their existing business fibre internet connection.',
  examFocus: 'SAA-C03 IPsec Technical Specifications:\n- Protocols & Security: Uses IKEv1 or IKEv2 (Internet Key Exchange) with Phase 1 and Phase 2 security associations, AES-128/AES-256 encryption, and SHA-1/SHA-2 hashing algorithms.\n- Network Topology: Consists of a Customer Gateway (representing the on-premises device) and a Virtual Private Gateway (VGW) or Transit Gateway (TGW) on the AWS side.\n- Redundancy: AWS automatically provisions TWO active IPsec tunnels per Site-to-Site VPN connection, each terminating in a different Availability Zone in the AWS Region.\n- Throughput: Each individual VPN tunnel supports up to 1.25 Gbps of bandwidth. You can use ECMP (Equal-Cost Multi-Path) routing with AWS Transit Gateway to aggregate multiple tunnels for higher throughput.',
  keyPoints: [
    'Securely connects on-premises networks to AWS VPCs or Transit Gateways over the public internet.',
    'Uses industry-standard IPsec (IKEv1 and IKEv2) encryption and authentication protocols.',
    'AWS provides two distinct VPN tunnels for each connection terminating in separate Availability Zones for high availability.',
    'Supports up to 1.25 Gbps maximum bandwidth per single VPN tunnel.',
    'Both static routing and dynamic Border Gateway Protocol (BGP) routing are supported.'
  ],
  commonMistake: 'Configuring only one of the two IPsec tunnels on the customer gateway device. While traffic can flow over a single tunnel, AWS requires configuring both tunnels so that automatic failover occurs seamlessly during AWS maintenance or network path disruption.',
  example: 'Site-to-Site VPN IPsec Connection Structure:\n- On-premises: Cisco ISR router (Customer Gateway, IP 203.0.113.12).\n- AWS Endpoint: Virtual Private Gateway (VGW) attached to VPC (CIDR 10.20.0.0/16).\n- Tunnel 1: Outside AWS IP 198.51.100.1, Inside CIDR 169.254.10.0/30, AES-256, SHA-256, DH Group 14.\n- Tunnel 2: Outside AWS IP 198.51.100.2, Inside CIDR 169.254.10.4/30, AES-256, SHA-256, DH Group 14.',
  sources: [
    { title: 'What is AWS Site-to-Site VPN?', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html' },
    { title: 'Site-to-Site VPN connection options', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPN_Options.html' }
  ]
});
