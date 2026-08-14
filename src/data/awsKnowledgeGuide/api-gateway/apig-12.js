import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-12',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'HTTP Integrations',
  status: 'ready',
  plainEnglish: 'An HTTP integration sends an API Gateway request to an HTTP or HTTPS backend. A proxy integration largely passes the complete request and response through, subject to API Gateway behavior and limits. A non-proxy REST integration can map method requests into a different backend request and map backend responses into the public API contract. A public integration needs a routable backend; a private integration uses a VPC link.',
  whyItMatters: 'HTTP integrations place API management in front of existing web services without rewriting them as Lambda functions. They can provide a stable public contract while backends change, or add authorization, throttling, logging, and a managed endpoint to an existing service.',
  workplaceExample: 'A company exposes selected operations from a legacy HTTPS inventory server through API Gateway. A REST non-proxy integration renames fields and status codes so mobile clients receive a clean contract without changing the legacy application.',
  examFocus: 'Choose HTTP proxy integration for minimal transformation and close client-to-backend pass-through. Choose a custom/non-proxy REST integration for mapping templates and explicit integration responses. Use a VPC link when the HTTP backend is private in a VPC. Do not confuse an HTTP integration with the HTTP API product: REST APIs and HTTP APIs can both integrate with HTTP backends.',
  keyPoints: [
    'HTTP integrations connect API Gateway to HTTP or HTTPS backends.',
    'Proxy mode minimizes API Gateway transformation.',
    'Non-proxy REST mode supports explicit request and response mappings.',
    'Public endpoints must be routable from API Gateway.',
    'Private HTTP backends are reached through an appropriate VPC link integration.'
  ],
  commonMistake: 'Calling a private RFC1918 address from a public HTTP integration does not create VPC connectivity. Configure a supported VPC link and private integration target, then verify security groups, listener or service discovery configuration, and backend health.',
  example: 'Map GET /catalog/{id} to an HTTPS backend path /v1/items/{id}. Send a known item ID and expect the backend’s item response through API Gateway. Verify the mapped path, backend status, API access log, and Latency versus IntegrationLatency to isolate API or backend delay.',
  sources: [
    { title: 'Integrations for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-integration-settings.html' },
    { title: 'Create integrations for HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations.html' },
    { title: 'HTTP proxy integration tutorial', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-http.html' }
  ]
});
