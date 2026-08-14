import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-11',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Transit Virtual Interfaces - Transit VIF',
  status: 'ready',
  plainEnglish: 'A Transit Virtual Interface (Transit VIF) is a specialized Virtual Interface type used to connect an AWS Direct Connect link directly to an AWS Transit Gateway. While a Private VIF can only connect to a Virtual Private Gateway (VGW) or Direct Connect Gateway (DXGW) attached to individual VPCs, a Transit VIF connects to a Direct Connect Gateway attached to an AWS Transit Gateway, enabling connectivity to thousands of VPCs and on-premises networks in a hub-and-spoke model.',
  whyItMatters: 'In large enterprise environments with hundreds of VPCs, attaching individual Private VIFs to every VPC is unmanageable. A Transit VIF consolidates all VPC traffic into a single connection through AWS Transit Gateway.',
  workplaceExample: 'A multinational corporation manages 150 VPCs across multiple AWS accounts. Instead of managing dozens of Private VIFs, the network team creates 1 Transit VIF on their Direct Connect line, connects it to a Direct Connect Gateway, and links it to an AWS Transit Gateway. On-premises users can route to all 150 VPCs through one interface.',
  examFocus: 'Crucial SAA-C03 rule: To connect Direct Connect to an AWS Transit Gateway, you MUST use a Transit VIF (not a Private VIF). The Transit VIF attaches to a Direct Connect Gateway, which then attaches to the Transit Gateway. Transit VIF requires a 1 Gbps or higher connection capacity (Dedicated or Hosted).',
  keyPoints: [
    'Connects AWS Direct Connect to an AWS Transit Gateway.',
    'Enables single-interface connectivity to thousands of VPCs in a hub-and-spoke topology.',
    'Requires attaching the Transit VIF to a Direct Connect Gateway configured for Transit Gateway.',
    'Requires connection capacity of 1 Gbps or higher (Dedicated or Hosted).',
    'Simplifies multi-VPC routing and centralization.'
  ],
  commonMistake: 'Trying to attach a standard Private VIF directly to an AWS Transit Gateway. Transit Gateway requires a Transit VIF; Private VIFs only attach to Virtual Private Gateways or standard Direct Connect Gateways.',
  example: 'Transit VIF Architecture:\nOn-Premises Router -> Transit VIF (VLAN 300) -> Direct Connect Gateway -> AWS Transit Gateway -> 200 Attached VPCs.',
  sources: [
    { title: 'AWS Direct Connect Transit Virtual Interfaces', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-transit-gateways.html' }
  ]
});
