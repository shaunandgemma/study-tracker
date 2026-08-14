import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-27',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'VPC Links',
  status: 'ready',
  plainEnglish: 'A VPC link gives API Gateway a managed network path to a private integration in a VPC. It is the backend side of the architecture: clients call API Gateway, and API Gateway uses the link to reach a private load balancer or another supported integration target. Current REST APIs can use recommended VPC links V2 with Application Load Balancer targets; legacy V1 links use Network Load Balancers. HTTP API private integrations support documented ALB, NLB, and AWS Cloud Map targets.',
  whyItMatters: 'VPC links let teams expose private EC2, ECS, and other HTTP services through API Gateway without assigning public addresses to the backends. API Gateway can add authorization, routing, throttling, and monitoring at the managed front door.',
  workplaceExample: 'A public REST API routes authenticated requests through a VPC link V2 to an internal Application Load Balancer serving ECS tasks in private subnets. Security groups permit only the intended path, and the tasks remain unreachable directly from the internet.',
  examFocus: 'Use a VPC link for API Gateway-to-private-backend connectivity. It does not make the API endpoint private; client-side VPC-only access requires a private REST API and an interface VPC endpoint. Match the VPC link version and target types to the API product and current documentation. The link, API, and integration resources must meet account, Region, networking, and ownership requirements.',
  keyPoints: [
    'A VPC link connects API Gateway integrations to private VPC resources.',
    'It controls the backend path, not whether clients use a public API endpoint.',
    'REST VPC links V2 support private integrations with Application Load Balancers.',
    'Legacy REST VPC links V1 use Network Load Balancers.',
    'HTTP API private integrations support documented ALB, NLB, and Cloud Map targets.',
    'Subnets, security groups, listeners, and backend health must all be correct.'
  ],
  commonMistake: 'Debugging a VPC link only at API Gateway misses unhealthy targets or blocked network traffic. Check link state, selected subnets and security groups, load-balancer listener or Cloud Map service, target health, backend path, and IntegrationLatency in order.',
  example: 'Create a non-production VPC link to an internal load-balancer target and integrate GET /health with its listener. Invoke the API and expect the private service’s health response. Verify the link is available, targets are healthy, access logs show the request, and the backend has no public route.',
  sources: [
    { title: 'Private integrations for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/private-integration.html' },
    { title: 'Private integrations for HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-private.html' },
    { title: 'Tutorial: REST API with a private integration', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-private-integration.html' }
  ]
});
