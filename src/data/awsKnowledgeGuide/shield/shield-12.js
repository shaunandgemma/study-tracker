import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-12',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield Advanced with Global Accelerator',
  status: 'ready',
  plainEnglish: 'Shield Advanced with AWS Global Accelerator protects non-HTTP / non-web application protocols (such as custom TCP/UDP game servers, VoIP, financial trading feeds, and IoT gateways) at the AWS global edge. Global Accelerator provides static IP addresses backed by AWS Anycast edge locations, absorbing volumetric SYN and UDP floods globally before traffic enters your AWS region.',
  whyItMatters: 'Web Application Firewalls (WAF) and CloudFront only inspect HTTP/HTTPS traffic. Custom TCP/UDP protocols (like gaming or VoIP) cannot use WAF. Protecting Global Accelerator with Shield Advanced extends DDoS protection to non-HTTP workloads.',
  workplaceExample: 'A multiplayer gaming studio runs custom UDP game servers in `us-west-2`. They route player traffic through AWS Global Accelerator protected by Shield Advanced. UDP reflection attacks are scrubbed at global edge locations near players.',
  examFocus: 'SAA-C03 Non-HTTP DDoS Architecture Pattern:\n- Non-HTTP Workloads: Use AWS Global Accelerator + Shield Advanced for TCP/UDP applications (gaming, IoT, VoIP).\n- Static Anycast IPs: Global Accelerator provides 2 static Anycast IP addresses routed across AWS global edge locations.\n- Edge Scrubbing: Volumetric TCP/UDP floods are scrubbed at border edge locations before entering AWS regional VPCs.',
  keyPoints: [
    'Protects non-HTTP / non-web application protocols (TCP, UDP) from volumetric DDoS attacks.',
    'Ideal for gaming servers, IoT gateways, VoIP, and custom socket protocols.',
    'Uses Global Accelerator Anycast static IPs to absorb floods globally across AWS edge locations.',
    'Provides inline packet scrubbing before traffic reaches regional VPC resources.',
    'Delivers CloudWatch metrics for attack vectors targeting Global Accelerator endpoints.'
  ],
  commonMistake: 'Attempting to use AWS WAF to protect a custom non-HTTP TCP/UDP gaming protocol. Use Global Accelerator with Shield Advanced instead.',
  example: 'Protecting a Global Accelerator with Shield Advanced via AWS CLI:\naws shield create-protection --name "GamingAcceleratorProtection" --resource-arn "arn:aws:globalaccelerator::123456789012:accelerator/a1b2c3d4-5678-90ab-cdef-111122223333"',
  sources: [
    { title: 'Protecting Global Accelerator with AWS Shield Advanced', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html#ddos-advanced-ga' }
  ]
});
