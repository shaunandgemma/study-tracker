import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-14',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'IAM Authorization',
  status: 'ready',
  plainEnglish: 'IAM authorization requires an API caller to possess AWS credentials, sign the request with AWS Signature Version 4 or 4a, and be allowed the execute-api:Invoke action for the deployed API method. API Gateway authenticates the signature and evaluates applicable identity and resource policies before invoking the backend. This protects the client-to-API call; it is separate from the permission API Gateway uses to call a backend.',
  whyItMatters: 'IAM authorization provides fine-grained, centrally managed access for AWS workloads, administrators, and partners that can obtain temporary AWS credentials. Policies can scope access by API, stage, HTTP method, and resource path.',
  workplaceExample: 'An ECS task assumes an application role and calls an internal orders method with a signed request. Its policy permits only POST on the production orders path, while a reporting role can invoke only GET methods.',
  examFocus: 'Choose IAM authorization for service-to-service callers with AWS identities and signed requests. Choose Cognito user-pool or JWT authorization for application users with tokens, and Lambda authorizers for custom identity or authorization logic. A resource policy is especially relevant for cross-account or network-based restrictions and combines with the caller’s IAM permissions.',
  keyPoints: [
    'The API method or route must use AWS_IAM authorization.',
    'Callers sign requests with SigV4 or SigV4a using AWS credentials.',
    'Policies grant execute-api:Invoke on scoped deployed API resources.',
    'Temporary role credentials are safer than embedded long-term access keys.',
    'Caller authorization is distinct from API Gateway backend permissions.'
  ],
  commonMistake: 'Sending an unsigned request with an IAM policy attached to the caller still fails because API Gateway cannot authenticate the request. Use an AWS SDK or a correct signing implementation and temporary credentials, then verify both signature validity and the execute-api resource scope.',
  example: 'Permit a workload role to invoke only POST /orders in the prod stage, then call through an AWS SDK that signs the request. Expect the approved method to succeed and a different method to be denied; verify the access log identity context and do not log credential material.',
  sources: [
    { title: 'Control access for invoking an API', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html' },
    { title: 'Control access to a REST API with IAM permissions', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/permissions.html' }
  ]
});
