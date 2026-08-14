import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-11',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Lambda Proxy Integration',
  status: 'ready',
  plainEnglish: 'A Lambda proxy integration passes a standardized representation of the client request to one Lambda function. The event includes request details such as headers, path and query values, body, stage context, and authorization context. The function interprets that event and returns a response in the payload format API Gateway expects. This keeps most request and response logic in the function instead of in API Gateway mapping templates.',
  whyItMatters: 'Proxy integration is the simplest and preferred Lambda integration for many APIs. It reduces API Gateway configuration, preserves useful client context, and lets application code control status codes, headers, and response bodies.',
  workplaceExample: 'POST /orders invokes an order Lambda function. API Gateway passes the method, path, JSON body, and user claims in the event. The function validates the order and returns a 201 status, response headers, and a JSON body.',
  examFocus: 'Choose Lambda proxy when the function can understand the API Gateway event and construct the required response. Choose a non-proxy custom integration when API Gateway must transform or validate a distinct frontend contract before the function. REST APIs use the documented proxy response shape; HTTP APIs also use a payload-format version that determines the event and response rules. API Gateway must have permission to invoke the function.',
  keyPoints: [
    'Proxy integration forwards a standardized request event to Lambda.',
    'The Lambda function owns request interpretation and response construction.',
    'The required event and response shape depends on API type and payload-format version.',
    'An invalid REST proxy response can produce a 502 response.',
    'Lambda resource permissions must allow invocation from the intended API.'
  ],
  commonMistake: 'Returning a JavaScript object in the body where the selected payload format expects a string can cause malformed responses. Test the exact API type and payload version, serialize the body when required, and log only non-sensitive diagnostic context.',
  example: `For a REST API proxy integration, a small successful response is:\n\n{\n  "statusCode": 200,\n  "headers": { "content-type": "application/json" },\n  "body": "{\\"message\\":\\"ok\\"}"\n}\n\nThe body is a JSON string. Invoke the deployed route and expect HTTP 200 with the decoded JSON object; verify the API access log and Lambda invocation metric.`,
  sources: [
    { title: 'Lambda proxy integrations in API Gateway', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html' },
    { title: 'Lambda proxy integrations for HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html' },
    { title: 'Choose an API Gateway integration type', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-integration-types.html' }
  ]
});
