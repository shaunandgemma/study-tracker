import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-3',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'AWS Client VPN (OpenVPN desktop remote worker access to VPC resources)',
  status: 'ready',
  plainEnglish: 'AWS Client VPN is a managed client-based VPN service that allows remote users, such as teleworkers or mobile employees, to securely connect to resources in an Amazon Virtual Private Cloud (VPC) and on-premises networks. Users install an OpenVPN-compatible software client on their laptops or mobile devices, authenticate using Active Directory, SAML 2.0 identity providers (such as Okta or Microsoft Entra ID), or mutual digital certificates, and establish an encrypted Transport Layer Security (TLS) tunnel into AWS.',
  whyItMatters: 'Remote employees need secure, encrypted access to internal databases, development environments, and internal web applications without exposing those workloads directly to the public internet. AWS Client VPN handles provisioning, high availability, and dynamic scaling automatically without requiring administrators to manage physical or virtual VPN concentrator appliances.',
  workplaceExample: 'A software development company has engineers working remotely across the globe. The company deploys an AWS Client VPN endpoint associated with a private subnet in their development VPC. Engineers launch the AWS Client VPN desktop app, sign in through corporate Single Sign-On (SSO) with Okta MFA, and access private RDS databases and internal microservices safely.',
  examFocus: 'SAA-C03 Client VPN Essentials:\n- Use Case: Remote workers / individual user devices connecting to VPC resources (client-to-site, NOT site-to-site).\n- Protocols: Uses OpenVPN protocol over TLS on TCP or UDP port 443.\n- Authentication Options: Active Directory (via AWS Directory Service), Federated SAML 2.0 Identity Provider, or Mutual Certificate-based authentication.\n- Authorization Rules: Granular network access rules specify which Active Directory user groups or client CIDRs can access specific VPC subnets or IP ranges.\n- Split Tunneling: Can be enabled so only traffic destined for corporate subnets traverses the VPN, while general internet traffic exits through the user\'s local ISP connection.',
  keyPoints: [
    'Managed client-to-VPC VPN service based on the OpenVPN protocol using TLS encryption.',
    'Enables individual remote workers to connect securely to VPC resources and on-premises networks.',
    'Supports Active Directory, SAML 2.0 federated SSO, and mutual certificate authentication.',
    'Granular authorization rules control which network CIDR blocks specific user groups can access.',
    'Split-tunneling support routes only VPC-destined traffic through the VPN tunnel, preserving client bandwidth for local internet traffic.'
  ],
  commonMistake: 'Confusing AWS Client VPN with AWS Site-to-Site VPN. Client VPN connects individual end-user devices (laptops/phones) to a VPC using an OpenVPN software client, whereas Site-to-Site VPN connects an entire remote office or data centre network to AWS using IPsec hardware or software gateways.',
  example: 'Configuring AWS Client VPN:\n1. Generate server and client certificates in AWS Certificate Manager (ACM).\n2. Create an AWS Client VPN endpoint with IPv4 CIDR 10.100.0.0/22.\n3. Configure SAML authentication pointing to corporate Okta IdP.\n4. Associate the endpoint with target VPC subnets (10.0.1.0/24 and 10.0.2.0/24).\n5. Add authorization rules permitting authenticated developers access to 10.0.0.0/16.\n6. Download and distribute the `.ovpn` configuration profile to engineers.',
  sources: [
    { title: 'What is AWS Client VPN?', url: 'https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html' },
    { title: 'AWS Client VPN endpoints', url: 'https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/cvpn-working-endpoints.html' }
  ]
});
