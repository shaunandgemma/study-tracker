import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-18',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Cognito with API Gateway',
  status: 'ready',
  plainEnglish: 'Amazon API Gateway integrates directly with Amazon Cognito User Pools using a built-in Cognito User Pool Authorizer. When a client application makes an HTTP request to an API Gateway endpoint, it includes the Cognito JWT token (ID Token or Access Token) in the `Authorization` header. API Gateway automatically validates the cryptographic signature and expiration of the JWT token against the Cognito User Pool before forwarding the request to backend Lambda functions or HTTP endpoints.',
  whyItMatters: 'Using API Gateway Cognito Authorizers offloads JWT token validation entirely to API Gateway. Backend AWS Lambda functions do not need to parse or verify tokens, saving compute execution time and simplifying backend code.',
  workplaceExample: 'A serverless microservice exposes endpoints on Amazon API Gateway. Every route is protected by a Cognito User Pool Authorizer. If an unauthenticated request arrives without a valid Cognito JWT token, API Gateway automatically blocks the request with a `401 Unauthorized` HTTP status without invoking the Lambda function.',
  examFocus: 'SAA-C03 API Gateway + Cognito Authorizer details:\n- API Gateway Cognito User Pool Authorizer automatically validates Cognito JWT tokens (ID Token or Access Token).\n- Offloads authentication overhead from Lambda functions.\n- Claims from the validated token (such as `sub`, `email`, `cognito:groups`) are automatically passed to Lambda in `event.requestContext.authorizer.claims`.\n- Zero code required in Lambda to validate tokens.',
  keyPoints: [
    'Native integration protecting API Gateway REST and HTTP APIs.',
    'API Gateway validates Cognito JWT token signatures and expiration automatically.',
    'Rejects unauthorized requests with 401 Unauthorized before invoking Lambda.',
    'Passes user claims to Lambda via `event.requestContext.authorizer.claims`.',
    'Supports fine-grained OAuth 2.0 scope authorization on API routes.'
  ],
  commonMistake: 'Writing manual JWT token verification code inside every AWS Lambda function instead of attaching a native Cognito User Pool Authorizer to Amazon API Gateway.',
  example: 'Accessing User Claims in Lambda (Node.js):\n`const userId = event.requestContext.authorizer.claims.sub;`\n`const email = event.requestContext.authorizer.claims.email;`',
  sources: [
    { title: 'Control access to REST APIs using Amazon Cognito user pools', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html' }
  ]
});
