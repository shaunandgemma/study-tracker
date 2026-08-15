import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-15",
  "title": "Service Integrations",
  "plainEnglish": "AWS Step Functions Service Integrations enable state machines to directly invoke and coordinate actions across over 220 AWS services and more than 10,000 AWS API actions without writing custom middleware or hosting glue code. Step Functions provides two categories of integrations—Optimized Integrations (deep integrations tailored with specialized parameters and status monitoring) and AWS SDK Integrations (which allow calling virtually any AWS API directly using standard SDK action names)—supporting three distinct integration patterns.",
  "whyItMatters": "Traditionally, connecting multiple cloud services (such as starting an ECS container, querying DynamoDB, and publishing an SNS message) required writing and maintaining multiple AWS Lambda functions just to make SDK API calls. Native Service Integrations eliminate intermediate Lambda functions completely, reducing execution latency, compute costs, and code maintenance.",
  "workplaceExample": "A data engineering pipeline coordinates ETL processing without any custom glue code: (1) An AWS SDK task calls `s3:CopyObject` to move raw files, (2) An Optimized integration starts an AWS Glue crawler job with `.sync` and waits for completion, (3) An AWS SDK task executes an Amazon Athena query, and (4) An Amazon SNS task publishes the completion metrics to the data team's Slack channel.",
  "examFocus": "Understand the three Step Functions integration patterns: (1) Request-Response (Default): Step Functions calls an API and immediately moves to the next state once HTTP 200 is returned. (2) Run a Job (`.sync`): Step Functions starts a long-running asynchronous task (Batch, ECS, Glue, CodeBuild, SageMaker) and polls/waits until the job finishes before advancing. (3) Wait for Callback (`.waitForTaskToken`): Step Functions passes a generated Task Token to an integrated service (SQS, SNS, EventBridge, Lambda) and pauses the workflow until an external application submits the token with `SendTaskSuccess`.",
  "keyPoints": [
    "Connects directly to over 220 AWS services and 10,000+ API actions from state machines.",
    "Eliminates intermediate 'glue' AWS Lambda functions to reduce latency and infrastructure cost.",
    "Three integration patterns: Request-Response, Run a Job (`.sync`), and Wait for Callback.",
    "Run a Job (`.sync`) pauses the state machine and monitors job completion automatically.",
    "Wait for Callback (`.waitForTaskToken`) allows external processes or humans to resume workflows.",
    "Supports both deep Optimized Integrations and flexible generic AWS SDK Integrations."
  ],
  "commonMistake": "Writing an AWS Lambda function whose sole purpose is to call `dynamodb.put_item()` or `sqs.send_message()`. Step Functions supports direct DynamoDB and SQS integrations in Task states with zero Lambda code required.",
  "example": "Insert an item directly into Amazon DynamoDB using an optimized Task integration in Amazon States Language: {\"Type\": \"Task\", \"Resource\": \"arn:aws:states:::dynamodb:putItem\", \"Parameters\": {\"TableName\": \"OrdersTable\", \"Item\": {\"OrderId\": {\"S.$\": \"$.orderId\"}, \"Total\": {\"N.$\": \"$.total\"}}}, \"End\": true}.",
  "sources": [
    {
      "title": "AWS Service Integrations in Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-service-integrations.html"
    },
    {
      "title": "Supported AWS Services for Step Functions Integration",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html"
    }
  ]
});
