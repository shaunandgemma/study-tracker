import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-13',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Direct Connect with Virtual Private Gateway',
  status: 'ready',
  plainEnglish: 'Connecting Direct Connect to a Virtual Private Gateway (VGW) is the classic pattern for establishing private connectivity to a single Amazon VPC. A Virtual Private Gateway is the virtual router endpoint attached to the edge of your VPC. By creating a Private Virtual Interface (Private VIF) on your Direct Connect connection and associating it with the VPC\'s VGW, traffic routes directly between your on-premises network and that specific VPC.',
  whyItMatters: 'This is the fundamental building block for hybrid AWS network connectivity. It allows isolated corporate networks to access EC2 instances and internal services in a specific VPC over a private, high-performance link.',
  workplaceExample: 'A startup deploys its application infrastructure inside a single VPC in us-east-1. They set up a Virtual Private Gateway on the VPC and link it to their Direct Connect Private VIF, allowing developers in their office to SSH into private EC2 instances without opening public IP addresses.',
  examFocus: 'SAA-C03 architecture choice:\n- Single VPC in 1 region -> Private VIF directly to Virtual Private Gateway (VGW).\n- Multiple VPCs in multiple regions -> Private VIF to Direct Connect Gateway (DXGW) -> VGWs.\n- Hundreds of VPCs with complex routing -> Transit VIF to Direct Connect Gateway -> AWS Transit Gateway.',
  keyPoints: [
    'Attaches a Private VIF to a Virtual Private Gateway (VGW) on a single VPC.',
    'Provides private IPv4/IPv6 communication to resources inside that VPC.',
    'Requires configuring VPC route tables to propagate routes from the VGW.',
    'Limited to 1 VPC per VGW connection.',
    'Can be combined with AWS Site-to-Site VPN on the same VGW for failover redundancy.'
  ],
  commonMistake: 'Forgetting to enable Route Propagation on the VPC route table. If route propagation is disabled, the VPC subnet route table won\'t learn the on-premises routes advertised by the VGW via BGP.',
  example: 'VPC Route Table Configuration:\nDestination: `10.0.0.0/16` (On-Premises Network)\nTarget: `vgw-0123456789abcdef0`\nPropagated: Yes',
  sources: [
    { title: 'AWS Direct Connect Virtual Private Gateways', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html' }
  ]
});
