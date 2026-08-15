import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-7',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield Standard Automatic Protection',
  status: 'ready',
  plainEnglish: 'Shield Standard Automatic Protection is the built-in, always-on threat detection and mitigation system that safeguards all AWS accounts automatically. It uses network traffic inspection techniques, baseline anomaly detection, and automated packet filtering at the AWS border edge network to absorb and mitigate common infrastructure attacks without customer intervention.',
  whyItMatters: 'Every application connected to the internet receives background malicious network scanning and volumetric probes. Always-on automatic protection ensures every AWS customer is protected baseline against infrastructure outages.',
  workplaceExample: 'A developer deploys an Application Load Balancer in a new AWS account. Without configuring any security services, Shield Standard Automatic Protection actively monitors and defends the ALB against network SYN floods.',
  examFocus: 'SAA-C03 Automatic Protection Behavior:\n- Always-On System: Runs continuously in the background across all AWS regions and edge locations.\n- Zero Latency Impact: Inspects traffic inline without introducing noticeable latency for legitimate user requests.\n- Supported Services: Amazon Route 53, Amazon CloudFront, Elastic Load Balancing, Amazon EC2 Elastic IPs.',
  keyPoints: [
    'Always-on automatic protection running continuously across all AWS regions.',
    'Inspects traffic inline at border networks without adding latency to valid requests.',
    'Mitigates infrastructure attack vectors automatically without requiring customer setup.',
    'Provides baseline protection for Route 53, CloudFront, ELB, and Elastic IPs.',
    'Protects all AWS customers by default at no extra charge.'
  ],
  commonMistake: 'Failing to realize Shield Standard is active by default and attempting to find a toggle switch in the console to "turn on" Shield Standard.',
  example: 'Standard Protection Architecture Verification:\nAll AWS internet-facing resources automatically inherit Shield Standard inline packet filtering.',
  sources: [
    { title: 'How AWS Shield Standard works', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html' }
  ]
});
