import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-7",
  "title": "Task States",
  "plainEnglish": "A Task State (`\"Type\": \"Task\"`) is the primary workhorse state in an AWS Step Functions state machine that performs actual work by calling external AWS services, serverless functions, or custom applications. A Task state specifies a `Resource` field pointing to an integrated service ARN (such as an AWS Lambda function, Amazon DynamoDB action, Amazon ECS task, AWS Batch job, or Amazon SNS topic) and executes that action using one of three integration patterns: Request-Response, Run a Job (`.sync`), or Wait for Callback (`.waitForTaskToken`).",
  "whyItMatters": "Without Task states, a state machine would only be able to evaluate logic and branch without altering external systems. Task states provide native, SDK-level integrations with over 220 AWS services and over 10,000 API actions, allowing you to orchestrate cloud databases, machine learning models, and compute containers directly without writing custom intermediary glue code.",
  "workplaceExample": "A media transcode pipeline uses three sequential Task states: (1) Task 1 invokes an AWS Lambda function to extract audio metadata, (2) Task 2 submits an AWS Batch job with `.sync` (`arn:aws:states:::batch:submitJob.sync`) and pauses the workflow until the transcoding container completes successfully on Fargate, and (3) Task 3 writes the transcoded S3 video URL directly into an Amazon DynamoDB table (`arn:aws:states:::dynamodb:putItem`).",
  "examFocus": "Understand Task State integration patterns and service targets: (1) Request-Response (Default): Invokes a service and immediately proceeds to the next state as soon as HTTP response returns (e.g., standard Lambda invocation). (2) Run a Job (`.sync`): Step Functions starts an asynchronous job (Batch, ECS, Glue, CodeBuild) and polls/waits for the job to reach `SUCCEEDED` before advancing. (3) Wait for Callback (`.waitForTaskToken`): Step Functions passes a unique task token to the target service and pauses the workflow until an external process calls `SendTaskSuccess` or `SendTaskFailure` with that token. (4) Direct SDK Integrations: Call almost any AWS API directly using `arn:aws:states:::aws-sdk:service:apiAction`.",
  "keyPoints": [
    "The primary state type used to execute computational work and invoke external services.",
    "Specified by `\"Type\": \"Task\"` with a `Resource` field identifying the target service or ARN.",
    "Three service integration patterns: Request-Response, Run a Job (`.sync`), and Wait for Callback.",
    "Supports direct AWS SDK integrations with over 220 AWS services without writing Lambda code.",
    "Features built-in `TimeoutSeconds` and `HeartbeatSeconds` to detect hung or stalled worker processes.",
    "Integrates with `Retry` and `Catch` blocks to handle service throttling and application errors gracefully."
  ],
  "commonMistake": "Writing a custom Lambda function solely to insert an item into DynamoDB or publish a message to SQS from Step Functions. Step Functions supports direct, optimized SDK service integrations natively in Task states without provisioning or paying for a Lambda function.",
  "example": "Define a Task state that submits an AWS Batch job and waits synchronously for completion using `.sync`: {\"Type\": \"Task\", \"Resource\": \"arn:aws:states:::batch:submitJob.sync\", \"Parameters\": {\"JobName\": \"TranscodeVideoJob\", \"JobQueue\": \"arn:aws:batch:us-east-1:123456789012:job-queue/HighPriority\", \"JobDefinition\": \"arn:aws:batch:us-east-1:123456789012:job-definition/Transcoder:1\"}, \"Next\": \"NotifySuccess\"}.",
  "sources": [
    {
      "title": "Task States in AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-task-state.html"
    },
    {
      "title": "AWS Service Integrations in Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-service-integrations.html"
    }
  ]
});
