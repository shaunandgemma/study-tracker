import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-13',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'AWS Service Integrations',
  status: 'ready',
  plainEnglish: 'An AWS service integration lets API Gateway call a supported AWS service action directly instead of invoking Lambda as an intermediary. API Gateway maps client data to the service request and maps the result back to the client. REST APIs use AWS integrations for service actions, while HTTP APIs provide documented first-class integration subtypes for selected operations such as sending an SQS message or starting a Step Functions workflow.',
  whyItMatters: 'Direct integration removes code, runtime maintenance, and an extra failure point when the required operation is already available as an AWS API. It can make asynchronous ingestion and service orchestration simpler and more reliable.',
  workplaceExample: 'POST /jobs maps a validated request into an SQS SendMessage action. API Gateway assumes a role allowed to send only to the job queue, and workers process the message later. No Lambda function is required merely to relay the payload.',
  examFocus: 'Choose direct AWS integration when the request can map cleanly to a supported service action and no custom compute is needed. Choose Lambda when validation, branching, enrichment, or unsupported logic is required. API Gateway needs an execution role or supported resource-based permission with only the integrated action and resource. Client authorization and API Gateway’s permission to call the backend are separate decisions.',
  keyPoints: [
    'Direct integrations call supported AWS service APIs without relay code.',
    'Request parameters must satisfy the chosen service action.',
    'API Gateway needs permission to invoke the specific backend action.',
    'REST and HTTP APIs expose different AWS integration models and supported actions.',
    'Mapping and error handling form the public contract seen by clients.'
  ],
  commonMistake: 'Granting the API Gateway execution role access to every queue or state machine is broader than needed. Scope the role to the exact service action and resources used by the integration, and separately authorize which clients may invoke the API route.',
  example: 'For POST /events, map the request body to a supported EventBridge PutEvents integration and configure an execution role allowed to put events only on the intended bus. Submit a harmless test event and expect an accepted service response; verify the event reaches the rule target and review API access logs.',
  sources: [
    { title: 'Create AWS service integrations for HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services.html' },
    { title: 'Tutorial: REST API with an AWS integration', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-aws-proxy.html' },
    { title: 'Choose an API Gateway integration type', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-integration-types.html' }
  ]
});
