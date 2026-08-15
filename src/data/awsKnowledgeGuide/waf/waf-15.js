import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-15',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'Allow, Block, Count, CAPTCHA and Challenge Actions',
  status: 'ready',
  plainEnglish: 'When a web request matches a rule in your Web ACL, AWS WAF executes the configured Rule Action. There are five primary actions: (1) Allow (terminating action that forwards the request directly to the protected resource), (2) Block (terminating action that drops the request and returns an HTTP 403 or custom response code), (3) Count (non-terminating action that increments a CloudWatch metric and continues evaluating lower-priority rules), (4) CAPTCHA (presents an interactive visual/audio puzzle to verify human interaction), and (5) Challenge (runs a silent JavaScript browser verification in the background without interrupting legitimate human users).',
  whyItMatters: 'Using the right action balances security enforcement with user experience. Blocking outright stops confirmed exploits, but blocking aggressive scrapers or suspicious bots directly can produce false positives that alienate real customers. Challenge and CAPTCHA actions allow applications to mitigate automated scrapers and bots while allowing real human shoppers to complete their transactions seamlessly. Count action enables zero-risk testing of new rules in production.',
  workplaceExample: 'An airline deploys an anti-bot rule on its flight search API. Instead of blocking suspicious browser fingerprints (which might occasionally block real users with privacy extensions), the security team configures the rule action to `Challenge`. Legitimate web browsers complete the silent background cryptographic challenge in 50 milliseconds and proceed uninterrupted. Headless Python scraping scripts fail the JavaScript challenge and are blocked automatically.',
  examFocus: 'SAA-C03 core points: (1) Terminating Actions: `Allow`, `Block`, `CAPTCHA`, and `Challenge` stop evaluation of subsequent rules. (2) Non-Terminating Action: `Count` logs the match, increments metrics, and passes the request to the next rule in priority order. (3) Testing Rules: Always deploy new custom rules or managed rule groups with action set to `Count` first to monitor CloudWatch metrics for false positives before switching to `Block`. (4) Custom Response Codes: Block actions can return custom HTTP status codes (e.g., 403, 404, 429) and custom JSON bodies.',
  keyPoints: [
    'Allow: Terminating action that forwards matching traffic to the protected AWS resource.',
    'Block: Terminating action that rejects traffic with customizable HTTP status codes (e.g., 403, 429).',
    'Count: Non-terminating testing action that tracks matches in CloudWatch without impacting traffic.',
    'CAPTCHA: Challenges suspected bots with interactive puzzles before granting access tokens.',
    'Challenge: Silent background JavaScript verification that blocks simple scripts without user friction.',
    'Rule evaluation halts immediately upon matching any terminating action (Allow, Block, CAPTCHA, Challenge).'
  ],
  commonMistake: 'Deploying a complex new custom rule directly with the BLOCK action in a production environment without testing it in COUNT mode first. An overly broad regex or header check can cause widespread false positives and block legitimate paying users.',
  example: 'Configure a rule with a silent JavaScript Challenge action for suspicious client requests: {"Name": "ChallengeSuspiciousBrowsers", "Priority": 2, "Statement": {"GeoMatchStatement": {"CountryCodes": ["T1"]}}, "Action": {"Challenge": {}}, "VisibilityConfig": {"SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "ChallengeSuspiciousBrowsers"}}.',
  sources: [
    {
      title: 'AWS WAF Rule Actions',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-action.html'
    },
    {
      title: 'CAPTCHA and Challenge in AWS WAF',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-captcha-and-challenge.html'
    }
  ]
});
