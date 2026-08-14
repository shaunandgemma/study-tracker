import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-5',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'API Gateway REST APIs',
  status: 'ready',
  plainEnglish: 'An API Gateway REST API is a managed HTTP front door built from resources, such as /orders, and methods, such as GET or POST. Each method connects to an integration: a Lambda function, an HTTP endpoint, an AWS service action, or a mock response. A deployment captures the API configuration, and a stage such as dev or prod makes that deployment callable. REST APIs are API Gateway’s feature-rich RESTful option.',
  whyItMatters: 'Solutions architects use REST APIs when they need mature API-management features around a backend, including API keys and usage plans, per-client throttling, request validation, response caching, AWS WAF association, private endpoints, or detailed request and response transformations.',
  workplaceExample: 'A partner-ordering service exposes /orders through a REST API. Cognito authorizes users, a usage plan meters each partner, WAF filters malicious requests, a mapping template adapts the public request to a legacy backend, and CloudWatch records metrics and logs.',
  examFocus: 'Choose a REST API when a scenario explicitly requires features that HTTP APIs do not provide, such as API keys, per-client throttling, caching, request validation, WAF integration, or private API endpoints. Choose an HTTP API for a simpler, lower-cost RESTful Lambda or HTTP front door when those features are unnecessary. Choose WebSocket for persistent two-way communication.',
  keyPoints: [
    'REST APIs organize client paths as resources with HTTP methods.',
    'Every callable method needs a backend integration or mock integration.',
    'A deployment is a snapshot that must be associated with a stage.',
    'REST APIs support Regional, edge-optimized, and private endpoint types.',
    'REST APIs provide more API-management features than HTTP APIs.'
  ],
  commonMistake: 'Selecting REST API merely because the application uses HTTP can add cost and configuration without benefit. List the required features first; use HTTP API when its smaller feature set meets the requirement, and REST API when a specific advanced capability is needed.',
  example: 'For an orders service, define POST /orders, authorize the method, integrate it with the order backend, deploy it to a test stage, and call the stage URL. Expect the backend response through API Gateway; verify the status code, access log request ID, and CloudWatch Count metric before promoting a new deployment.',
  sources: [
    { title: 'Develop REST APIs in API Gateway', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-develop.html' },
    { title: 'Choose between REST APIs and HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html' },
    { title: 'Amazon API Gateway concepts', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-basic-concept.html' }
  ]
});
