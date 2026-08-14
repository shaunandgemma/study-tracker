import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-22',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront with AWS Shield',
  status: 'ready',
  plainEnglish: 'AWS Shield is a managed Distributed Denial of Service (DDoS) protection service that safeguards applications running on AWS. AWS Shield has two tiers: Shield Standard (automatically enabled for all CloudFront distributions at no extra cost) and Shield Advanced (a paid subscription offering enhanced protection, 24/7 access to the AWS DDoS Response Team, financial cost protection against scaling spikes, and automated Layer 7 mitigation).',
  whyItMatters: 'DDoS attacks attempt to overwhelm web applications with vast amounts of illegitimate traffic. CloudFront combined with AWS Shield Standard provides baseline protection against Layer 3 (Network) and Layer 4 (Transport) attacks like SYN floods or UDP reflection attacks across AWS global edge infrastructure.',
  workplaceExample: 'A gaming launch site comes under a massive 500 Gbps SYN flood attack aimed at taking down the website. Because the site is fronted by CloudFront, AWS Shield Standard automatically detects and absorbs the Layer 3/4 volumetric traffic at edge locations worldwide, allowing legitimate gamers to load the site without interruption.',
  examFocus: 'SAA-C03 distinction:\n- Shield Standard: Free, automatic, protects against Layer 3/4 DDoS attacks at CloudFront / Route 53 / ALB edges.\n- Shield Advanced: Paid subscription ($3,000/mo), includes DRT (DDoS Response Team) support, granular real-time metrics, complex Layer 7 DDoS auto-mitigation, and cost protection against auto-scaling bill spikes caused by DDoS attacks.',
  keyPoints: [
    'AWS Shield Standard is included automatically with CloudFront at no additional cost.',
    'Protects against Layer 3 and Layer 4 volumetric DDoS attacks (SYN floods, UDP reflection).',
    'AWS Shield Advanced offers 24/7 DDoS Response Team (DRT) access and bill protection.',
    'CloudFront edge infrastructure absorbs massive volumetric attacks globally.',
    'Combine with AWS WAF for full Layer 3, 4, and 7 defense-in-depth.'
  ],
  commonMistake: 'Believing AWS Shield Standard requires manual activation or configuration. Shield Standard is enabled by default for all AWS customers on all CloudFront distributions.',
  example: 'DDoS Defense Architecture:\nIncoming Attack (UDP Flood 200 Gbps) -> CloudFront Edge Locations -> AWS Shield Standard automatically absorbs traffic -> Clean HTTP requests reach Origin server.',
  sources: [
    { title: 'DDoS protection with AWS Shield', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ddos-protection.html' }
  ]
});
