import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-17',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'API Keys',
  status: 'ready',
  plainEnglish: 'An API Gateway API key is a client identifier used by REST API usage plans. A client normally sends the key in the X-API-Key header, or a Lambda authorizer can supply it as the usage identifier. API Gateway matches the key to a usage plan so it can apply the plan’s throttling and quota targets to selected deployed stages and methods. An API key is not a secure authentication or authorization mechanism.',
  whyItMatters: 'API keys let API providers identify consumers for metering and differentiated usage plans. They are useful for product tiers and client-level traffic management when combined with real authorization.',
  workplaceExample: 'A partner API assigns each customer an API key linked to a usage plan. Cognito or IAM controls what the customer may do, while the key identifies which partner’s throttling and quota targets apply.',
  examFocus: 'API keys and usage plans are REST API features. Choose them for client identification, metering, quotas, and per-client throttling—not for authentication, confidential identity, or guaranteed cost control. Pair keys with IAM, Cognito, or Lambda authorizers when access must be secured. Usage-plan enforcement is best effort.',
  keyPoints: [
    'API keys identify REST API clients for usage plans.',
    'Clients commonly submit the value in the X-API-Key header.',
    'A method must require a key and its stage must be associated with a usage plan.',
    'API keys do not replace authentication and authorization.',
    'Key values should not contain confidential information.'
  ],
  commonMistake: 'Treating possession of an API key as proof of identity allows a copied or logged key to act like a password. Use a proper authorizer for access control, rotate and protect keys operationally, and use the key only as the usage-plan identifier.',
  example: 'Associate a test key with a plan containing the test stage, and mark GET /reports as requiring a key. A request with the associated key should reach the authorizer and backend; a missing or unknown key should be rejected. Verify the key association and usage metrics without printing the key value.',
  sources: [
    { title: 'Usage plans and API keys for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html' },
    { title: 'Choose an API key source', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-key-source.html' }
  ]
});
