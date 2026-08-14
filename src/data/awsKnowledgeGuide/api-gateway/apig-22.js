import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-22',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Custom Domain Names',
  status: 'ready',
  plainEnglish: 'A custom domain replaces an API Gateway-generated execute-api hostname with a stable name such as api.example.com. An API mapping connects a base path on that name to an API stage, so one domain can expose one or more APIs. HTTPS requires a matching certificate, and DNS must route the custom name to the Regional or edge-optimized domain target created by API Gateway.',
  whyItMatters: 'A stable branded URL decouples clients from generated API identifiers and stages. It supports cleaner version paths, certificate management, and controlled migration between API deployments.',
  workplaceExample: 'api.example.com/orders maps to the production orders stage, while api.example.com/catalog maps to a different API. Route 53 alias records direct the name to the API Gateway Regional domain.',
  examFocus: 'A Regional custom domain uses a Region-specific ACM certificate in the same Region as the API. An edge-optimized REST custom domain uses the API Gateway-managed CloudFront path and its ACM certificate must be in us-east-1. Regional domains can map REST and HTTP APIs and support multi-level mappings under documented conditions. DNS configuration and API mapping are both required; creating only the certificate is insufficient.',
  keyPoints: [
    'A custom domain provides a stable, friendly API hostname.',
    'An API mapping connects a base path to a deployed API stage.',
    'The certificate must match the custom hostname.',
    'Certificate Region requirements depend on Regional or edge-optimized domain type.',
    'DNS must point the hostname to the generated API Gateway domain target.'
  ],
  commonMistake: 'Creating the custom domain and certificate but omitting the API mapping or DNS record leaves the hostname unusable. Verify certificate status, endpoint type, mapping, DNS target, and deployed stage as separate parts of the setup.',
  example: 'Map api.example.com/v1 to the prod stage and create a Route 53 alias to the Regional API Gateway domain target. Request /v1/health and expect the production health response; verify TLS hostname validation, DNS resolution, mapping selection, and access logs.',
  sources: [
    { title: 'Custom domain names for public REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html' },
    { title: 'Set up a Regional custom domain name', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-regional-api-custom-domain-create.html' },
    { title: 'Set up an edge-optimized custom domain name', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-edge-optimized-custom-domain-name.html' }
  ]
});
