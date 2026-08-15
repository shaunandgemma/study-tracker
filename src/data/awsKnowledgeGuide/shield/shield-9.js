import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-9',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield Advanced with CloudFront',
  status: 'ready',
  plainEnglish: 'Combining AWS Shield Advanced with Amazon CloudFront establishes AWS\'s recommended architectural pattern for global web application resilience. CloudFront distributes traffic across 600+ global edge locations, absorbing volumetric DDoS attacks before they reach backend origin servers, while Shield Advanced provides enhanced Layer 3/4/7 threat detection, WAF rule auto-mitigation, and SRT support.',
  whyItMatters: 'Exposing backend EC2 instances or Application Load Balancers directly to public internet IPs leaves origin servers vulnerable to direct IP attacks. Placing CloudFront in front cloaks origin IPs and absorbs DDoS floods globally.',
  workplaceExample: 'A media streaming website uses CloudFront in front of their Application Load Balancer. When a 600 Gbps volumetric attack strikes, CloudFront\'s global edge network absorbs the attack payload while Shield Advanced automatically applies L7 WAF rate rules.',
  examFocus: 'SAA-C03 Recommended Architecture (CloudFront + Shield):\n- Edge Absorption: CloudFront edge locations inspect and absorb massive volumetric floods globally.\n- Origin Protection (Cloaking): Restrict ALB security groups to allow access ONLY from CloudFront IP prefixes (or CloudFront Origin Access Control).\n- Cost Optimization: CloudFront data transfer out rates with Shield Advanced optimize global protection costs.',
  keyPoints: [
    'AWS recommended edge architecture pattern for global web application resilience.',
    'CloudFront absorbs volumetric DDoS floods globally across 600+ edge locations.',
    'Hides backend application origin server IP addresses from direct internet attacks.',
    'Enables automatic Layer 7 DDoS mitigation via AWS WAF at edge locations.',
    'Protects origin servers by restricting ALB inbound traffic to CloudFront IP ranges.'
  ],
  commonMistake: 'Deploying CloudFront with Shield Advanced but leaving public security groups open to `0.0.0.0/0` on the origin ALB, allowing attackers to bypass CloudFront and attack the ALB directly.',
  example: 'Protecting a CloudFront Distribution with Shield Advanced via AWS CLI:\naws shield create-protection --name "CloudFrontEdgeProtection" --resource-arn "arn:aws:cloudfront::123456789012:distribution/E1234567890ABC"',
  sources: [
    { title: 'Protecting CloudFront distributions with AWS Shield Advanced', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html#ddos-advanced-cloudfront' }
  ]
});
