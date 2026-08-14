import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-r1',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'REST API vs HTTP API vs WebSocket API - Choosing the Right API Gateway Type',
  status: 'ready',
  plainEnglish: 'API Gateway offers two stateless request-response products—REST APIs and HTTP APIs—and a stateful WebSocket product. HTTP APIs provide streamlined routing, integrations, JWT authorization, CORS, and stage features at lower cost and latency. REST APIs add advanced management such as API keys and usage plans, caching, request validation, WAF integration, and private endpoints. WebSocket APIs keep bidirectional connections so servers can push messages.',
  whyItMatters: 'Choosing the smallest product that meets the requirements avoids unnecessary cost and complexity, while recognizing a required feature early prevents a disruptive migration after clients depend on the API.',
  workplaceExample: 'A team uses an HTTP API for a simple mobile Lambda backend, a REST API for a partner service requiring per-client usage plans and WAF, and a WebSocket API for live order-status pushes. Each choice follows the communication pattern and management needs.',
  examFocus: 'Start with communication style: persistent two-way messaging means WebSocket; normal HTTP request-response means REST or HTTP API. Then inspect feature clues. API keys, per-client throttling, caching, request validation, WAF association, edge-optimized endpoints, or private endpoints point to REST API. Basic Lambda or HTTP routing with JWT/OIDC and cost sensitivity points to HTTP API.',
  keyPoints: [
    'REST and HTTP APIs are stateless RESTful API products.',
    'HTTP APIs offer a streamlined feature set at lower price and latency.',
    'REST APIs are selected for advanced API-management requirements.',
    'WebSocket APIs support persistent bidirectional communication.',
    'Backend type alone does not determine the API type; required features and interaction pattern do.'
  ],
  commonMistake: 'Choosing WebSocket because updates should feel fast adds connection-state complexity when ordinary polling or request-response is sufficient. Conversely, trying to push through REST creates repeated client polling. Match the protocol to who initiates messages and how long the interaction lives.',
  example: 'Classify three requirements: JWT-protected Lambda CRUD with minimal cost selects HTTP API; partner metering plus cache and WAF selects REST API; chat messages pushed to connected browsers selects WebSocket API. Verify each choice against the current feature comparison before implementation.',
  sources: [
    { title: 'Choose between REST APIs and HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html' },
    { title: 'API Gateway use cases', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-overview-developer-experience.html' },
    { title: 'Overview of WebSocket APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html' }
  ]
});
