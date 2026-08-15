import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-17',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Site-to-Site VPN vs Direct Connect',
  status: 'ready',
  plainEnglish: 'AWS Site-to-Site VPN and AWS Direct Connect are the two primary methods for establishing hybrid cloud connectivity between an on-premises network and AWS. Site-to-Site VPN connects your network to AWS across the public internet using encrypted IPsec tunnels, offering rapid setup and low initial cost. AWS Direct Connect establishes a dedicated, private physical fibre optic connection between your data centre and an AWS Direct Connect location, bypassing the public internet entirely for predictable latency, higher bandwidth, and lower data transfer costs.',
  whyItMatters: 'Choosing between VPN and Direct Connect is a fundamental architectural decision that balances procurement time, bandwidth requirements, data transfer volume, and latency sensitivity. VPN is fast and inexpensive to set up, while Direct Connect delivers consistent multi-gigabit throughput and lower per-gigabyte data egress costs for high-volume workloads.',
  workplaceExample: 'A video streaming platform ingests 500 TB of raw camera footage each month into AWS. Setting up an AWS Site-to-Site VPN allows engineers to begin uploading test clips on day one. For full-scale production, the company provisions a 10 Gbps AWS Direct Connect dedicated circuit to achieve consistent multi-gigabit throughput and reduce monthly data transfer egress fees.',
  examFocus: 'SAA-C03 Decision Criteria: VPN vs Direct Connect:\n- Setup Time:\n  * VPN: Minutes to hours.\n  * Direct Connect: Weeks to months (requires physical telecommunication cross-connect provisioning).\n- Cost Structure:\n  * VPN: Low hourly connection fee + standard internet Data Transfer Out (DTO) rates.\n  * Direct Connect: Port hourly fee + telecommunication circuit fees + significantly discounted Direct Connect DTO rates.\n- Performance & Bandwidth:\n  * VPN: Max 1.25 Gbps per tunnel, variable latency, subject to internet congestion.\n  * Direct Connect: 1 Gbps, 10 Gbps, 100 Gbps dedicated ports (or hosted connections 50 Mbps–10 Gbps), sub-millisecond deterministic latency.\n- Encryption:\n  * VPN: Encrypted by default (IPsec AES-256).\n  * Direct Connect: Not encrypted by default (requires MACsec or overlay IPsec VPN for encryption).\n- Exam Keyword Guide: "Immediate setup / lowest initial cost" → VPN; "High throughput / dedicated line / consistent network performance / lowest data transfer costs" → Direct Connect.',
  keyPoints: [
    'Site-to-Site VPN runs over the public internet with IPsec encryption and sets up in minutes.',
    'Direct Connect provides a dedicated private physical circuit bypassing the public internet.',
    'Direct Connect supports 1 Gbps, 10 Gbps, and 100 Gbps dedicated ports with consistent, deterministic latency.',
    'Direct Connect offers reduced data egress pricing compared to standard internet data transfer.',
    'A popular high-resilience architecture uses Direct Connect as primary and Site-to-Site VPN as an automatic failover backup.'
  ],
  commonMistake: 'Assuming Direct Connect can be set up immediately like a software service. Direct Connect requires ordering a physical cross-connect from an AWS Direct Connect partner, which takes weeks to complete.',
  example: 'Decision Matrix: Site-to-Site VPN vs Direct Connect\n| Requirement | Site-to-Site VPN | AWS Direct Connect |\n| :--- | :--- | :--- |\n| Network Path | Public Internet (IPsec Encrypted) | Dedicated Private Physical Circuit |\n| Setup Lead Time | Under 1 hour | 2 to 8 weeks |\n| Bandwidth | Up to 1.25 Gbps per tunnel | Up to 100 Gbps per dedicated connection |\n| Latency Consistency | Variable (public internet hops) | Deterministic / Consistent |\n| In-Transit Encryption | Built-in IPsec (AES-256) | None by default (supports MACsec or VPN overlay) |\n| Outbound Data Transfer Cost | Standard Internet DTO ($0.09/GB) | Discounted DX DTO (~$0.02/GB) |',
  sources: [
    { title: 'Comparing hybrid connectivity options', url: 'https://docs.aws.amazon.com/whitepapers/latest/hybrid-connectivity/aws-hybrid-connectivity-options.html' },
    { title: 'What is AWS Direct Connect?', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html' }
  ]
});
