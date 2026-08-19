export default Object.freeze({
  id: 'aws-api-gateway-cors-failure',
  examId: 'aws-saa-c03',
  order: 20,
  category: 'Amazon API Gateway',
  title: 'Resolve API Gateway CORS Failures',
  difficulty: 'Intermediate',
  summary: 'Diagnose why a browser blocks a successful API Gateway response.',
  scenario: 'A browser application hosted at https://app.training.example calls a REST API through API Gateway. The OPTIONS preflight request succeeds, and the GET request reaches the Lambda integration and returns HTTP 200, but the browser still blocks the response with a CORS error. The API must remain restricted to the approved browser origin rather than using a wildcard.',
  task: 'Use the supplied browser, preflight, and Lambda response evidence to identify why the browser rejects the successful GET response, make the smallest safe correction, and verify that the approved origin can read the API response.',
  evidence: [
    {
      id: 'browser-console',
      title: 'Browser Developer Console',
      kind: 'code',
      content: `Request origin:
https://app.training.example

GET https://api.training.example/orders
Network status: 200 OK

Browser console:
Access to fetch at 'https://api.training.example/orders'
from origin 'https://app.training.example' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.`
    },
    {
      id: 'preflight-response',
      title: 'OPTIONS Preflight Response',
      kind: 'code',
      content: `OPTIONS /orders HTTP/1.1

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.training.example
Access-Control-Allow-Methods: GET,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization`
    },
    {
      id: 'lambda-response',
      title: 'Lambda Proxy Integration Response',
      kind: 'code',
      content: `{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"orders\":[\"order-training-1001\"]}"
}

Integration type:
Lambda proxy integration

Approved browser origin:
https://app.training.example`
    }
  ],
  successCriteria: [
    'The learner identifies the missing CORS header on the successful Lambda proxy response as the browser failure.',
    'The GET response includes Access-Control-Allow-Origin for https://app.training.example.',
    'The existing successful OPTIONS preflight remains valid and no wildcard origin is introduced.',
    'A final browser request from https://app.training.example returns HTTP 200 and the application can read the response body.'
  ],
  hints: [
    'The preflight already succeeds, so compare its CORS headers with the headers on the actual GET response.',
    'With a Lambda proxy integration, the backend response must include the CORS headers that the browser needs on the actual response.',
    'Add Access-Control-Allow-Origin: https://app.training.example to the Lambda proxy response headers and retest the GET request.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the browser block the GET response even though API Gateway returns HTTP 200?',
      options: [
        { id: 'missing-response-origin', text: 'The Lambda proxy response does not include Access-Control-Allow-Origin for the approved browser origin.' },
        { id: 'preflight-failed', text: 'The OPTIONS preflight request is failing before the GET request is sent.' },
        { id: 'lambda-timeout', text: 'The Lambda function is timing out before returning a response.' },
        { id: 'api-private', text: 'The API must be made publicly writable for CORS to work.' }
      ],
      correctOptionId: 'missing-response-origin',
      explanation: 'The evidence shows a successful preflight and HTTP 200 GET, but the actual Lambda proxy response contains no Access-Control-Allow-Origin header, so the browser refuses to expose the response to the application.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'add-approved-origin', text: 'Return Access-Control-Allow-Origin: https://app.training.example in the Lambda proxy response and keep the existing preflight configuration.' },
        { id: 'wildcard-all', text: 'Allow every origin, method, and header with wildcard CORS settings.' },
        { id: 'disable-browser-security', text: 'Tell users to disable browser CORS protections.' },
        { id: 'remove-options', text: 'Delete the working OPTIONS method and rely only on the GET method.' }
      ],
      correctOptionId: 'add-approved-origin',
      explanation: 'Adding the approved origin to the actual proxy response fixes the missing browser requirement while preserving the existing restrictive CORS boundary.'
    }
  ],
  solution: {
    rootCause: 'The OPTIONS preflight is correctly configured, but the Lambda proxy integration returns the successful GET response without an Access-Control-Allow-Origin header, so the browser blocks access to the response.',
    fix: 'Add Access-Control-Allow-Origin: https://app.training.example to the Lambda proxy response headers, preserve the existing OPTIONS response, and verify that a browser request from the approved origin can read the HTTP 200 response body.',
    prevention: 'Use shared response helpers or automated API tests that verify required CORS headers are present on both preflight and normal success and error responses.'
  }
});
