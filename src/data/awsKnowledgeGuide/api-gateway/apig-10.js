import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-10',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Private API Endpoints',
  status: 'ready',
  plainEnglish: 'A private API endpoint is a REST API that clients invoke from an Amazon VPC through an interface VPC endpoint powered by AWS PrivateLink. Its traffic does not traverse the public internet. An API resource policy can restrict which VPCs or VPC endpoints may invoke it, while a VPC endpoint policy adds another access-control layer.',
  whyItMatters: 'Private endpoints expose managed API functionality to internal workloads without a public API address. They are useful for regulated, internal, and hybrid applications that require a private network path and explicit data-perimeter controls.',
  workplaceExample: 'An application in private subnets calls an internal payments REST API through an execute-api interface endpoint. The API resource policy permits only the approved VPC endpoint, and IAM authorization limits which workload role can invoke each method.',
  examFocus: 'Private API endpoint and private integration are different. A private endpoint controls how clients reach the API; a VPC link controls how API Gateway reaches a private backend. Private API endpoints are supported for REST APIs, require an interface VPC endpoint, and can be reached from connected on-premises networks through the VPC. HTTP APIs do not offer private API endpoints, though they can use private backend integrations.',
  keyPoints: [
    'A private API is callable through an interface VPC endpoint.',
    'Private API endpoints are a REST API feature.',
    'A resource policy can restrict invoking VPCs and VPC endpoints.',
    'VPC endpoint policies can further control access through the endpoint.',
    'Private endpoint access is distinct from a VPC link to a backend.'
  ],
  commonMistake: 'Creating a VPC link and assuming the API itself is private confuses the frontend and backend network paths. Select a private REST API plus interface endpoint for private client access; add a VPC link only when API Gateway must also reach a private VPC integration.',
  example: 'Associate an execute-api interface endpoint with a private REST API and restrict the API resource policy to that endpoint. Invoke the deployed method from an approved VPC workload and expect success; verify a request from an unapproved path is denied and inspect access logs without recording sensitive payloads.',
  sources: [
    { title: 'Private REST APIs in API Gateway', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html' },
    { title: 'Best practices for private APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-api-best-practices.html' },
    { title: 'API endpoint types for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html' }
  ]
});
