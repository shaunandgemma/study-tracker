import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-16',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Site-to-Site VPN vs Client VPN',
  status: 'ready',
  plainEnglish: 'AWS Site-to-Site VPN and AWS Client VPN serve two fundamentally different networking use cases. Site-to-Site VPN connects an entire remote physical network (like a corporate headquarters, data centre, or branch office) to AWS using IPsec hardware or software gateway appliances. In contrast, AWS Client VPN connects individual end users (such as remote employees on laptops or mobile devices) directly to AWS VPC resources using an OpenVPN desktop software client over TLS.',
  whyItMatters: 'Selecting the correct VPN architecture determines security posture, client software requirements, and hardware costs. Attempting to install client software on every branch office machine is wasteful when a single Site-to-Site gateway can connect the entire office, while attempting to use Site-to-Site VPN for home-based teleworkers is impossible without shipping routers to every employee.',
  workplaceExample: 'A software company implements both solutions: they configure an AWS Site-to-Site VPN on the central office firewall so all 200 on-premises desktop computers connect transparently to AWS without client software. For their 50 remote developers working from home or coffee shops, they provide AWS Client VPN profiles for secure laptop access with Okta MFA.',
  examFocus: 'SAA-C03 Architectural Decision: Site-to-Site VPN vs Client VPN:\n- Target Endpoint:\n  * Site-to-Site VPN: Entire network / location (Site-to-Cloud). Hardware router or firewall required.\n  * Client VPN: Individual user device (Client-to-Cloud). OpenVPN software application required on user device.\n- Protocols & Ports:\n  * Site-to-Site VPN: IPsec (IKEv1/IKEv2), UDP 500, UDP 4500 (NAT-T), Protocol 50 (ESP).\n  * Client VPN: OpenVPN over TLS, TCP or UDP port 443.\n- User Authentication:\n  * Site-to-Site: Pre-Shared Key (PSK) or Private Certificate between gateways.\n  * Client VPN: Active Directory, SAML 2.0 Identity Provider (SSO), or Mutual Certificates per user.\n- Exam Clues: "Remote workers working from home" → AWS Client VPN; "Connect on-premises data centre or branch office" → AWS Site-to-Site VPN.',
  keyPoints: [
    'Site-to-Site VPN connects entire office/data-centre networks using IPsec gateway routers.',
    'Client VPN connects individual end-user devices using OpenVPN software clients over TLS.',
    'Site-to-Site VPN requires no software on individual user devices.',
    'Client VPN integrates with enterprise identity providers (Active Directory, SAML SSO, Okta, Entra ID) for user-level access.',
    'Choosing between them depends on whether the connection is site-level (infrastructure) or individual user-level (remote workforce).'
  ],
  commonMistake: 'Recommending AWS Site-to-Site VPN for remote teleworkers or mobile staff. Site-to-Site VPN requires a stationary hardware/software router with a static public IP; remote mobile workers must use AWS Client VPN.',
  example: 'Decision Matrix Comparison:\n| Feature | AWS Site-to-Site VPN | AWS Client VPN |\n| :--- | :--- | :--- |\n| Connection Scope | Network-to-Network (entire office) | Device-to-Network (single user) |\n| Client Software | None (configured on router) | OpenVPN / AWS Client VPN app |\n| Transport Protocol | IPsec (IKE/ESP) | OpenVPN / TLS |\n| Authentication | Pre-Shared Key / Gateway Certificate | AD / SAML 2.0 / User Certificate |\n| Scaling Unit | Per connection (1.25 Gbps/tunnel) | Per active client connection |',
  sources: [
    { title: 'Comparing Site-to-Site VPN and Client VPN', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html' },
    { title: 'AWS Client VPN concepts and architecture', url: 'https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html' }
  ]
});
