import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-26',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'AWS WAF Integration',
  status: 'ready',
  plainEnglish: 'AWS WAF is a web application firewall that evaluates HTTP requests against a web access control list, or web ACL. Rules can allow, block, count, rate-limit, or otherwise inspect requests using managed and custom conditions. For API Gateway, a Regional AWS WAF web ACL can be associated with a REST API stage, and its rules are evaluated before API Gateway resource policies and authorizers.',
  whyItMatters: 'WAF helps protect public APIs from common web exploits, malicious patterns, unwanted sources, and abusive request rates before those requests reach authorization code or backends.',
  workplaceExample: 'A public checkout REST API associates a web ACL with its prod stage. Managed rules detect common injection patterns, a custom rule restricts an administration path, and count mode is reviewed before a new rule begins blocking.',
  examFocus: 'Choose AWS WAF when the requirement is Layer 7 request inspection or filtering for an API Gateway REST API. It complements IAM, Cognito, and Lambda authorizers rather than replacing them. The API Gateway feature comparison does not list direct WAF association for HTTP APIs; if WAF is mandatory, a REST API is a direct choice, or an architect must deliberately introduce another supported WAF resource in front. WAF is not DDoS infrastructure protection by itself.',
  keyPoints: [
    'A web ACL contains ordered managed or custom web-request rules.',
    'API Gateway associates the web ACL with a REST API stage.',
    'WAF rules are evaluated before API Gateway access-control mechanisms.',
    'Count mode helps evaluate a rule before enforcing blocks.',
    'Authorization remains necessary after WAF permits a request.'
  ],
  commonMistake: 'Immediately blocking with an untested broad rule can reject legitimate traffic. Start suitable new rules in count mode, inspect sampled requests and WAF metrics, narrow exclusions where justified, and then enable blocking under change control.',
  example: 'Associate a Regional web ACL with a non-production REST stage and place a test rule in count mode. Send a harmless request matching the test condition and expect the API still to respond while the WAF count increases. Verify sampled requests and metrics before changing the rule action.',
  sources: [
    { title: 'Use AWS WAF to protect REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html' },
    { title: 'Choose between REST APIs and HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html' },
    { title: 'AWS WAF web ACLs', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html' }
  ]
});
