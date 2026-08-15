import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-24",
  "title": "Lambda Asynchronous Invocation",
  "plainEnglish": "In Asynchronous Invocation (using the `Event` invocation type), the calling service pushes an event to AWS Lambda's internal managed event queue and immediately receives an HTTP 202 Accepted response confirming that the event was received. Lambda then reads events from this internal queue, executes the function in the background, and manages automatic retries and failure routing without keeping the caller waiting.",
  "whyItMatters": "Asynchronous invocation completely decouples event producers from compute processing. When events arrive in high-volume bursts, the internal queue buffers incoming events and executes functions at a controlled pace, preventing upstream services from timing out or suffering cascading failures.",
  "workplaceExample": "An image-sharing website uploads user profile photos to Amazon S3. S3 invokes a thumbnail Lambda function asynchronously. S3 immediately receives an HTTP 202 status and finishes the client upload. Lambda retrieves the event from its internal queue, generates three thumbnail sizes in the background, and writes successful execution metadata to an Amazon SQS on-success destination.",
  "examFocus": "Understand asynchronous invocation lifecycle and error handling: (1) Services invoking Lambda asynchronously: Amazon S3, Amazon SNS, Amazon EventBridge, AWS CloudTrail, Amazon SES. (2) Automatic Retries: Lambda retries failed executions up to 2 times (3 total attempts) with exponential backoff and jitter. (3) Retention: Events sit in Lambda's internal queue for up to 6 hours (configurable via Maximum Event Age). (4) Destinations: Configure on-failure and on-success destinations (SQS, SNS, EventBridge, Lambda) or legacy DLQs.",
  "keyPoints": [
    "The caller receives an immediate HTTP 202 Accepted response; Lambda processes the event in the background.",
    "Common asynchronous event sources include Amazon S3, Amazon SNS, Amazon EventBridge, and CloudWatch Alarms.",
    "Events are buffered in a managed internal queue that scales to absorb sudden traffic bursts.",
    "Automatically retries failed executions up to 2 times (3 total attempts) with randomized exponential backoff.",
    "Supports configurable Event Age (from 60 seconds to 6 hours) and Retry Attempts (from 0 to 2).",
    "Supports Asynchronous Destinations (On-Success and On-Failure) to route event records to SQS, SNS, EventBridge, or another Lambda function."
  ],
  "commonMistake": "Failing to design asynchronous Lambda functions to be idempotent. Because network hiccups or retries can cause Lambda to re-execute an event, the function must be able to handle duplicate events safely without corrupting data.",
  "example": "Invoke a function asynchronously using the AWS CLI: aws lambda invoke --function-name process-receipt --invocation-type Event --payload '{\"receipt_id\": \"rcpt-1029\"}' response.json, which returns a StatusCode of 202 immediately.",
  "sources": [
    {
      "title": "Asynchronous Invocation in AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html"
    },
    {
      "title": "Configuring Destinations for Asynchronous Invocation",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-destinations.html"
    }
  ]
});
