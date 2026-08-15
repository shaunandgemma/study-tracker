import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-5',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'Web ACLs',
  status: 'ready',
  plainEnglish: 'A Web Access Control List (Web ACL) is the primary top-level container in AWS WAF that defines the collection of rules, rule groups, and default actions used to protect your application. When you create a Web ACL, you define a sequence of ordered inspection rules (each with its own priority number and action) and a Default Action (Allow or Block) that takes effect when an incoming HTTP/HTTPS request does not match any of your defined rules.',
  whyItMatters: 'Without a Web ACL, individual rules cannot be applied to AWS resources. The Web ACL acts as the centralized policy engine where security teams prioritize IP blocklists, rate-based protections, managed rule groups, and custom regex filters. It also tracks overall Web ACL Capacity Unit (WCU) consumption to prevent performance degradation.',
  workplaceExample: 'A banking application configures a Web ACL with Default Action: ALLOW. The Web ACL contains four ordered rules: Priority 0 blocks known malicious IP addresses; Priority 1 challenges suspicious bot traffic using CAPTCHA; Priority 2 inspects POST payloads for SQL injection; and Priority 3 rate-limits traffic to 500 requests per 5 minutes per IP. Any legitimate customer traffic that passes all four rules falls through to the Default Action (ALLOW) and reaches the banking API.',
  examFocus: 'SAA-C03 core points: (1) Default Action: Every Web ACL has a default action (Allow or Block). In a blacklist model, set default to Allow and block specific threats. In a whitelist model, set default to Block and allow only trusted IPs or paths. (2) Rule Priority: Rules evaluate in ascending order (0, 1, 2, ...). When a request matches a rule with a terminating action (Allow or Block), evaluation stops immediately. (3) Scopes: Must choose Global (`CLOUDFRONT`) or Regional (`REGIONAL`) when creating the Web ACL; this scope cannot be changed after creation. (4) WCU Budget: Each Web ACL tracks total WCU across all rules.',
  keyPoints: [
    'The top-level container in AWS WAF holding ordered rules, rule groups, and default actions.',
    'Default Action is applied if an incoming request does not match any terminating rule (Allow or Block).',
    'Rules inside a Web ACL are evaluated in strict priority order (lowest number first).',
    'Created in either Global (`CLOUDFRONT`) scope or Regional (`REGIONAL`) scope.',
    'Tracks total Web ACL Capacity Units (WCUs) used by all contained rules.',
    'Emits Amazon CloudWatch metrics and supports sampled requests per Web ACL.'
  ],
  commonMistake: 'Setting the Default Action to BLOCK on a public website without first creating an explicit rule to allow legitimate public traffic. If the default action is Block and no rules match normal traffic, every user will receive an HTTP 403 Forbidden error.',
  example: 'Create a Web ACL with default action Allow and CloudWatch metrics enabled: aws wafv2 create-web-acl --name WebApp-Security-ACL --scope REGIONAL --default-action Allow={} --rules file://rules.json --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=WebAppSecurityACL --region us-east-1.',
  sources: [
    {
      title: 'Web ACLs in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html'
    },
    {
      title: 'How Rules and Rule Groups Work in a Web ACL',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-rules-and-rule-groups.html'
    }
  ]
});
