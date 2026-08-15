import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-18',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'WAF on Amazon API Gateway',
  status: 'ready',
  plainEnglish: 'Deploying AWS WAF on Amazon API Gateway associates a Regional Web ACL with an API Gateway REST API or HTTP API stage. When client applications submit HTTP API calls, AWS WAF evaluates the request parameters, headers, and payloads against your Web ACL rules before API Gateway processes the request, performs authorization, or triggers backend AWS Lambda functions and microservices.',
  whyItMatters: 'Public APIs are prime targets for automated scraping, credential-stuffing attacks, denial-of-service floods, and payload exploitation. Placing WAF in front of API Gateway prevents malicious and abusive requests from triggering serverless Lambda invocations, protecting backend databases from overwhelming concurrency spikes and saving significant Lambda compute execution costs.',
  workplaceExample: 'A mobile banking backend uses Amazon API Gateway REST APIs backed by AWS Lambda functions. The engineering team associates a Regional Web ACL with the `prod` API stage. The Web ACL enforces rate-limiting per API key, blocks known malicious bot networks using AWS Managed IP Reputation lists, and inspects JSON bodies for SQL injection attempts. Malicious requests are blocked at the API Gateway layer in under 5 milliseconds with zero Lambda invocations billed.',
  examFocus: 'SAA-C03 core points: (1) Stage Association: Web ACLs are associated with specific API Gateway stages (e.g., `prod`, `dev`, `v1`). (2) Scope: Uses Regional Web ACLs (`REGIONAL`) created in the same AWS Region as the API Gateway stage. (3) Supported API Types: Supports both API Gateway REST APIs and HTTP APIs. (4) Cost Optimization: Blocking malicious requests at the API Gateway/WAF boundary prevents downstream AWS Lambda execution charges.',
  keyPoints: [
    'Attaches a Regional Web ACL to Amazon API Gateway REST API and HTTP API stages.',
    'Inspects API calls before triggering downstream AWS Lambda functions or HTTP integrations.',
    'Protects serverless backends against SQLi, XSS, automated scraping, and HTTP flood attacks.',
    'Reduces AWS Lambda and database costs by dropping abusive requests at the API edge.',
    'Allows rate-limiting and custom header inspection per API key or client IP address.',
    'Can be managed across stages using the API Gateway Console, AWS CLI, or AWS CDK/Terraform.'
  ],
  commonMistake: 'Associating a Web ACL with an API Gateway API but forgetting to deploy the change to the active stage. In API Gateway REST APIs, changes to stage configurations (including WAF associations) must be associated directly with the target Stage (e.g., `prod`) to take effect.',
  example: 'Associate a regional Web ACL with an Amazon API Gateway REST API stage: aws wafv2 associate-web-acl --web-acl-arn arn:aws:wafv2:us-east-1:123456789012:regional/webacl/APIGateway-Protection/abcdef12-3456 --resource-arn arn:aws:apigateway:us-east-1::/restapis/a1b2c3d4e5/stages/prod --region us-east-1.',
  sources: [
    {
      title: 'Associating AWS WAF with Amazon API Gateway',
      url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-aws-waf.html'
    },
    {
      title: 'Using AWS WAF to Protect Your REST APIs in API Gateway',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-associating-aws-resource.html'
    }
  ]
});
