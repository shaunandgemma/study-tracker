import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-9',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Edge-Optimized API Endpoints',
  status: 'ready',
  plainEnglish: 'An edge-optimized endpoint is a public REST API endpoint that routes client requests through an API Gateway-managed CloudFront distribution. A geographically distributed client usually enters through a nearby CloudFront point of presence, and CloudFront carries the request to the API’s Region. Edge optimization is an endpoint-routing choice; the API and backend are still deployed in one Region.',
  whyItMatters: 'It offers a simple managed path for a single-Region REST API with widely distributed clients, without requiring the team to create and manage its own CloudFront distribution.',
  workplaceExample: 'A public partner API is hosted in one US Region but called from several continents. The team chooses an edge-optimized REST endpoint and maps a friendly domain to it, reducing the need to build a separate CloudFront configuration.',
  examFocus: 'Edge-optimized endpoints are a REST API feature and are the default endpoint type for REST APIs. Choose Regional when clients are nearby, you need control of your own CloudFront distribution, or you are building explicit multi-Region routing. Choose private REST API for VPC-only access. An edge-optimized custom domain applies across Regions and its ACM certificate must follow the edge-domain certificate location requirements.',
  keyPoints: [
    'Edge-optimized endpoints use an API Gateway-managed CloudFront distribution.',
    'They are intended for geographically dispersed clients calling one Regional API.',
    'They are supported for REST APIs, not HTTP APIs.',
    'The backend remains in the API’s deployment Region.',
    'Custom-domain certificate and DNS steps differ from Regional domains.'
  ],
  commonMistake: 'Assuming edge-optimized means the API backend runs at every edge location leads to incorrect resilience expectations. It optimizes the network path to one Regional API; deploy additional Regional stacks if the requirement is multi-Region backend availability.',
  example: 'Map api.example.com to an edge-optimized REST API custom domain and create the DNS record to the generated CloudFront target. Expect calls from different locations to reach the same API deployment; verify the domain mapping, certificate status, and stage access logs.',
  sources: [
    { title: 'API endpoint types for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html' },
    { title: 'Set up an edge-optimized custom domain name', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-edge-optimized-custom-domain-name.html' }
  ]
});
