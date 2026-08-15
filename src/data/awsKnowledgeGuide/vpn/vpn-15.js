import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-15',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Site-to-Site VPN with Direct Connect',
  status: 'ready',
  plainEnglish: 'AWS Site-to-Site VPN with Direct Connect is an architecture that combines the dedicated high-bandwidth, consistent latency of an AWS Direct Connect physical line with the cryptographic encryption of an IPsec VPN. You can either deploy a Site-to-Site VPN as an automatic, cost-effective backup failover path if Direct Connect fails, or run an IPsec VPN directly inside a Direct Connect Public Virtual Interface (Public VIF) or Transit Virtual Interface (Transit VIF) to encrypt all traffic traversing the private circuit.',
  whyItMatters: 'Standard AWS Direct Connect circuits provide dedicated private connectivity, but traffic traversing standard Direct Connect is not encrypted by default. By overlaying an IPsec Site-to-Site VPN over Direct Connect (or using VPN as an automatic failover circuit), organizations satisfy strict enterprise compliance mandates (such as HIPAA, PCI-DSS, or FedRAMP) requiring end-to-end encryption while guaranteeing business continuity.',
  workplaceExample: 'A commercial bank uses a 10 Gbps AWS Direct Connect connection for real-time transactions between its core banking mainframe and AWS. Because banking regulations require end-to-end payload encryption at Layer 3, the bank establishes an IPsec Site-to-Site VPN tunnel across the Direct Connect circuit. Additionally, the bank maintains an internet-based VPN as a secondary failover backup if physical fibre is severed.',
  examFocus: 'SAA-C03 Direct Connect + VPN Hybrid Architectures:\n- Architecture Pattern 1 (Cost-Effective Failover): Direct Connect is primary (higher bandwidth/lower latency); Site-to-Site VPN over internet is backup. Use BGP AS path prepending on the VPN or lower BGP local preference on Direct Connect to prefer DX when healthy.\n- Architecture Pattern 2 (End-to-End Encryption): Run an IPsec VPN on top of a Direct Connect Public VIF or Transit VIF with Transit Gateway to encrypt in-flight data on dedicated private circuits.\n- Direct Connect MACsec: For Layer 2 hardware encryption on 10 Gbps and 100 Gbps dedicated Direct Connect ports (alternative to IPsec VPN at Layer 3).',
  keyPoints: [
    'Provides automated, cost-effective backup for AWS Direct Connect circuits during physical outages.',
    'Allows layering IPsec encryption on top of Direct Connect (via Public VIF or Transit VIF) for regulatory compliance.',
    'BGP routing policies (AS path prepending / local preference) automate seamless failover between DX and VPN.',
    'Standard Direct Connect does not encrypt traffic in transit by default unless combined with VPN or MACsec.',
    'Eliminates the need to purchase two expensive Direct Connect connections when high-availability failover can be served by VPN.'
  ],
  commonMistake: 'Assuming that AWS Direct Connect traffic is automatically encrypted in transit. Direct Connect provides a private network circuit, but payloads are in cleartext unless encrypted via IPsec VPN, TLS at the application layer, or MACsec.',
  example: 'Direct Connect with VPN Backup Failover Routing:\n- Direct Connect BGP Advertisement: Advertises on-prem CIDR `10.0.0.0/16` with standard AS Path `[65000]` (Primary path).\n- Internet VPN BGP Advertisement: Advertises `10.0.0.0/16` with prepended AS Path `[65000, 65000, 65000]` (Backup path).\n- Normal Operation: AWS sends traffic over Direct Connect because it has the shorter AS Path.\n- Outage Event: Direct Connect BGP session goes down; AWS instantly shifts traffic to the VPN tunnel.',
  sources: [
    { title: 'Site-to-Site VPN as a backup to AWS Direct Connect', url: 'https://docs.aws.amazon.com/whitepapers/latest/hybrid-connectivity/aws-direct-connect-with-vpn-backup.html' },
    { title: 'Encrypting AWS Direct Connect with IPsec VPN', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/vpn-modes.html' }
  ]
});
