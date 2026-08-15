import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-23",
  "title": "Lambda Synchronous Invocation",
  "plainEnglish": "In Synchronous Invocation (using the `RequestResponse` invocation type), the calling client or service invokes a Lambda function and holds the network connection open, waiting for the function to complete execution and return a response payload or error. If the function succeeds, Lambda returns the handler's output with an HTTP 200 status; if the function fails or times out, the error details are returned directly to the caller.",
  "whyItMatters": "Synchronous invocation is the foundation of interactive web APIs, real-time microservices, and user-facing mobile backends where the end user or client application cannot proceed until the computation finishes and returns an immediate response.",
  "workplaceExample": "A mobile banking app requests an account balance. The request hits Amazon API Gateway, which synchronously invokes a balance-lookup Lambda function. The function queries DynamoDB and returns a JSON payload containing the balance. API Gateway forwards the HTTP 200 response back to the mobile app within 80 milliseconds.",
  "examFocus": "Understand synchronous invocation characteristics and error handling: (1) InvocationType parameter is `RequestResponse`. (2) Services that invoke Lambda synchronously include: Amazon API Gateway, Application Load Balancer, Amazon Cognito, Amazon Lex, AWS CLI (default), and AWS SDKs. (3) Error Handling: AWS Lambda does NOT perform automatic retries for synchronous invocations; the calling client is responsible for retrying on errors (HTTP 429 throttling or 500/502 runtime errors).",
  "keyPoints": [
    "The client invokes the function and waits for execution completion and the return payload (RequestResponse).",
    "Direct services include Amazon API Gateway, Application Load Balancer (ALB), Amazon Cognito, and Amazon Lex.",
    "The response contains function output, logs summary, and execution status codes.",
    "AWS Lambda does not retry failed synchronous requests automatically; retry logic must be handled on the client side.",
    "Synchronous invocations are subject to client connection timeouts (e.g., API Gateway 29-second limit).",
    "Throttling returns an HTTP 429 (TooManyRequestsException) error directly to the caller."
  ],
  "commonMistake": "Expecting AWS Lambda to automatically retry failed synchronous API requests. In synchronous invocations, any retry logic, exponential backoff, or error fallback must be implemented in the calling client application or API Gateway.",
  "example": "Invoke a Lambda function synchronously using the AWS CLI: aws lambda invoke --function-name calculate-tax --invocation-type RequestResponse --payload '{\"amount\": 100}' response.json.",
  "sources": [
    {
      "title": "Synchronous Invocation in AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-sync.html"
    },
    {
      "title": "Invoking Lambda Functions Programmatically",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html"
    }
  ]
});
