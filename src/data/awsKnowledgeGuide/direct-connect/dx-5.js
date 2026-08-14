import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-5',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Direct Connect Dedicated Private Network Connection',
  status: 'ready',
  plainEnglish: 'AWS Direct Connect is a cloud service solution that establishes a dedicated, private physical network connection from an on-premises data center or corporate office directly to AWS. Instead of sending traffic over the public internet (where bandwidth can fluctuate and security risk exists), Direct Connect uses a dedicated fiber-optic Ethernet cable connected to an AWS Direct Connect location. This bypasses internet service providers, delivering consistent network performance, lower latency, and reduced data egress costs.',
  whyItMatters: 'For enterprise workloads transferring large datasets (such as daily database backups, real-time analytics streams, or hybrid application traffic), the public internet is unpredictable and costly. Direct Connect provides high-throughput, predictable network performance while cutting data transfer out (DTO) charges.',
  workplaceExample: 'A bank migrates its core transactional engine to AWS while keeping mainframe databases on-premises. To ensure secure, sub-millisecond database queries without routing customer data over the public internet, the network team provisions an AWS Direct Connect link between their data center and the nearest AWS Direct Connect location.',
  examFocus: 'SAA-C03 scenarios look for solutions requiring predictable network throughput, low latency, high data transfer volumes, or private connectivity bypassing the public internet. Note that Direct Connect traffic is PRIVATE but NOT encrypted by default; IPsec VPN over Direct Connect or MACsec is required if encryption in transit is demanded.',
  keyPoints: [
    'Establishes a private physical connection between on-premises facilities and AWS.',
    'Bypasses the public internet for consistent bandwidth and reduced latency.',
    'Provides significant savings on AWS Data Transfer Out (DTO) costs.',
    'Traffic is private but NOT encrypted by default (requires IPsec VPN or MACsec for encryption).',
    'Supports Dedicated Connections (1 Gbps, 10 Gbps, 100 Gbps) and Hosted Connections (50 Mbps to 10 Gbps).'
  ],
  commonMistake: 'Assuming Direct Connect traffic is automatically encrypted. Direct Connect provides a private physical link, but data is transmitted as unencrypted Ethernet frames unless you layer IPsec VPN or MACsec encryption on top.',
  example: 'Physical Architecture:\nOn-Premises Data Center Router -> Fiber Cable -> AWS Direct Connect Location (Meet-Me Room) -> AWS Global Backbone -> Customer VPC.',
  sources: [
    { title: 'What is AWS Direct Connect?', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html' }
  ]
});
