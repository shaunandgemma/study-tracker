import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-8',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'Custom Rules',
  status: 'ready',
  plainEnglish: 'Custom Rules in AWS WAF are user-defined inspection rules tailored to your application’s unique business logic, API requirements, and security policies. Unlike pre-built AWS Managed Rules, you write custom rules to match exact conditions on incoming web requests—such as checking for proprietary API key headers, restricting administrative endpoints to corporate IP subnets, enforcing payload size constraints, blocking specific geographic countries, or combining multiple conditions with boolean operators (AND, OR, NOT).',
  whyItMatters: 'Every web application has unique internal routes, custom authentication tokens, and specialized endpoints that generic rule sets cannot anticipate. Custom rules give security architects precise control to implement organizational compliance requirements (e.g., blocking requests from sanctioned countries), enforce API contract rules (e.g., rejecting request bodies > 8 KB on search endpoints), and swiftly mitigate zero-day vulnerabilities with custom virtual patches.',
  workplaceExample: 'A fintech company requires that all access to the internal transaction reconciliation path `/admin/reconcile` originate strictly from corporate VPN IP addresses AND include a custom HTTP header `X-SecOps-Auth` with a valid cryptographic token. The team creates a custom WAF rule using an `AND` statement combining an IP Set match and a Header string match. Any request failing either condition is blocked immediately with an HTTP 403 Forbidden response.',
  examFocus: 'SAA-C03 core points: (1) Logical Statements: Custom rules can combine multiple statements using `AndStatement`, `OrStatement`, and `NotStatement`. (2) Text Transformations: Sanitize input strings before matching (e.g., `LOWERCASE`, `URL_DECODE`, `HTML_ENTITY_DECODE`, `CMD_LINE`, `NONE`) to defeat obfuscation. (3) Custom Responses: Can return customized HTTP status codes (e.g., 403, 404, 429) and custom JSON/HTML response bodies. (4) Custom Headers: Can insert custom headers into allowed requests before forwarding them to the upstream backend.',
  keyPoints: [
    'User-authored rules designed to enforce bespoke application logic and security constraints.',
    'Combines multiple inspection criteria using boolean operators: `AND`, `OR`, and `NOT`.',
    'Applies text transformations (like `LOWERCASE` and `URL_DECODE`) to defeat evasion techniques.',
    'Supports custom response codes (e.g., 403, 429) and custom JSON/HTML response bodies.',
    'Can insert custom request headers into allowed traffic to signal upstream backend applications.',
    'Allows instant creation of virtual patches to protect against newly disclosed application bugs.'
  ],
  commonMistake: 'Failing to apply text transformations (such as URL_DECODE or LOWERCASE) in custom string match rules. An attacker can bypass a rule looking for `/admin` by submitting `/Admin` or `%2fadmin` if text transformations are not configured.',
  example: 'Define a custom rule requiring a secret header for administrative routes: {"Name": "EnforceAdminSecretHeader", "Priority": 2, "Statement": {"AndStatement": {"Statements": [{"ByteMatchStatement": {"SearchString": "/internal/", "FieldToMatch": {"UriPath": {}}, "TextTransformations": [{"Priority": 0, "Type": "LOWERCASE"}], "PositionalConstraint": "STARTS_WITH"}}, {"NotStatement": {"Statement": {"ByteMatchStatement": {"SearchString": "SecretToken123", "FieldToMatch": {"SingleHeader": {"Name": "x-admin-token"}}, "TextTransformations": [{"Priority": 0, "Type": "NONE"}], "PositionalConstraint": "EXACTLY"}}}}]}}, "Action": {"Block": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "EnforceAdminHeader"}}.',
  sources: [
    {
      title: 'Creating Custom Rules in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rules.html'
    },
    {
      title: 'Text Transformations in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-transformation.html'
    }
  ]
});
