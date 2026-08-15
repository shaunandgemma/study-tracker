import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-21',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'WAF vs AWS Shield',
  status: 'ready',
  plainEnglish: 'AWS WAF and AWS Shield are two complementary AWS security services designed for different layers of protection and threat models. AWS WAF is a Layer 7 (Application Layer) web application firewall that inspects HTTP and HTTPS request content (headers, query parameters, bodies, SQLi, XSS, and bot signatures). AWS Shield is a dedicated Distributed Denial of Service (DDoS) protection service that defends against infrastructure and network layer volumetric attacks (Layer 3 network floods like SYN floods, UDP reflection attacks, and Layer 4 transport floods). AWS Shield Standard is automatically enabled for all AWS customers at no charge, while AWS Shield Advanced provides enterprise-grade 24/7 DDoS response team (SRT) access, automatic application-layer DDoS mitigation with WAF rule synthesis, and cost protection against scaling spikes during attacks.',
  whyItMatters: 'Confusing application exploit protection with volumetric DDoS mitigation leads to architectural gaps. A pure Layer 3/4 SYN flood or UDP reflection attack will overwhelm network interfaces before Layer 7 WAF inspection occurs. Conversely, an attacker sending a single sophisticated SQL injection request over a legitimate TCP connection bypasses DDoS mitigation completely. Using AWS WAF and AWS Shield together provides comprehensive, full-stack defense across Layers 3, 4, and 7.',
  workplaceExample: 'A gaming company launches a high-profile online game. They rely on AWS Shield Standard at the infrastructure layer to absorb Layer 3/4 UDP reflection floods at AWS edge locations automatically. For their game account management web portal, they attach AWS WAF to their CloudFront distribution and upgrade to AWS Shield Advanced on their CloudFront and Route 53 resources. When an attacker launches both a 500 Gbps network flood and a Layer 7 HTTP login brute-force attack, Shield absorbs the 500 Gbps network flood while WAF rate-limiting and bot control block the login brute-force attacks.',
  examFocus: 'SAA-C03 core points: (1) OSI Layer: AWS Shield = Layer 3/4 DDoS protection (and Layer 7 when using Shield Advanced with WAF); AWS WAF = Layer 7 HTTP/HTTPS application inspection. (2) Shield Standard: Free, automatic, protects all AWS resources against common Layer 3/4 attacks (SYN floods, UDP reflection). (3) Shield Advanced: Paid subscription ($3,000/month base + data transfer), covers CloudFront, Route 53, ALB, Global Accelerator, EC2 Elastic IPs; includes 24/7 Shield Response Team (SRT) access, automated Layer 7 DDoS mitigation with automatic WAF rule creation, and financial DDoS cost protection (reimburses scaling costs from attacks). (4) Best Practice: Deploy CloudFront + WAF + Shield for complete defense-in-depth.',
  keyPoints: [
    'AWS WAF: Layer 7 application firewall inspecting HTTP/HTTPS payloads for SQLi, XSS, bots, and URI exploits.',
    'AWS Shield: Dedicated DDoS protection defending against Layer 3 (Network) and Layer 4 (Transport) attacks.',
    'AWS Shield Standard: Free, globally active by default for all AWS customers with zero configuration required.',
    'AWS Shield Advanced: Paid enterprise subscription ($3,000/month) covering CloudFront, Route 53, ALB, and EC2 EIPs.',
    'Shield Advanced includes 24/7 Shield Response Team (SRT) support and DDoS cost protection guarantees.',
    'Shield Advanced can automatically create and tune AWS WAF rules to mitigate Layer 7 application DDoS attacks.'
  ],
  commonMistake: 'Assuming that enabling AWS WAF protects against massive Layer 3/4 network volumetric floods like UDP reflection attacks. WAF only inspects Layer 7 HTTP/HTTPS traffic; Layer 3/4 volumetric floods are handled by AWS Shield and CloudFront network infrastructure.',
  example: 'Architecture design: Front an Application Load Balancer with Amazon CloudFront, attach an AWS WAF Web ACL to CloudFront for Layer 7 inspection, and enable AWS Shield Advanced on the CloudFront distribution for 24/7 DDoS response team escalation and financial cost protection.',
  sources: [
    {
      title: 'Comparing AWS WAF and AWS Shield',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html'
    },
    {
      title: 'AWS Shield Features and Capabilities',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html'
    }
  ]
});
