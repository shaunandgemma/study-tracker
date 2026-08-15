import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-17',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield vs AWS WAF',
  status: 'ready',
  plainEnglish: 'AWS Shield and AWS WAF are complementary security services operating at different layers:\n- AWS Shield: Managed DDoS protection service defending infrastructure against high-volume network (L3), transport (L4), and application (L7) traffic floods.\n- AWS WAF (Web Application Firewall): Layer 7 web request inspection service filtering HTTP/HTTPS requests based on custom security rules (blocking SQL injection, cross-site scripting, specific IP ranges, rate limits, or geographic locations).',
  whyItMatters: 'Using WAF alone without Shield leaves infrastructure vulnerable to volumetric network-layer floods. Using Shield without WAF leaves applications vulnerable to SQL injection or web application exploits. Combining both creates defense-in-depth security.',
  workplaceExample: 'An e-commerce site uses AWS Shield to absorb a 200 Gbps SYN flood targeting their CloudFront edge, while AWS WAF filters incoming HTTP POST requests to block SQL injection attacks on their backend login page.',
  examFocus: 'SAA-C03 Architectural Comparison (Shield vs WAF):\n- Primary Function: Shield = DDoS Traffic Scrubbing (L3/L4/L7 floods). WAF = Web Request Inspection & Filtering (L7 web exploits).\n- OSI Layer: Shield operates at Layers 3, 4, and 7. WAF operates exclusively at Layer 7 (HTTP/HTTPS).\n- Integration: Shield Advanced automatically provisions and manages AWS WAF rules for Layer 7 automatic DDoS mitigation.',
  keyPoints: [
    'AWS Shield protects against distributed denial of service (DDoS) traffic floods.',
    'AWS WAF inspects HTTP/HTTPS requests to block web application exploits (SQLi, XSS).',
    'Shield operates at Layers 3, 4, and 7; WAF operates exclusively at Layer 7.',
    'WAF uses customizable Web ACLs, rate-based rules, and Managed Rule Groups.',
    'Shield Advanced integrates with WAF to auto-generate L7 mitigation rules.'
  ],
  commonMistake: 'Attempting to use AWS Shield to block SQL injection or cross-site scripting (XSS) attacks. Use AWS WAF for web application payload inspection.',
  example: 'Selection Guide Summary:\n- "Scrub 100 Gbps UDP reflection flood" -> AWS Shield\n- "Block SQL injection attempts in HTTP POST body" -> AWS WAF',
  sources: [
    { title: 'AWS Shield and AWS WAF comparison', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html' }
  ]
});
