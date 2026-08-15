import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-6',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'WAF Rules',
  status: 'ready',
  plainEnglish: 'A WAF Rule defines specific inspection criteria that AWS WAF uses to evaluate an incoming HTTP or HTTPS web request, combined with an action to take when the criteria are met. A rule inspects one or more parts of a request—such as IP addresses, country of origin, URI paths, HTTP headers, cookies, query strings, or body payloads—using logical match statements (like String Match, Regex Match, Rate-Based, SQLi match, or Geo Match). If a request matches, WAF executes the configured rule action (Allow, Block, Count, CAPTCHA, or Challenge).',
  whyItMatters: 'Web applications need granular protection tailored to their specific architecture. Individual WAF rules allow security architects to isolate critical vulnerabilities—such as blocking access to `/admin` from public IP ranges, rate-limiting the `/api/login` endpoint to prevent brute-force attacks, or blocking requests containing malicious SQL fragments—without interrupting normal user traffic.',
  workplaceExample: 'An enterprise API gateway receives high volumes of scraping traffic. The team writes a WAF rule that inspects the `User-Agent` HTTP header. If the header matches known headless scraper signatures or is missing completely, the rule triggers a `Block` action with a custom JSON response `{"error": "Unauthorized client"}`. Legitimate browser traffic with valid user agents passes through unaffected.',
  examFocus: 'SAA-C03 core points: (1) Rule Structure: Consists of a Statement (inspection criteria, e.g., IP set, byte match, geo match, rate-based), an Action (terminating like Allow/Block, or non-terminating like Count), and a Priority number. (2) Rule Types: Managed rules (pre-built by AWS or AWS Marketplace sellers) vs Custom rules (authored by your team). (3) Scope-Down Statements: Restricts a rule to only inspect requests matching specific criteria (e.g., inspect SQL injection only on POST requests to `/search`). (4) Rule Labels: Rules can attach labels to matching requests for downstream evaluation.',
  keyPoints: [
    'Defines inspection criteria and an associated action for matching HTTP/HTTPS requests.',
    'Inspects specific request components: headers, body, URI, query arguments, IP, and geographic country.',
    'Supports logical statements: String, Regex, IP set, Geo match, Size constraint, SQLi, and XSS.',
    'Includes Scope-Down statements to narrow down which requests are evaluated by complex rules.',
    'Can attach namespace labels to requests to coordinate multi-rule logic and CloudWatch metrics.',
    'Consumes Web ACL Capacity Units (WCUs) proportional to inspection complexity.'
  ],
  commonMistake: 'Writing a broad regex rule without a scope-down statement, causing every incoming request (including static images and CSS) to undergo expensive regex evaluation. Using scope-down statements (e.g., matching only `URI starts with /api`) optimizes WCU usage and eliminates unnecessary inspection latency.',
  example: 'Define a custom WAF rule that blocks requests containing specific suspicious strings in the URI path: {"Name": "BlockAdminAccess", "Priority": 1, "Statement": {"ByteMatchStatement": {"SearchString": "/admin", "FieldToMatch": {"UriPath": {}}, "TextTransformations": [{"Priority": 0, "Type": "LOWERCASE"}], "PositionalConstraint": "STARTS_WITH"}}, "Action": {"Block": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "BlockAdminAccess"}}.',
  sources: [
    {
      title: 'Rules in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rules.html'
    },
    {
      title: 'Rule Statements in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statements.html'
    }
  ]
});
