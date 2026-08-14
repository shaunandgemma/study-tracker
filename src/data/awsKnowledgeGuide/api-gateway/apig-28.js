import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-28',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'API Gateway vs Application Load Balancer',
  status: 'ready',
  plainEnglish: 'API Gateway is an API-management front door for REST, HTTP, and WebSocket APIs, with API-focused routing, authorization, transformations, throttling, stages, and integrations. An Application Load Balancer (ALB) distributes HTTP or HTTPS traffic among healthy targets using listeners, rules, and target groups. Both can route Layer 7 requests, but they solve different primary problems and can be used together.',
  whyItMatters: 'The choice affects cost model, operational controls, protocol features, and backend architecture. API Gateway is useful when clients need a managed API contract; ALB is useful when distributing sustained web traffic directly across services and health-checked targets.',
  workplaceExample: 'A public partner API uses API Gateway for authorization, quotas, request mapping, and stage releases, then reaches private ECS services through a VPC link and internal ALB. A separate high-throughput website routes directly through a public ALB to its target groups.',
  examFocus: 'Choose API Gateway for REST/HTTP/WebSocket API publishing, IAM or Lambda API authorization, usage plans, service integrations, transformations, or managed stages. Choose ALB for host/path/header routing to health-checked EC2, IP, container, or Lambda targets when API-management features are not required. ALB supports OIDC or Cognito user authentication at HTTPS listeners, but that is not equivalent to API Gateway’s full API-management model. They are complementary in private-integration designs.',
  keyPoints: [
    'API Gateway manages API contracts, consumers, integrations, and release stages.',
    'ALB distributes HTTP traffic across healthy registered targets.',
    'Both support Layer 7 routing and CloudWatch observability.',
    'API Gateway offers API-specific throttling, transformations, and AWS service integration.',
    'ALB target groups provide health-based routing to compute backends.',
    'A VPC link can place API Gateway in front of an internal ALB.'
  ],
  commonMistake: 'Choosing only by the fact that traffic is HTTP ignores the operational requirement. Compare client authorization, metering, transformations, WebSocket needs, target health checks, sustained traffic, and pricing before selecting one service or a layered design.',
  example: 'For a partner endpoint requiring per-client quotas and direct SQS submission, select API Gateway. For a web service requiring host-based routing across healthy ECS targets, select ALB. If both contracts and private target routing are required, test API Gateway with a VPC link to an internal ALB and verify each layer’s logs and health metrics.',
  sources: [
    { title: 'What is Amazon API Gateway?', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html' },
    { title: 'What is an Application Load Balancer?', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html' },
    { title: 'Private integrations for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/private-integration.html' }
  ]
});
