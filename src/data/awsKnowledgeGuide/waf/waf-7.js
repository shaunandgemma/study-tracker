import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-7',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'AWS Managed Rules',
  status: 'ready',
  plainEnglish: 'AWS Managed Rules (AMR) are pre-configured, curated sets of WAF rules created, maintained, and automatically updated by AWS Threat Research teams. Instead of manually writing and tuning hundreds of custom regex patterns and IP blocklists, you add ready-made rule groups to your Web ACL. Common groups include the Core Rule Set (CRS) for OWASP Top 10 vulnerabilities, Amazon IP Reputation list for known malicious bots and scanners, Anonymous IP list (VPNs, Tor, proxies), and database-specific rule sets (SQL database protection, Linux OS exploits, POSIX vulnerabilities).',
  whyItMatters: 'Cyber threats and exploit payloads evolve daily. Writing custom signatures for zero-day vulnerabilities requires specialized security expertise and continuous maintenance. AWS Managed Rules automatically push updated signatures and threat intelligence into your Web ACLs with zero operational overhead, ensuring your perimeter defenses stay ahead of emerging attack vectors.',
  workplaceExample: 'An engineering team deploys a new serverless API on Amazon API Gateway. Rather than drafting dozens of regex statements, the team adds two AWS Managed Rule groups to their Web ACL: `AWSManagedRulesCommonRuleSet` (protecting against OWASP Top 10 threats) and `AWSManagedRulesAmazonIpReputationList` (blocking requests from bulletproof hosting providers and infected bots). The API achieves enterprise-grade baseline protection in minutes.',
  examFocus: 'SAA-C03 core points: (1) Core Rule Set (`AWSManagedRulesCommonRuleSet`): Baseline protection against common web vulnerabilities (OWASP Top 10, path traversal, command injection). (2) IP Reputation (`AWSManagedRulesAmazonIpReputationList` / `AWSManagedRulesAnonymousIpList`): Blocks traffic from bots, scanners, Tor exit nodes, and anonymous VPNs. (3) Action Overrides: You can override the default action of an entire rule group or individual rules inside it to `Count` (to test and avoid false positives before enforcing `Block`). (4) Scope-Down: You can apply a scope-down statement to an AWS Managed Rule group so it only evaluates specific sub-paths.',
  keyPoints: [
    'Pre-built, curated rule groups maintained and automatically updated by AWS Threat Intelligence.',
    'Includes Core Rule Set (CRS), Amazon IP Reputation List, and Anonymous IP List.',
    'Provides specialized rule groups: SQL database protection, Linux/Windows OS exploits, and Bot Control.',
    'Individual rules within a managed group can be overridden to Count mode for non-disruptive testing.',
    'Supports Scope-Down statements to limit managed rule evaluation to specific URIs or methods.',
    'Saves hundreds of hours of manual rule authoring and ongoing threat signature maintenance.'
  ],
  commonMistake: 'Enabling an AWS Managed Rule group in BLOCK mode directly in production without first running it with an action override set to COUNT. Certain legitimate application payloads (like XML or JSON containing specific characters) may trigger false positives in the Common Rule Set; running in Count mode lets you identify and tune exclusions safely.',
  example: 'Add the AWS Core Rule Set (CRS) to a Web ACL with an override setting rule actions to Count mode for testing: {"Name": "AWS-AWSManagedRulesCommonRuleSet", "Priority": 0, "Statement": {"ManagedRuleGroupStatement": {"VendorName": "AWS", "Name": "AWSManagedRulesCommonRuleSet"}}, "OverrideAction": {"Count": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "AWSCommonRules"}}.',
  sources: [
    {
      title: 'AWS Managed Rules for AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html'
    },
    {
      title: 'Overriding the Actions of a Rule Group in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-rule-group-override-options.html'
    }
  ]
});
