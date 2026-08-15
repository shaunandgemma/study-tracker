import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-4',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'AWS WAF Web Application Firewall',
  status: 'ready',
  plainEnglish: 'AWS WAF is a managed Layer 7 (Application Layer) security service designed to protect web applications and APIs from common web exploits and bots. While traditional firewalls look only at IP addresses and port numbers, AWS WAF inspects the full contents of HTTP and HTTPS requests—including headers, query parameters, cookies, URI paths, HTTP methods, and request bodies. When a request matches a rule in your Web ACL, WAF takes an action such as allowing, blocking with an HTTP 403 response, counting for analysis, or challenging the browser with a CAPTCHA or silent browser verification.',
  whyItMatters: 'Web applications are vulnerable to attacks like SQL injection, cross-site scripting (XSS), bad bots scraping sensitive pricing data, and HTTP flood attacks that exhaust web server memory and database connections. AWS WAF blocks these malicious payloads at the perimeter before they consume backend resources, compromise sensitive customer databases, or cause application downtime.',
  workplaceExample: 'A healthcare portal allows patients to book appointments and view test results. The security team deploys AWS WAF in front of their Application Load Balancer. WAF immediately blocks automated credential-stuffing bots targeting `/login`, stops SQL injection attempts inside patient ID search fields, and rate-limits rapid-fire requests from suspicious IP addresses, all without requiring modifications to the underlying Node.js application.',
  examFocus: 'Key SAA-C03 architecture concepts: (1) OSI Layer: Operates strictly at Layer 7 (HTTP/HTTPS). It cannot filter non-HTTP protocols like raw TCP/UDP, SSH, or FTP. (2) Web ACL: The primary container holding ordered rules and a default action (Allow or Block). (3) Capacity: Measured in Web ACL Capacity Units (WCU), with a default limit per Web ACL (typically 1,500 WCU, expandable). (4) Comparison: Security Groups and Network ACLs filter Layer 3/4 (IP/port); AWS Network Firewall inspects full Layer 3–7 network packet streams; AWS Shield mitigates DDoS attacks; AWS WAF inspects HTTP/HTTPS application payloads.',
  keyPoints: [
    'Provides Layer 7 (Application Layer) web traffic inspection and filtering.',
    'Inspects full HTTP/HTTPS components: headers, body, URI, query string, cookies, and HTTP method.',
    'Protects against OWASP Top 10 vulnerabilities like SQL injection (SQLi) and cross-site scripting (XSS).',
    'Supports actions: Allow, Block (with custom HTTP response codes), Count, CAPTCHA, and Challenge.',
    'Uses Web ACL Capacity Units (WCUs) to allocate inspection complexity and compute capacity.',
    'Differs from Security Groups / Network ACLs (Layer 3/4 IP and port filtering).'
  ],
  commonMistake: 'Confusing AWS WAF with Security Groups. A Security Group only inspects IP addresses, port numbers, and protocol types (Layer 3/4). A Security Group cannot inspect HTTP request bodies, headers, or detect SQL injection; AWS WAF is required for Layer 7 inspection.',
  example: 'Create a basic Web ACL with a default action of ALLOW to start inspecting traffic in Count mode: aws wafv2 create-web-acl --name Production-Web-Firewall --scope REGIONAL --default-action Allow={} --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=ProductionWebFirewall --rules [] --region us-east-1.',
  sources: [
    {
      title: 'What is AWS WAF?',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html'
    },
    {
      title: 'How AWS WAF Works',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works.html'
    }
  ]
});
