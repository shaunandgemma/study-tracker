import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-18',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Direct Connect with Site-to-Site VPN for Encryption',
  status: 'ready',
  plainEnglish: 'Direct Connect with Site-to-Site VPN is an architectural pattern that combines the dedicated physical performance of AWS Direct Connect with the IPsec cryptographic encryption of an AWS Site-to-Site VPN. By running an IPsec VPN tunnel OVER a Public Virtual Interface (Public VIF) or Transit VIF on a Direct Connect connection, all network traffic is encrypted in transit using AES-256 encryption before it leaves your data center, while still traveling over a private dedicated physical path.',
  whyItMatters: 'By default, AWS Direct Connect does NOT encrypt data in transit. For highly regulated industries (such as healthcare, finance, or government) that mandate end-to-end encryption for all off-site data, running an IPsec VPN over Direct Connect meets strict compliance standards while retaining predictable physical bandwidth.',
  workplaceExample: 'A defense contractor handling classified project data is required by compliance to encrypt all network traffic leaving their facility. They provision an AWS Direct Connect link with a Public VIF, then build an AWS Site-to-Site IPsec VPN tunnel over that Public VIF to their VPC. All data is encrypted with AES-256 over a private physical connection.',
  examFocus: 'Crucial SAA-C03 exam scenario: "An architect requires high-speed private connectivity to AWS AND mandatory IPsec encryption in transit for security compliance." Answer: AWS Direct Connect combined with AWS Site-to-Site VPN (or MACsec on 10/100 Gbps dedicated ports).',
  keyPoints: [
    'Provides IPsec AES-256 encryption in transit over a dedicated Direct Connect physical link.',
    'Built by establishing an IPsec VPN tunnel over a Public VIF or Transit VIF.',
    'Meets regulatory compliance mandates requiring data-in-transit encryption.',
    'Combines predictable Direct Connect physical routing with strong cryptographic security.',
    'Alternative for 10G/100G dedicated links: MACsec (Layer 2 hardware encryption).'
  ],
  commonMistake: 'Assuming standard Direct Connect encrypts traffic automatically. Direct Connect is private, but unencrypted. You MUST add IPsec VPN or MACsec for encryption.',
  example: 'VPN over Direct Connect Architecture:\nOn-Premises IPsec Router -> IPsec Tunnel -> Direct Connect Public VIF -> AWS VPN Endpoint -> Virtual Private Gateway -> Private Subnet.',
  sources: [
    { title: 'AWS Site-to-Site VPN over AWS Direct Connect', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/vpn-over-direct-connect.html' }
  ]
});
