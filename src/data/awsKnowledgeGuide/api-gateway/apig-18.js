import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-18',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Usage Plans',
  status: 'ready',
  plainEnglish: 'A usage plan groups one or more deployed REST API stages and methods into an offering for API-key clients. It can define a target steady request rate, a burst target, and a quota over a selected time interval. An API key is associated with the plan to identify which client’s usage is counted. These controls are applied on a best-effort basis rather than as guaranteed hard ceilings.',
  whyItMatters: 'Usage plans help providers offer different consumer tiers, protect shared backend capacity, and observe client consumption without maintaining a separate metering gateway.',
  workplaceExample: 'A weather-data API offers standard and premium plans. Both require real authorization, but their API keys map to plans with different request-rate and quota targets across the production stage.',
  examFocus: 'Choose usage plans for REST API client metering, quotas, and per-client throttling. Do not choose them as the sole security boundary or as guaranteed cost protection because clients can sometimes exceed targets. For hard financial monitoring use cost controls such as AWS Budgets, and for malicious request filtering consider WAF and proper authorization.',
  keyPoints: [
    'A usage plan associates API keys with selected REST API stages and methods.',
    'Plans can set rate, burst, and quota targets.',
    'Usage is aggregated for a key across the stages included in its plan.',
    'Throttling and quotas are best-effort targets, not hard ceilings.',
    'A separate authorization mechanism should protect the API.'
  ],
  commonMistake: 'Relying on a monthly quota to guarantee that no extra request can run is unsafe because enforcement is best effort. Use the plan for metering and traffic shaping, monitor usage and cost, and enforce truly strict business limits in a system designed for authoritative counting.',
  example: 'Create a standard plan for the production stage, associate a non-production test key, and set conservative test rate and quota targets. Send requests gradually and expect usage to be recorded and excess traffic eventually throttled; verify plan associations, usage data, and 429 responses without treating the exact cutoff as guaranteed.',
  sources: [
    { title: 'Usage plans and API keys for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html' },
    { title: 'Throttle requests to REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html' }
  ]
});
