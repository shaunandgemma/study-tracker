import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-13',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Accelerated Site-to-Site VPN',
  status: 'ready',
  plainEnglish: 'Accelerated Site-to-Site VPN is an AWS VPN feature that integrates AWS Global Accelerator with your Site-to-Site VPN connection. Instead of routing VPN traffic entirely across the unpredictable public internet to an AWS Region on another continent, your on-premises router connects to the nearest AWS Global Edge Location (Points of Presence) via Anycast IP addresses. From that closest edge location, traffic travels across the high-speed, congestion-free AWS private global fiber network to your target AWS Transit Gateway.',
  whyItMatters: 'Long-distance international VPN connections traversing multiple internet service providers (ISPs) suffer from jitter, packet loss, and high latency. Accelerated VPN drastically reduces network hops over the public internet, providing consistent throughput, lower latency, and higher reliability for globally dispersed branch offices.',
  workplaceExample: 'A mining enterprise operates remote exploration facilities in Western Australia that need reliable, low-latency access to CAD applications and modeling servers hosted in the AWS us-east-1 (N. Virginia) Region. By enabling Accelerated Site-to-Site VPN on their Transit Gateway connection, VPN packets enter the AWS global network at the Perth Edge Location and traverse AWS backbone fiber directly to Virginia.',
  examFocus: 'SAA-C03 Accelerated VPN Essentials:\n- Underlying Technology: Powered by AWS Global Accelerator and AWS edge locations using Anycast static IP addresses.\n- Prerequisite: Accelerated VPN is supported ONLY on VPN connections attached to an AWS Transit Gateway (it is not supported on Virtual Private Gateways).\n- Performance Benefit: Significantly reduces packet loss, routing jitter, and latency compared to standard internet-based VPN for long-distance/cross-region connectivity.\n- Pricing & Bandwidth: Incurs standard VPN connection charges plus AWS Global Accelerator data transfer and hourly fees per IP set.',
  keyPoints: [
    'Uses AWS Global Accelerator to route VPN traffic over the AWS global fiber backbone.',
    'Terminates IPsec tunnels at the closest AWS Edge Location instead of the target AWS Region.',
    'Significantly improves consistency, lowers jitter, and reduces packet loss for long-distance links.',
    'Requires an AWS Transit Gateway attachment (not supported with Virtual Private Gateways).',
    'Provides two static Anycast IP addresses for the VPN tunnel endpoints.'
  ],
  commonMistake: 'Attempting to configure Accelerated Site-to-Site VPN on a connection attached to a standard Virtual Private Gateway (VGW). Acceleration is an exclusive feature of Transit Gateway VPN attachments.',
  example: 'Standard VPN vs Accelerated VPN Path:\nStandard VPN: Branch Office (Singapore) → ISP 1 → ISP 2 → Transpacific Public Cables → AWS us-east-1 VPC (High Jitter / Variable Latency)\nAccelerated VPN: Branch Office (Singapore) → Nearest AWS Edge (Singapore) → AWS Global Fiber Backbone → AWS us-east-1 Transit Gateway (Consistent Low Latency)',
  sources: [
    { title: 'Accelerated Site-to-Site VPN connections', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/accelerated-vpn.html' },
    { title: 'AWS Global Accelerator and Site-to-Site VPN', url: 'https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-benefits-of-migrating.html' }
  ]
});
