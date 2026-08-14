import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-6',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'API Gateway HTTP APIs',
  status: 'ready',
  plainEnglish: 'An API Gateway HTTP API is the streamlined RESTful API product. Routes combine an HTTP method and path, such as POST /orders, and send requests to Lambda, routable HTTP endpoints, supported AWS service actions, or private integrations. HTTP APIs provide built-in CORS configuration, automatic deployment options, JWT authorizers for OAuth 2.0 or OpenID Connect, and lower cost and latency than REST APIs, but intentionally omit some REST API features.',
  whyItMatters: 'HTTP APIs are a good default for simple serverless and HTTP proxy workloads. They reduce configuration and cost while still supplying managed routing, authorization, stages, monitoring, and integrations.',
  workplaceExample: 'A mobile application calls a small Lambda-backed profile service. The team uses an HTTP API with JWT authorization and configured CORS because it does not need API keys, response caching, request validation, or WAF on the API stage.',
  examFocus: 'Choose HTTP API for a lower-cost, low-latency RESTful endpoint when its supported features are enough. Choose REST API if the clue requires API keys, per-client usage plans, caching, request validation, AWS WAF integration, edge-optimized or private API endpoints. HTTP API endpoints are Regional. WebSocket remains the choice when either side must send messages over a persistent connection.',
  keyPoints: [
    'HTTP APIs route HTTP methods and paths to integrations.',
    'They support Lambda, HTTP proxy, supported AWS service, and private integrations.',
    'They include JWT authorization, CORS configuration, and automatic deployment options.',
    'They are designed with fewer features and lower price than REST APIs.',
    'HTTP API endpoints are Regional rather than edge-optimized or private API endpoints.'
  ],
  commonMistake: 'Assuming HTTP API means every REST API feature is available leads to redesign later. Check the official comparison before choosing, especially for API keys, caching, WAF, private endpoints, transformations, and monitoring features.',
  example: 'Define GET /profile with a Lambda integration and JWT authorizer, then use a test stage with automatic deployment enabled. A valid token should return the Lambda response; verify an invalid or expired token is rejected and confirm the request appears in the stage access log.',
  sources: [
    { title: 'API Gateway HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html' },
    { title: 'Choose between REST APIs and HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html' },
    { title: 'Develop HTTP APIs in API Gateway', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop.html' }
  ]
});
