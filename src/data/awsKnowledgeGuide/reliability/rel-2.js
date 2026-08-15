import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rel-2',
  topicId: 'topic-reliability',
  topicTitle: 'AWS Reliability & Resiliency',
  objectiveCode: 'Architecture',
  title: 'Throttling Recovery & Resilient Application Design',
  status: 'ready',
  plainEnglish: 'Throttling Recovery and Resilient Application Design encompasses the architectural patterns used to handle AWS API rate limits (HTTP 429 `TooManyRequestsException` or HTTP 503 `RequestLimitExceeded`) and dependency failures gracefully. Resilient design combines rate limiters, token bucket algorithms, asynchronous decoupling queues (Amazon SQS), Circuit Breakers, and Dead-Letter Queues (DLQs) to absorb traffic surges without crashing application microservices.',
  whyItMatters: 'AWS services enforce API call quotas and request rate limits to protect multi-tenant infrastructure. Applications that fail ungracefully when throttled experience cascading thread exhaustion, dropped customer orders, and service outages.',
  workplaceExample: 'A payment processor receives 20,000 requests per minute during Black Friday. When third-party payment gateways start throttling, the application routes unfulfilled payment jobs into an Amazon SQS FIFO queue with a Dead-Letter Queue (DLQ), processing payments asynchronously without dropping requests.',
  examFocus: 'SAA-C03 Throttling & Resilience Design Patterns:\n- API Throttling Responses: HTTP 429 (`Too Many Requests`) and HTTP 503 (`Request Limit Exceeded`).\n- Token Bucket Algorithm: Standard rate-limiting algorithm used by Amazon API Gateway and AWS APIs.\n- Asynchronous Decoupling: Use Amazon SQS or EventBridge to buffer burst traffic and smooth out rate spikes.\n- Circuit Breaker Pattern: Temporarily trips and halts calls to an impaired downstream service to prevent resource exhaustion.\n- Dead-Letter Queues (DLQs): Capture messages that repeatedly fail processing after max retry limits for manual inspection.',
  keyPoints: [
    'Handles AWS API throttling (HTTP 429 / 503) without application crashes.',
    'Uses Amazon SQS queues to buffer burst traffic and smooth processing rate spikes.',
    'Circuit Breakers stop calls to failing downstream dependencies to prevent resource exhaustion.',
    'Dead-Letter Queues (DLQs) isolate poison-pill messages after maximum retry attempts.',
    'Idempotency keys ensure repeated request retries execute safely with zero duplicate side effects.'
  ],
  commonMistake: 'Treating HTTP 429 throttling errors as permanent application bugs and throwing unhandled exceptions instead of buffering requests in queues or applying backoff retries.',
  example: 'Circuit Breaker State Machine Pattern in Pseudocode:\nclass CircuitBreaker {\n  constructor(threshold = 5, timeout = 30000) {\n    this.failureCount = 0;\n    this.state = "CLOSED"; // CLOSED (Normal), OPEN (Failing), HALF-OPEN (Testing)\n    this.threshold = threshold;\n    this.timeout = timeout;\n  }\n  async call(dependencyApi) {\n    if (this.state === "OPEN") throw new Error("Circuit Open: Service Unavailable");\n    try {\n      const res = await dependencyApi();\n      this.failureCount = 0;\n      return res;\n    } catch (err) {\n      this.failureCount++;\n      if (this.failureCount >= this.threshold) {\n        this.state = "OPEN";\n        setTimeout(() => this.state = "HALF-OPEN", this.timeout);\n      }\n      throw err;\n    }\n  }\n}',
  sources: [
    { title: 'Preventing throttling in AWS Well-Architected Reliability Pillar', url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_prevent_throttling.html' }
  ]
});
