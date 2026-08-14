import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-15',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Cognito User Pool Authorization',
  status: 'ready',
  plainEnglish: 'An Amazon Cognito user pool is a user directory and OpenID Connect identity provider. A REST API Cognito authorizer validates a token obtained after user sign-in before allowing a protected method. An ID token carries identity claims, while an access token carries OAuth scopes that can authorize access to protected resources. The client normally sends the token in the Authorization header.',
  whyItMatters: 'It gives web and mobile applications managed sign-up, sign-in, token issuance, and API authorization without writing a custom token validator for ordinary user-pool cases.',
  workplaceExample: 'Customers sign in to a shopping application through a Cognito user pool. The access token includes an orders/read scope, and API Gateway permits GET /orders only when the method requires that scope.',
  examFocus: 'Choose a Cognito user-pool authorizer for REST API application users authenticated by Cognito. For HTTP APIs, the comparable built-in mechanism is a JWT authorizer configured with an issuer and audience. Choose IAM for callers using AWS credentials, and Lambda authorizers when authorization needs custom claims, external identity systems, database lookups, or other logic.',
  keyPoints: [
    'A user pool authenticates users and issues signed tokens.',
    'API Gateway validates the supplied token before invoking a protected method.',
    'Access tokens can be checked for required OAuth scopes.',
    'ID and access tokens have different intended uses and claims.',
    'The API method must be configured to use and deploy the authorizer.'
  ],
  commonMistake: 'Confusing a Cognito user pool with an identity pool leads to the wrong authorization design. User pools authenticate users and issue tokens; identity pools exchange identities for temporary AWS credentials, which are used with IAM-authorized APIs.',
  example: 'Configure a REST method with a Cognito authorizer and require the orders/read scope. Call it with a current access token containing that scope and expect success; repeat with an expired token or a token missing the scope and verify API Gateway rejects it before the backend runs.',
  sources: [
    { title: 'Control access using Cognito user pools', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html' },
    { title: 'Access API Gateway resources after Cognito sign-in', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-accessing-resources-api-gateway-and-lambda.html' },
    { title: 'Amazon Cognito user pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html' }
  ]
});
