import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-40",
  "title": "Lambda with API Gateway",
  "plainEnglish": "Integrating AWS Lambda with Amazon API Gateway allows you to build fully serverless RESTful and HTTP APIs. In a Lambda Proxy Integration (`AWS_PROXY`), API Gateway passes the entire incoming HTTP request (headers, path parameters, query strings, and body) directly to the Lambda function's `event` parameter. The function processes the request and returns a structured JSON object containing the HTTP `statusCode`, `headers`, and `body`.",
  "whyItMatters": "API Gateway combined with Lambda forms the bedrock of serverless web applications and microservices. API Gateway handles traffic management, CORS, authorization, rate limiting, request validation, and API versioning, while Lambda executes the backend business logic serverlessly with zero servers to manage or patch.",
  "workplaceExample": "A SaaS startup creates an API Gateway REST API with a POST `/users` endpoint routed to a registration Lambda function via Lambda Proxy Integration. API Gateway validates the request schema and invokes the Lambda function synchronously. The function inserts the user into DynamoDB and returns `{ 'statusCode': 201, 'headers': { 'Content-Type': 'application/json' }, 'body': JSON.stringify({ 'userId': 'usr-102' }) }`.",
  "examFocus": "Understand API Gateway integration specifics: (1) Lambda Proxy Integration vs Non-Proxy: Proxy passes raw HTTP requests to Lambda and requires a specific response JSON schema (`statusCode`, `headers`, `body`); non-proxy uses VTL mapping templates. (2) Invocation Model: Synchronous (`RequestResponse`). (3) Maximum Integration Timeout: API Gateway hard limit of 29 seconds. (4) Maximum Payload Size: 6 MB (for both request and response bodies). (5) Lambda Authorizers (Token and Request-based).",
  "keyPoints": [
    "Builds serverless HTTP/REST APIs where API Gateway handles routing and Lambda executes business logic.",
    "Lambda Proxy Integration passes the complete HTTP request context to the function event parameter.",
    "The function handler must return a valid JSON object containing 'statusCode', 'headers', and 'body'.",
    "Synchronous invocation model with an API Gateway hard integration timeout limit of 29 seconds.",
    "Maximum payload size limit for API Gateway is 6 MB for request and response payloads.",
    "Supports Lambda Authorizers (Token-based and Request-based) to validate JWT tokens and authorize API calls."
  ],
  "commonMistake": "Returning a raw string or plain JavaScript object from a Lambda proxy integration handler instead of the required schema format `{ statusCode: 200, headers: {}, body: JSON.stringify(...) }`. Failing to return this exact structure causes API Gateway to return an HTTP 502 Bad Gateway error.",
  "example": "Structure a Node.js Lambda response for API Gateway proxy integration: exports.handler = async (event) => { return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ message: 'Success' }) }; };.",
  "sources": [
    {
      "title": "Using AWS Lambda with Amazon API Gateway",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html"
    },
    {
      "title": "Setting up Lambda Proxy Integrations in API Gateway",
      "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api-integrations.html"
    }
  ]
});
