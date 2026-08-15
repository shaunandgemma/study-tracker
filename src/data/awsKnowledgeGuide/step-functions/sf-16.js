import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-16",
  "title": "Lambda Integration",
  "plainEnglish": "AWS Lambda Integration in AWS Step Functions is the native capability that allows state machines to invoke AWS Lambda serverless functions directly from Task states. By referencing a Lambda function ARN in the Task state's `Resource` field, Step Functions passes state input JSON to the Lambda handler, waits synchronously for the function to execute and return its response payload, and passes that output data to downstream states in the workflow.",
  "whyItMatters": "While AWS Lambda executes individual units of business logic with high performance and low cost, choreographing multiple Lambda functions using nested callbacks or direct function-to-function invocations results in tightly coupled, brittle spaghetti code. Step Functions provides a clean, stateful orchestration layer that decouples individual Lambda functions, manages retries, and coordinates execution flow.",
  "workplaceExample": "A photo-sharing service processes user image uploads. A Step Functions state machine coordinates three independent Lambda functions: (1) Lambda 1 inspects image metadata and validates file dimensions, (2) Lambda 2 generates multi-resolution thumbnails and saves them to S3, and (3) Lambda 3 calls Amazon Rekognition to detect unsafe content and extracts image labels, updating the DynamoDB media catalog in under 2 seconds.",
  "examFocus": "Understand Step Functions Lambda integration patterns and error handling: (1) Invocation Formats: Can specify the direct function ARN (`arn:aws:lambda:...:function:MyFunc`) or use the optimized integration (`arn:aws:states:::lambda:invoke`). (2) Payload Manipulation: Use the `Payload` parameter to shape the exact JSON object passed into the Lambda `event` parameter. (3) Lambda Specific Errors: Handle common Lambda exceptions using `Retry` and `Catch` blocks for `Lambda.ServiceException`, `Lambda.AWSLambdaException`, `Lambda.SdkClientException`, and `Lambda.TooManyRequestsException`.",
  "keyPoints": [
    "Invokes serverless AWS Lambda functions directly from state machine Task states.",
    "Decouples individual microservices and avoids brittle function-to-function chaining.",
    "Passes JSON input into the Lambda function `event` parameter and captures return values.",
    "Supports payload transformation using `Parameters`, `InputPath`, and `ResultSelector`.",
    "Handles Lambda concurrency and throttling errors using declarative `Retry` policies.",
    "Requires the Step Functions execution role to have `lambda:InvokeFunction` permissions."
  ],
  "commonMistake": "Chaining Lambda functions together by having Lambda Function A invoke Lambda Function B directly via the AWS SDK. Function chaining creates tight coupling, increases billing (Function A pays for idle compute while waiting for Function B), and makes error recovery difficult; use Step Functions to orchestrate multiple Lambdas.",
  "example": "Define a Task state invoking an AWS Lambda function with custom parameters in Amazon States Language: {\"Type\": \"Task\", \"Resource\": \"arn:aws:states:::lambda:invoke\", \"Parameters\": {\"FunctionName\": \"arn:aws:lambda:us-east-1:123456789012:function:GenerateThumbnail:$LATEST\", \"Payload\": {\"sourceBucket.$\": \"$.bucket\", \"imageKey.$\": \"$.key\"}}, \"ResultSelector\": {\"thumbnailUrl.$\": \"$.Payload.url\"}, \"Next\": \"UpdateDatabase\"}.",
  "sources": [
    {
      "title": "Invoking AWS Lambda Functions from AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html"
    },
    {
      "title": "Task State Syntax and Lambda Integration in Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-task-state.html"
    }
  ]
});
