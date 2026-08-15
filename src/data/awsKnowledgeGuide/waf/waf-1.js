import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-1',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'Protects CloudFront, Application Load Balancers (ALB), API Gateway, & AppSync',
  status: 'ready',
  plainEnglish: 'AWS WAF is a web application firewall that inspects incoming HTTP and HTTPS traffic before it reaches your application endpoints. You associate a single Web Access Control List (Web ACL) with supported AWS services: Amazon CloudFront distributions, Application Load Balancers (ALB), Amazon API Gateway REST/HTTP APIs, AWS AppSync GraphQL APIs, Amazon Cognito user pools, and AWS App Runner services. Once attached, WAF evaluates every incoming web request against your inspection rules, blocking attacks, challenging suspicious clients, or allowing legitimate traffic through.',
  whyItMatters: 'Web applications face threats like SQL injection, cross-site scripting (XSS), bots, credential stuffing, and volumetric HTTP floods. Attaching WAF directly to your edge (CloudFront) or application entry points (ALB, API Gateway, AppSync) provides centralized Layer 7 defense without altering application code or deploying third-party proxy appliances.',
  workplaceExample: 'A retail enterprise operates a global web store. The team attaches a Web ACL to Amazon CloudFront to filter malicious traffic globally at edge locations, and attaches another regional Web ACL directly to the backend Application Load Balancer to protect internal administrative portals that are not fronted by CloudFront. In both places, malicious bot traffic and SQL injection attempts are blocked before consuming backend container or database compute.',
  examFocus: 'SAA-C03 core points: (1) Supported associations: CloudFront (Global scope / `CLOUDFRONT`), Application Load Balancer (Regional scope / `REGIONAL`), Amazon API Gateway (REST/HTTP APIs), AWS AppSync (GraphQL), AWS App Runner, and Amazon Cognito user pools. (2) Layer 7 (HTTP/HTTPS) inspection only: WAF does not inspect Layer 3/4 TCP/UDP traffic (use Network ACLs, Security Groups, or AWS Network Firewall for Layer 3/4). (3) Edge vs Regional deployment: Deploy on CloudFront for edge filtering and DDoS mitigation closer to users; deploy on ALB/API Gateway for regional architectures.',
  keyPoints: [
    'AWS WAF attaches to CloudFront, Application Load Balancers, API Gateway, AppSync, App Runner, and Cognito user pools.',
    'Protects Layer 7 (HTTP/HTTPS) traffic by inspecting request headers, bodies, URIs, query strings, and IP addresses.',
    'CloudFront requires a Web ACL created in the Global (`CLOUDFRONT` / `us-east-1`) scope.',
    'ALB, API Gateway, AppSync, App Runner, and Cognito use Regional Web ACLs in their respective AWS Regions.',
    'Does not protect Layer 3/4 network protocols (use Security Groups, NACLs, or AWS Network Firewall).',
    'Provides centralized defense across microservices, serverless APIs, and monolithic web apps.'
  ],
  commonMistake: 'Trying to associate a Regional Web ACL with an Amazon CloudFront distribution. CloudFront distributions strictly require Web ACLs created with the Global scope (`CLOUDFRONT` via `us-east-1`), whereas ALBs and API Gateways require Web ACLs created in their local AWS Region.',
  example: 'Associate a regional Web ACL with an Application Load Balancer using the AWS CLI: aws wafv2 associate-web-acl --web-acl-arn arn:aws:wafv2:us-east-1:123456789012:regional/webacl/Production-ALB-Protection/a1b2c3d4-e5f6 --resource-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/prod-alb/50dc6c495c0c9188.',
  sources: [
    {
      title: 'AWS WAF Concepts and Supported Resources',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works.html'
    },
    {
      title: 'Associating or Disassociating a Web ACL with an AWS Resource',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-associating-aws-resource.html'
    }
  ]
});
