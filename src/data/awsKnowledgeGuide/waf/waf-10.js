import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-10',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'Rate-Based Rules',
  status: 'ready',
  plainEnglish: 'A Rate-Based Rule in AWS WAF tracks the rate of incoming requests from individual clients and triggers an action (such as Block, CAPTCHA, or Challenge) when the request volume exceeds a defined limit within a sliding evaluation window. AWS WAF evaluates the rate across time windows (such as 1 minute, 2 minutes, 5 minutes, or 10 minutes) with a configurable rate limit (as low as 10 requests per evaluation window). Once an offending client drops their request rate back below the threshold, the block or challenge is automatically lifted.',
  whyItMatters: 'Web applications and APIs are frequent targets for Layer 7 distributed denial-of-service (DDoS) attacks, brute-force password guessing, and aggressive web scraping. Rate-based rules stop excessive request spikes per IP or per user session automatically, protecting backend databases, web servers, and third-party paid API quotas from being overwhelmed.',
  workplaceExample: 'An online ticketing platform experiences automated scalper bots flooding the `/checkout` endpoint during major concert sales. The team deploys a rate-based rule on their CloudFront distribution: any individual IP address making more than 100 requests to `/checkout` in a 5-minute evaluation window is automatically blocked with an HTTP 429 Too Many Requests response. Normal users submitting 1 or 2 checkouts are unaffected.',
  examFocus: 'SAA-C03 core points: (1) Aggregation Keys: Can aggregate by Source IP, Forwarded IP, HTTP headers (e.g., Session Token, API Key), Query parameters, or Cookie values. (2) Scope-Down Statement: Crucial for limiting rate tracking to specific sensitive URIs (e.g., `/login`, `/search`) rather than the entire website. (3) Evaluation Windows: Configurable sliding windows (1, 2, 5, or 10 minutes). (4) Temporary Mitigation: The rule automatically blocks an IP when it exceeds the limit and automatically unblocks it when the request rate subsides below the threshold.',
  keyPoints: [
    'Tracks request volume per client over a sliding time window (1, 2, 5, or 10 minutes).',
    'Triggers actions (Block, CAPTCHA, Challenge, or Count) when the rate threshold is exceeded.',
    'Automatically lifts the mitigation action when the client’s request rate drops below the limit.',
    'Supports custom aggregation keys: Source IP, Forwarded IP, HTTP Header, Cookie, or Query string.',
    'Uses Scope-Down statements to apply rate limits specifically to sensitive endpoints (e.g., `/api/login`).',
    'Provides effective mitigation against Layer 7 HTTP flood attacks and credential-stuffing bots.'
  ],
  commonMistake: 'Applying a single generic rate limit of 100 requests per 5 minutes across an entire website without a scope-down statement. A single modern web page can easily load 80+ static images, scripts, and fonts simultaneously, causing legitimate users to be accidentally rate-limited on their first visit. Always scope rate limits to specific dynamic or login API endpoints.',
  example: 'Define a rate-based rule that limits clients to 100 requests per 5-minute window on the `/api/login` URI: {"Name": "RateLimitLoginAPI", "Priority": 3, "Statement": {"RateBasedStatement": {"Limit": 100, "EvaluationWindowSec": 300, "AggregateKeyType": "IP", "ScopeDownStatement": {"ByteMatchStatement": {"SearchString": "/api/login", "FieldToMatch": {"UriPath": {}}, "TextTransformations": [{"Priority": 0, "Type": "LOWERCASE"}], "PositionalConstraint": "EXACTLY"}}}}, "Action": {"Block": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "RateLimitLoginAPI"}}.',
  sources: [
    {
      title: 'Rate-Based Rule Statements in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html'
    },
    {
      title: 'Mitigating Application-Layer DDoS with Rate-Based Rules',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rate-based-rules.html'
    }
  ]
});
