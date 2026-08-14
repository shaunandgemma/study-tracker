import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-14',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Direct Connect with Transit Gateway',
  status: 'ready',
  plainEnglish: 'Connecting Direct Connect to an AWS Transit Gateway combines high-speed, low-latency dedicated physical links with a centralized regional network hub. In this setup, you create a Transit Virtual Interface (Transit VIF) on your Direct Connect connection, associate it with a Direct Connect Gateway, and attach the Direct Connect Gateway to your AWS Transit Gateway. The Transit Gateway then acts as a central cloud router connecting hundreds of VPCs, SD-WAN networks, and on-premises data centers.',
  whyItMatters: 'As organizations scale to dozens or hundreds of VPCs, managing individual VPC connections becomes impossible. Integrating Direct Connect with Transit Gateway enables transitive routing, centralized firewall inspection, and simplified topology.',
  workplaceExample: 'An enterprise with 80 VPCs connects its corporate data center to AWS using Direct Connect. By linking their Direct Connect line (via Transit VIF and DXGW) to an AWS Transit Gateway, all 80 VPCs can communicate with on-premises servers and with each other through centralized Transit Gateway route tables.',
  examFocus: 'SAA-C03 architecture design:\n- Direct Connect + Transit Gateway enables TRANSITIVE routing between on-premises and multiple VPCs, as well as VPC-to-VPC routing.\n- Sequence required: Direct Connect Connection -> Transit VIF -> Direct Connect Gateway -> Transit Gateway Attachment -> Transit Gateway -> VPCs.',
  keyPoints: [
    'Enables transitive routing between on-premises data centers and hundreds of VPCs.',
    'Requires a Transit VIF (not a Private VIF) connected to a Direct Connect Gateway.',
    'Supports VPC-to-VPC routing through Transit Gateway route tables.',
    'Provides centralized management of security, firewalls, and routing policies.',
    'Scales to support cross-account multi-VPC enterprise topologies.'
  ],
  commonMistake: 'Attempting to connect a Transit Gateway directly to a Direct Connect Private VIF without a Transit VIF and Direct Connect Gateway. Transit Gateway integration strictly requires a Transit VIF.',
  example: 'Transit Gateway Connection Path:\nOn-Premises Data Center -> DX Dedicated Link (10 Gbps) -> Transit VIF -> Direct Connect Gateway -> TGW Attachment -> AWS Transit Gateway -> 100+ VPCs.',
  sources: [
    { title: 'Direct Connect Transit Gateways', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-transit-gateways.html' }
  ]
});
