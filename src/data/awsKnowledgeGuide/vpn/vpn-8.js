import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-8',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Two VPN Tunnels for High Availability',
  status: 'ready',
  plainEnglish: 'When you create an AWS Site-to-Site VPN connection, AWS automatically provisions two distinct, fully independent IPsec VPN tunnels. Each of these two tunnels terminates on a different AWS VPN endpoint situated in a separate Availability Zone within the chosen AWS Region. This dual-tunnel architecture ensures that if one AWS endpoint undergoes routine maintenance or encounters a hardware issue, network traffic automatically fails over to the second tunnel without disconnecting your site.',
  whyItMatters: 'Cloud connectivity is mission-critical for hybrid workloads. Because AWS regularly applies automated maintenance updates to individual VPN endpoints, configuring only a single tunnel on your customer gateway device guarantees intermittent connection drops during AWS maintenance windows. Configuring both tunnels provides resilient, fault-tolerant network uptime.',
  workplaceExample: 'An insurance provider runs claims processing servers on-premises that query databases in AWS. The network engineer configures their dual-WAN firewall with two active IPsec tunnels corresponding to the two AWS endpoints provided in the VPN configuration. During a scheduled AWS router maintenance event on Tunnel 1, BGP automatically shifts outbound traffic to Tunnel 2 without dropping active claims transactions.',
  examFocus: 'SAA-C03 Dual-Tunnel Redundancy Architecture:\n- AWS Side: Every Site-to-Site VPN automatically includes 2 public IP addresses terminating in separate AWS Availability Zones.\n- Customer Side Best Practice: Configure both tunnels on your Customer Gateway router.\n- Routing Behavior: With dynamic BGP routing, both tunnels can be active, or one can be preferred using BGP AS path prepending / MED (Multi-Exit Discriminator) metrics. When the primary tunnel drops, BGP health checks detect the failure and reroute over the second tunnel within seconds.\n- Full End-to-End HA: For maximum resilience against on-premises hardware failure, deploy two separate Customer Gateway physical routers, each running dual tunnels to AWS (4 tunnels total).',
  keyPoints: [
    'AWS provisions 2 separate IPsec tunnels per Site-to-Site VPN connection in different Availability Zones.',
    'Protects against AWS endpoint hardware failures and routine AWS maintenance windows.',
    'Both tunnels must be configured on the on-premises customer gateway device to achieve high availability.',
    'Dynamic routing with BGP provides automatic failover between tunnels without manual intervention.',
    'Maximum resilience requires two separate on-premises customer gateway devices with two tunnels each (4 total tunnels).'
  ],
  commonMistake: 'Configuring only Tunnel 1 on the on-premises router because "traffic works fine today." When AWS performs routine maintenance on Tunnel 1\'s endpoint, the entire hybrid connection drops because Tunnel 2 was never configured.',
  example: 'Dual-Tunnel Configuration Matrix:\n- VPN Connection ID: `vpn-0123456789abcdef0`\n- Tunnel 1 Outside IP: 198.51.100.1 (AZ 1) | Inside BGP IPv4: 169.254.10.1/30 (AWS) / 169.254.10.2/30 (Customer)\n- Tunnel 2 Outside IP: 198.51.100.2 (AZ 2) | Inside BGP IPv4: 169.254.10.5/30 (AWS) / 169.254.10.6/30 (Customer)\n- BGP Keepalive Timer: 10s | Hold-time: 30s for rapid automatic failover.',
  sources: [
    { title: 'Site-to-Site VPN redundancy and tunnel endpoints', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-redundancy.html' },
    { title: 'Customer gateway device redundancy', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/cgw-redundancy.html' }
  ]
});
