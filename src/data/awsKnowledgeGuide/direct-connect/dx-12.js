import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-12',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Direct Connect Gateway',
  status: 'ready',
  plainEnglish: 'A Direct Connect Gateway (DXGW) is a globally available Amazon network resource that groups Direct Connect connections together with VPCs located in any AWS Region (except China). It acts as a global virtual router, allowing an on-premises data center connected to a Direct Connect location in one region (e.g. US East) to communicate directly with VPCs in multiple other AWS regions (e.g. EU West, Asia Pacific) over a Private VIF or Transit VIF.',
  whyItMatters: 'Before Direct Connect Gateway, connecting on-premises networks to VPCs in multiple AWS regions required establishing separate physical Direct Connect connections or complex VPN tunnels in each region. DXGW enables multi-region connectivity over a single Direct Connect link.',
  workplaceExample: 'A global company has a single data center in Frankfurt connected via Direct Connect. They deploy production VPCs in Frankfurt (eu-central-1), Ireland (eu-west-1), and Virginia (us-east-1). By attaching their Private VIF to a Direct Connect Gateway, all three regional VPCs connect to Frankfurt on-premises servers seamlessly.',
  examFocus: 'SAA-C03 multi-region connectivity rule: Direct Connect Gateway allows 1 Direct Connect connection to access VPCs across MULTIPLE AWS Regions. Note: DXGW does NOT enable VPC-to-VPC communication (VPCs attached to a DXGW cannot talk to each other through the DXGW unless Transit Gateway or VPC Peering is used).',
  keyPoints: [
    'Global resource that bridges Direct Connect connections to VPCs across multiple AWS regions.',
    'Eliminates the need for multiple physical connections to reach different regions.',
    'Connects to Virtual Private Gateways (VGWs) via Private VIFs or Transit Gateways via Transit VIFs.',
    'Does NOT route traffic directly between attached VPCs (no transitive routing between VPCs).',
    'Free to create (you only pay for Direct Connect port hours and data transfer out).'
  ],
  commonMistake: 'Assuming VPC A and VPC B can communicate with each other simply because both are attached to the same Direct Connect Gateway. DXGW only facilitates On-Premises-to-VPC routing, not VPC-to-VPC routing.',
  example: 'DXGW Multi-Region Setup:\nDirect Connect Location: London\nDXGW Name: `Global-DX-Gateway`\nAttached VPCs:\n1. VGW in `eu-west-1` (Ireland)\n2. VGW in `us-east-1` (Virginia)\n3. VGW in `ap-southeast-1` (Singapore)\nResult: On-premises London router can reach all 3 regional VPCs.',
  sources: [
    { title: 'Direct Connect Gateways', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways.html' }
  ]
});
