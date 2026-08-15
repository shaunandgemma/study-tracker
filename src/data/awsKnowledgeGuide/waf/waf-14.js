import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-14',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'WAF Rule Priority',
  status: 'ready',
  plainEnglish: 'WAF Rule Priority is a non-negative integer assigned to each rule inside a Web ACL that determines the exact order in which AWS WAF evaluates incoming web requests. AWS WAF evaluates rules sequentially starting from the lowest numerical priority (e.g., Priority 0, then Priority 1, Priority 2, and so on). When a request matches a rule that has a terminating action (such as Allow, Block, CAPTCHA, or Challenge), AWS WAF executes that action immediately and terminates rule evaluation for that request—no subsequent rules in the Web ACL are evaluated.',
  whyItMatters: 'Rule order is critical to correct firewall behavior. If a broad Allow rule is placed at Priority 0, it will allow malicious traffic before downstream SQL injection or rate-limiting rules at Priority 5 ever get a chance to inspect the request. Conversely, placing an explicit IP allowlist before generic managed block rules ensures trusted internal test traffic or corporate VPNs are not accidentally blocked.',
  workplaceExample: 'An enterprise security team designs an ordered Web ACL: Priority 0 is an IP Allowlist for internal penetration testing scanners (terminating `Allow`); Priority 1 is an IP Blocklist for active cybercrime networks (terminating `Block`); Priority 2 is an AWS Core Rule Set (terminating `Block` for SQLi/XSS); and Priority 3 is a Rate-Based rule. Because the internal scanner IP matches Priority 0, it is allowed immediately, preventing the scanner from being blocked by Priority 2.',
  examFocus: 'SAA-C03 core points: (1) Order of Evaluation: Rules execute in ascending numerical order (lowest integer first, e.g., 0 before 10). (2) Terminating vs Non-Terminating Actions: `Allow`, `Block`, `CAPTCHA`, and `Challenge` are terminating actions (evaluation stops immediately upon a match); `Count` is non-terminating (increments a metric, logs the match, and evaluation continues to the next rule). (3) Default Action: If a request traverses all rules without matching any terminating action, WAF executes the Web ACL\'s Default Action (Allow or Block).',
  keyPoints: [
    'Rules are evaluated sequentially in ascending numerical priority order (0, 1, 2, ...).',
    'Terminating actions (`Allow`, `Block`, `CAPTCHA`, `Challenge`) immediately stop evaluation upon match.',
    'Non-terminating actions (`Count`) increment metrics and allow evaluation to continue to lower-priority rules.',
    'Explicit allowlist rules should typically be assigned higher priority (lower numbers) than general block rules.',
    'If no terminating rule matches, the request falls through to the Web ACL Default Action.',
    'Rule priorities can be reordered at any time via the AWS Console, CLI, or CloudFormation/Terraform.'
  ],
  commonMistake: 'Placing a generic Rate-Based rule or Managed Rule group at Priority 0 above an IP allowlist rule at Priority 10. When trusted corporate testing tools run high-volume automated tests, they match the Priority 0 rate-limit rule first and get blocked before ever reaching the Priority 10 allowlist.',
  example: 'Prioritize an IP allowlist at Priority 0 ahead of an AWS Managed Rule group at Priority 1: {"Rules": [{"Name": "AllowCorporateVPN", "Priority": 0, "Statement": {"IPSetReferenceStatement": {"ARN": "arn:aws:wafv2:us-east-1:123456789012:regional/ipset/VPN/id"}}, "Action": {"Allow": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "AllowVPN"}}, {"Name": "AWSCommonRules", "Priority": 1, "Statement": {"ManagedRuleGroupStatement": {"VendorName": "AWS", "Name": "AWSManagedRulesCommonRuleSet"}}, "OverrideAction": {"None": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "CommonRules"}}]}',
  sources: [
    {
      title: 'How AWS WAF Evaluates Rules in a Web ACL',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-processing-order.html'
    },
    {
      title: 'Managing Rule Priority in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-rules-order.html'
    }
  ]
});
