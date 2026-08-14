import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-23',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'CORS',
  status: 'ready',
  plainEnglish: 'Cross-origin resource sharing (CORS) is a browser security protocol controlling whether JavaScript from one origin may call another origin. An origin is the scheme, host, and port combination. For many cross-origin requests the browser first sends an OPTIONS preflight request asking which origins, methods, and headers are allowed. The API’s responses must include matching Access-Control-Allow headers.',
  whyItMatters: 'Without correct CORS responses, a browser can block a valid API call even when the backend and authorization work. A narrow CORS policy lets the intended web applications call the API without granting every website the same browser access.',
  workplaceExample: 'A web app at https://app.example.com calls an API at https://api.example.com with an Authorization header. The browser sends a preflight, and the API permits that origin, the GET and POST methods, and the Authorization and Content-Type headers.',
  examFocus: 'CORS is enforced by browsers, not a general API authentication mechanism. HTTP APIs can manage CORS configuration and automatically answer configured preflight requests. For REST non-proxy integrations, configure an OPTIONS method and response headers. For REST Lambda proxy or HTTP proxy integrations, the backend must return the necessary CORS headers on actual responses. CORS does not protect an API from non-browser clients.',
  keyPoints: [
    'An origin includes scheme, hostname, and port.',
    'Browsers send preflight OPTIONS requests for many non-simple requests.',
    'Allowed origins, methods, and headers must match the browser request.',
    'HTTP APIs provide built-in CORS configuration.',
    'REST proxy backends must return CORS headers in their responses.',
    'CORS is not authentication or authorization.'
  ],
  commonMistake: 'Returning Access-Control-Allow-Origin only on successful responses still causes confusing browser failures when the API returns an error. Ensure intended gateway and backend error responses also include appropriate CORS headers, and avoid a wildcard origin when credentialed or tightly restricted access is required.',
  example: 'Allow only https://app.example.com, methods GET and POST, and headers Authorization and Content-Type. From that web origin, send a request that triggers preflight and expect OPTIONS and the actual call to succeed. Verify the browser network panel shows the allow headers; repeat from another origin and expect browser blocking.',
  sources: [
    { title: 'CORS for REST APIs in API Gateway', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html' },
    { title: 'Configure CORS for HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html' }
  ]
});
