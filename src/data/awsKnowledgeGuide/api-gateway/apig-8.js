import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-8',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Regional API Endpoints',
  status: 'ready',
  plainEnglish: 'A Regional API endpoint is hosted in the AWS Region where the API is deployed. Clients call that Regional hostname directly unless you place another service, such as your own CloudFront distribution, in front. Regional endpoints are available for REST APIs and are the endpoint model for HTTP APIs. A Regional custom domain and its certificate are configured for that Region.',
  whyItMatters: 'Regional endpoints reduce connection overhead for clients in or near the same Region and give architects control over any CloudFront distribution, multi-Region routing, caching, and security layer placed in front.',
  workplaceExample: 'An internal business application and its API run in eu-west-2. The team uses a Regional endpoint and a Regional custom domain. Later, it deploys the API in another Region and uses Route 53 routing across the Regional endpoints for resilience.',
  examFocus: 'Choose Regional when clients are primarily in the same Region, when you want to manage your own CloudFront distribution, or when designing a multi-Region API with DNS routing. Edge-optimized REST endpoints use an API Gateway-managed CloudFront distribution for geographically dispersed clients. A private REST API is reachable through an interface VPC endpoint instead of publicly.',
  keyPoints: [
    'A Regional endpoint resides in the API’s deployment Region.',
    'It is suitable for clients in the same Region or architect-managed edge delivery.',
    'REST APIs and HTTP APIs can use Regional endpoints.',
    'A Regional custom domain uses a certificate in the same Region as the API.',
    'Route 53 can route a custom domain across Regional deployments.'
  ],
  commonMistake: 'Calling a Regional endpoint globally resilient without deploying another Region leaves a single-Region dependency. For a multi-Region requirement, deploy each API and backend, configure domain mappings and certificates, and add an appropriate DNS or edge-routing design.',
  example: 'Expose api.example.com as a Regional custom domain mapped to the prod stage. Create DNS routing to the API Gateway Regional domain name, then request a health endpoint. Expect the prod response; verify the certificate, API mapping, DNS result, and Regional CloudWatch metrics.',
  sources: [
    { title: 'API endpoint types for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html' },
    { title: 'Set up a Regional custom domain name', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-regional-api-custom-domain-create.html' }
  ]
});
