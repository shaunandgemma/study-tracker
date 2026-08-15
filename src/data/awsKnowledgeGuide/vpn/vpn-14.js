import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-14',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Site-to-Site VPN over the Internet',
  status: 'ready',
  plainEnglish: 'AWS Site-to-Site VPN over the Internet is the standard deployment model where encrypted IPsec tunnels are established between your on-premises customer gateway router and AWS across standard public commercial internet connections. Because all data is encapsulated and strongly encrypted before leaving your router, you achieve private, confidential communication without purchasing dedicated physical telecommunication lines.',
  whyItMatters: 'Deploying a dedicated private leased line (like AWS Direct Connect) can take weeks or months to procure and install, alongside substantial upfront installation and fixed monthly port costs. A Site-to-Site VPN over the internet can be provisioned in minutes using your existing business broadband or fibre connection, making it ideal for immediate connectivity, branch offices, and cost-sensitive workloads.',
  workplaceExample: 'A newly opened retail branch office needs immediate access to the company\'s inventory management system hosted in an AWS VPC. While waiting for a local fibre provider to quote private line options, the network team configures an IPsec VPN on the branch Fortinet firewall over their existing 200 Mbps commercial broadband connection, bringing the store online in less than an hour.',
  examFocus: 'SAA-C03 Decision Criteria for Internet-based VPN:\n- Rapid Deployment: Can be provisioned and operational in under 30 minutes.\n- Low Cost: No dedicated circuit costs; pay only for hourly VPN connection fees and outbound internet data transfer.\n- Performance Characteristics: Subject to public internet conditions (variable latency, jitter, bandwidth contention with other internet traffic).\n- Maximum Throughput: Fixed at 1.25 Gbps per tunnel.\n- Encryption: Built-in IPsec encryption (AES-256) protects data in transit across all intermediate ISPs.',
  keyPoints: [
    'Establishes encrypted IPsec tunnels across standard public internet connections.',
    'Fastest method to establish hybrid cloud connectivity (operational in minutes).',
    'Low cost with no long-term telecommunication contract commitments.',
    'Provides built-in strong encryption (AES-128 / AES-256) for data in transit.',
    'Bandwidth and latency depend on commercial internet provider performance and path congestion.'
  ],
  commonMistake: 'Expecting guaranteed, constant sub-millisecond latency or SLA-backed dedicated bandwidth over an internet-based VPN. If deterministic latency and dedicated private bandwidth are mandatory, choose AWS Direct Connect.',
  example: 'Internet VPN Setup Checklist:\n1. On-premises router has a static public IPv4 address.\n2. Inbound/Outbound firewall rules allow UDP 500 (IKE), UDP 4500 (NAT-T), and IP Protocol 50 (ESP).\n3. Create Customer Gateway in AWS console.\n4. Create Site-to-Site VPN connection targeting Virtual Private Gateway or Transit Gateway.\n5. Apply downloaded configuration file to customer firewall.',
  sources: [
    { title: 'How AWS Site-to-Site VPN works', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/how_it_works.html' },
    { title: 'Site-to-Site VPN requirements', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/cgw-device-requirements.html' }
  ]
});
