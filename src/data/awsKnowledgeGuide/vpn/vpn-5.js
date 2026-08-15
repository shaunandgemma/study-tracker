import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpn-5',
  topicId: 'topic-vpn',
  topicTitle: 'AWS Site-to-Site VPN',
  objectiveCode: 'Networking',
  title: 'Customer Gateway',
  status: 'ready',
  plainEnglish: 'In AWS networking, a Customer Gateway is an AWS resource that represents your physical or software appliance on the customer side of a Site-to-Site VPN connection (such as a router, firewall, or security appliance in your on-premises data centre or office). When configuring a VPN in AWS, you create a Customer Gateway resource to provide AWS with your appliance\'s public IP address, routing type (static or dynamic), and optional Border Gateway Protocol Autonomous System Number (BGP ASN).',
  whyItMatters: 'AWS needs to know the exact public IP endpoint and routing capabilities of your physical or virtual appliance before it can provision and configure the AWS side of the IPsec tunnels. Creating a Customer Gateway resource is the prerequisite first step in building any AWS Site-to-Site VPN.',
  workplaceExample: 'A systems administrator at an online retail headquarters prepares to connect their on-premises Cisco ASA firewall (public IP 198.51.100.55) to AWS. In the Amazon VPC console, the administrator creates a Customer Gateway named `HQ-Cisco-ASA`, specifies the static public IPv4 address, and selects dynamic BGP routing with their private ASN 65000.',
  examFocus: 'SAA-C03 Customer Gateway Concepts:\n- Definition: A Customer Gateway in AWS is a configuration resource representing your physical or software router/firewall on-premises.\n- IP Addressing: Requires a static, routable public IPv4 address on the customer device. If the device sits behind a NAT device, NAT-Traversal (NAT-T) on UDP port 4500 is supported.\n- BGP ASN: For dynamic routing, specify a 2-byte or 4-byte Autonomous System Number (e.g., private ASN in the 64512–65534 range).\n- Certificate Authentication: Customer gateways can also be configured with private certificates instead of pre-shared keys (PSKs) for IKE authentication.\n- Device Configuration Files: After creating the VPN connection, AWS lets you download vendor-specific configuration templates (Cisco, Juniper, Fortinet, pfSense, generic) for the customer gateway device.',
  keyPoints: [
    'AWS resource that stores information about the on-premises firewall, router, or appliance.',
    'Requires the publicly routable static IP address of the on-premises VPN endpoint.',
    'Supports NAT-Traversal (NAT-T) using UDP port 4500 if the device is behind a NAT device.',
    'Holds routing configuration: static IP prefix list or dynamic BGP Autonomous System Number (ASN).',
    'AWS console provides downloadable, vendor-tailored configuration scripts based on the Customer Gateway setup.'
  ],
  commonMistake: 'Confusing the AWS Customer Gateway resource with the physical device itself. The Customer Gateway in the AWS console is a cloud representation containing configuration metadata (public IP, ASN, certificate ARN); the physical router remains in your local data centre.',
  example: 'Creating a Customer Gateway via AWS CLI:\naws ec2 create-customer-gateway \\\n  --type ipsec.1 \\\n  --public-ip 198.51.100.55 \\\n  --bgp-asn 65000 \\\n  --tag-specifications "ResourceType=customer-gateway,Tags=[{Key=Name,Value=Corporate-Headquarters-Router}]"',
  sources: [
    { title: 'Customer gateway devices for your Site-to-Site VPN', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/your-cgw.html' },
    { title: 'Working with customer gateways', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/cgw-working-with.html' }
  ]
});
