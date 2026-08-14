import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-21',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront with AWS WAF',
  status: 'ready',
  plainEnglish: 'AWS WAF (Web Application Firewall) integrates directly with Amazon CloudFront to inspect HTTP and HTTPS requests at the edge before they reach your origin servers. With AWS WAF attached to a CloudFront distribution, you can create rules to block, allow, or count requests based on IP addresses, HTTP headers, body content, URI paths, SQL injection patterns, cross-site scripting (XSS), rate limits, or bot control rules.',
  whyItMatters: 'Inspecting traffic at CloudFront edge locations stops malicious web attacks before they reach backend application servers or database layers. This prevents web vulnerabilities, reduces backend load, and protects against unauthorized automated scraping or brute force attempts.',
  workplaceExample: 'A ticketing platform experiences massive web scraping and SQL injection attacks during concert ticket launches. By attaching an AWS WAF Web ACL to their CloudFront distribution with Rate-Based Rules (blocking IPs exceeding 100 requests per minute) and Managed SQLi rules, malicious traffic is blocked at global edge nodes, preserving backend ALB capacity.',
  examFocus: 'For SAA-C03, AWS WAF can be attached to CloudFront, Application Load Balancers, API Gateways, and AppSync. When attaching AWS WAF to CloudFront, the Web ACL must be created in the us-east-1 (Global) scope. Remember WAF protects Layer 7 (Application layer) threats.',
  keyPoints: [
    'AWS WAF inspects Layer 7 (HTTP/HTTPS) traffic at CloudFront edge locations.',
    'Web ACLs attached to CloudFront must be created in the us-east-1 (Global) region.',
    'Provides protection against SQL injection, XSS, HTTP floods, and malicious bots.',
    'Supports Rate-Based rules to prevent brute-force attacks and web scraping.',
    'Blocks attacks before traffic reaches origin servers (S3, ALB, EC2).'
  ],
  commonMistake: 'Creating an AWS WAF Web ACL in a regional scope (like eu-west-1) and expecting it to appear in the CloudFront distribution dropdown menu. CloudFront Web ACLs must be created in us-east-1.',
  example: 'CloudFront + AWS WAF Rule Setup:\nWeb ACL: `GlobalEdgeSecurity` (Scope: CLOUDFRONT / us-east-1)\nRules:\n1. AWSManagedRulesCommonRuleSet (Blocks OWASP Top 10 vulnerabilities)\n2. RateBasedRule (Limit: 500 requests per 5 minutes per IP address)\nAction: Block matching requests with HTTP 403 Forbidden at the edge.',
  sources: [
    { title: 'Using AWS WAF with CloudFront distributions', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-awswaf.html' }
  ]
});
