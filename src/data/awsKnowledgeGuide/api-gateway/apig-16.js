import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-16',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Lambda Authorizers',
  status: 'ready',
  plainEnglish: 'A Lambda authorizer is a Lambda function that API Gateway invokes before the protected backend. It receives identity information such as a bearer token or selected request parameters, applies custom authentication or authorization logic, and returns an authorization decision in the format required by the API type. REST API authorizers return an IAM policy and principal context; HTTP API Lambda authorizers support their documented response formats.',
  whyItMatters: 'Lambda authorizers support identity systems and rules that built-in IAM, Cognito, or JWT validation cannot express. They can consult an external provider, validate a proprietary token, or combine several request attributes in a decision.',
  workplaceExample: 'A legacy partner sends a proprietary token and tenant header. A REQUEST authorizer validates both against a partner directory and returns a policy limited to that tenant’s methods, with selected tenant context for the backend.',
  examFocus: 'Choose Lambda authorizers for custom authorization logic; choose built-in IAM, Cognito, or JWT authorizers when they meet the requirement because they avoid function execution and custom code. REST TOKEN authorizers use one token source, while REQUEST authorizers can use multiple identity sources. Caching improves latency and cost but the cache key and returned permission scope must be designed together.',
  keyPoints: [
    'API Gateway invokes the authorizer before the protected integration.',
    'TOKEN authorizers use a bearer-token identity source for REST APIs.',
    'REQUEST authorizers can use multiple headers, query values, stage variables, and context values.',
    'Cached decisions are reused according to configured identity sources and TTL.',
    'API Gateway needs permission to invoke the authorizer function.'
  ],
  commonMistake: 'Caching a narrow policy under a token-only key can deny other valid routes, while caching an overly broad policy can grant too much. Define identity sources that separate decisions correctly and return a policy whose resource scope is safe for every request sharing that cache key.',
  example: 'Use a REQUEST authorizer keyed by the Authorization and tenant headers. Send a valid combination and expect the backend to receive approved tenant context; change the tenant and verify a separate authorization decision occurs. Inspect authorizer invocation metrics and API access logs without recording the token.',
  sources: [
    { title: 'Use API Gateway Lambda authorizers', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html' },
    { title: 'Lambda authorizers for HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html' }
  ]
});
