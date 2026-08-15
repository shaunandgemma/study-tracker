import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-3',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'AWS Shield Standard',
  status: 'ready',
  plainEnglish: 'AWS Shield Standard is a managed DDoS protection service automatically enabled at no additional cost for all AWS customers across all AWS services. It provides inline, real-time protection against common network-layer (Layer 3) and transport-layer (Layer 4) Distributed Denial of Service (DDoS) attacks—such as SYN floods, UDP reflection attacks, and ICMP floods—safeguarding infrastructure like CloudFront, Route 53, and Elastic Load Balancing.',
  whyItMatters: 'Volumetric network-layer DDoS attacks can saturate bandwidth and crash internet-facing endpoints in seconds. AWS Shield Standard inspects incoming traffic at AWS edge locations globally, scrubbing malicious traffic automatically without any customer setup.',
  workplaceExample: 'An online retailer hosts their web application on AWS. During a sudden 50 Gbps UDP reflection DDoS attack directed at their public endpoints, AWS Shield Standard automatically detects and scrubs the malicious packets at the AWS edge without affecting legitimate customer checkouts.',
  examFocus: 'SAA-C03 Shield Standard Capabilities & Scope:\n- Zero Additional Cost: Automatically enabled for all AWS customers for supported protections without any subscription fees.\n- OSI Layers Protected: Protects against Layer 3 (Network) and Layer 4 (Transport) infrastructure attacks.\n- Automatic Mitigation: Built-in inline packet scrubbing; requires no configuration or support tickets.\n- Difference from Shield Advanced: Does NOT include 24/7 SRT support, Layer 7 automatic mitigation, or DDoS cost protection.',
  keyPoints: [
    'Managed DDoS protection automatically enabled for all AWS customers at no additional cost.',
    'Protects against common Layer 3 (Network) and Layer 4 (Transport) infrastructure attacks.',
    'Provides inline real-time detection and automatic packet scrubbing at AWS edge locations.',
    'Safeguards Amazon CloudFront, Amazon Route 53, and Elastic Load Balancing (ELB).',
    'Requires zero configuration, setup, or manual security rule management.'
  ],
  commonMistake: 'Assuming AWS Shield Standard protects against complex application-layer (Layer 7) HTTP flood attacks. Layer 7 attacks require AWS WAF or AWS Shield Advanced.',
  example: 'Verifying Shield Standard Protection Status:\nShield Standard is active by default across all AWS accounts. No CLI creation commands are required.',
  sources: [
    { title: 'AWS Shield Standard overview', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html' }
  ]
});
