import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-6',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Layer 3 and Layer 4 DDoS Protection',
  status: 'ready',
  plainEnglish: 'Layer 3 (Network Layer) and Layer 4 (Transport Layer) DDoS protection defends AWS infrastructure against protocol-level traffic floods targeting IP networking and TCP/UDP transport connections. Examples include TCP SYN floods (exhausting connection state tables), UDP reflection vector floods (DNS/NTP amplification), and ICMP packet floods.',
  whyItMatters: 'L3/L4 attacks can overwhelm network interfaces and firewalls before traffic even reaches your web application code. Automatic L3/L4 protection at the AWS edge layer ensures network infrastructure remains stable.',
  workplaceExample: 'An attacker launches a 400 Gbps NTP reflection attack targeting a corporate Elastic IP address. AWS Shield Standard detects the L3/L4 reflection vector at the AWS border network and drops the malicious UDP traffic inline.',
  examFocus: 'SAA-C03 L3/L4 Mitigation Mechanics:\n- Layer 3 Protocols: IPv4, IPv6, ICMP, IGMP.\n- Layer 4 Protocols: TCP, UDP.\n- Common Vectors: TCP SYN Floods, UDP Reflection/Amplification, ICMP Echo Floods.\n- Automated Scrubbing: AWS Shield Standard provides continuous, inline L3/L4 packet scrubbing across all AWS global points of presence (PoPs).',
  keyPoints: [
    'Defends against network (L3) and transport (L4) protocol attacks.',
    'Mitigates TCP SYN floods, UDP reflection amplification, and ICMP floods.',
    'Operates inline at AWS global edge locations and border routers.',
    'Included automatically for all AWS customers via AWS Shield Standard at no extra cost.',
    'Scrubs malicious network packets before they reach customer application instances.'
  ],
  commonMistake: 'Writing complex application code to block TCP SYN floods. L3/L4 protocol attacks must be scrubbed at the network edge via AWS Shield.',
  example: 'Querying Shield Attack Statistics for L3/L4 Vectors via AWS CLI:\naws shield describe-attack --attack-id "a1b2c3d4-5678-90ab-cdef-111122223333"',
  sources: [
    { title: 'Types of DDoS attacks - Layer 3 and Layer 4', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html#ddos-overview-types' }
  ]
});
