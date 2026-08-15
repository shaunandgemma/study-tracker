import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-10',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield Advanced with Route 53',
  status: 'ready',
  plainEnglish: 'Shield Advanced with Route 53 protects global DNS infrastructure against DNS query floods and reflection attacks targeting Amazon Route 53 hosted zones. Protecting Route 53 hosted zones with Shield Advanced provides enhanced DNS traffic monitoring, health-based detection via Route 53 Health Checks, and 100% DNS availability SLA protection.',
  whyItMatters: 'If attackers successfully crash your authoritative DNS servers via a DNS query flood, customers cannot resolve your domain name (e.g. `example.com`), completely taking down your web applications and APIs worldwide.',
  workplaceExample: 'A domain registrar protects their primary Route 53 Hosted Zone with Shield Advanced. When a botnet launches a 20 million query-per-second DNS flood, Shield Advanced inspects and filters malicious DNS requests at Route 53 edge locations.',
  examFocus: 'SAA-C03 Route 53 Protection Mechanics:\n- Authoritative Anycast Network: Route 53 uses global Anycast routing to handle massive DNS query volume.\n- Health-Based Detection: Shield Advanced uses Route 53 Health Checks to evaluate application availability and trigger early DDoS mitigations.\n- Resource Protection: Explicitly protect hosted zones using `create-protection` on Route 53 Hosted Zone ARNs.',
  keyPoints: [
    'Protects Amazon Route 53 authoritative DNS hosted zones from DNS query floods.',
    'Uses global Anycast DNS infrastructure to absorb volumetric DNS attacks.',
    'Integrates with Route 53 Health Checks for health-based proactive DDoS detection.',
    'Guarantees high availability for domain name resolution during massive attacks.',
    'Provides detailed DNS query volume telemetry in CloudWatch.'
  ],
  commonMistake: 'Failing to associate a Route 53 Health Check with your Shield Advanced protection, missing out on health-based early DDoS detection.',
  example: 'Protecting a Route 53 Hosted Zone with Shield Advanced via AWS CLI:\naws shield create-protection --name "Route53DNSProtection" --resource-arn "arn:aws:route53:::hostedzone/Z1234567890ABC"',
  sources: [
    { title: 'Protecting Route 53 hosted zones with AWS Shield Advanced', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html#ddos-advanced-route53' }
  ]
});
