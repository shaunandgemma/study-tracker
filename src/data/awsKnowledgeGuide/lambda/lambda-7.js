import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-7",
  "title": "Lambda Event-Driven Compute",
  "plainEnglish": "Event-driven compute with AWS Lambda is an architectural paradigm where code executes automatically in response to state changes and events emitted by other AWS services, custom applications, or third-party SaaS systems. Instead of running continuous server loops polling for work, Lambda functions remain idle (costing $0) until an event arrives, execute their business logic, and immediately terminate.",
  "whyItMatters": "Event-driven architectures decouple software components, improve resilience, and eliminate idle server waste. When an event occurs (such as an S3 file upload, a DynamoDB row insertion, or an EventBridge rule trigger), AWS Lambda instantiates isolated compute environments on the fly to process only the active workload.",
  "workplaceExample": "An automated invoice generation system listens for 'OrderPlaced' events published to Amazon EventBridge. When a customer completes a purchase, EventBridge routes the event to a Lambda function. The function generates a PDF invoice, stores it in an S3 bucket, sends an email notification via Amazon SES, and shuts down within 1.2 seconds.",
  "examFocus": "Know the major AWS event sources that trigger Lambda: (1) Asynchronous event sources: Amazon S3, Amazon SNS, Amazon EventBridge. (2) Synchronous event sources: Amazon API Gateway, Application Load Balancer, Amazon Cognito. (3) Poll-based/Event Source Mapping sources: Amazon SQS, Amazon Kinesis, Amazon DynamoDB Streams, Amazon MSK.",
  "keyPoints": [
    "Lambda acts as the core compute engine for event-driven architectures across the AWS ecosystem.",
    "Integrated with over 200 AWS services and SaaS applications as native event producers.",
    "Functions scale automatically in direct proportion to the volume of incoming events.",
    "Eliminates polling overhead and idle server costs; you pay strictly for the duration of event processing.",
    "Supports event filtering at the trigger level (e.g., SQS/Kinesis/DynamoDB event filtering), reducing unnecessary function invocations.",
    "Promotes decoupled, modular microservice designs with clear boundaries and independent scaling."
  ],
  "commonMistake": "Building monolithic Lambda functions that try to handle dozens of unrelated event types inside a single large handler script. Best practice is to design small, focused, single-purpose Lambda functions tailored to specific event schemas.",
  "example": "Configure an Amazon S3 bucket notification to trigger a Lambda function on object creation: aws s3api put-bucket-notification-configuration --bucket customer-uploads --notification-configuration file://s3-trigger-config.json.",
  "sources": [
    {
      "title": "Using AWS Lambda with Other Services",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html"
    },
    {
      "title": "Core Components of Event-Driven Architectures with Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/intro-core-components.html"
    }
  ]
});
