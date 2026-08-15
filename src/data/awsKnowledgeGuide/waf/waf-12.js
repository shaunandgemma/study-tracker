import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-12',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'SQL Injection Protection',
  status: 'ready',
  plainEnglish: 'SQL Injection (SQLi) is a severe web application vulnerability where an attacker injects malicious database commands (such as `\' OR 1=1 --` or `UNION SELECT`) into web request inputs like form fields, query parameters, headers, or cookies to trick the backend database into dumping sensitive data, modifying records, or executing unauthorized administrative operations. AWS WAF provides native SQL Injection Match statements and AWS Managed Rules specifically engineered to detect, parse, and block malicious SQL syntax patterns before they reach your backend application and database.',
  whyItMatters: 'A successful SQL injection exploit can lead to catastrophic data breaches, complete database destruction, and severe regulatory penalties (e.g., GDPR, HIPAA, PCI DSS). While developers should always use parameterized queries and Object-Relational Mapping (ORM) frameworks in application code, AWS WAF acts as an essential first line of defense (defense-in-depth), instantly stopping exploit payloads at the network perimeter.',
  workplaceExample: 'An enterprise e-commerce platform allows users to search products via a search bar sending `GET /products?query=...`. An attacker submits `query=shoes%27+UNION+SELECT+username,password+FROM+users--`. AWS WAF inspects the decoded query string, detects the SQL injection payload using its built-in SQLi match engine, and terminates the request with an HTTP 403 Forbidden status, preventing the malicious query from ever executing against Amazon Aurora.',
  examFocus: 'SAA-C03 core points: (1) Built-in SQLi Statement: `SqliMatchStatement` inspects URI, query strings, headers, cookies, or body for SQL injection syntax. (2) AWS Managed Rule Group: `AWSManagedRulesSQLiRuleSet` provides comprehensive, continually updated protection against advanced SQL injection variants. (3) Sensitivity Levels: Can configure match sensitivity (LOW or HIGH) to balance detection against false positives. (4) Text Transformations: Always combine SQLi statements with `URL_DECODE` and `HTML_ENTITY_DECODE` to catch obfuscated and encoded SQL payloads.',
  keyPoints: [
    'Detects and blocks attempts to manipulate backend SQL databases via malicious input payloads.',
    'Provides native `SqliMatchStatement` for inspecting query strings, URIs, headers, and request bodies.',
    'Includes `AWSManagedRulesSQLiRuleSet` for managed, continuously updated SQLi threat signatures.',
    'Supports configurable inspection sensitivity levels (LOW or HIGH) to minimize false positives.',
    'Requires text transformations (e.g., `URL_DECODE`) to inspect obfuscated or hex-encoded SQL fragments.',
    'Serves as critical defense-in-depth alongside parameterized queries in application code.'
  ],
  commonMistake: 'Relying exclusively on application-level validation without WAF protection, or vice versa. Defense-in-depth requires both: AWS WAF to block automated exploit probes at the edge/ALB, and parameterized queries (prepared statements) in application code to ensure safe database execution.',
  example: 'Configure a WAF rule to inspect all query arguments and the request body for SQL injection: {"Name": "BlockSQLInjection", "Priority": 2, "Statement": {"OrStatement": {"Statements": [{"SqliMatchStatement": {"FieldToMatch": {"AllQueryArguments": {}}, "TextTransformations": [{"Priority": 0, "Type": "URL_DECODE"}, {"Priority": 1, "Type": "LOWERCASE"}]}}, {"SqliMatchStatement": {"FieldToMatch": {"Body": {}}, "TextTransformations": [{"Priority": 0, "Type": "URL_DECODE"}, {"Priority": 1, "Type": "LOWERCASE"}]}}]}}, "Action": {"Block": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "BlockSQLInjection"}}.',
  sources: [
    {
      title: 'SQL Injection Match Rule Statements in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-sqli-match.html'
    },
    {
      title: 'AWS Managed Rules SQL Database Rule Group',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html'
    }
  ]
});
