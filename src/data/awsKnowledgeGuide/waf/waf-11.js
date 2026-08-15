import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-11',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'String and Regex Matching',
  status: 'ready',
  plainEnglish: 'String and Regular Expression (Regex) matching in AWS WAF allows you to inspect text inside specific components of an HTTP/HTTPS request for exact character strings, prefix/suffix patterns, or complex regex pattern sets. A Byte Match statement looks for literal strings (e.g., matching a URI that starts with `/wp-admin` or a header containing `BadBot/1.0`), while a Regex Pattern Set match evaluates regular expressions (e.g., matching patterns like credit card numbers or directory traversal sequences like `(\.\./){3,}`).',
  whyItMatters: 'Many web attack vectors and security policy requirements involve specific text patterns in request URIs, headers, query arguments, or JSON/XML bodies. String and regex matching allows you to block exploit probes (like attempts to access `.env` or `wp-config.php`), prevent data leakage, and validate that incoming requests strictly comply with your API format specifications.',
  workplaceExample: 'A software company migrates from a legacy CMS to a custom React web app. Security logs show continuous automated scanners probing for legacy vulnerability paths like `/phpmyadmin`, `/xmlrpc.php`, and `/.git/config`. The security team creates a Regex Pattern Set containing these legacy probe patterns and attaches a WAF rule that blocks any matching request immediately at CloudFront, preventing unnecessary traffic from reaching origin servers.',
  examFocus: 'SAA-C03 core points: (1) Byte Match Statement: Fast, low-WCU string comparison supporting positional constraints (`EXACTLY`, `STARTS_WITH`, `ENDS_WITH`, `CONTAINS`, `CONTAINS_WORD`). (2) Regex Pattern Set: Reusable collection of up to 10 regular expressions evaluated against a request component (consumes more WCUs than string match). (3) Text Transformations: Essential step applied BEFORE string/regex matching (e.g., `LOWERCASE`, `URL_DECODE`, `HTML_ENTITY_DECODE`, `BASE64_DECODE`) to prevent evasion via URL encoding or mixed-case payloads.',
  keyPoints: [
    'Byte Match statements inspect literal string sequences with high performance and low WCU cost.',
    'Positional constraints include `STARTS_WITH`, `ENDS_WITH`, `EXACTLY`, `CONTAINS`, and `CONTAINS_WORD`.',
    'Regex Pattern Sets allow evaluating complex regular expressions across request components.',
    'Regex matching consumes significantly higher Web ACL Capacity Units (WCUs) than simple string matches.',
    'Text transformations (e.g., `LOWERCASE`, `URL_DECODE`, `HEX_DECODE`) must be chained to prevent bypasses.',
    'Can inspect URIs, Query Strings, Single Headers, All Headers, Cookies, or Request Bodies.'
  ],
  commonMistake: 'Using a complex Regular Expression statement when a simple String Match (Byte Match) statement would suffice. Regex statements consume significantly more WCUs and processing overhead; use simple string matches with positional constraints (like `STARTS_WITH /admin`) wherever possible.',
  example: 'Create a regex pattern set to identify path traversal attempts: aws wafv2 create-regex-pattern-set --name PathTraversalPatterns --scope REGIONAL --regular-expression-list RegexString="(\.\./|\.\.\\\)" --region us-east-1.',
  sources: [
    {
      title: 'String Match (Byte Match) Rule Statements in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-byte-match.html'
    },
    {
      title: 'Regex Pattern Set Match Statements in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-regex-pattern-set-match.html'
    }
  ]
});
