import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-4',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'AWS Shield Advanced',
  status: 'ready',
  plainEnglish: 'AWS Shield Advanced is a paid, premium DDoS protection subscription service designed for enterprise workloads. It provides enhanced detection, specialized Layer 3/4/7 DDoS mitigation, 24/7 access to the dedicated AWS Shield Response Team (SRT), Route 53 health-based proactive engagement, detailed CloudWatch attack analytics, and financial DDoS Cost Protection against scaling charges incurred during attacks.',
  whyItMatters: 'Mission-critical applications cannot tolerate downtime from sophisticated application-layer (Layer 7) HTTP floods or multi-vector attacks. Shield Advanced combines automated mitigation with human expertise from the SRT and financial protection against surge billing.',
  workplaceExample: 'A global stock trading platform subscribes to AWS Shield Advanced for $3,000/month. During a massive multi-vector Layer 7 HTTP flood attack, Shield Advanced automatically creates custom WAF mitigation rules and the SRT actively manages mitigations to preserve sub-second trade execution.',
  examFocus: 'SAA-C03 Shield Advanced Core Features:\n- Paid Subscription: $3,000/month 1-year commitment plus data transfer out fees.\n- Protected Resource Types: Explicitly protect CloudFront, Route 53, Global Accelerator, ALBs, and Elastic IP addresses.\n- Shield Response Team (SRT): 24/7 direct access to AWS DDoS experts who can write custom mitigation rules during an active attack.\n- DDoS Cost Protection: Provides service credits to reimburse EC2/ALB auto-scaling bill surges caused by DDoS attacks.',
  keyPoints: [
    'Paid subscription service providing specialized enterprise-grade DDoS protection.',
    'Provides 24/7 direct access to the specialized AWS Shield Response Team (SRT).',
    'Supports automatic Layer 7 application-layer DDoS mitigation via AWS WAF integration.',
    'Includes DDoS Cost Protection to reimburse scaling charges caused by attack traffic.',
    'Requires explicitly designating specific AWS resources for Shield Advanced protection.'
  ],
  commonMistake: 'Subscribing to AWS Shield Advanced and expecting all resources in all accounts to be protected automatically without explicitly adding protected resources or protection groups.',
  example: 'Adding a Protected Resource to Shield Advanced via AWS CLI:\naws shield create-protection --name "ProdCloudFrontProtection" --resource-arn "arn:aws:cloudfront::123456789012:distribution/E1A2B3C4D5E6F7"',
  sources: [
    { title: 'AWS Shield Advanced overview', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary.html' }
  ]
});
