import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-13',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield Advanced AWS WAF Integration',
  status: 'ready',
  plainEnglish: 'Shield Advanced integrates natively with AWS WAF to provide automatic Layer 7 application-layer DDoS mitigation. When Shield Advanced detects an HTTP/HTTPS flood targeting a protected CloudFront distribution or Application Load Balancer, it analyzes request attributes (URI paths, headers, query parameters) and automatically creates, tests, and deploys custom WAF rate-based or inline blocking rules without manual intervention.',
  whyItMatters: 'Manual creation of WAF rules during a live Layer 7 attack takes time while application servers suffer high latency. Automatic L7 mitigation identifies attack signatures in real time and deploys precise WAF rules in seconds.',
  workplaceExample: 'A news website experiences a sudden HTTP POST flood targeting `/login`. Shield Advanced detects the L7 anomaly, automatically writes a custom WAF rate-limiting rule in `BLOCK` mode, and halts the attack without blocking legitimate readers.',
  examFocus: 'SAA-C03 Automatic L7 Mitigation & Mode Options:\n- Action Modes: `COUNT` mode (monitors proposed rules for false positives without blocking) vs `BLOCK` mode (actively blocks matching attack traffic).\n- Included AWS WAF Developer License: AWS Shield Advanced subscription INCLUDES AWS WAF usage fees for protected resources.\n- Rule Group Management: Shield Advanced creates and manages a dedicated rule group inside your attached AWS WAF Web ACL.',
  keyPoints: [
    'Provides automatic Layer 7 HTTP flood detection and custom WAF rule creation.',
    'Includes AWS WAF Web ACL and rule fees in the Shield Advanced subscription cost.',
    'Supports Action Modes: `COUNT` (log and monitor) or `BLOCK` (active inline blocking).',
    'Analyzes HTTP request patterns automatically to prevent false positives on valid traffic.',
    'Integrates seamlessly with CloudFront and Application Load Balancer Web ACLs.'
  ],
  commonMistake: 'Leaving Automatic Application-Layer Mitigation in `COUNT` mode indefinitely during an active attack, resulting in attack traffic being logged but not blocked.',
  example: 'Updating Automatic L7 Response Action to BLOCK via AWS CLI:\naws shield update-application-layer-automatic-response --resource-arn "arn:aws:cloudfront::123456789012:distribution/E1A2B3C4D5E6F7" --action "BLOCK"',
  sources: [
    { title: 'Automatic application-layer DDoS mitigation with AWS WAF', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary.html' }
  ]
});
