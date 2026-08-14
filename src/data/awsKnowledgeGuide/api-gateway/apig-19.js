import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-19',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Throttling',
  status: 'ready',
  plainEnglish: 'Throttling limits the rate at which API Gateway accepts requests so traffic does not overwhelm the API or backend. API Gateway uses a token-bucket model: tokens refill at the configured rate, and the bucket allows a short burst. When requests exceed the applicable capacity, clients can receive HTTP 429 Too Many Requests. Limits exist at AWS, account-and-Region, API/stage/method, and REST usage-plan client levels.',
  whyItMatters: 'Throttling protects shared capacity, improves fairness, and gives backends time to recover from traffic spikes. It is also an important part of designing clients that retry safely.',
  workplaceExample: 'A ticketing API limits a resource-intensive search method more strictly than ordinary reads. Clients use exponential backoff with jitter after 429 responses, preventing synchronized retries from creating another spike.',
  examFocus: 'Know rate versus burst: rate is sustained token refill, while burst is short-term bucket capacity. More specific configured targets are constrained by account and AWS limits. REST usage plans add per-client targets. Throttling is best effort and is not authentication, a guaranteed hard ceiling, or a substitute for WAF rules against malicious traffic.',
  keyPoints: [
    'API Gateway throttling uses a token-bucket algorithm.',
    'Rate controls sustained requests and burst allows short spikes.',
    'Excess requests can receive HTTP 429 responses.',
    'Configured targets cannot exceed higher account or AWS limits.',
    'Clients should retry with exponential backoff and jitter.'
  ],
  commonMistake: 'Immediate, synchronized retries after a 429 response amplify overload. Clients should honor retry guidance where available, apply exponential backoff with jitter, and make retried operations idempotent when duplicate effects are possible.',
  example: 'Set a lower throttle target on a non-production search method and send a controlled burst. Expect some requests above capacity to receive 429 responses. Verify API Gateway 4XX metrics and access logs, then confirm the client backs off instead of retrying continuously.',
  sources: [
    { title: 'Throttle requests to REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html' },
    { title: 'Usage plans and API keys', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html' }
  ]
});
