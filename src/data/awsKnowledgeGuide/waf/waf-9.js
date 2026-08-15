import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-9',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'IP Set Match Rules',
  status: 'ready',
  plainEnglish: 'An IP Set in AWS WAF is a reusable collection of IPv4 and IPv6 Classless Inter-Domain Routing (CIDR) blocks that you define and reference within WAF rules. An IP Set Match rule inspects either the source IP address of incoming web connections or an IP address extracted from a forwarded HTTP header (such as `X-Forwarded-For`). Depending on your rule action, matching requests can be immediately allowed (whitelisting trusted offices), blocked (blacklisting malicious subnets), or counted for traffic auditing.',
  whyItMatters: 'Managing lists of hundreds or thousands of IP addresses directly inside individual rule statements is cumbersome and error-prone. IP Sets decouple IP address management from Web ACL rules, enabling security automation (such as Lambda scripts updating blacklists from threat intelligence feeds) to update a single IP Set without needing to modify or redeploy the Web ACL itself.',
  workplaceExample: 'A security operations center (SOC) monitors authentication logs and identifies an active distributed brute-force attack originating from 50 specific `/24` subnets. An automated incident-response Lambda function immediately calls the `wafv2:UpdateIPSet` API to add the offending CIDR blocks to an IP Set named `ActiveAttackerBlacklist`. The Web ACL rule referencing this IP Set instantly blocks all incoming HTTP requests from those subnets with zero manual console intervention.',
  examFocus: 'SAA-C03 core points: (1) IP Formats: Supports both IPv4 (e.g., `192.0.2.0/24`, `198.51.100.10/32`) and IPv6 (e.g., `2001:db8::/32`, `2001:db8::1/128`). (2) Source IP vs Forwarded IP: Can inspect the direct TCP connection source IP OR an HTTP header (like `X-Forwarded-For`) when traffic passes through intermediate proxies/CDNs. (3) Forwarded IP Fallback: Configure fallback behavior (MATCH or NO_MATCH) if the header is missing or malformed. (4) Reusability: A single IP Set can be referenced by multiple rules and across multiple Web ACLs within the same scope.',
  keyPoints: [
    'Reusable collection of IPv4 and IPv6 CIDR blocks referenced inside WAF rules.',
    'Can inspect direct TCP connection source IP or forwarded IP headers (e.g., `X-Forwarded-For`).',
    'Supports both allowlisting (trusted partners/corporate offices) and blocklisting (known malicious subnets).',
    'Can be updated dynamically via the AWS SDK/CLI without modifying the parent Web ACL.',
    'Provides configurable fallback behavior for missing or malformed forwarded IP headers.',
    'Enables integration with automated threat intelligence and incident-response pipelines.'
  ],
  commonMistake: 'Using direct Source IP matching when AWS WAF is deployed on an Application Load Balancer behind a third-party Content Delivery Network (CDN) or proxy. If traffic passes through a third-party CDN, the direct source IP is the CDN proxy itself; you must configure the IP Set rule to inspect the forwarded IP (`X-Forwarded-For`) header with proper position handling.',
  example: 'Create an IP set containing trusted office CIDR blocks using the AWS CLI: aws wafv2 create-ip-set --name CorporateTrustedIPs --scope REGIONAL --ip-address-version IPV4 --addresses "198.51.100.0/24" "203.0.113.50/32" --region us-east-1.',
  sources: [
    {
      title: 'IP Sets in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-ip-set-creating.html'
    },
    {
      title: 'IP Set Match Rule Statements in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-ips.html'
    }
  ]
});
